"use client";

import { useMemo } from "react";
import { useRecords } from "@/lib/RecordsContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type CategoryData = {
  name: string;
  value: number;
};

const COLORS = ["#8B1A3A", "#7c3aed", "#059669", "#2563eb"];

const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs font-medium text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

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
      <div className="card-static p-5">
        <div className="h-5 w-48 rounded shimmer mb-4" />
        <div className="h-64 w-full shimmer rounded-lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card-static p-5">
        <h2 className="font-semibold text-gray-900 text-base mb-4">Category Breakdown</h2>
        <p className="text-gray-400 text-sm">No category data yet.</p>
      </div>
    );
  }

  const legendPayload = data.map((entry, index) => ({
    value: entry.name,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="card-static p-5 h-80 animate-fade-in-up">
      <h2 className="font-semibold text-gray-900 text-base mb-2">Category Breakdown</h2>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={4}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
              />
            ))}
          </Pie>

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
            formatter={(value) => [
              `$${Number(value).toFixed(2)}`,
              "Value",
            ]}
          />

          <Tooltip content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
      <CustomLegend payload={legendPayload} />
    </div>
  );
}
