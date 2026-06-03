import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetchPortfolio",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/portfolio");
      return response.data.portfolio;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch portfolio"
      );
    }
  }
);

export const removeHolding = createAsyncThunk(
  "portfolio/removeHolding",
  async (holdingId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/portfolio/${holdingId}`);
      return response.data.portfolio;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to remove holding"
      );
    }
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    portfolio: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.portfolio = action.payload;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(removeHolding.fulfilled, (state, action) => {
        state.portfolio = action.payload;
      })
      .addCase(removeHolding.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default portfolioSlice.reducer;
