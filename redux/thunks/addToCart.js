import { createAsyncThunk } from "@reduxjs/toolkit";
// import { getUserId } from "../formated/index.js";

const getUserId = (state) => state.auth.userData?.id || null;

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity, size }, { getState, rejectWithValue }) => { // Get the current state to access the auth state and determine which cart to update, and rejectWithValue to handle errors
    const state = getState();
    const userId = getUserId(state);
    if (!userId) {
      return rejectWithValue("Please login to add items to cart");
    }

    const currentCart = state.cart.cartsByUser[userId] || [];
    const productId = product.id;
    const productName = product.name || product.productName;
    const productPrice = parseInt(`${product.price}`.replace(/[₦,]/g, ""), 10); // Remove currency symbols and commas before parsing the price, 10 is the radix for decimal numbers
    const productImage = product.image || product.productImage;

    const existingIndex = currentCart.findIndex(
      (item) => item.productId === productId && item.size === size
    );

    let updatedCart = [...currentCart];
    if (existingIndex !== -1) {
      const existingItem = updatedCart[existingIndex];
      updatedCart[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + Number(quantity),
      };
    } else {
      updatedCart.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        productId,
        productName,
        productPrice: Number(productPrice),
        productImage,
        quantity: Number(quantity),
        size,
      });
    }

    return { userId, cart: updatedCart };
  }
);