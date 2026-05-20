const CoinSearchBar = () => {
  return (
    <div className="w-full max-w">
      <input
        type="text"
        placeholder="Search by coin"
        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400"
      />
    </div>
  );
};

export default CoinSearchBar;
