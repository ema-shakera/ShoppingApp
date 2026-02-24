import { createAsyncThunk } from "@reduxjs/toolkit";
// import { getUserId } from "../formated/getUserId.js";

const getUserId = (state) => state.auth.userData?.id || null;


export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState }) => {
    const state = getState();
    const userId = getUserId(state);
    return { userId, cart: [] };
  }
);