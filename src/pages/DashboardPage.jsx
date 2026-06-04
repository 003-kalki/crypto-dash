import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import { fetchCurrentUser } from "../features/auth/authSlice";
import {
  fetchPreferences,
  updatePreferences,
} from "../features/preferences/preferencesSlice";
import {
  addToWatchlist,
  fetchWatchlist,
  fetchWatchlistMarkets,
  removeFromWatchlist,
} from "../features/watchlist/watchlistSlice";
import {
  addHolding,
  fetchPortfolio,
  removeHolding,
  updateHolding,
} from "../features/portfolio/portfolioSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();

  const { user, isLoading: isAuthLoading, isUnauthorized } = useSelector(
    (state) => state.auth
  );
  const { preferences, isLoading: isPreferencesLoading } = useSelector(
    (state) => state.preferences
  );
  const {
    watchlist,
    markets: watchlistMarkets,
    isLoading: isWatchlistLoading,
  } = useSelector((state) => state.watchlist);
  const {
    portfolio,
    isLoading: isPortfolioLoading,
    error: portfolioError,
  } = useSelector(
    (state) => state.portfolio
  );

  const baseCurrency = preferences?.baseCurrency || "USD";

  useEffect(() => {
    const loadDashboardData = async () => {
      const authResult = await dispatch(fetchCurrentUser());

      if (fetchCurrentUser.rejected.match(authResult)) {
        return;
      }

      const [preferencesResult, watchlistResult] = await Promise.all([
        dispatch(fetchPreferences()),
        dispatch(fetchWatchlist()),
        dispatch(fetchPortfolio()),
      ]);

      if (
        fetchPreferences.fulfilled.match(preferencesResult) &&
        fetchWatchlist.fulfilled.match(watchlistResult)
      ) {
        dispatch(
          fetchWatchlistMarkets({
            coins: watchlistResult.payload.coins,
            baseCurrency: preferencesResult.payload.baseCurrency,
          })
        );
      }
    };

    loadDashboardData();
  }, [dispatch]);

  const handleBaseCurrencyChange = async (baseCurrency) => {
    const result = await dispatch(updatePreferences({ baseCurrency }));

    if (updatePreferences.fulfilled.match(result)) {
      dispatch(
        fetchWatchlistMarkets({
          coins: watchlist?.coins || [],
          baseCurrency: result.payload.baseCurrency,
        })
      );
    }
  };

  const handleAddToWatchlist = async (coin) => {
    const result = await dispatch(addToWatchlist(coin));

    if (addToWatchlist.fulfilled.match(result)) {
      dispatch(
        fetchWatchlistMarkets({
          coins: result.payload.coins,
          baseCurrency,
        })
      );
    }
  };

  const handleRemoveFromWatchlist = async (coinId) => {
    const result = await dispatch(removeFromWatchlist(coinId));

    if (removeFromWatchlist.fulfilled.match(result)) {
      dispatch(
        fetchWatchlistMarkets({
          coins: result.payload.coins,
          baseCurrency,
        })
      );
    }
  };

  const handleAddHolding = (holding) => {
    return dispatch(addHolding(holding)).unwrap();
  };

  const handleUpdateHolding = (holdingId, updates) => {
    return dispatch(updateHolding({ holdingId, updates })).unwrap();
  };

  const handleRemoveHolding = (holdingId) => {
    return dispatch(removeHolding(holdingId)).unwrap();
  };

  const handleExchangeCoins = async ({
    sellHolding,
    buyCoin,
    sellAmount,
    buyAmount,
    buyPrice,
    currency,
  }) => {
    const remainingQuantity = sellHolding.quantity - sellAmount;

    if (remainingQuantity <= 0.00000001) {
      await dispatch(removeHolding(sellHolding._id)).unwrap();
    } else {
      await dispatch(
        updateHolding({
          holdingId: sellHolding._id,
          updates: {
            quantity: remainingQuantity,
            averageBuyPrice: sellHolding.averageBuyPrice,
            currency: sellHolding.currency || currency,
          },
        })
      ).unwrap();
    }

    await dispatch(
      addHolding({
        coinId: buyCoin.coinId,
        symbol: buyCoin.symbol,
        name: buyCoin.name,
        quantity: buyAmount,
        averageBuyPrice: buyPrice,
        currency,
      })
    ).unwrap();
  };

  const isLoading =
    isAuthLoading ||
    isPreferencesLoading ||
    isWatchlistLoading ||
    isPortfolioLoading;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isUnauthorized) {
    return <Navigate to="/" replace />;
  }

  return (
    <Dashboard
      user={user}
      preferences={preferences}
      watchlist={watchlist}
      watchlistMarkets={watchlistMarkets}
      portfolio={portfolio}
      portfolioError={portfolioError}
      onBaseCurrencyChange={handleBaseCurrencyChange}
      onAddToWatchlist={handleAddToWatchlist}
      onRemoveFromWatchlist={handleRemoveFromWatchlist}
      onAddHolding={handleAddHolding}
      onUpdateHolding={handleUpdateHolding}
      onRemoveHolding={handleRemoveHolding}
      onExchangeCoins={handleExchangeCoins}
    />
  );
};

export default DashboardPage;
