// ============================================================================
// THEME INDEX - CENTRALIZED THEME EXPORTS
// FILE LOCATION: src/theme/index.ts
// ============================================================================

// Theme Configurations
export { softclubTheme } from "./softclub";
export { glassHeavyTheme } from "./glass-heavy";

// Theme Provider & Context
export { ThemeProvider, useTheme } from "./ThemeProvider";
export type {
  ThemeContextType,
  SoftclubTheme,
  GlassHeavyTheme,
  ThemeVariant,
  GlassIntensity,
} from "./ThemeProvider";

// Theme Utilities
export * from "./utils";

// ============================================================================
// THEME FACTORY FUNCTIONS
// ============================================================================

/**
 * Creates a theme configuration with custom overrides
 */
export const createThemeConfig = (
  baseTheme: "softclub" | "glass-heavy",
  overrides?: Record<string, any>
) => {
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
    if (variant === "glass-heavy") {
      const intensityMap = {
        whisper: "backdrop-blur-[6px] bg-white/10",
        light: "backdrop-blur-[12px] bg-white/15",
        medium: "backdrop-blur-[20px] bg-white/20",
        heavy: "backdrop-blur-[32px] bg-white/25",
        extreme: "backdrop-blur-[48px] bg-white/30",
      };
      return (
        intensityMap[intensity as keyof typeof intensityMap] ||
        intensityMap.medium
      );
    }

    return "bg-gradient-to-br from-soft-cyan via-lavender-mist to-peachy-keen";
  },
};

// ============================================================================
// THEME PRESETS
// ============================================================================

export const ThemePresets = {
  // Default configurations
  Default: {
    variant: "softclub" as const,
    glassIntensity: "medium" as const,
  },

  // Glass Heavy presets
  GlassWhisper: {
    variant: "glass-heavy" as const,
    glassIntensity: "whisper" as const,
  },

  GlassStandard: {
    variant: "glass-heavy" as const,
    glassIntensity: "medium" as const,
  },

  GlassIntense: {
    variant: "glass-heavy" as const,
    glassIntensity: "extreme" as const,
  },

  // Softclub presets
  SoftclubClassic: {
    variant: "softclub" as const,
    glassIntensity: "medium" as const,
  },
};

// ============================================================================
// THEME VALIDATION
// ============================================================================

export const validateThemeConfig = (config: any) => {
  const validVariants = ["softclub", "glass-heavy"];
  const validIntensities = ["whisper", "light", "medium", "heavy", "extreme"];

  if (!validVariants.includes(config.variant)) {
    console.warn(`Invalid theme variant: ${config.variant}`);
    return false;
  }

  if (
    config.glassIntensity &&
    !validIntensities.includes(config.glassIntensity)
  ) {
    console.warn(`Invalid glass intensity: ${config.glassIntensity}`);
    return false;
  }

  return true;
};
