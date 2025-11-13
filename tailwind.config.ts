import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // 🍎 Apple Liquid Glass Color System
      colors: {
        // Soft dark backgrounds (not pure black)
        bg: {
          primary: "#0a0e1a",      // Deep navy blue
          secondary: "#12151f",    // Slightly lighter
          tertiary: "#1a1d29",     // Modals, cards
          // Light mode
          "light-primary": "#f5f5f7",
          "light-secondary": "#fafafa",
          "light-tertiary": "#ffffff",
        },

        // Glass material overlays
        glass: {
          "ultra-thin": "rgba(255, 255, 255, 0.05)",
          thin: "rgba(255, 255, 255, 0.08)",
          regular: "rgba(255, 255, 255, 0.12)",
          thick: "rgba(255, 255, 255, 0.18)",
          // Dark glass for light backgrounds
          "dark-thin": "rgba(0, 0, 0, 0.05)",
          "dark-regular": "rgba(0, 0, 0, 0.08)",
        },

        // Apple-style accent colors
        accent: {
          blue: "#007AFF",        // iOS blue
          teal: "#30D5C8",        // Cool teal
          purple: "#AF52DE",      // Soft purple
          pink: "#FF375F",        // Warm pink
          orange: "#FF9500",      // Vibrant orange
          green: "#34C759",       // Success green
          red: "#FF3B30",         // Error red
          yellow: "#FFCC00",      // Warning yellow
        },
      },

      // 🔤 Typography (Apple SF Pro style)
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "system-ui",
          "sans-serif",
        ],
      },

      fontSize: {
        // Apple-precise type scale
        xs: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],    // 11px
        sm: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],    // 13px
        base: ["0.9375rem", { lineHeight: "1.5" }],                            // 15px
        lg: ["1.0625rem", { lineHeight: "1.5" }],                              // 17px
        xl: ["1.25rem", { lineHeight: "1.4" }],                                // 20px
        "2xl": ["1.5rem", { lineHeight: "1.3" }],                              // 24px
        "3xl": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],  // 28px
        "4xl": ["2.125rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }], // 34px
        "5xl": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],   // 40px
        "6xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],     // 48px
        "7xl": ["4rem", { lineHeight: "1", letterSpacing: "-0.03em" }],       // 64px
      },

      // 📐 Spacing (Apple 8pt grid)
      spacing: {
        0.5: "2px",
        15: "60px",
        18: "72px",
        88: "352px",
        128: "512px",
      },

      // 🎭 Border radius (Apple style - generous & consistent)
      borderRadius: {
        xs: "4px",
        sm: "8px",
        DEFAULT: "10px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
      },

      // ✨ Box shadows (Soft Apple-style)
      boxShadow: {
        xs: "0 1px 3px rgba(0, 0, 0, 0.08)",
        sm: "0 2px 8px rgba(0, 0, 0, 0.1)",
        md: "0 8px 32px rgba(0, 0, 0, 0.12)",
        lg: "0 16px 64px rgba(0, 0, 0, 0.16)",
        xl: "0 24px 96px rgba(0, 0, 0, 0.2)",
        "2xl": "0 32px 128px rgba(0, 0, 0, 0.24)",
        // Colored shadows
        "accent-blue": "0 4px 16px rgba(0, 122, 255, 0.3)",
        "accent-purple": "0 4px 16px rgba(175, 82, 222, 0.3)",
        "accent-pink": "0 4px 16px rgba(255, 55, 95, 0.3)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.12)",
        "glass-lg": "0 16px 64px rgba(0, 0, 0, 0.16)",
      },

      // 🎬 Animation (Apple-style - smooth & quick)
      transitionTimingFunction: {
        "apple": "cubic-bezier(0.4, 0, 0.2, 1)",        // Standard
        "apple-in": "cubic-bezier(0.4, 0, 1, 1)",      // Ease in
        "apple-out": "cubic-bezier(0, 0, 0.2, 1)",     // Ease out
        "apple-spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Spring
      },

      // ⏱️ Animation durations (Apple-quick)
      transitionDuration: {
        75: "75ms",
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
        600: "600ms",
      },

      // 🌈 Background gradients (Subtle Apple-style)
      backgroundImage: {
        "gradient-blue": "linear-gradient(180deg, #007AFF 0%, #0051D5 100%)",
        "gradient-purple": "linear-gradient(180deg, #AF52DE 0%, #7C3AED 100%)",
        "gradient-pink": "linear-gradient(180deg, #FF375F 0%, #D61F47 100%)",
        "gradient-teal": "linear-gradient(180deg, #30D5C8 0%, #1FB6AA 100%)",
      },

      // 🪟 Backdrop filter (Glass effect)
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        DEFAULT: "20px",
        md: "40px",
        lg: "60px",
        xl: "80px",
      },

      backdropSaturate: {
        150: "1.5",
        180: "1.8",
        200: "2",
      },

      // 🎯 Keyframes (Apple-style - subtle & refined)
      keyframes: {
        // Fade + Scale (most common)
        "fade-scale": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // Slide up (modals, sheets)
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Slide down (dropdowns)
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Fade in only
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Gentle float (decorative)
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },

      // 🎬 Animation utilities
      animation: {
        "fade-scale": "fade-scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slide-up 0.3s cubic-bezier(0, 0, 0.2, 1)",
        "slide-down": "slide-down 0.2s cubic-bezier(0.4, 0, 1, 1)",
        "fade-in": "fade-in 0.2s ease-out",
        "float-gentle": "float-gentle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
