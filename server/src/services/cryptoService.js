const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const fetchFromCoinGecko = async (path, params = {}) => {
  const url = new URL(`${COINGECKO_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with status ${response.status}`);
  }

  return response.json();
};

const searchCoins = async (query) => {
  const data = await fetchFromCoinGecko("/search", {
    query,
  });

  return data.coins.slice(0, 10).map((coin) => ({
    coinId: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    marketCapRank: coin.market_cap_rank,
    thumb: coin.thumb,
  }));
};

const getMarketCoins = async ({
  currency = "usd",
  page = 1,
  perPage = 20,
  ids,
}) => {
  return fetchFromCoinGecko("/coins/markets", {
    vs_currency: currency.toLowerCase(),
    ids,
    order: "market_cap_desc",
    per_page: perPage,
    page,
    sparkline: false,
    price_change_percentage: "24h",
  });
};

module.exports = {
  searchCoins,
  getMarketCoins,
};
