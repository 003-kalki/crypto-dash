import { useState } from "react";

const formatCurrency = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

const emptyForm = {
  coinId: "",
  symbol: "",
  name: "",
  quantity: "",
  averageBuyPrice: "",
  currency: "USD",
};

const Portfolio = ({
  portfolio,
  error,
  onAddHolding,
  onUpdateHolding,
  onRemoveHolding,
}) => {
  const holdings = portfolio?.holdings || [];
  const totalCost = holdings.reduce(
    (sum, holding) => sum + holding.quantity * holding.averageBuyPrice,
    0
  );
  const currency = holdings[0]?.currency || "USD";
  const [form, setForm] = useState(emptyForm);
  const [editingHoldingId, setEditingHoldingId] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingHoldingId("");
    setValidationError("");
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const averageBuyPrice = Number(form.averageBuyPrice);

    if (
      !form.coinId.trim() ||
      !form.symbol.trim() ||
      !form.name.trim() ||
      Number.isNaN(quantity) ||
      Number.isNaN(averageBuyPrice) ||
      quantity <= 0 ||
      averageBuyPrice < 0
    ) {
      setValidationError("Enter coin details, quantity, and buy price.");
      return;
    }

    setValidationError("");
    setSubmitError("");

    try {
      setIsSubmitting(true);

      if (editingHoldingId) {
        await onUpdateHolding(editingHoldingId, {
          quantity,
          averageBuyPrice,
          currency: form.currency,
        });
      } else {
        await onAddHolding({
          coinId: form.coinId.trim().toLowerCase(),
          symbol: form.symbol.trim().toLowerCase(),
          name: form.name.trim(),
          quantity,
          averageBuyPrice,
          currency: form.currency,
        });
      }

      resetForm();
    } catch (requestError) {
      setSubmitError(
        typeof requestError === "string"
          ? requestError
          : "Unable to save holding. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (holding) => {
    setEditingHoldingId(holding._id);
    setForm({
      coinId: holding.coinId,
      symbol: holding.symbol,
      name: holding.name,
      quantity: String(holding.quantity),
      averageBuyPrice: String(holding.averageBuyPrice),
      currency: holding.currency || "USD",
    });
    setValidationError("");
    setSubmitError("");
  };

  const handleRemove = async (holdingId) => {
    setSubmitError("");

    try {
      await onRemoveHolding(holdingId);
    } catch (requestError) {
      setSubmitError(
        typeof requestError === "string"
          ? requestError
          : "Unable to remove holding. Please try again."
      );
    }
  };

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

      <form
        onSubmit={handleSubmit}
        className="mt-5 rounded-xl border border-white/10 bg-zinc-950 p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={Boolean(editingHoldingId)}
              placeholder="Coin name"
              className="h-11 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400 disabled:opacity-60"
            />
          </div>

          <input
            type="text"
            name="coinId"
            value={form.coinId}
            onChange={handleChange}
            disabled={Boolean(editingHoldingId)}
            placeholder="Coin ID"
            className="h-11 rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400 disabled:opacity-60"
          />
          <input
            type="text"
            name="symbol"
            value={form.symbol}
            onChange={handleChange}
            disabled={Boolean(editingHoldingId)}
            placeholder="Symbol"
            className="h-11 rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400 disabled:opacity-60"
          />
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="0"
            step="any"
            placeholder="Quantity"
            className="h-11 rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400"
          />
          <input
            type="number"
            name="averageBuyPrice"
            value={form.averageBuyPrice}
            onChange={handleChange}
            min="0"
            step="any"
            placeholder="Avg buy price"
            className="h-11 rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400"
          />
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="h-11 rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm font-semibold text-white outline-none focus:border-emerald-400"
          >
            {["USD", "INR", "EUR", "GBP"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="flex gap-2 sm:justify-end">
            {editingHoldingId && (
              <button
                type="button"
                onClick={resetForm}
                className="h-11 flex-1 rounded-lg border border-white/10 px-4 text-sm font-bold text-zinc-300 transition hover:bg-white/5 sm:flex-none"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-lg bg-emerald-500 px-5 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {isSubmitting ? "Saving..." : editingHoldingId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {(validationError || submitError || error) && (
          <p className="mt-3 text-sm font-semibold text-rose-300">
            {validationError || submitError || error}
          </p>
        )}
      </form>

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
                  {holding.symbol} - {holding.quantity}
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
                    Avg{" "}
                    {formatCurrency(
                      holding.averageBuyPrice,
                      holding.currency
                    )}
                  </p>
                </div>

                <button
                  onClick={() => handleEdit(holding)}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(holding._id)}
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
