import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeEmail } from "../../formated";

export const login = createAsyncThunk(
  "auth/login", 
  async ({ email, password }, { getState, rejectWithValue }) => {
    const state = getState();
    const normalizedEmail = normalizeEmail(email);
    const user = state.auth.users.find((u) => u.email === normalizedEmail);

    if (!user || user.password !== password) {
      return rejectWithValue("Invalid email or password");
    }

    const token = `local-${user.id}`;

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
);