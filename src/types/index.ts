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
  /** Most recent first. Values in raw currency units. */
  values: number[];
  /** A ratio/percent row formats differently. */
  format?: "currency" | "percent" | "ratio";
}

export interface Statement {
  /** Period labels, most recent first, e.g. ["2024","2023","2022"]. */
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
