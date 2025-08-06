// ============================================================================
// ADAPTIVE FILTER BAR - AUTO-SWITCHES BETWEEN THEMES
// FILE LOCATION: src/components/shared/AdaptiveFilterBar.tsx
// ============================================================================

import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import FilterBarSoftclub from "@/components/themes/softclub/FilterBar";
import FilterBarGlassHeavy from "@/components/themes/glass-heavy/FilterBar";
import type { FilterBarProps } from "@/components/themes/softclub/FilterBar";

// ============================================================================
// ADAPTIVE FILTER BAR COMPONENT
// ============================================================================

/**
 * AdaptiveFilterBar automatically renders the appropriate FilterBar variant
 * based on the current theme (Softclub or Glass Heavy)
 *
 * @example
 * ```tsx
 * <AdaptiveFilterBar
 *   categories={allCategories}
 *   selectedCategories={filters.categories}
 *   onCategoriesChange={handleCategoryChange}
 *   searchTerm={filters.search}
 *   onSearchChange={handleSearchChange}
 *   totalResults={books.length}
 * />
 * ```
 */
const AdaptiveFilterBar: React.FC<FilterBarProps> = (props) => {
  const theme = useTheme();

  // Render the appropriate component based on current theme
  if (theme.isGlassMode) {
    return <FilterBarGlassHeavy {...props} />;
  }

  return <FilterBarSoftclub {...props} />;
};

export default AdaptiveFilterBar;

// ============================================================================
// FILTER BAR HOOKS & UTILITIES
// ============================================================================

/**
 * Hook que retorna la variante apropiada de FilterBar basado en el tema actual
 */
export const useAdaptiveFilterBar = () => {
  const theme = useTheme();

  const FilterBar = React.useMemo(() => {
    return theme.isGlassMode ? FilterBarGlassHeavy : FilterBarSoftclub;
  }, [theme.variant]);

  return { FilterBar };
};

/**
 * Factory function para crear FilterBars adaptativos con configuración predeterminada
 */
export const createFilterBarVariant = (
  defaultProps: Partial<FilterBarProps>
) => {
  return (props: FilterBarProps) => (
    <AdaptiveFilterBar {...defaultProps} {...props} />
  );
};

// ============================================================================
// PREDEFINED FILTER BAR VARIANTS
// ============================================================================

/**
 * Variantes predefinidas para casos de uso específicos
 */
export const FilterBarVariants = {
  // Para dashboard principal
  Dashboard: createFilterBarVariant({
    className: "mb-6",
  }),

  // Para página de biblioteca completa
  Library: createFilterBarVariant({
    className: "mb-4",
  }),

  // Para modales o espacios compactos
  Compact: createFilterBarVariant({
    className: "mb-3 text-sm",
  }),

  // Para páginas de búsqueda avanzada
  Advanced: createFilterBarVariant({
    className: "mb-8",
  }),
};

// ============================================================================
// FILTER STATE MANAGEMENT HELPERS
// ============================================================================

/**
 * Hook para manejar el estado de filtros de forma consistente
 */
export const useFilterState = (initialFilters = {}) => {
  const [filters, setFilters] = React.useState({
    categories: [],
    statuses: [],
    searchTerm: "",
    sortBy: "title",
    sortOrder: "asc",
    ...initialFilters,
  });

  const updateFilters = React.useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const clearFilters = React.useCallback(() => {
    setFilters({
      categories: [],
      statuses: [],
      searchTerm: "",
      sortBy: "title",
      sortOrder: "asc",
    });
  }, []);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters:
      filters.categories.length > 0 ||
      filters.statuses.length > 0 ||
      filters.searchTerm.length > 0,
  };
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { FilterBarProps } from "@/components/themes/softclub/FilterBar";
export { AdaptiveFilterBar as default };
