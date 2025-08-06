// ============================================================================
// BUTTON GLASS HEAVY - INTENSE GLASSMORPHISM BUTTON COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/Button.tsx
// ============================================================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import GlassShimmer from "./effects/GlassShimmer";
import Condensation from "./effects/Condensation";

// ============================================================================
// BUTTON PROPS INTERFACE (SAME AS SOFTCLUB FOR COMPATIBILITY)
// ============================================================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "success"
    | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  glow?: boolean;
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  condensation?: boolean;
  shimmer?: boolean;
  children: React.ReactNode;
}

// ============================================================================
// GLASS HEAVY BUTTON VARIANTS
// ============================================================================

const getGlassVariantStyles = (
  variant: ButtonProps["variant"],
  glassLevel: string
) => {
  const variants = {
    primary: `
      ${glassLevel} bg-gradient-to-r from-blue-400/30 to-purple-400/30
      border border-blue-300/50 text-white font-bold
      shadow-glass-lg shadow-blue-500/25
      hover:from-blue-400/40 hover:to-purple-400/40
      hover:border-blue-300/70 hover:shadow-glass-xl hover:shadow-blue-500/35
      active:from-blue-400/50 active:to-purple-400/50
    `,

    secondary: `
      ${glassLevel} bg-gradient-to-r from-white/25 to-white/15
      border border-white/30 text-gray-900/90 font-semibold
      shadow-glass-md hover:bg-gradient-to-r hover:from-white/35 hover:to-white/25
      hover:border-white/50 hover:shadow-glass-lg
      active:from-white/45 active:to-white/35
    `,

    ghost: `
      backdrop-blur-sm bg-white/10 border border-white/20
      text-gray-900/75 hover:text-gray-900/90 font-medium
      hover:bg-white/20 hover:border-white/30
      shadow-none hover:shadow-glass-sm
    `,

    danger: `
      ${glassLevel} bg-gradient-to-r from-red-400/30 to-pink-400/30
      border border-red-300/50 text-white font-semibold
      shadow-glass-lg shadow-red-500/25
      hover:from-red-400/40 hover:to-pink-400/40
      hover:border-red-300/70 hover:shadow-glass-xl hover:shadow-red-500/35
      active:from-red-400/50 active:to-pink-400/50
    `,

    success: `
      ${glassLevel} bg-gradient-to-r from-emerald-400/30 to-teal-400/30
      border border-emerald-300/50 text-white font-semibold
      shadow-glass-lg shadow-emerald-500/25
      hover:from-emerald-400/40 hover:to-teal-400/40
      hover:border-emerald-300/70 hover:shadow-glass-xl hover:shadow-emerald-500/35
      active:from-emerald-400/50 active:to-teal-400/50
    `,

    outline: `
      backdrop-blur-sm bg-transparent border-2 border-white/40
      text-gray-900/80 hover:text-gray-900/95 font-medium
      hover:bg-white/15 hover:border-white/60
      shadow-none hover:shadow-glass-md
    `,
  };

  return variants[variant || "primary"];
};

// ============================================================================
// SIZE VARIANTS (SAME AS SOFTCLUB)
// ============================================================================

const getSizeStyles = (size: ButtonProps["size"]) => {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return sizes[size || "md"];
};

// ============================================================================
// ROUNDED VARIANTS
// ============================================================================

const getRoundedStyles = (rounded: ButtonProps["rounded"]) => {
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  };

  return roundedStyles[rounded || "md"];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ButtonGlassHeavy: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  rounded = "md",
  glow = false,
  glassIntensity,
  condensation = false,
  shimmer = true,
  disabled,
  className = "",
  children,
  onClick,
  ...props
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // ============================================================================
  // DYNAMIC GLASS INTENSITY
  // ============================================================================

  const intensity = glassIntensity || theme.glassIntensity;
  const glassLevel = theme.glassHeavy.levels[intensity];

  const variantStyles = getGlassVariantStyles(variant, glassLevel.backdrop);
  const sizeStyles = getSizeStyles(size);
  const roundedStyles = getRoundedStyles(rounded);

  const baseStyles = `
    relative inline-flex items-center justify-center gap-2
    font-medium transition-all duration-400 ease-out
    transform hover:scale-102 active:scale-98
    focus:outline-none focus:ring-2 focus:ring-white/30
    disabled:opacity-50 disabled:cursor-not-allowed 
    disabled:hover:scale-100 disabled:hover:shadow-none
    overflow-hidden
    ${fullWidth ? "w-full" : ""}
    ${variantStyles}
    ${sizeStyles}
    ${roundedStyles}
    ${className}
  `;

  // ============================================================================
  // LOADING SPINNER (GLASS STYLE)
  // ============================================================================

  const GlassLoadingSpinner = () => (
    <motion.div
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full backdrop-blur-sm"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // ============================================================================
  // RENDER CONTENT
  // ============================================================================

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <GlassLoadingSpinner />
          <span className="opacity-75">Loading...</span>
        </>
      );
    }

    const iconElement = icon && (
      <span
        className={`flex items-center ${
          size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
        }`}
      >
        {icon}
      </span>
    );

    if (iconPosition === "right") {
      return (
        <>
          <span>{children}</span>
          {iconElement}
        </>
      );
    }

    return (
      <>
        {iconElement}
        <span>{children}</span>
      </>
    );
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <motion.button
      className={baseStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={loading || disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {/* Glass Refraction Lines */}
      <div className="absolute top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10">{renderContent()}</div>

      {/* Glass Shimmer Effect */}
      {shimmer && (
        <GlassShimmer
          trigger="hover"
          intensity={0.4}
          duration={1.2}
          className="absolute inset-0"
        />
      )}

      {/* Condensation Effect */}
      {condensation && isHovered && (
        <Condensation
          trigger="hover"
          intensity={0.3}
          duration={2}
          dropletsCount={6}
        />
      )}

      {/* Glow Effect */}
      {glow && (
        <div className="absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
        </div>
      )}

      {/* Enhanced Glass Depth Layer */}
      <div className="absolute inset-2 rounded-[inherit] border border-white/20 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-60" />
    </motion.button>
  );
};

// ============================================================================
// GLASS BUTTON GROUP COMPONENT
// ============================================================================

interface ButtonGroupProps {
  children: React.ReactNode;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  glassIntensity?: ButtonProps["glassIntensity"];
  className?: string;
}

export const ButtonGroupGlassHeavy: React.FC<ButtonGroupProps> = ({
  children,
  variant = "primary",
  size = "md",
  glassIntensity = "medium",
  className = "",
}) => {
  const theme = useTheme();
  const glassLevel = theme.glassHeavy.levels[glassIntensity];

  return (
    <div
      className={`
      inline-flex ${glassLevel.backdrop} bg-white/15 border border-white/25
      p-1 rounded-2xl shadow-glass-md overflow-hidden
      ${className}
    `}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<ButtonProps>(child)) {
          return React.cloneElement(child, {
            variant: child.props.variant || variant,
            size: child.props.size || size,
            glassIntensity: child.props.glassIntensity || glassIntensity,
            rounded: "md",
            shimmer: false, // Disable individual shimmer in groups
            className: `${child.props.className || ""} ${
              index === 0
                ? "rounded-l-xl rounded-r-none"
                : index === React.Children.count(children) - 1
                  ? "rounded-r-xl rounded-l-none"
                  : "rounded-none"
            }`,
          });
        }
        return child;
      })}

      {/* Group shimmer effect */}
      <GlassShimmer
        trigger="auto"
        intensity={0.2}
        duration={3}
        repeatDelay={8}
        className="absolute inset-0"
      />
    </div>
  );
};

// ============================================================================
// GLASS ICON BUTTON VARIANT
// ============================================================================

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode;
  "aria-label": string;
}

export const IconButtonGlassHeavy: React.FC<IconButtonProps> = ({
  icon,
  size = "md",
  glassIntensity = "heavy",
  className = "",
  ...props
}) => {
  const iconSizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-14 h-14 text-xl",
  };

  return (
    <ButtonGlassHeavy
      size={size}
      rounded="full"
      glassIntensity={glassIntensity}
      condensation
      className={`${iconSizes[size]} p-0 ${className}`}
      {...props}
    >
      {icon}
    </ButtonGlassHeavy>
  );
};

// ============================================================================
// FLOATING ACTION BUTTON (GLASS STYLE)
// ============================================================================

interface FABProps extends Omit<ButtonProps, "variant" | "size"> {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  icon: React.ReactNode;
}

export const FloatingActionButtonGlassHeavy: React.FC<FABProps> = ({
  position = "bottom-right",
  icon,
  glassIntensity = "extreme",
  className = "",
  ...props
}) => {
  const positions = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6",
  };

  return (
    <ButtonGlassHeavy
      variant="primary"
      size="lg"
      rounded="full"
      glow
      condensation
      glassIntensity={glassIntensity}
      className={`
        ${positions[position]} z-50 shadow-glass-xl
        w-14 h-14 p-0 hover:shadow-2xl
        ${className}
      `}
      {...props}
    >
      {icon}
    </ButtonGlassHeavy>
  );
};

export default ButtonGlassHeavy;
