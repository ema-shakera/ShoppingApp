const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3100;
const STORAGE_FILE = path.join(__dirname, 'storage.json');

app.use(cors());
app.use(bodyParser.json());


const loadStorage = () => {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      return { users: [], userCarts: {} };
    }

    const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
    if (!raw.trim()) {
      return { users: [], userCarts: {} };
    }

    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      userCarts: parsed.userCarts && typeof parsed.userCarts === 'object' ? parsed.userCarts : {},
    };
  } catch (error) {
    console.error('Storage load error:', error);
    return { users: [], userCarts: {} };
  }
};

const persistStorage = () => {
  try {
    fs.writeFileSync(
      STORAGE_FILE,
      JSON.stringify({ users, userCarts }, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Storage persist error:', error);
  }
};

const storageData = loadStorage();
let users = storageData.users;
let userCarts = storageData.userCarts;

const getNextUserId = () => {
  if (users.length === 0) {
    return 1;
  }

  return Math.max(...users.map((user) => user.id || 0)) + 1;
};


const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key-will-change-this';

// SIGNUP endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    // Validation
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ message: 'User already registered. Please login.' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: getNextUserId(),
      name,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    persistStorage();

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token (password NOT included)
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    // Validation
    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password - THIS IS THE KEY PART
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token (password NOT included)
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route - Get user profile
app.get('/api/profile', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  });
});

app.get('/api/cart', verifyToken, (req, res) => {
  const cart = userCarts[req.user.id] || [];
  res.json({ cart });
});

app.post('/api/cart/add', verifyToken, (req, res) => {
  const { productId, productName, productPrice, productImage, quantity, size } = req.body;

  if (!productId || !productName || !productPrice || !quantity || !size) {
    return res.status(400).json({ message: 'Missing required cart item fields' });
  }

  const userId = req.user.id;
  if (!userCarts[userId]) {
    userCarts[userId] = [];
  }

  const existingItemIndex = userCarts[userId].findIndex(
    (item) => item.productId === productId && item.size === size
  );

  if (existingItemIndex !== -1) {
    userCarts[userId][existingItemIndex].quantity += Number(quantity);
  } else {
    userCarts[userId].push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId,
      productName,
      productPrice: Number(productPrice),
      productImage,
      quantity: Number(quantity),
      size,
    });
  }

  persistStorage();

  res.json({ message: 'Item added to cart', cart: userCarts[userId] });
});

app.post('/api/cart/remove', verifyToken, (req, res) => {
  const { itemId } = req.body;

  if (!itemId) {
    return res.status(400).json({ message: 'Item id is required' });
  }

  const userId = req.user.id;
  const currentCart = userCarts[userId] || [];
  userCarts[userId] = currentCart.filter((item) => item.id !== itemId);
  persistStorage();

  res.json({ message: 'Item removed', cart: userCarts[userId] });
});

app.post('/api/cart/update-quantity', verifyToken, (req, res) => {
  const { itemId, quantity } = req.body;

  if (!itemId || !quantity) {
    return res.status(400).json({ message: 'Item id and quantity are required' });
  }

  if (Number(quantity) < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  const userId = req.user.id;
  const currentCart = userCarts[userId] || [];
  const itemIndex = currentCart.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  currentCart[itemIndex].quantity = Number(quantity);
  userCarts[userId] = currentCart;
  persistStorage();

  res.json({ message: 'Quantity updated', cart: userCarts[userId] });
});

app.post('/api/cart/clear', verifyToken, (req, res) => {
  userCarts[req.user.id] = [];
  persistStorage();
  res.json({ message: 'Cart cleared', cart: [] });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`\n📋 API endpoints:`);
  console.log(`   POST   http://localhost:${PORT}/api/signup    - Register new user`);
  console.log(`   POST   http://localhost:${PORT}/api/login     - Login user`);
  console.log(`   GET    http://localhost:${PORT}/api/profile   - Get user profile (protected)`);
  console.log(`   GET    http://localhost:${PORT}/api/cart      - Get cart (protected)`);
  console.log(`   POST   http://localhost:${PORT}/api/cart/add  - Add item to cart (protected)`);
  console.log(`   POST   http://localhost:${PORT}/api/cart/remove - Remove item from cart (protected)`);
  console.log(`   POST   http://localhost:${PORT}/api/cart/update-quantity - Update quantity (protected)`);
  console.log(`   POST   http://localhost:${PORT}/api/cart/clear - Clear cart (protected)`);
  console.log(`   GET    http://localhost:${PORT}/api/health    - Health check\n`);
});
