import { createAsyncThunk } from "@reduxjs/toolkit";
// import { getUserId } from "../formated/getUserId.js";

const getUserId = (state) => state.auth.userData?.id || null;


export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = getUserId(state);
    if (!userId) {
      return rejectWithValue("Please login to update the cart");
    }

    const currentCart = state.cart.cartsByUser[userId] || [];
    const updatedCart = currentCart.filter((item) => item.id !== itemId);
    return { userId, cart: updatedCart };
  }
);