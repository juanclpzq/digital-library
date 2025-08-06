import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import BookCardSoftclub from "@/components/themes/softclub/BookCard";
import BookCardGlassHeavy from "@/components/themes/glass-heavy/BookCard";
import type { BookCardProps } from "@/types";

// ============================================================================
// ADAPTIVE BOOKCARD - AUTO-SWITCHES BETWEEN THEMES
// FILE LOCATION: src/components/shared/AdaptiveBookCard.tsx
// ============================================================================

/**
 * AdaptiveBookCard automatically renders the appropriate BookCard variant
 * based on the current theme (Softclub or Glass Heavy)
 */
const AdaptiveBookCard: React.FC<BookCardProps> = (props) => {
  const theme = useTheme();

  // Render the appropriate component based on current theme
  if (theme.isGlassMode) {
    return <BookCardGlassHeavy {...props} />;
  }

  return <BookCardSoftclub {...props} />;
};

export default AdaptiveBookCard;

// ============================================================================
// ADAPTIVE HOOKS & UTILITIES
// ============================================================================

/**
 * Hook que retorna los componentes apropiados basado en el tema actual
 */
export const useAdaptiveComponents = () => {
  const theme = useTheme();

  const components = React.useMemo(() => {
    if (theme.isGlassMode) {
      return {
        BookCard: BookCardGlassHeavy,
        // StatCard: StatCardGlassHeavy,
        // FilterBar: FilterBarGlassHeavy,
        // Dashboard: DashboardGlassHeavy,
      };
    }

    return {
      BookCard: BookCardSoftclub,
      // StatCard: StatCardSoftclub,
      // FilterBar: FilterBarSoftclub,
      // Dashboard: DashboardSoftclub,
    };
  }, [theme.variant]);

  return components;
};

/**
 * Hook que retorna estilos adaptativos basado en tema
 */
export const useAdaptiveStyles = () => {
  const theme = useTheme();

  const styles = React.useMemo(() => {
    if (theme.isGlassMode) {
      const glassLevel = theme.glassHeavy.levels[theme.glassIntensity];

      return {
        container: `${glassLevel.backdrop} ${glassLevel.border} bg-white/20`,
        card: `${glassLevel.backdrop} bg-white/15 border border-white/30`,
        button: `${glassLevel.backdrop} bg-white/25 hover:bg-white/35 border border-white/30`,
        input: `${glassLevel.backdrop} bg-white/15 border border-white/25 focus:border-white/50`,
        text: {
          primary: "text-gray-900/95",
          secondary: "text-gray-900/75",
          tertiary: "text-gray-900/60",
        },
      };
    }

    // Softclub styles
    return {
      container:
        "bg-gradient-to-br from-cloud-white via-soft-cyan/5 to-lavender-mist/10",
      card: "bg-gradient-to-br from-cloud-white/60 to-silver-matte/20 shadow-soft",
      button:
        "bg-gradient-to-r from-mint-dream/80 to-soft-cyan/80 shadow-gentle",
      input:
        "bg-cloud-white/60 border border-silver-matte/40 focus:border-soft-cyan/60",
      text: {
        primary: "text-midnight-navy",
        secondary: "text-midnight-navy/70",
        tertiary: "text-midnight-navy/50",
      },
    };
  }, [theme.variant, theme.glassIntensity]);

  return styles;
};

// ============================================================================
// ADAPTIVE ANIMATION PRESETS
// ============================================================================

export const useAdaptiveAnimations = () => {
  const theme = useTheme();

  return React.useMemo(() => {
    if (theme.isGlassMode) {
      return theme.glassHeavy.motionPresets;
    }

    // Softclub animations (from existing softclub theme)
    return {
      cardEnter: {
        initial: { opacity: 0, y: 30, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] },
      },
      cardHover: {
        initial: { scale: 1, y: 0 },
        animate: { scale: 1.02, y: -4 },
        transition: { duration: 0.3, ease: "easeOut" },
      },
    };
  }, [theme.variant]);
};

// ============================================================================
// THEME COMPONENT FACTORY
// ============================================================================

/**
 * Factory function para crear componentes adaptativos
 */
export const createAdaptiveComponent = <T extends object>(
  softclubComponent: React.ComponentType<T>,
  glassHeavyComponent: React.ComponentType<T>
) => {
  const AdaptiveComponent: React.FC<T> = (props) => {
    const theme = useTheme();

    if (theme.isGlassMode) {
      return React.createElement(glassHeavyComponent, props);
    }

    return React.createElement(softclubComponent, props);
  };

  AdaptiveComponent.displayName = `Adaptive${softclubComponent.displayName || "Component"}`;

  return AdaptiveComponent;
};

// ============================================================================
// EXAMPLE USAGE & EXPORTS
// ============================================================================

/*
// En cualquier componente:
import { AdaptiveBookCard, useAdaptiveStyles, useAdaptiveComponents } from "@/components/shared";

const MyComponent = () => {
  const styles = useAdaptiveStyles();
  const { BookCard } = useAdaptiveComponents();
  
  return (
    <div className={styles.container}>
      <BookCard {...bookProps} />
      // o
      <AdaptiveBookCard {...bookProps} />
    </div>
  );
};
*/
