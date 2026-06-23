# Strata

Single-page app for analysing US (NYSE/NASDAQ) company fundamentals in USD:
income statement, balance sheet, cash flow, key ratios, and price history, plus
an AI financial analyst and a side-by-side comparator that picks the strongest
of up to three companies.

## Tech stack

- React 18 + TypeScript
- Vite 5 (dev server and bundler)
- Tailwind CSS 3
- React Router 6
- TanStack Query 5 (fetching and caching)
- Recharts 2 (charts), lucide-react (icons)
- Supabase (Auth, Postgres, Edge Functions on Deno)
- Google Gemini for AI analysis
- Vercel (hosting)

## APIs

Financial Modeling Prep (data source, US tickers, called only from the edge function):

- `search` ticker search
- `profile` company profile, price, market cap
- `historical-price-full` price history for the chart
- `income-statement`, `balance-sheet-statement`, `cash-flow-statement` financial statements
- `key-metrics-ttm` P/E, P/S, net margin, ROE

Google Gemini (`gemini-1.5-flash`):

- `analyze` generates a per-company financial-health narrative (verdict, summary, strengths, risks)
- `compare` generates the reasoning and per-company notes for the winner

Supabase:

- `Auth` optional email sign-in
- `Postgres` profiles, watchlists, search history, cached financials and AI results (Row-Level Security)
- `Edge Function (financials)` proxies FMP and Gemini, normalises responses, caches them 24h

## Features

- Company page with price chart, full financial statements, and key ratios
- AI Financial Analyst: a 0-100 health score computed from the fundamentals, with an AI-written assessment, strengths, and risks
- Comparator: stack up to 3 companies on their metrics, with AI summaries and an AI verdict naming the strongest stock
- Watchlist: saved locally for guests and synced to the account on sign-in

## How the AI works

Numeric scores are computed deterministically from real figures (revenue growth,
net margin, free cash flow, leverage), so they are grounded rather than guessed.
Gemini is asked only for the written narrative and the comparison reasoning. If
no Gemini key is set, the app falls back to a fully computed analysis, so the
feature never appears empty.

## Structure

```
src/
  lib/         supabase client, api (mock fallback), format, mockData (incl. mock AI)
  types/       shared TypeScript interfaces
  hooks/       useCompany (queries incl. useAnalysis, useComparison), useWatchlist
  context/     AuthProvider
  components/  ui, charts, company (incl. AIAnalysisCard), layout
  pages/       Landing, Dashboard, Company, Compare, Watchlist, Login, NotFound
supabase/
  migrations/  0001_init.sql       schema, RLS policies, signup trigger
  functions/   financials/index.ts FMP + Gemini proxy with a Postgres cache
```

## Notes

- Runs on bundled US mock data (with a computed AI analysis) when no backend is configured.
- API keys stay server-side in the edge function and never reach the browser.
- FMP free tier allows ~250 requests/day; responses cache 24h, which matters for the comparator (it pulls up to 3 companies).
- Gemini has a free tier; the app degrades gracefully to computed analysis without it.

## Disclaimer

Mock figures are illustrative. Strata is for reading and analysing financials and is not investment advice.
