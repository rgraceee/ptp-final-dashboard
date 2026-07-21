"use client";

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
    "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(194,67,111,0.15)] hover:border-gray-300";

  return (
    <div className="card p-5 mb-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="btn btn-ghost text-xs py-1 px-2.5 rounded-md"
          >
            Clear Filters
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={tickerFilter}
          onChange={(e) => setTickerFilter(e.target.value.toUpperCase())}
          className={inputBase}
          placeholder="Filter by ticker"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputBase}
          placeholder="Start date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={inputBase}
          placeholder="End date"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${inputBase} pr-8`}
        >
          <option value="All">All Categories</option>
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
      </div>
    </div>
  );
}
