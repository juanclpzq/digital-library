// ============================================================================
// USE ADAPTIVE STYLES HOOK - DYNAMIC STYLING BASED ON THEME
// FILE LOCATION: src/hooks/useAdaptiveStyles.ts
// ============================================================================

import { useMemo } from "react";
import { useTheme } from "@/theme/ThemeProvider";

// ============================================================================
// ADAPTIVE STYLES INTERFACE
// ============================================================================

export interface AdaptiveStyles {
  // Container styles
  container: string;
  card: string;
  panel: string;
  modal: string;

  // Interactive elements
  button: string;
  buttonPrimary: string;
  buttonSecondary: string;
  input: string;

  // Text styles
  heading: string;
  subheading: string;
  body: string;
  caption: string;

  // Status indicators
  success: string;
  warning: string;
  error: string;
  info: string;

  // Layout
  header: string;
  sidebar: string;
  footer: string;

  // Utility classes
  glassTint: string;
  textColor: string;
  borderColor: string;
  shadowClass: string;
}

// ============================================================================
// SOFTCLUB STYLES
// ============================================================================

const getSoftclubStyles = (): AdaptiveStyles => ({
  // Containers
  container:
    "bg-gradient-to-br from-cloud-white via-silver-matte to-lavender-mist/20",
  card: "bg-gradient-to-br from-white/90 via-cloud-white to-silver-matte/80 backdrop-blur-sm border border-white/60 rounded-3xl shadow-soft",
  panel:
    "bg-gradient-to-br from-cloud-white/95 to-silver-matte/85 border border-white/50 rounded-2xl shadow-gentle",
  modal:
    "bg-gradient-to-br from-white/95 via-cloud-white to-lavender-mist/30 border border-white/70 rounded-3xl shadow-soft backdrop-blur-md",

  // Interactive
  button:
    "bg-gradient-to-r from-soft-cyan to-mint-dream hover:from-soft-cyan/90 hover:to-mint-dream/90 text-midnight-navy font-semibold px-6 py-3 rounded-2xl shadow-gentle hover:shadow-soft transition-all duration-300 hover:scale-105",
  buttonPrimary:
    "bg-gradient-to-r from-lavender-mist to-peachy-keen hover:from-lavender-mist/90 hover:to-peachy-keen/90 text-white font-bold px-8 py-4 rounded-2xl shadow-soft hover:shadow-gentle transition-all duration-300 hover:scale-105",
  buttonSecondary:
    "bg-gradient-to-r from-mint-dream/60 to-soft-cyan/60 hover:from-mint-dream/80 hover:to-soft-cyan/80 text-midnight-navy font-medium px-6 py-3 rounded-2xl border border-white/40 hover:border-white/60 transition-all duration-300",
  input:
    "bg-white/80 border border-soft-cyan/30 rounded-2xl px-4 py-3 text-midnight-navy placeholder-midnight-navy/50 focus:border-lavender-mist focus:ring-2 focus:ring-lavender-mist/20 focus:outline-none backdrop-blur-sm",

  // Text
  heading: "text-midnight-navy font-bold tracking-tight",
  subheading: "text-midnight-navy/80 font-semibold tracking-wide",
  body: "text-midnight-navy/70 font-medium",
  caption: "text-midnight-navy/60 text-sm font-medium uppercase tracking-wider",

  // Status
  success:
    "bg-gradient-to-r from-mint-dream to-emerald-300 text-midnight-navy border border-emerald-200",
  warning:
    "bg-gradient-to-r from-peachy-keen to-orange-300 text-midnight-navy border border-orange-200",
  error:
    "bg-gradient-to-r from-sunset-coral to-red-300 text-white border border-red-200",
  info: "bg-gradient-to-r from-soft-cyan to-blue-300 text-midnight-navy border border-blue-200",

  // Layout
  header:
    "bg-gradient-to-r from-cloud-white/95 via-soft-cyan/20 to-lavender-mist/30 backdrop-blur-md border-b border-white/40",
  sidebar:
    "bg-gradient-to-b from-cloud-white/90 to-silver-matte/80 border-r border-white/50 backdrop-blur-sm",
  footer:
    "bg-gradient-to-r from-silver-matte/80 via-cloud-white/70 to-lavender-mist/20 border-t border-white/40",

  // Utilities
  glassTint: "bg-white/20 backdrop-blur-sm",
  textColor: "text-midnight-navy",
  borderColor: "border-white/40",
  shadowClass: "shadow-soft",
});

// ============================================================================
// GLASS HEAVY STYLES
// ============================================================================

const getGlassHeavyStyles = (intensity: string): AdaptiveStyles => {
  const intensityMap = {
    whisper: { blur: "backdrop-blur-[6px]", opacity: "bg-white/10" },
    light: { blur: "backdrop-blur-[12px]", opacity: "bg-white/15" },
    medium: { blur: "backdrop-blur-[20px]", opacity: "bg-white/20" },
    heavy: { blur: "backdrop-blur-[32px]", opacity: "bg-white/25" },
    extreme: { blur: "backdrop-blur-[48px]", opacity: "bg-white/30" },
  };

  const glass =
    intensityMap[intensity as keyof typeof intensityMap] || intensityMap.medium;
  const glassBase = `${glass.blur} ${glass.opacity}`;

  return {
    // Containers
    container: `${glassBase} border border-white/20 rounded-3xl`,
    card: `${glass.blur} bg-white/18 border border-white/30 rounded-2xl shadow-glass-xl`,
    panel: `${glass.blur} bg-white/15 border border-white/25 rounded-2xl shadow-glass-lg`,
    modal: `${glass.blur} bg-white/25 border border-white/35 rounded-3xl shadow-glass-xl`,

    // Interactive
    button: `${glass.blur} bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl border border-white/25 hover:border-white/40 transition-all duration-300 hover:scale-105 shadow-glass-lg`,
    buttonPrimary: `${glass.blur} bg-gradient-to-r from-cyan-400/30 to-blue-400/30 hover:from-cyan-400/40 hover:to-blue-400/40 text-white font-bold px-8 py-4 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 shadow-glass-xl`,
    buttonSecondary: `${glass.blur} bg-white/15 hover:bg-white/25 text-white/90 font-medium px-6 py-3 rounded-xl border border-white/20 hover:border-white/35 transition-all duration-300`,
    input: `${glass.blur} bg-white/15 border border-white/25 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:outline-none`,

    // Text
    heading: "text-white font-bold tracking-tight",
    subheading: "text-white/90 font-semibold tracking-wide",
    body: "text-white/80 font-medium",
    caption: "text-white/70 text-sm font-medium uppercase tracking-wider",

    // Status
    success: `${glass.blur} bg-gradient-to-r from-emerald-400/25 to-green-400/25 text-white border border-emerald-400/30`,
    warning: `${glass.blur} bg-gradient-to-r from-amber-400/25 to-orange-400/25 text-white border border-amber-400/30`,
    error: `${glass.blur} bg-gradient-to-r from-red-400/25 to-pink-400/25 text-white border border-red-400/30`,
    info: `${glass.blur} bg-gradient-to-r from-cyan-400/25 to-blue-400/25 text-white border border-cyan-400/30`,

    // Layout
    header: `${glass.blur} bg-white/20 border-b border-white/25 shadow-glass-lg`,
    sidebar: `${glass.blur} bg-white/18 border-r border-white/25 shadow-glass-lg`,
    footer: `${glass.blur} bg-white/15 border-t border-white/20`,

    // Utilities
    glassTint: glassBase,
    textColor: "text-white",
    borderColor: "border-white/25",
    shadowClass: "shadow-glass-lg",
  };
};

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useAdaptiveStyles = (): AdaptiveStyles => {
  const theme = useTheme();

  const styles = useMemo(() => {
    if (theme.isGlassMode) {
      return getGlassHeavyStyles(theme.glassIntensity);
    }
    return getSoftclubStyles();
  }, [theme.variant, theme.glassIntensity]);

  return styles;
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook for component-specific adaptive styling
 */
export const useAdaptiveComponentStyles = (component: string) => {
  const styles = useAdaptiveStyles();
  const theme = useTheme();

  return useMemo(() => {
    const componentStyles = {
      card: styles.card,
      button: styles.button,
      input: styles.input,
      modal: styles.modal,
      panel: styles.panel,
    };

    return {
      base:
        componentStyles[component as keyof typeof componentStyles] ||
        styles.container,
      text: styles.textColor,
      border: styles.borderColor,
      shadow: styles.shadowClass,
      theme: theme.variant,
      isGlass: theme.isGlassMode,
    };
  }, [styles, theme.variant, component]);
};

/**
 * Hook for getting theme-aware gradient classes
 */
export const useAdaptiveGradients = () => {
  const theme = useTheme();

  return useMemo(() => {
    if (theme.isGlassMode) {
      return {
        primary:
          "bg-gradient-to-br from-cyan-400/30 via-blue-400/25 to-indigo-400/20",
        secondary:
          "bg-gradient-to-br from-purple-400/30 via-pink-400/25 to-rose-400/20",
        accent:
          "bg-gradient-to-br from-emerald-400/30 via-teal-400/20 to-cyan-400/25",
        warning:
          "bg-gradient-to-br from-amber-400/25 via-orange-400/30 to-red-400/20",
      };
    }

    return {
      primary: "bg-gradient-to-br from-soft-cyan via-sky-300 to-blue-300",
      secondary:
        "bg-gradient-to-br from-lavender-mist via-purple-300 to-pink-300",
      accent: "bg-gradient-to-br from-mint-dream via-emerald-300 to-teal-300",
      warning: "bg-gradient-to-br from-peachy-keen via-orange-300 to-red-300",
    };
  }, [theme.variant]);
};

export default useAdaptiveStyles;
