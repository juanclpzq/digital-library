// ============================================================================
// GLASS HEAVY THEME - INTENSE GLASSMORPHISM DESIGN SYSTEM
// ============================================================================

import type {
  SoftclubTheme,
  AnimationPreset,
  BookCategory,
  ReadingStatus,
} from "@/types";

// ============================================================================
// THEME VARIANT TYPE
// ============================================================================

export type ThemeVariant = "softclub" | "glass-heavy";

// ============================================================================
// GLASS HEAVY COLOR PALETTE - ENHANCED TRANSPARENCY
// ============================================================================

export const glassHeavyColors = {
  // Base Glass Tints - More saturated for visibility through blur
  glassCyan: "rgba(127, 219, 255, 0.28)",
  glassLavender: "rgba(177, 156, 217, 0.25)",
  glassPeach: "rgba(255, 170, 165, 0.22)",
  glassMint: "rgba(127, 255, 224, 0.18)",
  glassCoral: "rgba(255, 107, 157, 0.24)",

  // Content Colors - High contrast for readability
  textPrimary: "rgba(0, 17, 34, 0.95)", // Almost opaque for legibility
  textSecondary: "rgba(0, 17, 34, 0.75)",
  textTertiary: "rgba(0, 17, 34, 0.60)",
  textInverted: "rgba(248, 249, 250, 0.98)",

  // Glass Base Colors
  glassWhite: "rgba(248, 249, 250, 0.15)",
  glassBlack: "rgba(0, 17, 34, 0.08)",
  glassClear: "rgba(255, 255, 255, 0.12)",

  // Accent Highlights - For borders and light simulation
  lightHighlight: "rgba(255, 255, 255, 0.35)",
  shadowHighlight: "rgba(0, 17, 34, 0.15)",

  // Background Foundation
  baseBg:
    "linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 30%, #F5F0FF 70%, #FFF0F5 100%)",
} as const;

// ============================================================================
// GLASS INTENSITY LEVELS
// ============================================================================

export const glassLevels = {
  whisper: {
    blur: "blur(6px)",
    opacity: "bg-opacity-15",
    backdrop: "backdrop-blur-sm",
    border: "border border-white/20",
  },
  light: {
    blur: "blur(12px)",
    opacity: "bg-opacity-25",
    backdrop: "backdrop-blur-md",
    border: "border border-white/30",
  },
  medium: {
    blur: "blur(20px)",
    opacity: "bg-opacity-35",
    backdrop: "backdrop-blur-lg",
    border: "border border-white/40",
  },
  heavy: {
    blur: "blur(32px)",
    opacity: "bg-opacity-45",
    backdrop: "backdrop-blur-xl",
    border: "border border-white/50",
  },
  extreme: {
    blur: "blur(48px)",
    opacity: "bg-opacity-65",
    backdrop: "backdrop-blur-3xl",
    border: "border border-white/60",
  },
} as const;

// ============================================================================
// GLASS COMPONENT STYLES
// ============================================================================

export const glassComponents = {
  // Card Variants
  cardBase: `
    ${glassLevels.heavy.backdrop} 
    ${glassLevels.heavy.border}
    bg-gradient-to-br from-white/20 to-white/5
    shadow-2xl shadow-black/10
    relative overflow-hidden
  `,

  cardFloating: `
    ${glassLevels.extreme.backdrop}
    ${glassLevels.extreme.border}
    bg-gradient-to-br from-white/30 to-white/10
    shadow-[0_8px_32px_rgba(0,0,0,0.12)]
    relative overflow-hidden
    before:absolute before:inset-0 
    before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none
  `,

  // Button Variants
  buttonGlass: `
    ${glassLevels.medium.backdrop}
    ${glassLevels.medium.border}
    bg-gradient-to-r from-white/25 to-white/15
    hover:from-white/35 hover:to-white/25
    active:from-white/45 active:to-white/35
    transition-all duration-300
  `,

  buttonPrimary: `
    ${glassLevels.light.backdrop}
    border border-cyan-300/50
    bg-gradient-to-r from-cyan-400/30 to-blue-400/30
    hover:from-cyan-400/40 hover:to-blue-400/40
    text-white shadow-lg shadow-cyan-500/25
  `,

  // Input Variants
  inputGlass: `
    ${glassLevels.medium.backdrop}
    ${glassLevels.medium.border}
    bg-gradient-to-r from-white/20 to-white/10
    placeholder:text-gray-600/60
    focus:from-white/30 focus:to-white/20
    focus:border-white/60
  `,

  // Status Variants
  statusWantToRead: `
    ${glassLevels.light.backdrop}
    bg-gradient-to-r from-emerald-400/25 to-teal-400/25
    border border-emerald-300/40
    text-emerald-900/90
  `,

  statusReading: `
    ${glassLevels.light.backdrop}
    bg-gradient-to-r from-blue-400/25 to-cyan-400/25
    border border-blue-300/40
    text-blue-900/90
  `,

  statusCompleted: `
    ${glassLevels.light.backdrop}
    bg-gradient-to-r from-purple-400/25 to-pink-400/25
    border border-purple-300/40
    text-purple-900/90
  `,
} as const;

// ============================================================================
// GLASS EFFECTS - ADVANCED ANIMATIONS
// ============================================================================

export const glassEffects = {
  // Refraction Effects
  refraction: `
    before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px]
    before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent
    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px]
    after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent
  `,

  // Shimmer Animation
  shimmer: `
    relative overflow-hidden
    before:absolute before:inset-0 before:-translate-x-full
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    before:animate-shimmer
  `,

  // Condensation Effect (hover)
  condensation: `
    relative
    hover:before:absolute hover:before:inset-0
    hover:before:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_70%)]
    hover:before:opacity-0 hover:before:animate-condensation
  `,

  // Glass Depth Layers
  depthLayers: `
    relative
    after:absolute after:inset-2 after:rounded-[inherit]
    after:border after:border-white/20
    after:bg-gradient-to-br after:from-white/10 after:to-transparent
    after:pointer-events-none
  `,
} as const;

// ============================================================================
// GLASS MOTION PRESETS
// ============================================================================

export const glassMotionPresets: Record<string, AnimationPreset> = {
  // Glass Card Enter
  glassCardEnter: {
    initial: { opacity: 0, scale: 0.9, y: 40, filter: "blur(20px)" },
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },

  // Glass Hover Effect
  glassHover: {
    initial: { scale: 1, filter: "blur(0px)" },
    animate: {
      scale: 1.03,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },

  // Glass Ripple Effect
  glassRipple: {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },

  // Glass Shimmer
  glassShimmer: {
    initial: { x: "-100%" },
    animate: {
      x: "100%",
      transition: { duration: 2, repeat: Infinity, ease: "linear" },
    },
  },

  // Glass Condensation
  glassCondensation: {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: [0, 0.6, 0],
      scale: [0, 1.2, 1.5],
      transition: { duration: 1.5, ease: "easeOut" },
    },
  },
};

// ============================================================================
// CATEGORY GLASS TINTS
// ============================================================================

export const getCategoryGlassTint = (category: BookCategory): string => {
  const glassMap: Record<BookCategory, string> = {
    Fiction: `${glassComponents.cardFloating} bg-gradient-to-br from-blue-400/20 to-purple-400/15`,
    "Non-Fiction": `${glassComponents.cardFloating} bg-gradient-to-br from-emerald-400/20 to-teal-400/15`,
    "Science Fiction": `${glassComponents.cardFloating} bg-gradient-to-br from-cyan-400/20 to-indigo-400/15`,
    Fantasy: `${glassComponents.cardFloating} bg-gradient-to-br from-purple-400/20 to-pink-400/15`,
    Mystery: `${glassComponents.cardFloating} bg-gradient-to-br from-gray-400/20 to-slate-400/15`,
    Romance: `${glassComponents.cardFloating} bg-gradient-to-br from-pink-400/20 to-rose-400/15`,
    History: `${glassComponents.cardFloating} bg-gradient-to-br from-amber-400/20 to-orange-400/15`,
    Science: `${glassComponents.cardFloating} bg-gradient-to-br from-green-400/20 to-lime-400/15`,
    Philosophy: `${glassComponents.cardFloating} bg-gradient-to-br from-indigo-400/20 to-purple-400/15`,
    Biography: `${glassComponents.cardFloating} bg-gradient-to-br from-yellow-400/20 to-amber-400/15`,
    Technology: `${glassComponents.cardFloating} bg-gradient-to-br from-cyan-400/20 to-blue-400/15`,
    Art: `${glassComponents.cardFloating} bg-gradient-to-br from-pink-400/20 to-purple-400/15`,
    "Self-Help": `${glassComponents.cardFloating} bg-gradient-to-br from-emerald-400/20 to-green-400/15`,
    Business: `${glassComponents.cardFloating} bg-gradient-to-br from-slate-400/20 to-gray-400/15`,
    Other: `${glassComponents.cardFloating} bg-gradient-to-br from-gray-400/15 to-slate-400/10`,
  };

  return glassMap[category];
};

// ============================================================================
// STATUS GLASS STYLES
// ============================================================================

export const getStatusGlassStyle = (status: ReadingStatus) => {
  const statusMap: Record<ReadingStatus, string> = {
    "want-to-read": glassComponents.statusWantToRead,
    reading: glassComponents.statusReading,
    completed: glassComponents.statusCompleted,
    paused: `${glassLevels.light.backdrop} bg-gradient-to-r from-yellow-400/25 to-orange-400/25 border border-yellow-300/40 text-yellow-900/90`,
    abandoned: `${glassLevels.light.backdrop} bg-gradient-to-r from-gray-400/25 to-slate-400/25 border border-gray-300/40 text-gray-900/90`,
    reference: `${glassLevels.light.backdrop} bg-gradient-to-r from-indigo-400/25 to-blue-400/25 border border-indigo-300/40 text-indigo-900/90`,
  };

  return statusMap[status];
};

// ============================================================================
// GLASS UTILITY FUNCTIONS
// ============================================================================

export const createGlassLayer = (
  intensity: keyof typeof glassLevels,
  tint?: string
) => {
  const level = glassLevels[intensity];
  const baseTint = tint || "from-white/20 to-white/5";

  return `
    ${level.backdrop} ${level.border}
    bg-gradient-to-br ${baseTint}
    ${glassEffects.refraction}
  `;
};

export const createGlassButton = (
  variant: "primary" | "secondary" | "glass" = "glass"
) => {
  const variants = {
    primary: glassComponents.buttonPrimary,
    secondary: `${glassComponents.buttonGlass} text-gray-700`,
    glass: glassComponents.buttonGlass,
  };

  return `${variants[variant]} ${glassEffects.shimmer}`;
};

// ============================================================================
// GLASS HEAVY THEME OBJECT
// ============================================================================

export const glassHeavyTheme = {
  colors: glassHeavyColors,
  levels: glassLevels,
  components: glassComponents,
  effects: glassEffects,
  motionPresets: glassMotionPresets,
  utils: {
    getCategoryGlassTint,
    getStatusGlassStyle,
    createGlassLayer,
    createGlassButton,
  },
} as const;

// ============================================================================
// TAILWIND GLASS HEAVY EXTENSIONS
// ============================================================================

export const glassHeavyTailwindExtension = {
  // Glass Background Utilities
  backgroundImage: {
    "glass-base": glassHeavyColors.baseBg,
    "glass-radial":
      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)",
    "glass-shimmer":
      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
  },

  // Glass Animation Keyframes
  keyframes: {
    shimmer: {
      "0%": { transform: "translateX(-100%)" },
      "100%": { transform: "translateX(100%)" },
    },
    condensation: {
      "0%": { opacity: "0", transform: "scale(0)" },
      "50%": { opacity: "0.6", transform: "scale(1.2)" },
      "100%": { opacity: "0", transform: "scale(1.5)" },
    },
    "glass-float": {
      "0%, 100%": { transform: "translateY(0px) rotateX(0deg)" },
      "50%": { transform: "translateY(-10px) rotateX(2deg)" },
    },
  },

  animation: {
    shimmer: "shimmer 2s linear infinite",
    condensation: "condensation 1.5s ease-out",
    "glass-float": "glass-float 4s ease-in-out infinite",
  },

  // Glass Blur Levels
  backdropBlur: {
    "glass-sm": "6px",
    "glass-md": "12px",
    "glass-lg": "20px",
    "glass-xl": "32px",
    "glass-2xl": "48px",
    "glass-3xl": "64px",
  },

  // Glass Shadow System
  boxShadow: {
    "glass-sm":
      "0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    "glass-md":
      "0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
    "glass-lg":
      "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
    "glass-xl":
      "0 16px 64px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.5)",
  },
};

export default glassHeavyTheme;
