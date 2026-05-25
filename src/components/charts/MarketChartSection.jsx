import { useState } from "react";

const timelines = ["1D", "1W", "1M", "6M"];

const cryptocurrencies = ["Bitcoin", "Ethereum", "Tether", "Solana"];

const chartTypes = ["Line", "Bar", "Candlestick"];

const MarketChartSection = () => {
  const [timeline, setTimeline] = useState("1D");
  const [crypto, setCrypto] = useState("Bitcoin");
  const [chartType, setChartType] = useState("Line");
  const [date, setDate] = useState("");

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-900 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {timelines.map((item) => (
            <button
              key={item}
              onClick={() => setTimeline(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                timeline === item
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {item}
            </button>
          ))}

          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={crypto}
            onChange={(event) => setCrypto(event.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
          >
            {cryptocurrencies.map((coin) => (
              <option key={coin} value={coin}>
                {coin}
              </option>
            ))}
          </select>

          <select
            value={chartType}
            onChange={(event) => setChartType(event.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
          >
            {chartTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex h-80 items-center justify-center rounded-xl border border-white/10 bg-zinc-950 text-zinc-500">
        Graph will show here
      </div>
    </section>
  );
};

export default MarketChartSection;