export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Strata. Fundamentals, beautifully presented.</p>
        <p className="text-fog/70">
          Data for illustration only — not investment advice.
        </p>
      </div>
    </footer>
  );
}
