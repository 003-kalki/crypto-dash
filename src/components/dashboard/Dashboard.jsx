import Sidebar from "../layout/Sidebar";
import CoinSearchBar from "../crypto/CoinSearchBar";
import BaseCurrencySelector from "../currency/BaseCurrencySelector";
import ExchangeCoins from "../currency/ExchangeCoins";
import MarketChartSection from "../charts/MarketChartSection";
import Portfolio from "../portfolio/Portfolio";
import WatchlistPanel from "../crypto/WatchlistPanel";


const Dashboard = ({
  user,
  preferences,
  watchlist,
  watchlistMarkets,
  onBaseCurrencyChange,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <main className="flex-1 px-6 py-8">
        <section className="mx-auto max-w-7xl">
          {user && (
  <p className="mb-4 text-sm text-zinc-300">
    Welcome, <span className="font-semibold text-white">{user.name}</span>
  </p>
)}
          <div className="mb-6 flex items-center gap-3">
            <BaseCurrencySelector
            value={preferences?.baseCurrency || "USD"}
            onChange={onBaseCurrencyChange}
                 />
            <CoinSearchBar onAddToWatchlist={onAddToWatchlist} />
            
          </div>
          <MarketChartSection/>
          <WatchlistPanel
            watchlist={watchlist}
            markets={watchlistMarkets}
            currency={preferences?.baseCurrency || "USD"}
            onRemoveFromWatchlist={onRemoveFromWatchlist}
          />
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <Portfolio />
            <ExchangeCoins />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
            Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Crypto Market Overview
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            This is the dashboard container. Add layout, currency, crypto,
            chart, search, and filter components here as you build them.
          </p>
        </section>
      </main>

      <Sidebar />
    </div>
  );
};

export default Dashboard;
