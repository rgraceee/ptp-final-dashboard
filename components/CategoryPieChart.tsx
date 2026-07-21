"use client";

import { useMemo } from "react";
import { useRecords } from "@/lib/RecordsContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type CategoryData = {
  name: string;
  value: number;
};

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea"];

export default function CategoryPieChart() {
  const { records, loading: recordsLoading } = useRecords();

  const data = useMemo<CategoryData[]>(() => {
    const grouped: Record<string, number> = {};
    records.forEach((record) => {
      const category = record.category || "Other";
      grouped[category] = (grouped[category] || 0) + Number(record.price);
    });
    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [records]);

  if (recordsLoading) {
    return (
      <div className="card p-5 mt-6">
        <div className="h-5 w-48 rounded shimmer mb-4" />
        <div className="h-72 w-full shimmer rounded" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card p-5 mt-6">
        <h2 className="font-semibold mb-4">Investment Category Breakdown</h2>
        <p className="text-gray-500 text-sm">No category data available.</p>
      </div>
    );
  }

  return (
    <div className="card p-5 mt-6 h-80">
      <h2 className="font-semibold mb-4">Investment Category Breakdown</h2>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.96)",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              fontSize: "13px",
              padding: "10px 14px",
            }}
            formatter={(value) => [
              `$${Number(value).toFixed(2)}`,
              "Value",
            ]}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
