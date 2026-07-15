"use client";

export default function TickerError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-6">
      <p className="text-red-600 mb-2">Couldn't find that ticker. {error.message}</p>
      <button
        onClick={() => reset()}
        className="px-3 py-1 border rounded-lg text-sm text-gray-700"
      >
        Try again
      </button>
    </div>
  );
}