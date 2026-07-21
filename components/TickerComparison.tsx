"use client";

import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

const AVAILABLE_TICKERS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "NVDA",
  "META",
  "TSLA",
  "JPM",
  "WMT",
  "DIS",
  "NFLX",
  "KO",
];

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#ca8a04",
  "#4f46e5",
  "#be123c",
  "#0f766e",
];

function getColor(index: number) {
  return COLORS[index % COLORS.length];
}

type LatestPrice = {
  symbol: string;
  price: number;
};

type HistoryPoint = {
  date: string;
  close: number;
};

type ChartDataPoint = {
  date: string;
} & Record<string, number>;

function mergeData(histories: Record<string, HistoryPoint[]>) {
  const map: Record<string, ChartDataPoint> = {};

  Object.entries(histories).forEach(([ticker, points]) => {
    points.forEach((point) => {
      if (!map[point.date]) {
        map[point.date] = { date: point.date } as ChartDataPoint;
      }
      map[point.date][ticker] = point.close;
    });
  });

  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

export default function TickerComparison() {
  const [selected, setSelected] = useState<string[]>(["AAPL", "MSFT"]);
  const [histories, setHistories] = useState<Record<string, HistoryPoint[]>>({});
  const [latestPrices, setLatestPrices] = useState<LatestPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleTicker(ticker: string) {
    setSelected((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  }

  useEffect(() => {
    if (selected.length === 0) return;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [historyResult, quoteResult] = await Promise.all([
          Promise.all(
            selected.map(async (ticker) => {
              const res = await fetch(`/api/history/${ticker}`, {
                credentials: "include",
              });
              const json = (await res.json()) as HistoryPoint[];
              return [ticker, json] as const;
            })
          ),
          Promise.all(
            selected.map(async (ticker) => {
              const res = await fetch(`/api/stock/${ticker}`, {
                credentials: "include",
              });
              const json = await res.json();
              return {
                symbol: ticker,
                price: Number(json.price),
              };
            })
          ),
        ]);

        setHistories(Object.fromEntries(historyResult));
        setLatestPrices(quoteResult);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selected]);

  const chartData = mergeData(histories);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Compare Stocks</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {AVAILABLE_TICKERS.map((ticker, index) => {
          const active = selected.includes(ticker);
          return (
            <button
              key={ticker}
              onClick={() => toggleTicker(ticker)}
              className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: active ? getColor(index) : "white",
                color: active ? "white" : "#374151",
                borderColor: active ? getColor(index) : "#e5e7eb",
              }}
            >
              {ticker}
            </button>
          );
        })}
      </div>

      {loading && (
        <p className="text-gray-500 text-sm">Loading comparison...</p>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {chartData.length > 0 && !loading && (
        <div className="card p-5 h-80 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Price History Comparison</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 24, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                minTickGap={20}
                stroke="#e5e7eb"
              />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11, fill: "#9ca3af" }} stroke="#e5e7eb" width={40} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.96)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                  padding: "10px 14px",
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]}
              />
              <Legend />
              {selected.map((ticker, index) => (
                <Line
                  key={ticker}
                  type="monotone"
                  dataKey={ticker}
                  stroke={getColor(index)}
                  dot={false}
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {latestPrices.length > 0 && !loading && (
        <div className="card p-5 h-72">
          <h3 className="font-semibold text-gray-900 mb-3">Current Price Comparison</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={latestPrices}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" />
              <XAxis dataKey="symbol" tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#e5e7eb" />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} stroke="#e5e7eb" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.96)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                  padding: "10px 14px",
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
              />
              <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                {latestPrices.map((item, index) => (
                  <Cell key={item.symbol} fill={getColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
