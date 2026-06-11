import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Sparkline } from "@/components/ui/Sparkline";
import { Footer } from "@/components/layout/Footer";
import { mockPrices } from "@/lib/mockData";

const featured = [
  { symbol: "RELIANCE", name: "Reliance", change: 0.83 },
  { symbol: "INFY", name: "Infosys", change: 1.17 },
  { symbol: "TCS", name: "TCS", change: -0.45 },
];

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* top bar */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-line-strong font-serif text-lg">
            S
          </span>
          <span className="font-serif text-xl tracking-tight">Strata</span>
        </div>
        <Link
          to="/dashboard"
          className="focus-ring rounded-full border border-line px-4 py-2 text-sm text-haze transition-colors hover:text-chalk"
        >
          Open dashboard
        </Link>
      </header>

      {/* hero */}
      <section className="relative mx-auto w-full max-w-7xl flex-1 px-5">
        <div className="absolute inset-0 -z-10 bg-grid-faint bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div className="grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="eyebrow mb-6">Financial fundamentals · clearly seen</p>
            <h1 className="font-serif text-6xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Read a company
              <br />
              like a <span className="italic">balance sheet.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-haze">
              Income, balance, and cash flow for any public company — laid out
              with the calm precision of a ledger. Search a ticker to begin.
            </p>

            <div className="mt-9 max-w-md">
              <SearchBar />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-fog">
              <span>Try</span>
              {featured.map((f) => (
                <Link
                  key={f.symbol}
                  to={`/company/${f.symbol}`}
                  className="focus-ring rounded-full border border-line px-3 py-1 font-mono text-chalk transition-colors hover:bg-ink-700/50"
                >
                  {f.symbol}
                </Link>
              ))}
            </div>
          </div>

          {/* signature: a stack of live-feeling tickers in serif numerals */}
          <div className="relative">
            <div className="glass divide-y divide-line p-2">
              {featured.map((f) => {
                const prices = mockPrices(f.symbol, 40).map((p) => p.close);
                const up = f.change >= 0;
                return (
                  <Link
                    key={f.symbol}
                    to={`/company/${f.symbol}`}
                    className="group flex items-center justify-between gap-4 rounded-xl px-4 py-5 transition-colors hover:bg-ink-700/40"
                  >
                    <div>
                      <p className="font-mono text-xs text-fog">{f.symbol}</p>
                      <p className="font-serif text-2xl leading-tight">{f.name}</p>
                    </div>
                    <Sparkline data={prices} width={96} height={36} />
                    <div className="w-20 text-right">
                      <p
                        className={`tabular text-sm font-medium ${
                          up ? "text-gain" : "text-loss"
                        }`}
                      >
                        {up ? "+" : ""}
                        {f.change.toFixed(2)}%
                      </p>
                      <ArrowUpRight
                        size={16}
                        className="ml-auto mt-1 text-fog transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* three-up philosophy strip, echoing the reference layout */}
        <div className="grid gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-3">
          {[
            ["Statements", "Income, balance and cash flow side by side, years aligned."],
            ["Ratios", "Margins, returns and valuation computed, not buried."],
            ["Watchlist", "Track the companies you follow — synced when you sign in."],
          ].map(([t, d]) => (
            <div key={t} className="bg-ink-850 px-6 py-8">
              <h3 className="font-serif text-2xl">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{d}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-16">
          <Link
            to="/dashboard"
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-chalk px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-white"
          >
            Explore the dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
