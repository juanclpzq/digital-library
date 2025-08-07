// ============================================================================
// DASHBOARD UTILITIES - SEPARATED FOR FAST REFRESH COMPLIANCE
// FILE LOCATION: src/utils/dashboardUtils.ts
// ============================================================================

import React from "react";
import type { Book } from "@/types";
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
