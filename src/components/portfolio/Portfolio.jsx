const formatCurrency = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

const Portfolio = ({ portfolio, onRemoveHolding }) => {
  const holdings = portfolio?.holdings || [];
  const totalCost = holdings.reduce(
    (sum, holding) => sum + holding.quantity * holding.averageBuyPrice,
    0
  );
  const currency = holdings[0]?.currency || "USD";

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold text-white">Portfolio</h2>

        <p className="text-sm text-zinc-500">
          Cost basis{" "}
          <span className="font-bold text-white">
            {formatCurrency(totalCost, currency)}
          </span>
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        {holdings.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-zinc-950 px-4 py-4 text-sm text-zinc-500">
            No holdings saved yet.
          </p>
        ) : (
          holdings.map((holding) => (
            <div
              key={holding._id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-white">{holding.name}</p>
                <p className="text-xs font-bold uppercase text-zinc-500">
                  {holding.symbol} · {holding.quantity}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {formatCurrency(
                      holding.quantity * holding.averageBuyPrice,
                      holding.currency
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Avg {formatCurrency(holding.averageBuyPrice, holding.currency)}
                  </p>
                </div>

                <button
                  onClick={() => onRemoveHolding(holding._id)}
                  className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-400/10"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Portfolio;
