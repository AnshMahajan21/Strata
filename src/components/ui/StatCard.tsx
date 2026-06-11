import { Sparkline } from "./Sparkline";

interface Props {
  label: string;
  value: string;
  sub?: string;
  spark?: number[];
}

export function StatCard({ label, value, sub, spark }: Props) {
  return (
    <div className="flex flex-col gap-3 py-1">
      <p className="eyebrow">{label}</p>
      <p className="tabular font-serif text-4xl leading-none">{value}</p>
      <div className="flex items-end justify-between gap-3">
        {sub && <span className="text-xs text-fog">{sub}</span>}
        {spark && <Sparkline data={spark} className="opacity-70" />}
      </div>
    </div>
  );
}
