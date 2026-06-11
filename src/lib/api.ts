import {
  ANON_KEY,
  FUNCTIONS_URL,
  supabase,
  useMock,
} from "./supabase";
import {
  mockFinancials,
  mockPrices,
  mockProfile,
  mockRatios,
  mockSearch,
} from "./mockData";
import type {
  CompanyFinancials,
  CompanyProfile,
  KeyRatio,
  PricePoint,
  SearchResult,
} from "@/types";

/**
 * Calls the Supabase edge function which proxies Financial Modeling Prep so
 * the API key stays server-side. Falls back to bundled mock data whenever the
 * backend is not configured (useMock) — the app is always runnable.
 */
async function callEdge<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const session = (await supabase?.auth.getSession())?.data.session ?? null;
  const qs = new URLSearchParams({ endpoint, ...params }).toString();
  const res = await fetch(`${FUNCTIONS_URL}?${qs}`, {
    headers: {
      Authorization: `Bearer ${session?.access_token ?? ANON_KEY ?? ""}`,
      apikey: ANON_KEY ?? "",
    },
  });
  if (!res.ok) throw new Error(`Financials API error (${res.status})`);
  return (await res.json()) as T;
}

// Tiny latency so loading states are visible on mock data.
const delay = <T,>(v: T, ms = 220) =>
  new Promise<T>((r) => setTimeout(() => r(v), ms));

export const api = {
  search(query: string): Promise<SearchResult[]> {
    if (useMock) return delay(mockSearch(query));
    return callEdge<SearchResult[]>("search", { query });
  },
  profile(symbol: string): Promise<CompanyProfile> {
    if (useMock) return delay(mockProfile(symbol));
    return callEdge<CompanyProfile>("profile", { symbol });
  },
  prices(symbol: string): Promise<PricePoint[]> {
    if (useMock) return delay(mockPrices(symbol));
    return callEdge<PricePoint[]>("prices", { symbol });
  },
  financials(symbol: string): Promise<CompanyFinancials> {
    if (useMock) return delay(mockFinancials(symbol));
    return callEdge<CompanyFinancials>("financials", { symbol });
  },
  ratios(symbol: string): Promise<KeyRatio[]> {
    if (useMock) return delay(mockRatios(symbol));
    return callEdge<KeyRatio[]>("ratios", { symbol });
  },
};
