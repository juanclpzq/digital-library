// ============================================================================
// SOFTCLUB THEME COMPONENTS INDEX - CENTRALIZED EXPORTS
// FILE LOCATION: src/components/themes/softclub/index.ts
// ============================================================================

// Core Components
export { default as BookCard } from "./BookCard";
export { default as StatCard } from "./StatCard";
export { default as Card } from "./Card";

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
// SOFTCLUB COMPONENT PRESETS
// ============================================================================

export const SoftclubPresets = {
  // Card variations
  Cards: {
    Standard: { gradient: "cyan", size: "md", variant: "default" },
    Compact: { gradient: "mint", size: "sm", variant: "compact" },
    Featured: { gradient: "lavender", size: "lg", variant: "detailed" },
  },

  // Button variations
  Buttons: {
    Primary: { gradient: "lavender", size: "md", variant: "primary" },
    Secondary: { gradient: "cyan", size: "md", variant: "secondary" },
    Ghost: { gradient: "mint", size: "sm", variant: "ghost" },
  },
};
