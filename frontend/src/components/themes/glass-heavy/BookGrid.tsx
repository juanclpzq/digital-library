// ============================================================================
// BOOK GRID GLASS HEAVY - INTENSE GLASSMORPHISM BOOK GRID COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/BookGrid.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import BookCardGlassHeavy from "./BookCard";
import GlassContainer from "./effects/GlassContainer";
import GlassShimmer from "./effects/GlassShimmer";
import Condensation from "./effects/Condensation";
import type { Book } from "@/types";

// ============================================================================
// BOOK GRID PROPS INTERFACE (SAME AS SOFTCLUB)
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
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  className?: string;
}

// ============================================================================
// GRID CONFIGURATION (SAME AS SOFTCLUB)
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
// GLASS LOADING SKELETON COMPONENT
// ============================================================================

const GlassBookGridSkeleton: React.FC<{
  count: number;
  gridCols: number;
  gap: string;
  intensity: string;
}> = ({ count, gridCols, gap, intensity }) => {
  return (
    <div
      className={`grid ${gridConfigs[gridCols as keyof typeof gridConfigs]} ${gapConfigs[gap as keyof typeof gapConfigs]}`}
    >
      {[...Array(count)].map((_, index) => (
        <GlassContainer
          key={index}
          variant="card"
          intensity={intensity as any}
          className="p-6"
          effects={{
            layers: true,
            shimmer: true,
            condensation: false,
            refraction: false,
            ripple: false,
            depth: false,
          }}
        >
          <motion.div
            className="animate-pulse space-y-4"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              delay: index * 0.1,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Glass book cover skeleton */}
            <motion.div
              className="aspect-[3/4] backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
            />

            {/* Glass title skeleton */}
            <motion.div
              className="h-4 backdrop-blur-sm bg-white/15 rounded-xl border border-white/20"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
            />

            {/* Glass author skeleton */}
            <motion.div
              className="h-3 w-3/4 backdrop-blur-sm bg-white/10 rounded-lg border border-white/15"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.01, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
            />
          </motion.div>
        </GlassContainer>
      ))}
    </div>
  );
};

// ============================================================================
// GLASS EMPTY STATE COMPONENT
// ============================================================================

const GlassEmptyState: React.FC<{
  message: string;
  icon?: React.ReactNode;
  intensity: string;
}> = ({ message, icon, intensity }) => {
  const [isHovered, setIsHovered] = useState(false);

  const defaultIcon = (
    <motion.svg
      className="w-20 h-20 text-white/60 mx-auto mb-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
    <GlassContainer
      variant="panel"
      intensity={intensity as any}
      className="py-20 px-8 text-center"
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
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {icon || defaultIcon}

        <motion.p
          className="text-white/80 font-medium text-xl max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {message}
        </motion.p>

        {/* Floating glass particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full backdrop-blur-sm"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.5, 0.5],
                filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
              }}
              transition={{
                duration: 6 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </GlassContainer>
  );
};

// ============================================================================
// MAIN GLASS BOOK GRID COMPONENT
// ============================================================================

const BookGridGlassHeavy: React.FC<BookGridProps> = ({
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
  glassIntensity = "medium",
  className = "",
}) => {
  const theme = useTheme();
  const [visibleBooks, setVisibleBooks] = useState<Book[]>([]);
  const [headerHovered, setHeaderHovered] = useState(false);

  // Staggered loading animation with glass blur effects
  useEffect(() => {
    if (!isLoading && books.length > 0) {
      setVisibleBooks([]);
      books.forEach((book, index) => {
        setTimeout(() => {
          setVisibleBooks((prev) => [...prev, book]);
        }, index * 80); // Slightly slower for glass effect
      });
    }
  }, [books, isLoading]);

  // Glass animation variants
  const containerVariants = {
    hidden: { opacity: 0, filter: "blur(20px)" },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const bookVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      filter: "blur(20px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      filter: "blur(10px)",
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className={`w-full ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Glass Header */}
      {showHeader && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -30, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onHoverStart={() => setHeaderHovered(true)}
          onHoverEnd={() => setHeaderHovered(false)}
        >
          <GlassContainer
            variant="custom"
            intensity={glassIntensity}
            className="p-6 relative"
            effects={{
              layers: false,
              condensation: headerHovered,
              refraction: true,
              shimmer: headerHovered,
              ripple: false,
              depth: false,
            }}
          >
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
              {headerTitle}
            </h2>

            <div className="flex items-center gap-6">
              <motion.div
                className="h-1.5 bg-gradient-to-r from-cyan-400/60 via-blue-400/60 to-purple-400/60 rounded-full backdrop-blur-sm"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "140px", opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />

              <motion.span
                className="text-white/80 font-medium backdrop-blur-sm bg-white/10 px-4 py-2 rounded-lg border border-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {books.length} {books.length === 1 ? "book" : "books"}
              </motion.span>
            </div>
          </GlassContainer>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <GlassBookGridSkeleton
          count={gridCols * 2}
          gridCols={gridCols}
          gap={gap}
          intensity={glassIntensity}
        />
      )}

      {/* Empty State */}
      {!isLoading && books.length === 0 && (
        <GlassEmptyState
          message={emptyMessage}
          icon={emptyIcon}
          intensity={glassIntensity}
        />
      )}

      {/* Glass Books Grid */}
      {!isLoading && books.length > 0 && (
        <motion.div
          className={`grid ${gridConfigs[gridCols]} ${gapConfigs[gap]}`}
          layout
        >
          <AnimatePresence mode="popLayout">
            {visibleBooks.map((book, index) => (
              <motion.div
                key={`glass-book-${book._id}-${index}`} // ✅ Key único con prefix glass
                variants={bookVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                whileHover={{
                  y: -12,
                  scale: 1.03,
                  filter: "blur(0px) brightness(1.1)",
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
              >
                <BookCardGlassHeavy
                  book={book}
                  onClick={() => onBookClick?.(book)}
                  onStatusChange={(status) =>
                    onBookUpdate?.({ ...book, readingStatus: status })
                  }
                  onDelete={() => onBookDelete?.(book._id)}
                  glassIntensity={glassIntensity}
                  className="h-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Ambient glass background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-40 h-40 backdrop-blur-3xl bg-white/3 rounded-full border border-white/5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.15, 0.05],
              filter: ["blur(40px)", "blur(20px)", "blur(40px)"],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BookGridGlassHeavy;
