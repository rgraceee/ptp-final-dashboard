"use client";

import { useState } from "react";
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { RecordType } from "@/lib/types";

type SortField = "date" | "price" | "ticker";
type SortDirection = "asc" | "desc";

type SortIconProps = {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
};

function SortIcon({ field, sortField, sortDirection }: SortIconProps) {
  if (sortField !== field) {
    return <ArrowUpDown size={13} className="inline ml-1 text-gray-300" />;
  }
  return sortDirection === "asc" ? (
    <ArrowUp size={13} className="inline ml-1 text-[var(--accent)]" />
  ) : (
    <ArrowDown size={13} className="inline ml-1 text-[var(--accent)]" />
  );
}

type Props = {
  records: RecordType[];
  onEdit: (record: RecordType) => void;
  onDelete: (id: string) => void;
  hasActiveFilters?: boolean;
  loading?: boolean;
};

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      <td className="px-5 py-3.5"><div className="h-5 w-14 rounded-full shimmer" /></td>
      <td className="px-5 py-3.5"><div className="h-4 w-24 rounded shimmer" /></td>
      <td className="px-5 py-3.5"><div className="h-4 w-20 rounded shimmer" /></td>
      <td className="px-5 py-3.5"><div className="h-6 w-14 rounded-full shimmer" /></td>
      <td className="px-5 py-3.5"><div className="h-4 w-32 rounded shimmer" /></td>
      <td className="px-5 py-3.5"><div className="flex gap-1 justify-end"><div className="h-8 w-8 rounded-lg shimmer" /><div className="h-8 w-8 rounded-lg shimmer" /></div></td>
    </tr>
  );
}

export default function RecordsTable({ records, onEdit, onDelete, hasActiveFilters, loading }: Props) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const sortedRecords = [...records].sort((a, b) => {
    let aVal: string | number = a[sortField];
    let bVal: string | number = b[sortField];

    if (sortField === "price") {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className="card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400 bg-gray-50/50">
                <th className="px-5 py-3 font-semibold">Ticker</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Notes</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="card-static p-10 text-center">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <p className="text-gray-600 text-sm font-medium">
          {hasActiveFilters
            ? "No records match your filters."
            : "No records yet."}
        </p>
        <p className="text-gray-400 text-xs mt-1.5">
          {hasActiveFilters
            ? "Try adjusting or clearing your filters."
            : "Add your first stock record above to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="card-static overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400 bg-gray-50/50">
              <th
                className="px-5 py-3 cursor-pointer select-none hover:text-gray-900 transition-colors font-semibold"
                onClick={() => handleSort("ticker")}
              >
                Ticker <SortIcon field="ticker" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th
                className="px-5 py-3 cursor-pointer select-none hover:text-gray-900 transition-colors font-semibold"
                onClick={() => handleSort("date")}
              >
                Date <SortIcon field="date" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th
                className="px-5 py-3 cursor-pointer select-none hover:text-gray-900 transition-colors font-semibold"
                onClick={() => handleSort("price")}
              >
                Price <SortIcon field="price" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold">Notes</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record) => (
              <tr
                key={record.id}
                className="border-b border-gray-50 last:border-none hover:bg-gray-50/60 transition-colors group"
              >
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50/80 text-rose-600 border border-rose-100">
                    {record.ticker}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-600">{record.date}</td>
                <td className="px-5 py-3.5 font-semibold text-gray-900">
                  ${Number(record.price).toFixed(2)}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`badge ${
                      record.category === "Buy" ? "badge-buy" : "badge-sell"
                    }`}
                  >
                    {record.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-500 max-w-[200px] truncate">
                  {record.notes || "—"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1 justify-end sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onEdit(record)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      aria-label={`Edit ${record.ticker} record`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label={`Delete ${record.ticker} record`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
