# Dashboard Refactor Plan (Days 22–27)

## Confirmed Design Decision

**Option A — Market-first dashboard.** The dashboard retains market stat cards (Price, Open, Volume, Market Cap) and the PriceChart at the top as the primary view. The user's personal investment records (form, filters, table, stats, records chart, pie chart) sit below as a secondary portfolio tracker.

---

## Critical Corrections to Initial Plan

The following issues in the first draft must be fixed before implementation:

| # | Correction | Why |
|---|-----------|-----|
| C1 | Task 1.3: Do NOT use `loading \|\| !quote`. This keeps "Loading..." visible during errors, which is misleading. Use `!quote ? <ErrorOrLoading /> : <StatCards />` instead. | Proper error UX |
| C2 | Task 3: `tickerBreakdown` groups by ticker symbol, but `CategoryPieChart` needs category breakdown (Buy/Sell). These are different dimensions. Add `categoryBreakdown` to the stats API instead. | Data shape mismatch |
| C3 | Task 5.3: REMOVE. `RecordsProvider` does NOT auto-fetch on mount — it only provides functions. `RecordForm`'s `useEffect` is the correct initial trigger. Removing it would break data loading. | Incorrect assumption |
| C4 | Stats row vs table mismatch: `RecordsStats` shows global stats (all records), but `RecordsTable` shows filtered records. When filters are active, the stats don't reflect the visible subset. | UX inconsistency |

---

## Current State Audit

### What Works
- Supabase auth with redirect to `/login` for unauthenticated users (`app/dashboard/page.tsx:34-48`)
- API routes filter by `user_id` on GET and verify ownership on PUT/DELETE (`app/api/records/[id]/route.ts:188-196, 438-445`)
- RecordsContext centralizes records state and CRUD operations
- Stats API returns correct aggregations per user (`app/api/records/stats/route.ts`)
- RecordsTable has working sort by date/price/ticker
- Server-side validation on POST (required fields, price > 0)
- Market data routes (`/api/quote`, `/api/history`) are correctly public — no auth needed

### Issues Found

| # | Issue | Severity | File(s) |
|---|-------|----------|---------|
| 1 | `fade-in` animation replays on every mount causing flicker | High | `components/StatCard.tsx:11`, `app/globals.css:64-77` |
| 2 | No skeleton cards for stat cards during loading | Medium | `app/dashboard/page.tsx:177-179` |
| 3 | Error state renders `$0` values briefly before error message | Medium | `app/dashboard/page.tsx:98-99, 182-198` |
| 4 | `TickerDirectory` — full browsable ticker table is dashboard clutter | High | `components/TickerDirectory.tsx` |
| 5 | `TickerComparison` — heavy multi-ticker fetch, not core to records dashboard | High | `components/TickerComparison.tsx` |
| 6 | `CategoryPieChart` fetches ALL records client-side instead of using stats API | Medium | `components/CategoryPieChart.tsx:83-98` |
| 7 | GET `/api/records` returns "guest records" (`user_id null`) to unauthenticated users | High | `app/api/records/route.ts:154-162` |
| 8 | No "Clear Filters" button in RecordsFilters | Low | `components/RecordsFilters.tsx` |
| 9 | No empty state for "no results after filtering" | Medium | `components/RecordsTable.tsx:55-64` only covers "no records" |
| 10 | `RecordsPriceChart` has no loading awareness | Low | `components/RecordsPriceChart.tsx` |
| 11 | Stats row shows global stats while table shows filtered records | Medium | `components/RecordsStats.tsx` + `components/RecordForm.tsx` |
| 12 | `RefreshButton` component defined but never imported/used | Low | `components/RefreshButton.tsx` |
| 13 | No pagination limit on GET `/api/records` | Low | `app/api/records/route.ts` |

---

## Implementation Plan

### Task 1: Fix Stat Card Flickering and Error Flash
**Files:** `components/StatCard.tsx`, `app/globals.css`, `app/dashboard/page.tsx`

1. Remove `fade-in` class from `StatCard` — the loading skeleton already provides smooth entry.
2. Replace the single "Loading dashboard..." text with 4 skeleton cards matching the actual layout (card shape with shimmer).
3. Replace the ternary `loading && !quote ? ... : <cards>` with:
   ```tsx
   {!quote ? (
     <p className="text-gray-500">{error || "Loading dashboard..."}</p>
   ) : (
     // stat cards
   )}
   ```
   This eliminates the `$0` flash and shows the actual error message when data fails to load.

### Task 2: Remove Unnecessary Dashboard Components
**Files:** `app/dashboard/page.tsx`

1. Remove `<TickerDirectory />` from the dashboard. Users already have `SearchBar` for ticker lookup.
2. Remove `<TickerComparison />` from the dashboard. This is a separate feature with heavy parallel API calls.
3. Remove imports for both components.

### Task 3: Fix CategoryPieChart Data Flow
**Files:** `app/api/records/stats/route.ts`, `components/CategoryPieChart.tsx`

1. Add `categoryBreakdown` to the stats API response. Compute it server-side by grouping records by `category` (Buy/Sell) with count and total value.
2. Update `CategoryPieChart` to fetch `/api/records/stats` instead of `/api/records`.
3. Transform `categoryBreakdown` into pie chart format (name/value) from the stats response.
4. This eliminates a redundant full-records API call and ensures the chart shows only the current user's data.

### Task 4: Harden Security — Remove Guest Record Access
**Files:** `app/api/records/route.ts`

1. Remove the guest fallback logic (lines 154-162). If no valid token/user, return 401.
2. The login page (`app/login/page.tsx`) does not call `/api/records`, so this change is safe.

### Task 5: Fix Stats/Filter Mismatch
**Files:** `components/RecordForm.tsx`, `components/RecordsStats.tsx`

1. In `RecordForm`, compute derived stats from `filteredRecords` (total count, total value, average price, latest entry).
2. Pass these computed stats to `RecordsStats` instead of the global context `stats`.
3. Keep context `stats` available for other uses if needed, but the displayed stats row should reflect what's visible in the table.

### Task 6: Improve Filter UX
**Files:** `components/RecordsFilters.tsx`, `components/RecordsTable.tsx`

1. Add a "Clear Filters" button that resets all filter state to defaults.
2. Add a "No results" empty state in `RecordsTable` when `filteredRecords` is empty but `records.length > 0`.
3. Keep existing "No records yet" state for when `records.length === 0`.

### Task 7: Add Loading Skeletons
**Files:** `components/RecordsPriceChart.tsx`, `components/RecordsStats.tsx`, `app/dashboard/loading.tsx`

1. Add a `loading` prop to `RecordsPriceChart`. When `loading=true`, show a skeleton chart container (card with shimmer).
2. Add skeleton placeholders to `RecordsStats` (shimmer bars instead of "...").
3. Update `app/dashboard/loading.tsx` to match the final layout: 4 stat card skeletons + chart skeleton + records section skeleton.

### Task 8: Form Validation Improvements
**Files:** `app/api/records/route.ts`, `components/RecordForm.tsx`

1. **Server-side** (`app/api/records/route.ts`):
   - Ticker: 1-5 uppercase letters only (`/^[A-Z]{1,5}$/`)
   - Date: valid ISO date string, not in the future
   - Price: > 0 and < 1,000,000
2. **Client-side** (`components/RecordForm.tsx`):
   - Add `min="0.01" step="0.01"` to price input
   - Add `maxLength={5}` and pattern validation to ticker input
   - Add `max={today}` to date input
   - Show inline validation errors below each field before submit

### Task 9: Remove Dead Code
**Files:** `components/RefreshButton.tsx`

1. Delete `RefreshButton.tsx`. The dashboard already has an inline refresh button. This component is defined but never imported anywhere.

### Task 10: Add Pagination Safety
**Files:** `app/api/records/route.ts`

1. Add a query limit (e.g., `.limit(1000)`) to prevent unbounded result sets. For a personal tracker this is effectively unlimited, but it protects against accidental bulk data scenarios.

### Task 11: Code Cleanup
**Files:** All components with inconsistent formatting

1. Normalize formatting: consistent prop wrapping (single line or multi-line, pick one style per file), remove random blank lines between JSX attributes.
2. Ensure consistent error message formatting.

---

## Data Flow (Final Design)

```
Client (Dashboard)
  ├── Market Data (public)
  │     ├── GET /api/quote/{ticker}
  │     ├── GET /api/overview/{ticker}
  │     └── GET /api/history/{ticker}
  │
  └── User Records (authenticated)
        ├── GET /api/records          → returns only this user's records (with limit)
        ├── GET /api/records/stats    → returns aggregations + categoryBreakdown for this user
        ├── POST /api/records         → creates with user_id from session
        ├── PUT /api/records/{id}     → verifies ownership before update
        └── DELETE /api/records/{id}  → verifies ownership before delete

Filtering: Client-side on fetched records (sufficient for personal use)
Stats display: Derived from filteredRecords client-side so stats match visible table rows
Charts: RecordsPriceChart from filteredRecords; CategoryPieChart from stats API categoryBreakdown
```

---

## Validation Checklist

- [ ] Stat cards render without flicker on initial load and after refresh
- [ ] No `$0` flash on error or during data transitions
- [ ] Error message displays correctly when market data fetch fails
- [ ] Dashboard no longer renders TickerDirectory or TickerComparison
- [ ] CategoryPieChart uses `/api/records/stats` with `categoryBreakdown`, not full records fetch
- [ ] Unauthenticated request to `/api/records` returns 401, not guest records
- [ ] Stats row reflects filtered data when filters are active
- [ ] Filters have a Clear button
- [ ] Empty state shows "no results" when filters match nothing (distinct from "no records yet")
- [ ] Loading skeletons present for stat cards, stats row, and records chart
- [ ] Form validates: ticker 1-5 uppercase letters, date not in future, price > 0
- [ ] Inline validation errors appear near relevant fields
- [ ] `RefreshButton.tsx` deleted
- [ ] `GET /api/records` has a result limit
- [ ] Responsive layout works on mobile (test at 320px width)

---

## Out of Scope

- RLS SQL migration verification (verify in Supabase dashboard)
- Moving TickerDirectory/TickerComparison to separate routes (removed from dashboard only)
- Server-side filtering with query params (client-side is sufficient for personal use)
- Pagination UI (limit of 1000 is sufficient for personal tracker)
- Rate limiting / caching for market data APIs
- Dark mode / theme system
- Real-time subscriptions for records updates
