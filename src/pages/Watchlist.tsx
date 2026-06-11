import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkline } from "@/components/ui/Sparkline";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/context/AuthProvider";
import { mockPrices, mockProfile } from "@/lib/mockData";
import { compactCurrency, money, signedPercent } from "@/lib/format";

export function Watchlist() {
  const { entries, remove } = useWatchlist();
  const { user, authEnabled } = useAuth();

  return (
    <AppShell>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Following</p>
          <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">Watchlist</h1>
        </div>
      </div>

      {authEnabled && !user && entries.length > 0 && (
        <div className="mb-6 rounded-xl border border-line bg-ink-800/60 px-5 py-4 text-sm text-haze">
          Saved on this device.{" "}
          <Link to="/login" className="text-chalk underline underline-offset-4">
            Sign in
          </Link>{" "}
          to sync across devices.
        </div>
      )}

      {entries.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <h3 className="font-serif text-3xl">No companies yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-fog">
            Search for a company and tap the star to start tracking it here.
          </p>
          <Link
            to="/dashboard"
            className="focus-ring mt-6 inline-flex rounded-full border border-line-strong px-5 py-2.5 text-sm hover:bg-ink-700/60"
          >
            Browse the dashboard
          </Link>
        </Card>
      ) : (
        <Card className="divide-y divide-line p-2">
          {entries.map((e) => {
            const p = mockProfile(e.symbol);
            const up = p.changePercent >= 0;
            return (
              <div key={e.symbol} className="flex items-center gap-4 px-4 py-4">
                <Link to={`/company/${e.symbol}`} className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-fog">{e.symbol}</span>
                    <p className="truncate font-serif text-xl">{e.name}</p>
                  </div>
                </Link>
                <Sparkline data={mockPrices(e.symbol, 40).map((x) => x.close)} width={88} height={32} />
                <div className="hidden w-28 text-right sm:block">
                  <p className="tabular text-sm text-chalk">{money(p.price)}</p>
                  <Badge tone={up ? "gain" : "loss"}>{signedPercent(p.changePercent)}</Badge>
                </div>
                <span className="hidden w-20 text-right text-sm text-haze md:block">
                  {compactCurrency(p.marketCap)}
                </span>
                <button
                  onClick={() => remove(e.symbol)}
                  aria-label={`Remove ${e.symbol}`}
                  className="focus-ring rounded-full p-2 text-fog hover:bg-ink-700/60 hover:text-chalk"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </Card>
      )}
    </AppShell>
  );
}
