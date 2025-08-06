// ============================================================================
// FILTER BAR GLASS HEAVY - INTENSE GLASSMORPHISM FILTERING COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/FilterBar.tsx
// ============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import GlassContainer from "./effects/GlassContainer";
import GlassShimmer from "./effects/GlassShimmer";
import Refraction from "./effects/Refraction";
import type { BookCategory, ReadingStatus } from "@/types";

// ============================================================================
// FILTER BAR PROPS INTERFACE (SAME AS SOFTCLUB)
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
// GLASS FILTER CHIP COMPONENT
// ============================================================================

const GlassFilterChip: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
  intensity?: string;
}> = ({ label, isActive, onClick, count, intensity = "medium" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const glassIntensity = {
    light: "backdrop-blur-[12px] bg-white/15",
    medium: "backdrop-blur-[20px] bg-white/20",
    heavy: "backdrop-blur-[32px] bg-white/25",
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-xl px-4 py-2 border transition-all duration-300
        ${
          isActive
            ? "backdrop-blur-[24px] bg-white/30 border-white/50 text-white shadow-glass-lg"
            : `${glassIntensity[intensity as keyof typeof glassIntensity]} border-white/25 text-white/90 hover:bg-white/25 hover:border-white/40`
        }
      `}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glass shimmer effect */}
      {(isActive || isHovered) && <GlassShimmer intensity="light" active />}

      {/* Refraction lines */}
      <Refraction intensity="low" animated={isHovered} />

      <span className="relative z-10 flex items-center gap-2 font-medium">
        {label}
        {count && (
          <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">
            {count}
          </span>
        )}
      </span>

      {/* Active state glow */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

// ============================================================================
// MAIN FILTER BAR GLASS HEAVY COMPONENT
// ============================================================================

const FilterBarGlassHeavy: React.FC<FilterBarProps> = ({
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
  const [searchFocused, setSearchFocused] = useState(false);
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
    <GlassContainer
      variant="panel"
      intensity="medium"
      effects={{
        layers: true,
        condensation: true,
        refraction: true,
        shimmer: false,
        ripple: false,
        depth: true,
      }}
      className={`p-6 ${className}`}
    >
      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <input
            type="text"
            placeholder="Search books, authors, or tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`
              w-full backdrop-blur-[16px] bg-white/15 border rounded-xl px-4 py-3 
              text-white placeholder-white/60 focus:outline-none transition-all duration-300
              ${
                searchFocused
                  ? "border-white/50 bg-white/20 shadow-glass-lg"
                  : "border-white/25 hover:border-white/35"
              }
            `}
          />

          {/* Search icon with glow effect */}
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            animate={{
              scale: searchFocused ? 1.1 : 1,
              filter: searchFocused
                ? "drop-shadow(0 0 8px rgba(255,255,255,0.5))"
                : "none",
            }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="w-5 h-5 text-white/70"
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
          className="text-white/80 font-medium backdrop-blur-sm bg-white/10 px-4 py-2 rounded-lg border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-white/60 rounded-full"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Searching...
            </div>
          ) : (
            `${totalResults} books`
          )}
        </motion.div>
      </div>

      {/* Category Filters */}
      <div className="mb-4">
        <motion.h3
          className="text-white/90 font-semibold mb-3 text-sm uppercase tracking-wider"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Categories
        </motion.h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{
                delay: 0.4 + index * 0.05,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <GlassFilterChip
                label={category}
                isActive={selectedCategories.includes(category)}
                onClick={() => handleCategoryToggle(category)}
                intensity="medium"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="mb-6">
        <motion.h3
          className="text-white/90 font-semibold mb-3 text-sm uppercase tracking-wider"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          Reading Status
        </motion.h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status, index) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{
                delay: 0.6 + index * 0.05,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <GlassFilterChip
                label={status.replace("-", " ")}
                isActive={selectedStatuses.includes(status)}
                onClick={() => handleStatusToggle(status)}
                intensity="medium"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <AnimatePresence>
        <motion.div
          className="flex items-center justify-between pt-4 border-t border-white/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <motion.button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="backdrop-blur-[16px] bg-white/15 hover:bg-white/25 text-white/90 font-medium px-6 py-2 rounded-xl border border-white/25 hover:border-white/40 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-2">
              Advanced Filters
              <motion.span
                animate={{ rotate: showAdvanced ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </span>
          </motion.button>

          {hasActiveFilters && (
            <motion.button
              onClick={onClearFilters}
              className="backdrop-blur-[16px] bg-gradient-to-r from-red-400/25 to-pink-400/25 hover:from-red-400/35 hover:to-pink-400/35 text-white font-medium px-6 py-2 rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-300 shadow-glass-md"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
            >
              Clear Filters
            </motion.button>
          )}
        </motion.div>

        {showAdvanced && (
          <motion.div
            className="mt-4 pt-4 border-t border-white/20 backdrop-blur-sm bg-white/5 rounded-lg p-4"
            initial={{ opacity: 0, height: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
            exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <label className="text-white/80 font-medium text-sm">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="backdrop-blur-[12px] bg-white/15 border border-white/25 rounded-lg px-3 py-2 text-sm text-white focus:border-white/50 focus:outline-none hover:bg-white/20 transition-all duration-200"
                >
                  <option value="title" className="bg-gray-800">
                    Title
                  </option>
                  <option value="author" className="bg-gray-800">
                    Author
                  </option>
                  <option value="dateAdded" className="bg-gray-800">
                    Date Added
                  </option>
                  <option value="rating" className="bg-gray-800">
                    Rating
                  </option>
                </select>
              </div>

              <motion.button
                onClick={() =>
                  onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
                }
                className="backdrop-blur-[12px] bg-white/15 hover:bg-white/25 text-white/90 font-medium px-4 py-2 rounded-lg border border-white/25 hover:border-white/40 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  animate={{ rotate: sortOrder === "desc" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ↑
                </motion.span>
                {sortOrder === "asc" ? "A-Z" : "Z-A"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassContainer>
  );
};

export default FilterBarGlassHeavy;
