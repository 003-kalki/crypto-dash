const AuthModal = () => {
  return (
    <div className="MainWrapper flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#14532d_0%,#09090b_38%,#020617_100%)] px-6 py-12 text-white">

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/85 p-1 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative rounded-[22px] border border-white/10 bg-zinc-950/80 p-7">
          {/* Close Button */}
          <button className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-sm text-zinc-400 transition hover:border-emerald-400 hover:text-white">
            X
          </button>

          <div className="mb-7 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-lg font-black text-emerald-300">
              C
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                CryptoDash
              </p>
              <p className="text-sm text-zinc-500">Market access portal</p>
            </div>
          </div>

          {/* Login Text */}
          <div className="logintxt">
            <h2 className="max-w-xs text-4xl font-black leading-tight text-white">
              Sign in to track smarter.
            </h2>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Create watchlists, follow market moves, and keep your dashboard ready.
            </p>
          </div>

          {/* Google Button */}
          <div className="googleBtn mt-8">
            <button className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-emerald-500 bg-emerald-500 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-emerald-600 hover:shadow-emerald-950/30">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-white/60 bg-white text-sm font-black text-emerald-600">
                G
              </span>
              Continue with Google
            </button>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-zinc-500">
            Static UI preview. Auth logic can be connected later.
          </p>
        </div>
      </div>

    </div>
  );
}

export default AuthModal;
