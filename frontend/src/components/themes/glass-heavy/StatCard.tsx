// ============================================================================
// STAT CARD GLASS HEAVY - INTENSE GLASSMORPHISM STATISTICS COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/StatCard.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import CardGlassHeavy from "./Card";
import GlassShimmer from "./effects/GlassShimmer";
import Condensation from "./effects/Condensation";
import Refraction from "./effects/Refraction";

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

const getGlassGradientStyles = (
  gradient: StatCardProps["gradient"],
  customGradient?: string
) => {
  if (gradient === "custom" && customGradient) {
    return customGradient;
  }

  const gradients = {
    mint: "bg-gradient-to-br from-emerald-400/30 via-teal-400/20 to-cyan-400/25",
    cyan: "bg-gradient-to-br from-cyan-400/30 via-blue-400/25 to-indigo-400/20",
    peach: "bg-gradient-to-br from-orange-400/25 via-pink-400/30 to-red-400/20",
    lavender:
      "bg-gradient-to-br from-purple-400/30 via-pink-400/25 to-rose-400/20",
    coral:
      "bg-gradient-to-br from-pink-400/25 via-rose-400/30 to-orange-400/20",
  };

  return gradients[gradient || "cyan"];
};

// ============================================================================
// SIZE VARIANTS (ENHANCED FOR GLASS)
// ============================================================================

const getSizeStyles = (size: StatCardProps["size"]) => {
  const sizes = {
    sm: {
      container: "p-4 min-h-[120px]",
      valueText: "text-xl md:text-2xl font-bold",
      labelText: "text-xs text-white/70",
      iconSize: "w-5 h-5",
      trendText: "text-xs",
    },
    md: {
      container: "p-6 min-h-[160px]",
      valueText: "text-3xl md:text-4xl font-bold",
      labelText: "text-sm text-white/70",
      iconSize: "w-6 h-6",
      trendText: "text-sm",
    },
    lg: {
      container: "p-8 min-h-[200px]",
      valueText: "text-4xl md:text-5xl font-bold",
      labelText: "text-base text-white/70",
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
  size: string;
}> = ({ trend, value, label, size }) => {
  if (!trend || trend === "none") return null;

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return (
          <motion.svg
            className="w-4 h-4 text-emerald-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </motion.svg>
        );
      case "down":
        return (
          <motion.svg
            className="w-4 h-4 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </motion.svg>
        );
      case "stable":
        return (
          <motion.div
            className="w-4 h-1 bg-blue-400/70 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
          />
        );
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-400";
      case "down":
        return "text-red-400";
      case "stable":
        return "text-blue-400";
      default:
        return "text-white/60";
    }
  };

  return (
    <motion.div
      className="flex items-center gap-2 backdrop-blur-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {getTrendIcon()}
      <div className={`${size} ${getTrendColor()} font-medium`}>
        {value && `${value > 0 ? "+" : ""}${value}%`}
        {label && <span className="text-white/50 ml-1">{label}</span>}
      </div>
    </motion.div>
  );
};

// ============================================================================
// GLASS LOADING SKELETON
// ============================================================================

const GlassLoadingSkeleton: React.FC<{ size: string }> = ({ size }) => {
  return (
    <div className="animate-pulse space-y-4">
      <motion.div
        className="h-8 bg-white/10 rounded-lg backdrop-blur-sm"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="h-12 bg-white/15 rounded-lg backdrop-blur-sm"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="h-4 bg-white/5 rounded-lg backdrop-blur-sm"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
};

// ============================================================================
// ANIMATED VALUE COMPONENT
// ============================================================================

const AnimatedValue: React.FC<{
  value: number | string;
  prefix?: string;
  suffix?: string;
  className?: string;
  animate?: boolean;
}> = ({ value, prefix, suffix, className, animate = true }) => {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);

  useEffect(() => {
    if (!animate || typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    const startValue = 0;
    const endValue = value;
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepValue = (endValue - startValue) / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newValue = Math.min(startValue + stepValue * currentStep, endValue);
      setDisplayValue(Math.round(newValue));

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayValue(endValue);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, animate]);

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </motion.span>
  );
};

// ============================================================================
// GLASS PARTICLES EFFECT (OPTIONAL)
// ============================================================================

const GlassParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// MAIN STATCARD GLASS HEAVY COMPONENT
// ============================================================================

const StatCardGlassHeavy: React.FC<StatCardProps> = ({
  label,
  value,
  gradient = "cyan",
  customGradient,
  icon,
  iconPosition = "left",
  trend = "none",
  trendValue,
  trendLabel,
  isLoading = false,
  animateValue = true,
  suffix = "",
  prefix = "",
  size = "md",
  variant = "default",
  className = "",
  onClick,
  glassIntensity = "medium",
  shimmer = true,
  condensation = true,
  particleEffect = false,
  ...props
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const sizeStyles = getSizeStyles(size);

  // Glass intensity mapping
  const glassIntensityMap = {
    whisper: "backdrop-blur-[6px] bg-white/15",
    light: "backdrop-blur-[12px] bg-white/20",
    medium: "backdrop-blur-[20px] bg-white/25",
    heavy: "backdrop-blur-[32px] bg-white/30",
    extreme: "backdrop-blur-[48px] bg-white/35",
  };

  const gradientStyles = getGlassGradientStyles(gradient, customGradient);
  const glassStyles = glassIntensityMap[glassIntensity];

  // Animation variants
  const cardVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
      y: 40,
      filter: "blur(20px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
    },
    hover: {
      scale: 1.02,
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        className={`
          relative overflow-hidden rounded-2xl border border-white/20
          ${glassStyles} ${gradientStyles} ${sizeStyles.container}
          shadow-lg shadow-black/10 ${className}
        `}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {shimmer && <GlassShimmer />}
        <GlassLoadingSkeleton size={sizeStyles.trendText} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl border border-white/30 cursor-pointer
        ${glassStyles} ${gradientStyles} ${sizeStyles.container}
        shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30
        transition-all duration-300 ${className}
      `}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      exit="exit"
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {/* Glass Effects Layer */}
      {shimmer && <GlassShimmer intensity={glassIntensity} />}
      {condensation && <Condensation density={isHovered ? "high" : "medium"} />}
      <Refraction intensity={isHovered ? "high" : "low"} />

      {/* Particle Effects (Optional) */}
      {particleEffect && <GlassParticles />}

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header Section */}
        <div
          className={`flex items-center ${iconPosition === "top" ? "flex-col" : "flex-row"} gap-3 mb-4`}
        >
          {icon && (
            <motion.div
              className={`
                ${sizeStyles.iconSize} text-white/80 flex-shrink-0
                ${iconPosition === "top" ? "mb-2" : ""}
              `}
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {icon}
            </motion.div>
          )}

          <motion.h3
            className={`${sizeStyles.labelText} font-medium tracking-wide uppercase ${iconPosition === "top" ? "text-center" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {label}
          </motion.h3>
        </div>

        {/* Value Section */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatedValue
            value={value}
            prefix={prefix}
            suffix={suffix}
            animate={animateValue}
            className={`${sizeStyles.valueText} text-white font-bold tracking-tight text-center`}
          />
        </div>

        {/* Trend Section */}
        {trend !== "none" && (
          <div className="mt-auto pt-4 flex justify-center">
            <GlassTrendIndicator
              trend={trend}
              value={trendValue}
              label={trendLabel}
              size={sizeStyles.trendText}
            />
          </div>
        )}
      </div>

      {/* Enhanced Glass Reflection */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"
        animate={{
          opacity: isHovered ? 0.3 : 0.1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Corner Highlight */}
      <motion.div
        className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full"
        animate={{
          opacity: isHovered ? 1 : 0.6,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default StatCardGlassHeavy;
