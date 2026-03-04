// ⁡⁢⁣⁢𝘄𝗵𝘆 𝗿𝗲𝘀𝘁𝗼𝗿𝗲 𝘁𝗼𝗸𝗲𝗻? ⁡⁢⁢⁢⁡⁣⁢⁣𝗪𝗵𝗲𝗻 𝘁𝗵𝗲 𝗮𝗽𝗽 𝗶𝘀 𝗹𝗮𝘂𝗻𝗰𝗵𝗲𝗱, 𝘄𝗲 𝘄𝗮𝗻𝘁 𝘁𝗼 𝗰𝗵𝗲𝗰𝗸 𝗶𝗳 𝘁𝗵𝗲𝗿𝗲'𝘀 𝗮 𝘃𝗮𝗹𝗶𝗱 𝘁𝗼𝗸𝗲𝗻 𝘀𝘁𝗼𝗿𝗲𝗱 𝗶𝗻 𝗔𝘀𝘆𝗻𝗰𝗦𝘁𝗼𝗿𝗮𝗴𝗲 𝘁𝗼 𝗮𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗰𝗮𝗹𝗹𝘆 𝗹𝗼𝗴 𝘁𝗵𝗲 𝘂𝘀𝗲𝗿 𝗶𝗻 𝘄𝗶𝘁𝗵𝗼𝘂𝘁 𝗿𝗲𝗾𝘂𝗶𝗿𝗶𝗻𝗴 𝘁𝗵𝗲𝗺 𝘁𝗼 𝗲𝗻𝘁𝗲𝗿 𝘁𝗵𝗲𝗶𝗿 𝗰𝗿𝗲𝗱𝗲𝗻𝘁𝗶𝗮𝗹𝘀 𝗮𝗴𝗮𝗶𝗻, 𝘁𝗵𝗶𝘀 𝘁𝗵𝘂𝗻𝗸 𝘄𝗶𝗹𝗹 𝗵𝗮𝗻𝗱𝗹𝗲 𝘁𝗵𝗮𝘁 𝗹𝗼𝗴𝗶𝗰 𝗯𝘆 𝗮𝘁𝘁𝗲𝗺𝗽𝘁𝗶𝗻𝗴 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝘁𝗵𝗲 𝘁𝗼𝗸𝗲𝗻, 𝘃𝗮𝗹𝗶𝗱𝗮𝘁𝗶𝗻𝗴 𝗶𝘁, 𝗮𝗻𝗱 𝗶𝗳 𝗶𝘁'𝘀 𝘃𝗮𝗹𝗶𝗱, 𝗿𝗲𝘀𝘁𝗼𝗿𝗶𝗻𝗴 𝘁𝗵𝗲 𝘂𝘀𝗲𝗿'𝘀 𝗮𝘂𝘁𝗵𝗲𝗻𝘁𝗶𝗰𝗮𝘁𝗲𝗱 𝘀𝘁𝗮𝘁𝗲 𝗶𝗻 𝘁𝗵𝗲 𝗮𝗽𝗽. 𝗜𝗳 𝘁𝗵𝗲 𝘁𝗼𝗸𝗲𝗻 𝗶𝘀 𝗺𝗶𝘀𝘀𝗶𝗻𝗴 𝗼𝗿 𝗶𝗻𝘃𝗮𝗹𝗶𝗱 (𝗲.𝗴., 𝗲𝘅𝗽𝗶𝗿𝗲𝗱), 𝗶𝘁 𝘄𝗶𝗹𝗹 𝗿𝗲𝗷𝗲𝗰𝘁 𝘄𝗶𝘁𝗵 𝗮𝗻 𝗮𝗽𝗽𝗿𝗼𝗽𝗿𝗶𝗮𝘁𝗲 𝗲𝗿𝗿𝗼𝗿 𝗺𝗲𝘀𝘀𝗮𝗴𝗲, 𝗮𝗹𝗹𝗼𝘄𝗶𝗻𝗴 𝘁𝗵𝗲 𝗮𝗽𝗽 𝘁𝗼 𝗵𝗮𝗻𝗱𝗹𝗲 𝘁𝗵𝗮𝘁 𝘀𝗰𝗲𝗻𝗮𝗿𝗶𝗼 (𝗲.𝗴., 𝗯𝘆 𝘀𝗵𝗼𝘄𝗶𝗻𝗴 𝗮 𝗹𝗼𝗴𝗶𝗻 𝘀𝗰𝗿𝗲𝗲𝗻).⁡

import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isTokenValid, decodeToken } from "../formated/jwtUtils.js";

export const restoreToken = createAsyncThunk( // Action type
  "auth/restoreToken", // Action creator
  async (_, { rejectWithValue }) => {  
    // Async function to restore token from AsyncStorage, _ means no argument is expected when dispatching this thunk, rejectWithValue is used to handle errors in a standardized way, it allows us to return a custom error message that can be accessed in the rejected case of the reducer, defaults to null if not provided.
    try {
      const token = await AsyncStorage.getItem("userToken"); // Attempt to retrieve the token from AsyncStorage, this is an asynchronous operation that returns a promise, we await it to get the actual token value, if the token does not exist, it will return null.
      
      if (!token) {
        return rejectWithValue("No token found"); // If no token is found, we reject the thunk with a custom error message, this will trigger the rejected case in the reducer where we can handle this specific error scenario.
      }

      // Validate token expiry
      if (!isTokenValid(token)) {
        // Token expired, clear it
        await AsyncStorage.removeItem("userToken");
        return rejectWithValue("Token expired");
      }

      // Token is valid, decode it to get user data
      const payload = decodeToken(token);
      
      return { // If the token is valid, we return an object containing the token and the user data extracted from the token's payload, this will trigger the fulfilled case in the reducer where we can update the state with the restored token and user information.
        token,
        user: {
          id: payload.userId,
          email: payload.email,
          name: payload.name,
        },
      };
    } catch (error) {
      return rejectWithValue("Failed to restore token");
    }
  }
);
