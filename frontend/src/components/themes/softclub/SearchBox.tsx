// src/components/themes/softclub/SearchBox.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Filter, Clock, BookOpen, TrendingUp } from "lucide-react";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "book" | "author" | "category" | "recent";
  count?: number;
}

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  popularSearches?: string[];
  isLoading?: boolean;
  showFilters?: boolean;
  onFilterToggle?: () => void;
  autoFocus?: boolean;
  className?: string;
}

/**
 * SearchBox Softclub - Advanced search with nostalgic Gen X aesthetics
 *
 * Features:
 * - Gentle gradients and smooth animations
 * - Smart suggestions with categorization
 * - Recent and popular searches
 * - Filter integration
 * - Loading states with soft indicators
 * - Responsive design with mobile-first approach
 * - Accessibility support with proper ARIA labels
 */
const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search your digital library...",
  value = "",
  onChange,
  onSearch,
  onClear,
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  isLoading = false,
  showFilters = true,
  onFilterToggle,
  autoFocus = false,
  className = "",
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Combined suggestions with recent and popular searches
  const allSuggestions = React.useMemo(() => {
    const items: SearchSuggestion[] = [];

    // Add filtered suggestions
    if (value && suggestions.length > 0) {
      items.push(...suggestions.slice(0, 5));
    }

    // Add recent searches if no value or few suggestions
    if ((!value || suggestions.length < 3) && recentSearches.length > 0) {
      items.push(
        ...recentSearches.slice(0, 3).map((search) => ({
          id: `recent-${search}`,
          text: search,
          type: "recent" as const,
        }))
      );
    }

    // Add popular searches if space available
    if (items.length < 5 && popularSearches.length > 0) {
      items.push(
        ...popularSearches.slice(0, 5 - items.length).map((search) => ({
          id: `popular-${search}`,
          text: search,
          type: "category" as const,
        }))
      );
    }

    return items;
  }, [value, suggestions, recentSearches, popularSearches]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    setSelectedIndex(-1);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || allSuggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        onSearch?.(value);
        setShowSuggestions(false);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selected = allSuggestions[selectedIndex];
          onChange?.(selected.text);
          onSearch?.(selected.text);
        } else {
          onSearch?.(value);
        }
        setShowSuggestions(false);
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange?.(suggestion.text);
    onSearch?.(suggestion.text);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    onChange?.("");
    onClear?.();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (allSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "book":
        return <BookOpen className="w-4 h-4" />;
      case "author":
        return <TrendingUp className="w-4 h-4" />;
      case "category":
        return <TrendingUp className="w-4 h-4" />;
      case "recent":
        return <Clock className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-2xl ${className}`}
    >
      {/* Main Search Input */}
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused
            ? "0 8px 32px rgba(147, 51, 234, 0.15), 0 0 0 1px rgba(147, 51, 234, 0.2)"
            : "0 4px 16px rgba(147, 51, 234, 0.1)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative"
      >
        <div
          className="relative bg-gradient-to-r from-white/90 via-lavender-mist/20 to-white/90 
                      backdrop-blur-sm rounded-2xl shadow-soft border border-white/60"
        >
          {/* Search Icon */}
          <motion.div
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
            animate={{
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? "#9333ea" : "#9ca3af",
            }}
          >
            <Search className="w-5 h-5" />
          </motion.div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="
              w-full pl-12 pr-20 py-4 rounded-2xl
              bg-transparent text-purple-800 placeholder-purple-400/60
              focus:outline-none font-medium text-lg
              transition-all duration-300
            "
            aria-label="Search books"
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
            role="combobox"
          />

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              className="absolute right-16 top-1/2 transform -translate-y-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full"
              />
            </motion.div>
          )}

          {/* Clear Button */}
          {value && !isLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className="absolute right-16 top-1/2 transform -translate-y-1/2
                       p-1 rounded-lg bg-purple-100 hover:bg-purple-200
                       text-purple-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}

          {/* Filter Toggle */}
          {showFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onFilterToggle}
              className="absolute right-4 top-1/2 transform -translate-y-1/2
                       p-2 rounded-xl bg-gradient-to-r from-soft-cyan to-mint-dream
                       text-white shadow-soft hover:shadow-md
                       transition-all duration-300"
              aria-label="Toggle filters"
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          )}

          {/* Focus Ring Effect */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r 
                       from-purple-400/20 via-pink-400/10 to-purple-400/20 
                       pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </div>
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && allSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl 
                          border border-white/60 overflow-hidden"
            >
              {/* Suggestions Header */}
              <div
                className="px-4 py-3 bg-gradient-to-r from-soft-cyan/20 to-lavender-mist/20 
                            border-b border-white/30"
              >
                <h3 className="text-sm font-semibold text-purple-700">
                  {value ? "Suggestions" : "Quick Search"}
                </h3>
              </div>

              {/* Suggestions List */}
              <div className="max-h-80 overflow-y-auto">
                {allSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      flex items-center gap-3 px-4 py-3 cursor-pointer
                      transition-all duration-200
                      ${
                        selectedIndex === index
                          ? "bg-gradient-to-r from-purple-100 to-pink-50 text-purple-800"
                          : "hover:bg-purple-50 text-purple-700"
                      }
                    `}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {/* Icon */}
                    <div
                      className={`
                      p-1.5 rounded-lg transition-colors
                      ${
                        selectedIndex === index
                          ? "bg-purple-200 text-purple-700"
                          : "bg-purple-100 text-purple-600"
                      }
                    `}
                    >
                      {getSuggestionIcon(suggestion.type)}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <span className="font-medium">{suggestion.text}</span>
                      {suggestion.count && (
                        <span className="ml-2 text-sm text-purple-500">
                          ({suggestion.count} books)
                        </span>
                      )}
                    </div>

                    {/* Type Badge */}
                    <motion.span
                      className={`
                        px-2 py-1 rounded-lg text-xs font-medium capitalize
                        ${
                          selectedIndex === index
                            ? "bg-purple-200 text-purple-800"
                            : "bg-purple-100 text-purple-600"
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                    >
                      {suggestion.type}
                    </motion.span>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div
                className="px-4 py-2 bg-gradient-to-r from-purple-50/50 to-pink-50/50 
                            border-t border-white/30"
              >
                <p className="text-xs text-purple-500 text-center">
                  Use ↑↓ to navigate, Enter to select, Esc to close
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Shortcut Hint */}
      {!isFocused && !value && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-6 top-1/2 transform -translate-y-1/2
                   hidden md:flex items-center gap-1 text-purple-400/60 text-sm"
        >
          <kbd className="px-2 py-1 bg-white/50 rounded border border-purple-200/50 text-xs">
            ⌘K
          </kbd>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBox;
