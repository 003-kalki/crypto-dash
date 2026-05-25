const portfolioCoins = [
  {
    name: "Tether",
    value: "$375",
    color: "bg-blue-400",
  },
  {
    name: "Luna",
    value: "$375",
    color: "bg-rose-400",
  },
  {
    name: "Ethereum",
    value: "$250",
    color: "bg-emerald-400",
  },
];

const Portfolio = () => {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold text-white">Portfolio</h2>

        <p className="text-sm text-zinc-500">
          Total value{" "}
          <span className="font-bold text-white">$1000</span>
        </p>
      </div>

      <div className="mt-6 flex items-center gap-8">
        <div className="grid h-36 w-36 place-items-center rounded-full bg-[conic-gradient(#60a5fa_0deg_135deg,#fb7185_135deg_270deg,#34d399_270deg_360deg)] text-sm font-bold text-white">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900/20">
            $1000
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {portfolioCoins.map((coin) => (
            <div key={coin.name} className="flex items-center gap-3 text-sm">
              <span className={`h-3 w-3 rounded-full ${coin.color}`} />
              <span className="text-zinc-300">{coin.name}</span>
              <span className="font-semibold text-zinc-500">{coin.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
