const Navbar = ({onOpenAuthModal}) => {
  return (
    <nav className="wrapper sticky top-0 z-40 flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-zinc-950/80 px-5 py-4 text-white shadow-2xl shadow-emerald-950/20 backdrop-blur-xl">
      <div className="title flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-lg font-black text-emerald-300 shadow-lg shadow-emerald-950/30">
          CD
        </div>

        <div>
          <h1 className="text-xl font-black leading-none tracking-wide">
            CryptoDawg
          </h1>
          <p className="mt-1 text-xs font-medium text-zinc-500">
            Live market dashboard
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 md:flex">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
        Market open
      </div>

      <div className="options flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
        <p className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-emerald-300">
          Markets
        </p>

        <p className="hidden cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-emerald-300 sm:block">
          Portfolio
        </p>

        <button className="rounded-full border-2 border-emerald-500 bg-emerald-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-emerald-600"
                onClick={onOpenAuthModal}
        >
          Login
        </button>

      </div>
    </nav>
  );
}
export default Navbar;
