import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Statement } from "@/types";
import { compactCurrency } from "@/lib/format";

/** Plots a single row of a statement across periods (oldest → newest). */
export function FinancialsBarChart({
  statement,
  rowKey,
}: {
  statement: Statement;
  rowKey: string;
}) {
  const row = statement.rows.find((r) => r.key === rowKey);
  if (!row) return null;
  const data = statement.periods
    .map((p, i) => ({ period: p, value: row.values[i] }))
    .reverse();
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="period"
            tick={{ fill: "#8a8a93", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#8a8a93", fontSize: 11 }}
            width={48}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => compactCurrency(v)}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#101014",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "#8a8a93" }}
            itemStyle={{ color: "#ededee" }}
            formatter={(v: number) => [compactCurrency(v), row.label]}
          />
          <Bar dataKey="value" fill="#ededee" radius={[3, 3, 0, 0]} maxBarSize={42} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
