"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ticker = value.trim().toUpperCase();
    if (!ticker) return;
    router.push(`/dashboard/${ticker}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
  <input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Search ticker (e.g. NVDA, TSLA)"
    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-64 outline-none focus:border-[var(--accent)] transition-colors text-gray-900"
  />
  <button
    type="submit"
    className="px-4 py-2.5 rounded-lg text-sm text-white transition-transform hover:scale-105"
    style={{ background: "var(--accent)" }}
  >
    Search
  </button>
</form>
  );
}