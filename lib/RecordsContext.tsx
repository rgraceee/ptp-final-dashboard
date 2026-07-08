"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Record = {
  id: string;
  ticker: string;
  date: string;
  price: string;
  notes: string;
};

type RecordsContextType = {
  records: Record[];
  addRecord: (record: Omit<Record, "id">) => void;
  updateRecord: (id: string, updated: Omit<Record, "id">) => void;
  deleteRecord: (id: string) => void;
};

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<Record[]>([]);

  function addRecord(record: Omit<Record, "id">) {
    setRecords((prev) => [{ id: crypto.randomUUID(), ...record }, ...prev]);
  }

  function updateRecord(id: string, updated: Omit<Record, "id">) {
    setRecords((prev) => prev.map((r) => (r.id === id ? { id, ...updated } : r)));
  }

  function deleteRecord(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <RecordsContext.Provider value={{ records, addRecord, updateRecord, deleteRecord }}>
      {children}
    </RecordsContext.Provider>
  );
}

export function useRecords() {
  const ctx = useContext(RecordsContext);
  if (!ctx) throw new Error("useRecords must be used within a RecordsProvider");
  return ctx;
}