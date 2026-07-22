"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

type Ticker = {
  id: string;
  symbol: string;
  company: string;
  description: string;
};

export default function ManageTickers() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [form, setForm] = useState({ symbol: "", company: "", description: "" });

  const loadTickers = useCallback(async () => {
    const res = await fetch("/api/ticker", { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load tickers");
    const data = await res.json();
    setTickers(data);
  }, []);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadTickers();
  }, [loadTickers]);

  async function addTicker() {
    await fetch("/api/ticker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    setForm({ symbol: "", company: "", description: "" });
    loadTickers();
  }

  async function deleteTicker(id: string) {
    const res = await fetch(`/api/ticker/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) console.error("Failed to delete ticker");
    loadTickers();
  }

  const inputBase =
    "h-10 rounded-lg border border-gray-200/80 bg-white px-3 text-sm outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(139,26,58,0.12)] hover:border-gray-300";

  return (
    <div className="min-h-screen gradient-soft">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="section-header">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Manage Tickers</h1>
        </div>

        <div className="card-static p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: "linear-gradient(90deg, var(--accent), #A52A3A, transparent)" }} />
          <h2 className="font-semibold text-gray-900 text-base mb-4 pt-1">Add New Ticker</h2>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Symbol</label>
              <input
                placeholder="AAPL"
                className={inputBase}
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Company</label>
              <input
                placeholder="Apple Inc."
                className={inputBase}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Description</label>
              <input
                placeholder="Technology company"
                className={inputBase}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <button onClick={addTicker} className="btn btn-primary h-10 px-5">
              <Plus size={15} />
              Add
            </button>
          </div>
        </div>

        <div className="card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400 bg-gray-50/50">
                  <th className="px-5 py-3 font-semibold">Ticker</th>
                  <th className="px-5 py-3 font-semibold">Company</th>
                  <th className="px-5 py-3 font-semibold">Description</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickers.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50/80 text-rose-600 border border-rose-100">
                        {t.symbol}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 font-medium">{t.company}</td>
                    <td className="px-5 py-3.5 text-gray-500">{t.description}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => deleteTicker(t.id)}
                        className="p-2 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {tickers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-gray-400 text-sm">
                      No tickers found. Add one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
