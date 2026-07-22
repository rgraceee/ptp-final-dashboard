"use client";

import { useState, useEffect } from "react";
import { useRecords, RecordType } from "@/lib/RecordsContext";
import { useToast } from "@/components/Toast";
import { RefreshCw, Plus, Pencil } from "lucide-react";
import RecordsTable from "@/components/RecordsTable";
import RecordsFilters from "@/components/RecordsFilters";
import RecordsStats from "@/components/RecordsStats";
import RecordsPriceChart from "@/components/RecordsPriceChart";
import Swal from "sweetalert2";

const TODAY = new Date().toISOString().split("T")[0];

export default function RecordForm() {
  const {
    records,
    loading,
    statsLoading,
    fetchRecords,
    fetchStats,
    addRecord,
    updateRecord,
    deleteRecord,
  } = useRecords();
  const { showToast } = useToast();

  const [ticker, setTicker] = useState("");
  const [date, setDate] = useState(TODAY);
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Buy");

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [tickerFilter, setTickerFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    ticker?: string;
    date?: string;
    price?: string;
  }>({});

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, [fetchRecords, fetchStats]);

  const filteredRecords = records.filter((record) => {
    const categoryMatch =
      categoryFilter === "All" || record.category === categoryFilter;
    const tickerMatch = !tickerFilter || record.ticker.includes(tickerFilter);
    const startMatch = !startDate || record.date >= startDate;
    const endMatch = !endDate || record.date <= endDate;
    return categoryMatch && tickerMatch && startMatch && endMatch;
  });

  const hasActiveFilters =
    categoryFilter !== "All" ||
    !!tickerFilter ||
    !!startDate ||
    !!endDate;

  const chartData = [...filteredRecords]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({
      date: r.date,
      price: Number(r.price),
    }));

  const filteredStats = {
    totalRecords: filteredRecords.length,
    totalValue: filteredRecords.reduce((sum, r) => sum + Number(r.price), 0),
    averagePrice:
      filteredRecords.length > 0
        ? filteredRecords.reduce((sum, r) => sum + Number(r.price), 0) /
          filteredRecords.length
        : 0,
    latestEntry: filteredRecords[0] ?? null,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const trimmedTicker = ticker.trim().toUpperCase();
    const trimmedDate = date.trim();
    const numericPrice = Number(price);

    const errors: { ticker?: string; date?: string; price?: string } = {};

    if (!trimmedTicker || !/^[A-Z]{1,5}$/.test(trimmedTicker)) {
      errors.ticker = "Ticker must be 1-5 uppercase letters";
    }

    if (!trimmedDate || isNaN(Date.parse(trimmedDate))) {
      errors.date = "Please provide a valid date";
    } else if (new Date(trimmedDate) > new Date()) {
      errors.date = "Date cannot be in the future";
    }

    if (!numericPrice || numericPrice <= 0 || numericPrice >= 1_000_000) {
      errors.price = "Price must be between 0 and 1,000,000";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const isEditing = !!editingId;
    const confirmResult = await Swal.fire({
      title: isEditing ? "Save changes?" : "Add record?",
      text: isEditing
        ? `Update ${trimmedTicker} record for $${numericPrice.toFixed(2)}?`
        : `Add ${trimmedTicker} ${category} at $${numericPrice.toFixed(2)}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8B1A3A",
      cancelButtonColor: "#6b7280",
      confirmButtonText: isEditing ? "Yes, save changes" : "Yes, add it",
      cancelButtonText: "Cancel",
      background: "#fff",
      color: "#111827",
      reverseButtons: true,
      customClass: {
        popup: "!rounded-2xl !border !border-gray-100 !shadow-2xl",
        confirmButton: "!rounded-xl !px-5 !py-2.5 !font-semibold !text-sm",
        cancelButton: "!rounded-xl !px-5 !py-2.5 !font-semibold !text-sm",
        title: "!text-lg !font-bold",
        htmlContainer: "!text-sm !text-gray-500",
      },
    });

    if (!confirmResult.isConfirmed) return;

    const payload = {
      ticker: trimmedTicker,
      date: trimmedDate,
      price: numericPrice,
      notes,
      category,
    };

    try {
      if (editingId) {
        await updateRecord(editingId, payload);
        showToast("success", "Record updated", `${trimmedTicker} record updated successfully`);
      } else {
        await addRecord(payload);
        showToast("success", "Record added", `${trimmedTicker} ${category} at $${numericPrice.toFixed(2)}`);
      }
      reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save record";
      showToast("error", "Save failed", message);
    }
  }

  function reset() {
    setTicker("");
    setDate(TODAY);
    setPrice("");
    setNotes("");
    setCategory("Buy");
    setEditingId(null);
    setFieldErrors({});
  }

  function handleEdit(record: RecordType) {
    setEditingId(record.id);
    setTicker(record.ticker);
    setDate(record.date);
    setPrice(String(record.price));
    setNotes(record.notes);
    setCategory(record.category);
  }

  async function handleDelete(id: string) {
    const record = records.find((r) => r.id === id);
    if (!record) return;

    const confirmResult = await Swal.fire({
      title: "Delete record?",
      html: `Delete <strong>${record.ticker}</strong> record from <strong>${record.date}</strong>?<br/><span style="color:#6b7280;font-size:13px;">This action cannot be undone.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#fff",
      color: "#111827",
      reverseButtons: true,
      customClass: {
        popup: "!rounded-2xl !border !border-gray-100 !shadow-2xl",
        confirmButton: "!rounded-xl !px-5 !py-2.5 !font-semibold !text-sm",
        cancelButton: "!rounded-xl !px-5 !py-2.5 !font-semibold !text-sm",
        title: "!text-lg !font-bold",
        htmlContainer: "!text-sm",
      },
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await deleteRecord(id);
      showToast("success", "Record deleted", `${record.ticker} record from ${record.date} removed`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete record";
      showToast("error", "Delete failed", message);
    }
  }

  const inputBase =
    "h-10 rounded-lg border border-gray-200/80 bg-white px-3 text-sm outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(139,26,58,0.12)] hover:border-gray-300";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          {editingId ? "Edit Record" : "Add Record"}
        </h2>
        <button
          onClick={() => {
            fetchRecords();
            fetchStats();
          }}
          className="btn btn-ghost text-sm"
        >
          <RefreshCw size={15} className={statsLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card-static p-4"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
              Ticker
            </label>
            <input
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Input ticker (e.g., AAPL, etc.)"
              className={`${inputBase} ${fieldErrors.ticker ? "input-error" : ""}`}
              required
              maxLength={5}
            />
            {fieldErrors.ticker && (
              <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.ticker}</p>
            )}
          </div>

          <div className="w-[160px]">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputBase} ${fieldErrors.date ? "input-error" : ""}`}
              required
              max={TODAY}
            />
            {fieldErrors.date && (
              <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.date}</p>
            )}
          </div>

          <div className="w-[140px]">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
              Price
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className={`${inputBase} ${fieldErrors.price ? "input-error" : ""}`}
              required
              min="0.01"
              step="0.01"
              type="number"
            />
            {fieldErrors.price && (
              <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.price}</p>
            )}
          </div>

          <div className="w-[130px]">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputBase}
            >
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
              Notes
            </label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
              className={inputBase}
            />
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary h-10 px-5"
            >
              {editingId ? <Pencil size={15} /> : <Plus size={15} />}
              {loading
                ? editingId
                  ? "Saving..."
                  : "Adding..."
                : editingId
                  ? "Save"
                  : "Add Record"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={reset}
                className="btn btn-ghost text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <RecordsStats stats={filteredStats} loading={statsLoading} />

      <RecordsFilters
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        tickerFilter={tickerFilter}
        setTickerFilter={setTickerFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onClear={() => {
          setCategoryFilter("All");
          setTickerFilter("");
          setStartDate("");
          setEndDate("");
        }}
        hasActiveFilters={hasActiveFilters}
      />

      <RecordsPriceChart data={chartData} loading={statsLoading} />

      <RecordsTable
        records={filteredRecords}
        onEdit={handleEdit}
        onDelete={handleDelete}
        hasActiveFilters={hasActiveFilters}
        loading={loading}
      />
    </div>
  );
}
