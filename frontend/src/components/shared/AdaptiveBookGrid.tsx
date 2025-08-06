// ============================================================================
// ADAPTIVE BOOK GRID - AUTO-SWITCHES BETWEEN THEMES
// FILE LOCATION: src/components/shared/AdaptiveBookGrid.tsx
// ============================================================================

import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import BookGridSoftclub from "@/components/themes/softclub/BookGrid";
import BookGridGlassHeavy from "@/components/themes/glass-heavy/BookGrid";
import type { BookGridProps } from "@/components/themes/softclub/BookGrid";

// ============================================================================
// ADAPTIVE BOOK GRID COMPONENT
// ============================================================================

/**
 * AdaptiveBookGrid automatically renders the appropriate BookGrid variant
 * based on the current theme (Softclub or Glass Heavy)
 *
 * @example
 * ```tsx
 * <AdaptiveBookGrid
 *   books={filteredBooks}
 *   gridCols={4}
 *   gap="md"
 *   onBookClick={handleBookClick}
 *   onBookUpdate={handleBookUpdate}
 *   isLoading={loading}
 * />
 * ```
 */
const AdaptiveBookGrid: React.FC<BookGridProps> = (props) => {
  const theme = useTheme();

  // Add glass-specific props when in glass mode
  const enhancedProps = theme.isGlassMode
    ? { ...props, glassIntensity: theme.glassIntensity }
    : props;

  // Render the appropriate component based on current theme
  if (theme.isGlassMode) {
    return <BookGridGlassHeavy {...enhancedProps} />;
  }

  return <BookGridSoftclub {...props} />;
};

export default AdaptiveBookGrid;

// ============================================================================
// BOOK GRID HOOKS & UTILITIES
// ============================================================================

/**
 * Hook que retorna la variante apropiada de BookGrid basado en el tema actual
 */
export const useAdaptiveBookGrid = () => {
  const theme = useTheme();

  const BookGrid = React.useMemo(() => {
    return theme.isGlassMode ? BookGridGlassHeavy : BookGridSoftclub;
  }, [theme.variant]);

  return { BookGrid };
};

/**
 * Factory function para crear BookGrids adaptativos con configuración predeterminada
 */
export const createBookGridVariant = (defaultProps: Partial<BookGridProps>) => {
  return (props: BookGridProps) => (
    <AdaptiveBookGrid {...defaultProps} {...props} />
  );
};

// ============================================================================
// PREDEFINED BOOK GRID VARIANTS
// ============================================================================

/**
 * Variantes predefinidas para casos de uso específicos
 */
export const BookGridVariants = {
  // Para dashboard principal - vista compacta
  Dashboard: createBookGridVariant({
    gridCols: 6,
    gap: "sm",
    showHeader: false,
  }),

  // Para página de biblioteca - vista estándar
  Library: createBookGridVariant({
    gridCols: 4,
    gap: "md",
    showHeader: true,
    headerTitle: "Your Library",
  }),

  // Para búsquedas y filtros - vista detallada
  Search: createBookGridVariant({
    gridCols: 3,
    gap: "lg",
    showHeader: true,
    headerTitle: "Search Results",
  }),

  // Para categorías específicas - vista media
  Category: createBookGridVariant({
    gridCols: 5,
    gap: "md",
    showHeader: true,
  }),

  // Para vista móvil optimizada
  Mobile: createBookGridVariant({
    gridCols: 2,
    gap: "sm",
    showHeader: false,
  }),
};

// ============================================================================
// GRID STATE MANAGEMENT HELPERS
// ============================================================================

/**
 * Hook para manejar el estado del grid de forma consistente
 */
export const useBookGridState = (initialBooks = []) => {
  const [books, setBooks] = React.useState(initialBooks);
  const [isLoading, setIsLoading] = React.useState(false);
  const [gridConfig, setGridConfig] = React.useState({
    cols: 4,
    gap: "md" as const,
    showHeader: true,
  });

  const updateBooks = React.useCallback((newBooks: any[]) => {
    setBooks(newBooks);
  }, []);

  const updateGridConfig = React.useCallback(
    (config: Partial<typeof gridConfig>) => {
      setGridConfig((prev) => ({ ...prev, ...config }));
    },
    []
  );

  const addBook = React.useCallback((book: any) => {
    setBooks((prev) => [...prev, book]);
  }, []);

  const updateBook = React.useCallback((updatedBook: any) => {
    setBooks((prev) =>
      prev.map((book) => (book._id === updatedBook._id ? updatedBook : book))
    );
  }, []);

  const removeBook = React.useCallback((bookId: string) => {
    setBooks((prev) => prev.filter((book) => book._id !== bookId));
  }, []);

  return {
    books,
    isLoading,
    gridConfig,
    setIsLoading,
    updateBooks,
    updateGridConfig,
    addBook,
    updateBook,
    removeBook,
  };
};

/**
 * Hook para responsive grid columns basado en screen size
 */
export const useResponsiveGrid = () => {
  const [gridCols, setGridCols] = React.useState(4);

  React.useEffect(() => {
    const updateGridCols = () => {
      const width = window.innerWidth;
      if (width < 640) setGridCols(1);
      else if (width < 768) setGridCols(2);
      else if (width < 1024) setGridCols(3);
      else if (width < 1280) setGridCols(4);
      else if (width < 1536) setGridCols(5);
      else setGridCols(6);
    };

    updateGridCols();
    window.addEventListener("resize", updateGridCols);
    return () => window.removeEventListener("resize", updateGridCols);
  }, []);

  return gridCols;
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { BookGridProps } from "@/components/themes/softclub/BookGrid";
export { AdaptiveBookGrid as default };
