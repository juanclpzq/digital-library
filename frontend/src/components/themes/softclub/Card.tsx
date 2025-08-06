// ============================================================================
// CARD SOFTCLUB - GEN X NOSTALGIC CARD COMPONENT
// FILE LOCATION: src/components/themes/softclub/Card.tsx
// ============================================================================

import React from "react";
import { motion } from "framer-motion";
import { softclubColors, getGlowEffect } from "@/theme/softclub";

// ============================================================================
// CARD PROPS INTERFACE
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
}

// ============================================================================
// SOFTCLUB CARD VARIANTS
// ============================================================================

const getSoftclubVariantStyles = (variant: CardProps["variant"]) => {
  const variants = {
    default: `
      bg-gradient-to-br from-cloud-white/60 to-silver-matte/20
      shadow-soft border border-cloud-white/30
    `,

    elevated: `
      bg-gradient-to-br from-cloud-white/80 to-silver-matte/30
      shadow-soft-hover border border-cloud-white/40
    `,

    outlined: `
      bg-transparent border-2 border-soft-cyan/40
      shadow-none hover:shadow-cyan-glow hover:bg-soft-cyan/5
    `,

    filled: `
      bg-gradient-to-br from-soft-cyan/20 to-lavender-mist/15
      shadow-gentle border border-soft-cyan/30
    `,

    ghost: `
      bg-cloud-white/20 shadow-none border border-transparent
      hover:bg-cloud-white/30 hover:border-silver-matte/30
    `,
  };

  return variants[variant || "default"];
};

// ============================================================================
// SIZE VARIANTS
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
// ROUNDED VARIANTS
// ============================================================================

const getRoundedStyles = (rounded: CardProps["rounded"]) => {
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-softclub",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-3xl",
  };

  return roundedStyles[rounded || "md"];
};

// ============================================================================
// SHADOW VARIANTS
// ============================================================================

const getShadowStyles = (shadow: CardProps["shadow"]) => {
  const shadows = {
    none: "shadow-none",
    sm: "shadow-gentle",
    md: "shadow-soft",
    lg: "shadow-soft-hover",
    xl: "shadow-floating-hover",
  };

  return shadows[shadow || "md"];
};

// ============================================================================
// GRADIENT VARIANTS
// ============================================================================

const getGradientStyles = (gradient: CardProps["gradient"]) => {
  const gradients = {
    none: "",
    soft: "bg-gradient-to-br from-cloud-white/80 via-soft-cyan/10 to-lavender-mist/15",
    vibrant:
      "bg-gradient-to-br from-mint-dream/30 via-soft-cyan/20 to-peachy-keen/15",
    sunset:
      "bg-gradient-to-br from-peachy-keen/25 via-sunset-coral/15 to-peach-whisper/20",
    mint: "bg-gradient-to-br from-mint-dream/25 via-aqua-mist/15 to-mint-frost/20",
  };

  return gradients[gradient || "none"];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CardSoftclub: React.FC<CardProps> = ({
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
  className = "",
  onClick,
  ...props
}) => {
  // ============================================================================
  // DYNAMIC STYLES
  // ============================================================================

  const variantStyles = getSoftclubVariantStyles(variant);
  const sizeStyles = size ? getSizeStyles(size) : "";
  const paddingStyles = getPaddingStyles(padding);
  const roundedStyles = getRoundedStyles(rounded);
  const shadowStyles = shadow ? getShadowStyles(shadow) : "";
  const gradientStyles = getGradientStyles(gradient);
  const glowStyles = glow ? getGlowEffect("softCyan") : "";

  const baseStyles = `
    relative transition-all duration-500 ease-soft
    ${clickable || onClick ? "cursor-pointer" : ""}
    ${hover ? "hover:scale-102 hover:-translate-y-1" : ""}
    ${variantStyles}
    ${sizeStyles}
    ${roundedStyles}
    ${shadowStyles}
    ${glowStyles}
    ${gradientStyles ? gradientStyles : ""}
    ${className}
  `;

  const contentStyles = `
    relative z-10
    ${paddingStyles}
  `;

  // ============================================================================
  // LOADING COMPONENT
  // ============================================================================

  const LoadingOverlay = () => (
    <motion.div
      className="absolute inset-0 bg-cloud-white/60 backdrop-blur-sm rounded-[inherit] flex items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="w-8 h-8 border-3 border-soft-cyan border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-sm font-medium text-midnight-navy/70">
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
      whileHover={
        hover || clickable
          ? {
              scale: 1.02,
              y: -4,
              transition: { duration: 0.3, ease: "easeOut" },
            }
          : undefined
      }
      whileTap={clickable ? { scale: 0.98 } : undefined}
      layout
      {...props}
    >
      {/* Gentle Background Pattern */}
      <div className="absolute inset-0 rounded-[inherit] opacity-[0.02] pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-midnight-navy via-transparent to-midnight-navy" />
      </div>

      {/* Header */}
      {header && (
        <motion.div
          className={`
            border-b border-silver-matte/30 
            ${padding === "none" ? "p-4 pb-3" : "px-6 pt-6 pb-3"}
          `}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {header}
        </motion.div>
      )}

      {/* Main Content */}
      <div className={contentStyles}>{children}</div>

      {/* Footer */}
      {footer && (
        <motion.div
          className={`
            border-t border-silver-matte/30 
            ${padding === "none" ? "p-4 pt-3" : "px-6 pb-6 pt-3"}
          `}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        >
          {footer}
        </motion.div>
      )}

      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}

      {/* Hover Shine Effect */}
      {(hover || clickable) && (
        <div className="absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-cloud-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// CARD HEADER COMPONENT
// ============================================================================

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const CardHeaderSoftclub: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  avatar,
  action,
  className = "",
  children,
}) => {
  if (children) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Avatar */}
      {avatar && <div className="flex-shrink-0">{avatar}</div>}

      {/* Title & Subtitle */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-lg font-bold text-midnight-navy mb-1 font-softclub-display">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-midnight-navy/70 font-softclub">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action */}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

// ============================================================================
// CARD FOOTER COMPONENT
// ============================================================================

interface CardFooterProps {
  actions?: React.ReactNode[];
  align?: "left" | "center" | "right" | "between";
  className?: string;
  children?: React.ReactNode;
}

export const CardFooterSoftclub: React.FC<CardFooterProps> = ({
  actions,
  align = "right",
  className = "",
  children,
}) => {
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
        <div key={index}>{action}</div>
      ))}
    </div>
  );
};

// ============================================================================
// CARD GROUP COMPONENT
// ============================================================================

interface CardGroupProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export const CardGroupSoftclub: React.FC<CardGroupProps> = ({
  children,
  columns = 3,
  gap = "md",
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
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div
      className={`
      grid ${columnStyles[columns]} ${gapStyles[gap]}
      ${className}
    `}
    >
      {children}
    </div>
  );
};

// ============================================================================
// INTERACTIVE CARD VARIANT
// ============================================================================

interface InteractiveCardProps extends CardProps {
  onExpand?: () => void;
  expanded?: boolean;
  expandable?: boolean;
}

export const InteractiveCardSoftclub: React.FC<InteractiveCardProps> = ({
  onExpand,
  expanded = false,
  expandable = false,
  children,
  ...props
}) => {
  return (
    <CardSoftclub
      {...props}
      clickable={expandable}
      onClick={expandable ? onExpand : props.onClick}
      hover={expandable || props.hover}
    >
      {/* Expandable Indicator */}
      {expandable && (
        <motion.div
          className="absolute top-4 right-4 text-midnight-navy/60"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      )}

      {children}
    </CardSoftclub>
  );
};

export default CardSoftclub;
