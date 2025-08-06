// ============================================================================
// STAT CARD GLASS HEAVY - INTENSE GLASSMORPHISM STATISTICS COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/StatCard.tsx
// ============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import CardGlassHeavy from "./Card";
import GlassShimmer from "./effects/GlassShimmer";
import Condensation from "./effects/Condensation";

// ============================================================================
// STAT CARD PROPS INTERFACE (SAME AS SOFTCLUB + GLASS EXTRAS)
// ============================================================================

export interface StatCardProps {
  label: string;
  value: number | string;
  gradient?: "mint" | "cyan" | "peach" | "lavender" | "coral" | "custom";
  customGradient?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "top";
  trend?: "up" | "down" | "stable" | "none";
  trendValue?: number;
  trendLabel?: string;
  isLoading?: boolean;
  animateValue?: boolean;
  suffix?: string;
  prefix?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "detailed" | "compact";
  className?: string;
  onClick?: () => void;
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  shimmer?: boolean;
  condensation?: boolean;
  particleEffect?: boolean;
}

// ============================================================================
// GLASS HEAVY GRADIENT MAPPINGS
// ============================================================================

const getGlassGradientStyles = (gradient: StatCardProps["gradient"], customGradient?: string) => {
  if (gradient === "custom" && customGradient) {
    return customGradient;
  }

  const gradients = {
    mint: "bg-gradient-to-br from-emerald-400/30 via-teal-400/20 to-cyan-400/25",
    cyan: "bg-gradient-to-br from-cyan-400/30 via-blue-400/25 to-indigo-400/20",
    peach: "bg-gradient-to-br from-orange-400/25 via-pink-400/30 to-red-400/20",
    lavender: "bg-gradient-to-br from-purple-400/30 via-pink-400/25 to-rose-400/20",
    coral: "bg-gradient-to-br from-pink-400/25 via-rose-400/30 to-orange-400/20",
  };
  
  return gradients[gradient || "cyan"];
};

// ============================================================================
// SIZE VARIANTS (SAME AS SOFTCLUB)
// ============================================================================

const getSizeStyles = (size: StatCardProps["size"]) => {
  const sizes = {
    sm: {
      padding: "sm",
      valueText: "text-xl font-bold",
      labelText: "text-xs",
      iconSize: "w-5 h-5",
      trendText: "text-xs",
    },
    md: {
      padding: "md",
      valueText: "text-3xl font-bold",
      labelText: "text-sm",
      iconSize: "w-6 h-6",
      trendText: "text-sm",
    },
    lg: {
      padding: "lg",
      valueText: "text-4xl font-bold",
      labelText: "text-base",
      iconSize: "w-8 h-8",
      trendText: "text-base",
    },
  };
  
  return sizes[size || "md"];
};

// ============================================================================
// GLASS TREND INDICATORS
// ============================================================================

const GlassTrendIndicator: React.FC<{
  trend: StatCardProps["trend"];
  value?: number;
  label?: string;
  textSize: string;
  glassLevel: any;
}> = ({ trend, value, label, textSize, glassLevel }) => {
  if (trend === "none" || !trend) return null;

  const trendConfig = {
    up: {
      color: "text-emerald-100",
      bgGradient: "from-emerald-400/40 to-teal-400/30",
      borderColor: "border-emerald-300/50",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M7 7l5-5 5 5" />
        </svg>
      ),
    },
    down: {
      color: "text-red-100",
      bgGradient: "from-red-400/40 to-pink-400/30",
      borderColor: "border-red-300/50",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-5 5-5-5m10 10l-5-5-5 5" />
        </svg>
      ),
    },
    stable: {
      color: "text-blue-100",
      bgGradient: "from-blue-400/40 to-cyan-400/30",
      borderColor: "border-blue-300/50",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      ),
    },
  };

  const config = trendConfig[trend];

  return (
    <motion.div
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
        ${glassLevel.backdrop} bg-gradient-to-r ${config.bgGradient}
        border ${config.borderColor} ${config.color} ${textSize} font-semibold
        shadow-glass-sm
      `}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {config.icon}
      {value && (
        <span>
          {trend === "up" ? "+" : trend === "down" ? "-" : ""}{Math.abs(value)}%
        </span>
      )}
      {label && <span className="ml-1">{label}</span>}
    </motion.div>
  );
};

// ============================================================================
// GLASS ANIMATED VALUE COUNTER
// ============================================================================

const GlassAnimatedValue: React.FC<{
  value: number | string;
  animateValue: boolean;
  prefix?: string;
  suffix?: string;
  textClass: string;
  particleEffect?: boolean;
}> = ({ value, animateValue, prefix, suffix, textClass, particleEffect }) => {
  const [showParticles, setShowParticles] = useState(false);
  const isNumeric = typeof value === "number";
  
  React.useEffect(() => {
    if (particleEffect && animateValue) {
      const timer = setTimeout(() => setShowParticles(true), 800);
      return () => clearTimeout(timer);
    }
  }, [particleEffect, animateValue]);

  if (!animateValue || !isNumeric) {
    return (
      <span className={textClass}>
        {prefix}{value}{suffix}
      </span>
    );
  }

  return (
    <div className="relative">
      <motion.span
        className={textClass}
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
      >
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {prefix}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </motion.span>
          {suffix}
        </motion.span>
      </motion.span>

      {/* Glass Particle Effect */}
      {particleEffect && showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              initial={{
                x: "50%",
                y: "50%",
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 200}%`,
                y: `${50 + (Math.random() - 0.5) * 200}%`,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// GLASS LOADING SKELETON
// ============================================================================

const GlassStatCardSkeleton: React.FC<{ 
  size: StatCardProps["size"]; 
  glassLevel: any; 
}> = ({ size, glassLevel }) => {
  return (
    <div className="animate-pulse">
      <div className={`
        ${glassLevel.backdrop} bg-white/20 border border-white/30 rounded-xl mb-3
        ${size === "sm" ? "h-6 w-16" : size === "lg" ? "h-10 w-24" : "h-8 w-20"}
      `} />
      <div className={`
        ${glassLevel.backdrop} bg-white/15 border border-white/25 rounded-lg
        ${size === "sm" ? "h-4 w-20