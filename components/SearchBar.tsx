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
        `/api/ticker?symbol=${ticker}`
      );

      if (!response.ok) {
        setError("Ticker does not exist");
        return;
      }

      onSearch(ticker);
      setValue("");

    } catch (error) {
      setError("Something went wrong");
    }
  }


  return (
    <div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
      >

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search ticker"
          className="
          border border-gray-200
          rounded-lg
          px-3
          py-2.5
          text-sm
          w-64
          outline-none
          text-gray-900
          "
        />


        <button
          type="submit"
          className="
          px-4
          py-2.5
          rounded-lg
          text-sm
          text-white
          hover:scale-105
          "
          style={{
            background:"var(--accent)"
          }}
        >
          Search
        </button>

      </form>


      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}

    </div>
  );
}