// src/components/shared/AdaptiveSearchBox.tsx
import React from "react";
import { useTheme } from "../../hooks/useTheme";
import SearchBoxSoftclub from "../themes/softclub/SearchBox";
import SearchBoxGlassHeavy from "../themes/glass-heavy/SearchBox";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "book" | "author" | "category" | "recent";
  count?: number;
}

interface AdaptiveSearchBoxProps {
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
 * AdaptiveSearchBox - Auto-switching search component wrapper
 *
 * Features:
 * - Automatically switches between Softclub and Glass Heavy themes
 * - Preserves all functionality across theme transitions
 * - Seamless state management during theme changes
 * - Optimized for performance with React.memo
 * - Full TypeScript support with comprehensive prop forwarding
 * - Glass intensity support for Glass Heavy theme
 * - Consistent API regardless of active theme
 */
const AdaptiveSearchBox: React.FC<AdaptiveSearchBoxProps> = React.memo(
  ({
    placeholder,
    value,
    onChange,
    onSearch,
    onClear,
    suggestions,
    recentSearches,
    popularSearches,
    isLoading,
    showFilters,
    onFilterToggle,
    autoFocus,
    className,
  }) => {
    const { variant, glassIntensity, isGlassMode, currentTheme } = useTheme();

    // Common props that both components share
    const commonProps = React.useMemo(
      () => ({
        placeholder,
        value,
        onChange,
        onSearch,
        onClear,
        suggestions,
        recentSearches,
        popularSearches,
        isLoading,
        showFilters,
        onFilterToggle,
        autoFocus,
        className,
      }),
      [
        placeholder,
        value,
        onChange,
        onSearch,
        onClear,
        suggestions,
        recentSearches,
        popularSearches,
        isLoading,
        showFilters,
        onFilterToggle,
        autoFocus,
        className,
      ]
    );

    // Adaptive placeholder based on theme
    const adaptivePlaceholder = React.useMemo(() => {
      if (placeholder) return placeholder;

      return isGlassMode
        ? "Search the crystalline knowledge matrix..."
        : "Search your digital library...";
    }, [placeholder, isGlassMode]);

    // Theme-specific props
    const themeSpecificProps = React.useMemo(() => {
      const baseProps = {
        ...commonProps,
        placeholder: adaptivePlaceholder,
      };

      if (isGlassMode) {
        return {
          ...baseProps,
          glassIntensity,
        };
      }

      return baseProps;
    }, [commonProps, adaptivePlaceholder, isGlassMode, glassIntensity]);

    // Render appropriate component based on theme
    if (isGlassMode) {
      return (
        <SearchBoxGlassHeavy
          {...themeSpecificProps}
          glassIntensity={glassIntensity}
        />
      );
    }

    return <SearchBoxSoftclub {...themeSpecificProps} />;
  }
);

AdaptiveSearchBox.displayName = "AdaptiveSearchBox";

export default AdaptiveSearchBox;

// Export types for external use
export type { SearchSuggestion, AdaptiveSearchBoxProps };
