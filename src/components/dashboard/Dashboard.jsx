import Sidebar from "../layout/Sidebar";
import CoinSearchBar from "../crypto/CoinSearchBar";
import BaseCurrencySelector from "../currency/BaseCurrencySelector";
import ExchangeCoins from "../currency/ExchangeCoins";
import MarketChartSection from "../charts/MarketChartSection";
import MarketCapPieChart from "../charts/MarketCapPieChart";
import Portfolio from "../portfolio/Portfolio";
import WatchlistPanel from "../crypto/WatchlistPanel";


const Dashboard = ({
  user,
  preferences,
  watchlist,
  watchlistMarkets,
  portfolio,
  onBaseCurrencyChange,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onRemoveHolding,
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
          <MarketChartSection currency={preferences?.baseCurrency || "USD"} />
          <WatchlistPanel
            watchlist={watchlist}
            markets={watchlistMarkets}
            currency={preferences?.baseCurrency || "USD"}
            onRemoveFromWatchlist={onRemoveFromWatchlist}
          />
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <Portfolio portfolio={portfolio} onRemoveHolding={onRemoveHolding} />
            <MarketCapPieChart currency={preferences?.baseCurrency || "USD"} />
            <ExchangeCoins />
          </div>
          

         
        
        </section>
      </main>

      <Sidebar />
    </div>
  );
};

export default Dashboard;
