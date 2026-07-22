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
  price: number;
};

type Props = {
  data: PricePoint[];
  loading?: boolean;
};

export default function RecordsPriceChart({ data, loading }: Props) {
  if (data.length === 0 && !loading) {
    return (
      <div className="card-static p-10 text-center animate-fade-in-up">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <p className="text-gray-600 text-sm font-medium">Not enough data to display chart.</p>
        <p className="text-gray-400 text-xs mt-1.5">
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
        <h3 className="font-semibold text-gray-900 text-base">Price Over Time</h3>
        <p className="text-sm text-gray-400 mt-0.5">
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
            dataKey="price"
            stroke="var(--accent)"
            fill="url(#recordsPriceGradient)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "var(--accent)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
