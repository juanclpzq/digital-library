// ============================================================================
// HOOKS INDEX - CENTRALIZED HOOK EXPORTS
// FILE LOCATION: src/hooks/index.ts
// ============================================================================

// Theme & Styling Hooks
export { useTheme } from "@/theme/ThemeProvider";
export {
  useAdaptiveStyles,
  useAdaptiveComponentStyles,
  useAdaptiveGradients,
} from "./useAdaptiveStyles";

// Component Hooks
export {
  useAdaptiveComponents,
  createAdaptiveComponent,
} from "@/components/shared/AdaptiveBookCard";

// Book Management Hooks
export { useBooks } from "./useBooks";
export { useBookFilters } from "./useBookFilters";
export { useBookStats } from "./useBookStats";

// Authentication Hooks
export { useAuth } from "./useAuth";
export { useUser } from "./useUser";

// Storage & Persistence Hooks
export { useLocalStorage } from "./useLocalStorage";
export { useSessionStorage } from "./useSessionStorage";

// Utility Hooks
export { useDebounce } from "./useDebounce";
export { useIntersectionObserver } from "./useIntersectionObserver";
export { useMediaQuery } from "./useMediaQuery";
export { useClickOutside } from "./useClickOutside";

// Form Hooks
export { useForm } from "./useForm";
export { useFormValidation } from "./useFormValidation";

// Animation & UI Hooks
export { useAnimationControls } from "./useAnimationControls";
export { useScrollPosition } from "./useScrollPosition";
export { useWindowSize } from "./useWindowSize";

// ============================================================================
// HOOK COMBINATIONS & PRESETS
// ============================================================================

/**
 * Combined hook for theme-aware components
 */
export const useThemeAwareComponent = () => {
  const theme = useTheme();
  const styles = useAdaptiveStyles();
  const components = useAdaptiveComponents();

  return {
    theme,
    styles,
    components,
    isGlassMode: theme.isGlassMode,
    variant: theme.variant,
  };
};

/**
 * Combined hook for dashboard components
 */
export const useDashboard = () => {
  const books = useBooks();
  const stats = useBookStats();
  const theme = useTheme();
  const styles = useAdaptiveStyles();

  return {
    books,
    stats,
    theme,
    styles,
  };
};
