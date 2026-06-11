import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthProvider";
import type { WatchlistEntry } from "@/types";

const LS_KEY = "strata.watchlist";

function readLocal(): WatchlistEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeLocal(entries: WatchlistEntry[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(entries));
}

/**
 * Watchlist that lives in localStorage for anonymous visitors and syncs to a
 * Supabase table once signed in. On first sign-in, any local entries are
 * merged up to the account.
 */
export function useWatchlist() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WatchlistEntry[]>(() => readLocal());
  const [loading, setLoading] = useState(false);

  // Load (and merge) from Supabase when authenticated.
  useEffect(() => {
    let cancelled = false;
    async function sync() {
      if (!user || !supabase) {
        setEntries(readLocal());
        return;
      }
      setLoading(true);
      const local = readLocal();
      if (local.length) {
        await supabase.from("watchlist_items").upsert(
          local.map((e) => ({
            user_id: user.id,
            symbol: e.symbol,
            name: e.name,
            added_at: e.addedAt,
          })),
          { onConflict: "user_id,symbol" }
        );
        writeLocal([]);
      }
      const { data } = await supabase
        .from("watchlist_items")
        .select("symbol,name,added_at")
        .order("added_at", { ascending: false });
      if (!cancelled) {
        setEntries(
          (data ?? []).map((r) => ({ symbol: r.symbol, name: r.name, addedAt: r.added_at }))
        );
        setLoading(false);
      }
    }
    sync();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const has = useCallback(
    (symbol: string) => entries.some((e) => e.symbol === symbol),
    [entries]
  );

  const add = useCallback(
    async (symbol: string, name: string) => {
      if (has(symbol)) return;
      const entry: WatchlistEntry = { symbol, name, addedAt: new Date().toISOString() };
      const next = [entry, ...entries];
      setEntries(next);
      if (user && supabase) {
        await supabase
          .from("watchlist_items")
          .upsert(
            { user_id: user.id, symbol, name, added_at: entry.addedAt },
            { onConflict: "user_id,symbol" }
          );
      } else {
        writeLocal(next);
      }
    },
    [entries, has, user]
  );

  const remove = useCallback(
    async (symbol: string) => {
      const next = entries.filter((e) => e.symbol !== symbol);
      setEntries(next);
      if (user && supabase) {
        await supabase.from("watchlist_items").delete().eq("symbol", symbol);
      } else {
        writeLocal(next);
      }
    },
    [entries, user]
  );

  const toggle = useCallback(
    (symbol: string, name: string) => (has(symbol) ? remove(symbol) : add(symbol, name)),
    [add, has, remove]
  );

  return { entries, has, add, remove, toggle, loading };
}
