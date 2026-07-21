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
    return <ArrowUpDown size={14} className="inline ml-1 text-gray-400" />;
  }
  return sortDirection === "asc" ? (
    <ArrowUp size={14} className="inline ml-1 text-gray-600" />
  ) : (
    <ArrowDown size={14} className="inline ml-1 text-gray-600" />
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
      <td className="px-5 py-3.5">
        <div className="h-4 w-16 rounded shimmer" />
      </td>
      <td className="px-5 py-3.5">
        <div className="h-4 w-24 rounded shimmer" />
      </td>
      <td className="px-5 py-3.5">
        <div className="h-4 w-20 rounded shimmer" />
      </td>
      <td className="px-5 py-3.5">
        <div className="h-5 w-12 rounded-full shimmer" />
      </td>
      <td className="px-5 py-3.5">
        <div className="h-4 w-32 rounded shimmer" />
      </td>
      <td className="px-5 py-3.5">
        <div className="flex gap-1 justify-end">
          <div className="h-8 w-8 rounded-lg shimmer" />
          <div className="h-8 w-8 rounded-lg shimmer" />
        </div>
      </td>
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
      <div className="card-static overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3.5 font-semibold">Ticker</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Price</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Notes</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
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
      <div className="card-static p-10 text-center mt-6">
        <div className="text-4xl mb-3 opacity-40">📋</div>
        <p className="text-gray-500 text-sm font-medium">
          {hasActiveFilters
            ? "No records match your filters."
            : "No records yet."}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          {hasActiveFilters
            ? "Try adjusting or clearing your filters."
            : "Add your first stock record above to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="card-static overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-500">
              <th
                className="px-5 py-3.5 cursor-pointer select-none hover:text-gray-900 transition-colors font-semibold"
                onClick={() => handleSort("ticker")}
              >
                Ticker <SortIcon field="ticker" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th
                className="px-5 py-3.5 cursor-pointer select-none hover:text-gray-900 transition-colors font-semibold"
                onClick={() => handleSort("date")}
              >
                Date <SortIcon field="date" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th
                className="px-5 py-3.5 cursor-pointer select-none hover:text-gray-900 transition-colors font-semibold"
                onClick={() => handleSort("price")}
              >
                Price <SortIcon field="price" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th className="px-5 py-3.5 font-semibold">Category</th>
              <th className="px-5 py-3.5 font-semibold">Notes</th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record, index) => (
              <tr
                key={record.id}
                className={`border-b border-gray-50 last:border-none hover:bg-gray-50/80 transition-colors group ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                }`}
              >
                <td className="px-5 py-3.5 font-semibold" style={{ color: "var(--accent)" }}>
                  {record.ticker}
                </td>
                <td className="px-5 py-3.5 text-gray-600">{record.date}</td>
                <td className="px-5 py-3.5 font-medium text-gray-900">
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
                  <div className="flex gap-1 justify-end opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(record)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      aria-label={`Edit ${record.ticker} record`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(String(record.id))}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label={`Delete ${record.ticker} record`}
                    >
                      <Trash2 size={15} />
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
