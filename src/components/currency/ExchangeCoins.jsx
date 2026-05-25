import { useState } from "react";

const coins = ["Bitcoin", "Ethereum", "Tether", "Dogecoin"];

const ExchangeCoins = () => {
  const [sellCoin, setSellCoin] = useState("Bitcoin");
  const [buyCoin, setBuyCoin] = useState("Ethereum");
  const [sellAmount, setSellAmount] = useState("");

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <h2 className="text-lg font-bold text-white">Exchange Coins</h2>

      <div className="mt-6 grid gap-4">
        <div className="grid grid-cols-[44px_1fr_1fr] items-center gap-4">
          <p className="text-sm font-semibold text-orange-400">Sell</p>

          <select
            value={sellCoin}
            onChange={(event) => setSellCoin(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-zinc-800 px-3 text-sm font-semibold text-white outline-none focus:border-emerald-400"
          >
            {coins.map((coin) => (
              <option key={coin} value={coin}>
                {coin}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={sellAmount}
            onChange={(event) => setSellAmount(event.target.value)}
            placeholder="Avl: 0.002BTC"
            className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400"
          />
        </div>

        <div className="grid grid-cols-[44px_1fr_1fr] items-center gap-4">
          <p className="text-sm font-semibold text-emerald-400">Buy</p>

          <select
            value={buyCoin}
            onChange={(event) => setBuyCoin(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-zinc-800 px-3 text-sm font-semibold text-white outline-none focus:border-emerald-400"
          >
            {coins.map((coin) => (
              <option key={coin} value={coin}>
                {coin}
              </option>
            ))}
          </select>

          <p className="text-sm font-bold text-emerald-400">23000 Eth</p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-blue-500">
          Exchange
        </button>
      </div>
    </section>
  );
};

export default ExchangeCoins;
