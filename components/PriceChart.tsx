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
  close: number;
};

export default function PriceChart({ data }: { data: PricePoint[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#2e2e33" : "#f3f4f6";
  const tickColor = isDark ? "#6b7280" : "#9ca3af";
  const axisStroke = isDark ? "#2e2e33" : "#e5e7eb";
  const tooltipBg = isDark ? "rgba(28,28,32,0.95)" : "rgba(255,255,255,0.95)";
  const tooltipBorder = isDark ? "#2e2e33" : "#f0f1f3";
  const tooltipShadow = isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)";

  return (
    <div className="card-static p-6 w-full h-full min-h-[360px] rounded-xl animate-fade-in-up">
      <div className="mb-5">
        <h3 className="font-semibold text-[var(--text-primary)] text-base">Price Trend</h3>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          Historical stock movement
        </p>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
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
            dataKey="close"
            stroke="var(--accent)"
            fill="url(#priceGradient)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: isDark ? "#1c1c20" : "#fff", stroke: "var(--accent)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
