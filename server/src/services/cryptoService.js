const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCacheKey = (path, params = {}) =>
  `${path}:${JSON.stringify(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([a], [b]) => a.localeCompare(b))
  )}`;

const fetchFromCoinGecko = async (path, params = {}) => {
  const cacheKey = getCacheKey(path, params);
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = new URL(`${COINGECKO_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  let response;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    response = await fetch(url);

    if (response.ok || !RETRYABLE_STATUSES.has(response.status)) {
      break;
    }

    await wait(400);
  }

  if (!response.ok) {
    if (cached) {
      return cached.data;
    }

    throw new Error(`CoinGecko request failed with status ${response.status}`);
  }

  const data = await response.json();

  cache.set(cacheKey, {
    createdAt: Date.now(),
    data,
  });

  return data;
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

const getCoinHistory = async ({ coinId, currency = "usd", days = 7 }) => {
  const data = await fetchFromCoinGecko(`/coins/${coinId}/market_chart`, {
    vs_currency: currency.toLowerCase(),
    days,
  });

  return data.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
  }));
};

module.exports = {
  searchCoins,
  getMarketCoins,
  getCoinHistory,
};
