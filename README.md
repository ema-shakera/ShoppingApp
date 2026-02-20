# E-Commerce Shopping App

A React Native e-commerce application built with Expo, featuring a modern UI design based on Figma mockups.

## Features Implemented

### 🏠 Home Screen
- **Header Navigation**: 
  - Hamburger menu icon (opens drawer with profile)
  - Search icon (navigates to search screen)
- **Greeting Section**: Personalized "Hello Fola 👋" greeting
- **Promotional Cards**: Horizontal scrollable cards with "Get Now" buttons that redirect to product detail pages
- **Top Categories**: 
  - Horizontal scrollable category icons
  - "See All" button navigates to full categories screen
- **Product Grid**: 
  - FlatList implementation for efficient product rendering
  - Product cards with images from assets folder
  - Discount badges (50% OFF)
  - Favorite/wishlist heart icons
  - Price display (current and original)
  - Tap to view product details

### 🔍 Search Functionality
- Dedicated search screen with real-time filtering
- Search bar with clear button
- Product results displayed in grid format
- Empty state when no products match

### 📱 Product Detail Screen (Add to Cart Page)
- Full product view with:
  - Large product image
  - Discount badge
  - Product name and pricing
  - Rating and reviews
  - Size selection
  - Quantity selector
  - Product description
  - Add to Cart button with total price calculation

### 📂 Categories Screen
- Grid view of all available categories
- Color-coded category cards with icons
- 12+ categories including Electronics, Fashion, Footwear, etc.

### 👤 Profile (Drawer Menu)
- Accessible via hamburger menu
- Profile information display
- Menu items:
  - My Orders
  - My Wishlist
  - Payment Methods
  - Address Book
  - Settings
  - Help Center
- Logout functionality

## Tech Stack

- **React Native** with Expo
- **React Navigation** (Stack & Drawer)
- **@expo/vector-icons** for icons
- **react-native-gesture-handler** for drawer gestures
- **react-native-reanimated** for smooth animations

## Product Images Used

The app uses product images from the assets folder:
- `Mi-Smart-Band-4-832x558-1573195785-removebg-preview 1.png` - Redmi Note 4
- `6_44mm-blu_889c7c8b-e883-41ab-856c-38c9dd970d12_1200x-removebg-preview 2.png` - Apple Watch Series 6
- `D002-removebg-preview 1.png` - Smart Watch D002
- `0x0-removebg-preview 1.png` - Digital Watch

## Navigation Flow

```
Entry Screen (2s delay)
  → Welcome Screen
    → Login Screen
      → Home Screen (Drawer)
        ├── Search Screen
        ├── Categories Screen
        ├── Product Detail Screen
        └── Profile Screen (via Drawer)
```

## Installation & Running

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

## Key Features by Screen

### HomeScreen.js
- Implements FlatList for products
- Horizontal scroll for promos and categories
- Navigation to all major screens

### ProductDetailScreen.js
- Interactive quantity selector
- Size selection
- Add to cart functionality
- Dynamic total price calculation

### SearchScreen.js
- Real-time search filtering
- Clear search functionality
- Empty state handling

### CategoriesScreen.js
- Grid layout with FlatList
- 2-column display
- Color-coded categories

### ProfileScreen.js
- User profile display
- Menu navigation
- Logout functionality

## Design Implementation

The app closely follows the provided Figma design with:
- ✅ Matching color schemes (Orange #FF6B35, Blue #4A90E2)
- ✅ Proper spacing and padding
- ✅ Product card layouts with discount badges
- ✅ Heart/favorite icons on products
- ✅ Promotional banners with "Get Now" CTAs
- ✅ Category icons in horizontal scroll
- ✅ "See All" navigation for categories
- ✅ Search icon in header
- ✅ Hamburger menu with profile access

## Future Enhancements

- Shopping cart functionality
- Wishlist/favorites management
- User authentication
- Order placement and tracking
- Payment integration
- Product filtering and sorting
- Reviews and ratings system
