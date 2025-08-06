import React from "react";
import { motion } from "framer-motion";
import {
  getCategoryGradient,
  getStatusStyle,
  motionPresets,
} from "@/theme/softclub";
import type { BookCardProps } from "@/types";

// ============================================================================
// BOOKCARD COMPONENT - GEN X SOFTCLUB AESTHETIC
// ============================================================================

const BookCard: React.FC<BookCardProps> = ({
  book,
  onStatusChange,
  onOpenBook,
  onToggleFavorite,
  showNotes = true,
  className = "",
}) => {
  // ============================================================================
  // DYNAMIC STYLING FUNCTIONS
  // ============================================================================

  const statusStyle = getStatusStyle(book.readingStatus);
  const categoryGradient = getCategoryGradient(book.category);

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

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-silver-matte/60";
    if (progress < 30) return "bg-mint-dream/80";
    if (progress < 70) return "bg-soft-cyan/80";
    return "bg-sunset-coral/80";
  };

  const formatYear = (year?: number) => {
    return year ? year.toString() : "N/A";
  };

  const formatFileType = (fileType?: string) => {
    return fileType?.toUpperCase() || "BOOK";
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <motion.div
      className={`
        relative p-8 rounded-3xl ${categoryGradient}
        backdrop-blur-sm border border-cloud-white/20
        transition-all duration-500 ease-gentle
        hover:scale-102 hover:shadow-soft-hover hover:-translate-y-1
        cursor-pointer group overflow-hidden
        ${className}
      `}
      variants={motionPresets.cardEnter}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gentle Glow Effect Overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cloud-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Favorite Heart - Top Right */}
      {onToggleFavorite && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite();
          }}
          className={`
            absolute top-6 right-6 z-10 p-2 rounded-full
            backdrop-blur-sm transition-all duration-300
            ${
              book.isFavorite
                ? "bg-sunset-coral/20 text-sunset-coral"
                : "bg-cloud-white/20 text-midnight-navy/60 hover:text-sunset-coral"
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

      {/* Header - Year and File Type */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3 text-midnight-navy/80 text-sm font-medium">
          <span className="glass-soft px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            {formatYear(book.year)}
          </span>
          <span className="glass-soft px-3 py-1 rounded-full text-xs font-bold tracking-wider">
            {formatFileType(book.fileType)}
          </span>
        </div>

        {/* Reading Status Badge */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleStatusChange();
          }}
          className={`
            px-4 py-2 rounded-full text-xs font-bold transition-all duration-300
            ${statusStyle.bg} ${statusStyle.text} shadow-lg ${statusStyle.shadow}
            hover:scale-105 active:scale-95
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {book.readingStatus.replace("-", " ").toUpperCase()}
        </motion.button>
      </div>

      {/* Book Content */}
      <div className="mb-6 relative z-10">
        {/* Title */}
        <h3 className="text-2xl font-bold text-midnight-navy mb-3 line-clamp-2 leading-tight font-softclub-display">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-midnight-navy/70 text-base mb-4 font-medium font-softclub">
          {book.author}
        </p>

        {/* Category & Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="glass-gentle px-4 py-2 rounded-full text-midnight-navy/80 text-sm font-medium">
            {book.category}
          </span>
          {book.tags &&
            book.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-cloud-white/30 px-3 py-1 rounded-full text-midnight-navy/70 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
        </div>

        {/* Progress Bar */}
        {book.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-midnight-navy/60 text-sm font-medium">
                Progress
              </span>
              <span className="text-midnight-navy/80 text-sm font-bold">
                {book.progress}%
              </span>
            </div>
            <div className="w-full bg-cloud-white/40 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getProgressColor(book.progress)}`}
                initial={{ width: 0 }}
                animate={{ width: `${book.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Rating */}
        {book.rating && (
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= book.rating!
                    ? "text-sunset-coral"
                    : "text-silver-matte"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-midnight-navy/70 text-sm font-medium ml-2">
              {book.rating}/5
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 relative z-10">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenBook();
          }}
          className="
            flex-1 glass-gentle hover:glass-soft text-midnight-navy text-sm font-semibold 
            py-3 px-6 rounded-2xl transition-all duration-300
            hover:scale-102 active:scale-98
            flex items-center justify-center gap-2
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
              flex-1 glass-gentle hover:glass-soft text-midnight-navy text-sm font-semibold 
              py-3 px-6 rounded-2xl transition-all duration-300
              hover:scale-102 active:scale-98
              flex items-center justify-center gap-2
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

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 rounded-3xl opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-midnight-navy via-transparent to-midnight-navy" />
      </div>
    </motion.div>
  );
};

export default BookCard;
