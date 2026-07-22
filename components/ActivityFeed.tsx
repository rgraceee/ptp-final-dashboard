"use client";

import { useMemo } from "react";
import { QuoteType, HistoryPoint } from "@/lib/types";
import { TrendingUp, BarChart3, Globe, ClipboardList } from "lucide-react";

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

  const typeStyles: Record<ActivityItem["type"], { dot: string; bg: string; icon: typeof TrendingUp }> = {
    price: { dot: "bg-emerald-500", bg: "bg-emerald-50", icon: TrendingUp },
    volume: { dot: "bg-blue-500", bg: "bg-blue-50", icon: BarChart3 },
    market: { dot: "bg-purple-500", bg: "bg-purple-50", icon: Globe },
    record: { dot: "bg-orange-500", bg: "bg-orange-50", icon: ClipboardList },
  };

  return (
    <div className="card-static p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        Activity Feed
      </h3>
      <div className="space-y-0">
        {activities.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No recent activity.</p>
        ) : (
          activities.map((item) => {
            const style = typeStyles[item.type];
            const Icon = style.icon;
            return (
              <div key={item.id} className="flex gap-3 group/item">
                <div className="flex flex-col items-center pt-1">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${style.bg} ${style.dot.replace("bg-", "text-")} opacity-80 group-hover/item:opacity-100 transition-opacity`}>
                    <Icon size={14} className={style.dot.replace("bg-", "text-")} />
                  </div>
                  <div className="w-px flex-1 bg-[var(--border-subtle)] mt-1.5" />
                </div>
                <div className="flex-1 min-w-0 pb-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.description}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">{item.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
