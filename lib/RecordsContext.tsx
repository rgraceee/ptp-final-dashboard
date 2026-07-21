"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { createClient } from "@/lib/supabase";

export type RecordType = {
  id: string;
  ticker: string;
  date: string;
  price: number;
  notes: string;
  category: string;
};

export type RecordStats = {
  totalRecords: number;
  totalValue: number;
  averagePrice: number;
  latestEntry: { date: string; ticker: string } | null;
};

type RecordsContextType = {
  records: RecordType[];
  stats: RecordStats;
  loading: boolean;
  statsLoading: boolean;
  error: string;
  fetchRecords: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addRecord: (record: Omit<RecordType, "id">) => Promise<void>;
  updateRecord: (id: string, record: Partial<Omit<RecordType, "id">>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
};

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

async function getAuthHeaders() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
  };
}

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [stats, setStats] = useState<RecordStats>({
    totalRecords: 0,
    totalValue: 0,
    averagePrice: 0,
    latestEntry: null,
  });
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const headers = await getAuthHeaders();
      const res = await fetch("/api/records", {
        headers,
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Failed to load records: ${res.status}`);
      }
      const data = (await res.json()) as RecordType[];
      setRecords(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load records";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setError("");
      const headers = await getAuthHeaders();
      const res = await fetch("/api/records/stats", {
        headers,
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Failed to load stats: ${res.status}`);
      }
      const data = (await res.json()) as RecordStats;
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load stats";
      setError(message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const addRecord = useCallback(async (record: Omit<RecordType, "id">) => {
    try {
      setLoading(true);
      setError("");
      const headers = await getAuthHeaders();
      const res = await fetch("/api/records", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(record),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add record");
      }
      const data = (await res.json()) as RecordType;
      setRecords((prev) => [data, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add record";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecord = useCallback(async (id: string, updates: Partial<Omit<RecordType, "id">>) => {
    try {
      setLoading(true);
      setError("");
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/records/${id}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update record");
      }
      const data = (await res.json()) as RecordType;
      setRecords((prev) => prev.map((r) => (r.id === id ? data : r)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update record";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecord = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError("");
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/records/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete record");
      }
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete record";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <RecordsContext.Provider
      value={{
        records,
        stats,
        loading,
        statsLoading,
        error,
        fetchRecords,
        fetchStats,
        addRecord,
        updateRecord,
        deleteRecord,
      }}
    >
      {children}
    </RecordsContext.Provider>
  );
}

export function useRecords() {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error("useRecords must be used within a RecordsProvider");
  }
  return context;
}
