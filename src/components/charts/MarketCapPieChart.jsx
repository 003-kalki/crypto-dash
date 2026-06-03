import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import api from "../../services/api";

ChartJS.register(ArcElement, Legend, Tooltip);

const chartColors = [
  "#34d399",
  "#60a5fa",
  "#f472b6",
  "#fbbf24",
  "#a78bfa",
  "#fb7185",
];

const formatCurrency = (value, currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);

const MarketCapPieChart = ({ currency = "USD" }) => {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMarketCaps = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/crypto/markets", {
          params: {
            currency,
            perPage: 6,
          },
        });

        setCoins(response.data.coins);
      } catch (marketCapError) {
        console.error("Unable to load market cap chart", marketCapError);
        setError("Unable to load market cap data");
      } finally {
        setIsLoading(false);
      }
    };

    loadMarketCaps();
  }, [currency]);

  const chartData = useMemo(
    () => ({
      labels: coins.map((coin) => coin.name),
      datasets: [
        {
          data: coins.map((coin) => coin.market_cap),
          backgroundColor: chartColors,
          borderColor: "#18181b",
          borderWidth: 3,
        },
      ],
    }),
    [coins]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#d4d4d8",
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            return `${context.label}: ${formatCurrency(value, currency)}`;
          },
        },
      },
    },
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Market Cap Share</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Top crypto assets by market capitalization.
          </p>
        </div>
      </div>

      <div className="mt-6 h-72">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Loading market cap...
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-sm text-rose-300">
            {error}
          </div>
        ) : (
          <Doughnut data={chartData} options={chartOptions} />
        )}
      </div>
    </section>
  );
};

export default MarketCapPieChart;
