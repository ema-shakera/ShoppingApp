import { createSlice } from "@reduxjs/toolkit";
import { fetchCart, addToCart, removeFromCart, updateQuantity, clearCart } from "../thunks/index.js";


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartsByUser: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (action.payload.userId) {
          state.cartsByUser[action.payload.userId] = action.payload.cart;
        }
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartsByUser[action.payload.userId] = action.payload.cart;
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add item";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartsByUser[action.payload.userId] = action.payload.cart;
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove item";
      })
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.cartsByUser[action.payload.userId] = action.payload.cart;
        state.loading = false;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update quantity";
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        if (action.payload.userId) {
          state.cartsByUser[action.payload.userId] = action.payload.cart;
        }
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
