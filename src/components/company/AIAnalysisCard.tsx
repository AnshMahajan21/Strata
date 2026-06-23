import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAnalysis } from "@/hooks/useCompany";

function ScoreRing({ score }: { score: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const tone = score >= 70 ? "#5fcf80" : score >= 50 ? "#d6c46a" : "#e2706b";
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r} fill="none" stroke={tone} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`} transform="rotate(-90 36 36)"
      />
      <text x="36" y="40" textAnchor="middle" className="tabular" fill="#ededee"
        fontSize="17" fontFamily="Instrument Serif, serif">{score}</text>
    </svg>
  );
}

export function AIAnalysisCard({ symbol }: { symbol: string }) {
  const { data, isLoading } = useAnalysis(symbol);
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-haze" />
        <h3 className="font-serif text-2xl">AI Financial Analyst</h3>
        {data && (
          <span className="ml-auto text-[11px] uppercase tracking-eyebrow text-fog">
            {data.generatedBy === "ai" ? "Gemini" : "Computed"}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : data ? (
        <>
          <div className="mb-4 flex items-center gap-4">
            <ScoreRing score={data.score} />
            <div>
              <p className="eyebrow mb-1">Health score</p>
              <p className="font-serif text-2xl leading-tight">{data.verdict}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-haze">{data.summary}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gain">
                <TrendingUp size={13} /> Strengths
              </p>
              <ul className="space-y-1">
                {data.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-haze">{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-loss">
                <AlertTriangle size={13} /> Risks
              </p>
              <ul className="space-y-1">
                {data.risks.map((s, i) => (
                  <li key={i} className="text-sm text-haze">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </Card>
  );
}
