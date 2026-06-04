import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const defaultCoins = [
  { coinId: "bitcoin", symbol: "btc", name: "Bitcoin" },
  { coinId: "ethereum", symbol: "eth", name: "Ethereum" },
  { coinId: "tether", symbol: "usdt", name: "Tether" },
  { coinId: "dogecoin", symbol: "doge", name: "Dogecoin" },
];

const formatNumber = (value, maximumFractionDigits = 8) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);

const ExchangeCoins = ({ portfolio, currency = "USD", onExchange }) => {
  const holdings = useMemo(() => portfolio?.holdings || [], [portfolio?.holdings]);
  const [sellCoinId, setSellCoinId] = useState("");
  const [buyCoinId, setBuyCoinId] = useState("ethereum");
  const [sellAmount, setSellAmount] = useState("");
  const [markets, setMarkets] = useState({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [isExchanging, setIsExchanging] = useState(false);
  const [message, setMessage] = useState("");
  const [rateError, setRateError] = useState("");
  const [exchangeError, setExchangeError] = useState("");

  const coinOptions = useMemo(() => {
    const coinsById = new Map();

    defaultCoins.forEach((coin) => coinsById.set(coin.coinId, coin));
    holdings.forEach((holding) => {
      coinsById.set(holding.coinId, {
        coinId: holding.coinId,
        symbol: holding.symbol,
        name: holding.name,
      });
    });

    return Array.from(coinsById.values());
  }, [holdings]);

  const sellOptions = coinOptions;
  const selectedSellCoinId = sellCoinId || sellOptions[0]?.coinId || "";
  const sellHolding = holdings.find(
    (holding) => holding.coinId === selectedSellCoinId
  );
  const selectedSellCoin = sellOptions.find(
    (coin) => coin.coinId === selectedSellCoinId
  );
  const buyCoin = coinOptions.find((coin) => coin.coinId === buyCoinId);
  const sellMarket = markets[selectedSellCoinId];
  const buyMarket = markets[buyCoinId];
  const numericSellAmount = Number(sellAmount);
  const estimatedBuyAmount =
    numericSellAmount > 0 && sellMarket?.current_price && buyMarket?.current_price
      ? (numericSellAmount * sellMarket.current_price) / buyMarket.current_price
      : 0;

  useEffect(() => {
    const loadRates = async () => {
      try {
        setIsLoadingRates(true);
        setRateError("");

        const ids = coinOptions.map((coin) => coin.coinId).join(",");

        if (!ids) {
          setMarkets({});
          return;
        }

        const response = await api.get("/crypto/markets", {
          params: {
            currency,
            ids,
            perPage: coinOptions.length,
          },
        });

        setMarkets(
          response.data.coins.reduce((acc, market) => {
            acc[market.id] = market;
            return acc;
          }, {})
        );
      } catch (ratesError) {
        console.error("Unable to load exchange rates", ratesError);
        setRateError("Unable to load exchange rates.");
      } finally {
        setIsLoadingRates(false);
      }
    };

    loadRates();
  }, [coinOptions, currency]);

  const handleExchange = async () => {
    setMessage("");
    setExchangeError("");

    if (!sellHolding || sellHolding.quantity <= 0) {
      setExchangeError("Add this coin to your portfolio before exchanging it.");
      return;
    }

    if (!buyCoin || selectedSellCoinId === buyCoinId) {
      setExchangeError("Choose two different coins.");
      return;
    }

    if (
      Number.isNaN(numericSellAmount) ||
      numericSellAmount <= 0 ||
      numericSellAmount > sellHolding.quantity
    ) {
      setExchangeError("Enter a valid sell amount within your available balance.");
      return;
    }

    if (!sellMarket?.current_price || !buyMarket?.current_price) {
      setExchangeError(rateError || "Live prices are not ready yet.");
      return;
    }

    try {
      setIsExchanging(true);

      await onExchange({
        sellHolding,
        buyCoin,
        sellAmount: numericSellAmount,
        buyAmount: estimatedBuyAmount,
        buyPrice: buyMarket.current_price,
        currency,
      });

      setSellAmount("");
      setMessage(
        `Exchanged ${formatNumber(numericSellAmount)} ${
          sellHolding.symbol
        } for ${formatNumber(estimatedBuyAmount)} ${buyCoin.symbol}.`
      );
    } catch (requestError) {
      console.error("Unable to exchange coins", requestError);
      setExchangeError(
        typeof requestError === "string"
          ? requestError
          : "Unable to complete exchange."
      );
    } finally {
      setIsExchanging(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Exchange Coins</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Convert saved portfolio holdings using live prices.
          </p>
        </div>
        {isLoadingRates && (
          <p className="text-xs font-semibold text-zinc-500">Rates...</p>
        )}
      </div>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-[52px_1fr_1fr] sm:items-center">
          <p className="text-sm font-semibold text-orange-400">Sell</p>

          <select
            value={selectedSellCoinId}
            onChange={(event) => setSellCoinId(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-zinc-800 px-3 text-sm font-semibold text-white outline-none focus:border-emerald-400"
          >
            {sellOptions.map((coin) => (
              <option key={coin.coinId} value={coin.coinId}>
                {coin.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={sellAmount}
            onChange={(event) => setSellAmount(event.target.value)}
            min="0"
            max={sellHolding?.quantity || undefined}
            step="any"
            placeholder={
              sellHolding
                ? `Avl: ${formatNumber(sellHolding.quantity)} ${sellHolding.symbol}`
                : `Avl: 0 ${selectedSellCoin?.symbol || ""}`
            }
            className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-[52px_1fr_1fr] sm:items-center">
          <p className="text-sm font-semibold text-emerald-400">Buy</p>

          <select
            value={buyCoinId}
            onChange={(event) => setBuyCoinId(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-zinc-800 px-3 text-sm font-semibold text-white outline-none focus:border-emerald-400"
          >
            {coinOptions.map((coin) => (
              <option key={coin.coinId} value={coin.coinId}>
                {coin.name}
              </option>
            ))}
          </select>

          <p className="flex h-11 items-center rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm font-bold text-emerald-400">
            {estimatedBuyAmount > 0 && buyCoin
              ? `${formatNumber(estimatedBuyAmount)} ${buyCoin.symbol}`
              : "Estimated amount"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleExchange}
          disabled={isLoadingRates || isExchanging}
          className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExchanging ? "Exchanging..." : "Exchange"}
        </button>
      </div>

      {(message || exchangeError || rateError) && (
        <p
          className={`mt-4 text-center text-sm font-semibold ${
            exchangeError || rateError ? "text-rose-300" : "text-emerald-300"
          }`}
        >
          {exchangeError || rateError || message}
        </p>
      )}
    </section>
  );
};

export default ExchangeCoins;
