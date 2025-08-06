// ============================================================================
// ADAPTIVE STAT CARD - AUTO-SWITCHES BETWEEN THEMES
// FILE LOCATION: src/components/shared/AdaptiveStatCard.tsx
// ============================================================================

import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import StatCardSoftclub from "@/components/themes/softclub/StatCard";
import StatCardGlassHeavy from "@/components/themes/glass-heavy/StatCard";
import type { StatCardProps } from "@/components/themes/softclub/StatCard";

// ============================================================================
// ADAPTIVE STATCARD COMPONENT
// ============================================================================

/**
 * AdaptiveStatCard automatically renders the appropriate StatCard variant
 * based on the current theme (Softclub or Glass Heavy)
 *
 * @example
 * ```tsx
 * <AdaptiveStatCard
 *   label="Total Books"
 *   value={156}
 *   gradient="cyan"
 *   icon={<BookIcon />}
 *   trend="up"
 *   trendValue={12}
 * />
 * ```
 */
const AdaptiveStatCard: React.FC<StatCardProps> = (props) => {
  const theme = useTheme();

  // Render the appropriate component based on current theme
  if (theme.isGlassMode) {
    return <StatCardGlassHeavy {...props} />;
  }

  return <StatCardSoftclub {...props} />;
};

export default AdaptiveStatCard;

// ============================================================================
// ADAPTIVE HOOKS & UTILITIES
// ============================================================================

/**
 * Hook que retorna las variantes de StatCard basado en el tema actual
 */
export const useAdaptiveStatCard = () => {
  const theme = useTheme();

  const StatCard = React.useMemo(() => {
    return theme.isGlassMode ? StatCardGlassHeavy : StatCardSoftclub;
  }, [theme.variant]);

  return { StatCard };
};

/**
 * Factory function para crear StatCards adaptativos con props predeterminadas
 */
export const createStatCardVariant = (defaultProps: Partial<StatCardProps>) => {
  return (props: StatCardProps) => (
    <AdaptiveStatCard {...defaultProps} {...props} />
  );
};

// ============================================================================
// PREDEFINED STAT CARD VARIANTS
// ============================================================================

/**
 * Variantes predefinidas para casos comunes
 */
export const StatCardVariants = {
  // Para estadísticas de libros
  BookStats: createStatCardVariant({
    gradient: "cyan",
    size: "md",
    animateValue: true,
  }),

  // Para progreso de lectura
  ProgressStats: createStatCardVariant({
    gradient: "mint",
    size: "md",
    suffix: "%",
    trend: "up",
  }),

  // Para metas y objetivos
  GoalStats: createStatCardVariant({
    gradient: "peach",
    size: "lg",
    animateValue: true,
  }),

  // Para estadísticas temporales
  TimeStats: createStatCardVariant({
    gradient: "lavender",
    size: "sm",
    iconPosition: "top",
  }),

  // Para comparaciones
  ComparisonStats: createStatCardVariant({
    gradient: "coral",
    size: "md",
    variant: "detailed",
  }),
};

// ============================================================================
// USAGE EXAMPLES & TYPE EXPORTS
// ============================================================================

export type { StatCardProps } from "@/components/themes/softclub/StatCard";
export { AdaptiveStatCard as default };
