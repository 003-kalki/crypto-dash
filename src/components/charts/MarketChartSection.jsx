import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import api from "../../services/api";

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
);

const timelines = [
  {
    label: "1D",
    days: 1,
  },
  {
    label: "1W",
    days: 7,
  },
  {
    label: "1M",
    days: 30,
  },
  {
    label: "6M",
    days: 180,
  },
];

const cryptocurrencies = [
  {
    label: "Bitcoin",
    value: "bitcoin",
  },
  {
    label: "Ethereum",
    value: "ethereum",
  },
  {
    label: "Tether",
    value: "tether",
  },
  {
    label: "Solana",
    value: "solana",
  },
];

const chartTypes = ["Line", "Bar"];

const formatTimeLabel = (timestamp, timeline) => {
  const date = new Date(timestamp);

  if (timeline === "1D") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const MarketChartSection = ({ currency = "USD" }) => {
  const [timeline, setTimeline] = useState("1D");
  const [crypto, setCrypto] = useState("bitcoin");
  const [chartType, setChartType] = useState("Line");
  const [prices, setPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedTimeline = timelines.find((item) => item.label === timeline);
  const selectedCrypto = cryptocurrencies.find((item) => item.value === crypto);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get(`/crypto/${crypto}/history`, {
          params: {
            currency,
            days: selectedTimeline.days,
          },
        });

        setPrices(response.data.prices);
      } catch (chartError) {
        console.error("Unable to load chart data", chartError);
        setError("Unable to load chart data");
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, [crypto, currency, selectedTimeline.days]);

  const chartData = useMemo(
    () => ({
      labels: prices.map((item) => formatTimeLabel(item.timestamp, timeline)),
      datasets: [
        {
          label: `${selectedCrypto.label} price`,
          data: prices.map((item) => item.price),
          borderColor: "#34d399",
          backgroundColor:
            chartType === "Line"
              ? "rgba(52, 211, 153, 0.12)"
              : "rgba(52, 211, 153, 0.55)",
          borderWidth: 2,
          fill: chartType === "Line",
          pointRadius: 0,
          tension: 0.35,
        },
      ],
    }),
    [chartType, prices, selectedCrypto.label, timeline]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255,255,255,0.06)",
        },
        ticks: {
          color: "#a1a1aa",
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: {
          color: "rgba(255,255,255,0.06)",
        },
        ticks: {
          color: "#a1a1aa",
          callback: (value) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency,
              notation: "compact",
            }).format(value),
        },
      },
    },
  };

  const ChartComponent = chartType === "Bar" ? Bar : Line;

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-900 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {timelines.map((item) => (
            <button
              key={item.label}
              onClick={() => setTimeline(item.label)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                timeline === item.label
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={crypto}
            onChange={(event) => setCrypto(event.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
          >
            {cryptocurrencies.map((coin) => (
              <option key={coin.value} value={coin.value}>
                {coin.label}
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

      <div className="mt-6 h-80 rounded-xl border border-white/10 bg-zinc-950 p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Loading chart...
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-sm text-rose-300">
            {error}
          </div>
        ) : (
          <ChartComponent data={chartData} options={chartOptions} />
        )}
      </div>
    </section>
  );
};

export default MarketChartSection;
