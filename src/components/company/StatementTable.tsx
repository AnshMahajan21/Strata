import type { Statement } from "@/types";
import { formatValue, trendClass } from "@/lib/format";

/** Ledger-style table: hairline rules, mono tabular figures, most-recent left. */
export function StatementTable({
  statement,
  currency = "USD",
}: {
  statement: Statement;
  currency?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="py-3 pr-4 text-left font-medium text-fog">Line item</th>
            {statement.periods.map((p) => (
              <th key={p} className="tabular py-3 pl-4 text-right font-medium text-haze">
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statement.rows.map((row) => {
            const isMargin = row.format === "percent";
            return (
              <tr
                key={row.key}
                className="border-b border-line/60 last:border-0 hover:bg-ink-700/30"
              >
                <td className={`py-3 pr-4 ${isMargin ? "text-fog" : "text-haze"}`}>
                  {row.label}
                </td>
                {row.values.map((v, i) => {
                  const yoy =
                    i < row.values.length - 1 && row.values[i + 1] !== 0
                      ? ((v - row.values[i + 1]) / Math.abs(row.values[i + 1])) * 100
                      : 0;
                  return (
                    <td
                      key={i}
                      className={`tabular py-3 pl-4 text-right font-mono ${
                        i === 0 ? "text-chalk" : "text-haze"
                      }`}
                    >
                      <span>{formatValue(v, row.format ?? "currency", currency)}</span>
                      {i === 0 && yoy !== 0 && (
                        <span className={`ml-2 text-[11px] ${trendClass(yoy)}`}>
                          {yoy > 0 ? "▲" : "▼"} {Math.abs(yoy).toFixed(0)}%
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
