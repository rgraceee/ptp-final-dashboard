"use client";

import { useTheme } from "@/components/ThemeProvider";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type PricePoint = {
  date: string;
  price: number;
};

type Props = {
  data: PricePoint[];
  loading?: boolean;
};

export default function RecordsPriceChart({ data, loading }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#2e2e33" : "#f3f4f6";
  const tickColor = isDark ? "#6b7280" : "#9ca3af";
  const axisStroke = isDark ? "#2e2e33" : "#e5e7eb";
  const tooltipBg = isDark ? "rgba(28,28,32,0.95)" : "rgba(255,255,255,0.95)";
  const tooltipBorder = isDark ? "#2e2e33" : "#f0f1f3";
  const tooltipShadow = isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)";

  if (data.length === 0 && !loading) {
    return (
      <div className="card-static p-10 text-center animate-fade-in-up">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-[var(--surface-sunken)] text-[var(--text-muted)] mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <p className="text-[var(--text-secondary)] text-sm font-medium">Not enough data to display chart.</p>
        <p className="text-[var(--text-muted)] text-xs mt-1.5">
          Add at least 2 records to see price trends.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card-static p-6 h-80 w-full">
        <div className="h-5 w-40 rounded shimmer mb-3" />
        <div className="h-64 w-full shimmer rounded-lg" />
      </div>
    );
  }

  return (
    <div className="card-static p-6 h-80 w-full animate-fade-in-up">
      <div className="mb-4">
        <h3 className="font-semibold text-[var(--text-primary)] text-base">Price Over Time</h3>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          Historical prices from your records
        </p>
      </div>

      <ResponsiveContainer width="100%" height="82%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="recordsPriceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity={0.1} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: tickColor }}
            minTickGap={20}
            stroke={axisStroke}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 11, fill: tickColor }}
            stroke={axisStroke}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              backdropFilter: "blur(12px)",
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "14px",
              boxShadow: tooltipShadow,
              fontSize: "13px",
              padding: "12px 16px",
              color: isDark ? "#f3f4f6" : "#111827",
            }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
          />

          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--accent)"
            fill="url(#recordsPriceGradient)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: isDark ? "#1c1c20" : "#fff", stroke: "var(--accent)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
