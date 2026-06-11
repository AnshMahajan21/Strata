import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useProfile(symbol: string) {
  return useQuery({
    queryKey: ["profile", symbol],
    queryFn: () => api.profile(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePrices(symbol: string) {
  return useQuery({
    queryKey: ["prices", symbol],
    queryFn: () => api.prices(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFinancials(symbol: string) {
  return useQuery({
    queryKey: ["financials", symbol],
    queryFn: () => api.financials(symbol),
    enabled: !!symbol,
    staleTime: 30 * 60 * 1000,
  });
}

export function useRatios(symbol: string) {
  return useQuery({
    queryKey: ["ratios", symbol],
    queryFn: () => api.ratios(symbol),
    enabled: !!symbol,
    staleTime: 30 * 60 * 1000,
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => api.search(query),
    staleTime: 60 * 1000,
  });
}
