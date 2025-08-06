// ============================================================================
// ADAPTIVE DASHBOARD - AUTO-SWITCHES BETWEEN THEMES
// FILE LOCATION: src/components/shared/AdaptiveDashboard.tsx
// ============================================================================

import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import DashboardSoftclub from "@/components/themes/softclub/Dashboard";
import DashboardGlassHeavy from "@/components/themes/glass-heavy/Dashboard";
import type { DashboardProps } from "@/components/themes/softclub/Dashboard";

// ============================================================================
// ADAPTIVE DASHBOARD COMPONENT
// ============================================================================

/**
 * AdaptiveDashboard automatically renders the appropriate Dashboard variant
 * based on the current theme (Softclub or Glass Heavy)
 * 
 * @example
 * ```tsx
 * <AdaptiveDashboard 
 *   books={books}
 *   isLoading={loading}
 *   onBookClick={handleBookClick}
 *   onBookUpdate={handleBookUpdate}
 *   onBookDelete={handleBookDelete}
 *   onAddBook={handleAddBook}
 * />
 * ```
 */
const AdaptiveDashboard: React.FC<DashboardProps> = (props) => {
  const theme = useTheme();

  // Add glass-specific props when in glass mode
  const enhancedProps = theme.isGlassMode 
    ? { ...props, glassIntensity: theme.glassIntensity }
    : props;

  // Render the appropriate component based on current theme
  if (theme.isGlassMode) {
    return <DashboardGlassHeavy {...enhancedProps} />;
  }

  return <DashboardSoftclub {...props} />;
};

export default AdaptiveDashboard;

// ============================================================================
// DASHBOARD HOOKS & UTILITIES
// ============================================================================

/**
 * Hook que retorna la variante apropiada de Dashboard basado en el tema actual
 */
export const useAdaptiveDashboard = () => {
  const theme = useTheme();

  const Dashboard = React.useMemo(() => {
    return theme.isGlassMode ? DashboardGlassHeavy : DashboardSoftclub;
  }, [theme.variant]);

  return { Dashboard };
};

/**
 * Factory function para crear Dashboards adaptativos con configuración predeterminada
 */
export const createDashboardVariant = (defaultProps: Partial<DashboardProps>) => {
  return (props: DashboardProps) => (
    <AdaptiveDashboard {...defaultProps} {...props} />
  );
};

// ============================================================================
// PREDEFINED DASHBOARD VARIANTS
// ============================================================================

/**
 * Variantes predefinidas para casos de uso específicos
 */
export const DashboardVariants = {
  // Dashboard principal completo
  Main: createDashboardVariant({
    className: "min-h-screen",
  }),

  // Dashboard compacto para espacios reducidos
  Compact: createDashboardVariant({
    className: "p-4",
  }),

  // Dashboard de solo lectura (sin acciones)
  ReadOnly: createDashboardVariant({
    onAddBook: undefined,
    onBookUpdate: undefined,
    onBookDelete: undefined,
  }),

  // Dashboard con foco en estadísticas
  Analytics: createDashboardVariant({
    className: "analytics-focused",
  }),
};

// ============================================================================
// DASHBOARD STATE MANAGEMENT HELPERS
// ============================================================================

/**
 * Hook para manejar el estado completo del dashboard
 */
export const useDashboardState = (initialBooks = []) => {
  const [books, setBooks] = React.useState(initialBooks);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [showAddModal, setShowAddModal] = React.useState(false);

  const handleBookClick = React.useCallback((book: any) => {
    setSelectedBook(book);
  }, []);

  const handleBookUpdate = React.useCallback((updatedBook: any) => {
    setBooks(prev => prev.map(book => 
      book._id === updatedBook._id ? updatedBook : book
    ));
  }, []);

  const handleBookDelete = React.useCallback((bookId: string) => {
    setBooks(prev => prev.filter(book => book._id !== bookId));
  }, []);

  const handleAddBook = React.useCallback(() => {
    setShowAddModal(true);
  }, []);

  const addNewBook = React.useCallback((newBook: any) => {
    setBooks(prev => [newBook, ...prev]);
    setShowAddModal(false);
  }, []);

  return {
    // State
    books,
    isLoading,
    selectedBook,
    showAddModal,
    
    // Setters
    setBooks,
    setIsLoading,
    setSelectedBook,
    setShowAddModal,
    
    // Handlers
    handleBookClick,
    handleBookUpdate,
    handleBookDelete,
    handleAddBook,
    addNewBook,
  };
};

/**
 * Hook para estadísticas del dashboard
 */
export const useDashboardStats = (books: any[]) => {
  return React.useMemo(() => {
    const total = books.length;
    const completed = books.filter(b => b.readingStatus === 'completed').length;
    const reading = books.filter(b => b.readingStatus === 'reading').length;
    const wantToRead = books.filter(b => b.readingStatus === 'want-to-read').length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const avgRating = books.length > 0 
      ? books.filter(b => b.rating).reduce((sum, b) => sum + (b.rating || 0), 0) / books.filter(b => b.rating).length
      : 0;

    return {
      total,
      completed,
      reading,
      wantToRead,
      completionRate,
      avgRating: Math.round(avgRating * 10) / 10,
      categories: Array.from(new Set(books.map(b => b.category))),
      recentBooks: books.slice(0, 5),
      topRatedBooks: books.filter(b => b.rating).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5),
    };
  }, [books]);
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { DashboardProps } from "@/components/themes/softclub/Dashboard";
export { AdaptiveDashboard as default };