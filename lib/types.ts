export type RecordType = {
  id: string;
  ticker: string;
  date: string;
  price: number;
  notes: string;
  category: string;
  user_id?: string | null;
};

export type RecordStats = {
  totalRecords: number;
  totalValue: number;
  averagePrice: number;
  latestEntry: { date: string; ticker: string } | null;
};

export type Ticker = {
  id: string;
  symbol: string;
  company: string;
  description: string;
};

export type QuoteType = {
  symbol: string;
  price: number;
  changePercent: string;
  open: number;
  high: number;
  low: number;
  volume: string;
  isMock: boolean;
};

export type OverviewType = {
  name: string;
  sector: string;
  industry: string;
  marketCap: string;
  description: string;
  isMock: boolean;
};

export type HistoryPoint = {
  date: string;
  close: number;
  isMock: boolean;
};
