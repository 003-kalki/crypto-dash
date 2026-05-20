const currencies = ["USD", "INR", "EUR", "GBP"];

const BaseCurrencySelector = () => {
  return (
    <select className="h-11 w-24 rounded-xl border border-white10 bg-zinc-900 px-3 text-sm font-semibold text-white outline-none focus:border-emerland-400">
      {currencies.map((currency)=>(
         <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
};

export default BaseCurrencySelector;
