import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch current user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    isUnauthorized: false,
    error: null,
  },
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.isUnauthorized = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.isUnauthorized = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isUnauthorized = true;
        state.error = action.payload;
      });
  },
});

export const { clearAuthState } = authSlice.actions;

export default authSlice.reducer;