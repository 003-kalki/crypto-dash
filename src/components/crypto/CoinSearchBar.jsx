import { useEffect, useState } from "react";
import api from "../../services/api";

const CoinSearchBar = ({ onAddToWatchlist }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError("");
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true);
        setError("");

        const response = await api.get("/crypto/search", {
          params: {
            query,
          },
        });

        setResults(response.data.coins);
      } catch (searchError) {
        console.error("Unable to search coins", searchError);
        setError("Unable to search coins");
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleAddCoin = async (coin) => {
    await onAddToWatchlist({
      coinId: coin.coinId,
      symbol: coin.symbol,
      name: coin.name,
    });

    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full max-w">
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by coin"
        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400"
      />

      {(query.trim().length >= 2 || isSearching || error) && (
        <div className="absolute left-0 right-0 top-14 z-30 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40">
          {isSearching && (
            <p className="px-4 py-3 text-sm text-zinc-500">Searching...</p>
          )}

          {!isSearching && error && (
            <p className="px-4 py-3 text-sm text-rose-300">{error}</p>
          )}

          {!isSearching && !error && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-zinc-500">No coins found</p>
          )}

          {!isSearching &&
            !error &&
            results.map((coin) => (
              <button
                key={coin.coinId}
                onClick={() => handleAddCoin(coin)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
              >
                {coin.thumb && (
                  <img
                    src={coin.thumb}
                    alt=""
                    className="h-6 w-6 rounded-full"
                  />
                )}

                <span className="flex-1">
                  <span className="block text-sm font-semibold text-white">
                    {coin.name}
                  </span>
                  <span className="text-xs font-bold uppercase text-zinc-500">
                    {coin.symbol}
                  </span>
                </span>

                {coin.marketCapRank && (
                  <span className="text-xs font-semibold text-zinc-500">
                    #{coin.marketCapRank}
                  </span>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default CoinSearchBar;
