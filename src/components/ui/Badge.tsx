export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gain" | "loss";
}) {
  const map = {
    neutral: "text-fog border-line",
    gain: "text-gain border-gain/30 bg-gain/5",
    loss: "text-loss border-loss/30 bg-loss/5",
  };
  return (
    <span
      className={`tabular inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}
