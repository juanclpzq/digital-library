// ============================================================================
// STAT CARD SOFTCLUB - GEN X NOSTALGIC STATISTICS COMPONENT
// FILE LOCATION: src/components/themes/softclub/StatCard.tsx
// ============================================================================

import React from "react";
import { motion } from "framer-motion";
import CardSoftclub from "./Card";
import { softclubColors, softclubGradients } from "@/theme/softclub";

// ============================================================================
// STAT CARD PROPS INTERFACE
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
}

// ============================================================================
// SOFTCLUB GRADIENT MAPPINGS
// ============================================================================

const getSoftclubGradientStyles = (
  gradient: StatCardProps["gradient"],
  customGradient?: string
) => {
  if (gradient === "custom" && customGradient) {
    return customGradient;
  }

  const gradients = {
    mint: "bg-gradient-to-br from-mint-dream/30 via-aqua-mist/20 to-mint-frost/25",
    cyan: "bg-gradient-to-br from-soft-cyan/30 via-aqua-mist/25 to-lavender-mist/20",
    peach:
      "bg-gradient-to-br from-peachy-keen/25 via-peach-whisper/30 to-coral-glow/20",
    lavender:
      "bg-gradient-to-br from-lavender-mist/30 via-lavender-blush/25 to-peachy-keen/15",
    coral:
      "bg-gradient-to-br from-sunset-coral/25 via-coral-glow/30 to-peach-whisper/20",
  };

  return gradients[gradient || "mint"];
};

// ============================================================================
// SIZE VARIANTS
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
// TREND INDICATORS
// ============================================================================

const TrendIndicator: React.FC<{
  trend: StatCardProps["trend"];
  value?: number;
  label?: string;
  textSize: string;
}> = ({ trend, value, label, textSize }) => {
  if (trend === "none" || !trend) return null;

  const trendConfig = {
    up: {
      color: "text-mint-dream",
      bgColor: "bg-mint-dream/20",
      icon: (
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
            d="M7 17l5-5 5 5M7 7l5-5 5 5"
          />
        </svg>
      ),
    },
    down: {
      color: "text-sunset-coral",
      bgColor: "bg-sunset-coral/20",
      icon: (
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
            d="M17 7l-5 5-5-5m10 10l-5-5-5 5"
          />
        </svg>
      ),
    },
    stable: {
      color: "text-soft-cyan",
      bgColor: "bg-soft-cyan/20",
      icon: (
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
            d="M20 12H4"
          />
        </svg>
      ),
    },
  };

  const config = trendConfig[trend];

  return (
    <motion.div
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full
        ${config.bgColor} ${config.color} ${textSize} font-medium
      `}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {config.icon}
      {value && (
        <span>
          {trend === "up" ? "+" : trend === "down" ? "-" : ""}
          {Math.abs(value)}%
        </span>
      )}
      {label && <span className="ml-1">{label}</span>}
    </motion.div>
  );
};

// ============================================================================
// ANIMATED VALUE COUNTER
// ============================================================================

const AnimatedValue: React.FC<{
  value: number | string;
  animateValue: boolean;
  prefix?: string;
  suffix?: string;
  textClass: string;
}> = ({ value, animateValue, prefix, suffix, textClass }) => {
  const isNumeric = typeof value === "number";

  if (!animateValue || !isNumeric) {
    return (
      <span className={textClass}>
        {prefix}
        {value}
        {suffix}
      </span>
    );
  }

  return (
    <motion.span
      className={textClass}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.span
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {prefix}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.span>
  );
};

// ============================================================================
// LOADING STATE COMPONENT
// ============================================================================

const StatCardSkeleton: React.FC<{ size: StatCardProps["size"] }> = ({
  size,
}) => {
  const sizeStyles = getSizeStyles(size);

  return (
    <div className="animate-soft-pulse">
      <div
        className={`bg-silver-matte/40 rounded-gentle mb-2 ${
          size === "sm" ? "h-6 w-16" : size === "lg" ? "h-10 w-24" : "h-8 w-20"
        }`}
      />
      <div
        className={`bg-silver-matte/30 rounded-gentle ${
          size === "sm" ? "h-4 w-20" : size === "lg" ? "h-5 w-28" : "h-4 w-24"
        }`}
      />
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StatCardSoftclub: React.FC<StatCardProps> = ({
  label,
  value,
  gradient = "mint",
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
}) => {
  // ============================================================================
  // DYNAMIC STYLES
  // ============================================================================

  const gradientStyles = getSoftclubGradientStyles(gradient, customGradient);
  const sizeConfig = getSizeStyles(size);
  const isClickable = Boolean(onClick);

  // ============================================================================
  // VARIANT LAYOUTS
  // ============================================================================

  const renderContent = () => {
    if (isLoading) {
      return <StatCardSkeleton size={size} />;
    }

    switch (variant) {
      case "minimal":
        return (
          <div className="text-center">
            <AnimatedValue
              value={value}
              animateValue={animateValue}
              prefix={prefix}
              suffix={suffix}
              textClass={`${sizeConfig.valueText} text-midnight-navy mb-1 font-softclub-display`}
            />
            <p
              className={`${sizeConfig.labelText} text-midnight-navy/70 font-medium`}
            >
              {label}
            </p>
          </div>
        );

      case "compact":
        return (
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={`${sizeConfig.iconSize} text-midnight-navy/80 flex-shrink-0`}
              >
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <AnimatedValue
                value={value}
                animateValue={animateValue}
                prefix={prefix}
                suffix={suffix}
                textClass={`${sizeConfig.valueText} text-midnight-navy font-softclub-display`}
              />
              <p
                className={`${sizeConfig.labelText} text-midnight-navy/70 font-medium truncate`}
              >
                {label}
              </p>
            </div>
          </div>
        );

      case "detailed":
        return (
          <div>
            {/* Header with Icon and Label */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {icon && (
                  <div
                    className={`${sizeConfig.iconSize} text-midnight-navy/80`}
                  >
                    {icon}
                  </div>
                )}
                <p
                  className={`${sizeConfig.labelText} text-midnight-navy/70 font-semibold`}
                >
                  {label}
                </p>
              </div>
              <TrendIndicator
                trend={trend}
                value={trendValue}
                label={trendLabel}
                textSize={sizeConfig.trendText}
              />
            </div>

            {/* Value */}
            <AnimatedValue
              value={value}
              animateValue={animateValue}
              prefix={prefix}
              suffix={suffix}
              textClass={`${sizeConfig.valueText} text-midnight-navy font-softclub-display leading-tight`}
            />

            {/* Trend Bar */}
            {trend !== "none" && trendValue && (
              <motion.div
                className="mt-3 h-1 bg-silver-matte/30 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className={`h-full ${
                    trend === "up"
                      ? "bg-mint-dream"
                      : trend === "down"
                        ? "bg-sunset-coral"
                        : "bg-soft-cyan"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.abs(trendValue), 100)}%` }}
                  transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                />
              </motion.div>
            )}
          </div>
        );

      default: // "default"
        if (iconPosition === "top") {
          return (
            <div className="text-center">
              {icon && (
                <motion.div
                  className={`${sizeConfig.iconSize} text-midnight-navy/80 mx-auto mb-3`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {icon}
                </motion.div>
              )}
              <AnimatedValue
                value={value}
                animateValue={animateValue}
                prefix={prefix}
                suffix={suffix}
                textClass={`${sizeConfig.valueText} text-midnight-navy mb-2 font-softclub-display`}
              />
              <p
                className={`${sizeConfig.labelText} text-midnight-navy/70 font-medium mb-2`}
              >
                {label}
              </p>
              <TrendIndicator
                trend={trend}
                value={trendValue}
                label={trendLabel}
                textSize={sizeConfig.trendText}
              />
            </div>
          );
        }

        return (
          <div>
            <div className="flex items-start gap-3 mb-3">
              {icon && (
                <motion.div
                  className={`${sizeConfig.iconSize} text-midnight-navy/80 mt-1 flex-shrink-0`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {icon}
                </motion.div>
              )}
              <div className="flex-1 min-w-0">
                <AnimatedValue
                  value={value}
                  animateValue={animateValue}
                  prefix={prefix}
                  suffix={suffix}
                  textClass={`${sizeConfig.valueText} text-midnight-navy mb-1 font-softclub-display`}
                />
                <p
                  className={`${sizeConfig.labelText} text-midnight-navy/70 font-medium`}
                >
                  {label}
                </p>
              </div>
            </div>
            <TrendIndicator
              trend={trend}
              value={trendValue}
              label={trendLabel}
              textSize={sizeConfig.trendText}
            />
          </div>
        );
    }
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <CardSoftclub
      variant="filled"
      size={undefined}
      padding={sizeConfig.padding as any}
      hover={isClickable}
      clickable={isClickable}
      onClick={onClick}
      glow={isClickable}
      className={`
        ${gradientStyles}
        border border-cloud-white/40 shadow-gentle
        transition-all duration-500 ease-soft
        ${isClickable ? "hover:shadow-soft-hover cursor-pointer" : ""}
        ${className}
      `}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 rounded-[inherit] opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-midnight-navy via-transparent to-midnight-navy" />
      </div>

      {/* Content */}
      <div className="relative z-10">{renderContent()}</div>

      {/* Gentle Shine Effect for Clickable Cards */}
      {isClickable && (
        <div className="absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-cloud-white/15 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}
    </CardSoftclub>
  );
};

// ============================================================================
// STAT CARD GROUP COMPONENT
// ============================================================================

interface StatCardGroupProps {
  stats: StatCardProps[];
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  uniformSize?: StatCardProps["size"];
  className?: string;
}

export const StatCardGroupSoftclub: React.FC<StatCardGroupProps> = ({
  stats,
  columns = 4,
  gap = "md",
  uniformSize,
  className = "",
}) => {
  const gapStyles = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  const columnStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <motion.div
      className={`
        grid ${columnStyles[columns]} ${gapStyles[gap]}
        ${className}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatCardSoftclub {...stat} size={uniformSize || stat.size} />
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============================================================================
// COMPARISON STAT CARD
// ============================================================================

interface ComparisonStatCardProps extends Omit<StatCardProps, "value"> {
  currentValue: number;
  previousValue: number;
  comparisonLabel?: string;
  showPercentage?: boolean;
}

export const ComparisonStatCardSoftclub: React.FC<ComparisonStatCardProps> = ({
  currentValue,
  previousValue,
  comparisonLabel = "vs previous",
  showPercentage = true,
  ...props
}) => {
  const difference = currentValue - previousValue;
  const percentageChange =
    previousValue !== 0 ? (difference / previousValue) * 100 : 0;

  const trend = difference > 0 ? "up" : difference < 0 ? "down" : "stable";

  return (
    <StatCardSoftclub
      {...props}
      value={currentValue}
      trend={trend}
      trendValue={
        showPercentage ? Math.abs(percentageChange) : Math.abs(difference)
      }
      trendLabel={comparisonLabel}
      variant="detailed"
    />
  );
};

export default StatCardSoftclub;
