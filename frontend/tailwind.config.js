/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ============================================================================
      // GEN X SOFTCLUB COLOR PALETTE
      // ============================================================================
      colors: {
        // Primary Softclub Colors
        "soft-cyan": "#7FDBFF",
        "lavender-mist": "#B19CD9",
        "peachy-keen": "#FFAAA5",
        "mint-dream": "#7FFFE0",
        "sunset-coral": "#FF6B9D",

        // Neutrals
        "cloud-white": "#F8F9FA",
        "midnight-navy": "#001122",
        "silver-matte": "#E8E8E8",

        // Extended Palette
        "aqua-mist": "#80E5FF",
        "lavender-blush": "#E6D7FF",
        "peach-whisper": "#FFD4D1",
        "mint-frost": "#B8FFE6",
        "coral-glow": "#FFB3D1",

        // Semantic Colors (Softclub style)
        success: "#7FFFE0",
        warning: "#FFAAA5",
        error: "#FF6B9D",
        info: "#7FDBFF",
      },

      // ============================================================================
      // TYPOGRAPHY - CLEAN & FRIENDLY
      // ============================================================================
      fontFamily: {
        softclub: ["Inter", "Helvetica Neue", "system-ui", "sans-serif"],
        "softclub-display": ["SF Pro Display", "Inter", "sans-serif"],
        "softclub-mono": ["JetBrains Mono", "Monaco", "Consolas", "monospace"],
      },

      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.5" }],
        "2xl": ["1.5rem", { lineHeight: "1.4" }],
        "3xl": ["1.875rem", { lineHeight: "1.3" }],
        "4xl": ["2.25rem", { lineHeight: "1.2" }],
        "5xl": ["3rem", { lineHeight: "1.1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },

      // ============================================================================
      // SPACING - GENEROUS & COMFORTABLE
      // ============================================================================
      spacing: {
        comfortable: "2rem", // 32px
        cozy: "1.5rem", // 24px
        intimate: "1rem", // 16px
        spacious: "3rem", // 48px
        expansive: "4rem", // 64px

        // Extended spacing for larger layouts
        18: "4.5rem", // 72px
        20: "5rem", // 80px
        24: "6rem", // 96px
        28: "7rem", // 112px
        32: "8rem", // 128px
      },

      // ============================================================================
      // BORDER RADIUS - SOFT & ROUNDED
      // ============================================================================
      borderRadius: {
        softclub: "1.5rem", // 24px - Main card radius
        gentle: "1rem", // 16px - Secondary elements
        pill: "9999px", // Full rounded
        button: "1rem", // 16px - Buttons
        input: "0.75rem", // 12px - Form inputs
        modal: "2rem", // 32px - Modals

        // Extended radius options
        "4xl": "2rem", // 32px
        "5xl": "2.5rem", // 40px
        "6xl": "3rem", // 48px
      },

      // ============================================================================
      // BOX SHADOWS - SOFT GLOWS
      // ============================================================================
      boxShadow: {
        // Soft shadows
        soft: "0 25px 50px -12px rgba(177, 156, 217, 0.15)",
        gentle:
          "0 10px 25px -3px rgba(127, 219, 255, 0.1), 0 4px 6px -2px rgba(127, 219, 255, 0.05)",
        floating:
          "0 20px 40px -4px rgba(0, 17, 34, 0.08), 0 8px 16px -4px rgba(0, 17, 34, 0.04)",

        // Hover shadows
        "soft-hover": "0 35px 60px -12px rgba(177, 156, 217, 0.25)",
        "gentle-hover": "0 20px 40px -4px rgba(127, 219, 255, 0.2)",
        "floating-hover": "0 25px 50px -12px rgba(0, 17, 34, 0.15)",

        // Colored glows
        "cyan-glow": "0 20px 40px -4px rgba(127, 219, 255, 0.2)",
        "lavender-glow": "0 20px 40px -4px rgba(177, 156, 217, 0.2)",
        "peach-glow": "0 20px 40px -4px rgba(255, 170, 165, 0.2)",
        "mint-glow": "0 20px 40px -4px rgba(127, 255, 224, 0.2)",
        "coral-glow": "0 20px 40px -4px rgba(255, 107, 157, 0.2)",

        // Inner shadows
        "inset-soft": "inset 0 2px 8px 0 rgba(177, 156, 217, 0.1)",
        "inset-gentle": "inset 0 1px 4px 0 rgba(0, 17, 34, 0.05)",
      },

      // ============================================================================
      // BACKDROP BLUR - GLASSMORPHISM EFFECTS
      // ============================================================================
      backdropBlur: {
        soft: "8px",
        gentle: "12px",
        strong: "16px",
      },

      // ============================================================================
      // ANIMATIONS & TRANSITIONS
      // ============================================================================
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1200: "1200ms",
      },

      transitionTimingFunction: {
        gentle: "cubic-bezier(0.25, 0.25, 0, 1)",
        soft: "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-soft": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },

      // ============================================================================
      // GRADIENTS - PRE-DEFINED BACKGROUNDS
      // ============================================================================
      backgroundImage: {
        // Hero gradients
        "gradient-hero":
          "linear-gradient(135deg, #7FDBFF 0%, #B19CD9 50%, #FFAAA5 100%)",
        "gradient-hero-reverse":
          "linear-gradient(45deg, #FFAAA5 0%, #B19CD9 50%, #7FDBFF 100%)",
        "gradient-dreamy":
          "linear-gradient(90deg, #B19CD9 0%, #7FFFE0 50%, #80E5FF 100%)",
        "gradient-sunset":
          "linear-gradient(135deg, #FF6B9D 0%, #FFAAA5 50%, #FFD4D1 100%)",

        // Page backgrounds
        "gradient-page":
          "linear-gradient(135deg, #F8F9FA 0%, rgba(127, 219, 255, 0.05) 50%, rgba(177, 156, 217, 0.1) 100%)",
        "gradient-dashboard":
          "linear-gradient(135deg, #F8F9FA 0%, rgba(128, 229, 255, 0.08) 50%, rgba(255, 212, 209, 0.12) 100%)",

        // Card gradients
        "gradient-card":
          "linear-gradient(135deg, rgba(248, 249, 250, 0.6) 0%, rgba(232, 232, 232, 0.2) 50%, rgba(248, 249, 250, 0.8) 100%)",
        "gradient-card-hover":
          "linear-gradient(135deg, rgba(248, 249, 250, 0.8) 0%, rgba(127, 219, 255, 0.1) 50%, rgba(230, 215, 255, 0.2) 100%)",
      },

      // ============================================================================
      // KEYFRAMES - CUSTOM ANIMATIONS
      // ============================================================================
      keyframes: {
        "gentle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(127, 219, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(177, 156, 217, 0.4)" },
        },
      },

      animation: {
        "gentle-bounce": "gentle-bounce 2s ease-in-out infinite",
        "soft-pulse": "soft-pulse 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
      },

      // ============================================================================
      // SCALE - GENTLE TRANSFORMATIONS
      // ============================================================================
      scale: {
        102: "1.02",
        105: "1.05",
        98: "0.98",
        95: "0.95",
      },

      // ============================================================================
      // Z-INDEX - LAYERING SYSTEM
      // ============================================================================
      zIndex: {
        tooltip: "100",
        modal: "200",
        dropdown: "150",
        overlay: "175",
        navigation: "50",
      },

      // ============================================================================
      // ASPECT RATIOS - FOR BOOK COVERS & MEDIA
      // ============================================================================
      aspectRatio: {
        book: "3/4", // Standard book cover ratio
        card: "4/3", // Card aspect ratio
        golden: "1.618/1", // Golden ratio
      },
    },
  },
  plugins: [
    // ============================================================================
    // CUSTOM UTILITIES - SOFTCLUB SPECIFIC
    // ============================================================================
    function ({ addUtilities }) {
      const newUtilities = {
        // Glass effect utilities
        ".glass-soft": {
          backgroundColor: "rgba(248, 249, 250, 0.6)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(248, 249, 250, 0.2)",
        },
        ".glass-gentle": {
          backgroundColor: "rgba(248, 249, 250, 0.4)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(127, 219, 255, 0.2)",
        },

        // Glow utilities
        ".glow-soft": {
          boxShadow: "0 0 30px rgba(127, 219, 255, 0.2)",
        },
        ".glow-lavender": {
          boxShadow: "0 0 30px rgba(177, 156, 217, 0.3)",
        },
        ".glow-peach": {
          boxShadow: "0 0 30px rgba(255, 170, 165, 0.3)",
        },

        // Text gradients
        ".text-gradient-softclub": {
          background: "linear-gradient(135deg, #7FDBFF 0%, #B19CD9 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },

        // Scroll behaviors
        ".scroll-smooth-soft": {
          scrollBehavior: "smooth",
          scrollPadding: "2rem",
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
