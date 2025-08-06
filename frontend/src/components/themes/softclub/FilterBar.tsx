// ============================================================================
// FILTER BAR SOFTCLUB - GEN X NOSTALGIC FILTERING COMPONENT
// FILE LOCATION: src/components/themes/softclub/FilterBar.tsx
// ============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import type { BookCategory, ReadingStatus } from "@/types";

// ============================================================================
// FILTER BAR PROPS INTERFACE
// ============================================================================

export interface FilterBarProps {
  categories: BookCategory[];
  selectedCategories: BookCategory[];
  onCategoriesChange: (categories: BookCategory[]) => void;

  statuses: ReadingStatus[];
  selectedStatuses: ReadingStatus[];
  onStatusesChange: (statuses: ReadingStatus[]) => void;

  searchTerm: string;
  onSearchChange: (term: string) => void;

  sortBy: "title" | "author" | "dateAdded" | "rating";
  onSortChange: (sort: string) => void;

  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;

  totalResults?: number;
  isLoading?: boolean;
  onClearFilters: () => void;
  className?: string;
}

// ============================================================================
// SOFTCLUB FILTER STYLES
// ============================================================================

const softclubStyles = {
  container:
    "bg-gradient-to-r from-cloud-white/95 via-soft-cyan/20 to-lavender-mist/30 backdrop-blur-sm border border-white/60 rounded-3xl p-6 shadow-soft",
  searchBox:
    "bg-white/80 border border-soft-cyan/30 rounded-2xl px-4 py-3 text-midnight-navy placeholder-midnight-navy/50 focus:border-lavender-mist focus:ring-2 focus:ring-lavender-mist/20 focus:outline-none backdrop-blur-sm",
  filterButton:
    "bg-gradient-to-r from-mint-dream/60 to-soft-cyan/60 hover:from-mint-dream/80 hover:to-soft-cyan/80 text-midnight-navy font-medium px-4 py-2 rounded-2xl border border-white/40 hover:border-white/60 transition-all duration-300",
  activeFilter:
    "bg-gradient-to-r from-lavender-mist to-peachy-keen text-white font-semibold px-4 py-2 rounded-2xl shadow-gentle",
  clearButton:
    "bg-gradient-to-r from-sunset-coral/70 to-peachy-keen/70 hover:from-sunset-coral hover:to-peachy-keen text-white font-medium px-6 py-2 rounded-2xl transition-all duration-300",
};

// ============================================================================
// FILTER CHIP COMPONENT
// ============================================================================

const FilterChip: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}> = ({ label, isActive, onClick, count }) => {
  return (
    <motion.button
      className={`
        relative overflow-hidden ${isActive ? softclubStyles.activeFilter : softclubStyles.filterButton}
      `}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {label}
        {count && (
          <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </span>

      {/* Gentle glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0"
        animate={{ opacity: isActive ? 0.4 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

// ============================================================================
// MAIN FILTER BAR COMPONENT
// ============================================================================

const FilterBarSoftclub: React.FC<FilterBarProps> = ({
  categories,
  selectedCategories,
  onCategoriesChange,
  statuses,
  selectedStatuses,
  onStatusesChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  totalResults = 0,
  isLoading = false,
  onClearFilters,
  className = "",
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const theme = useTheme();

  const handleCategoryToggle = (category: BookCategory) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(newCategories);
  };

  const handleStatusToggle = (status: ReadingStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusesChange(newStatuses);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    searchTerm.length > 0;

  return (
    <motion.div
      className={`${softclubStyles.container} ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
    >
      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Search books, authors, or tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full ${softclubStyles.searchBox}`}
          />
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            whileHover={{ scale: 1.1 }}
          >
            <svg
              className="w-5 h-5 text-midnight-navy/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="text-midnight-navy/70 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? "Searching..." : `${totalResults} books`}
        </motion.div>
      </div>

      {/* Category Filters */}
      <div className="mb-4">
        <motion.h3
          className="text-midnight-navy/80 font-semibold mb-3 text-sm uppercase tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Categories
        </motion.h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <FilterChip
                label={category}
                isActive={selectedCategories.includes(category)}
                onClick={() => handleCategoryToggle(category)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="mb-6">
        <motion.h3
          className="text-midnight-navy/80 font-semibold mb-3 text-sm uppercase tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Reading Status
        </motion.h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status, index) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <FilterChip
                label={status.replace("-", " ")}
                isActive={selectedStatuses.includes(status)}
                onClick={() => handleStatusToggle(status)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <AnimatePresence>
        <motion.div
          className="flex items-center justify-between pt-4 border-t border-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={softclubStyles.filterButton}
          >
            Advanced Filters {showAdvanced ? "▲" : "▼"}
          </button>

          {hasActiveFilters && (
            <motion.button
              onClick={onClearFilters}
              className={softclubStyles.clearButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Clear Filters
            </motion.button>
          )}
        </motion.div>

        {showAdvanced && (
          <motion.div
            className="mt-4 pt-4 border-t border-white/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-midnight-navy/70 font-medium text-sm">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="bg-white/80 border border-soft-cyan/30 rounded-xl px-3 py-2 text-sm text-midnight-navy focus:border-lavender-mist focus:outline-none"
                >
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="dateAdded">Date Added</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <button
                onClick={() =>
                  onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
                }
                className={`${softclubStyles.filterButton} flex items-center gap-2`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}{" "}
                {sortOrder === "asc" ? "A-Z" : "Z-A"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilterBarSoftclub;
