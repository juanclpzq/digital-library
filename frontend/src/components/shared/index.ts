// ============================================================================
// SHARED COMPONENTS INDEX - ADAPTIVE COMPONENTS EXPORTS
// FILE LOCATION: src/components/shared/index.ts
// ============================================================================

// Adaptive Components
export {
  default as AdaptiveBookCard,
  useAdaptiveComponents,
} from "./AdaptiveBookCard";
export {
  default as AdaptiveStatCard,
  useAdaptiveStatCard,
  StatCardVariants,
} from "./AdaptiveStatCard";

// Additional Adaptive Components (TO BE CREATED)
export { default as AdaptiveDashboard } from "./AdaptiveDashboard";
export { default as AdaptiveFilterBar } from "./AdaptiveFilterBar";
export { default as AdaptiveBookGrid } from "./AdaptiveBookGrid";
export { default as AdaptiveButton } from "./AdaptiveButton";
export { default as AdaptiveInput } from "./AdaptiveInput";
export { default as AdaptiveModal } from "./AdaptiveModal";

// Factory Functions
export { createAdaptiveComponent } from "./AdaptiveBookCard";
export { createStatCardVariant } from "./AdaptiveStatCard";

// Type Exports
export type { StatCardProps } from "./AdaptiveStatCard";

// ============================================================================
// ADAPTIVE COMPONENT UTILITIES
// ============================================================================

/**
 * All adaptive components in one object for easy access
 */
export const AdaptiveComponents = {
  BookCard: AdaptiveBookCard,
  StatCard: AdaptiveStatCard,
  // Dashboard: AdaptiveDashboard,
  // FilterBar: AdaptiveFilterBar,
  // BookGrid: AdaptiveBookGrid,
  // Button: AdaptiveButton,
  // Input: AdaptiveInput,
  // Modal: AdaptiveModal,
};

/**
 * Quick preset configurations for common use cases
 */
export const AdaptivePresets = {
  Dashboard: {
    BookCard: { size: "md", variant: "standard" },
    StatCard: { size: "lg", gradient: "cyan", animateValue: true },
  },

  Library: {
    BookCard: { size: "sm", variant: "compact" },
    StatCard: { size: "md", gradient: "mint" },
  },

  Detail: {
    BookCard: { size: "lg", variant: "detailed" },
    StatCard: { size: "sm", gradient: "lavender" },
  },
};
