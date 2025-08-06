// ============================================================================
// DASHBOARD GLASS HEAVY - INTENSE GLASSMORPHISM MAIN DASHBOARD COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/Dashboard.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import StatCardGlassHeavy from "./StatCard";
import BookGridGlassHeavy from "./BookGrid";
import FilterBarGlassHeavy from "./FilterBar";
import GlassContainer from "./effects/GlassContainer";
import GlassShimmer from "./effects/GlassShimmer";
import Condensation from "./effects/Condensation";
import type { Book, BookCategory, ReadingStatus } from "@/types";

// ============================================================================
// DASHBOARD PROPS INTERFACE (SAME AS SOFTCLUB)
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
// GLASS WELCOME HEADER COMPONENT
// ============================================================================

const GlassWelcomeHeader: React.FC<{
  userName?: string;
  intensity: string;
}> = ({ userName = "Reader", intensity }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

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
    <GlassContainer
      variant="panel"
      intensity={intensity as any}
      className="p-8 mb-8 relative"
      onHover={setIsHovered}
      effects={{
        layers: true,
        condensation: true,
        refraction: true,
        shimmer: isHovered,
        ripple: false,
        depth: true,
      }}
    >
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -30, filter: "blur(20px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex-1">
          <motion.h1
            className="text-5xl font-bold text-white mb-3 tracking-tight"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {getGreeting()}, {userName}!
          </motion.h1>

          <motion.p
            className="text-white/80 font-medium text-xl backdrop-blur-sm bg-white/10 inline-block px-4 py-2 rounded-lg border border-white/20"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {getDateString()}
          </motion.p>
        </div>

        {/* Glass decorative book icon */}
        <motion.div
          className="hidden md:block relative"
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <GlassContainer
            variant="custom"
            intensity="heavy"
            className="w-24 h-24 flex items-center justify-center"
            effects={{
              layers: false,
              condensation: isHovered,
              refraction: true,
              shimmer: true,
              ripple: false,
              depth: false,
            }}
          >
            <motion.svg
              className="w-12 h-12 text-white/90"
              fill="currentColor"
              viewBox="0 0 20 20"
              animate={{
                rotateY: isHovered ? 15 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </motion.svg>
          </GlassContainer>
        </motion.div>
      </motion.div>

      {/* Glass particles floating effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-inherit">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full backdrop-blur-sm"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.4, 0.8],
              filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </GlassContainer>
  );
};

// ============================================================================
// GLASS QUICK ACTIONS COMPONENT
// ============================================================================

const GlassQuickActions: React.FC<{
  onAddBook?: () => void;
  intensity: string;
}> = ({ onAddBook, intensity }) => {
  const actions = [
    {
      label: "Add Book",
      icon: "📚",
      gradient: "from-cyan-400/30 to-blue-400/30",
      onClick: onAddBook,
    },
    {
      label: "Reading Goals",
      icon: "🎯",
      gradient: "from-purple-400/30 to-pink-400/30",
      onClick: () => console.log("Goals clicked"),
    },
    {
      label: "Statistics",
      icon: "📊",
      gradient: "from-emerald-400/30 to-teal-400/30",
      onClick: () => console.log("Stats clicked"),
    },
    {
      label: "Import Books",
      icon: "📥",
      gradient: "from-orange-400/30 to-red-400/30",
      onClick: () => console.log("Import clicked"),
    },
  ];

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.7, duration: 0.8 }}
    >
      <motion.h2
        className="text-3xl font-bold text-white mb-6 tracking-tight"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        Quick Actions
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {actions.map((action, index) => {
          const [isHovered, setIsHovered] = useState(false);

          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(15px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
            >
              <GlassContainer
                variant="button"
                intensity={intensity as any}
                interactive
                onClick={action.onClick}
                onHover={setIsHovered}
                className={`p-6 text-center cursor-pointer bg-gradient-to-br ${action.gradient}`}
                effects={{
                  layers: true,
                  condensation: false,
                  refraction: true,
                  shimmer: isHovered,
                  ripple: true,
                  depth: false,
                }}
              >
                <motion.div
                  className="text-4xl mb-3"
                  animate={{
                    scale: isHovered ? 1.2 : 1,
                    rotateY: isHovered ? 10 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {action.icon}
                </motion.div>

                <motion.div
                  className="text-white/90 font-semibold text-sm"
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
      </div>
    </motion.div>
  );
};

// ============================================================================
// STATS CALCULATION (SAME AS SOFTCLUB)
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
// MAIN GLASS DASHBOARD COMPONENT
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

  // Apply filters (same logic as Softclub)
  useEffect(() => {
    let filtered = [...books];

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
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      );
    }

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
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 ${className}`}
      initial={{ opacity: 0, filter: "blur(30px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.2 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Glass Welcome Header */}
        <GlassWelcomeHeader userName="Book Lover" intensity={glassIntensity} />

        {/* Glass Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <StatCardGlassHeavy
            label="Total Books"
            value={stats.total}
            gradient="cyan"
            trend="up"
            trendValue={12}
            glassIntensity={glassIntensity}
            shimmer
            condensation
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            }
          />

          <StatCardGlassHeavy
            label="Completed"
            value={stats.completed}
            gradient="mint"
            trend="up"
            trendValue={8}
            glassIntensity={glassIntensity}
            shimmer
            condensation
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

          <StatCardGlassHeavy
            label="Currently Reading"
            value={stats.reading}
            gradient="peach"
            trend="stable"
            glassIntensity={glassIntensity}
            shimmer
            condensation
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

          <StatCardGlassHeavy
            label="Completion Rate"
            value={stats.completionRate}
            suffix="%"
            gradient="lavender"
            trend={stats.completionRate > 50 ? "up" : "down"}
            trendValue={5}
            glassIntensity={glassIntensity}
            shimmer
            condensation
            particleEffect
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

        {/* Glass Quick Actions */}
        <GlassQuickActions onAddBook={onAddBook} intensity={glassIntensity} />

        {/* Glass Filter Bar */}
        <FilterBarGlassHeavy
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

        {/* Glass Book Grid */}
        <BookGridGlassHeavy
          books={filteredBooks}
          isLoading={isLoading}
          onBookClick={onBookClick}
          onBookUpdate={onBookUpdate}
          onBookDelete={onBookDelete}
          gridCols={4}
          gap="md"
          glassIntensity={glassIntensity}
          showHeader={false}
        />
      </div>

      {/* Ambient background glass effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 backdrop-blur-3xl bg-white/2 rounded-full"
            style={{
              left: `${Math.random() * 120 - 10}%`,
              top: `${Math.random() * 120 - 10}%`,
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.02, 0.08, 0.02],
              filter: ["blur(60px)", "blur(40px)", "blur(60px)"],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardGlassHeavy;
