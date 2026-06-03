import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchPreferences = createAsyncThunk(
  "preferences/fetchPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/preferences");
      return response.data.preferences;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch preferences"
      );
    }
  }
);

export const updatePreferences = createAsyncThunk(
  "preferences/updatePreferences",
  async (updates, { rejectWithValue }) => {
    try {
      const response = await api.put("/preferences", updates);
      return response.data.preferences;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update preferences"
      );
    }
  }
);

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    preferences: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default preferencesSlice.reducer;
