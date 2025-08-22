// ============================================================================
// THEME INDEX - CENTRALIZED THEME EXPORTS
// FILE LOCATION: src/theme/index.ts
// ============================================================================

// Theme Provider & Context (Solo componentes)
export { ThemeProvider, useTheme } from "./ThemeProvider";
export type { ThemeContextType } from "./ThemeProvider";

// Theme Constants & Configurations
export {
  softclubTheme,
  glassHeavyTheme,
  type ThemeVariant,
  type GlassIntensity,
  type SoftclubTheme,
  type GlassHeavyTheme,
} from "./constants";

// Theme Utilities (Hooks y helpers)
export {
  useThemeClasses,
  useGlassLevel,
  useThemeContext,
  useHasThemeProvider,
  withTheme,
} from "./utils";

// ============================================================================
// THEME FACTORY FUNCTIONS
// ============================================================================

/**
 * Creates a theme configuration with custom overrides
 */
export const createThemeConfig = (
  baseTheme: "softclub" | "glass-heavy",
  overrides?: Record<string, unknown>
) => {
  // Importación dinámica para evitar dependencias circulares
  const { softclubTheme, glassHeavyTheme } = require("./constants");
  const base = baseTheme === "softclub" ? softclubTheme : glassHeavyTheme;
  return { ...base, ...overrides };
};

/**
 * Theme switching utilities
 */
export const ThemeUtils = {
  isGlassMode: (variant: string) => variant === "glass-heavy",
  isSoftclubMode: (variant: string) => variant === "softclub",

  getThemeClasses: (variant: string, intensity?: string) => {
    const isGlass = variant === "glass-heavy";
    return {
      container: isGlass
        ? `glass-container glass-${intensity || "medium"}`
        : "softclub-container",
      background: isGlass
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-br from-slate-50 via-cyan-50/50 to-purple-50/50",
    };
  },

  validateThemeVariant: (
    variant: string
  ): variant is "softclub" | "glass-heavy" => {
    return variant === "softclub" || variant === "glass-heavy";
  },

  validateGlassIntensity: (
    intensity: string
  ): intensity is "whisper" | "light" | "medium" | "heavy" | "extreme" => {
    return ["whisper", "light", "medium", "heavy", "extreme"].includes(
      intensity
    );
  },
};
