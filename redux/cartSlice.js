import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  try {
    const response = await api.get("/cart");
    return response.data.cart || [];
  } catch (error) {
    console.log("Fetch cart error:", error);
    return [];
  }
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity, size }, { rejectWithValue }) => {
    try {
      const response = await api.post("/cart/add", {
        productId: product.id,
        productName: product.name,
        productPrice: parseInt(product.price.replace(/[₦,]/g, "")),
        productImage: product.image,
        quantity,
        size,
      });
      return response.data.cart;
    } catch (error) {
      console.log("Add to cart error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.post("/cart/remove", { itemId });
      return response.data.cart;
    } catch (error) {
      console.log("Remove from cart error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post("/cart/update-quantity", {
        itemId,
        quantity,
      });
      return response.data.cart;
    } catch (error) {
      console.log("Update quantity error:", error);
      return rejectWithValue("Failed to update quantity");
    }
  }
);

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  try {
    await api.post("/cart/clear");
    return [];
  } catch (error) {
    console.log("Clear cart error:", error);
    return [];
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
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
        state.cart = action.payload;
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
        state.cart = action.payload;
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
        state.cart = action.payload;
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
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update quantity";
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
