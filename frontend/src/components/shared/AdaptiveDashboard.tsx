// ============================================================================
// ARCHIVO: src/components/shared/AdaptiveDashboard.tsx (CORRECCIÓN SIMPLE)
// ============================================================================

import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import DashboardSoftclub from "@/components/themes/softclub/Dashboard";
import DashboardGlassHeavy from "@/components/themes/glass-heavy/Dashboard";
import type { DashboardProps } from "@/components/themes/softclub/Dashboard";

const AdaptiveDashboard: React.FC<DashboardProps> = (props) => {
  const theme = useTheme();

  const enhancedProps = theme.isGlassMode
    ? {
        ...props,
        glassIntensity: theme.glassIntensity,
        theme: theme.currentTheme,
      }
    : { ...props, theme: theme.currentTheme };

  // ESTO ES LA CLAVE: Wrapper con las clases de tema aplicadas
  return (
    <div
      className={`theme-container ${theme.isGlassMode ? "glass-heavy-theme" : "softclub-theme"}`}
      data-theme={theme.variant}
      data-glass-intensity={theme.glassIntensity}
      style={{
        minHeight: "100vh",
        background: theme.isGlassMode
          ? "linear-gradient(135deg, rgba(15, 23, 42, 0.1) 0%, rgba(88, 28, 135, 0.1) 50%, rgba(15, 23, 42, 0.1) 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, rgba(6, 182, 212, 0.1) 25%, rgba(168, 85, 247, 0.1) 75%, #fdf4ff 100%)",
      }}
    >
      {theme.isGlassMode ? (
        <DashboardGlassHeavy {...enhancedProps} />
      ) : (
        <DashboardSoftclub {...enhancedProps} />
      )}
    </div>
  );
};

export default AdaptiveDashboard;
