import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#08080a",
          850: "#0b0b0e",
          800: "#101014",
          750: "#15151a",
          700: "#1b1b21",
          600: "#26262e",
        },
        line: "rgba(255,255,255,0.08)",
        "line-strong": "rgba(255,255,255,0.14)",
        fog: "#8a8a93",
        haze: "#a8a8b0",
        chalk: "#ededee",
        gain: "#5fcf80",
        loss: "#e2706b",
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.24em",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        glass: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 60px -20px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(120% 80% at 70% -10%, rgba(255,255,255,0.06), transparent 60%)",
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
