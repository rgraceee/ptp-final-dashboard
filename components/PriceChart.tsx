"use client";

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
  return (
    <div className="card-static p-6 w-full h-full min-h-[360px] rounded-xl animate-fade-in-up">
      <div className="mb-5">
        <h3 className="font-semibold text-gray-900 text-base">Price Trend</h3>
        <p className="text-sm text-gray-400 mt-0.5">
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

          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            minTickGap={20}
            stroke="#e5e7eb"
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            stroke="#e5e7eb"
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid #f0f1f3",
              borderRadius: "14px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
              fontSize: "13px",
              padding: "12px 16px",
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
            activeDot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "var(--accent)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
