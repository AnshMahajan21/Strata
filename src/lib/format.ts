export function compactCurrency(n: number, currency = "USD"): string {
  if (!n) return "—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const sym = currency === "USD" ? "$" : "";
  const fmt = (v: number, s: string) => `${sign}${sym}${v.toFixed(v >= 100 ? 0 : 1)}${s}`;
  if (abs >= 1e12) return fmt(abs / 1e12, "T");
  if (abs >= 1e9) return fmt(abs / 1e9, "B");
  if (abs >= 1e6) return fmt(abs / 1e6, "M");
  if (abs >= 1e3) return fmt(abs / 1e3, "K");
  return `${sign}${sym}${abs.toFixed(2)}`;
}

export function money(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

export function percent(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}

export function signedPercent(n: number, digits = 2): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

export function ratio(n: number, digits = 2): string {
  return n.toFixed(digits) + "×";
}

export function formatValue(
  value: number,
  format: "currency" | "percent" | "ratio" | "number" = "currency",
  currency = "USD"
): string {
  if (value === null || Number.isNaN(value)) return "—";
  switch (format) {
    case "percent":
      return percent(value);
    case "ratio":
      return ratio(value);
    case "number":
      return new Intl.NumberFormat("en-US").format(value);
    default:
      return compactCurrency(value, currency);
  }
}

export function trendClass(n: number): string {
  return n > 0 ? "text-gain" : n < 0 ? "text-loss" : "text-fog";
}
