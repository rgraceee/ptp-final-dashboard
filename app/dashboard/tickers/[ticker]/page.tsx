import Link from "next/link";
import StatCard from "@/components/StatCard";
import { getQuote, getOverview } from "@/lib/alphaVantage";

function formatMarketCap(raw: string) {
  const num = Number(raw);
  if (!num) return raw;
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

export default async function TickerPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();

  const [quote, overview] = await Promise.all([
    getQuote(symbol),
    getOverview(symbol),
  ]);

  return (
    <div className="p-6">
      <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
        ← Back to dashboard
      </Link>
      <h1 className="text-xl font-bold mb-4 mt-2 text-gray-900">{quote.symbol}</h1>
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
    </div>
  );
}