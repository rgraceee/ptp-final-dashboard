"use client";

import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  icon?: ReactNode;
  gradient?: string;
  highlight?: boolean;
};

const circleStyles: Record<string, string> = {
  price: "bg-rose-100 text-rose-600",
  open: "bg-blue-100 text-blue-600",
  volume: "bg-emerald-100 text-emerald-600",
  cap: "bg-violet-100 text-violet-600",
  high: "bg-sky-100 text-sky-600",
  low: "bg-pink-100 text-pink-600",
};

export default function StatCard({ label, value, change, icon, gradient = "price", highlight }: StatCardProps) {
  const isPositive = change?.startsWith("-") === false;
  const circle = circleStyles[gradient] || circleStyles.price;

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm p-5 w-full h-full transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            {label}
          </p>
          <p className={`mt-2 tracking-tight font-semibold text-[var(--text-primary)] ${highlight ? "text-3xl" : "text-2xl"}`}>
            {value}
          </p>
          {change && (
            <p className={`text-xs font-medium mt-2 ${isPositive ? "text-emerald-500" : "text-red-400"}`}>
              {isPositive ? "+" : ""}{change}
            </p>
          )}
        </div>
        {icon && (
          <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${circle} transition-transform duration-200`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
  }
