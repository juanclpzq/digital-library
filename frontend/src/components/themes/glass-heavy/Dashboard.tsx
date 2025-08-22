import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import StatCardGlassHeavy from "./StatCard";
import BookGridGlassHeavy from "./BookGrid";
import FilterBarGlassHeavy from "./FilterBar";
import GlassContainer from "./effects/GlassContainer";
import type { Book, BookCategory, ReadingStatus } from "@/types";

// ============================================================================
// DASHBOARD PROPS INTERFACE
// ============================================================================

export interface DashboardProps {
  books: Book[];
  isLoading?: boolean;
  onBookClick?: (book: Book) => void;
  onBookUpdate?: (book: Book) => void;
  onBookDelete?: (bookId: string) => void;
  onAddBook?: () => void;
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ALL_CATEGORIES: BookCategory[] = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "History",
  "Science",
  "Philosophy",
  "Biography",
  "Technology",
  "Art",
  "Self-Help",
  "Business",
  "Other",
];

const ALL_STATUSES: ReadingStatus[] = [
  "want-to-read",
  "reading",
  "completed",
  "paused",
  "abandoned",
  "reference",
];

type SortByOption = "title" | "author" | "rating" | "dateAdded";
type SortOrderOption = "asc" | "desc";

interface FilterState {
  categories: BookCategory[];
  statuses: ReadingStatus[];
  searchTerm: string;
  sortBy: SortByOption;
  sortOrder: SortOrderOption;
}

// ============================================================================
// GLASS WELCOME HEADER COMPONENT
// ============================================================================

const GlassWelcomeHeader: React.FC<{
  userName?: string;
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
}> = ({ userName = "Reader", glassIntensity = "medium" }) => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <GlassContainer
      intensity={glassIntensity}
      className="relative p-8 mb-8 overflow-hidden"
    >
      <div className="relative z-10">
        <motion.h1
          className="text-4xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {greeting()}, {userName}
        </motion.h1>
        <motion.p
          className="text-white/70 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Your digital library awaits
        </motion.p>
      </div>

      {/* Glass effect decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
    </GlassContainer>
  );
};

// ============================================================================
// QUICK ACTIONS COMPONENT
// ============================================================================

const QuickActionsGlass: React.FC<{
  onAddBook?: () => void;
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
}> = ({ onAddBook, glassIntensity = "medium" }) => {
  // ✅ Estado movido fuera del map
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const actions = [
    {
      icon: "📚",
      label: "Add Book",
      onClick: onAddBook,
      color: "from-blue-500/20 to-purple-500/20",
    },
    {
      icon: "🔍",
      label: "Search",
      onClick: () => console.log("Search clicked"),
      color: "from-green-500/20 to-blue-500/20",
    },
    {
      icon: "📊",
      label: "Statistics",
      onClick: () => console.log("Stats clicked"),
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: "⚙️",
      label: "Settings",
      onClick: () => console.log("Settings clicked"),
      color: "from-orange-500/20 to-red-500/20",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {actions.map((action, index) => {
        const isHovered = hoveredIndex === index;

        return (
          <motion.div
            key={action.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <GlassContainer
              intensity={glassIntensity}
              className={`p-6 cursor-pointer transition-all duration-300 bg-gradient-to-br ${action.color} hover:bg-white/20`}
              onClick={action.onClick}
            >
              <motion.div
                className="text-2xl mb-2 flex justify-center"
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  rotateY: isHovered ? 10 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {action.icon}
              </motion.div>

              <motion.div
                className="text-white/90 font-semibold text-sm text-center"
                animate={{
                  y: isHovered ? -2 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {action.label}
              </motion.div>
            </GlassContainer>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ============================================================================
// STATS CALCULATION
// ============================================================================

const calculateStats = (books: Book[]) => {
  const total = books.length;
  const completed = books.filter((b) => b.readingStatus === "completed").length;
  const reading = books.filter((b) => b.readingStatus === "reading").length;
  const wantToRead = books.filter(
    (b) => b.readingStatus === "want-to-read"
  ).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const avgRating =
    books.length > 0
      ? books
          .filter((b) => b.rating)
          .reduce((sum, b) => sum + (b.rating || 0), 0) /
        books.filter((b) => b.rating).length
      : 0;

  return {
    total,
    completed,
    reading,
    wantToRead,
    completionRate,
    avgRating: Math.round(avgRating * 10) / 10,
  };
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

const DashboardGlassHeavy: React.FC<DashboardProps> = ({
  books,
  isLoading = false,
  onBookClick,
  onBookUpdate,
  onBookDelete,
  onAddBook,
  glassIntensity = "medium",
  className = "",
}) => {
  const _theme = useTheme(); // Prefijo para indicar uso futuro

  // ============================================================================
  // STATE
  // ============================================================================

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    statuses: [],
    searchTerm: "",
    sortBy: "title",
    sortOrder: "asc",
  });

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const stats = calculateStats(books);

  // Get available categories and statuses from actual books
  const availableCategories = React.useMemo(() => {
    const categoriesInBooks = Array.from(
      new Set(books.map((book) => book.category))
    );
    return ALL_CATEGORIES.filter((cat) => categoriesInBooks.includes(cat));
  }, [books]);

  const availableStatuses = React.useMemo(() => {
    const statusesInBooks = Array.from(
      new Set(books.map((book) => book.readingStatus))
    );
    return ALL_STATUSES.filter((status) => statusesInBooks.includes(status));
  }, [books]);

  const filteredBooks = React.useMemo(() => {
    let filtered = books;

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((book) =>
        filters.categories.includes(book.category)
      );
    }

    if (filters.statuses.length > 0) {
      filtered = filtered.filter((book) =>
        filters.statuses.includes(book.readingStatus)
      );
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "author":
          comparison = a.author.localeCompare(b.author);
          break;
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case "dateAdded":
          comparison =
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime();
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [books, filters]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as SortByOption,
    }));
  };

  const handleSortOrderToggle = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    onBookClick?.(book);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      statuses: [],
      searchTerm: "",
      sortBy: "title",
      sortOrder: "asc",
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className={`min-h-screen p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <motion.div
            className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${className}`}>
      {/* Welcome Header */}
      <GlassWelcomeHeader glassIntensity={glassIntensity} />

      {/* Quick Actions */}
      <QuickActionsGlass
        onAddBook={onAddBook}
        glassIntensity={glassIntensity}
      />

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <StatCardGlassHeavy
          label="Total Books"
          value={stats.total}
          gradient="cyan"
          trend="stable"
          glassIntensity={glassIntensity}
        />
        <StatCardGlassHeavy
          label="Completed"
          value={stats.completed}
          gradient="mint"
          trend="up"
          glassIntensity={glassIntensity}
        />
        <StatCardGlassHeavy
          label="Currently Reading"
          value={stats.reading}
          gradient="coral"
          trend="stable"
          glassIntensity={glassIntensity}
        />
        <StatCardGlassHeavy
          label="Completion Rate"
          value={stats.completionRate}
          suffix="%"
          gradient="lavender"
          trend="up"
          glassIntensity={glassIntensity}
        />
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <FilterBarGlassHeavy
          categories={availableCategories}
          selectedCategories={filters.categories}
          onCategoriesChange={(categories) =>
            handleFilterChange({ categories })
          }
          statuses={availableStatuses}
          selectedStatuses={filters.statuses}
          onStatusesChange={(statuses) => handleFilterChange({ statuses })}
          searchTerm={filters.searchTerm}
          onSearchChange={(searchTerm) => handleFilterChange({ searchTerm })}
          sortBy={filters.sortBy}
          onSortChange={handleSortChange}
          sortOrder={filters.sortOrder}
          onSortOrderChange={handleSortOrderToggle}
          totalResults={filteredBooks.length}
          onClearFilters={handleClearFilters}
        />
      </motion.div>

      {/* Books Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <BookGridGlassHeavy
          books={filteredBooks}
          onBookClick={handleBookClick}
          onBookUpdate={onBookUpdate}
          onBookDelete={onBookDelete}
          isLoading={isLoading}
          glassIntensity={glassIntensity}
        />
      </motion.div>

      {/* Selected Book Modal/Panel - TODO: Implement */}
      {selectedBook && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedBook(null)}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedBook.title}
            </h3>
            <p className="text-white/70 mb-4">{selectedBook.author}</p>
            <button
              onClick={() => setSelectedBook(null)}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardGlassHeavy;
