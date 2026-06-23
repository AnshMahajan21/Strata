import type {
  CompanyProfile, CompanyFinancials, PricePoint, SearchResult, KeyRatio,
  AIAnalysis, ComparisonResult,
} from "@/types";

/** Bundled mock data: US equities (USD). Illustrative only, not market data. */

export const MOCK_SYMBOLS: SearchResult[] = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon.com, Inc.", exchange: "NASDAQ" },
  { symbol: "META", name: "Meta Platforms, Inc.", exchange: "NASDAQ" },
];

const profiles: Record<string, CompanyProfile> = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Technology",
    industry: "Consumer Electronics",
    description: "Apple designs, manufactures, and markets smartphones, computers, tablets, wearables, and accessories, alongside a growing services business.",
    ceo: "Tim Cook", employees: 161000, country: "US", website: "https://apple.com",
    price: 229.87, change: 2.41, changePercent: 1.06, marketCap: 3.48e12, currency: "USD" },
  MSFT: { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", sector: "Technology",
    industry: "Software - Infrastructure",
    description: "Microsoft develops software, services, devices, and solutions worldwide, including the Azure cloud platform and the Microsoft 365 suite.",
    ceo: "Satya Nadella", employees: 228000, country: "US", website: "https://microsoft.com",
    price: 441.58, change: -3.12, changePercent: -0.7, marketCap: 3.28e12, currency: "USD" },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", sector: "Technology",
    industry: "Semiconductors",
    description: "NVIDIA provides graphics, compute, and networking solutions and is a leading supplier of accelerated-computing platforms for AI and data centers.",
    ceo: "Jensen Huang", employees: 29600, country: "US", website: "https://nvidia.com",
    price: 134.81, change: 4.05, changePercent: 3.1, marketCap: 3.31e12, currency: "USD" },
};

function fallbackProfile(symbol: string): CompanyProfile {
  const f = MOCK_SYMBOLS.find((s) => s.symbol === symbol);
  const px: Record<string, number> = { GOOGL: 178.2, AMZN: 201.4, META: 583.1 };
  const cap: Record<string, number> = { GOOGL: 2.18e12, AMZN: 2.1e12, META: 1.48e12 };
  return { symbol, name: f?.name ?? `${symbol} Inc.`, exchange: f?.exchange ?? "NASDAQ",
    sector: "Technology", industry: "Internet & Software",
    description: "Sample company profile from bundled mock data. Connect a data key for live US fundamentals.",
    ceo: "—", employees: 90000, country: "US", website: "https://example.com",
    price: px[symbol] ?? 150, change: 1.2, changePercent: 0.8,
    marketCap: cap[symbol] ?? 1.0e12, currency: "USD" };
}

export function mockProfile(symbol: string): CompanyProfile {
  return profiles[symbol] ?? fallbackProfile(symbol);
}

export function mockPrices(symbol: string, days = 180): PricePoint[] {
  const base = mockProfile(symbol).price;
  const out: PricePoint[] = [];
  let v = base * 0.82;
  let seed = [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    v = Math.max(1, v + (rnd() - 0.46) * base * 0.025);
    out.push({ date: d.toISOString().slice(0, 10), close: +v.toFixed(2) });
  }
  out[out.length - 1].close = base;
  return out;
}

const periods = ["2024", "2023", "2022", "2021"];

export function mockFinancials(symbol: string): CompanyFinancials {
  const p = mockProfile(symbol);
  const revBase = p.marketCap * 0.34;
  const rev = [1.0, 0.93, 0.86, 0.79].map((f) => Math.round(revBase * f));
  const gp = rev.map((r) => Math.round(r * 0.44));
  const op = rev.map((r) => Math.round(r * 0.3));
  const ni = rev.map((r) => Math.round(r * 0.24));
  const assets = rev.map((r) => Math.round(r * 1.1));
  const liab = assets.map((a) => Math.round(a * 0.55));
  const equity = assets.map((a, i) => a - liab[i]);
  const ocf = ni.map((n) => Math.round(n * 1.18));
  const capex = rev.map((r) => -Math.round(r * 0.05));
  const fcf = ocf.map((c, i) => c + capex[i]);
  return {
    income: { periods, rows: [
      { label: "Revenue", key: "revenue", values: rev },
      { label: "Gross profit", key: "grossProfit", values: gp },
      { label: "Operating income", key: "operatingIncome", values: op },
      { label: "Net income", key: "netIncome", values: ni },
      { label: "Gross margin", key: "grossMargin", values: gp.map((g, i) => +((g / rev[i]) * 100).toFixed(1)), format: "percent" },
      { label: "Net margin", key: "netMargin", values: ni.map((n, i) => +((n / rev[i]) * 100).toFixed(1)), format: "percent" },
    ]},
    balance: { periods, rows: [
      { label: "Total assets", key: "totalAssets", values: assets },
      { label: "Total liabilities", key: "totalLiabilities", values: liab },
      { label: "Total equity", key: "totalEquity", values: equity },
      { label: "Cash & equivalents", key: "cash", values: assets.map((a) => Math.round(a * 0.2)) },
      { label: "Total debt", key: "debt", values: liab.map((l) => Math.round(l * 0.42)) },
    ]},
    cashflow: { periods, rows: [
      { label: "Operating cash flow", key: "ocf", values: ocf },
      { label: "Capital expenditure", key: "capex", values: capex },
      { label: "Free cash flow", key: "fcf", values: fcf },
      { label: "Dividends paid", key: "dividends", values: ni.map((n) => -Math.round(n * 0.14)) },
    ]},
  };
}

export function mockRatios(symbol: string): KeyRatio[] {
  const p = mockProfile(symbol);
  const fin = mockFinancials(symbol);
  const ni = fin.income.rows.find((r) => r.key === "netIncome")!.values[0];
  const rev = fin.income.rows.find((r) => r.key === "revenue")!.values[0];
  const eq = fin.balance.rows.find((r) => r.key === "totalEquity")!.values[0];
  return [
    { label: "Market cap", value: p.marketCap, format: "currency" },
    { label: "P/E ratio", value: +(p.marketCap / ni).toFixed(1), format: "number" },
    { label: "P/S ratio", value: +(p.marketCap / rev).toFixed(1), format: "number" },
    { label: "Net margin", value: +((ni / rev) * 100).toFixed(1), format: "percent" },
    { label: "ROE", value: +((ni / eq) * 100).toFixed(1), format: "percent" },
    { label: "Revenue (TTM)", value: rev, format: "currency" },
  ];
}

export function mockSearch(q: string): SearchResult[] {
  const s = q.trim().toLowerCase();
  if (!s) return MOCK_SYMBOLS;
  return MOCK_SYMBOLS.filter((x) => x.symbol.toLowerCase().includes(s) || x.name.toLowerCase().includes(s));
}

/** Deterministic composite health score (0-100) from fundamentals. Shared by AI fallback. */
export function computeScore(symbol: string): number {
  const fin = mockFinancials(symbol);
  const inc = fin.income.rows;
  const rev = inc.find((r) => r.key === "revenue")!.values;
  const nm = inc.find((r) => r.key === "netMargin")!.values[0];
  const growth = ((rev[0] - rev[1]) / rev[1]) * 100;
  const fcf = fin.cashflow.rows.find((r) => r.key === "fcf")!.values[0];
  const debt = fin.balance.rows.find((r) => r.key === "debt")!.values[0];
  const eq = fin.balance.rows.find((r) => r.key === "totalEquity")!.values[0];
  const de = debt / eq;
  let s = 50;
  s += Math.min(20, growth);          // revenue growth
  s += Math.min(20, nm * 0.6);        // profitability
  s += fcf > 0 ? 8 : -8;              // positive FCF
  s += de < 0.6 ? 6 : de < 1 ? 2 : -6; // leverage
  return Math.max(1, Math.min(99, Math.round(s)));
}

export function mockAnalysis(symbol: string): AIAnalysis {
  const p = mockProfile(symbol);
  const fin = mockFinancials(symbol);
  const rev = fin.income.rows.find((r) => r.key === "revenue")!.values;
  const nm = fin.income.rows.find((r) => r.key === "netMargin")!.values[0];
  const growth = +(((rev[0] - rev[1]) / rev[1]) * 100).toFixed(1);
  const score = computeScore(symbol);
  return {
    symbol, score,
    verdict: score >= 70 ? "Strong fundamentals" : score >= 50 ? "Solid, watch the trade-offs" : "Mixed picture",
    summary: `${p.name} grew revenue about ${growth}% year over year at a ${nm}% net margin. Cash generation is healthy and the balance sheet is manageable. This is a computed snapshot; connect a Gemini key for a full AI narrative.`,
    strengths: [`Revenue up ~${growth}% YoY`, `Net margin around ${nm}%`, "Positive free cash flow"],
    risks: ["Valuation sensitive to growth", "Concentration in core segment"],
    generatedBy: "computed",
  };
}

export function mockCompare(symbols: string[]): ComparisonResult {
  const scores: Record<string, number> = {};
  const perCompany: Record<string, string> = {};
  symbols.forEach((s) => {
    scores[s] = computeScore(s);
    const a = mockAnalysis(s);
    perCompany[s] = a.summary.split(". ")[0] + ".";
  });
  const winner = symbols.slice().sort((a, b) => scores[b] - scores[a])[0];
  return {
    symbols, scores, winner,
    reasoning: `${mockProfile(winner).name} ranks highest on the composite of revenue growth, profitability, free cash flow, and leverage. Connect a Gemini key for a full AI rationale.`,
    perCompany, generatedBy: "computed",
  };
}
