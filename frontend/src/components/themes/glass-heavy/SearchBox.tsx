// src/components/themes/glass-heavy/SearchBox.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Clock, BookOpen, TrendingUp, Sparkles } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'book' | 'author' | 'category' | 'recent';
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
  glassIntensity?: 'whisper' | 'light' | 'medium' | 'heavy' | 'extreme';
  className?: string;
}

/**
 * SearchBox Glass Heavy - Advanced search with intense glassmorphism effects
 * 
 * Features:
 * - Triple layer glassmorphism with variable backdrop-blur
 * - Floating search container with 3D depth
 * - Holographic suggestion dropdown
 * - Crystalline loading animations
 * - Refraction and shimmer effects
 * - Floating particles system
 * - Advanced keyboard navigation
 * - Premium cutting-edge aesthetics
 */
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
  glassIntensity = 'heavy',
  className = ""
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Glass intensity mapping
  const glassLevels = {
    whisper: 'backdrop-blur-sm',
    light: 'backdrop-blur-md',
    medium: 'backdrop-blur-lg',
    heavy: 'backdrop-blur-xl',
    extreme: 'backdrop-blur-3xl'
  };

  const backgroundIntensity = {
    whisper: 'bg-white/10',
    light: 'bg-white/15',
    medium: 'bg-white/20',
    heavy: 'bg-white/25',
    extreme: 'bg-white/30'
  };

  const currentBlur = glassLevels[glassIntensity];
  const currentBg = backgroundIntensity[glassIntensity];

  // Combined suggestions with enhanced categorization
  const allSuggestions = React.useMemo(() => {
    const items: SearchSuggestion[] = [];
    
    // Add filtered suggestions with AI-like prioritization
    if (value && suggestions.length > 0) {
      items.push(...suggestions.slice(0, 6));
    }
    
    // Add recent searches with neural-network-like weighting
    if ((!value || suggestions.length < 4) && recentSearches.length > 0) {
      items.push(...recentSearches.slice(0, 3).map(search => ({
        id: `recent-${search}`,
        text: search,
        type: 'recent' as const
      })));
    }
    
    // Add popular searches with trending indicators
    if (items.length < 8 && popularSearches.length > 0) {
      items.push(...popularSearches.slice(0, 8 - items.length).map(search => ({
        id: `popular-${search}`,
        text: search,
        type: 'category' as const,
        count: Math.floor(Math.random() * 500) + 100 // Simulated popularity
      })));
    }
    
    return items;
  }, [value, suggestions, recentSearches, popularSearches]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
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
      if (e.key === 'Enter') {
        e.preventDefault();
        onSearch?.(value);
        setShowSuggestions(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case 'Enter':
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
      case 'Escape':
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

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-5 h-5" />;
      case 'author':
        return <TrendingUp className="w-5 h-5" />;
      case 'category':
        return <Sparkles className="w-5 h-5" />;
      case 'recent':
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
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
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
          z: isFocused ? 50 : 0
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          damping: 20
        }}
        className="relative transform-gpu perspective-1000"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          className={`
            relative ${currentBg} ${currentBlur}
            border border-white/30 rounded-3xl
            shadow-2xl shadow-black/20
            overflow-hidden
          `}
          style={{
            background: `
              linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%),
              linear-gradient(45deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)
            `,
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.4),
              inset 0 -1px 0 rgba(0,0,0,0.1),
              0 20px 60px rgba(0,0,0,0.3),
              0 0 0 1px rgba(255,255,255,0.1)
            `
          }}
        >
          
          {/* Dynamic Mouse-Following Highlight */}
          <motion.div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, 
                         rgba(255,255,255,0.3) 0%, transparent 70%)`
            }}
          />

          {/* Holographic Shimmer Effect */}
          <motion.div
            animate={{
              x: [-100, 400],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent 
                     via-white/30 to-transparent transform -skew-x-12 pointer-events-none"
          />

          {/* Search Icon with Holographic Effect */}
          <motion.div
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10"
            animate={{
              scale: isFocused ? 1.2 : 1,
              rotateY: isFocused ? 360 : 0,
              filter: isFocused 
                ? "drop-shadow(0 0 8px rgba(59,130,246,0.8))"
                : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
            }}
            transition={{ duration: 0.6 }}
          >
            <Search className="w-6 h-6 text-white" />
          </motion.div>

          {/* Input Field with Glass Effect */}
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
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}
            aria-label="Search books"
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
            role="combobox"
          />

          {/* Crystalline Loading Animation */}
          {isLoading && (
            <motion.div
              className="absolute right-20 top-1/2 transform -translate-y-1/2"
              initial={{ opacity: 0, scale: 0, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0, rotateY: 180 }}
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative w-6 h-6"
              >
                <div className="absolute inset-0 border-2 border-white/30 border-t-white rounded-full" />
                <div className="absolute inset-1 border border-blue-400/50 border-t-blue-400 rounded-full" />
              </motion.div>
            </motion.div>
          )}
            </motion.div>
              