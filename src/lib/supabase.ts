import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Whether real backend credentials are present. */
export const hasSupabase = Boolean(url && anon);

/** Force mock data even when Supabase is configured. */
export const useMock =
  !hasSupabase || (import.meta.env.VITE_USE_MOCK as string) === "true";

/**
 * Supabase client, or null when credentials are absent. Every consumer must
 * handle the null case so the app stays fully usable on mock data alone.
 */
export const supabase: SupabaseClient | null = hasSupabase
  ? createClient(url!, anon!, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;

export const FUNCTIONS_URL = hasSupabase ? `${url}/functions/v1/financials` : null;
export const ANON_KEY = anon ?? null;
