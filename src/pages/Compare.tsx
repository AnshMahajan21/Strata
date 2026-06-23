import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, X, Trophy, Sparkles, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sparkline } from "@/components/ui/Sparkline";
import { useProfile, useRatios, useSearch, useComparison } from "@/hooks/useCompany";
import { mockPrices } from "@/lib/mockData";
import { formatValue, money, signedPercent } from "@/lib/format";

const MAX = 3;

function AddCompany({ disabled, onAdd }: { disabled: boolean; onAdd: (s: string) => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: results } = useSearch(q);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  if (disabled) return null;
  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <div className="flex items-center gap-2 rounded-full border border-line bg-ink-800/70 px-4 py-2.5">
        <Search size={15} className="text-fog" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Add a company to compare…"
          className="w-full bg-transparent text-sm text-chalk placeholder:text-fog focus:outline-none"
        />
      </div>
      {open && results && results.length > 0 && (
        <ul className="glass absolute z-30 mt-2 w-full overflow-hidden p-1">
          {results.map((r) => (
            <li key={r.symbol}>
              <button
                onClick={() => { onAdd(r.symbol); setQ(""); setOpen(false); }}
                className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-ink-700/60"
              >
                <Plus size={13} className="text-fog" />
                <span className="tabular w-14 font-mono text-sm">{r.symbol}</span>
                <span className="truncate text-sm text-haze">{r.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CompanyColumn({ symbol, isWinner, perSummary }: {
  symbol: string; isWinner: boolean; perSummary?: string;
}) {
  const profile = useProfile(symbol);
  const ratios = useRatios(symbol);
  const p = profile.data;
  const up = (p?.changePercent ?? 0) >= 0;
  return (
    <div className={`rounded-xl2 border p-5 ${isWinner ? "border-gain/40 bg-gain/[0.04]" : "border-line bg-ink-800/60"}`}>
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs text-fog">{symbol}</p>
          {profile.isLoading ? <Skeleton className="mt-1 h-6 w-32" /> :
            <Link to={`/company/${symbol}`} className="font-serif text-2xl leading-tight hover:underline">{p?.name}</Link>}
        </div>
        {isWinner && <Trophy size={18} className="shrink-0 text-gain" />}
      </div>
      {p && (
        <div className="mb-3 flex items-baseline gap-2">
          <span className="tabular text-lg">{money(p.price)}</span>
          <span className={`text-xs ${up ? "text-gain" : "text-loss"}`}>{signedPercent(p.changePercent)}</span>
        </div>
      )}
      <Sparkline data={mockPrices(symbol, 40).map((x) => x.close)} width={180} height={34} className="mb-3" />
      {perSummary && <p className="mb-3 text-sm leading-relaxed text-haze">{perSummary}</p>}
      <dl className="space-y-1.5" data-ratios>
        {ratios.isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)
          : (ratios.data ?? []).map((r) => (
              <div key={r.label} className="flex items-center justify-between border-b border-line/50 py-1.5 last:border-0">
                <dt className="text-xs text-fog">{r.label}</dt>
                <dd data-metric={r.label} data-value={r.value ?? ""} className="tabular text-sm text-chalk">
                  {r.value === null ? "—" : formatValue(r.value, r.format)}
                </dd>
              </div>
            ))}
      </dl>
    </div>
  );
}

export function Compare() {
  const [params, setParams] = useSearchParams();
  const initial = (params.get("symbols") ?? "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  const [symbols, setSymbols] = useState<string[]>(initial.slice(0, MAX));

  useEffect(() => {
    setParams(symbols.length ? { symbols: symbols.join(",") } : {}, { replace: true });
  }, [symbols, setParams]);

  const add = (s: string) => setSymbols((cur) => (cur.includes(s) || cur.length >= MAX ? cur : [...cur, s]));
  const remove = (s: string) => setSymbols((cur) => cur.filter((x) => x !== s));

  const cmp = useComparison(symbols);
  const winner = cmp.data?.winner;

  // ratios from each rendered column are read for best-value highlighting after paint
  const gridCols = useMemo(() => (symbols.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"), [symbols.length]);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="eyebrow mb-3">Side by side</p>
        <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">Compare companies</h1>
        <p className="mt-3 max-w-xl text-haze">
          Stack up to three companies on fundamentals, with an AI verdict on the strongest.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        {symbols.map((s) => (
          <span key={s} className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink-700/60 px-3 py-1.5 text-sm">
            <span className="font-mono">{s}</span>
            <button onClick={() => remove(s)} aria-label={`Remove ${s}`} className="text-fog hover:text-chalk">
              <X size={13} />
            </button>
          </span>
        ))}
        <AddCompany disabled={symbols.length >= MAX} onAdd={add} />
      </div>

      {symbols.length < 2 ? (
        <Card className="px-6 py-16 text-center">
          <h3 className="font-serif text-3xl">Pick at least two</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-fog">
            Add companies above to see them compared on growth, margins, valuation, and an AI-picked winner.
          </p>
        </Card>
      ) : (
        <>
          {/* AI verdict */}
          <Card className="mb-8 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-haze" />
              <h3 className="font-serif text-2xl">AI verdict</h3>
              {cmp.data && (
                <span className="ml-auto text-[11px] uppercase tracking-eyebrow text-fog">
                  {cmp.data.generatedBy === "ai" ? "Gemini" : "Computed"}
                </span>
              )}
            </div>
            {cmp.isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : cmp.data ? (
              <>
                <p className="mb-3 flex items-center gap-2 font-serif text-2xl">
                  <Trophy size={18} className="text-gain" /> Winner: {winner}
                </p>
                <p className="text-sm leading-relaxed text-haze">{cmp.data.reasoning}</p>
                <div className="mt-4 space-y-2">
                  {symbols.map((s) => {
                    const score = cmp.data!.scores[s] ?? 0;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <span className="w-16 font-mono text-xs text-fog">{s}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
                          <div className={`h-full rounded-full ${s === winner ? "bg-gain" : "bg-haze/50"}`} style={{ width: `${score}%` }} />
                        </div>
                        <span className="tabular w-8 text-right text-xs text-haze">{score}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}
          </Card>

          {/* columns */}
          <div className={`grid gap-5 ${gridCols}`}>
            {symbols.map((s) => (
              <CompanyColumn key={s} symbol={s} isWinner={s === winner} perSummary={cmp.data?.perCompany[s]} />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
