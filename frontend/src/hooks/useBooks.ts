// ============================================================================
// USE BOOKS HOOK - BOOK MANAGEMENT STATE & API INTEGRATION
// FILE LOCATION: src/hooks/useBooks.ts
// ============================================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { booksAPI } from "@/api/books";
import type { Book, BookCategory, ReadingStatus } from "@/types";

// ============================================================================
// HOOK INTERFACES
// ============================================================================

export interface UseBooksOptions {
  initialBooks?: Book[];
  autoLoad?: boolean;
  enableCache?: boolean;
  sortBy?: "title" | "author" | "dateAdded" | "rating";
  sortOrder?: "asc" | "desc";
}

export interface UseBooksReturn {
  // State
  books: Book[];
  isLoading: boolean;
  error: string | null;

  // Computed values
  stats: BookStats;
  categories: BookCategory[];
  recentBooks: Book[];

  // Actions
  loadBooks: () => Promise<void>;
  addBook: (book: Omit<Book, "_id">) => Promise<Book | null>;
  updateBook: (bookId: string, updates: Partial<Book>) => Promise<Book | null>;
  deleteBook: (bookId: string) => Promise<boolean>;

  // Bulk actions
  updateMultipleBooks: (
    updates: { bookId: string; updates: Partial<Book> }[]
  ) => Promise<void>;
  deleteMultipleBooks: (bookIds: string[]) => Promise<void>;

  // Filtering & Searching
  filterBooks: (filters: BookFilters) => Book[];
  searchBooks: (query: string) => Book[];

  // Status management
  updateBookStatus: (bookId: string, status: ReadingStatus) => Promise<void>;
  updateBookProgress: (bookId: string, progress: number) => Promise<void>;
  toggleFavorite: (bookId: string) => Promise<void>;

  // Utility
  refreshBooks: () => Promise<void>;
  clearError: () => void;
}

export interface BookStats {
  total: number;
  completed: number;
  reading: number;
  wantToRead: number;
  paused: number;
  abandoned: number;
  completionRate: number;
  avgRating: number;
  totalPages: number;
  booksThisMonth: number;
  booksThisYear: number;
}

export interface BookFilters {
  categories?: BookCategory[];
  statuses?: ReadingStatus[];
  rating?: { min: number; max: number };
  dateRange?: { start: Date; end: Date };
  isFavorite?: boolean;
  hasRating?: boolean;
}

// ============================================================================
// MAIN USE BOOKS HOOK
// ============================================================================

export const useBooks = (options: UseBooksOptions = {}): UseBooksReturn => {
  const {
    initialBooks = [],
    autoLoad = true,
    enableCache = true,
    sortBy = "title",
    sortOrder = "asc",
  } = options;

  // State
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load books from API
  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedBooks = await booksAPI.getAll();
      setBooks(loadedBooks);

      if (enableCache) {
        localStorage.setItem("books_cache", JSON.stringify(loadedBooks));
        localStorage.setItem("books_cache_timestamp", Date.now().toString());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load books");
      console.error("Error loading books:", err);
    } finally {
      setIsLoading(false);
    }
  }, [enableCache]);

  // Add new book
  const addBook = useCallback(
    async (bookData: Omit<Book, "_id">): Promise<Book | null> => {
      try {
        const newBook = await booksAPI.create(bookData);
        setBooks((prev) => [newBook, ...prev]);
        return newBook;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add book");
        return null;
      }
    },
    []
  );

  // Update existing book
  const updateBook = useCallback(
    async (bookId: string, updates: Partial<Book>): Promise<Book | null> => {
      try {
        const updatedBook = await booksAPI.update(bookId, updates);
        setBooks((prev) =>
          prev.map((book) => (book._id === bookId ? updatedBook : book))
        );
        return updatedBook;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update book");
        return null;
      }
    },
    []
  );

  // Delete book
  const deleteBook = useCallback(async (bookId: string): Promise<boolean> => {
    try {
      await booksAPI.delete(bookId);
      setBooks((prev) => prev.filter((book) => book._id !== bookId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
      return false;
    }
  }, []);

  // Bulk operations
  const updateMultipleBooks = useCallback(
    async (updates: { bookId: string; updates: Partial<Book> }[]) => {
      try {
        const promises = updates.map(({ bookId, updates: bookUpdates }) =>
          booksAPI.update(bookId, bookUpdates)
        );

        const updatedBooks = await Promise.all(promises);

        setBooks((prev) =>
          prev.map((book) => {
            const update = updatedBooks.find(
              (updated) => updated._id === book._id
            );
            return update || book;
          })
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update books");
      }
    },
    []
  );

  const deleteMultipleBooks = useCallback(async (bookIds: string[]) => {
    try {
      await Promise.all(bookIds.map((id) => booksAPI.delete(id)));
      setBooks((prev) => prev.filter((book) => !bookIds.includes(book._id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete books");
    }
  }, []);

  // Filtering and searching
  const filterBooks = useCallback(
    (filters: BookFilters): Book[] => {
      return books.filter((book) => {
        // Category filter
        if (filters.categories && filters.categories.length > 0) {
          if (!filters.categories.includes(book.category)) return false;
        }

        // Status filter
        if (filters.statuses && filters.statuses.length > 0) {
          if (!filters.statuses.includes(book.readingStatus)) return false;
        }

        // Rating filter
        if (filters.rating) {
          const rating = book.rating || 0;
          if (rating < filters.rating.min || rating > filters.rating.max)
            return false;
        }

        // Date filter
        if (filters.dateRange && book.dateAdded) {
          const bookDate = new Date(book.dateAdded);
          if (
            bookDate < filters.dateRange.start ||
            bookDate > filters.dateRange.end
          )
            return false;
        }

        // Favorite filter
        if (filters.isFavorite !== undefined) {
          if (book.isFavorite !== filters.isFavorite) return false;
        }

        // Has rating filter
        if (filters.hasRating !== undefined) {
          if (filters.hasRating && !book.rating) return false;
          if (!filters.hasRating && book.rating) return false;
        }

        return true;
      });
    },
    [books]
  );

  const searchBooks = useCallback(
    (query: string): Book[] => {
      if (!query.trim()) return books;

      const lowercaseQuery = query.toLowerCase();
      return books.filter(
        (book) =>
          book.title.toLowerCase().includes(lowercaseQuery) ||
          book.author.toLowerCase().includes(lowercaseQuery) ||
          book.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      );
    },
    [books]
  );

  // Status management helpers
  const updateBookStatus = useCallback(
    async (bookId: string, status: ReadingStatus) => {
      await updateBook(bookId, { readingStatus: status });
    },
    [updateBook]
  );

  const updateBookProgress = useCallback(
    async (bookId: string, progress: number) => {
      await updateBook(bookId, { progress });
    },
    [updateBook]
  );

  const toggleFavorite = useCallback(
    async (bookId: string) => {
      const book = books.find((b) => b._id === bookId);
      if (book) {
        await updateBook(bookId, { isFavorite: !book.isFavorite });
      }
    },
    [books, updateBook]
  );

  // Utility functions
  const refreshBooks = useCallback(async () => {
    await loadBooks();
  }, [loadBooks]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Computed values
  const stats = useMemo((): BookStats => {
    const total = books.length;
    const completed = books.filter(
      (b) => b.readingStatus === "completed"
    ).length;
    const reading = books.filter((b) => b.readingStatus === "reading").length;
    const wantToRead = books.filter(
      (b) => b.readingStatus === "want-to-read"
    ).length;
    const paused = books.filter((b) => b.readingStatus === "paused").length;
    const abandoned = books.filter(
      (b) => b.readingStatus === "abandoned"
    ).length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    const ratedBooks = books.filter((b) => b.rating);
    const avgRating =
      ratedBooks.length > 0
        ? ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) /
          ratedBooks.length
        : 0;

    const totalPages = books.reduce((sum, b) => sum + (b.totalPages || 0), 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const booksThisMonth = books.filter(
      (b) => b.dateAdded && new Date(b.dateAdded) >= startOfMonth
    ).length;

    const booksThisYear = books.filter(
      (b) => b.dateAdded && new Date(b.dateAdded) >= startOfYear
    ).length;

    return {
      total,
      completed,
      reading,
      wantToRead,
      paused,
      abandoned,
      completionRate,
      avgRating: Math.round(avgRating * 10) / 10,
      totalPages,
      booksThisMonth,
      booksThisYear,
    };
  }, [books]);

  const categories = useMemo(() => {
    return Array.from(new Set(books.map((b) => b.category)));
  }, [books]);

  const recentBooks = useMemo(() => {
    return [...books]
      .sort((a, b) => {
        const dateA = new Date(a.dateAdded || 0).getTime();
        const dateB = new Date(b.dateAdded || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [books]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad && books.length === 0) {
      // Check cache first
      if (enableCache) {
        const cached = localStorage.getItem("books_cache");
        const timestamp = localStorage.getItem("books_cache_timestamp");

        if (cached && timestamp) {
          const cacheAge = Date.now() - parseInt(timestamp);
          const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

          if (cacheAge < CACHE_DURATION) {
            try {
              setBooks(JSON.parse(cached));
              return;
            } catch (err) {
              console.warn("Failed to parse cached books:", err);
            }
          }
        }
      }

      loadBooks();
    }
  }, [autoLoad, enableCache, loadBooks, books.length]);

  // Sort books
  const sortedBooks = useMemo(() => {
    return [...books].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "author":
          comparison = a.author.localeCompare(b.author);
          break;
        case "dateAdded":
          const dateA = new Date(a.dateAdded || 0).getTime();
          const dateB = new Date(b.dateAdded || 0).getTime();
          comparison = dateA - dateB;
          break;
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [books, sortBy, sortOrder]);

  return {
    // State
    books: sortedBooks,
    isLoading,
    error,

    // Computed values
    stats,
    categories,
    recentBooks,

    // Actions
    loadBooks,
    addBook,
    updateBook,
    deleteBook,

    // Bulk actions
    updateMultipleBooks,
    deleteMultipleBooks,

    // Filtering & Searching
    filterBooks,
    searchBooks,

    // Status management
    updateBookStatus,
    updateBookProgress,
    toggleFavorite,

    // Utility
    refreshBooks,
    clearError,
  };
};
