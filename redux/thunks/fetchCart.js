import { createAsyncThunk } from "@reduxjs/toolkit";
// import { getUserId } from "../formated/getUserId.js";

const getUserId = (state) => state.auth.userData?.id || null;


export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState }) => { // Get the current state to access the auth state and determine which cart to fetch
    const state = getState(); 
    const userId = getUserId(state); // Get the user ID from the auth state to determine which cart to fetch
    if (!userId) {
      return { userId: null, cart: [] };
    }

    return {
      userId,
      cart: state.cart.cartsByUser[userId] || [], // Return the cart for the user if it exists, otherwise return an empty array
    };
  }
);