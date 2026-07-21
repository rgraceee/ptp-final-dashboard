"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { LogOut, RefreshCw, Search } from "lucide-react";
import Swal from "sweetalert2";

type TopBarProps = {
  userEmail?: string;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  onSearch?: (symbol: string) => void;
};

export default function TopBar({ userEmail, onRefresh, refreshing, onSearch }: TopBarProps) {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ticker = searchValue.trim().toUpperCase();
    if (!ticker) return;
    if (onSearch) {
      onSearch(ticker);
      setSearchValue("");
    } else {
      router.push(`/dashboard/tickers/${ticker}`);
    }
  }

  async function handleRefreshClick() {
    if (!onRefresh) return;
    try {
      await onRefresh();
      await Swal.fire({
        icon: "success",
        title: "Data refreshed successfully",
        timer: 2000,
        showConfirmButton: false,
        background: "#fff",
        color: "#111827",
        iconColor: "#10b981",
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "You've hit the API limit",
        text: "Try again later.",
        background: "#fff",
        color: "#111827",
        iconColor: "#ef4444",
      });
    }
  }

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-transparent backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2.5 shrink-0 transition-transform duration-200 hover:scale-105"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md transition-shadow duration-200 hover:shadow-lg"
                style={{ background: "var(--accent)" }}
              >
                <span className="text-lg leading-none">📈</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900 tracking-tight leading-tight">
                  Stock Analytics
                </p>
                <p className="text-[11px] text-gray-500 leading-tight">
                  Portfolio & Market
                </p>
              </div>
            </button>

            <div className="hidden md:block h-6 w-px bg-gray-200" />

            <form onSubmit={handleSearchSubmit} className="hidden md:block">
              <div className="relative">
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search ticker..."
                  className="input h-9 w-64 pr-9 text-sm bg-gray-50/50 hover:bg-white hover:border-gray-300 focus:bg-white focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Search ticker"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={handleRefreshClick}
                disabled={refreshing}
                className="btn btn-ghost h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                title="Refresh data safely (avoids API limit issues)"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline text-sm">Refresh stock data</span>
                <span className="sm:hidden">Refresh</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1.5 pr-3 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold"
                  style={{ background: "var(--accent)" }}
                >
                  {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-800 leading-tight">
                    {userEmail || "User"}
                  </p>
                </div>
                <span className="text-gray-400 text-xs">▾</span>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl animate-fade-in-up">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
