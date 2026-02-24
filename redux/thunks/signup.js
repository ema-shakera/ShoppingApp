import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeEmail } from "../../formated";

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { getState, rejectWithValue }) => {
    const state = getState();
    const normalizedEmail = normalizeEmail(email);

    const existingUser = state.auth.users.find(
      (u) => u.email === normalizedEmail
    );

    if (existingUser) {
      return rejectWithValue("User already registered. Please login.");
    }

    if (password.length < 6) {
      return rejectWithValue("Password must be at least 6 characters");
    }

    const user = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    const token = `local-${user.id}`;

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      rawUser: user,
    };
  }
);