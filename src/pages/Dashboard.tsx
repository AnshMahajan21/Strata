import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Sparkline } from "@/components/ui/Sparkline";
import { Badge } from "@/components/ui/Badge";
import { useWatchlist } from "@/hooks/useWatchlist";
import { mockPrices, MOCK_SYMBOLS, mockProfile } from "@/lib/mockData";
import { compactCurrency, signedPercent } from "@/lib/format";

const indices = [
  { label: "S&P 500", value: "5,431.60", change: 0.42 },
  { label: "Nasdaq", value: "17,862.23", change: 0.81 },
  { label: "Dow Jones", value: "39,118.86", change: -0.21 },
];

export function Dashboard() {
  const { entries } = useWatchlist();
  const movers = MOCK_SYMBOLS.slice(0, 4).map((s) => mockProfile(s.symbol));

  return (
    <AppShell>
      <div className="mb-10">
        <p className="eyebrow mb-3">Markets · today</p>
        <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">Dashboard</h1>
        <p className="mt-3 max-w-xl text-haze">
          A read on the market and the companies you follow.
        </p>
      </div>

      {/* index strip */}
      <div className="mb-8 grid gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-3">
        {indices.map((ix) => (
          <div key={ix.label} className="bg-ink-800 px-6 py-6">
            <StatCard
              label={ix.label}
              value={ix.value}
              sub={signedPercent(ix.change)}
              spark={mockPrices(ix.label, 30).map((p) => p.close)}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* movers */}
        <Card className="p-5">
          <h3 className="font-serif text-2xl">Most active</h3>
          <p className="mb-4 text-sm text-fog">Tap a company for full fundamentals.</p>
          <ul className="divide-y divide-line">
            {movers.map((m) => {
              const up = m.changePercent >= 0;
              return (
                <li key={m.symbol}>
                  <Link
                    to={`/company/${m.symbol}`}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-ink-700/30"
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-xs text-fog">{m.symbol}</span>
                      <p className="truncate font-serif text-xl">{m.name}</p>
                    </div>
                    <Sparkline
                      data={mockPrices(m.symbol, 40).map((p) => p.close)}
                      width={88}
                      height={32}
                    />
                    <div className="w-28 text-right">
                      <p className="tabular text-sm text-chalk">${m.price.toFixed(2)}</p>
                      <Badge tone={up ? "gain" : "loss"}>{signedPercent(m.changePercent)}</Badge>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-fog transition-transform group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* watchlist preview */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-2xl">Your watchlist</h3>
            <Link to="/watchlist" className="text-sm text-fog hover:text-chalk">
              View all
            </Link>
          </div>
          {entries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line px-5 py-10 text-center">
              <p className="text-sm text-fog">
                Nothing here yet. Add companies with the star button.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {entries.slice(0, 6).map((e) => {
                const p = mockProfile(e.symbol);
                return (
                  <li key={e.symbol}>
                    <Link
                      to={`/company/${e.symbol}`}
                      className="flex items-center justify-between gap-3 py-3.5 hover:bg-ink-700/30"
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-xs text-fog">{e.symbol}</span>
                        <span className="truncate text-sm text-haze">{e.name}</span>
                      </span>
                      <span className="tabular text-sm text-chalk">
                        {compactCurrency(p.marketCap)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
