import type { KeyRatio } from "@/types";
import { formatValue } from "@/lib/format";

export function RatioGrid({ ratios }: { ratios: KeyRatio[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-3">
      {ratios.map((r) => (
        <div key={r.label} className="bg-ink-800 px-5 py-5">
          <p className="eyebrow mb-2">{r.label}</p>
          <p className="tabular font-serif text-3xl leading-none">
            {r.value === null ? "—" : formatValue(r.value, r.format)}
          </p>
        </div>
      ))}
    </div>
  );
}
