// ============================================================================
// THEME CONSTANTS & CONFIGURATIONS
// FILE LOCATION: src/theme/constants.ts
// ============================================================================

export type ThemeVariant = "softclub" | "glass-heavy";
export type GlassIntensity =
  | "whisper"
  | "light"
  | "medium"
  | "heavy"
  | "extreme";

// Theme configuration interfaces
export interface SoftclubTheme {
  name: string;
  colors: Record<string, string>;
  motionPresets: Record<
    string,
    {
      duration: number;
      ease: string | number[];
    }
  >;
}

export interface GlassHeavyTheme {
  name: string;
  colors: Record<string, string>;
  levels: Record<
    GlassIntensity,
    {
      backdrop: string;
      border: string;
    }
  >;
  motionPresets: Record<
    string,
    {
      duration: number;
      ease: string | number[];
    }
  >;
}

// ============================================================================
// THEME CONFIGURATIONS
// ============================================================================

export const softclubTheme: SoftclubTheme = {
  name: "softclub",
  colors: {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    background: "#F8FAFC",
    text: "#1E293B",
    mintDream: "#7FDBFF",
    lavenderMist: "#B19CD9",
    softCyan: "#5EEAD4",
    peachy: "#FED7AA",
    deepTeal: "#0D9488",
    warmPurple: "#8B5CF6",
  },
  motionPresets: {
    gentle: { duration: 0.3, ease: "easeOut" },
    bounce: { duration: 0.5, ease: [0.25, 0.25, 0, 1] },
    float: { duration: 0.6, ease: [0.25, 0.25, 0, 1] },
  },
};

export const glassHeavyTheme: GlassHeavyTheme = {
  name: "glass-heavy",
  colors: {
    primary: "rgba(59, 130, 246, 0.8)",
    secondary: "rgba(139, 92, 246, 0.8)",
    background: "rgba(248, 250, 252, 0.1)",
    text: "rgba(30, 41, 59, 0.9)",
    glassWhite: "rgba(255, 255, 255, 0.2)",
    glassBlue: "rgba(59, 130, 246, 0.3)",
    glassPurple: "rgba(139, 92, 246, 0.3)",
  },
  levels: {
    whisper: { backdrop: "backdrop-blur-[6px]", border: "border-white/20" },
    light: { backdrop: "backdrop-blur-[12px]", border: "border-white/25" },
    medium: { backdrop: "backdrop-blur-[20px]", border: "border-white/30" },
    heavy: { backdrop: "backdrop-blur-[32px]", border: "border-white/35" },
    extreme: { backdrop: "backdrop-blur-[48px]", border: "border-white/40" },
  },
  motionPresets: {
    glassFloat: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    shimmer: { duration: 0.4, ease: "easeOut" },
    condensation: { duration: 0.8, ease: [0.25, 0.25, 0, 1] },
  },
};
