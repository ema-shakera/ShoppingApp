import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const getAuthErrorMessage = (error, fallbackMessage) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ECONNABORTED") {
    return "Server timeout. Please try again.";
  }

  if (!error.response) {
    return "Cannot connect to server. Check API URL and network.";
  }

  return fallbackMessage;
};

export const checkLoginStatus = createAsyncThunk(
  "auth/checkLoginStatus",
  async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const storedUserData = await AsyncStorage.getItem("userData");

      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      } else {
        delete api.defaults.headers.common.Authorization;
      }

      return {
        token: token || null,
        user: storedUserData ? JSON.parse(storedUserData) : null,
      };
    } catch (error) {
      console.log("Error checking login status:", error);
      return { token: null, user: null };
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      return { token, user };
    } catch (error) {
      return rejectWithValue(getAuthErrorMessage(error, "Invalid email or password"));
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/signup", { name, email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      return { token, user };
    } catch (error) {
      return rejectWithValue(getAuthErrorMessage(error, "Signup failed"));
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    delete api.defaults.headers.common.Authorization;
    return true;
  } catch (error) {
    console.log("Logout error:", error);
    return false;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userToken: null,
    userData: null,
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkLoginStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.userToken = action.payload.token;
        state.userData = action.payload.user;
        state.loading = false;
      })
      .addCase(checkLoginStatus.rejected, (state) => {
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userToken = action.payload.token;
        state.userData = action.payload.user;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.userToken = action.payload.token;
        state.userData = action.payload.user;
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userToken = null;
        state.userData = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
