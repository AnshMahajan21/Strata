import { ANON_KEY, FUNCTIONS_URL, supabase, useMock } from "./supabase";
import {
  mockFinancials, mockPrices, mockProfile, mockRatios, mockSearch,
  mockAnalysis, mockCompare,
} from "./mockData";
import type {
  CompanyFinancials, CompanyProfile, KeyRatio, PricePoint, SearchResult,
  AIAnalysis, ComparisonResult,
} from "@/types";

async function callEdge<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const session = (await supabase?.auth.getSession())?.data.session ?? null;
  const qs = new URLSearchParams({ endpoint, ...params }).toString();
  const res = await fetch(`${FUNCTIONS_URL}?${qs}`, {
    headers: {
      Authorization: `Bearer ${session?.access_token ?? ANON_KEY ?? ""}`,
      apikey: ANON_KEY ?? "",
    },
  });
  if (!res.ok) throw new Error(`API error (${res.status})`);
  return (await res.json()) as T;
}

const delay = <T,>(v: T, ms = 220) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export const api = {
  search(query: string): Promise<SearchResult[]> {
    return useMock ? delay(mockSearch(query)) : callEdge("search", { query });
  },
  profile(symbol: string): Promise<CompanyProfile> {
    return useMock ? delay(mockProfile(symbol)) : callEdge("profile", { symbol });
  },
  prices(symbol: string): Promise<PricePoint[]> {
    return useMock ? delay(mockPrices(symbol)) : callEdge("prices", { symbol });
  },
  financials(symbol: string): Promise<CompanyFinancials> {
    return useMock ? delay(mockFinancials(symbol)) : callEdge("financials", { symbol });
  },
  ratios(symbol: string): Promise<KeyRatio[]> {
    return useMock ? delay(mockRatios(symbol)) : callEdge("ratios", { symbol });
  },
  analyze(symbol: string): Promise<AIAnalysis> {
    return useMock ? delay(mockAnalysis(symbol), 500) : callEdge("analyze", { symbol });
  },
  compare(symbols: string[]): Promise<ComparisonResult> {
    return useMock
      ? delay(mockCompare(symbols), 600)
      : callEdge("compare", { symbols: symbols.join(",") });
  },
};
