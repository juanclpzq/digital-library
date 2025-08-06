// ============================================================================
// DASHBOARD SOFTCLUB - GEN X NOSTALGIC MAIN DASHBOARD COMPONENT
// FILE LOCATION: src/components/themes/softclub/Dashboard.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import StatCardSoftclub from "./StatCard";
import BookGridSoftclub from "./BookGrid";
import FilterBarSoftclub from "./FilterBar";
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
// WELCOME HEADER COMPONENT
// ============================================================================

const WelcomeHeader: React.FC<{ userName?: string }> = ({
  userName = "Reader",
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getDateString = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-cloud-white/90 via-soft-cyan/20 to-lavender-mist/30 backdrop-blur-sm border border-white/50 rounded-3xl p-8 mb-8 shadow-soft"
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            className="text-4xl font-bold text-midnight-navy mb-2 tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {getGreeting()}, {userName}!
          </motion.h1>

          <motion.p
            className="text-midnight-navy/70 font-medium text-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {getDateString()}
          </motion.p>
        </div>

        {/* Decorative book icon */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-peachy-keen to-sunset-coral rounded-2xl shadow-gentle flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-mint-dream/30 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// QUICK ACTIONS COMPONENT
// ============================================================================

const QuickActions: React.FC<{ onAddBook?: () => void }> = ({ onAddBook }) => {
  const actions = [
    {
      label: "Add Book",
      icon: "📚",
      gradient: "from-mint-dream to-soft-cyan",
      onClick: onAddBook,
    },
    {
      label: "Reading Goals",
      icon: "🎯",
      gradient: "from-lavender-mist to-peachy-keen",
      onClick: () => console.log("Goals clicked"),
    },
    {
      label: "Statistics",
      icon: "📊",
      gradient: "from-peachy-keen to-sunset-coral",
      onClick: () => console.log("Stats clicked"),
    },
    {
      label: "Import Books",
      icon: "📥",
      gradient: "from-soft-cyan to-lavender-mist",
      onClick: () => console.log("Import clicked"),
    },
  ];

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-midnight-navy mb-4 tracking-tight">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            className={`
              relative overflow-hidden bg-gradient-to-r ${action.gradient} 
              text-white font-semibold p-6 rounded-2xl shadow-gentle 
              hover:shadow-soft transition-all duration-300 group
            `}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="text-sm font-medium">{action.label}</div>

            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.02 }}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
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
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [filters, setFilters] = useState({
    categories: [] as BookCategory[],
    statuses: [] as ReadingStatus[],
    searchTerm: "",
    sortBy: "title" as const,
    sortOrder: "asc" as const,
  });

  const stats = calculateStats(books);
  const allCategories = Array.from(new Set(books.map((b) => b.category)));
  const allStatuses: ReadingStatus[] = [
    "want-to-read",
    "reading",
    "completed",
    "paused",
    "abandoned",
  ];

  // Apply filters
  useEffect(() => {
    let filtered = [...books];

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

    // Search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
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
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        default:
          comparison = 0;
      }
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredBooks(filtered);
  }, [books, filters]);

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br from-cloud-white via-silver-matte/30 to-lavender-mist/10 p-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <WelcomeHeader userName="Book Lover" />

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <StatCardSoftclub
            label="Total Books"
            value={stats.total}
            gradient="cyan"
            trend="up"
            trendValue={12}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            }
          />

          <StatCardSoftclub
            label="Completed"
            value={stats.completed}
            gradient="mint"
            trend="up"
            trendValue={8}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />

          <StatCardSoftclub
            label="Currently Reading"
            value={stats.reading}
            gradient="peach"
            trend="stable"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />

          <StatCardSoftclub
            label="Completion Rate"
            value={stats.completionRate}
            suffix="%"
            gradient="lavender"
            trend={stats.completionRate > 50 ? "up" : "down"}
            trendValue={5}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </motion.div>

        {/* Quick Actions */}
        <QuickActions onAddBook={onAddBook} />

        {/* Filter Bar */}
        <FilterBarSoftclub
          categories={allCategories}
          selectedCategories={filters.categories}
          onCategoriesChange={(categories) =>
            setFilters((prev) => ({ ...prev, categories }))
          }
          statuses={allStatuses}
          selectedStatuses={filters.statuses}
          onStatusesChange={(statuses) =>
            setFilters((prev) => ({ ...prev, statuses }))
          }
          searchTerm={filters.searchTerm}
          onSearchChange={(searchTerm) =>
            setFilters((prev) => ({ ...prev, searchTerm }))
          }
          sortBy={filters.sortBy}
          onSortChange={(sortBy) => setFilters((prev) => ({ ...prev, sortBy }))}
          sortOrder={filters.sortOrder}
          onSortOrderChange={(sortOrder) =>
            setFilters((prev) => ({ ...prev, sortOrder }))
          }
          totalResults={filteredBooks.length}
          isLoading={isLoading}
          onClearFilters={() =>
            setFilters({
              categories: [],
              statuses: [],
              searchTerm: "",
              sortBy: "title",
              sortOrder: "asc",
            })
          }
        />

        {/* Book Grid */}
        <BookGridSoftclub
          books={filteredBooks}
          isLoading={isLoading}
          onBookClick={onBookClick}
          onBookUpdate={onBookUpdate}
          onBookDelete={onBookDelete}
          gridCols={4}
          gap="md"
          showHeader={false}
        />
      </div>
    </motion.div>
  );
};

export default DashboardSoftclub;
