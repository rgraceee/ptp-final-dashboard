"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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
  "#8B1A3A",
  "#7c3aed",
  "#059669",
  "#2563eb",
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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridColor = isDark ? "#2e2e33" : "#f3f4f6";
  const tickColor = isDark ? "#6b7280" : "#9ca3af";
  const axisStroke = isDark ? "#2e2e33" : "#e5e7eb";
  const tooltipBg = isDark ? "rgba(28,28,32,0.95)" : "rgba(255,255,255,0.95)";
  const tooltipBorder = isDark ? "#2e2e33" : "#f0f1f3";
  const tooltipShadow = isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)";
  const tooltipColor = isDark ? "#f3f4f6" : "#111827";

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
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_TICKERS.map((ticker, index) => {
          const active = selected.includes(ticker);
          return (
            <button
              key={ticker}
              onClick={() => toggleTicker(ticker)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                active
                  ? "text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border)] hover:bg-[var(--surface-sunken)]"
              }`}
              style={
                active
                  ? {
                      background: getColor(index),
                      borderColor: getColor(index),
                      boxShadow: `0 4px 12px ${getColor(index)}33`,
                    }
                  : undefined
              }
            >
              {ticker}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="card-static p-5 h-80">
            <div className="h-5 w-56 rounded shimmer mb-3" />
            <div className="h-64 w-full shimmer rounded-lg" />
          </div>
        </div>
      )}

      {error && (
        <div className="card-static border-red-100 bg-red-50/80 dark:border-red-900/50 dark:bg-red-900/20 p-4 flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 text-xs font-bold">!</div>
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      {chartData.length > 0 && !loading && (
        <div className="card-static p-5 h-80 animate-fade-in-up">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3 text-base">Price History Comparison</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 24, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: tickColor }}
                minTickGap={20}
                stroke={axisStroke}
                axisLine={false}
                tickLine={false}
              />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11, fill: tickColor }} stroke={axisStroke} width={40} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "14px",
                  boxShadow: tooltipShadow,
                  fontSize: "13px",
                  padding: "12px 16px",
                  color: tooltipColor,
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]}
              />
              {selected.map((ticker, index) => (
                <Line
                  key={ticker}
                  type="monotone"
                  dataKey={ticker}
                  stroke={getColor(index)}
                  dot={false}
                  strokeWidth={2}
                  activeDot={{ r: 5, strokeWidth: 2, fill: isDark ? "#1c1c20" : "#fff", stroke: getColor(index) }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {latestPrices.length > 0 && !loading && (
        <div className="card-static p-5 h-72 animate-fade-in-up">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3 text-base">Current Price Comparison</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={latestPrices}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="symbol" tick={{ fontSize: 12, fill: tickColor }} stroke={axisStroke} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: tickColor }} stroke={axisStroke} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "14px",
                  boxShadow: tooltipShadow,
                  fontSize: "13px",
                  padding: "12px 16px",
                  color: tooltipColor,
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
              />
              <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                {latestPrices.map((item, index) => (
                  <Cell key={item.symbol} fill={getColor(index)} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
