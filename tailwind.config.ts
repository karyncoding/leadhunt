import type { Config } from "tailwindcss";

// Tokens do LeadHunt — tema "field intelligence": fundo quase-preto com
// textura esverdeada de mapa topográfico e um único acento âmbar de "sinalizador",
// evitando o padrão genérico preto+verde-ácido/vermelhão.
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0B0F0D", // fundo principal
          raised: "#121815", // superfícies elevadas (cards)
          overlay: "#182019", // hover / overlay
        },
        border: {
          DEFAULT: "#232D27",
          strong: "#324038",
        },
        ink: {
          DEFAULT: "#E9EFE9",
          muted: "#9AAAA0",
          faint: "#5E6E64",
        },
        flare: {
          DEFAULT: "#F2A93B", // acento principal — "sinalizador"
          soft: "#F2A93B1A",
          strong: "#FFC266",
        },
        signal: {
          good: "#5FB88A",
          warn: "#F2A93B",
          bad: "#D9714E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(0,0,0,0.4)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sweep: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        sweep: "sweep 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
