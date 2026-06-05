import { useEffect, useState } from "react";
import api from "../../services/api";

const fallbackCoins = [
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
  {
    name: "BNB",
    marketCap: "$96B",
    percentage: "1.94%",
  },
  {
    name: "Solana",
    marketCap: "$83B",
    percentage: "3.12%",
  },
  {
    name: "XRP",
    marketCap: "$68B",
    percentage: "1.76%",
  },
  {
    name: "Dogecoin",
    marketCap: "$24B",
    percentage: "2.33%",
  },
  {
    name: "Cardano",
    marketCap: "$18B",
    percentage: "1.28%",
  },
];

const formatMarketCap = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);

const formatChange = (value) => {
  const numericValue = Number(value) || 0;
  return `${numericValue >= 0 ? "+" : ""}${numericValue.toFixed(2)}%`;
};

const CoinListItem = ({ name, marketCap, percentage }) => {
  const isPositive = !percentage.trim().startsWith("-");

  return (
    <div className="currencyList flex items-center justify-between rounded-xl bg-zinc-800 p-4">
      <div className="coinNameAndCap">
        <h2 className="font-semibold text-white">{name}</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Market Cap {marketCap}
        </p>
      </div>

      <div
        className={`cap_percentage text-sm font-bold ${
          isPositive ? "text-emerald-400" : "text-rose-300"
        }`}
      >
        {percentage}
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [coins, setCoins] = useState(fallbackCoins);

  useEffect(() => {
    const loadMarketCapCoins = async () => {
      try {
        const response = await api.get("/crypto/markets", {
          params: {
            currency: "USD",
            perPage: 10,
          },
        });

        setCoins(
          response.data.coins.map((coin) => ({
            name: coin.name,
            marketCap: formatMarketCap(coin.market_cap),
            percentage: formatChange(coin.price_change_percentage_24h),
          }))
        );
      } catch (error) {
        console.error("Unable to load sidebar market cap coins", error);
      }
    };

    loadMarketCapCoins();
  }, []);

  return (
    <aside className="flex min-h-screen w-72 flex-col border-l border-white/10 bg-zinc-900 px-5 py-6">
      <div className="title">
        <h1 className="text-lg font-bold text-white">
          Cryptocurrency by Market Cap
        </h1>
      </div>

      <div className="mt-6 flex flex-col gap-3 overflow-y-auto pr-1">
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
