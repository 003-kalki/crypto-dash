import { useEffect, useMemo, useState } from "react";
import heroImage from "../../assets/heroImage.jpg";
import api from "../../services/api";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);

const MarketList = ({ title, coins }) => (
  <div className="snake-border rounded-2xl bg-zinc-900 p-6">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
      {title}
    </h3>

    <div className="mt-4 grid gap-3">
      {coins.length === 0 ? (
        <p className="text-sm text-zinc-500">Loading market data...</p>
      ) : (
        coins.map((coin) => {
          const change = coin.price_change_percentage_24h || 0;
          const isPositive = change >= 0;

          return (
            <div
              key={coin.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950 px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={coin.image}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    {coin.name}
                  </p>
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    {coin.symbol}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-white">
                  {formatCurrency(coin.current_price)}
                </p>
                <p
                  className={`text-xs font-bold ${
                    isPositive ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {change.toFixed(2)}%
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);

const HeroSection =  ({ onOpenAuthModal }) => {
  const [marketCoins, setMarketCoins] = useState([]);

  useEffect(() => {
    const loadMarketHighlights = async () => {
      try {
        const response = await api.get("/crypto/markets", {
          params: {
            currency: "USD",
            perPage: 12,
          },
        });

        setMarketCoins(response.data.coins);
      } catch (error) {
        console.error("Unable to load home market data", error);
      }
    };

    loadMarketHighlights();
  }, []);

  const topGainers = useMemo(
    () =>
      [...marketCoins]
        .filter((coin) => typeof coin.price_change_percentage_24h === "number")
        .sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h
        )
        .slice(0, 3),
    [marketCoins]
  );

  const trendingCoins = useMemo(() => marketCoins.slice(0, 3), [marketCoins]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
      {/* Top Hero Area */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Left Text */}
        <div className="leftText">
          <h1 className="text-5xl font-bold">
            Track Cryptocurrency Markets
          </h1>

          <p className="mt-4 text-zinc-400">
            Analyze trends, monitor portfolios, and explore crypto insights.
          </p>
            <button 
             onClick={onOpenAuthModal}
            className="mt-6 px-8 py-2 rounded-md bg-green-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500">
    Get Started
         </button>
          
        </div>

        {/* Right Image */}
        <div className="hero-image-frame rightImg h-[400px] rounded-2xl bg-zinc-800 overflow-hidden">
          <img
            src={heroImage}
            alt="Crypto dashboard preview"
            className="h-full w-full object-cover"
          />
        </div>

      </div>

      {/* Feature Strip */}
      <div className="features grid md:grid-cols-3 gap-6 mt-12">

        <MarketList title="Top Gainers" coins={topGainers} />

        <MarketList title="Trending" coins={trendingCoins} />

<div className="flex flex-col gap-6">

  <div className="snake-border bg-zinc-900 p-6 rounded-2xl">
    <h3 className="text-zinc-400">24h Volume</h3>
    <p className="text-2xl font-bold">$98B</p>
  </div>

  <div className="snake-border bg-zinc-900 p-6 rounded-2xl">
    <h3 className="text-zinc-400">Market Cap</h3>
    <p className="text-2xl font-bold">$2.61T</p>
  </div>

</div>
</div>

      

    </div>
     </div>
  );
};

export default HeroSection;
