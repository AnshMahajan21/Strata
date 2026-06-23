export interface CompanyProfile {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  description: string;
  ceo: string;
  employees: number;
  country: string;
  website: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  currency: string;
}

export interface PricePoint {
  date: string;
  close: number;
}

export interface StatementRow {
  label: string;
  key: string;
  values: number[];
  format?: "currency" | "percent" | "ratio";
}

export interface Statement {
  periods: string[];
  rows: StatementRow[];
}

export interface CompanyFinancials {
  income: Statement;
  balance: Statement;
  cashflow: Statement;
}

export interface KeyRatio {
  label: string;
  value: number | null;
  format: "ratio" | "percent" | "currency" | "number";
  hint?: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
}

export interface WatchlistEntry {
  symbol: string;
  name: string;
  addedAt: string;
}

/** AI (or fallback) financial-health analysis for a single company. */
export interface AIAnalysis {
  symbol: string;
  verdict: string;            // one-line takeaway
  score: number;              // 0-100 composite health score
  summary: string;            // paragraph assessment
  strengths: string[];
  risks: string[];
  generatedBy: "ai" | "computed";
}

/** Result of comparing up to 3 companies. */
export interface ComparisonResult {
  symbols: string[];
  scores: Record<string, number>;     // composite score per symbol
  winner: string;                     // best symbol overall
  reasoning: string;                  // why the winner won
  perCompany: Record<string, string>; // short AI summary per company
  generatedBy: "ai" | "computed";
}
