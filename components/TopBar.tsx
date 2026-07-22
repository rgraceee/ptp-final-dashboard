"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { createClient } from "@/lib/supabase";
import { LogOut, RefreshCw, Search, ChevronDown, TrendingUp, Moon, Sun } from "lucide-react";
import Swal from "sweetalert2";

type TopBarProps = {
  userEmail?: string;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  onSearch?: (symbol: string) => void;
};

export default function TopBar({ userEmail, onRefresh, refreshing, onSearch }: TopBarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
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
        title: "Data refreshed",
        text: "Market data is now up to date.",
        timer: 2000,
        showConfirmButton: false,
        background: "#fff",
        color: "#111827",
        iconColor: "#10b981",
        customClass: {
          popup: "!rounded-2xl !border !border-gray-100 !shadow-2xl",
          title: "!text-lg !font-bold",
          htmlContainer: "!text-sm !text-gray-500",
        },
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Refresh failed",
        text: "API limit reached. Please try again later.",
        background: "#fff",
        color: "#111827",
        iconColor: "#ef4444",
        customClass: {
          popup: "!rounded-2xl !border !border-gray-100 !shadow-2xl",
          confirmButton: "!rounded-xl !px-5 !py-2.5 !font-semibold !text-sm !bg-[#8B1A3A]",
          title: "!text-lg !font-bold",
          htmlContainer: "!text-sm !text-gray-500",
        },
      });
    }
  }

  async function handleSignOut() {
    const result = await Swal.fire({
      title: "Sign out?",
      text: "You'll need to sign in again to access your dashboard.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8B1A3A",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, sign me out",
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

    if (result.isConfirmed) {
      await createClient().auth.signOut();
      Swal.fire({
        title: "Signed out",
        text: "You've been successfully signed out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#fff",
        color: "#111827",
        customClass: {
          popup: "!rounded-2xl !border !border-gray-100 !shadow-2xl",
          title: "!text-lg !font-bold",
        },
      });
      router.push("/login");
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--surface)]/80 backdrop-blur-xl nav-shadow border-b border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-3 shrink-0 group"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--accent), #A52A3A)" }}>
                <TrendingUp size={20} />
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: "0 0 20px rgba(139, 26, 58, 0.3)" }} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-[var(--text-primary)] tracking-tight leading-tight">
                  Stock Analytics
                </p>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                  Portfolio & Market Intelligence
                </p>
              </div>
            </button>

            <div className="hidden md:block h-6 w-px bg-[var(--border)]" />

            <form onSubmit={handleSearchSubmit} className="hidden md:block">
              <div className="relative group">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent)]" />
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search any ticker..."
                  className="h-10 w-64 pl-9 pr-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-sm text-[var(--text-primary)] outline-none transition-all duration-200 hover:bg-[var(--surface)] hover:border-[var(--border)] focus:bg-[var(--surface)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative flex items-center justify-center h-9 w-9 rounded-full transition-all duration-200 flex-shrink-0"
              style={{
                background: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {onRefresh && (
              <button
                onClick={handleRefreshClick}
                disabled={refreshing}
                className="btn btn-ghost h-9 px-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] rounded-xl transition-all duration-200"
                title="Refresh data"
              >
                <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline text-sm">Refresh</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 pr-3 shadow-sm transition-all duration-200 hover:border-[var(--border)] hover:shadow-md hover:bg-[var(--surface-raised)]"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold shadow-sm"
                  style={{ background: "linear-gradient(135deg, var(--accent), #A52A3A)" }}
                >
                  {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-[var(--text-primary)] leading-tight max-w-[140px] truncate">
                    {userEmail || "User"}
                  </p>
                </div>
                <ChevronDown size={14} className="text-[var(--text-muted)]" />
              </button>

              {showProfile && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl animate-fade-in-up z-50">
                    <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1">
                      <p className="text-xs text-[var(--text-muted)]">Signed in as</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{userEmail}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
