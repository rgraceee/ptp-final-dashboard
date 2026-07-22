"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-6">
      <div className="card-static p-8 max-w-md w-full text-center animate-fade-in-up">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-5">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {error.message || "Failed to load dashboard data. Please try again."}
        </p>
        <button
          onClick={() => reset()}
          className="btn btn-primary px-6 py-2.5"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    </div>
  );
}
