// ============================================================================
// GLASS HEAVY THEME COMPONENTS INDEX - CENTRALIZED EXPORTS
// FILE LOCATION: src/components/themes/glass-heavy/index.ts
// ============================================================================

// Core Components
export { default as BookCard } from "./BookCard";
export { default as StatCard } from "./StatCard";
export { default as Card } from "./Card";

// Glass Effects
export * from "./effects";

// UI Components (TO BE CREATED)
export { default as Button } from "./Button";
export { default as Input } from "./Input";
export { default as Modal } from "./Modal";
export { default as SearchBox } from "./SearchBox";
export { default as Header } from "./Header";

// Layout Components (TO BE CREATED)
export { default as Layout } from "./layout/Layout";
export { default as Sidebar } from "./layout/Sidebar";
export { default as Footer } from "./layout/Footer";

// Dashboard Components (TO BE CREATED)
export { default as Dashboard } from "./Dashboard";
export { default as FilterBar } from "./FilterBar";
export { default as BookGrid } from "./BookGrid";
export { default as BookDetail } from "./BookDetail";

// Type Exports
export type { BookCardProps } from "./BookCard";
export type { StatCardProps } from "./StatCard";
export type { CardProps } from "./Card";

// ============================================================================
// GLASS HEAVY COMPONENT PRESETS
// ============================================================================

export const GlassHeavyPresets = {
  // Intensity-based presets
  Whisper: {
    intensity: "whisper" as const,
    effects: { layers: false, condensation: false, shimmer: true },
  },

  Standard: {
    intensity: "medium" as const,
    effects: { layers: true, condensation: true, shimmer: true, ripple: true },
  },

  Maximum: {
    intensity: "extreme" as const,
    effects: {
      layers: true,
      condensation: true,
      shimmer: true,
      ripple: true,
      depth: true,
    },
  },

  // Component-specific presets
  Cards: {
    Subtle: { intensity: "light", shimmer: false, condensation: false },
    Standard: { intensity: "medium", shimmer: true, condensation: true },
    Premium: {
      intensity: "heavy",
      shimmer: true,
      condensation: true,
      depth: true,
    },
  },
};
