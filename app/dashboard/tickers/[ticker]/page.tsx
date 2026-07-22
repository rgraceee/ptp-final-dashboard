import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StatCard from "@/components/StatCard";
import { getQuote, getOverview } from "@/lib/alphaVantage";
import { TrendingUp, BarChart3, Wallet, DollarSign, AudioLines } from "lucide-react";

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
    <div className="min-h-screen gradient-soft">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="section-header">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">{quote.symbol}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <StatCard
            label={`${quote.symbol} Price`}
            value={`$${quote.price}`}
            change={quote.changePercent}
            icon={<TrendingUp size={18} />}
            gradient="price"
            highlight
          />
          <StatCard
            label="Open Price"
            value={`$${quote.open}`}
            icon={<BarChart3 size={18} />}
            gradient="open"
          />
          <StatCard
            label="Volume"
            value={quote.volume}
            icon={<AudioLines size={18} />}
            gradient="volume"
          />
          <StatCard
            label="Market Cap"
            value={formatMarketCap(overview.marketCap)}
            icon={<DollarSign size={18} />}
            gradient="cap"
          />
        </div>
      </div>
    </div>
  );
}
