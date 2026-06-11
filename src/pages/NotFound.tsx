import { Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";

export function NotFound() {
  return (
    <AppShell>
      <div className="py-24 text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-serif text-6xl tracking-tight">Nothing here</h1>
        <p className="mt-3 text-haze">That page or ticker couldn’t be found.</p>
        <Link
          to="/"
          className="focus-ring mt-8 inline-flex rounded-full border border-line-strong px-5 py-2.5 text-sm hover:bg-ink-700/60"
        >
          Back home
        </Link>
      </div>
    </AppShell>
  );
}
