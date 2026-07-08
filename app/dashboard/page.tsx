import StatCard from "@/components/StatCard";
import SearchBar from "@/components/SearchBar";
import TickerDirectory from "@/components/TickerDirectory";
import PriceChart from "@/components/PriceChart";
import { getOverview, getDailyHistory } from "@/lib/alphaVantage";
import TickerComparison from "@/components/TickerComparison";
import Link from "next/link";

const TICKER = "AAPL";

function formatMarketCap(raw: string) {
  const num = Number(raw);
  if (!num) return raw;
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

async function getQuoteFromRoute(symbol: string) {
  const res = await fetch(`http://localhost:3000/api/stock/${symbol}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Stock API route failed: ${res.status}`);
  return res.json();
}

export default async function DashboardPage() {
  const [quote, overview, history] = await Promise.all([
    getQuoteFromRoute(TICKER),
    getOverview(TICKER),
    getDailyHistory(TICKER),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-gray-900">Dashboard</h1>
      <div className="flex items-center gap-3 mb-4">
  <SearchBar />
  <Link
    href="/dashboard/records"
    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-transform hover:scale-105 whitespace-nowrap"
    style={{ background: "var(--accent)" }}
  >
    <span className="text-base leading-none">+</span> Add Manual Record
  </Link>
</div>
      <div className="flex flex-wrap gap-4">
        <StatCard
          label={`${quote.symbol} Price`}
          value={`$${quote.price}`}
          change={quote.changePercent}
        />
        <StatCard label="Open Price" value={`$${quote.open}`} />
        <StatCard label="Volume" value={quote.volume} />
        <StatCard label="Market Cap" value={formatMarketCap(overview.marketCap)} />
      </div>
      <PriceChart data={history} />
      <TickerComparison />
      <TickerDirectory />
    </div>
  );
}