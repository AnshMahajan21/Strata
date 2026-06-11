import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/useCompany";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState("");
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const { data: results } = useSearch(debounced);

  const go = (symbol: string) => {
    setOpen(false);
    setQ("");
    navigate(`/company/${symbol}`);
  };

  return (
    <div ref={ref} className="relative w-full">
      <div
        className={`flex items-center gap-2 rounded-full border border-line bg-ink-800/70 px-4 ${
          compact ? "py-2" : "py-3"
        }`}
      >
        <Search size={16} className="text-fog" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results?.[0]) go(results[0].symbol);
          }}
          placeholder="Search a company or ticker…"
          className="w-full bg-transparent text-sm text-chalk placeholder:text-fog focus:outline-none"
        />
      </div>
      {open && results && results.length > 0 && (
        <ul className="glass absolute z-30 mt-2 w-full overflow-hidden p-1">
          {results.map((r) => (
            <li key={r.symbol}>
              <button
                onClick={() => go(r.symbol)}
                className="focus-ring flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-ink-700/60"
              >
                <span className="flex items-center gap-3">
                  <span className="tabular w-14 font-mono text-sm text-chalk">{r.symbol}</span>
                  <span className="truncate text-sm text-haze">{r.name}</span>
                </span>
                <span className="text-[11px] text-fog">{r.exchange}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
