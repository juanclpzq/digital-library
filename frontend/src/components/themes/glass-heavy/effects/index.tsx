// ============================================================================
// GLASS HEAVY EFFECTS INDEX - CENTRALIZED EXPORTS
// FILE LOCATION: src/components/themes/glass-heavy/effects/index.ts
// ============================================================================

// Core Glass Effects
export { default as GlassLayers } from "./GlassLayers";
export { default as Condensation } from "./Condensation";
export { default as Refraction } from "./Refraction";
export { default as GlassShimmer } from "./GlassShimmer";
export { default as GlassRipple } from "./GlassRipple";
export { default as GlassDepth } from "./GlassDepth";

// Composite Containers
export { default as GlassContainer } from "./GlassContainer";
export {
  GlassCard,
  GlassModal,
  GlassButton,
  GlassPanel,
} from "./GlassContainer";

// Presets and Utilities
export { GlassDepthPresets, GlassDepthCard } from "./GlassDepth";

// Type exports
export type { GlassLayersProps } from "./GlassLayers";
export type { CondensationProps } from "./Condensation";
export type { RefractionProps } from "./Refraction";
export type { GlassShimmerProps } from "./GlassShimmer";
export type { GlassRippleProps } from "./GlassRipple";
export type { GlassDepthProps } from "./GlassDepth";
export type { GlassContainerProps } from "./GlassContainer";

// ============================================================================
// EFFECT COMBINATIONS & PRESETS
// ============================================================================

export const EffectPresets = {
  // Minimal glass effect
  Whisper: {
    intensity: "whisper" as const,
    effects: {
      layers: false,
      condensation: false,
      refraction: true,
      shimmer: true,
      ripple: false,
      depth: false,
    },
  },

  // Standard glass effect
  Standard: {
    intensity: "medium" as const,
    effects: {
      layers: true,
      condensation: true,
      refraction: true,
      shimmer: true,
      ripple: true,
      depth: true,
    },
  },

  // Maximum glass effect
  Maximum: {
    intensity: "extreme" as const,
    effects: {
      layers: true,
      condensation: true,
      refraction: true,
      shimmer: true,
      ripple: true,
      depth: true,
    },
  },

  // Performance optimized
  Performance: {
    intensity: "light" as const,
    effects: {
      layers: false,
      condensation: false,
      refraction: false,
      shimmer: true,
      ripple: false,
      depth: false,
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a glass effect configuration
 */
export const createGlassConfig = (
  basePreset: keyof typeof EffectPresets,
  overrides?: Partial<typeof EffectPresets.Standard>
) => ({
  ...EffectPresets[basePreset],
  ...overrides,
});

/**
 * Glass intensity utilities
 */
export const GlassIntensity = {
  getBlurValue: (intensity: string) => {
    const values = {
      whisper: "6px",
      light: "12px",
      medium: "20px",
      heavy: "32px",
      extreme: "48px",
    };
    return values[intensity as keyof typeof values] || "20px";
  },

  getOpacity: (intensity: string) => {
    const values = {
      whisper: 0.1,
      light: 0.15,
      medium: 0.2,
      heavy: 0.25,
      extreme: 0.3,
    };
    return values[intensity as keyof typeof values] || 0.2;
  },
};
