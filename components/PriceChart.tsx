"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type PricePoint = { date: string; close: number };

export default function PriceChart({ data }: { data: PricePoint[] }) {
  return (
    <div className="card p-4 mt-6 h-72 w-full">
      <p className="text-sm text-gray-500 mb-2">30-Day Price History</p>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={20} />
          <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="close"
            stroke="var(--accent)"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}