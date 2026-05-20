import Sidebar from "../layout/Sidebar";
import CoinSearchBar from "../crypto/CoinSearchBar";
import BaseCurrencySelector from "../currency/BaseCurrencySelector";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <main className="flex-1 px-6 py-8">
        <section className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-3">
            <BaseCurrencySelector />
            <CoinSearchBar />
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
