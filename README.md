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

## Local development

Requirements: Node.js 18 or 20 and above.

```bash
npm install
npm run dev
```

The dev server starts on http://localhost:5173 and runs on mock data out of the
box. Search for RELIANCE, TCS, or INFY to explore the UI.

Scripts:

- `npm run dev` starts the Vite dev server
- `npm run build` type checks with `tsc -b` and produces a production build in `dist`
- `npm run preview` serves the production build locally
- `npm run lint` runs ESLint

## Environment variables

Frontend variables are read by Vite and must be prefixed with `VITE_`. Copy
`.env.example` to `.env` and fill in the values when connecting a backend.

- `VITE_SUPABASE_URL` Supabase project URL. Leave blank to force mock data.
- `VITE_SUPABASE_ANON_KEY` Supabase anon public key.
- `VITE_USE_MOCK` set to `true` to force mock data even when Supabase is set.

The data provider key is a server side secret, set on the edge function and
never exposed to the browser:

- `ALPHAVANTAGE_API_KEY` Alpha Vantage key.
- `EXCHANGE_SUFFIX` exchange suffix for symbols, default `.BSE`.

## Backend setup in brief

1. Create a Supabase project and run `supabase/migrations/0001_init.sql` in the
   SQL editor to create tables and policies.
2. Deploy the `financials` edge function and set `ALPHAVANTAGE_API_KEY` as a
   secret. This can be done through the Supabase dashboard editor.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the frontend
   environment, locally in `.env` or in the Vercel project settings.

## Notes and limits

Alpha Vantage's free tier allows roughly 25 requests per day and 5 per minute.
A full company view costs about seven calls, so the edge function caches
responses for 24 hours in the `cached_financials` table. Rate limit responses
are detected and never cached. Coverage for some .BSE tickers can be sparse, in
which case empty ratio cells render as a dash.

All mock figures are illustrative and the app is not investment advice.
