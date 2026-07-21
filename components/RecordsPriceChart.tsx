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
      <div className="card p-10 text-center mt-6">
        <div className="text-4xl mb-3 opacity-40">📈</div>
        <p className="text-gray-500 text-sm font-medium">Not enough data to display chart.</p>
        <p className="text-gray-400 text-xs mt-1">
          Add at least 2 records to see price trends.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card p-6 mt-6 h-80 w-full">
        <div className="h-5 w-40 rounded shimmer mb-3" />
        <div className="h-64 w-full shimmer rounded" />
      </div>
    );
  }

  return (
    <div className="card p-6 mt-6 h-80 w-full">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">Price Over Time</h3>
        <p className="text-sm text-gray-500">
          Historical prices from your records
        </p>
      </div>

      <ResponsiveContainer width="100%" height="82%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="recordsPriceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f3" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            minTickGap={20}
            stroke="#e5e7eb"
          />

          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            stroke="#e5e7eb"
          />

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

          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--accent)"
            fill="url(#recordsPriceGradient)"
            strokeWidth={3}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
