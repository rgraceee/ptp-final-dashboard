"use client";

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

export default function RecordsStats({ stats, loading }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
      <div className="card p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Total Records
        </p>
        {loading ? (
          <div className="h-8 w-16 rounded shimmer mt-2" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">
            {stats.totalRecords}
          </p>
        )}
      </div>
      <div className="card p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Total Value
        </p>
        {loading ? (
          <div className="h-8 w-24 rounded shimmer mt-2" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">
            ${stats.totalValue.toFixed(2)}
          </p>
        )}
      </div>
      <div className="card p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Average Price
        </p>
        {loading ? (
          <div className="h-8 w-24 rounded shimmer mt-2" />
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">
              ${stats.averagePrice.toFixed(2)}
            </p>
            {stats.latestEntry && (
              <p className="text-xs text-gray-400 mt-1.5">
                Latest: {stats.latestEntry.ticker} ({stats.latestEntry.date})
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
