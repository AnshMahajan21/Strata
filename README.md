# Strata

Strata is a single-page web app for browsing Indian company fundamentals.
It presents income statements, balance sheets, cash flow, key ratios, and price
history for NSE/BSE listed companies, with values in INR using the lakh and crore
system. The interface follows an editorial dark theme.

The app is built so it runs end to end on bundled mock data with no backend.
Adding Supabase credentials and an Alpha Vantage key switches it to live data
without any code changes.

## Tech stack

Frontend:

- React 18 with TypeScript
- Vite 5 for dev server and bundling
- Tailwind CSS 3 for styling
- React Router 6 for routing
- TanStack Query 5 for data fetching and caching
- Recharts 2 for charts, lucide-react for icons

Backend and hosting:

- Supabase for Auth and Postgres, with Row Level Security
- A Supabase Edge Function (Deno) that proxies the data provider
- Alpha Vantage as the financial data source (.BSE symbols)
- Vercel for frontend hosting

## Architecture

The browser never talks to the data provider directly. Requests flow through a
Supabase Edge Function that holds the Alpha Vantage key server side, normalises
responses into the shapes the UI expects, and caches results in Postgres to
respect the provider's free tier limits.

```
React (Vite)  ->  Supabase Edge Function  ->  Alpha Vantage
   |                (holds API key,              (Indian fundamentals)
   |                 caches in Postgres)
   +->  Supabase Auth and Postgres (watchlists, RLS)
```

Data access is centralised in `src/lib/api.ts`. When Supabase credentials are
absent, or when `VITE_USE_MOCK` is set to `true`, that layer returns bundled
mock data from `src/lib/mockData.ts` instead of calling the edge function. This
keeps the app fully runnable during local development.

Authentication is optional. Anonymous visitors can browse everything and keep a
watchlist in localStorage. Signing in with Supabase Auth syncs the watchlist to
Postgres and merges any local entries into the account.

## Project structure

```
src/
  lib/         Supabase client, API layer with mock fallback, formatting, mock data
  types/       Shared TypeScript interfaces
  hooks/       useCompany (queries), useWatchlist (local and cloud sync)
  context/     AuthProvider
  components/  ui, charts, company, and layout components
  pages/       Landing, Dashboard, Company, Watchlist, Login, NotFound
supabase/
  migrations/  0001_init.sql (schema, RLS policies, signup trigger)
  functions/   financials/ (Alpha Vantage proxy with a Postgres cache)
```

## APIs
 
Alpha Vantage (data source, called only from the edge function using .BSE symbols):
 
- `SYMBOL_SEARCH` ticker search
- `OVERVIEW` company profile, market cap, key ratios
- `GLOBAL_QUOTE` current price and daily change
- `TIME_SERIES_DAILY` historical price for the chart
- `INCOME_STATEMENT` revenue, profit, margins
- `BALANCE_SHEET` assets, liabilities, equity
- `CASH_FLOW` operating cash flow, capex, free cash flow
Supabase:
 
- `Auth` optional email/password sign in
- `Postgres` stores profiles, watchlists, search history, cached financials (with Row Level Security)
- `Edge Function (financials)` proxies Alpha Vantage, normalises responses, caches them

## Notes and limits

Alpha Vantage's free tier allows roughly 25 requests per day and 5 per minute.
A full company view costs about seven calls, so the edge function caches
responses for 24 hours in the `cached_financials` table. Rate limit responses
are detected and never cached. Coverage for some .BSE tickers can be sparse, in
which case empty ratio cells render as a dash.

All mock figures are illustrative and the app is not investment advice.

## Disclaimer
 
Mock figures are illustrative only. Strata is a tool for reading financials and
is not investment advice.

