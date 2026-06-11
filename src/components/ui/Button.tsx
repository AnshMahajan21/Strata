import type { ButtonHTMLAttributes } from "react";

type Variant = "solid" | "ghost" | "outline";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  solid: "bg-chalk text-ink-900 hover:bg-white",
  ghost: "text-haze hover:text-chalk hover:bg-ink-700/60",
  outline: "border border-line-strong text-chalk hover:bg-ink-700/60",
};

export function Button({ variant = "solid", className = "", ...rest }: Props) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}
