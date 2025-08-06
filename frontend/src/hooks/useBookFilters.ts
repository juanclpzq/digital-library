// ============================================================================
// USE BOOK FILTERS HOOK - ADVANCED BOOK FILTERING STATE MANAGEMENT
// FILE LOCATION: src/hooks/useBookFilters.ts
// ============================================================================

import { useState, useCallback, useMemo, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import type { Book, BookCategory, ReadingStatus } from "@/types";

// ============================================================================
// FILTER INTERFACES
// ============================================================================

export interface BookFilters {
  // Basic filters
  categories: BookCategory[];
  statuses: ReadingStatus[];
  searchTerm: string;

  // Advanced filters
  rating: {
    enabled: boolean;
    min: number;
    max: number;
  };

  dateRange: {
    enabled: boolean;
    start: Date | null;
    end: Date | null;
  };

  progress: {
    enabled: boolean;
    min: number;
    max: number;
  };

  // Boolean filters
  isFavorite: boolean | null; // null = no filter, true/false = filter
  hasRating: boolean | null;
  hasNotes: boolean | null;
  isCompleted: boolean | null;

  // Sorting
  sortBy: "title" | "author" | "dateAdded" | "rating" | "progress" | "category";
  sortOrder: "asc" | "desc";

  // View options
  showOnlyRecent: boolean;
  recentDays: number;
}

export interface UseBookFiltersOptions {
  initialFilters?: Partial<BookFilters>;
  persistFilters?: boolean;
  storageKey?: string;
  debounceMs?: number;
}

export interface UseBookFiltersReturn {
  // Current filters
  filters: BookFilters;

  // Filter setters
  setCategories: (categories: BookCategory[]) => void;
  setStatuses: (statuses: ReadingStatus[]) => void;
  setSearchTerm: (term: string) => void;
  setRatingFilter: (enabled: boolean, min?: number, max?: number) => void;
  setDateRangeFilter: (
    enabled: boolean,
    start?: Date | null,
    end?: Date | null
  ) => void;
  setProgressFilter: (enabled: boolean, min?: number, max?: number) => void;
  setIsFavorite: (isFavorite: boolean | null) => void;
  setHasRating: (hasRating: boolean | null) => void;
  setHasNotes: (hasNotes: boolean | null) => void;
  setIsCompleted: (isCompleted: boolean | null) => void;
  setSorting: (
    sortBy: BookFilters["sortBy"],
    sortOrder?: BookFilters["sortOrder"]
  ) => void;
  setShowOnlyRecent: (show: boolean, days?: number) => void;

  // Bulk operations
  updateFilters: (updates: Partial<BookFilters>) => void;
  resetFilters: () => void;
  resetAdvancedFilters: () => void;

  // Filter application
  applyFilters: (books: Book[]) => Book[];

  // Filter state
  hasActiveFilters: boolean;
  activeFilterCount: number;
  debouncedSearchTerm: string;

  // Presets
  applyPreset: (preset: FilterPreset) => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => boolean;
  getAvailablePresets: () => string[];
}

export type FilterPreset =
  | "reading"
  | "completed"
  | "favorites"
  | "recent"
  | "highly-rated"
  | "unrated"
  | "in-progress"
  | "custom";

// ============================================================================
// DEFAULT FILTER VALUES
// ============================================================================

const defaultFilters: BookFilters = {
  categories: [],
  statuses: [],
  searchTerm: "",

  rating: {
    enabled: false,
    min: 1,
    max: 5,
  },

  dateRange: {
    enabled: false,
    start: null,
    end: null,
  },

  progress: {
    enabled: false,
    min: 0,
    max: 100,
  },

  isFavorite: null,
  hasRating: null,
  hasNotes: null,
  isCompleted: null,

  sortBy: "title",
  sortOrder: "asc",

  showOnlyRecent: false,
  recentDays: 30,
};

// ============================================================================
// FILTER PRESETS
// ============================================================================

const filterPresets: Record<FilterPreset, Partial<BookFilters>> = {
  reading: {
    statuses: ["reading"],
    sortBy: "progress",
    sortOrder: "desc",
  },

  completed: {
    statuses: ["completed"],
    sortBy: "dateAdded",
    sortOrder: "desc",
  },

  favorites: {
    isFavorite: true,
    sortBy: "rating",
    sortOrder: "desc",
  },

  recent: {
    showOnlyRecent: true,
    recentDays: 30,
    sortBy: "dateAdded",
    sortOrder: "desc",
  },

  "highly-rated": {
    rating: {
      enabled: true,
      min: 4,
      max: 5,
    },
    hasRating: true,
    sortBy: "rating",
    sortOrder: "desc",
  },

  unrated: {
    hasRating: false,
    sortBy: "dateAdded",
    sortOrder: "desc",
  },

  "in-progress": {
    statuses: ["reading", "paused"],
    progress: {
      enabled: true,
      min: 1,
      max: 99,
    },
    sortBy: "progress",
    sortOrder: "desc",
  },

  custom: {}, // Empty for custom presets
};

// ============================================================================
// MAIN USE BOOK FILTERS HOOK
// ============================================================================

export const useBookFilters = (
  options: UseBookFiltersOptions = {}
): UseBookFiltersReturn => {
  const {
    initialFilters = {},
    persistFilters = true,
    storageKey = "bookFilters",
    debounceMs = 300,
  } = options;

  // Load initial filters from storage or defaults
  const getInitialFilters = useCallback((): BookFilters => {
    const merged = { ...defaultFilters, ...initialFilters };

    if (persistFilters) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...merged, ...parsed };
        }
      } catch (err) {
        console.warn("Failed to load stored filters:", err);
      }
    }

    return merged;
  }, [initialFilters, persistFilters, storageKey]);

  const [filters, setFilters] = useState<BookFilters>(getInitialFilters);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(filters.searchTerm, debounceMs);

  // Persist filters to storage
  useEffect(() => {
    if (persistFilters) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(filters));
      } catch (err) {
        console.warn("Failed to persist filters:", err);
      }
    }
  }, [filters, persistFilters, storageKey]);

  // Individual filter setters
  const setCategories = useCallback((categories: BookCategory[]) => {
    setFilters((prev) => ({ ...prev, categories }));
  }, []);

  const setStatuses = useCallback((statuses: ReadingStatus[]) => {
    setFilters((prev) => ({ ...prev, statuses }));
  }, []);

  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  }, []);

  const setRatingFilter = useCallback((enabled: boolean, min = 1, max = 5) => {
    setFilters((prev) => ({
      ...prev,
      rating: { enabled, min, max },
    }));
  }, []);

  const setDateRangeFilter = useCallback(
    (enabled: boolean, start: Date | null = null, end: Date | null = null) => {
      setFilters((prev) => ({
        ...prev,
        dateRange: { enabled, start, end },
      }));
    },
    []
  );

  const setProgressFilter = useCallback(
    (enabled: boolean, min = 0, max = 100) => {
      setFilters((prev) => ({
        ...prev,
        progress: { enabled, min, max },
      }));
    },
    []
  );

  const setIsFavorite = useCallback((isFavorite: boolean | null) => {
    setFilters((prev) => ({ ...prev, isFavorite }));
  }, []);

  const setHasRating = useCallback((hasRating: boolean | null) => {
    setFilters((prev) => ({ ...prev, hasRating }));
  }, []);

  const setHasNotes = useCallback((hasNotes: boolean | null) => {
    setFilters((prev) => ({ ...prev, hasNotes }));
  }, []);

  const setIsCompleted = useCallback((isCompleted: boolean | null) => {
    setFilters((prev) => ({ ...prev, isCompleted }));
  }, []);

  const setSorting = useCallback(
    (
      sortBy: BookFilters["sortBy"],
      sortOrder: BookFilters["sortOrder"] = "asc"
    ) => {
      setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    },
    []
  );

  const setShowOnlyRecent = useCallback(
    (showOnlyRecent: boolean, recentDays = 30) => {
      setFilters((prev) => ({ ...prev, showOnlyRecent, recentDays }));
    },
    []
  );

  // Bulk operations
  const updateFilters = useCallback((updates: Partial<BookFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const resetAdvancedFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      rating: defaultFilters.rating,
      dateRange: defaultFilters.dateRange,
      progress: defaultFilters.progress,
      isFavorite: defaultFilters.isFavorite,
      hasRating: defaultFilters.hasRating,
      hasNotes: defaultFilters.hasNotes,
      isCompleted: defaultFilters.isCompleted,
      showOnlyRecent: defaultFilters.showOnlyRecent,
    }));
  }, []);

  // Apply filters to book array
  const applyFilters = useCallback(
    (books: Book[]): Book[] => {
      let filtered = [...books];

      // Search term filter (using debounced value)
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        filtered = filtered.filter(
          (book) =>
            book.title.toLowerCase().includes(searchLower) ||
            book.author.toLowerCase().includes(searchLower) ||
            book.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      // Category filter
      if (filters.categories.length > 0) {
        filtered = filtered.filter((book) =>
          filters.categories.includes(book.category)
        );
      }

      // Status filter
      if (filters.statuses.length > 0) {
        filtered = filtered.filter((book) =>
          filters.statuses.includes(book.readingStatus)
        );
      }

      // Rating filter
      if (filters.rating.enabled) {
        filtered = filtered.filter((book) => {
          const rating = book.rating || 0;
          return rating >= filters.rating.min && rating <= filters.rating.max;
        });
      }

      // Date range filter
      if (
        filters.dateRange.enabled &&
        (filters.dateRange.start || filters.dateRange.end)
      ) {
        filtered = filtered.filter((book) => {
          if (!book.dateAdded) return false;
          const bookDate = new Date(book.dateAdded);

          if (filters.dateRange.start && bookDate < filters.dateRange.start)
            return false;
          if (filters.dateRange.end && bookDate > filters.dateRange.end)
            return false;

          return true;
        });
      }

      // Progress filter
      if (filters.progress.enabled) {
        filtered = filtered.filter((book) => {
          const progress = book.progress || 0;
          return (
            progress >= filters.progress.min && progress <= filters.progress.max
          );
        });
      }

      // Boolean filters
      if (filters.isFavorite !== null) {
        filtered = filtered.filter(
          (book) => book.isFavorite === filters.isFavorite
        );
      }

      if (filters.hasRating !== null) {
        filtered = filtered.filter((book) =>
          filters.hasRating ? !!book.rating : !book.rating
        );
      }

      if (filters.hasNotes !== null) {
        filtered = filtered.filter((book) =>
          filters.hasNotes
            ? !!(book.notes && book.notes.length > 0)
            : !(book.notes && book.notes.length > 0)
        );
      }

      if (filters.isCompleted !== null) {
        filtered = filtered.filter((book) =>
          filters.isCompleted
            ? book.readingStatus === "completed"
            : book.readingStatus !== "completed"
        );
      }

      // Recent filter
      if (filters.showOnlyRecent) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - filters.recentDays);

        filtered = filtered.filter(
          (book) => book.dateAdded && new Date(book.dateAdded) >= cutoffDate
        );
      }

      // Sort
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (filters.sortBy) {
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
          case "progress":
            comparison = (a.progress || 0) - (b.progress || 0);
            break;
          case "category":
            comparison = a.category.localeCompare(b.category);
            break;
          default:
            comparison = 0;
        }

        return filters.sortOrder === "asc" ? comparison : -comparison;
      });

      return filtered;
    },
    [filters, debouncedSearchTerm]
  );

  // Preset management
  const applyPreset = useCallback(
    (preset: FilterPreset) => {
      const presetFilters = filterPresets[preset];
      if (presetFilters) {
        updateFilters(presetFilters);
      }
    },
    [updateFilters]
  );

  const savePreset = useCallback(
    (name: string) => {
      if (persistFilters) {
        try {
          const presets = JSON.parse(
            localStorage.getItem(`${storageKey}_presets`) || "{}"
          );
          presets[name] = filters;
          localStorage.setItem(
            `${storageKey}_presets`,
            JSON.stringify(presets)
          );
        } catch (err) {
          console.warn("Failed to save preset:", err);
        }
      }
    },
    [filters, persistFilters, storageKey]
  );

  const loadPreset = useCallback(
    (name: string): boolean => {
      if (persistFilters) {
        try {
          const presets = JSON.parse(
            localStorage.getItem(`${storageKey}_presets`) || "{}"
          );
          if (presets[name]) {
            setFilters(presets[name]);
            return true;
          }
        } catch (err) {
          console.warn("Failed to load preset:", err);
        }
      }
      return false;
    },
    [persistFilters, storageKey]
  );

  const getAvailablePresets = useCallback((): string[] => {
    const builtInPresets = Object.keys(filterPresets).filter(
      (p) => p !== "custom"
    );

    if (persistFilters) {
      try {
        const customPresets = JSON.parse(
          localStorage.getItem(`${storageKey}_presets`) || "{}"
        );
        return [...builtInPresets, ...Object.keys(customPresets)];
      } catch (err) {
        console.warn("Failed to load custom presets:", err);
      }
    }

    return builtInPresets;
  }, [persistFilters, storageKey]);

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.statuses.length > 0 ||
      filters.searchTerm.length > 0 ||
      filters.rating.enabled ||
      filters.dateRange.enabled ||
      filters.progress.enabled ||
      filters.isFavorite !== null ||
      filters.hasRating !== null ||
      filters.hasNotes !== null ||
      filters.isCompleted !== null ||
      filters.showOnlyRecent
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.categories.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.searchTerm.length > 0) count++;
    if (filters.rating.enabled) count++;
    if (filters.dateRange.enabled) count++;
    if (filters.progress.enabled) count++;
    if (filters.isFavorite !== null) count++;
    if (filters.hasRating !== null) count++;
    if (filters.hasNotes !== null) count++;
    if (filters.isCompleted !== null) count++;
    if (filters.showOnlyRecent) count++;

    return count;
  }, [filters]);

  return {
    // Current filters
    filters,

    // Filter setters
    setCategories,
    setStatuses,
    setSearchTerm,
    setRatingFilter,
    setDateRangeFilter,
    setProgressFilter,
    setIsFavorite,
    setHasRating,
    setHasNotes,
    setIsCompleted,
    setSorting,
    setShowOnlyRecent,

    // Bulk operations
    updateFilters,
    resetFilters,
    resetAdvancedFilters,

    // Filter application
    applyFilters,

    // Filter state
    hasActiveFilters,
    activeFilterCount,
    debouncedSearchTerm,

    // Presets
    applyPreset,
    savePreset,
    loadPreset,
    getAvailablePresets,
  };
};
