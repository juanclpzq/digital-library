// ============================================================================
// COMPONENTS MAIN INDEX - CENTRALIZED COMPONENT EXPORTS
// FILE LOCATION: src/components/index.ts
// ============================================================================

// ============================================================================
// SHARED/ADAPTIVE COMPONENTS (PRIMARY EXPORTS)
// ============================================================================

// Main adaptive components - these are the primary exports users should use
export {
  default as AdaptiveBookCard,
  useAdaptiveComponents,
} from "./shared/AdaptiveBookCard";
export {
  default as AdaptiveStatCard,
  useAdaptiveStatCard,
  StatCardVariants,
} from "./shared/AdaptiveStatCard";
export {
  default as AdaptiveFilterBar,
  useAdaptiveFilterBar,
  FilterBarVariants,
} from "./shared/AdaptiveFilterBar";
export {
  default as AdaptiveBookGrid,
  useAdaptiveBookGrid,
  BookGridVariants,
} from "./shared/AdaptiveBookGrid";
export {
  default as AdaptiveDashboard,
  useAdaptiveDashboard,
  DashboardVariants,
} from "./shared/AdaptiveDashboard";

// Shared utilities
export { AdaptiveComponents, AdaptivePresets } from "./shared";

// ============================================================================
// THEME-SPECIFIC COMPONENTS (ADVANCED USAGE)
// ============================================================================

// Softclub theme components - for direct theme usage
export * as SoftclubComponents from "./themes/softclub";

// Glass Heavy theme components - for direct theme usage
export * as GlassHeavyComponents from "./themes/glass-heavy";

// Glass Heavy effects - for custom glass compositions
export * as GlassEffects from "./themes/glass-heavy/effects";

// ============================================================================
// UI COMPONENTS (BASE/GENERIC)
// ============================================================================

// Base UI components (theme-agnostic)
export { default as ThemeToggle } from "./ui/ThemeToggle";
// Additional UI components will be exported here as they're created
// export { default as Button } from "./ui/Button";
// export { default as Input } from "./ui/Input";
// export { default as Modal } from "./ui/Modal";

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

// Layout components (adaptive)
// export { default as AppLayout } from "./layout/AppLayout";
// export { default as PageLayout } from "./layout/PageLayout";
// export { default as Navigation } from "./layout/Navigation";

// ============================================================================
// FORM COMPONENTS
// ============================================================================

// Form components (adaptive)
// export { default as BookForm } from "./forms/BookForm";
// export { default as LoginForm } from "./forms/LoginForm";
// export { default as RegisterForm } from "./forms/RegisterForm";

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Export important types for external usage
export type { BookCardProps } from "./themes/softclub/BookCard";
export type { StatCardProps } from "./shared/AdaptiveStatCard";
export type { FilterBarProps } from "./shared/AdaptiveFilterBar";
export type { BookGridProps } from "./shared/AdaptiveBookGrid";
export type { DashboardProps } from "./shared/AdaptiveDashboard";

// Glass-specific types
export type { GlassContainerProps } from "./themes/glass-heavy/effects/GlassContainer";
export type { GlassDepthProps } from "./themes/glass-heavy/effects/GlassDepth";

// ============================================================================
// COMPONENT FACTORIES & UTILITIES
// ============================================================================

// Factory functions for creating custom adaptive components
export { createAdaptiveComponent } from "./shared/AdaptiveBookCard";
export { createStatCardVariant } from "./shared/AdaptiveStatCard";
export { createFilterBarVariant } from "./shared/AdaptiveFilterBar";
export { createBookGridVariant } from "./shared/AdaptiveBookGrid";
export { createDashboardVariant } from "./shared/AdaptiveDashboard";

// ============================================================================
// COMPONENT PRESETS & CONFIGURATIONS
// ============================================================================

/**
 * Complete component sets for different use cases
 */
export const ComponentSets = {
  // Dashboard page components
  Dashboard: {
    StatCard: AdaptiveStatCard,
    BookGrid: AdaptiveBookGrid,
    FilterBar: AdaptiveFilterBar,
    Dashboard: AdaptiveDashboard,
  },

  // Library page components
  Library: {
    BookCard: AdaptiveBookCard,
    BookGrid: AdaptiveBookGrid,
    FilterBar: AdaptiveFilterBar,
  },

  // Book detail page components
  BookDetail: {
    BookCard: AdaptiveBookCard,
    StatCard: AdaptiveStatCard,
  },

  // Search page components
  Search: {
    BookCard: AdaptiveBookCard,
    BookGrid: AdaptiveBookGrid,
    FilterBar: AdaptiveFilterBar,
  },
};

/**
 * Recommended component configurations for different themes
 */
export const ThemeRecommendations = {
  softclub: {
    defaultProps: {
      StatCard: { size: "md", animateValue: true },
      BookGrid: { gridCols: 4, gap: "md" },
      FilterBar: { className: "mb-6" },
    },
    preferredVariants: {
      StatCard: "BookStats",
      BookGrid: "Library",
      FilterBar: "Dashboard",
    },
  },

  glassHeavy: {
    defaultProps: {
      StatCard: {
        size: "md",
        animateValue: true,
        shimmer: true,
        condensation: true,
        glassIntensity: "medium",
      },
      BookGrid: {
        gridCols: 4,
        gap: "md",
        glassIntensity: "medium",
      },
      FilterBar: { className: "mb-8" },
    },
    preferredVariants: {
      StatCard: "BookStats",
      BookGrid: "Library",
      FilterBar: "Dashboard",
    },
  },
};

// ============================================================================
// COMPONENT REGISTRY (FOR DYNAMIC LOADING)
// ============================================================================

/**
 * Component registry for dynamic component loading
 * Useful for plugin systems or dynamic UI generation
 */
export const ComponentRegistry = {
  // Adaptive components
  "adaptive-book-card": AdaptiveBookCard,
  "adaptive-stat-card": AdaptiveStatCard,
  "adaptive-filter-bar": AdaptiveFilterBar,
  "adaptive-book-grid": AdaptiveBookGrid,
  "adaptive-dashboard": AdaptiveDashboard,

  // Theme-specific components
  "softclub-book-card": SoftclubComponents.BookCard,
  "softclub-stat-card": SoftclubComponents.StatCard,
  "glass-heavy-book-card": GlassHeavyComponents.BookCard,
  "glass-heavy-stat-card": GlassHeavyComponents.StatCard,

  // UI components
  "theme-toggle": ThemeToggle,
} as const;

/**
 * Get component from registry
 */
export const getComponent = (name: keyof typeof ComponentRegistry) => {
  return ComponentRegistry[name];
};

/**
 * Check if component exists in registry
 */
export const hasComponent = (
  name: string
): name is keyof typeof ComponentRegistry => {
  return name in ComponentRegistry;
};

// ============================================================================
// VALIDATION & DEVELOPMENT HELPERS
// ============================================================================

/**
 * Validate component props at runtime (development only)
 */
export const validateComponentProps = (componentName: string, props: any) => {
  if (process.env.NODE_ENV === "development") {
    // Add prop validation logic here
    console.log(`Validating props for ${componentName}:`, props);
  }
};

/**
 * Component usage statistics (development only)
 */
export const trackComponentUsage = (componentName: string) => {
  if (process.env.NODE_ENV === "development") {
    const usage = JSON.parse(localStorage.getItem("component-usage") || "{}");
    usage[componentName] = (usage[componentName] || 0) + 1;
    localStorage.setItem("component-usage", JSON.stringify(usage));
  }
};

// ============================================================================
// DOCUMENTATION HELPERS
// ============================================================================

/**
 * Component documentation metadata
 */
export const ComponentDocs = {
  AdaptiveBookCard: {
    description: "Displays book information with theme-adaptive styling",
    props: ["book", "onClick", "onStatusChange", "onDelete", "className"],
    examples: [
      "Basic usage: <AdaptiveBookCard book={book} />",
      "With interactions: <AdaptiveBookCard book={book} onClick={handleClick} />",
    ],
  },
  AdaptiveStatCard: {
    description:
      "Displays statistics with animated values and theme-adaptive styling",
    props: ["label", "value", "gradient", "trend", "icon", "size", "variant"],
    examples: [
      'Basic: <AdaptiveStatCard label="Total Books" value={156} />',
      'With trend: <AdaptiveStatCard label="Completed" value={89} trend="up" trendValue={12} />',
    ],
  },
  // Add more component documentation as needed
};

/**
 * Get component documentation
 */
export const getComponentDocs = (componentName: keyof typeof ComponentDocs) => {
  return ComponentDocs[componentName];
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

// Default export with most commonly used components
export default {
  // Primary adaptive components
  BookCard: AdaptiveBookCard,
  StatCard: AdaptiveStatCard,
  FilterBar: AdaptiveFilterBar,
  BookGrid: AdaptiveBookGrid,
  Dashboard: AdaptiveDashboard,

  // UI components
  ThemeToggle,

  // Utilities
  ComponentSets,
  getComponent,
  hasComponent,
};
