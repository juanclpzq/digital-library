/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ============================================================================
      // DUAL THEME COLOR SYSTEM - SOFTCLUB + GLASS HEAVY
      // ============================================================================
      colors: {
        // Softclub Theme Colors - Gen X Nostalgic Palette
        "soft-cyan": "#7FDBFF",
        "lavender-mist": "#B19CD9",
        "peachy-keen": "#FFAAA5",
        "mint-dream": "#7FFFE0",
        "sunset-coral": "#FF6B9D",
        "cloud-white": "#F8F9FA",
        "midnight-navy": "#001122",
        "silver-matte": "#E8E8E8",

        // Glass Heavy uses the same base colors with opacity modifiers
        "glass-cyan": "#7FDBFF",
        "glass-lavender": "#B19CD9",
        "glass-peach": "#FFAAA5",
        "glass-mint": "#7FFFE0",
        "glass-coral": "#FF6B9D",
      },

      // ============================================================================
      // ENHANCED OPACITY SCALE FOR GLASS EFFECTS
      // ============================================================================
      opacity: {
        15: "0.15",
        18: "0.18",
        22: "0.22",
        25: "0.25",
        28: "0.28",
        35: "0.35",
        45: "0.45",
        65: "0.65",
      },

      // ============================================================================
      // ADVANCED BACKDROP BLUR FOR GLASS INTENSITY SYSTEM
      // ============================================================================
      backdropBlur: {
        "glass-whisper": "6px",
        "glass-light": "12px",
        "glass-medium": "20px",
        "glass-heavy": "32px",
        "glass-extreme": "48px",
      },

      // ============================================================================
      // DUAL SHADOW SYSTEMS
      // ============================================================================
      boxShadow: {
        // Softclub Shadows - Gentle & Optimistic
        soft: "0 25px 50px -12px rgba(177, 156, 217, 0.15), 0 10px 20px -5px rgba(127, 219, 255, 0.1)",
        gentle:
          "0 10px 25px -3px rgba(127, 219, 255, 0.1), 0 4px 6px -2px rgba(177, 156, 217, 0.1)",

        // Glass Heavy Shadows - Deep & Premium
        "glass-sm":
          "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
        "glass-md":
          "0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
        "glass-lg":
          "0 12px 32px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.5)",
        "glass-xl":
          "0 16px 48px rgba(0, 0, 0, 0.18), inset 0 2px 0 rgba(255, 255, 255, 0.6)",
        "glass-2xl":
          "0 24px 64px rgba(0, 0, 0, 0.22), inset 0 3px 0 rgba(255, 255, 255, 0.7)",
      },

      // ============================================================================
      // ENHANCED BLUR UTILITIES
      // ============================================================================
      blur: {
        "glass-subtle": "4px",
        "glass-soft": "8px",
        "glass-medium": "16px",
        "glass-strong": "24px",
        "glass-intense": "40px",
      },

      // ============================================================================
      // CUSTOM FONT FAMILIES
      // ============================================================================
      fontFamily: {
        softclub: ["Inter", "system-ui", "sans-serif"],
        glass: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
      },

      // ============================================================================
      // CUSTOM ANIMATIONS
      // ============================================================================
      animation: {
        "soft-pulse": "soft-pulse 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "glass-shimmer": "glass-shimmer 3s ease-in-out infinite",
        "glass-ripple": "glass-ripple 0.6s ease-out",
        condensation: "condensation 4s ease-in-out infinite",
      },

      keyframes: {
        "soft-pulse": {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glass-shimmer": {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
        },
        "glass-ripple": {
          "0%": { transform: "scale(0)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 0 },
        },
        condensation: {
          "0%, 100%": { opacity: 0.3, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.1)" },
        },
      },

      // ============================================================================
      // GRADIENT UTILITIES
      // ============================================================================
      backgroundImage: {
        "gradient-softclub":
          "linear-gradient(135deg, #F8F9FA 0%, #7FDBFF 25%, #B19CD9 50%, #FFAAA5 75%, #7FFFE0 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      // ============================================================================
      // SPACING EXTENSIONS
      // ============================================================================
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },

      // ============================================================================
      // BORDER RADIUS EXTENSIONS
      // ============================================================================
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ============================================================================
      // Z-INDEX SCALE
      // ============================================================================
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },

      // ============================================================================
      // BACKDROP FILTERS (ADDITIONAL)
      // ============================================================================
      backdropSaturate: {
        25: ".25",
        75: ".75",
        125: "1.25",
        200: "2",
      },

      // ============================================================================
      // TRANSITION TIMING FUNCTIONS
      // ============================================================================
      transitionTimingFunction: {
        "ease-soft": "cubic-bezier(0.25, 0.25, 0, 1)",
        "ease-glass": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    // Custom plugin for glass effects
    function ({ addUtilities }) {
      const newUtilities = {
        ".glass-whisper": {
          backdropFilter: "blur(6px) saturate(150%)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-light": {
          backdropFilter: "blur(12px) saturate(150%)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
        },
        ".glass-medium": {
          backdropFilter: "blur(20px) saturate(150%)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
        ".glass-heavy": {
          backdropFilter: "blur(32px) saturate(150%)",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.35)",
        },
        ".glass-extreme": {
          backdropFilter: "blur(48px) saturate(150%)",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
