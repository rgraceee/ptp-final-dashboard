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

const gradients: Record<string, string> = {
  price: "bg-gradient-to-br from-white to-rose-50",
  open: "bg-gradient-to-br from-white to-blue-50",
  volume: "bg-gradient-to-br from-white to-emerald-50",
  cap: "bg-gradient-to-br from-white to-violet-50",
  high: "bg-gradient-to-br from-white to-sky-50",
  low: "bg-gradient-to-br from-white to-pink-50",
};

const iconColors: Record<string, string> = {
  price: "text-rose-600 bg-rose-100",
  open: "text-blue-600 bg-blue-100",
  volume: "text-emerald-600 bg-emerald-100",
  cap: "text-violet-600 bg-violet-100",
  high: "text-sky-600 bg-sky-100",
  low: "text-pink-600 bg-pink-100",
};

export default function StatCard({ label, value, change, icon, gradient = "price", highlight }: StatCardProps) {
  const isPositive = change?.startsWith("-") === false;
  const bgClass = gradients[gradient] || gradients.price;
  const iconBg = iconColors[gradient] || iconColors.price;

  return (
    <div className={`${bgClass} rounded-xl border border-gray-200/80 shadow-sm p-4 w-full h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className={`mt-1 tracking-tight ${highlight ? "text-3xl" : "text-xl"} font-bold text-gray-900`}>
            {value}
          </p>
          {change && (
            <p
              className={`text-xs font-medium mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                isPositive
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-red-700 bg-red-50"
              }`}
            >
              <span className="text-[10px]">{isPositive ? "▲" : "▼"}</span>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
