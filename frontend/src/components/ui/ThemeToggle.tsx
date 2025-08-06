import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeVariant } from "@/theme/glass-heavy";

// ============================================================================
// THEME TOGGLE COMPONENT - GLASS HEAVY + SOFTCLUB SWITCHER
// FILE LOCATION: src/components/ui/ThemeToggle.tsx
// ============================================================================

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
  showGlassIntensity?: boolean;
  position?: "floating" | "inline";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabels = true,
  showGlassIntensity = true,
  position = "floating",
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // ============================================================================
  // GLASS INTENSITY OPTIONS
  // ============================================================================

  const glassIntensityOptions = [
    { key: "whisper" as const, label: "Whisper", icon: "👻" },
    { key: "light" as const, label: "Light", icon: "🌙" },
    { key: "medium" as const, label: "Medium", icon: "💫" },
    { key: "heavy" as const, label: "Heavy", icon: "🔮" },
    { key: "extreme" as const, label: "Extreme", icon: "💎" },
  ];

  // ============================================================================
  // COMPONENT STYLES BASED ON THEME
  // ============================================================================

  const getContainerStyles = () => {
    const baseStyles = `
      ${position === "floating" ? "fixed top-6 right-6 z-50" : "relative"}
      transition-all duration-500 ease-out
    `;

    if (theme.isGlassMode) {
      return `
        ${baseStyles}
        ${theme.glassHeavy.levels[theme.glassIntensity].backdrop}
        ${theme.glassHeavy.levels[theme.glassIntensity].border}
        bg-gradient-to-br from-white/25 to-white/5
        rounded-2xl overflow-hidden
        shadow-2xl shadow-black/10
      `;
    }

    return `
      ${baseStyles}
      bg-gradient-to-br from-cloud-white/80 to-silver-matte/40
      backdrop-blur-sm border border-cloud-white/30
      rounded-2xl shadow-soft
    `;
  };

  const getButtonStyles = (isActive: boolean) => {
    if (theme.isGlassMode) {
      return `
        ${theme.glassHeavy.levels.light.backdrop}
        ${isActive ? "bg-white/30 border-white/50" : "bg-white/15 border-white/25"}
        border rounded-xl transition-all duration-300
        hover:bg-white/35 active:scale-95
      `;
    }

    return `
      ${
        isActive
          ? "bg-gradient-to-r from-mint-dream/80 to-soft-cyan/80 shadow-gentle"
          : "bg-cloud-white/40 hover:bg-cloud-white/60"
      }
      border border-cloud-white/30 rounded-xl transition-all duration-300
      hover:scale-102 active:scale-95
    `;
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <div className={`${getContainerStyles()} ${className}`}>
      <div className="p-4">
        {/* Main Theme Toggle */}
        <div className="flex items-center gap-3 mb-4">
          {/* Theme Variant Toggle */}
          <div className="flex bg-black/5 rounded-xl p-1 backdrop-blur-sm">
            {(["softclub", "glass-heavy"] as ThemeVariant[]).map((variant) => (
              <motion.button
                key={variant}
                onClick={() => theme.setVariant(variant)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                  flex items-center gap-2 relative overflow-hidden
                  ${getButtonStyles(theme.variant === variant)}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Theme Icons */}
                <span className="text-lg">
                  {variant === "softclub" ? "🌈" : "🔮"}
                </span>

                {showLabels && (
                  <span
                    className={`
                    ${theme.isGlassMode ? "text-gray-900/90" : "text-midnight-navy/90"}
                    ${theme.variant === variant ? "font-bold" : ""}
                  `}
                  >
                    {variant === "softclub" ? "Softclub" : "Glass Heavy"}
                  </span>
                )}

                {/* Active indicator */}
                {theme.variant === variant && (
                  <motion.div
                    layoutId="activeTheme"
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Expand Button for Glass Intensity */}
          {theme.isGlassMode && showGlassIntensity && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`
                p-2 rounded-xl ${getButtonStyles(false)}
                flex items-center justify-center
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Glass Intensity Controls */}
        <AnimatePresence>
          {theme.isGlassMode && showGlassIntensity && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-white/20">
                {/* Glass Intensity Label */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-gray-900/70 uppercase tracking-wider">
                    Glass Intensity
                  </span>
                </div>

                {/* Intensity Options Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {glassIntensityOptions.map((option) => (
                    <motion.button
                      key={option.key}
                      onClick={() => theme.setGlassIntensity(option.key)}
                      className={`
                        p-3 rounded-xl transition-all duration-300
                        flex flex-col items-center gap-1 relative overflow-hidden
                        ${getButtonStyles(theme.glassIntensity === option.key)}
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={option.label}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-xs font-medium text-gray-900/80">
                        {option.label}
                      </span>

                      {/* Active Indicator */}
                      {theme.glassIntensity === option.key && (
                        <motion.div
                          layoutId="activeIntensity"
                          className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-xl"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Current Intensity Preview */}
                <div className="mt-3 p-3 rounded-xl bg-black/5 backdrop-blur-sm">
                  <div className="text-xs text-gray-900/70 mb-1">Current:</div>
                  <div className="flex items-center gap-2">
                    <span>
                      {
                        glassIntensityOptions.find(
                          (opt) => opt.key === theme.glassIntensity
                        )?.icon
                      }
                    </span>
                    <span className="text-sm font-semibold text-gray-900/90">
                      {
                        glassIntensityOptions.find(
                          (opt) => opt.key === theme.glassIntensity
                        )?.label
                      }
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Info Display */}
        {showLabels && (
          <div
            className={`
            mt-4 pt-4 border-t
            ${theme.isGlassMode ? "border-white/20" : "border-cloud-white/30"}
          `}
          >
            <div className="text-xs text-center opacity-70">
              <div className="font-medium">
                {theme.variant === "softclub"
                  ? "Gen X Softclub Theme"
                  : "Glass Heavy Theme"}
              </div>
              {theme.isGlassMode && (
                <div className="text-xs mt-1">
                  Intensity:{" "}
                  {
                    glassIntensityOptions.find(
                      (opt) => opt.key === theme.glassIntensity
                    )?.label
                  }
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shimmer Effect for Glass Mode */}
        {theme.isGlassMode && (
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 5,
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MINI THEME TOGGLE (For Compact Spaces)
// ============================================================================

export const MiniThemeToggle: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const theme = useTheme();

  return (
    <motion.button
      onClick={theme.toggleTheme}
      className={`
        p-3 rounded-full transition-all duration-300
        ${
          theme.isGlassMode
            ? `${theme.glassHeavy.levels.medium.backdrop} bg-white/25 border border-white/30`
            : "bg-gradient-to-r from-mint-dream/60 to-soft-cyan/60 shadow-gentle"
        }
        hover:scale-110 active:scale-95
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${theme.variant === "softclub" ? "Glass Heavy" : "Softclub"} theme`}
    >
      <motion.span
        className="text-2xl block"
        initial={false}
        animate={{ rotateY: 0 }}
        whileHover={{ rotateY: 180 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {theme.variant === "softclub" ? "🌈" : "🔮"}
      </motion.span>
    </motion.button>
  );
};

export default ThemeToggle;
