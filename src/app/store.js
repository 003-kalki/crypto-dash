import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import portfolioReducer from "../features/portfolio/portfolioSlice";
import preferencesReducer from "../features/preferences/preferencesSlice";
import watchlistReducer from "../features/watchlist/watchlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    watchlist: watchlistReducer,
    portfolio: portfolioReducer,
  },
});
