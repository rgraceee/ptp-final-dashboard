import Link from "next/link";

const TICKERS = [
  { symbol: "AAPL", company: "Apple Inc.", description: "Consumer electronics, iPhone, Mac" },
  { symbol: "MSFT", company: "Microsoft Corp.", description: "Software, cloud computing, Windows" },
  { symbol: "GOOGL", company: "Alphabet Inc.", description: "Search, advertising, Google services" },
  { symbol: "AMZN", company: "Amazon.com Inc.", description: "E-commerce, cloud (AWS), logistics" },
  { symbol: "NVDA", company: "Nvidia Corp.", description: "GPUs, AI chips, data centers" },
  { symbol: "META", company: "Meta Platforms Inc.", description: "Facebook, Instagram, social media" },
  { symbol: "TSLA", company: "Tesla Inc.", description: "Electric vehicles, energy storage" },
  { symbol: "JPM", company: "JPMorgan Chase & Co.", description: "Banking, investment services" },
  { symbol: "WMT", company: "Walmart Inc.", description: "Retail, grocery, e-commerce" },
  { symbol: "DIS", company: "The Walt Disney Company", description: "Media, entertainment, theme parks" },
  { symbol: "NFLX", company: "Netflix Inc.", description: "Streaming video, original content" },
  { symbol: "KO", company: "The Coca-Cola Company", description: "Beverages, soft drinks" },
];

export default function TickerDirectory() {
  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">Browse tickers</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">Ticker</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {TICKERS.map((t) => (
              <tr key={t.symbol} className="border-b border-gray-50 last:border-0 hover:bg-[var(--accent-light)] transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/${t.symbol}`}
                    className="font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    {t.symbol}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-900">{t.company}</td>
                <td className="px-4 py-3 text-gray-500">{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}