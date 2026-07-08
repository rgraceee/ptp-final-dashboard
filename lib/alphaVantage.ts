const BASE = "https://www.alphavantage.co/query";
const KEY = process.env.ALPHA_VANTAGE_API_KEY;

const USE_MOCK_DATA = true; // flip to false when you want real Alpha Vantage data

// ---------- MOCK DATA ----------

function mockQuote(symbol: string) {
  return {
    symbol,
    price: (150 + Math.random() * 50).toFixed(2),
    changePercent: "1.85%",
    open: "148.20",
    high: "202.10",
    low: "147.90",
    volume: (50_000_000).toLocaleString(),
  };
}

function mockOverview(symbol: string) {
  return {
    name: `${symbol} Mock Corp.`,
    sector: "Technology",
    industry: "Consumer Electronics",
    marketCap: "3120000000000",
    description: "This is placeholder company data used for layout testing.",
  };
}

function mockDailyHistory() {
  const points = [];
  let price = 180;
  for (let i = 29; i >= 0; i--) {
    price += (Math.random() - 0.5) * 4;
    const date = new Date();
    date.setDate(date.getDate() - i);
    points.push({
      date: date.toISOString().split("T")[0],
      close: parseFloat(price.toFixed(2)),
    });
  }
  return points;
}

// ---------- REAL + MOCK-AWARE FUNCTIONS ----------

export async function getQuote(symbol: string) {
  if (USE_MOCK_DATA) return mockQuote(symbol);

  const res = await fetch(`${BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${KEY}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Quote fetch failed for ${symbol}`);
  const data = await res.json();
  const q = data["Global Quote"];
  if (!q || !q["05. price"]) throw new Error(`No quote data for ${symbol}`);

  return {
    symbol: q["01. symbol"],
    price: parseFloat(q["05. price"]).toFixed(2),
    changePercent: q["10. change percent"],
    open: parseFloat(q["02. open"]).toFixed(2),
    high: parseFloat(q["03. high"]).toFixed(2),
    low: parseFloat(q["04. low"]).toFixed(2),
    volume: Number(q["06. volume"]).toLocaleString(),
  };
}

export async function getOverview(symbol: string) {
  if (USE_MOCK_DATA) return mockOverview(symbol);

  const res = await fetch(`${BASE}?function=OVERVIEW&symbol=${symbol}&apikey=${KEY}`, {
    next: { revalidate: 21600 },
  });
  if (!res.ok) throw new Error(`Overview fetch failed for ${symbol}`);
  const data = await res.json();
  if (!data.Name) throw new Error(`No overview data for ${symbol}`);

  return {
    name: data.Name,
    sector: data.Sector,
    industry: data.Industry,
    marketCap: data.MarketCapitalization,
    description: data.Description,
  };
}

export async function getDailyHistory(symbol: string) {
  if (USE_MOCK_DATA) return mockDailyHistory();

  const res = await fetch(
    `${BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${KEY}`,
    { next: { revalidate: 21600 } }
  );
  if (!res.ok) throw new Error(`History fetch failed for ${symbol}`);
  const data = await res.json();
  const series = data["Time Series (Daily)"];
  if (!series) throw new Error(`No history data for ${symbol}`);

  return Object.entries(series)
    .slice(0, 30)
    .map(([date, values]: [string, any]) => ({
      date,
      close: parseFloat(values["4. close"]),
    }))
    .reverse();
}

export async function getTopMovers() {
  const res = await fetch(`${BASE}?function=TOP_GAINERS_LOSERS&apikey=${KEY}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Top movers fetch failed");
  const data = await res.json();

  return {
    gainers: (data.top_gainers ?? []).slice(0, 5),
    losers: (data.top_losers ?? []).slice(0, 5),
  };
}

export async function getCryptoPrice(symbol: string) {
  const res = await fetch(
    `${BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${KEY}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error(`Crypto fetch failed for ${symbol}`);
  const data = await res.json();
  const rate = data["Realtime Currency Exchange Rate"];
  if (!rate) throw new Error(`No crypto data for ${symbol}`);

  return {
    symbol,
    price: parseFloat(rate["5. Exchange Rate"]).toFixed(2),
  };
}

export async function getIntraday(symbol: string) {
  const res = await fetch(
    `${BASE}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${KEY}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Intraday fetch failed for ${symbol}`);
  const data = await res.json();
  const series = data["Time Series (5min)"];
  if (!series) throw new Error(`No intraday data for ${symbol}`);

  return Object.entries(series)
    .slice(0, 20)
    .map(([time, values]: [string, any]) => ({
      time: time.split(" ")[1],
      price: parseFloat(values["4. close"]),
    }))
    .reverse();
}