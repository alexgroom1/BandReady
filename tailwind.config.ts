import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Tablet-landscape-first: 1024x768 base
    screens: {
      // Base breakpoint = tablet landscape
      sm: "640px",
      md: "768px",
      lg: "1024px", // Primary design target
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        nunito: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      fontSize: {
        heading: ["2.5rem", { fontWeight: "700" }],
        body: ["1.25rem", { lineHeight: "1.5" }],
        "button-label": ["1.5rem", { fontWeight: "700" }],
      },
      minHeight: {
        touch: "48px",
        interactive: "80px",
        "design-height": "768px",
      },
      width: {
        "design-width": "1024px",
      },
      height: {
        "design-height": "768px",
      },
      maxWidth: {
        "design-width": "1024px",
      },
      colors: {
        golden: "var(--golden)",
        "blue-active": "var(--blue-active)",
        mint: "var(--mint)",
        "slate-text": "var(--slate-text)",
        "bg-soft": "var(--bg-soft)",
        locked: "var(--locked)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
