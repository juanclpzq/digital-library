// ============================================================================
// CARD GLASS HEAVY - INTENSE GLASSMORPHISM CARD COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/Card.tsx
// ============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import GlassLayers from "./effects/GlassLayers";
import GlassShimmer from "./effects/GlassShimmer";
import Condensation from "./effects/Condensation";
import Refraction from "./effects/Refrations";

// ============================================================================
// CARD PROPS INTERFACE (SAME AS SOFTCLUB + GLASS EXTRAS)
// ============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "filled" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  gradient?: "none" | "soft" | "vibrant" | "sunset" | "mint";
  hover?: boolean;
  clickable?: boolean;
  loading?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  glassLayers?: number;
  shimmer?: boolean;
  condensation?: boolean;
  refraction?: boolean;
  tint?: string;
}

// ============================================================================
// GLASS HEAVY CARD VARIANTS
// ============================================================================

const getGlassVariantStyles = (
  variant: CardProps["variant"],
  glassLevel: string
) => {
  const variants = {
    default: `
      ${glassLevel} bg-gradient-to-br from-white/20 to-white/5
      border border-white/30 shadow-glass-md
    `,

    elevated: `
      ${glassLevel} bg-gradient-to-br from-white/30 to-white/10
      border border-white/40 shadow-glass-lg
    `,

    outlined: `
      ${glassLevel} bg-transparent border-2 border-white/50
      shadow-none hover:shadow-glass-sm hover:bg-white/10
    `,

    filled: `
      ${glassLevel} bg-gradient-to-br from-white/35 to-white/15
      border border-white/35 shadow-glass-md
    `,

    ghost: `
      ${glassLevel} bg-white/10 shadow-none border border-transparent
      hover:bg-white/20 hover:border-white/25
    `,
  };

  return variants[variant || "default"];
};

// ============================================================================
// SIZE VARIANTS (SAME AS SOFTCLUB)
// ============================================================================

const getSizeStyles = (size: CardProps["size"]) => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return sizes[size || "md"];
};

// ============================================================================
// PADDING VARIANTS
// ============================================================================

const getPaddingStyles = (padding: CardProps["padding"]) => {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  return paddings[padding || "md"];
};

// ============================================================================
// ROUNDED VARIANTS (GLASS APPROPRIATE)
// ============================================================================

const getRoundedStyles = (rounded: CardProps["rounded"]) => {
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-3xl",
  };

  return roundedStyles[rounded || "md"];
};

// ============================================================================
// GLASS SHADOW VARIANTS
// ============================================================================

const getGlassShadowStyles = (shadow: CardProps["shadow"]) => {
  const shadows = {
    none: "shadow-none",
    sm: "shadow-glass-sm",
    md: "shadow-glass-md",
    lg: "shadow-glass-lg",
    xl: "shadow-glass-xl",
  };

  return shadows[shadow || "md"];
};

// ============================================================================
// GLASS GRADIENT VARIANTS
// ============================================================================

const getGlassGradientStyles = (gradient: CardProps["gradient"]) => {
  const gradients = {
    none: "",
    soft: "bg-gradient-to-br from-white/25 via-blue-400/10 to-purple-400/10",
    vibrant:
      "bg-gradient-to-br from-cyan-400/20 via-blue-400/15 to-purple-400/20",
    sunset:
      "bg-gradient-to-br from-orange-400/20 via-pink-400/15 to-red-400/20",
    mint: "bg-gradient-to-br from-emerald-400/20 via-teal-400/15 to-cyan-400/20",
  };

  return gradients[gradient || "none"];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CardGlassHeavy: React.FC<CardProps> = ({
  variant = "default",
  size,
  rounded = "md",
  padding = "md",
  shadow,
  glow = false,
  gradient = "none",
  hover = false,
  clickable = false,
  loading = false,
  header,
  footer,
  children,
  glassIntensity,
  glassLayers = 2,
  shimmer = true,
  condensation = false,
  refraction = true,
  tint = "from-white/25 to-white/10",
  className = "",
  onClick,
  ...props
}) => {
  // ============================================================================
  // STATE & THEME
  // ============================================================================

  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const intensity = glassIntensity || theme.glassIntensity;
  const glassLevel = theme.glassHeavy.levels[intensity];

  // ============================================================================
  // DYNAMIC STYLES
  // ============================================================================

  const variantStyles = getGlassVariantStyles(variant, glassLevel.backdrop);
  const sizeStyles = size ? getSizeStyles(size) : "";
  const paddingStyles = getPaddingStyles(padding);
  const roundedStyles = getRoundedStyles(rounded);
  const shadowStyles = shadow ? getGlassShadowStyles(shadow) : "";
  const gradientStyles = getGlassGradientStyles(gradient);

  const baseStyles = `
    relative transition-all duration-400 ease-out overflow-hidden
    ${clickable || onClick ? "cursor-pointer" : ""}
    ${hover ? "hover:scale-[1.02] hover:-translate-y-1" : ""}
    ${variantStyles}
    ${sizeStyles}
    ${roundedStyles}
    ${shadowStyles}
    ${gradientStyles ? gradientStyles : ""}
    ${className}
  `;

  const contentStyles = `
    relative z-20
    ${paddingStyles}
  `;

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // ============================================================================
  // GLASS LOADING COMPONENT
  // ============================================================================

  const GlassLoadingOverlay = () => (
    <motion.div
      className={`
        absolute inset-0 ${theme.glassHeavy.levels.heavy.backdrop} 
        bg-white/40 rounded-[inherit] flex items-center justify-center z-30
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-10 h-10 border-3 border-white/60 border-t-white/90 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-sm font-semibold text-gray-900/80">
          Loading...
        </span>
      </div>
    </motion.div>
  );

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <motion.div
      className={baseStyles}
      onClick={clickable || onClick ? onClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={
        hover || clickable
          ? {
              scale: 1.02,
              y: -4,
              transition: { duration: 0.4, ease: "easeOut" },
            }
          : undefined
      }
      whileTap={clickable ? { scale: 0.98 } : undefined}
      layout
      {...props}
    >
      {/* Glass Layers Effect */}
      <GlassLayers
        layers={glassLayers}
        intensity={intensity}
        tint={tint}
        animated={isHovered}
      />

      {/* Glass Refraction Lines */}
      {refraction && (
        <Refraction
          intensity={intensity === "extreme" ? "strong" : "medium"}
          animated={isHovered}
          direction="all"
        />
      )}

      {/* Glass Shimmer Effect */}
      {shimmer && (
        <GlassShimmer
          trigger={isHovered ? "hover" : "auto"}
          intensity={0.3}
          duration={2.5}
          repeatDelay={6}
          direction="diagonal"
        />
      )}

      {/* Condensation Effect */}
      {condensation && (
        <Condensation
          trigger="hover"
          intensity={0.4}
          duration={2}
          dropletsCount={8}
        />
      )}

      {/* Header Section */}
      {header && (
        <motion.div
          className={`
            relative z-20 border-b border-white/20
            ${theme.glassHeavy.levels.light.backdrop} bg-white/10
            ${padding === "none" ? "p-4 pb-3" : "px-6 pt-6 pb-4"}
          `}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Header Refraction Line */}
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          {header}
        </motion.div>
      )}

      {/* Main Content */}
      <div className={contentStyles}>{children}</div>

      {/* Footer Section */}
      {footer && (
        <motion.div
          className={`
            relative z-20 border-t border-white/20
            ${theme.glassHeavy.levels.light.backdrop} bg-white/10
            ${padding === "none" ? "p-4 pt-3" : "px-6 pb-6 pt-4"}
          `}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          {/* Footer Refraction Line */}
          <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          {footer}
        </motion.div>
      )}

      {/* Glass Loading Overlay */}
      <AnimatePresence>{loading && <GlassLoadingOverlay />}</AnimatePresence>

      {/* Enhanced Glass Depth Layer */}
      <div className="absolute inset-2 rounded-[inherit] border border-white/15 bg-gradient-to-br from-white/8 to-transparent pointer-events-none opacity-60 z-10" />

      {/* Glow Effect */}
      {glow && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] shadow-2xl shadow-white/30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
};

// ============================================================================
// GLASS CARD HEADER COMPONENT
// ============================================================================

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  glassIntensity?: CardProps["glassIntensity"];
  className?: string;
  children?: React.ReactNode;
}

export const CardHeaderGlassHeavy: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  avatar,
  action,
  glassIntensity = "medium",
  className = "",
  children,
}) => {
  const theme = useTheme();

  if (children) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Avatar */}
      {avatar && (
        <div className="flex-shrink-0">
          {typeof avatar === "string" ? (
            <div
              className={`
              w-12 h-12 rounded-full ${theme.glassHeavy.levels[glassIntensity].backdrop}
              bg-white/25 border border-white/40 flex items-center justify-center
              text-lg font-bold text-gray-900/80
            `}
            >
              {avatar.charAt(0).toUpperCase()}
            </div>
          ) : (
            avatar
          )}
        </div>
      )}

      {/* Title & Subtitle */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-lg font-bold text-gray-900/95 mb-1 font-softclub-display">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-900/70 font-medium">{subtitle}</p>
        )}
      </div>

      {/* Action */}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

// ============================================================================
// GLASS CARD FOOTER COMPONENT
// ============================================================================

interface CardFooterProps {
  actions?: React.ReactNode[];
  align?: "left" | "center" | "right" | "between";
  glassIntensity?: CardProps["glassIntensity"];
  className?: string;
  children?: React.ReactNode;
}

export const CardFooterGlassHeavy: React.FC<CardFooterProps> = ({
  actions,
  align = "right",
  glassIntensity = "light",
  className = "",
  children,
}) => {
  const theme = useTheme();

  if (children) {
    return <div className={className}>{children}</div>;
  }

  const alignmentStyles = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={`flex items-center gap-3 ${alignmentStyles[align]} ${className}`}
    >
      {actions?.map((action, index) => (
        <div
          key={index}
          className={`
          ${theme.glassHeavy.levels[glassIntensity].backdrop} 
          bg-white/15 border border-white/25 rounded-lg p-2
        `}
        >
          {action}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// GLASS CARD GROUP COMPONENT
// ============================================================================

interface CardGroupProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  glassIntensity?: CardProps["glassIntensity"];
  className?: string;
}

export const CardGroupGlassHeavy: React.FC<CardGroupProps> = ({
  children,
  columns = 3,
  gap = "md",
  glassIntensity = "light",
  className = "",
}) => {
  const theme = useTheme();

  const gapStyles = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  const columnStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div
      className={`
      relative grid ${columnStyles[columns]} ${gapStyles[gap]}
      ${theme.glassHeavy.levels[glassIntensity].backdrop} 
      bg-white/10 border border-white/20 rounded-3xl p-6
      ${className}
    `}
    >
      {/* Group Glass Effects */}
      <GlassShimmer
        trigger="auto"
        intensity={0.15}
        duration={4}
        repeatDelay={10}
        direction="horizontal"
        className="absolute inset-0"
      />

      {children}
    </div>
  );
};

// ============================================================================
// INTERACTIVE GLASS CARD VARIANT
// ============================================================================

interface InteractiveCardProps extends CardProps {
  onExpand?: () => void;
  expanded?: boolean;
  expandable?: boolean;
}

export const InteractiveCardGlassHeavy: React.FC<InteractiveCardProps> = ({
  onExpand,
  expanded = false,
  expandable = false,
  glassIntensity = "heavy",
  children,
  ...props
}) => {
  const theme = useTheme();

  return (
    <CardGlassHeavy
      {...props}
      clickable={expandable}
      onClick={expandable ? onExpand : props.onClick}
      hover={expandable || props.hover}
      glassIntensity={glassIntensity}
      condensation={expandable}
    >
      {/* Glass Expandable Indicator */}
      {expandable && (
        <motion.div
          className={`
            absolute top-4 right-4 z-30
            ${theme.glassHeavy.levels.medium.backdrop} bg-white/25 
            border border-white/40 rounded-lg p-2
            text-gray-900/80 hover:bg-white/35
          `}
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
      )}

      {children}
    </CardGlassHeavy>
  );
};

// ============================================================================
// FLOATING GLASS CARD VARIANT
// ============================================================================

interface FloatingCardProps extends CardProps {
  elevation?: "low" | "medium" | "high" | "extreme";
}

export const FloatingCardGlassHeavy: React.FC<FloatingCardProps> = ({
  elevation = "medium",
  glassIntensity = "extreme",
  children,
  ...props
}) => {
  const elevationStyles = {
    low: "hover:scale-[1.01] hover:-translate-y-1 shadow-glass-md",
    medium: "hover:scale-[1.02] hover:-translate-y-2 shadow-glass-lg",
    high: "hover:scale-[1.03] hover:-translate-y-4 shadow-glass-xl",
    extreme:
      "hover:scale-[1.04] hover:-translate-y-6 shadow-2xl shadow-white/20",
  };

  return (
    <motion.div
      className="relative"
      whileHover={{
        filter: "drop-shadow(0 20px 40px rgba(255,255,255,0.2))",
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <CardGlassHeavy
        {...props}
        glassIntensity={glassIntensity}
        hover={true}
        shimmer={true}
        condensation={true}
        refraction={true}
        glassLayers={3}
        className={`${elevationStyles[elevation]} ${props.className || ""}`}
      >
        {children}
      </CardGlassHeavy>
    </motion.div>
  );
};

// ============================================================================
// GLASS CARD WITH DYNAMIC TINT
// ============================================================================

interface DynamicTintCardProps extends CardProps {
  primaryColor?: "blue" | "purple" | "cyan" | "emerald" | "pink" | "orange";
  intensity?: "subtle" | "moderate" | "vibrant";
}

export const DynamicTintCardGlassHeavy: React.FC<DynamicTintCardProps> = ({
  primaryColor = "blue",
  intensity = "moderate",
  children,
  ...props
}) => {
  const colorTints = {
    blue: {
      subtle: "from-blue-400/15 to-blue-400/5",
      moderate: "from-blue-400/25 to-blue-400/10",
      vibrant: "from-blue-400/35 to-blue-400/15",
    },
    purple: {
      subtle: "from-purple-400/15 to-purple-400/5",
      moderate: "from-purple-400/25 to-purple-400/10",
      vibrant: "from-purple-400/35 to-purple-400/15",
    },
    cyan: {
      subtle: "from-cyan-400/15 to-cyan-400/5",
      moderate: "from-cyan-400/25 to-cyan-400/10",
      vibrant: "from-cyan-400/35 to-cyan-400/15",
    },
    emerald: {
      subtle: "from-emerald-400/15 to-emerald-400/5",
      moderate: "from-emerald-400/25 to-emerald-400/10",
      vibrant: "from-emerald-400/35 to-emerald-400/15",
    },
    pink: {
      subtle: "from-pink-400/15 to-pink-400/5",
      moderate: "from-pink-400/25 to-pink-400/10",
      vibrant: "from-pink-400/35 to-pink-400/15",
    },
    orange: {
      subtle: "from-orange-400/15 to-orange-400/5",
      moderate: "from-orange-400/25 to-orange-400/10",
      vibrant: "from-orange-400/35 to-orange-400/15",
    },
  };

  const tint = colorTints[primaryColor][intensity];

  return (
    <CardGlassHeavy {...props} tint={tint} shimmer={true} glassLayers={2}>
      {children}
    </CardGlassHeavy>
  );
};

// ============================================================================
// CONTEXT CARD (FOR NOTIFICATIONS/ALERTS)
// ============================================================================

interface ContextCardProps extends Omit<CardProps, "variant"> {
  context?: "info" | "success" | "warning" | "error" | "neutral";
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

export const ContextCardGlassHeavy: React.FC<ContextCardProps> = ({
  context = "neutral",
  dismissible = false,
  onDismiss,
  icon,
  children,
  ...props
}) => {
  const theme = useTheme();

  const contextStyles = {
    info: "from-blue-400/25 to-cyan-400/15 border-blue-300/50",
    success: "from-emerald-400/25 to-teal-400/15 border-emerald-300/50",
    warning: "from-yellow-400/25 to-orange-400/15 border-yellow-300/50",
    error: "from-red-400/25 to-pink-400/15 border-red-300/50",
    neutral: "from-white/25 to-white/15 border-white/30",
  };

  const contextIcons = {
    info: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    success: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    neutral: null,
  };

  return (
    <CardGlassHeavy
      {...props}
      className={`bg-gradient-to-br ${contextStyles[context]} ${props.className || ""}`}
      shimmer={true}
      refraction={true}
    >
      <div className="flex items-start gap-3">
        {/* Context Icon */}
        {(icon || contextIcons[context]) && (
          <div className="flex-shrink-0 mt-0.5 text-gray-900/80">
            {icon || contextIcons[context]}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>

        {/* Dismiss Button */}
        {dismissible && (
          <motion.button
            onClick={onDismiss}
            className={`
              flex-shrink-0 ${theme.glassHeavy.levels.light.backdrop} 
              bg-white/20 border border-white/30 rounded-lg p-1
              text-gray-900/60 hover:text-gray-900/90 hover:bg-white/30
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}
      </div>
    </CardGlassHeavy>
  );
};

export default CardGlassHeavy;
