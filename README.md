# Stock Analytics Dashboard

A full-stack stock analytics dashboard built with Next.js, Supabase, and Alpha Vantage. Users can sign up, log in, browse stock tickers with live market data, and maintain personal investment records with interactive charts.

## Features

- **Authentication** — Sign up and log in with email/password via Supabase Auth
- **Live Stock Data** — Real-time quotes, company overviews, and price history from Alpha Vantage
- **Interactive Charts** — Multiple Recharts chart types (Area, Line, Bar, Pie/Donut)
- **Personal Records** — Full CRUD for logging investment records (ticker, date, price, category, notes)
- **Filtering & Aggregation** — Filter records by date range, category, or ticker with computed stats
- **Ticker Directory** — Browse and compare stock tickers side by side

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| Market Data | Alpha Vantage API |
| Charts | Recharts |
| UI Utilities | Lucide React icons, SweetAlert2 |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Alpha Vantage](https://www.alphavantage.co/support/#api-key) API key

### 1. Clone and install

```bash
git clone https://github.com/rgraceee/ptp-final-dashboard.git
cd ptp-final-dashboard
npm install
```

### 2. Set up Supabase

Create a Supabase project and run the following SQL in the SQL Editor:

```sql
-- Tickers table
CREATE TABLE tickers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  company TEXT NOT NULL,
  description TEXT
);

-- Records table
CREATE TABLE records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT NOT NULL,
  date TEXT NOT NULL,
  price NUMERIC NOT NULL,
  notes TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Buy',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- Users can only access their own records
CREATE POLICY "Users can view own records"
  ON records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records"
  ON records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records"
  ON records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records"
  ON records FOR DELETE
  USING (auth.uid() = user_id);
```

Optionally seed the `tickers` table with stocks you want to track.

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Client/Server |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Client |
| `ALPHA_VANTAGE_API_KEY` | Your Alpha Vantage API key | Server |

## Architecture

```
ptp-final-dashboard/
├── app/
│   ├── api/
│   │   ├── history/[ticker]/    # Historical daily prices (Alpha Vantage)
│   │   ├── overview/[ticker]/   # Company fundamentals (Alpha Vantage)
│   │   ├── quote/[ticker]/      # Real-time quote (Alpha Vantage)
│   │   ├── records/             # CRUD for user records (Supabase)
│   │   ├── records/[id]/        # Update/delete individual record
│   │   ├── records/stats/       # Aggregate stats for records
│   │   ├── stock/[ticker]/      # Stock data with ticker validation
│   │   └── ticker/              # Ticker directory listing
│   ├── dashboard/
│   │   ├── page.tsx             # Main dashboard with charts & record form
│   │   ├── records/page.tsx     # Dedicated records management page
│   │   └── tickers/             # Ticker directory & comparison views
│   ├── login/page.tsx           # Login page
│   ├── signup/page.tsx          # Signup page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing/redirect page
├── components/
│   ├── CategoryPieChart.tsx     # Pie chart for category breakdown
│   ├── LoginForm.tsx            # Auth form (login/signup)
│   ├── PriceChart.tsx           # Area chart for price history
│   ├── RecordForm.tsx           # Add/edit records with validation
│   ├── RecordsFilters.tsx       # Date range, category, ticker filters
│   ├── RecordsPriceChart.tsx    # Area chart for record prices over time
│   ├── RecordsStats.tsx         # Summary stat cards
│   ├── RecordsTable.tsx         # Sortable records table with edit/delete
│   ├── TickerComparison.tsx     # Line + bar chart for multi-ticker comparison
│   └── TopBar.tsx               # Navigation bar with sign out
├── lib/
│   ├── alphaVantage.ts          # Alpha Vantage API client with caching
│   ├── RecordsContext.tsx        # React context for records state management
│   ├── supabase.ts              # Supabase browser client
│   ├── supabase-server.ts       # Supabase server client
│   └── types.ts                 # TypeScript type definitions
└── .env.local                   # Environment variables (gitignored)
```

### Data Flow

1. **Auth** — Supabase Auth handles sign-up, login, and session management on the client
2. **Stock Data** — API routes fetch from Alpha Vantage, cache with Next.js ISR (60s for quotes, 6h for history), and return to the client
3. **Records** — Client sends requests with the Supabase JWT in the `Authorization` header; API routes verify the user server-side before performing any database operation
4. **Charts** — Recharts components consume processed data and render responsive visualizations

## Deployment

### Vercel

1. Push to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add the three environment variables in Vercel project settings
4. Deploy — Vercel auto-detects the Next.js framework

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
