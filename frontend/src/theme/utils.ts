// ============================================================================
// THEME UTILITIES & HELPERS
// FILE LOCATION: src/theme/utils.ts
// ============================================================================

import { useTheme } from "./ThemeProvider";
import { glassHeavyTheme } from "./constants";

/**
 * Get CSS classes for current theme variant
 */
export const useThemeClasses = () => {
  const { glassIntensity, isGlassMode } = useTheme();

  return {
    page: isGlassMode
      ? `glass-page glass-${glassIntensity} bg-gradient-to-br from-slate-900/5 via-slate-800/10 to-slate-900/5`
      : "softclub-page bg-gradient-to-br from-slate-50 via-cyan-50/50 to-purple-50/50",

    card: isGlassMode
      ? `glass-card backdrop-blur-${glassIntensity === "whisper" ? "sm" : glassIntensity === "extreme" ? "3xl" : "xl"} bg-white/20 border border-white/30`
      : "softclub-card bg-gradient-to-br from-white/90 via-cyan-50/30 to-purple-50/20 rounded-3xl shadow-lg",

    text: isGlassMode
      ? "text-white/90"
      : "text-slate-700",

    background: isGlassMode
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      : "bg-gradient-to-br from-cloud-white via-silver-matte/30 to-lavender-mist/10",
  };
};

/**
 * Get glass level configuration for Glass Heavy theme
 */
export const useGlassLevel = () => {
  const { glassIntensity, isGlassMode } = useTheme();

  if (!isGlassMode) {
    return null;
  }

  return glassHeavyTheme.levels[glassIntensity];
};

/**
 * Get theme context safely - returns null if not in provider
 */
export const useThemeContext = () => {
  try {
    return useTheme();
  } catch {
    return null;
  }
};

/**
 * Check if we're in a theme provider
 */
export const useHasThemeProvider = (): boolean => {
  return useThemeContext() !== null;
};

/**
 * HOC to inject theme props into any component
 */
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: ReturnType<typeof useTheme> }>
) => {
  const WrappedComponent = (props: P) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };

  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  return WrappedComponent;
};