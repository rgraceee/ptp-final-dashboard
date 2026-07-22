"use client";

import { Filter, X } from "lucide-react";

type Props = {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  tickerFilter: string;
  setTickerFilter: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
};

export default function RecordsFilters({
  categoryFilter,
  setCategoryFilter,
  tickerFilter,
  setTickerFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClear,
  hasActiveFilters,
}: Props) {
  const inputBase =
    "h-10 rounded-lg border border-gray-200/80 bg-white px-3 text-sm outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(139,26,58,0.12)] hover:border-gray-300";

  return (
    <div className="card-static p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900 text-sm">
            Filters
          </h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold text-white" style={{ background: "var(--accent)" }}>
              !
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="btn btn-ghost text-xs py-1 px-2.5 rounded-lg"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={tickerFilter}
          onChange={(e) => setTickerFilter(e.target.value.toUpperCase())}
          className={`${inputBase} w-[160px]`}
          placeholder="Ticker"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={`${inputBase} w-[170px]`}
          placeholder="Start date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={`${inputBase} w-[170px]`}
          placeholder="End date"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${inputBase} w-[150px] pr-8`}
        >
          <option value="All">All Categories</option>
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
      </div>
    </div>
  );
}
