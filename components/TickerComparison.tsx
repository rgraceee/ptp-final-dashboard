"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AVAILABLE_TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA",
  "META", "TSLA", "JPM", "WMT", "DIS", "NFLX", "KO",
];

const PALETTE = [
  "#c2436f", "#2563eb", "#16a34a", "#ea580c", "#7c3aed",
  "#0891b2", "#db2777", "#65a30d", "#ca8a04", "#4f46e5", "#dc2626", "#0d9488",
];

const COLORS: Record<string, string> = Object.fromEntries(
  AVAILABLE_TICKERS.map((t, i) => [t, PALETTE[i % PALETTE.length]])
);

type HistoryPoint = { date: string; close: number };
type MergedPoint = { date: string; [ticker: string]: number | string };

function mergeHistories(histories: Record<string, HistoryPoint[]>): MergedPoint[] {
  const dateMap: Record<string, MergedPoint> = {};

  for (const [ticker, points] of Object.entries(histories)) {
    for (const p of points) {
      if (!dateMap[p.date]) dateMap[p.date] = { date: p.date };
      dateMap[p.date][ticker] = p.close;
    }
  }

  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
}

export default function TickerComparison() {
  const [selected, setSelected] = useState<string[]>(["AAPL", "MSFT"]);
  const [histories, setHistories] = useState<Record<string, HistoryPoint[]>>({});
  const [latestPrices, setLatestPrices] = useState<{ symbol: string; price: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTicker(ticker: string) {
    setSelected((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  }

  useEffect(() => {
    if (selected.length === 0) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchAll() {
      try {
        const historyResults = await Promise.all(
          selected.map(async (ticker) => {
            const res = await fetch(`/api/history/${ticker}`);
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            return [ticker, json] as [string, HistoryPoint[]];
          })
        );

        const quoteResults = await Promise.all(
          selected.map(async (ticker) => {
            const res = await fetch(`/api/stock/${ticker}`);
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            return { symbol: ticker, price: parseFloat(json.price) };
          })
        );

        if (!cancelled) {
          setHistories(Object.fromEntries(historyResults));
          setLatestPrices(quoteResults);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const mergedData = mergeHistories(histories);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">Compare Tickers</h2>

      <div className="flex flex-wrap gap-2 mb-1">
        {AVAILABLE_TICKERS.map((ticker) => {
          const isSelected = selected.includes(ticker);

          return (
            <button
              key={ticker}
              type="button"
              onClick={() => toggleTicker(ticker)}
              className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
              style={{
                borderColor: isSelected ? COLORS[ticker] : "#e5e7eb",
                background: isSelected ? COLORS[ticker] : "#ffffff",
                color: isSelected ? "#ffffff" : "#374151",
              }}
            >
              {ticker}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Select as many tickers as you'd like to compare.
      </p>

      {selected.length === 0 && (
        <p className="text-sm text-gray-500">Select at least one ticker to compare.</p>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading && (
        <div className="h-72 w-full rounded-xl shimmer mb-6" />
      )}

      {!loading && mergedData.length > 0 && (
        <div className="card p-4 mb-6 h-80 w-full">
          <p className="text-sm text-gray-500 mb-2">30-Day Price Comparison</p>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={20} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              {selected.map((ticker) => (
                <Line
                  key={ticker}
                  type="monotone"
                  dataKey={ticker}
                  stroke={COLORS[ticker]}
                  dot={false}
                  strokeWidth={2}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && latestPrices.length > 0 && (
        <div className="card p-4 h-64 w-full">
          <p className="text-sm text-gray-500 mb-2">Latest Price Comparison</p>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={latestPrices}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="symbol" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="price" radius={[6, 6, 0, 0]}>
                {latestPrices.map((entry) => (
                  <Cell key={entry.symbol} fill={COLORS[entry.symbol]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}