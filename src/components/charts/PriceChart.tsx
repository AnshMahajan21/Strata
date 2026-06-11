import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PricePoint } from "@/types";
import { money } from "@/lib/format";

export function PriceChart({ data, up }: { data: PricePoint[]; up: boolean }) {
  const stroke = up ? "#5fcf80" : "#e2706b";
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.22} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: "#8a8a93", fontSize: 11 }}
            tickFormatter={(d: string) => d.slice(5)}
            interval="preserveStartEnd"
            minTickGap={48}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={["dataMin", "dataMax"]}
            tick={{ fill: "#8a8a93", fontSize: 11 }}
            width={48}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `₹${v.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              background: "#101014",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "#8a8a93" }}
            itemStyle={{ color: "#ededee" }}
            formatter={(v: number) => [money(v), "Close"]}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={stroke}
            strokeWidth={1.6}
            fill="url(#priceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
