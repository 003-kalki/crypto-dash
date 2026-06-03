import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchWatchlist = createAsyncThunk(
  "watchlist/fetchWatchlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/watchlist");
      return response.data.watchlist;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch watchlist"
      );
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  "watchlist/addToWatchlist",
  async (coin, { rejectWithValue }) => {
    try {
      const response = await api.post("/watchlist", coin);
      return response.data.watchlist;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to add coin to watchlist"
      );
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  "watchlist/removeFromWatchlist",
  async (coinId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/watchlist/${coinId}`);
      return response.data.watchlist;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to remove coin from watchlist"
      );
    }
  }
);

export const fetchWatchlistMarkets = createAsyncThunk(
  "watchlist/fetchWatchlistMarkets",
  async ({ coins, baseCurrency = "USD" }, { rejectWithValue }) => {
    try {
      if (!coins || coins.length === 0) {
        return [];
      }

      const response = await api.get("/crypto/markets", {
        params: {
          currency: baseCurrency,
          ids: coins.map((coin) => coin.coinId).join(","),
          perPage: coins.length,
        },
      });

      return response.data.coins;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch watchlist market data"
      );
    }
  }
);

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    watchlist: null,
    markets: [],
    isLoading: false,
    isMarketsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.watchlist = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchWatchlistMarkets.pending, (state) => {
        state.isMarketsLoading = true;
      })
      .addCase(fetchWatchlistMarkets.fulfilled, (state, action) => {
        state.isMarketsLoading = false;
        state.markets = action.payload;
      })
      .addCase(fetchWatchlistMarkets.rejected, (state, action) => {
        state.isMarketsLoading = false;
        state.markets = [];
        state.error = action.payload;
      });
  },
});

export default watchlistSlice.reducer;
