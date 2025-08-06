// ============================================================================
// THEME SYSTEM INDEX - CENTRALIZED THEME EXPORTS & UTILITIES
// FILE LOCATION: src/theme/index.ts
// ============================================================================

import React from "react";

// Core Theme Imports
import {
  softclubTheme,
  softclubColors,
  softclubGradients,
  softclubAnimations,
  softclubShadows,
  softclubSpacing,
  getCategoryGradient,
  getStatusStyle,
  getGlowEffect,
  motionPresets as softclubMotionPresets,
  tailwindExtension as softclubTailwindExtension,
} from "./softclub";

import {
  glassHeavyTheme,
  glassHeavyColors,
  glassLevels,
  glassComponents,
  glassEffects,
  glassMotionPresets,
  getCategoryGlassTint,
  getStatusGlassStyle,
  createGlassLayer,
  createGlassButton,
  glassHeavyTailwindExtension,
  type ThemeVariant,
} from "./glassheavy";

import { ThemeProvider, useTheme } from "./ThemeProvider";

// Types
import type {
  SoftclubTheme,
  AnimationPreset,
  BookCategory,
  ReadingStatus,
  SoftclubColor,
} from "../types";

// ============================================================================
// THEME VARIANT TYPES
// ============================================================================

export type { ThemeVariant };

export type ThemeConfig = {
  variant: ThemeVariant;
  glassIntensity: keyof typeof glassLevels;
};

export type AdaptiveComponentProps<T = {}> = T & {
  themeVariant?: ThemeVariant;
  forceTheme?: ThemeVariant;
};

// ============================================================================
// COMBINED THEME OBJECT
// ============================================================================

export const themes = {
  softclub: softclubTheme,
  "glass-heavy": glassHeavyTheme,
} as const;

// ============================================================================
// THEME UTILITIES - ADAPTIVE FUNCTIONS
// ============================================================================

/**
 * Get appropriate category styling based on current theme
 */
export const getAdaptiveCategoryStyle = (
  category: BookCategory,
  variant: ThemeVariant
): string => {
  if (variant === "glass-heavy") {
    return getCategoryGlassTint(category);
  }
  return getCategoryGradient(category);
};

/**
 * Get appropriate status styling based on current theme
 */
export const getAdaptiveStatusStyle = (
  status: ReadingStatus,
  variant: ThemeVariant
) => {
  if (variant === "glass-heavy") {
    return getStatusGlassStyle(status);
  }
  return getStatusStyle(status);
};

/**
 * Get theme-appropriate animation presets
 */
export const getAdaptiveMotionPresets = (variant: ThemeVariant) => {
  if (variant === "glass-heavy") {
    return glassMotionPresets;
  }
  return softclubMotionPresets;
};

/**
 * Create adaptive button styles
 */
export const createAdaptiveButton = (
  variant: ThemeVariant,
  type: "primary" | "secondary" | "glass" = "primary"
) => {
  if (variant === "glass-heavy") {
    return createGlassButton(type === "primary" ? "primary" : "glass");
  }

  // Softclub button styles
  const softclubButtons = {
    primary:
      "bg-gradient-to-r from-mint-dream/80 to-soft-cyan/80 shadow-gentle hover:scale-105 active:scale-95",
    secondary:
      "bg-gradient-to-r from-peachy-keen/70 to-sunset-coral/70 shadow-gentle hover:scale-105 active:scale-95",
    glass: "glass-gentle hover:glass-soft hover:scale-102 active:scale-98",
  };

  return softclubButtons[type];
};

/**
 * Create adaptive container styles
 */
export const createAdaptiveContainer = (
  variant: ThemeVariant,
  intensity: keyof typeof glassLevels = "medium"
) => {
  if (variant === "glass-heavy") {
    return createGlassLayer(intensity);
  }

  return "bg-gradient-to-br from-cloud-white/60 to-silver-matte/20 shadow-soft rounded-softclub";
};

/**
 * Get adaptive text colors
 */
export const getAdaptiveTextColors = (variant: ThemeVariant) => {
  if (variant === "glass-heavy") {
    return {
      primary: "text-gray-900/95",
      secondary: "text-gray-900/75",
      tertiary: "text-gray-900/60",
      inverted: "text-white/98",
    };
  }

  return {
    primary: "text-midnight-navy",
    secondary: "text-midnight-navy/70",
    tertiary: "text-midnight-navy/50",
    inverted: "text-cloud-white",
  };
};

// ============================================================================
// COMPONENT FACTORY FUNCTIONS
// ============================================================================

/**
 * Create an adaptive component that switches between theme variants
 */
export const createAdaptiveComponent = <T extends object>(
  softclubComponent: React.ComponentType<T>,
  glassHeavyComponent: React.ComponentType<T>
) => {
  const AdaptiveComponent: React.FC<AdaptiveComponentProps<T>> = ({
    themeVariant,
    forceTheme,
    ...props
  }) => {
    const theme = useTheme();
    const activeVariant = forceTheme || themeVariant || theme.variant;

    if (activeVariant === "glass-heavy") {
      return React.createElement(glassHeavyComponent, props as T);
    }

    return React.createElement(softclubComponent, props as T);
  };

  AdaptiveComponent.displayName = `Adaptive${
    softclubComponent.displayName || softclubComponent.name || "Component"
  }`;

  return AdaptiveComponent;
};

/**
 * Higher-order component for theme-aware components
 */
export const withTheme = <T extends object>(
  Component: React.ComponentType<T & { theme: any }>
) => {
  const WrappedComponent: React.FC<T> = (props) => {
    const theme = useTheme();
    const activeTheme =
      theme.variant === "glass-heavy" ? glassHeavyTheme : softclubTheme;

    return React.createElement(Component, {
      ...props,
      theme: {
        ...activeTheme,
        variant: theme.variant,
        isGlassMode: theme.isGlassMode,
        glassIntensity: theme.glassIntensity,
      },
    } as T & { theme: any });
  };

  WrappedComponent.displayName = `withTheme(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
};

// ============================================================================
// THEME CONTEXT HOOKS (RE-EXPORTS)
// ============================================================================

export { useTheme, ThemeProvider };

// ============================================================================
// TAILWIND CONFIGURATION MERGER
// ============================================================================

/**
 * Combined Tailwind configuration for both themes
 */
export const combinedTailwindExtension = {
  ...softclubTailwindExtension,

  // Merge colors (Glass Heavy colors with transparency)
  colors: {
    ...softclubTailwindExtension.colors,
    // Add glass-specific colors with common opacity levels
    "glass-white": "rgba(248, 249, 250, var(--glass-opacity, 0.15))",
    "glass-black": "rgba(0, 17, 34, var(--glass-opacity, 0.08))",
    "glass-clear": "rgba(255, 255, 255, var(--glass-opacity, 0.12))",
  },

  // Merge backdrop blur
  backdropBlur: {
    ...softclubTailwindExtension.backdropBlur,
    ...glassHeavyTailwindExtension.backdropBlur,
  },

  // Merge box shadows
  boxShadow: {
    ...softclubTailwindExtension.boxShadow,
    ...glassHeavyTailwindExtension.boxShadow,
  },

  // Merge background images
  backgroundImage: {
    ...softclubTailwindExtension.backgroundImage,
    ...glassHeavyTailwindExtension.backgroundImage,
  },

  // Merge keyframes and animations
  keyframes: {
    ...softclubTailwindExtension.keyframes,
    ...glassHeavyTailwindExtension.keyframes,
  },

  animation: {
    ...softclubTailwindExtension.animation,
    ...glassHeavyTailwindExtension.animation,
  },
};

// ============================================================================
// THEME CONSTANTS
// ============================================================================

export const THEME_STORAGE_KEY = "digital-library-theme";
export const GLASS_INTENSITY_STORAGE_KEY = "digital-library-glass-intensity";

export const DEFAULT_THEME: ThemeVariant = "softclub";
export const DEFAULT_GLASS_INTENSITY: keyof typeof glassLevels = "medium";

export const THEME_VARIANTS: ThemeVariant[] = ["softclub", "glass-heavy"];
export const GLASS_INTENSITIES = Object.keys(glassLevels) as Array<
  keyof typeof glassLevels
>;

// ============================================================================
// THEME METADATA
// ============================================================================

export const themeMetadata = {
  softclub: {
    name: "Gen X Softclub",
    description: "Optimistic tech nostalgia from the 2000s",
    icon: "🌈",
    primaryColor: softclubColors.softCyan,
    category: "nostalgic",
  },
  "glass-heavy": {
    name: "Glass Heavy",
    description: "Intense glassmorphism with advanced effects",
    icon: "🔮",
    primaryColor: "rgba(255, 255, 255, 0.25)",
    category: "premium",
  },
} as const;

// ============================================================================
// INDIVIDUAL THEME EXPORTS (RE-EXPORTS)
// ============================================================================

// Softclub Theme Exports
export {
  softclubTheme,
  softclubColors,
  softclubGradients,
  softclubAnimations,
  softclubShadows,
  softclubSpacing,
  getCategoryGradient,
  getStatusStyle,
  getGlowEffect,
  softclubMotionPresets,
  softclubTailwindExtension,
};

// Glass Heavy Theme Exports
export {
  glassHeavyTheme,
  glassHeavyColors,
  glassLevels,
  glassComponents,
  glassEffects,
  glassMotionPresets,
  getCategoryGlassTint,
  getStatusGlassStyle,
  createGlassLayer,
  createGlassButton,
  glassHeavyTailwindExtension,
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  themes,
  useTheme,
  ThemeProvider,
  createAdaptiveComponent,
  withTheme,
  getAdaptiveCategoryStyle,
  getAdaptiveStatusStyle,
  getAdaptiveMotionPresets,
  createAdaptiveButton,
  createAdaptiveContainer,
  getAdaptiveTextColors,
  themeMetadata,
  DEFAULT_THEME,
  DEFAULT_GLASS_INTENSITY,
  THEME_VARIANTS,
  GLASS_INTENSITIES,
};
