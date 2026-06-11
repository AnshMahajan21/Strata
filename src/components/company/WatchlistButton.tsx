import { Star } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";

export function WatchlistButton({
  symbol,
  name,
  size = "md",
}: {
  symbol: string;
  name: string;
  size?: "sm" | "md";
}) {
  const { has, toggle } = useWatchlist();
  const active = has(symbol);
  const pad = size === "sm" ? "p-2" : "px-4 py-2.5";
  return (
    <button
      onClick={() => toggle(symbol, name)}
      aria-pressed={active}
      aria-label={active ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      className={`focus-ring inline-flex items-center gap-2 rounded-full border text-sm transition-colors ${pad} ${
        active
          ? "border-line-strong bg-ink-700/60 text-chalk"
          : "border-line text-haze hover:text-chalk hover:bg-ink-700/40"
      }`}
    >
      <Star size={15} className={active ? "fill-chalk text-chalk" : ""} />
      {size === "md" && (active ? "Watching" : "Watch")}
    </button>
  );
}
