// ============================================================================
// USE ADAPTIVE STYLES HOOK - DYNAMIC STYLING BASED ON THEME
// FILE LOCATION: src/hooks/useAdaptiveStyles.ts
// ============================================================================

import { useMemo } from "react";
import { useTheme } from "@/theme/ThemeProvider";
import {
  getAdaptiveCategoryStyle,
  getAdaptiveStatusStyle,
  getAdaptiveTextColors,
  createAdaptiveButton,
  createAdaptiveContainer,
  glassLevels,
} from "@/theme";
import type { BookCategory, ReadingStatus } from "@/types";

// ============================================================================
// ADAPTIVE STYLES INTERFACE
// ============================================================================

export interface AdaptiveStyles {
  // Container Styles
  container: {
    page: string;
    main: string;
    sidebar: string;
    modal: string;
    card: string;
    floatingCard: string;
  };

  // Button Styles
  button: {
    primary: string;
    secondary: string;
    ghost: string;
    danger: string;
    success: string;
  };

  // Input Styles
  input: {
    base: string;
    focused: string;
    error: string;
    success: string;
    search: string;
  };

  // Text Styles
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverted: string;
    muted: string;
    accent: string;
  };

  // Background Styles
  background: {
    page: string;
    card: string;
    overlay: string;
    gradient: string;
    pattern: string;
  };

  // Border & Effects
  border: {
    base: string;
    focused: string;
    muted: string;
  };

  // Status-specific styles
  status: Record<ReadingStatus, string>;

  // Category-specific styles
  category: (category: BookCategory) => string;

  // Animation classes
  animation: {
    cardEnter: string;
    cardHover: string;
    buttonHover: string;
    fadeIn: string;
    slideIn: string;
  };
}

// ============================================================================
// MAIN HOOK IMPLEMENTATION
// ============================================================================

export const useAdaptiveStyles = (): AdaptiveStyles => {
  const theme = useTheme();

  const styles = useMemo(() => {
    const isGlass = theme.isGlassMode;
    const glassLevel =
      theme.glassHeavy?.levels[theme.glassIntensity] || glassLevels.medium;
    const textColors = getAdaptiveTextColors(theme.variant);

    // ========================================================================
    // GLASS HEAVY STYLES
    // ========================================================================

    if (isGlass) {
      return {
        // Container Styles - Glass Mode
        container: {
          page: `min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${glassLevel.backdrop}`,
          main: `${glassLevel.backdrop} ${glassLevel.border} bg-white/15 rounded-3xl`,
          sidebar: `${glassLevel.backdrop} ${glassLevel.border} bg-white/20 rounded-2xl`,
          modal: `${glassLevel.backdrop} ${glassLevel.border} bg-white/25 rounded-3xl shadow-glass-xl`,
          card: `${glassLevel.backdrop} ${glassLevel.border} bg-white/15 rounded-2xl shadow-glass-md`,
          floatingCard: `${theme.glassHeavy.levels.extreme.backdrop} bg-white/25 border border-white/40 rounded-3xl shadow-glass-xl`,
        },

        // Button Styles - Glass Mode
        button: {
          primary: `${glassLevel.backdrop} bg-gradient-to-r from-blue-400/30 to-purple-400/30 border border-blue-300/50 text-white hover:from-blue-400/40 hover:to-purple-400/40 transition-all duration-300 shadow-lg shadow-blue-500/25`,
          secondary: `${glassLevel.backdrop} bg-white/25 border border-white/30 ${textColors.primary} hover:bg-white/35 transition-all duration-300`,
          ghost: `${theme.glassHeavy.levels.light.backdrop} bg-white/10 border border-white/20 ${textColors.secondary} hover:bg-white/20 transition-all duration-300`,
          danger: `${glassLevel.backdrop} bg-gradient-to-r from-red-400/30 to-pink-400/30 border border-red-300/50 text-white hover:from-red-400/40 hover:to-pink-400/40`,
          success: `${glassLevel.backdrop} bg-gradient-to-r from-emerald-400/30 to-teal-400/30 border border-emerald-300/50 text-white hover:from-emerald-400/40 hover:to-teal-400/40`,
        },

        // Input Styles - Glass Mode
        input: {
          base: `${glassLevel.backdrop} bg-white/15 border border-white/25 ${textColors.primary} placeholder:text-gray-600/60 rounded-xl px-4 py-3`,
          focused: `${glassLevel.backdrop} bg-white/20 border border-white/50 ring-2 ring-white/30`,
          error: `${glassLevel.backdrop} bg-red-400/15 border border-red-300/40 text-red-900/90`,
          success: `${glassLevel.backdrop} bg-emerald-400/15 border border-emerald-300/40 text-emerald-900/90`,
          search: `${theme.glassHeavy.levels.medium.backdrop} bg-white/20 border border-white/30 rounded-full px-6 py-3`,
        },

        // Text Styles - Glass Mode
        text: {
          primary: textColors.primary,
          secondary: textColors.secondary,
          tertiary: textColors.tertiary,
          inverted: textColors.inverted,
          muted: "text-gray-500/80",
          accent: "text-blue-600/90",
        },

        // Background Styles - Glass Mode
        background: {
          page: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50",
          card: `${glassLevel.backdrop} bg-white/15`,
          overlay: `${theme.glassHeavy.levels.heavy.backdrop} bg-black/20`,
          gradient: "bg-gradient-to-br from-white/30 to-white/10",
          pattern:
            "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]",
        },

        // Border Styles - Glass Mode
        border: {
          base: "border border-white/30",
          focused: "border border-white/50 ring-2 ring-white/20",
          muted: "border border-white/20",
        },

        // Status Styles - Glass Mode
        status: {
          "want-to-read": getAdaptiveStatusStyle("want-to-read", "glass-heavy"),
          reading: getAdaptiveStatusStyle("reading", "glass-heavy"),
          completed: getAdaptiveStatusStyle("completed", "glass-heavy"),
          paused: getAdaptiveStatusStyle("paused", "glass-heavy"),
          abandoned: getAdaptiveStatusStyle("abandoned", "glass-heavy"),
          reference: getAdaptiveStatusStyle("reference", "glass-heavy"),
        } as Record<ReadingStatus, string>,

        // Category Function - Glass Mode
        category: (category: BookCategory) =>
          getAdaptiveCategoryStyle(category, "glass-heavy"),

        // Animation Styles - Glass Mode
        animation: {
          cardEnter: "animate-fade-in-up",
          cardHover:
            "hover:scale-[1.03] hover:-translate-y-2 transition-all duration-400 ease-out",
          buttonHover:
            "hover:scale-105 active:scale-95 transition-transform duration-200",
          fadeIn: "animate-fade-in",
          slideIn: "animate-slide-in-right",
        },
      };
    }

    // ========================================================================
    // SOFTCLUB STYLES
    // ========================================================================

    return {
      // Container Styles - Softclub Mode
      container: {
        page: "min-h-screen bg-gradient-to-br from-cloud-white via-soft-cyan/5 to-lavender-mist/10",
        main: "bg-gradient-to-br from-cloud-white/80 to-silver-matte/40 backdrop-blur-sm border border-cloud-white/30 rounded-3xl shadow-soft",
        sidebar:
          "bg-gradient-to-br from-cloud-white/60 to-silver-matte/20 shadow-gentle rounded-2xl",
        modal:
          "bg-gradient-to-br from-cloud-white/90 to-silver-matte/50 backdrop-blur-md shadow-soft-hover rounded-3xl",
        card: "bg-gradient-to-br from-cloud-white/60 to-silver-matte/20 shadow-soft rounded-softclub",
        floatingCard:
          "bg-gradient-to-br from-cloud-white/80 to-silver-matte/30 shadow-soft-hover rounded-3xl",
      },

      // Button Styles - Softclub Mode
      button: {
        primary: createAdaptiveButton("softclub", "primary"),
        secondary: createAdaptiveButton("softclub", "secondary"),
        ghost:
          "bg-cloud-white/40 hover:bg-cloud-white/60 text-midnight-navy/80 hover:text-midnight-navy border border-silver-matte/30 hover:border-soft-cyan/40 transition-all duration-300",
        danger:
          "bg-gradient-to-r from-sunset-coral/70 to-peachy-keen/70 text-cloud-white hover:from-sunset-coral/80 hover:to-peachy-keen/80 shadow-gentle hover:scale-105 active:scale-95",
        success:
          "bg-gradient-to-r from-mint-dream/80 to-soft-cyan/80 text-midnight-navy/90 hover:from-mint-dream/90 hover:to-soft-cyan/90 shadow-gentle hover:scale-105 active:scale-95",
      },

      // Input Styles - Softclub Mode
      input: {
        base: "bg-cloud-white/60 border border-silver-matte/40 text-midnight-navy placeholder:text-midnight-navy/50 rounded-gentle px-4 py-3 focus:border-soft-cyan/60 focus:ring-2 focus:ring-soft-cyan/20",
        focused:
          "bg-cloud-white/80 border-soft-cyan/60 ring-2 ring-soft-cyan/20 shadow-gentle",
        error:
          "bg-peachy-keen/20 border-sunset-coral/60 text-midnight-navy ring-2 ring-sunset-coral/20",
        success:
          "bg-mint-dream/20 border-mint-dream/60 text-midnight-navy ring-2 ring-mint-dream/20",
        search:
          "bg-cloud-white/70 border border-silver-matte/30 rounded-full px-6 py-3 focus:border-soft-cyan/60",
      },

      // Text Styles - Softclub Mode
      text: {
        primary: textColors.primary,
        secondary: textColors.secondary,
        tertiary: textColors.tertiary,
        inverted: textColors.inverted,
        muted: "text-midnight-navy/40",
        accent: "text-soft-cyan",
      },

      // Background Styles - Softclub Mode
      background: {
        page: "bg-gradient-to-br from-cloud-white via-soft-cyan/5 to-lavender-mist/10",
        card: "bg-gradient-to-br from-cloud-white/60 to-silver-matte/20",
        overlay: "bg-midnight-navy/40 backdrop-blur-sm",
        gradient:
          "bg-gradient-to-br from-mint-dream/20 via-soft-cyan/15 to-lavender-mist/20",
        pattern:
          "bg-gradient-to-br from-midnight-navy/3 via-transparent to-midnight-navy/3",
      },

      // Border Styles - Softclub Mode
      border: {
        base: "border border-silver-matte/40",
        focused: "border border-soft-cyan/60 ring-2 ring-soft-cyan/20",
        muted: "border border-cloud-white/30",
      },

      // Status Styles - Softclub Mode
      status: {
        "want-to-read": getAdaptiveStatusStyle("want-to-read", "softclub"),
        reading: getAdaptiveStatusStyle("reading", "softclub"),
        completed: getAdaptiveStatusStyle("completed", "softclub"),
        paused: getAdaptiveStatusStyle("paused", "softclub"),
        abandoned: getAdaptiveStatusStyle("abandoned", "softclub"),
        reference: getAdaptiveStatusStyle("reference", "softclub"),
      } as Record<ReadingStatus, string>,

      // Category Function - Softclub Mode
      category: (category: BookCategory) =>
        getAdaptiveCategoryStyle(category, "softclub"),

      // Animation Styles - Softclub Mode
      animation: {
        cardEnter: "animate-gentle-bounce",
        cardHover:
          "hover:scale-102 hover:-translate-y-1 transition-all duration-500 ease-gentle",
        buttonHover:
          "hover:scale-105 active:scale-95 transition-all duration-300 ease-soft",
        fadeIn: "animate-soft-pulse",
        slideIn: "animate-float",
      },
    };
  }, [theme.variant, theme.glassIntensity, theme.isGlassMode]);

  return styles;
};

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook for component-specific adaptive styles
 */
export const useAdaptiveComponentStyles = (
  componentType: "card" | "button" | "input" | "modal"
) => {
  const allStyles = useAdaptiveStyles();

  return useMemo(() => {
    switch (componentType) {
      case "card":
        return {
          base: allStyles.container.card,
          floating: allStyles.container.floatingCard,
          hover: allStyles.animation.cardHover,
          enter: allStyles.animation.cardEnter,
        };

      case "button":
        return {
          ...allStyles.button,
          hover: allStyles.animation.buttonHover,
        };

      case "input":
        return {
          ...allStyles.input,
          border: allStyles.border,
        };

      case "modal":
        return {
          container: allStyles.container.modal,
          overlay: allStyles.background.overlay,
          border: allStyles.border.base,
        };

      default:
        return allStyles;
    }
  }, [allStyles, componentType]);
};

/**
 * Hook for getting status-specific styles
 */
export const useStatusStyles = () => {
  const { status } = useAdaptiveStyles();

  return useMemo(
    () => ({
      getStatusStyle: (statusName: ReadingStatus) => status[statusName],
      getAllStatuses: () => status,
    }),
    [status]
  );
};

/**
 * Hook for getting category-specific styles
 */
export const useCategoryStyles = () => {
  const { category } = useAdaptiveStyles();

  return useMemo(
    () => ({
      getCategoryStyle: category,
    }),
    [category]
  );
};

/**
 * Hook for animation classes based on theme
 */
export const useAdaptiveAnimations = () => {
  const { animation } = useAdaptiveStyles();
  const theme = useTheme();

  return useMemo(
    () => ({
      ...animation,
      // Motion preset configs for Framer Motion
      motionPresets: theme.isGlassMode
        ? theme.glassHeavy?.motionPresets
        : {
            cardEnter: {
              initial: { opacity: 0, y: 30, scale: 0.95 },
              animate: { opacity: 1, y: 0, scale: 1 },
              transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] },
            },
            cardHover: {
              initial: { scale: 1, y: 0 },
              animate: { scale: 1.02, y: -4 },
              transition: { duration: 0.3, ease: "easeOut" },
            },
          },
    }),
    [animation, theme]
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useAdaptiveStyles;

// Named exports for convenience
export {
  useAdaptiveComponentStyles,
  useStatusStyles,
  useCategoryStyles,
  useAdaptiveAnimations,
};
