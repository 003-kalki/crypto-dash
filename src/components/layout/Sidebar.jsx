const coins = [
  {
    name: "Bitcoin",
    marketCap: "$1.32T",
    percentage: "4.21%",
  },
  {
    name: "Ethereum",
    marketCap: "$410B",
    percentage: "2.89%",
  },
  {
    name: "Tether",
    marketCap: "$110B",
    percentage: "2.58%",
  },
];

const CoinListItem = ({ name, marketCap, percentage }) => {
  return (
    <div className="currencyList flex items-center justify-between rounded-xl bg-zinc-800 p-4">
      <div className="coinNameAndCap">
        <h2 className="font-semibold text-white">{name}</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Market Cap {marketCap}
        </p>
      </div>

      <div className="cap_percentage text-sm font-bold text-emerald-400">
        {percentage}
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <aside className="flex min-h-screen w-72 flex-col border-l border-white/10 bg-zinc-900 px-5 py-6">
      <div className="title">
        <h1 className="text-lg font-bold text-white">
          Cryptocurrency by Market Cap
        </h1>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {coins.map((coin) => (
          <CoinListItem
            key={coin.name}
            name={coin.name}
            marketCap={coin.marketCap}
            percentage={coin.percentage}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;