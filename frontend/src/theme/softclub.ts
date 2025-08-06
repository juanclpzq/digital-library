// ============================================================================
// GEN X SOFTCLUB THEME - DIGITAL LIBRARY DESIGN SYSTEM
// ============================================================================

import type {
  SoftclubTheme,
  AnimationPreset,
  BookCategory,
  ReadingStatus,
} from "@/types";

// ============================================================================
// CORE COLOR PALETTE - SOFT & VIBRANT
// ============================================================================

export const softclubColors = {
  // Primary Softclub Palette - Gentle but vibrant
  softCyan: "#7FDBFF", // Main accent - friendly tech blue
  lavenderMist: "#B19CD9", // Secondary - dreamy purple
  peachyKeen: "#FFAAA5", // Warm coral - approachable
  mintDream: "#7FFFE0", // Success green - optimistic
  sunsetCoral: "#FF6B9D", // Alert/love - passionate but soft

  // Neutrals - Clean and breathable
  cloudWhite: "#F8F9FA", // Pure background
  silverMatte: "#E8E8E8", // Subtle contrast
  midnightNavy: "#001122", // Text - not harsh black

  // Extended Palette - For variety
  aquaMist: "#80E5FF", // Lighter cyan variation
  lavenderBlush: "#E6D7FF", // Ultra soft purple
  peachWhisper: "#FFD4D1", // Barely there peach
  mintFrost: "#B8FFE6", // Gentle mint
  coralGlow: "#FFB3D1", // Soft coral highlight

  // Semantic Colors - Softclub style
  success: "#7FFFE0", // Mint dream
  warning: "#FFAAA5", // Peachy keen
  error: "#FF6B9D", // Sunset coral
  info: "#7FDBFF", // Soft cyan
} as const;

// ============================================================================
// GRADIENT DEFINITIONS - SOFT TRANSITIONS
// ============================================================================

export const softclubGradients = {
  // Hero/Main gradients - Multi-color soft blends
  hero: "bg-gradient-to-br from-soft-cyan via-lavender-mist to-peachy-keen",
  heroReverse:
    "bg-gradient-to-tl from-peachy-keen via-lavender-mist to-soft-cyan",
  dreamy: "bg-gradient-to-r from-lavender-mist via-mint-dream to-aqua-mist",
  sunset:
    "bg-gradient-to-br from-sunset-coral via-peachy-keen to-peach-whisper",

  // Category-specific gradients - Book card backgrounds
  fiction: "from-soft-cyan/80 via-lavender-mist/60 to-peachy-keen/40",
  nonFiction: "from-mint-dream/70 via-aqua-mist/50 to-cloud-white/30",
  science: "from-soft-cyan/90 via-mint-dream/60 to-lavender-blush/40",
  philosophy: "from-lavender-mist/80 via-midnigh-navy/10 to-soft-cyan/30",
  history: "from-sunset-coral/60 via-peachy-keen/40 to-peach-whisper/20",
  technology: "from-aqua-mist/80 via-soft-cyan/60 to-mint-frost/40",
  art: "from-lavender-blush/80 via-peachy-keen/60 to-coral-glow/40",
  business: "from-silver-matte/60 via-cloud-white/80 to-mint-frost/30",

  // Reading status gradients
  wantToRead: "from-mint-dream/60 to-mint-frost/40",
  reading: "from-soft-cyan/70 to-aqua-mist/50",
  completed: "from-sunset-coral/60 to-coral-glow/40",
  paused: "from-lavender-mist/60 to-lavender-blush/40",

  // UI Element gradients
  card: "from-cloud-white/60 via-silver-matte/20 to-cloud-white/80",
  cardHover: "from-cloud-white/80 via-soft-cyan/10 to-lavender-blush/20",
  button: "from-mint-dream/80 to-soft-cyan/80",
  buttonSecondary: "from-peachy-keen/70 to-sunset-coral/70",

  // Background gradients
  pageBackground: "from-cloud-white via-soft-cyan/5 to-lavender-mist/10",
  dashboardBg: "from-cloud-white via-aqua-mist/8 to-peach-whisper/12",
  modalOverlay:
    "from-midnight-navy/40 via-lavender-mist/20 to-midnight-navy/60",
} as const;

// ============================================================================
// ANIMATION PRESETS - GENTLE & WELCOMING
// ============================================================================

export const softclubAnimations = {
  // Transition timings - All gentle
  gentle: "transition-all duration-500 ease-out",
  soft: "transition-all duration-700 ease-in-out",
  quick: "transition-all duration-300 ease-out",
  slow: "transition-all duration-1000 ease-in-out",

  // Hover states - Soft transformations
  cardHover: "hover:scale-[1.02] hover:-translate-y-1",
  buttonHover: "hover:scale-105 active:scale-95",
  gentleGlow: "hover:shadow-2xl hover:shadow-lavender-mist/20",

  // Loading animations
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
} as const;

// ============================================================================
// FRAMER MOTION PRESETS - SOPHISTICATED ANIMATIONS
// ============================================================================

export const motionPresets: Record<string, AnimationPreset> = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },

  // Card animations
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

  // Button interactions
  buttonTap: {
    initial: { scale: 1 },
    animate: { scale: 0.95 },
    transition: { duration: 0.1, ease: "easeInOut" },
  },

  // Stagger animations for grids
  staggerContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },

  // Modal animations
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },

  modalContent: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: { duration: 0.4, ease: [0.25, 0.25, 0, 1] },
  },
};

// ============================================================================
// SHADOW SYSTEM - SOFT GLOWS
// ============================================================================

export const softclubShadows = {
  // Card shadows - Gentle elevation
  soft: "shadow-2xl shadow-lavender-mist/15",
  gentle: "shadow-lg shadow-soft-cyan/10",
  floating: "shadow-xl shadow-midnight-navy/8",

  // Hover shadows - More pronounced
  softHover: "shadow-3xl shadow-lavender-mist/25",
  gentleHover: "shadow-2xl shadow-soft-cyan/20",
  floatingHover: "shadow-2xl shadow-midnight-navy/15",

  // Colored shadows for special elements
  cyanGlow: "shadow-xl shadow-soft-cyan/20",
  lavenderGlow: "shadow-xl shadow-lavender-mist/20",
  peachGlow: "shadow-xl shadow-peachy-keen/20",
  mintGlow: "shadow-xl shadow-mint-dream/20",
  coralGlow: "shadow-xl shadow-sunset-coral/20",

  // Inner shadows for depth
  inset: "inset shadow-lg shadow-midnight-navy/5",
  insetSoft: "inset shadow-md shadow-lavender-mist/10",
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM - CLEAN & FRIENDLY
// ============================================================================

export const softclubTypography = {
  fontFamily: {
    primary: ["Inter", "Helvetica Neue", "system-ui", "sans-serif"],
    secondary: ["SF Pro Display", "Inter", "sans-serif"],
    mono: ["JetBrains Mono", "Monaco", "Consolas", "monospace"],
  },

  fontSize: {
    // Generous sizing for comfortable reading
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  lineHeight: {
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
} as const;

// ============================================================================
// SPACING SYSTEM - GENEROUS & COMFORTABLE
// ============================================================================

export const softclubSpacing = {
  // Base spacing scale
  comfortable: "2rem", // 32px - Main spacing
  cozy: "1.5rem", // 24px - Secondary spacing
  intimate: "1rem", // 16px - Small spacing
  spacious: "3rem", // 48px - Large spacing
  expansive: "4rem", // 64px - Hero spacing

  // Component-specific spacing
  cardPadding: "2rem",
  cardGap: "1.5rem",
  buttonPadding: "1rem 1.5rem",
  inputPadding: "0.75rem 1rem",

  // Layout spacing
  containerPadding: "1.5rem",
  sectionGap: "3rem",
  gridGap: "2rem",
} as const;

// ============================================================================
// BORDER RADIUS - SOFT & ROUNDED
// ============================================================================

export const softclubBorderRadius = {
  none: "0",
  sm: "0.375rem", // 6px
  base: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px - Card radius
  "2xl": "2rem", // 32px - Large cards
  "3xl": "3rem", // 48px - Hero elements
  full: "9999px", // Pills/circles

  // Component-specific
  card: "1.5rem",
  button: "1rem",
  input: "0.75rem",
  modal: "2rem",
} as const;

// ============================================================================
// HELPER FUNCTIONS - DYNAMIC THEMING
// ============================================================================

/**
 * Get gradient class for book categories
 */
export const getCategoryGradient = (category: BookCategory): string => {
  const gradientMap: Record<BookCategory, string> = {
    Fiction: softclubGradients.fiction,
    "Non-Fiction": softclubGradients.nonFiction,
    "Science Fiction": softclubGradients.science,
    Fantasy: softclubGradients.fiction,
    Mystery: softclubGradients.fiction,
    Romance: softclubGradients.fiction,
    History: softclubGradients.history,
    Science: softclubGradients.science,
    Philosophy: softclubGradients.philosophy,
    Biography: softclubGradients.nonFiction,
    Technology: softclubGradients.technology,
    Art: softclubGradients.art,
    "Self-Help": softclubGradients.nonFiction,
    Business: softclubGradients.business,
    Other: softclubGradients.card,
  };

  return `bg-gradient-to-br ${gradientMap[category]}`;
};

/**
 * Get status-specific styles
 */
export const getStatusStyle = (status: ReadingStatus) => {
  const statusMap: Record<
    ReadingStatus,
    { bg: string; text: string; shadow: string }
  > = {
    "want-to-read": {
      bg: "bg-mint-dream/80",
      text: "text-midnight-navy/90",
      shadow: "shadow-mint-dream/20",
    },
    reading: {
      bg: "bg-soft-cyan/80",
      text: "text-midnight-navy/90",
      shadow: "shadow-soft-cyan/20",
    },
    completed: {
      bg: "bg-sunset-coral/80",
      text: "text-cloud-white",
      shadow: "shadow-sunset-coral/20",
    },
    paused: {
      bg: "bg-lavender-mist/80",
      text: "text-midnight-navy/90",
      shadow: "shadow-lavender-mist/20",
    },
    abandoned: {
      bg: "bg-silver-matte/80",
      text: "text-midnight-navy/70",
      shadow: "shadow-silver-matte/20",
    },
    reference: {
      bg: "bg-peachy-keen/80",
      text: "text-midnight-navy/90",
      shadow: "shadow-peachy-keen/20",
    },
  };

  return statusMap[status];
};

/**
 * Get glow effect for interactive elements
 */
export const getGlowEffect = (color: keyof typeof softclubColors) => {
  return `hover:shadow-xl hover:shadow-${color}/20 transition-shadow duration-300`;
};

// ============================================================================
// MAIN THEME OBJECT
// ============================================================================

export const softclubTheme: SoftclubTheme = {
  colors: softclubColors,
  gradients: softclubGradients,
  animations: softclubAnimations,
  shadows: softclubShadows,
  spacing: softclubSpacing,
};

// ============================================================================
// TAILWIND CONFIG EXTENSION
// ============================================================================

export const tailwindExtension = {
  colors: {
    "soft-cyan": softclubColors.softCyan,
    "lavender-mist": softclubColors.lavenderMist,
    "peachy-keen": softclubColors.peachyKeen,
    "mint-dream": softclubColors.mintDream,
    "sunset-coral": softclubColors.sunsetCoral,
    "cloud-white": softclubColors.cloudWhite,
    "midnight-navy": softclubColors.midnightNavy,
    "silver-matte": softclubColors.silverMatte,
    "aqua-mist": softclubColors.aquaMist,
    "lavender-blush": softclubColors.lavenderBlush,
    "peach-whisper": softclubColors.peachWhisper,
    "mint-frost": softclubColors.mintFrost,
    "coral-glow": softclubColors.coralGlow,
  },
  fontFamily: {
    softclub: softclubTypography.fontFamily.primary,
    "softclub-display": softclubTypography.fontFamily.secondary,
    "softclub-mono": softclubTypography.fontFamily.mono,
  },
  borderRadius: {
    softclub: softclubBorderRadius.card,
    gentle: softclubBorderRadius.lg,
    pill: softclubBorderRadius.full,
  },
  spacing: {
    comfortable: softclubSpacing.comfortable,
    cozy: softclubSpacing.cozy,
    intimate: softclubSpacing.intimate,
    spacious: softclubSpacing.spacious,
    expansive: softclubSpacing.expansive,
  },
};

export default softclubTheme;
