"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase";

import { QuoteType, OverviewType, HistoryPoint } from "@/lib/types";

import TopBar from "@/components/TopBar";
import StatCard from "@/components/StatCard";
import PriceChart from "@/components/PriceChart";
import RecordForm from "@/components/RecordForm";
import CategoryPieChart from "@/components/CategoryPieChart";
import ActivityFeed from "@/components/ActivityFeed";
import TickerComparison from "@/components/TickerComparison";

import { formatMarketCap } from "@/lib/utils";
import { TrendingUp, BarChart3, Wallet, ArrowUpRight, ArrowDownRight, AudioLines } from "lucide-react";

function SkeletonStatCard() {
  return (
    <div className="rounded-xl border border-gray-200/60 bg-white shadow-sm p-5 w-full h-full">
      <div className="h-3 w-20 rounded shimmer mb-3" />
      <div className="h-7 w-28 rounded shimmer mb-3" />
      <div className="h-4 w-16 rounded shimmer" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="card-static p-6 w-full h-full min-h-[360px]">
      <div className="h-5 w-40 rounded shimmer mb-2" />
      <div className="h-3 w-56 rounded shimmer mb-6" />
      <div className="h-64 w-full shimmer rounded-lg" />
    </div>
  );
}

function SkeletonTickerComparison() {
  return (
    <div className="space-y-5">
      <div className="h-6 w-48 rounded shimmer" />
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-9 w-16 rounded-full shimmer" />
        ))}
      </div>
      <div className="card-static p-5 h-80">
        <div className="h-5 w-56 rounded shimmer mb-3" />
        <div className="h-64 w-full shimmer rounded-lg" />
      </div>
      <div className="card-static p-5 h-72">
        <div className="h-5 w-56 rounded shimmer mb-3" />
        <div className="h-56 w-full shimmer rounded-lg" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const [ticker, setTicker] = useState("AAPL");
  const [quote, setQuote] = useState<QuoteType | null>(null);
  const [overview, setOverview] = useState<OverviewType | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      setUserEmail(data.session.user.email || "");
    }

    checkUser();
  }, [router]);

  async function validateTicker(symbol: string) {
    const response = await fetch(`/api/ticker?symbol=${symbol}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Ticker does not exist");
    }

    return true;
  }

  const fetchData = useCallback(async (selectedTicker?: string) => {
    try {
      setRefreshing(true);
      setError("");

      const symbol = selectedTicker || ticker;

      await validateTicker(symbol);

      const [quoteRes, overviewRes, historyRes] = await Promise.all([
        fetch(`/api/quote/${symbol}`, { credentials: "include" }),
        fetch(`/api/overview/${symbol}`, { credentials: "include" }),
        fetch(`/api/history/${symbol}`, { credentials: "include" }),
      ]);

      if (!quoteRes.ok || !overviewRes.ok || !historyRes.ok) {
        throw new Error("Failed to load market data");
      }

      const [quoteData, overviewData, historyData] = await Promise.all([
        quoteRes.json(),
        overviewRes.json(),
        historyRes.json(),
      ]);

      setQuote(quoteData);
      setOverview(overviewData);
      setHistory(historyData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed loading dashboard";
      setError(errorMessage);
      setQuote(null);
      setOverview(null);
      setHistory([]);
    } finally {
      setRefreshing(false);
    }
  }, [ticker]);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    fetchData();
  }, [fetchData]);

  async function handleRefresh() {
    await fetchData(ticker);
  }

  function handleSearch(symbol: string) {
    const clean = symbol.toUpperCase();
    setTicker(clean);
    fetchData(clean);
  }

  const topChartData = history.slice(-14).map((h) => ({
    date: h.date,
    close: h.close,
  }));

  return (
    <div className="min-h-screen gradient-soft">
      <TopBar
        userEmail={userEmail}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onSearch={handleSearch}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="card-static border-red-100 bg-red-50/80 p-4 mb-6 flex items-center gap-3 animate-fade-in-up">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 text-sm font-bold">
              !
            </div>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {!quote ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-1 flex flex-col gap-4">
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
              </div>
              <div className="lg:col-span-2">
                <SkeletonChart />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonStatCard key={i} />
              ))}
            </div>
            <SkeletonTickerComparison />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-1 flex flex-col gap-4 h-full">
                <div className="flex-1 min-h-0 animate-stagger-in" style={{ animationDelay: "0ms" }}>
                  <StatCard
                    label={`${quote.symbol} Price`}
                    value={`$${quote.price.toFixed(2)}`}
                    change={quote.changePercent}
                    icon={<TrendingUp size={18} />}
                    gradient="price"
                    highlight
                  />
                </div>
                <div className="flex-1 min-h-0 animate-stagger-in" style={{ animationDelay: "60ms" }}>
                  <StatCard
                    label="Open Price"
                    value={`$${quote.open.toFixed(2)}`}
                    icon={<BarChart3 size={18} />}
                    gradient="open"
                  />
                </div>
                <div className="flex-1 min-h-0 animate-stagger-in" style={{ animationDelay: "120ms" }}>
                  <StatCard
                    label="Risk Score"
                    value={(() => {
                      const dayRange = ((quote.high - quote.low) / quote.price) * 100;
                      const change = parseFloat(quote.changePercent);
                      if (dayRange < 2 && Math.abs(change) < 1.5) return "Low";
                      if (dayRange > 5 || Math.abs(change) > 3) return "High";
                      return "Medium";
                    })()}
                    icon={<BarChart3 size={18} />}
                    gradient="cap"
                  />
                </div>
              </div>
              <div className="lg:col-span-2 h-full animate-stagger-in" style={{ animationDelay: "80ms" }}>
                {history.length > 0 && <PriceChart data={topChartData} />}
              </div>
            </div>

            <div className="section-header">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Market Overview</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="animate-stagger-in" style={{ animationDelay: "140ms" }}>
                <StatCard label="Volume" value={quote.volume} icon={<AudioLines size={18} />} gradient="volume" />
              </div>
              <div className="animate-stagger-in" style={{ animationDelay: "200ms" }}>
                <StatCard label="Market Cap" value={formatMarketCap(overview?.marketCap)} icon={<Wallet size={18} />} gradient="cap" />
              </div>
              <div className="animate-stagger-in" style={{ animationDelay: "260ms" }}>
                <StatCard label="Day High" value={`$${quote.high.toFixed(2)}`} icon={<ArrowUpRight size={18} />} gradient="high" />
              </div>
              <div className="animate-stagger-in" style={{ animationDelay: "320ms" }}>
                <StatCard label="Day Low" value={`$${quote.low.toFixed(2)}`} icon={<ArrowDownRight size={18} />} gradient="low" />
              </div>
            </div>

            <div className="section-header pt-2">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Compare Stocks</h2>
            </div>
            <TickerComparison />

            <div className="section-header pt-2">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Your Records</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RecordForm />
              </div>
              <div className="space-y-6">
                <CategoryPieChart />
                <ActivityFeed quote={quote} history={history} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
