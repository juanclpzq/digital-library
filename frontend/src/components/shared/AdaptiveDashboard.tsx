// ============================================================================
// ADAPTIVE DASHBOARD - AUTO-SWITCHES BETWEEN THEMES
// FILE LOCATION: src/components/shared/AdaptiveDashboard.tsx
// ============================================================================

import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import DashboardSoftclub from "@/components/themes/softclub/Dashboard";
import DashboardGlassHeavy from "@/components/themes/glass-heavy/Dashboard";
import type { DashboardProps } from "@/components/themes/softclub/Dashboard";

// ============================================================================
// ADAPTIVE DASHBOARD COMPONENT
// ============================================================================

/**
 * AdaptiveDashboard automatically renders the appropriate Dashboard variant
 * based on the current theme (Softclub or Glass Heavy)
 *
 * @example
 * ```tsx
 * <AdaptiveDashboard
 *   books={books}
 *   isLoading={loading}
 *   onBookClick={handleBookClick}
 *   onBookUpdate={handleBookUpdate}
 *   onBookDelete={handleBookDelete}
 *   onAddBook={handleAddBook}
 * />
 * ```
 */
const AdaptiveDashboard: React.FC<DashboardProps> = (props) => {
  const theme = useTheme();

  // Add glass-specific props when in glass mode
  const enhancedProps = theme.isGlassMode
    ? { ...props, glassIntensity: theme.glassIntensity }
    : props;

  // Render the appropriate component based on current theme
  if (theme.isGlassMode) {
    return <DashboardGlassHeavy {...enhancedProps} />;
  }

  return <DashboardSoftclub {...props} />;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default AdaptiveDashboard;
