import { useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { PriceChart } from "@/components/charts/PriceChart";
import { FinancialsBarChart } from "@/components/charts/FinancialsBarChart";
import { StatementTable } from "@/components/company/StatementTable";
import { RatioGrid } from "@/components/company/RatioGrid";
import { WatchlistButton } from "@/components/company/WatchlistButton";
import { useFinancials, usePrices, useProfile, useRatios } from "@/hooks/useCompany";
import { compactCurrency, money, signedPercent } from "@/lib/format";
import type { CompanyFinancials } from "@/types";

type Tab = "income" | "balance" | "cashflow";
const tabs: { id: Tab; label: string; chartRow: string }[] = [
  { id: "income", label: "Income statement", chartRow: "revenue" },
  { id: "balance", label: "Balance sheet", chartRow: "totalAssets" },
  { id: "cashflow", label: "Cash flow", chartRow: "fcf" },
];

export function Company() {
  const { symbol = "" } = useParams();
  const sym = symbol.toUpperCase();
  const [tab, setTab] = useState<Tab>("income");

  const profile = useProfile(sym);
  const prices = usePrices(sym);
  const financials = useFinancials(sym);
  const ratios = useRatios(sym);

  const p = profile.data;
  const up = (p?.changePercent ?? 0) >= 0;
  const statementOf = (f: CompanyFinancials) => f[tab];
  const activeTab = tabs.find((t) => t.id === tab)!;

  return (
    <AppShell>
      {/* header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-sm text-fog">{sym}</span>
            {p && (
              <span className="text-xs text-fog">
                {p.exchange} · {p.sector}
              </span>
            )}
          </div>
          {profile.isLoading ? (
            <Skeleton className="h-12 w-72" />
          ) : (
            <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">{p?.name}</h1>
          )}
          {p && (
            <div className="mt-4 flex items-center gap-4">
              <span className="tabular font-serif text-3xl">{money(p.price)}</span>
              <Badge tone={up ? "gain" : "loss"}>
                {up ? "+" : ""}
                {money(p.change)} · {signedPercent(p.changePercent)}
              </Badge>
            </div>
          )}
        </div>
        {p && <WatchlistButton symbol={sym} name={p.name} />}
      </div>

      {/* price + about */}
      <div className="mb-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-serif text-2xl">Price</h3>
            <span className="eyebrow">6 months</span>
          </div>
          {prices.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : prices.data ? (
            <PriceChart data={prices.data} up={up} />
          ) : null}
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 font-serif text-2xl">About</h3>
          {profile.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            p && (
              <>
                <p className="text-sm leading-relaxed text-haze">{p.description}</p>
                <dl className="mt-5 grid grid-cols-2 gap-y-4 text-sm">
                  {[
                    ["CEO", p.ceo],
                    ["Employees", p.employees.toLocaleString()],
                    ["Industry", p.industry],
                    ["Market cap", compactCurrency(p.marketCap)],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="eyebrow mb-1">{k}</dt>
                      <dd className="text-chalk">{v}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )
          )}
        </Card>
      </div>

      {/* key ratios */}
      <section className="mb-8">
        <h2 className="mb-4 font-serif text-3xl">Key ratios</h2>
        {ratios.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : ratios.data ? (
          <RatioGrid ratios={ratios.data} />
        ) : null}
      </section>

      {/* statements */}
      <section>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <h2 className="mr-4 font-serif text-3xl">Financials</h2>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`focus-ring rounded-full border px-4 py-2 text-sm transition-colors ${
                tab === t.id
                  ? "border-line-strong bg-ink-700/60 text-chalk"
                  : "border-line text-fog hover:text-haze"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {financials.isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : financials.data ? (
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <Card className="p-5">
              <StatementTable
                statement={statementOf(financials.data)}
                currency={p?.currency}
              />
            </Card>
            <Card className="p-5">
              <h3 className="mb-3 font-serif text-2xl">
                {tabs.find((t) => t.id === tab)?.label.split(" ")[0]} trend
              </h3>
              <FinancialsBarChart
                statement={statementOf(financials.data)}
                rowKey={activeTab.chartRow}
              />
            </Card>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}
