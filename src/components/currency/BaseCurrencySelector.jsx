const currencies = ["USD", "INR", "EUR", "GBP"];

const BaseCurrencySelector = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-24 rounded-xl border border-white/10 bg-zinc-900 px-3 text-sm font-semibold text-white outline-none focus:border-emerald-400"
    >
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
};

export default BaseCurrencySelector;