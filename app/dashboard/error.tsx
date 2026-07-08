"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-6">
      <p className="text-red-600 mb-2">Failed to load dashboard: {error.message}</p>
      <button onClick={() => reset()} className="px-3 py-1 border rounded text-sm">
        Retry
      </button>
    </div>
  );
}