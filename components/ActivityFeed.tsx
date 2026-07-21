"use client";

import { useMemo } from "react";
import { QuoteType, HistoryPoint } from "@/lib/types";

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "price" | "volume" | "market" | "record";
};

type Props = {
  quote?: QuoteType | null;
  history?: HistoryPoint[];
  records?: Array<{ date: string; ticker: string; price: number; category: string }>;
};

export default function ActivityFeed({ quote, history, records }: Props) {
  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    if (quote) {
      items.push({
        id: "quote-price",
        title: `${quote.symbol} Price Update`,
        description: `Current price: $${quote.price.toFixed(2)} (${quote.changePercent})`,
        time: "Just now",
        type: "price",
      });
    }

    if (history && history.length > 0) {
      items.push({
        id: "history-point",
        title: "Historical Data Loaded",
        description: `${history.length} data points available for analysis`,
        time: "Recent",
        type: "market",
      });
    }

    if (records && records.length > 0) {
      const latest = records[0];
      items.push({
        id: "latest-record",
        title: "Latest Record",
        description: `${latest.category} ${latest.ticker} @ $${Number(latest.price).toFixed(2)}`,
        time: latest.date,
        type: "record",
      });
    }

    return items.slice(0, 6);
  }, [quote, history, records]);

  const typeStyles: Record<ActivityItem["type"], { dot: string; bg: string }> = {
    price: { dot: "bg-emerald-500", bg: "bg-emerald-50" },
    volume: { dot: "bg-blue-500", bg: "bg-blue-50" },
    market: { dot: "bg-purple-500", bg: "bg-purple-50" },
    record: { dot: "bg-orange-500", bg: "bg-orange-50" },
  };

  return (
    <div className="card-static p-5">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
        Activity Feed
      </h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity.</p>
        ) : (
          activities.map((item) => {
            const style = typeStyles[item.type];
            return (
              <div key={item.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                  <div className="w-px flex-1 bg-gray-100 mt-1" />
                </div>
                <div className="flex-1 min-w-0 pb-4">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{item.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
