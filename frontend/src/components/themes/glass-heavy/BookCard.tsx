import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import type { BookCardProps } from "@/types";

// ============================================================================
// BOOKCARD GLASS HEAVY VARIANT - INTENSE GLASSMORPHISM
// ============================================================================

const BookCardGlassHeavy: React.FC<BookCardProps> = ({
  book,
  onStatusChange,
  onOpenBook,
  onToggleFavorite,
  showNotes = true,
  className = "",
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showCondensation, setShowCondensation] = useState(false);

  // ============================================================================
  // DYNAMIC GLASS STYLING
  // ============================================================================

  const categoryGlassTint = theme.glassHeavy.utils.getCategoryGlassTint(
    book.category
  );
  const statusGlassStyle = theme.glassHeavy.utils.getStatusGlassStyle(
    book.readingStatus
  );
  const glassLevel = theme.glassHeavy.levels[theme.glassIntensity];

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleStatusChange = () => {
    const statusFlow: Record<string, string> = {
      "want-to-read": "reading",
      reading: "completed",
      completed: "want-to-read",
      paused: "reading",
      abandoned: "want-to-read",
      reference: "reading",
    };

    const nextStatus = statusFlow[book.readingStatus] || "want-to-read";
    onStatusChange(book._id, nextStatus as any);
  };

  const handleOpenBook = () => {
    if (book.fileUrl || book.filePath) {
      onOpenBook(book.fileUrl || book.filePath || "");
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(book._id);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Trigger condensation effect occasionally
    if (Math.random() > 0.7) {
      setShowCondensation(true);
      setTimeout(() => setShowCondensation(false), 1500);
    }
  };

  // ============================================================================
  // GLASS UTILITIES
  // ============================================================================

  const getProgressGlassColor = (progress: number) => {
    if (progress === 0) return "from-gray-400/30 to-gray-400/20";
    if (progress < 30) return "from-emerald-400/40 to-teal-400/30";
    if (progress < 70) return "from-blue-400/40 to-cyan-400/30";
    return "from-purple-400/40 to-pink-400/30";
  };

  const getFileTypeIcon = (fileType?: string) => {
    const icons = {
      PDF: "📄",
      EPUB: "📖",
      MOBI: "📱",
      TXT: "📝",
      Other: "📚",
    };
    return icons[fileType as keyof typeof icons] || icons.Other;
  };

  // ============================================================================
  // GLASS LAYERS COMPOSITION
  // ============================================================================

  const createGlassLayers = () => ({
    // Main card glass layer
    cardLayer: `
      ${glassLevel.backdrop} ${glassLevel.border}
      bg-gradient-to-br from-white/25 to-white/5
      relative overflow-hidden
    `,

    // Floating content layer
    contentLayer: `
      ${theme.glassHeavy.levels.medium.backdrop}
      bg-gradient-to-br from-white/20 to-transparent
      border border-white/30 rounded-2xl
    `,

    // Header glass overlay
    headerOverlay: `
      ${theme.glassHeavy.levels.light.backdrop}
      bg-gradient-to-r from-white/15 to-white/5
      border border-white/20 rounded-xl
    `,
  });

  const glassLayers = createGlassLayers();

  // ============================================================================
  // RENDER GLASS HEAVY CARD
  // ============================================================================

  return (
    <motion.div
      className={`
        ${categoryGlassTint}
        rounded-3xl p-1 group cursor-pointer
        transition-all duration-700 ease-out
        hover:scale-[1.03] hover:-translate-y-2
        ${className}
      `}
      initial={theme.glassHeavy.motionPresets.glassCardEnter.initial}
      animate={theme.glassHeavy.motionPresets.glassCardEnter.animate}
      transition={theme.glassHeavy.motionPresets.glassCardEnter.transition}
      whileHover={{
        scale: 1.03,
        y: -8,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Glass Container */}
      <div className={`${glassLayers.cardLayer} rounded-3xl p-8 h-full`}>
        {/* Glass Refraction Lines */}
        <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Condensation Effect */}
        {showCondensation && (
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1.2, 1.5],
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        )}

        {/* Floating Header */}
        <div className={`${glassLayers.headerOverlay} p-4 mb-6 relative z-10`}>
          <div className="flex justify-between items-center">
            {/* File Info Pills */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 backdrop-blur-md bg-white/20 rounded-full border border-white/30">
                <span className="text-lg">
                  {getFileTypeIcon(book.fileType)}
                </span>
                <span className="text-xs font-bold text-gray-900/80 uppercase tracking-wider">
                  {book.fileType || "BOOK"}
                </span>
              </div>

              <div className="px-3 py-2 backdrop-blur-md bg-white/15 rounded-full border border-white/25">
                <span className="text-xs font-semibold text-gray-900/70">
                  {book.year || "N/A"}
                </span>
              </div>
            </div>

            {/* Favorite Heart */}
            {onToggleFavorite && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite();
                }}
                className={`
                  p-3 rounded-full backdrop-blur-md border transition-all duration-300
                  ${
                    book.isFavorite
                      ? "bg-pink-400/30 border-pink-300/50 text-pink-600"
                      : "bg-white/20 border-white/30 text-gray-600 hover:text-pink-500"
                  }
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5"
                  fill={book.isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </motion.button>
            )}
          </div>
        </div>

        {/* Floating Content Container */}
        <div className={`${glassLayers.contentLayer} p-6 mb-6 relative z-10`}>
          {/* Title & Author */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900/95 mb-3 line-clamp-2 leading-tight font-softclub-display">
              {book.title}
            </h3>
            <p className="text-gray-900/75 text-base font-medium">
              {book.author}
            </p>
          </div>

          {/* Category & Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-4 py-2 backdrop-blur-sm bg-white/25 border border-white/30 rounded-full text-gray-900/80 text-sm font-medium">
              {book.category}
            </span>
            {book.tags &&
              book.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 backdrop-blur-sm bg-white/15 border border-white/25 rounded-full text-gray-900/70 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* Progress Bar (Glass Style) */}
          {book.progress > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-900/70 text-sm font-medium">
                  Progress
                </span>
                <span className="text-gray-900/90 text-sm font-bold">
                  {book.progress}%
                </span>
              </div>
              <div className="w-full h-3 backdrop-blur-sm bg-white/20 rounded-full border border-white/30 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressGlassColor(book.progress)} backdrop-blur-sm`}
                  initial={{ width: 0 }}
                  animate={{ width: `${book.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Rating Stars (Glass Style) */}
          {book.rating && (
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`
                    w-6 h-6 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center
                    ${
                      star <= book.rating!
                        ? "bg-yellow-400/40 text-yellow-600"
                        : "bg-white/15 text-gray-400"
                    }
                  `}
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              ))}
              <span className="text-gray-900/70 text-sm font-medium ml-2">
                {book.rating}/5
              </span>
            </div>
          )}
        </div>

        {/* Status Badge (Floating) */}
        <div className="absolute top-8 right-8 z-20">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange();
            }}
            className={`
              px-4 py-2 rounded-full text-xs font-bold transition-all duration-300
              ${statusGlassStyle}
              hover:scale-105 active:scale-95
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {book.readingStatus.replace("-", " ").toUpperCase()}
          </motion.button>
        </div>

        {/* Action Buttons (Glass Style) */}
        <div
          className={`
          flex gap-3 transition-all duration-500 relative z-10
          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
        >
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenBook();
            }}
            className="
              flex-1 backdrop-blur-md bg-white/25 hover:bg-white/35 border border-white/30
              text-gray-900/90 text-sm font-semibold py-3 px-6 rounded-2xl 
              transition-all duration-300 flex items-center justify-center gap-2
            "
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!book.fileUrl && !book.filePath}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open Book
          </motion.button>

          {showNotes && (
            <motion.button
              className="
                flex-1 backdrop-blur-md bg-white/25 hover:bg-white/35 border border-white/30
                text-gray-900/90 text-sm font-semibold py-3 px-6 rounded-2xl 
                transition-all duration-300 flex items-center justify-center gap-2
              "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Notes
            </motion.button>
          )}
        </div>

        {/* Subtle Glass Pattern Overlay */}
        <div className="absolute inset-0 rounded-3xl opacity-[0.02] pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.8)_0%,transparent_50%)]" />
        </div>

        {/* Glass Shimmer Effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, ease: "linear" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BookCardGlassHeavy;

// ============================================================================
// FILE LOCATION: src/components/ui/BookCardGlassHeavy.tsx
// ============================================================================
