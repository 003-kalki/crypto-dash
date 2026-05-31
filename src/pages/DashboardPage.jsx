import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import api from "../services/api";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [watchlist, setWatchlist] = useState(null);
  const [watchlistMarkets, setWatchlistMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const loadWatchlistMarkets = async (coins, baseCurrency = "USD") => {
    try {
      if (!coins || coins.length === 0) {
        setWatchlistMarkets([]);
        return;
      }

      const response = await api.get("/crypto/markets", {
        params: {
          currency: baseCurrency,
          ids: coins.map((coin) => coin.coinId).join(","),
          perPage: coins.length,
        },
      });

      setWatchlistMarkets(response.data.coins);
    } catch (error) {
      console.error("Unable to load watchlist market data", error);
      setWatchlistMarkets([]);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        console.error("Unable to verify current user", error);
        setIsUnauthorized(true);
        setIsLoading(false);
        return;
      }

      try {
        const preferenceResponse = await api.get("/preferences");
        const loadedPreferences = preferenceResponse.data.preferences;
        setPreferences(loadedPreferences);

        const watchlistResponse = await api.get("/watchlist");
        const loadedWatchlist = watchlistResponse.data.watchlist;
        setWatchlist(loadedWatchlist);
        await loadWatchlistMarkets(
          loadedWatchlist.coins,
          loadedPreferences.baseCurrency
        );
      } catch (error) {
        console.error("Unable to load dashboard preferences/watchlist", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleBaseCurrencyChange = async (baseCurrency) => {
    const response = await api.put("/preferences", {
      baseCurrency,
    });

    const updatedPreferences = response.data.preferences;
    setPreferences(updatedPreferences);
    await loadWatchlistMarkets(watchlist?.coins || [], updatedPreferences.baseCurrency);
  };

  const handleAddToWatchlist = async (coin) => {
    const response = await api.post("/watchlist", coin);

    const updatedWatchlist = response.data.watchlist;
    setWatchlist(updatedWatchlist);
    await loadWatchlistMarkets(
      updatedWatchlist.coins,
      preferences?.baseCurrency || "USD"
    );
  };

  const handleRemoveFromWatchlist = async (coinId) => {
    const response = await api.delete(`/watchlist/${coinId}`);

    const updatedWatchlist = response.data.watchlist;
    setWatchlist(updatedWatchlist);
    await loadWatchlistMarkets(
      updatedWatchlist.coins,
      preferences?.baseCurrency || "USD"
    );
  };

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
      onBaseCurrencyChange={handleBaseCurrencyChange}
      onAddToWatchlist={handleAddToWatchlist}
      onRemoveFromWatchlist={handleRemoveFromWatchlist}
    />
  );
};

export default DashboardPage;
