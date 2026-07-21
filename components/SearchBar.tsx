"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (ticker: string) => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const ticker = value.trim().toUpperCase();

    if (!ticker) return;

    setError("");

    try {
      const response = await fetch(
        `/api/ticker?symbol=${ticker}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        setError("Ticker does not exist");
        return;
      }

      onSearch(ticker);
      setValue("");
    } catch {
      setError("Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 max-w-md">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search ticker..."
          className="input pr-10"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary px-5"
      >
        Search
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2 w-full max-w-md">
          {error}
        </p>
      )}
    </form>
  );
}
