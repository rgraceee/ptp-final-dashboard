"use client";

import { useState } from "react";
import RecordsTable from "@/components/RecordsTable";
import { useRecords } from "@/lib/RecordsContext";

export default function RecordForm() {
  const { records, addRecord, updateRecord, deleteRecord } = useRecords();

  const [ticker, setTicker] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  function validate() {
    const newErrors: { [key: string]: string } = {};

    if (!ticker.trim()) {
      newErrors.ticker = "Ticker is required";
    } else if (!/^[A-Za-z]{1,5}$/.test(ticker.trim())) {
      newErrors.ticker = "Ticker should be 1-5 letters (e.g. AAPL)";
    }

    if (!date) {
      newErrors.date = "Date is required";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function resetForm() {
    setTicker("");
    setDate("");
    setPrice("");
    setNotes("");
    setErrors({});
    setEditingId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      ticker: ticker.trim().toUpperCase(),
      date,
      price: Number(price).toFixed(2),
      notes: notes.trim(),
    };

    if (editingId) {
      updateRecord(editingId, payload);
    } else {
      addRecord(payload);
    }

    resetForm();
  }

  function handleEdit(record: { id: string; ticker: string; date: string; price: string; notes: string }) {
    setEditingId(record.id);
    setTicker(record.ticker);
    setDate(record.date);
    setPrice(record.price);
    setNotes(record.notes);
    setErrors({});
  }

  function handleDelete(id: string) {
    deleteRecord(id);
    if (editingId === id) resetForm();
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">
        {editingId ? "Edit Record" : "Add a Record"}
      </h2>

      <form onSubmit={handleSubmit} className="card p-5 max-w-md space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Ticker</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="e.g. AAPL"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] text-gray-900"
          />
          {errors.ticker && <p className="text-xs text-red-600 mt-1">{errors.ticker}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] text-gray-900"
          />
          {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Price ($)</label>
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 213.40"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] text-gray-900"
          />
          {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any context for this entry..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] text-gray-900 resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm text-white transition-transform hover:scale-105"
            style={{ background: "var(--accent)" }}
          >
            {editingId ? "Save Changes" : "Add Record"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Entries ({records.length})
        </h3>
        <RecordsTable records={records} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}