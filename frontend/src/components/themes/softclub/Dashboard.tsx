import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import { useAdaptiveComponents } from "@/hooks/useAdaptiveComponents";
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
  className?: string;
}

// ============================================================================
// TYPES
// ============================================================================

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
// STATS CALCULATION HELPERS
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
// WELCOME HEADER COMPONENT (CORREGIDO)
// ============================================================================

const WelcomeHeader: React.FC<{ userName?: string }> = ({
  userName = "Reader",
}) => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-mint-dream via-lavender-mist/30 to-soft-cyan/20 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-soft-cyan/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-lavender-mist/30 rounded-full blur-2xl" />

      <div className="relative z-10">
        <motion.h1
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {greeting()}, {userName}! 🌟
        </motion.h1>
        <motion.p
          className="text-purple-600/80 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Ready to dive into your digital library?
        </motion.p>
      </div>
    </motion.div>
  );
};

// ============================================================================
// QUICK ACTIONS COMPONENT (CORREGIDO)
// ============================================================================

const QuickActionsSoftclub: React.FC<{
  onAddBook?: () => void;
}> = ({ onAddBook }) => {
  const actions = [
    {
      icon: "📚",
      label: "Add Book",
      onClick: onAddBook,
      gradient: "from-mint-dream to-soft-cyan",
    },
    {
      icon: "🔍",
      label: "Search",
      onClick: () => console.log("Search clicked"),
      gradient: "from-lavender-mist to-purple-400",
    },
    {
      icon: "📊",
      label: "Statistics",
      onClick: () => console.log("Stats clicked"),
      gradient: "from-sunset-coral to-pink-400",
    },
    {
      icon: "⚙️",
      label: "Settings",
      onClick: () => console.log("Settings clicked"),
      gradient: "from-soft-cyan to-mint-dream",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md`}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
        >
          <div className="text-center">
            <motion.div
              className="text-3xl mb-3"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {action.icon}
            </motion.div>
            <div className="text-white font-semibold text-sm">
              {action.label}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT (CORREGIDO CON ADAPTIVE COMPONENTS)
// ============================================================================

const DashboardSoftclub: React.FC<DashboardProps> = ({
  books,
  isLoading = false,
  onBookClick,
  onBookUpdate,
  onBookDelete,
  onAddBook,
  className = "",
}) => {
  const theme = useTheme();

  // 🔧 USAR COMPONENTES ADAPTATIVOS EN LUGAR DE ESPECÍFICOS
  const { StatCard, BookGrid, FilterBar } = useAdaptiveComponents();

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

  const handleSortChange = (sortBy: SortByOption) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
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

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-gray-100/30 to-lavender-mist/10 p-6 ${className}`}
      >
        <div className="flex items-center justify-center h-64">
          <motion.div
            className="w-12 h-12 border-4 border-soft-cyan/30 border-t-mint-dream rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-gray-100/30 to-lavender-mist/10 p-6 ${className}`}
    >
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* Quick Actions */}
      <QuickActionsSoftclub onAddBook={onAddBook} />

      {/* Stats Cards - USANDO COMPONENTES ADAPTATIVOS */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <StatCard
          label="Total Books"
          value={stats.total}
          gradient="from-cyan-400 to-blue-500"
          trend="stable"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          gradient="from-green-400 to-emerald-500"
          trend="up"
        />
        <StatCard
          label="Currently Reading"
          value={stats.reading}
          gradient="from-orange-400 to-red-500"
          trend="stable"
        />
        <StatCard
          label="Completion Rate"
          value={stats.completionRate}
          gradient="from-purple-400 to-pink-500"
          trend="up"
        />
      </motion.div>

      {/* Filter Bar - USANDO COMPONENTES ADAPTATIVOS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <FilterBar
          categories={[
            "Fiction",
            "Non-Fiction",
            "Science Fiction",
            "Fantasy",
            "Mystery",
          ]}
          filters={filters}
          onFiltersChange={handleFilterChange}
          totalResults={filteredBooks.length}
        />
      </motion.div>

      {/* Books Grid - USANDO COMPONENTES ADAPTATIVOS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <BookGrid
          books={filteredBooks}
          onBookSelect={handleBookClick}
          loading={isLoading}
        />
      </motion.div>

      {/* Selected Book Modal */}
      {selectedBook && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedBook(null)}
        >
          <motion.div
            className="bg-gradient-to-br from-mint-dream/90 to-lavender-mist/90 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-blue-600 mb-2">
              {selectedBook.title}
            </h3>
            <p className="text-purple-600/80 mb-4">{selectedBook.author}</p>
            <button
              onClick={() => setSelectedBook(null)}
              className="px-4 py-2 bg-soft-cyan/80 text-white rounded-lg hover:bg-soft-cyan transition-colors font-semibold"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardSoftclub;
