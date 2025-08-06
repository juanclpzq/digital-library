// ============================================================================
// BOOK GRID SOFTCLUB - GEN X NOSTALGIC BOOK GRID COMPONENT
// FILE LOCATION: src/components/themes/softclub/BookGrid.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import BookCardSoftclub from "./BookCard";
import type { Book } from "@/types";

// ============================================================================
// BOOK GRID PROPS INTERFACE
// ============================================================================

export interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
  onBookClick?: (book: Book) => void;
  onBookUpdate?: (book: Book) => void;
  onBookDelete?: (bookId: string) => void;
  gridCols?: 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
  showHeader?: boolean;
  headerTitle?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
}

// ============================================================================
// GRID CONFIGURATION
// ============================================================================

const gridConfigs = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6",
};

const gapConfigs = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

// ============================================================================
// LOADING SKELETON COMPONENT
// ============================================================================

const BookGridSkeleton: React.FC<{
  count: number;
  gridCols: number;
  gap: string;
}> = ({ count, gridCols, gap }) => {
  return (
    <div
      className={`grid ${gridConfigs[gridCols as keyof typeof gridConfigs]} ${gapConfigs[gap as keyof typeof gapConfigs]}`}
    >
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-br from-cloud-white/60 to-silver-matte/40 rounded-3xl p-6 border border-white/40 shadow-soft"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: index * 0.1,
            duration: 0.6,
            ease: [0.25, 0.25, 0, 1],
          }}
        >
          <div className="animate-pulse space-y-4">
            {/* Book cover skeleton */}
            <motion.div
              className="aspect-[3/4] bg-gradient-to-br from-soft-cyan/30 to-lavender-mist/30 rounded-2xl"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
            />

            {/* Title skeleton */}
            <motion.div
              className="h-4 bg-gradient-to-r from-lavender-mist/40 to-peachy-keen/40 rounded-xl"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            />

            {/* Author skeleton */}
            <motion.div
              className="h-3 w-3/4 bg-gradient-to-r from-mint-dream/30 to-soft-cyan/30 rounded-lg"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.4 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

const EmptyState: React.FC<{
  message: string;
  icon?: React.ReactNode;
}> = ({ message, icon }) => {
  const defaultIcon = (
    <motion.svg
      className="w-16 h-16 text-midnight-navy/40 mx-auto mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </motion.svg>
  );

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gradient-to-br from-cloud-white/40 to-silver-matte/20 rounded-3xl border border-white/30 shadow-gentle"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
    >
      {icon || defaultIcon}

      <motion.p
        className="text-midnight-navy/70 font-medium text-lg max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {message}
      </motion.p>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-soft-cyan/20 rounded-full"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
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
// MAIN BOOK GRID COMPONENT
// ============================================================================

const BookGridSoftclub: React.FC<BookGridProps> = ({
  books,
  isLoading = false,
  onBookClick,
  onBookUpdate,
  onBookDelete,
  gridCols = 4,
  gap = "md",
  showHeader = true,
  headerTitle = "Your Library",
  emptyMessage = "No books found. Start building your library!",
  emptyIcon,
  className = "",
}) => {
  const theme = useTheme();
  const [visibleBooks, setVisibleBooks] = useState<Book[]>([]);

  // Staggered loading animation
  useEffect(() => {
    if (!isLoading && books.length > 0) {
      setVisibleBooks([]);
      books.forEach((book, index) => {
        setTimeout(() => {
          setVisibleBooks((prev) => [...prev, book]);
        }, index * 50);
      });
    }
  }, [books, isLoading]);

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for book cards
  const bookVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      rotate: -2,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className={`w-full ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      {showHeader && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
        >
          <h2 className="text-3xl font-bold text-midnight-navy mb-2 tracking-tight">
            {headerTitle}
          </h2>
          <div className="flex items-center gap-4">
            <motion.div
              className="h-1 bg-gradient-to-r from-soft-cyan via-lavender-mist to-peachy-keen rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            <span className="text-midnight-navy/60 font-medium">
              {books.length} {books.length === 1 ? "book" : "books"}
            </span>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <BookGridSkeleton count={gridCols * 2} gridCols={gridCols} gap={gap} />
      )}

      {/* Empty State */}
      {!isLoading && books.length === 0 && (
        <EmptyState message={emptyMessage} icon={emptyIcon} />
      )}

      {/* Books Grid */}
      {!isLoading && books.length > 0 && (
        <motion.div
          className={`grid ${gridConfigs[gridCols]} ${gapConfigs[gap]}`}
          layout
        >
          <AnimatePresence mode="popLayout">
            {visibleBooks.map((book, index) => (
              <motion.div
                key={book._id}
                variants={bookVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <BookCardSoftclub
                  book={book}
                  onClick={() => onBookClick?.(book)}
                  onStatusChange={(status) =>
                    onBookUpdate?.({ ...book, readingStatus: status })
                  }
                  onDelete={() => onBookDelete?.(book._id)}
                  className="h-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Gentle background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-gradient-radial from-soft-cyan/5 to-transparent rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BookGridSoftclub;
