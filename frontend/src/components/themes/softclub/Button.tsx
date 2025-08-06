// ============================================================================
// BUTTON SOFTCLUB - GEN X NOSTALGIC BUTTON COMPONENT
// FILE LOCATION: src/components/themes/softclub/Button.tsx
// ============================================================================

import React from "react";
import { motion } from "framer-motion";
import { softclubColors, getGlowEffect } from "@/theme/softclub";

// ============================================================================
// BUTTON PROPS INTERFACE
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
  children: React.ReactNode;
}

// ============================================================================
// SOFTCLUB BUTTON VARIANTS
// ============================================================================

const getSoftclubVariantStyles = (variant: ButtonProps["variant"]) => {
  const variants = {
    primary: `
      bg-gradient-to-r from-mint-dream/80 to-soft-cyan/80
      text-midnight-navy font-bold
      shadow-gentle hover:shadow-mint-glow
      hover:from-mint-dream/90 hover:to-soft-cyan/90
      active:from-mint-dream/70 active:to-soft-cyan/70
    `,

    secondary: `
      bg-gradient-to-r from-peachy-keen/70 to-sunset-coral/70
      text-cloud-white font-semibold
      shadow-gentle hover:shadow-peach-glow
      hover:from-peachy-keen/80 hover:to-sunset-coral/80
      active:from-peachy-keen/60 active:to-sunset-coral/60
    `,

    ghost: `
      bg-cloud-white/40 hover:bg-cloud-white/60
      text-midnight-navy/80 hover:text-midnight-navy
      border border-silver-matte/30 hover:border-soft-cyan/40
      shadow-none hover:shadow-gentle
    `,

    danger: `
      bg-gradient-to-r from-sunset-coral/80 to-peachy-keen/80
      text-cloud-white font-semibold
      shadow-gentle hover:shadow-coral-glow
      hover:from-sunset-coral/90 hover:to-peachy-keen/90
      active:from-sunset-coral/70 active:to-peachy-keen/70
    `,

    success: `
      bg-gradient-to-r from-mint-dream/85 to-aqua-mist/85
      text-midnight-navy/90 font-semibold
      shadow-gentle hover:shadow-mint-glow
      hover:from-mint-dream/95 hover:to-aqua-mist/95
      active:from-mint-dream/75 active:to-aqua-mist/75
    `,

    outline: `
      bg-transparent border-2 border-soft-cyan/60
      text-soft-cyan hover:text-midnight-navy
      hover:bg-soft-cyan/20 hover:border-soft-cyan/80
      shadow-none hover:shadow-cyan-glow
    `,
  };

  return variants[variant || "primary"];
};

// ============================================================================
// SIZE VARIANTS
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
    sm: "rounded-sm",
    md: "rounded-gentle",
    lg: "rounded-xl",
    full: "rounded-full",
  };

  return roundedStyles[rounded || "md"];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ButtonSoftclub: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  rounded = "md",
  glow = false,
  disabled,
  className = "",
  children,
  onClick,
  ...props
}) => {
  // ============================================================================
  // DYNAMIC STYLES
  // ============================================================================

  const variantStyles = getSoftclubVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const roundedStyles = getRoundedStyles(rounded);
  const glowStyles = glow ? getGlowEffect("softCyan") : "";

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium transition-all duration-300 ease-soft
    transform hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-soft-cyan/30
    disabled:opacity-50 disabled:cursor-not-allowed 
    disabled:hover:scale-100 disabled:hover:shadow-none
    ${fullWidth ? "w-full" : ""}
    ${variantStyles}
    ${sizeStyles}
    ${roundedStyles}
    ${glowStyles}
    ${className}
  `;

  // ============================================================================
  // LOADING SPINNER COMPONENT
  // ============================================================================

  const LoadingSpinner = () => (
    <motion.div
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
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

  // ============================================================================
  // RENDER CONTENT
  // ============================================================================

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner />
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
      disabled={loading || disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      {...props}
    >
      {renderContent()}

      {/* Gentle Shine Effect */}
      <div className="absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-cloud-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer" />
      </div>
    </motion.button>
  );
};

// ============================================================================
// BUTTON GROUP COMPONENT (BONUS)
// ============================================================================

interface ButtonGroupProps {
  children: React.ReactNode;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}

export const ButtonGroupSoftclub: React.FC<ButtonGroupProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  return (
    <div
      className={`
      inline-flex bg-cloud-white/20 p-1 rounded-xl shadow-inset-soft
      ${className}
    `}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<ButtonProps>(child)) {
          return React.cloneElement(child, {
            variant: child.props.variant || variant,
            size: child.props.size || size,
            rounded: "md",
            className: `${child.props.className || ""} ${
              index === 0
                ? "rounded-l-lg rounded-r-none"
                : index === React.Children.count(children) - 1
                  ? "rounded-r-lg rounded-l-none"
                  : "rounded-none"
            }`,
          });
        }
        return child;
      })}
    </div>
  );
};

// ============================================================================
// ICON BUTTON VARIANT
// ============================================================================

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode;
  "aria-label": string;
}

export const IconButtonSoftclub: React.FC<IconButtonProps> = ({
  icon,
  size = "md",
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
    <ButtonSoftclub
      size={size}
      rounded="full"
      className={`${iconSizes[size]} p-0 ${className}`}
      {...props}
    >
      {icon}
    </ButtonSoftclub>
  );
};

// ============================================================================
// FLOATING ACTION BUTTON
// ============================================================================

interface FABProps extends Omit<ButtonProps, "variant" | "size"> {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  icon: React.ReactNode;
}

export const FloatingActionButtonSoftclub: React.FC<FABProps> = ({
  position = "bottom-right",
  icon,
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
    <ButtonSoftclub
      variant="primary"
      size="lg"
      rounded="full"
      glow
      className={`
        ${positions[position]} z-50 shadow-2xl shadow-mint-dream/30
        w-14 h-14 p-0 hover:shadow-3xl hover:shadow-mint-dream/40
        ${className}
      `}
      {...props}
    >
      {icon}
    </ButtonSoftclub>
  );
};

export default ButtonSoftclub;
