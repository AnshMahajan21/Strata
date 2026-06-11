interface Props {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

/** Lightweight inline sparkline rendered as a single SVG path. */
export function Sparkline({ data, width = 120, height = 32, className = "" }: Props) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / span) * (height - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const up = data[data.length - 1] >= data[0];
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden
    >
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={up ? "var(--spark-up, #5fcf80)" : "var(--spark-down, #e2706b)"}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.9}
      />
    </svg>
  );
}
