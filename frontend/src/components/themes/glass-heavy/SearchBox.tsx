// ============================================================================
// ARCHIVO: src/components/themes/glass-heavy/SearchBox.tsx (CORREGIDO)
// ============================================================================

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Filter,
  Clock,
  BookOpen,
  TrendingUp,
  Sparkles,
} from "lucide-react";

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
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search the crystalline knowledge matrix...",
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
  glassIntensity = "heavy",
  className = "",
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Glass intensity mapping
  const glassLevels = {
    whisper: "backdrop-blur-sm",
    light: "backdrop-blur-md",
    medium: "backdrop-blur-lg",
    heavy: "backdrop-blur-xl",
    extreme: "backdrop-blur-3xl",
  };

  const backgroundIntensity = {
    whisper: "bg-white/10",
    light: "bg-white/15",
    medium: "bg-white/20",
    heavy: "bg-white/25",
    extreme: "bg-white/30",
  };

  const currentBlur = glassLevels[glassIntensity];
  const currentBg = backgroundIntensity[glassIntensity];

  // Combined suggestions
  const allSuggestions = React.useMemo(() => {
    const items: SearchSuggestion[] = [];

    if (value && suggestions.length > 0) {
      items.push(...suggestions.slice(0, 6));
    }

    if ((!value || suggestions.length < 4) && recentSearches.length > 0) {
      items.push(
        ...recentSearches.slice(0, 3).map((search) => ({
          id: `recent-${search}`,
          text: search,
          type: "recent" as const,
        }))
      );
    }

    if (items.length < 8 && popularSearches.length > 0) {
      items.push(
        ...popularSearches.slice(0, 8 - items.length).map((search) => ({
          id: `popular-${search}`,
          text: search,
          type: "category" as const,
          count: Math.floor(Math.random() * 500) + 100,
        }))
      );
    }

    return items;
  }, [value, suggestions, recentSearches, popularSearches]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

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
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "book":
        return <BookOpen className="w-5 h-5" />;
      case "author":
        return <TrendingUp className="w-5 h-5" />;
      case "category":
        return <Sparkles className="w-5 h-5" />;
      case "recent":
        return <Clock className="w-5 h-5" />;
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full max-w-3xl ${className}`}
    >
      {/* Floating Particles System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            animate={{
              x: [0, Math.random() * 200, 0],
              y: [0, Math.random() * 100, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Search Container */}
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          rotateX: isFocused ? 2 : 0,
          rotateY: isFocused ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`
          relative ${currentBlur} ${currentBg}
          border border-white/30 rounded-3xl
          shadow-lg hover:shadow-xl
          transition-all duration-300
          overflow-hidden
        `}
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255,255,255,0.25) 0%, 
              rgba(255,255,255,0.1) 50%, 
              rgba(255,255,255,0.05) 100%
            )
          `,
        }}
      >
        {/* Refraction Light Effect */}
        <motion.div
          className="absolute inset-0 opacity-30 pointer-events-none"
          animate={{
            background: [
              "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
              "linear-gradient(45deg, transparent 60%, rgba(255,255,255,0.1) 80%, transparent 100%)",
              "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Search Icon with Crystalline Animation */}
        <motion.div
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10"
          animate={{
            scale: isFocused ? 1.2 : 1,
            rotateY: isFocused ? 360 : 0,
            filter: isFocused
              ? "drop-shadow(0 0 8px rgba(59,130,246,0.8))"
              : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
          transition={{ duration: 0.6 }}
        >
          <Search className="w-6 h-6 text-white" />
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
            w-full pl-16 pr-24 py-6 rounded-3xl
            bg-transparent text-white placeholder-white/60
            focus:outline-none font-medium text-lg
            tracking-wide
          "
          style={{
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
          aria-label="Search books"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          role="combobox"
        />

        {/* Loading Animation */}
        {isLoading && (
          <motion.div
            className="absolute right-20 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative w-6 h-6"
            >
              <div className="absolute inset-0 border-2 border-white/30 border-t-white rounded-full" />
              <div className="absolute inset-1 border border-blue-400/50 border-t-blue-400 rounded-full" />
            </motion.div>
          </motion.div>
        )}

        {/* Clear Button */}
        {value && (
          <motion.button
            onClick={handleClear}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-white/20 transition-colors"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>
        )}

        {/* Filter Button */}
        {showFilters && (
          <motion.button
            onClick={onFilterToggle}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Filter className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && allSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`
              absolute top-full left-0 right-0 mt-2 z-50
              ${currentBlur} ${currentBg}
              border border-white/30 rounded-2xl
              shadow-xl max-h-80 overflow-y-auto
            `}
          >
            {allSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`
                  flex items-center px-4 py-3 cursor-pointer
                  border-b border-white/10 last:border-b-0
                  transition-all duration-200
                  ${
                    index === selectedIndex
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                `}
                whileHover={{ x: 4 }}
              >
                <div className="flex-shrink-0 mr-3">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{suggestion.text}</p>
                  {suggestion.count && (
                    <p className="text-xs text-white/50">
                      {suggestion.count} results
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBox;
