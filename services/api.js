import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

const getDefaultBaseURL = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (host) {
      return `http://${host}:3001/api`;
    }
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3001/api";
  }

  return "http://localhost:3001/api";
};

const extraConfig = Constants.expoConfig?.extra || {};

export const baseURL =
  process.env.EXPO_PUBLIC_API_URL ||
  extraConfig.apiBaseUrl ||
  getDefaultBaseURL();

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      await AsyncStorage.removeItem("userToken");
      delete api.defaults.headers.common.Authorization;
    }
    return Promise.reject(error);
  }
);

export default api;
