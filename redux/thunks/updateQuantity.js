import { createAsyncThunk } from "@reduxjs/toolkit";
// import { getUserId } from "../formated/getUserId.js";

const getUserId = (state) => state.auth.userData?.id || null;


export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = getUserId(state);
    if (!userId) {
      return rejectWithValue("Please login to update the cart");
    }

    if (Number(quantity) < 1) {
      return rejectWithValue("Quantity must be at least 1");
    }

    const currentCart = state.cart.cartsByUser[userId] || [];
    const updatedCart = currentCart.map((item) =>
      item.id === itemId ? { ...item, quantity: Number(quantity) } : item
    );

    return { userId, cart: updatedCart };
  }
);