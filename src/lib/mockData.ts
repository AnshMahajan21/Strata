import type {
  CompanyProfile,
  CompanyFinancials,
  PricePoint,
  SearchResult,
  KeyRatio,
} from "@/types";

/**
 * Bundled mock data — Indian equities (NSE). Illustrative only, not market data.
 * All monetary values are in INR (raw rupees).
 */

export const MOCK_SYMBOLS: SearchResult[] = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", exchange: "NSE" },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd", exchange: "NSE" },
  { symbol: "INFY", name: "Infosys Ltd", exchange: "NSE" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", exchange: "NSE" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", exchange: "NSE" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", exchange: "NSE" },
];

const profiles: Record<string, CompanyProfile> = {
  RELIANCE: {
    symbol: "RELIANCE", name: "Reliance Industries Ltd", exchange: "NSE",
    sector: "Energy", industry: "Oil, Gas & Telecom",
    description:
      "Reliance Industries is India's largest conglomerate, with operations spanning energy, petrochemicals, retail (Reliance Retail) and digital services (Jio).",
    ceo: "Mukesh Ambani", employees: 347000, country: "IN", website: "https://ril.com",
    price: 2945.6, change: 24.3, changePercent: 0.83, marketCap: 1.99e13, currency: "INR",
  },
  TCS: {
    symbol: "TCS", name: "Tata Consultancy Services Ltd", exchange: "NSE",
    sector: "Information Technology", industry: "IT Services & Consulting",
    description:
      "Tata Consultancy Services is India's largest IT services firm, providing consulting, technology and digital transformation services to clients worldwide.",
    ceo: "K Krithivasan", employees: 607000, country: "IN", website: "https://tcs.com",
    price: 4182.15, change: -18.7, changePercent: -0.45, marketCap: 1.51e13, currency: "INR",
  },
  INFY: {
    symbol: "INFY", name: "Infosys Ltd", exchange: "NSE",
    sector: "Information Technology", industry: "IT Services & Consulting",
    description:
      "Infosys is a global leader in next-generation digital services and consulting, helping enterprises across industries navigate their digital transformation.",
    ceo: "Salil Parekh", employees: 317000, country: "IN", website: "https://infosys.com",
    price: 1862.4, change: 21.5, changePercent: 1.17, marketCap: 7.72e12, currency: "INR",
  },
};

function fallbackProfile(symbol: string): CompanyProfile {
  const found = MOCK_SYMBOLS.find((s) => s.symbol === symbol);
  const priceMap: Record<string, number> = {
    HDFCBANK: 1684.9, ICICIBANK: 1255.3, TATAMOTORS: 974.6,
  };
  const capMap: Record<string, number> = {
    HDFCBANK: 1.28e13, ICICIBANK: 8.85e12, TATAMOTORS: 3.59e12,
  };
  return {
    symbol, name: found?.name ?? `${symbol} Ltd`, exchange: found?.exchange ?? "NSE",
    sector: "Diversified", industry: "Diversified",
    description:
      "Sample company profile served from bundled mock data. Connect Supabase + a data key for live Indian fundamentals.",
    ceo: "—", employees: 50000, country: "IN", website: "https://example.in",
    price: priceMap[symbol] ?? 1200, change: 8.4, changePercent: 0.71,
    marketCap: capMap[symbol] ?? 2.0e12, currency: "INR",
  };
}

export function mockProfile(symbol: string): CompanyProfile {
  return profiles[symbol] ?? fallbackProfile(symbol);
}

export function mockPrices(symbol: string, days = 180): PricePoint[] {
  const base = mockProfile(symbol).price;
  const out: PricePoint[] = [];
  let v = base * 0.82;
  let seed = [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    v = Math.max(1, v + (rnd() - 0.46) * base * 0.025);
    out.push({ date: d.toISOString().slice(0, 10), close: +v.toFixed(2) });
  }
  out[out.length - 1].close = base;
  return out;
}

const periods = ["FY24", "FY23", "FY22", "FY21"];

export function mockFinancials(symbol: string): CompanyFinancials {
  const p = mockProfile(symbol);
  // Illustrative INR figures scaled off market cap, tapering by year.
  const revBase = p.marketCap * 0.42;
  const rev = [1.0, 0.92, 0.84, 0.77].map((f) => Math.round(revBase * f));
  const gp = rev.map((r) => Math.round(r * 0.42));
  const op = rev.map((r) => Math.round(r * 0.26));
  const ni = rev.map((r) => Math.round(r * 0.18));
  const assets = rev.map((r) => Math.round(r * 1.4));
  const liab = assets.map((a) => Math.round(a * 0.58));
  const equity = assets.map((a, i) => a - liab[i]);
  const ocf = ni.map((n) => Math.round(n * 1.2));
  const capex = rev.map((r) => -Math.round(r * 0.08));
  const fcf = ocf.map((c, i) => c + capex[i]);
  return {
    income: {
      periods,
      rows: [
        { label: "Revenue", key: "revenue", values: rev },
        { label: "Gross profit", key: "grossProfit", values: gp },
        { label: "Operating income (EBIT)", key: "operatingIncome", values: op },
        { label: "Net profit (PAT)", key: "netIncome", values: ni },
        { label: "Gross margin", key: "grossMargin", values: gp.map((g, i) => +((g / rev[i]) * 100).toFixed(1)), format: "percent" },
        { label: "Net margin", key: "netMargin", values: ni.map((n, i) => +((n / rev[i]) * 100).toFixed(1)), format: "percent" },
      ],
    },
    balance: {
      periods,
      rows: [
        { label: "Total assets", key: "totalAssets", values: assets },
        { label: "Total liabilities", key: "totalLiabilities", values: liab },
        { label: "Shareholders' equity", key: "totalEquity", values: equity },
        { label: "Cash & equivalents", key: "cash", values: assets.map((a) => Math.round(a * 0.12)) },
        { label: "Total borrowings", key: "debt", values: liab.map((l) => Math.round(l * 0.38)) },
      ],
    },
    cashflow: {
      periods,
      rows: [
        { label: "Operating cash flow", key: "ocf", values: ocf },
        { label: "Capital expenditure", key: "capex", values: capex },
        { label: "Free cash flow", key: "fcf", values: fcf },
        { label: "Dividends paid", key: "dividends", values: ni.map((n) => -Math.round(n * 0.12)) },
      ],
    },
  };
}

export function mockRatios(symbol: string): KeyRatio[] {
  const p = mockProfile(symbol);
  const fin = mockFinancials(symbol);
  const ni = fin.income.rows.find((r) => r.key === "netIncome")!.values[0];
  const rev = fin.income.rows.find((r) => r.key === "revenue")!.values[0];
  const equity = fin.balance.rows.find((r) => r.key === "totalEquity")!.values[0];
  return [
    { label: "Market cap", value: p.marketCap, format: "currency" },
    { label: "P/E ratio", value: +(p.marketCap / ni).toFixed(1), format: "number" },
    { label: "P/S ratio", value: +(p.marketCap / rev).toFixed(1), format: "number" },
    { label: "Net margin", value: +((ni / rev) * 100).toFixed(1), format: "percent" },
    { label: "ROE", value: +((ni / equity) * 100).toFixed(1), format: "percent" },
    { label: "Revenue (TTM)", value: rev, format: "currency" },
  ];
}

export function mockSearch(q: string): SearchResult[] {
  const s = q.trim().toLowerCase();
  if (!s) return MOCK_SYMBOLS;
  return MOCK_SYMBOLS.filter(
    (x) => x.symbol.toLowerCase().includes(s) || x.name.toLowerCase().includes(s)
  );
}
