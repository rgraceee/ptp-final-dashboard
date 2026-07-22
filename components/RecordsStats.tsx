"use client";

import { Hash, DollarSign, BarChart3, Clock } from "lucide-react";

type Stats = {
  totalRecords: number;
  totalValue: number;
  averagePrice: number;
  latestEntry: { date: string; ticker: string } | null;
};

type Props = {
  stats: Stats;
  loading?: boolean;
};

const statCards = [
  { key: "total", label: "Total Records", icon: Hash, circle: "bg-rose-100 text-rose-600" },
  { key: "value", label: "Total Value", icon: DollarSign, circle: "bg-violet-100 text-violet-600" },
  { key: "avg", label: "Average Price", icon: BarChart3, circle: "bg-blue-100 text-blue-600" },
];

export default function RecordsStats({ stats, loading }: Props) {
  const values: Record<string, string> = {
    total: String(stats.totalRecords),
    value: `$${stats.totalValue.toFixed(2)}`,
    avg: `$${stats.averagePrice.toFixed(2)}`,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statCards.map((s) => (
        <div key={s.key} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--text-muted)]">
                {s.label}
              </p>
              {loading ? (
                <div className="h-7 w-20 rounded shimmer mt-2" />
              ) : (
                <p className="text-2xl font-semibold text-[var(--text-primary)] mt-2 tracking-tight">
                  {values[s.key]}
                </p>
              )}
              {s.key === "avg" && !loading && stats.latestEntry && (
                <p className="text-[11px] text-[var(--text-muted)] mt-2 flex items-center gap-1">
                  <Clock size={11} />
                  Latest: {stats.latestEntry.ticker} ({stats.latestEntry.date})
                </p>
              )}
            </div>
            <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${s.circle}`}>
              <s.icon size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
