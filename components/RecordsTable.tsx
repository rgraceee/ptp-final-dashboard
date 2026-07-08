"use client";

import { Pencil, Trash2 } from "lucide-react";

type Record = {
  id: string;
  ticker: string;
  date: string;
  price: string;
  notes: string;
};

type RecordsTableProps = {
  records: Record[];
  onEdit: (record: Record) => void;
  onDelete: (id: string) => void;
};

export default function RecordsTable({ records, onEdit, onDelete }: RecordsTableProps) {
  if (records.length === 0) {
    return <p className="text-sm text-gray-500">No records yet. Add one above.</p>;
  }

  return (
    <div className="card overflow-hidden max-w-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500">
            <th className="px-4 py-2 font-medium">Ticker</th>
            <th className="px-4 py-2 font-medium">Date</th>
            <th className="px-4 py-2 font-medium">Price</th>
            <th className="px-4 py-2 font-medium">Notes</th>
            <th className="px-4 py-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-2 font-semibold" style={{ color: "var(--accent)" }}>
                {r.ticker}
              </td>
              <td className="px-4 py-2 text-gray-900">{r.date}</td>
              <td className="px-4 py-2 text-gray-900">${r.price}</td>
              <td className="px-4 py-2 text-gray-500">{r.notes || "—"}</td>
              <td className="px-4 py-2">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => onEdit(r)}
                    className="text-gray-400 hover:text-[var(--accent)] transition-colors"
                    aria-label={`Edit ${r.ticker} record`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    aria-label={`Delete ${r.ticker} record`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}