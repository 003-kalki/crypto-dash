import heroImage from '../../assets/heroImage.jpg';

const HeroSection =  ({ onOpenAuthModal }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
      {/* Top Hero Area */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Left Text */}
        <div className="leftText">
          <h1 className="text-5xl font-bold">
            Track Cryptocurrency Markets
          </h1>

          <p className="mt-4 text-zinc-400">
            Analyze trends, monitor portfolios, and explore crypto insights.
          </p>
            <button 
             onClick={onOpenAuthModal}
            className="mt-6 px-8 py-2 rounded-md bg-green-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500">
    Get Started
         </button>
          
        </div>

        {/* Right Image */}
        <div className="hero-image-frame rightImg h-[400px] rounded-2xl bg-zinc-800 overflow-hidden">
          <img
            src={heroImage}
            alt="Crypto dashboard preview"
            className="h-full w-full object-cover"
          />
        </div>

      </div>

      {/* Feature Strip */}
      <div className="features grid md:grid-cols-3 gap-6 mt-12">

        <div className="snake-border bg-zinc-900 p-6 rounded-2xl">
          Top Gainers
        </div>

        <div className="snake-border bg-zinc-900 p-6 rounded-2xl">
          Trending
        </div>

<div className="flex flex-col gap-6">

  <div className="snake-border bg-zinc-900 p-6 rounded-2xl">
    <h3 className="text-zinc-400">24h Volume</h3>
    <p className="text-2xl font-bold">$98B</p>
  </div>

  <div className="snake-border bg-zinc-900 p-6 rounded-2xl">
    <h3 className="text-zinc-400">Market Cap</h3>
    <p className="text-2xl font-bold">$2.61T</p>
  </div>

</div>
</div>

      

    </div>
     </div>
  );
};

export default HeroSection;
