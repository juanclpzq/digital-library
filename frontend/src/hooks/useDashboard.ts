// ============================================================================
// DA// ============================================================================
// DASHBOARD UTILITIES - SEPARATED FOR FAST REFRESH COMPLIANCE
// FILE LOCATION: src/utils/dashboardUtils.ts
// ============================================================================

import React from "react";
import type { Book } from "@/types";
import type { DashboardProps } from "@/components/themes/softclub/Dashboard";

// ============================================================================
// DASHBOARD STATE INTERFACES
// ============================================================================

export interface DashboardState {
  books: Book[];
  isLoading: boolean;
  selectedBook: Book | null;
  showAddModal: boolean;
}

export interface DashboardActions {
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBook: React.Dispatch<React.SetStateAction<Book | null>>;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleBookClick: (book: Book) => void;
  handleBookUpdate: (updatedBook: Book) => void;
  handleBookDelete: (bookId: string) => void;
  handleAddBook: () => void;
  handleBookCreate: (newBook: Book) => void;
}

export interface DashboardStats {
  totalBooks: number;
  completedBooks: number;
  readingBooks: number;
  wishlistBooks: number;
  completionRate: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate dashboard statistics from books array
 */
export const calculateDashboardStats = (books: Book[]): DashboardStats => {
  const totalBooks = books.length;
  const completedBooks = books.filter(
    (book) => book.readingStatus === "completed"
  ).length;
  const readingBooks = books.filter(
    (book) => book.readingStatus === "reading"
  ).length;
  const wishlistBooks = books.filter(
    (book) => book.readingStatus === "want-to-read"
  ).length;

  const completionRate =
    totalBooks > 0 ? (completedBooks / totalBooks) * 100 : 0;

  return {
    totalBooks,
    completedBooks,
    readingBooks,
    wishlistBooks,
    completionRate: Math.round(completionRate),
  };
};

/**
 * Factory function para crear Dashboards adaptativos con configuración predeterminada
 */
export const createDashboardVariant = (
  defaultProps: Partial<DashboardProps>
) => {
  return (props: DashboardProps) => ({
    ...defaultProps,
    ...props,
  });
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
