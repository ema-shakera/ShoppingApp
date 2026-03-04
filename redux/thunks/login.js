import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeEmail } from "../../formated";
import { generateToken } from "../formated/jwtUtils.js";

export const login = createAsyncThunk(
  "auth/login", 
  async ({ email, password }, { getState, rejectWithValue }) => { 
    // Action type, Action creator, Async function to handle login logic, it takes an object with email and password as input, getState is used to access the current state of the Redux store to find the user and validate credentials, rejectWithValue is used to handle errors in a standardized way, it allows us to return a custom error message that can be accessed in the rejected case of the reducer.


    const state = getState(); 
    // Get the current state to access the auth state and find the user, this allows us to check the provided credentials against the stored users in the auth state.
    const normalizedEmail = normalizeEmail(email);
    const user = state.auth.users.find((u) => u.email === normalizedEmail); // Find the user in the auth state by matching the normalized email, this is where we check if the user exists in our local state and retrieve their information for credential validation.

    if (!user || user.password !== password) {
      return rejectWithValue("Invalid email or password");
    }

    const token = generateToken({ userId: user.id, email: user.email, name: user.name }); // Generate a JWT token for the authenticated user, this token includes the user's ID, email, and name in the payload, and can be used to maintain the user's authenticated state in the app.

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