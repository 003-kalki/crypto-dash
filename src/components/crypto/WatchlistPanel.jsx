const formatCurrency = (value, currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value >= 1 ? 2 : 6,
  }).format(value);

const WatchlistPanel = ({
  watchlist,
  markets = [],
  currency,
  onRemoveFromWatchlist,
}) => {
  const coins = watchlist?.coins || [];
  const marketsById = markets.reduce((acc, market) => {
    acc[market.id] = market;
    return acc;
  }, {});

  const renderCoin = (coin) => {
    const market = marketsById[coin.coinId];
    const change = market?.price_change_percentage_24h;
    const isPositive = change >= 0;

    return (
      <div
        key={coin.coinId}
        className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3"
      >
        <div className="flex items-center gap-3">
          {market?.image && (
            <img src={market.image} alt="" className="h-8 w-8 rounded-full" />
          )}
          <div>
            <p className="font-semibold text-white">{coin.name}</p>
            <p className="text-xs font-bold uppercase text-zinc-500">
              {coin.symbol}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-white">
              {market ? formatCurrency(market.current_price, currency) : "Loading"}
            </p>
            {typeof change === "number" && (
              <p
                className={`text-xs font-bold ${
                  isPositive ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {isPositive ? "+" : ""}
                {change.toFixed(2)}%
              </p>
            )}
          </div>

          <button
            onClick={() => onRemoveFromWatchlist(coin.coinId)}
            className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-400/10"
          >
            Remove
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Watchlist</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Track coins saved to your account.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {coins.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-zinc-950 px-4 py-4 text-sm text-zinc-500">
            No coins saved yet.
          </p>
        ) : (
          coins.map(renderCoin)
        )}
      </div>
    </section>
  );
};

export default WatchlistPanel;
