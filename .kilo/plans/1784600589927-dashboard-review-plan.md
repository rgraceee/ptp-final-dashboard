# Dashboard Codebase Review & Improvement Plan

## PHASE 1: ANALYSIS

### ✅ Correct
- Next.js 16 App Router structure with proper `layout.tsx`, `loading.tsx`, `error.tsx` files
- Server Component usage in `tickers/[ticker]/page.tsx` with async params
- Supabase SSR package installed (`@supabase/ssr`)
- Recharts used for data visualization with proper responsive containers
- Mock data fallbacks in `alphaVantage.ts` for API downtime
- Auth guards on dashboard pages via `useEffect` redirects
- Loading skeleton components in `dashboard/loading.tsx` and `tickers/[ticker]/loading.tsx`
- Error boundaries implemented via `error.tsx` files
- Form validation on records (ticker, date, price required)
- Proper TypeScript typing for most data structures

### ❌ Critical Issues (Build-Breaking)
1. **Missing `lib/supabase.ts`**: Multiple client components import `@/lib/supabase` but only `lib/supabase-server.ts` exists. This causes build/import failures.
2. **Client-side AlphaVantage fetch broken**: `dashboard/page.tsx` (a `"use client"` component) directly imports and calls `getQuote`, `getOverview`, `getDailyHistory` from `lib/alphaVantage.ts`. These functions use `next: { revalidate }` (server-only fetch option) and `process.env.ALPHA_VANTAGE_API_KEY` (server-only env var without `NEXT_PUBLIC_` prefix). This will fail in the browser.
3. **RecordsContext is non-functional**: `lib/RecordsContext.tsx` has empty `RecordsContextType` and empty provider value `{}`. It provides no state management.

### ⚠️ Needs Improvement
1. **API auth bypass in client code**: Client-side `fetch()` calls to `/api/records` don't send Authorization headers, but the API routes validate auth. Unauthenticated requests will get 401.
2. **Unprotected API routes**: `/api/test-db` has no auth and exposes raw database records. Ticker routes (`/api/ticker`) have no auth for POST/DELETE.
3. **Type inconsistencies**: `RecordType` is duplicated in `components/RecordsTable.tsx` and `components/RecordForm.tsx`. `price` is typed as `number` in some places and returned as `string` from AlphaVantage.
4. **Duplicate `formatMarketCap`**: Defined in both `dashboard/page.tsx` and `tickers/[ticker]/page.tsx` with different fallback behavior.
5. **No `response.ok` checks**: Client-side `fetch()` calls often skip checking `response.ok` before parsing JSON, leading to confusing errors.
6. **Unused `RefreshButton` component**: Defined in `components/RefreshButton.tsx` but never imported or used.
7. **Date filtering edge case**: String comparison for dates works for ISO format but lacks validation for invalid date inputs.
8. **Hardcoded `"Buy"` default category**: No validation or domain-specific category management.
9. **`confirm()` for delete**: Uses native `window.confirm` which blocks the UI thread and has poor UX.
10. **AlphaVantage rate limiting**: No client-side throttling or debouncing on search/refresh.

### ❌ Missing
1. **Environment variable validation**: No check that required env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ALPHA_VANTAGE_API_KEY`) are present at build/runtime.
2. **Client-side Supabase instance**: Missing `lib/supabase.ts` for browser auth operations.
3. **Proper error boundaries**: `error.tsx` exists but doesn't use the `reset` function properly in all cases, and there's no global error boundary.
4. **API route for quote/overview/history on dashboard**: Dashboard needs server-side API routes since it can't call AlphaVantage directly from client.
5. **Loading states for table/forms**: No skeleton loaders for records table or form submission states.
6. **Form validation feedback**: No inline validation errors (e.g., "Price must be positive", "Date is required").
7. **Pagination for records**: No limit/sort on records API or table - could be slow with many records.
8. **Responsive design checks**: No mobile-specific layout adjustments.
9. **Accessibility**: Missing proper ARIA labels, focus management, and keyboard navigation in some interactive elements.
10. **Retry logic**: No retry mechanism for failed API calls (AlphaVantage, Supabase).

## PHASE 2: IMPLEMENTATION PLAN

### Task 1: Fix Critical Build-Breaking Issues
- **1a**: Create `lib/supabase.ts` with browser-compatible Supabase client using `@supabase/ssr` `createBrowserClient`.
- **1b**: Create API routes `/api/quote/[ticker]` and `/api/overview/[ticker]` to proxy AlphaVantage data server-side.
- **1c**: Update `dashboard/page.tsx` to call the new API routes instead of directly importing `alphaVantage.ts` functions.
- **1d**: Remove direct `getQuote`/`getOverview`/`getDailyHistory` imports from client components; ensure all AlphaVantage calls go through server-side API routes or server components.

### Task 2: Fix RecordsContext
- **2a**: Define proper `RecordsContextType` with `records`, `addRecord`, `updateRecord`, `deleteRecord`, `loading`, `error`.
- **2b**: Implement context provider with actual state and CRUD operations.
- **2c**: Refactor `RecordForm` to use `useRecords()` hook instead of local state + fetch.
- **2d**: Optionally refactor `RecordsTable` to consume context directly for live updates.

### Task 3: Fix API Auth & Security
- **3a**: Add auth middleware or helper to all mutating API routes (`POST /api/records`, `PUT /api/records/[id]`, `DELETE /api/records/[id]`, `POST /api/ticker`, `DELETE /api/ticker/[id]`).
- **3b**: Protect or remove `/api/test-db` route (remove for production, or gate behind auth + env flag).
- **3c**: Update client-side fetch calls to send `credentials: "include"` and handle 401 responses by redirecting to login.

### Task 4: Improve Type Safety
- **4a**: Extract shared `RecordType` to `lib/types.ts` and import everywhere.
- **4b**: Normalize `price` type to `number` in all types and API responses; format to string only in UI components.
- **4c**: Consolidate `formatMarketCap` into `lib/utils.ts` with consistent fallback behavior.
- **4d**: Add proper Zod or manual validation schemas for API route inputs.

### Task 5: Improve UX & Error Handling
- **5a**: Add `response.ok` checks and proper error messages to all client-side `fetch()` calls.
- **5b**: Replace `window.confirm` with a custom confirmation modal or at minimum a better UX pattern.
- **5c**: Add form validation errors (inline text) for required fields and invalid inputs.
- **5d**: Add loading spinners/skeletons for records table and form submission.
- **5e**: Add retry button/functionality for failed AlphaVantage fetches.

### Task 6: Cleanup & Optimization
- **6a**: Remove unused `RefreshButton` component or integrate it into the dashboard.
- **6b**: Add debounce to search bar input to reduce API calls.
- **6c**: Add `NEXT_PUBLIC_` prefix to any env vars that need to be accessed client-side (none currently needed if API routes are used).
- **6d**: Add env var validation at app startup (create `lib/env.ts` with runtime checks).
- **6e**: Add pagination parameters to `/api/records` (e.g., `?page=1&limit=50`).
- **6f**: Ensure consistent error response shapes across all API routes (`{ error: string }`).

### Task 7: Next.js 16 Specifics
- **7a**: Review all dynamic route params usage to ensure `await params` pattern is used consistently.
- **7b**: Verify `next.config.ts` has no deprecated options for Next.js 16.
- **7c**: Check that `use client` boundaries are minimal and correct (no server-only code leaking into client bundles).

### Validation Steps
1. Run `next build` and fix all TypeScript/build errors.
2. Run `next lint` and fix all lint errors.
3. Verify `lib/supabase.ts` is correctly created and imports resolve.
4. Test auth flow: signup → login → dashboard → logout.
5. Test record CRUD: add, edit, delete records with proper auth.
6. Test ticker search and comparison with new API routes.
7. Test error states: invalid ticker, network failure, empty data.
8. Verify AlphaVantage API calls only happen server-side.
