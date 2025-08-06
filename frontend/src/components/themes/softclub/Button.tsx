// ============================================================================
// BUTTON SOFTCLUB - GEN X NOSTALGIC BUTTON COMPONENT
// FILE LOCATION: src/components/themes/softclub/Button.tsx
// ============================================================================

import React, { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";

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
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  gradient?: "mint" | "cyan" | "peach" | "lavender" | "coral" | "custom";
  customGradient?: string;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
  shadow?: "none" | "soft" | "gentle" | "strong";
  animate?: boolean;
  children: React.ReactNode;
}

// ============================================================================
// SOFTCLUB BUTTON STYLES
// ============================================================================

const getVariantStyles = (
  variant: ButtonProps["variant"],
  gradient: ButtonProps["gradient"],
  customGradient?: string
) => {
  const gradients = {
    mint: "bg-gradient-to-r from-mint-dream to-emerald-300",
    cyan: "bg-gradient-to-r from-soft-cyan to-blue-300",
    peach: "bg-gradient-to-r from-peachy-keen to-orange-300",
    lavender: "bg-gradient-to-r from-lavender-mist to-purple-300",
    coral: "bg-gradient-to-r from-sunset-coral to-pink-300",
    custom: customGradient || "bg-gradient-to-r from-soft-cyan to-mint-dream",
  };

  const baseGradient = gradients[gradient || "cyan"];

  const variants = {
    primary: `${baseGradient} text-white font-semibold hover:opacity-90 active:scale-95`,

    secondary: `bg-gradient-to-r from-cloud-white/80 to-silver-matte/60 text-midnight-navy font-medium border border-white/40 hover:border-white/60 hover:from-cloud-white/90 hover:to-silver-matte/70`,

    ghost: `bg-transparent text-midnight-navy font-medium hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 border border-transparent hover:border-white/30`,

    danger: `bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold hover:from-red-500 hover:to-red-600 active:scale-95`,

    success: `${gradients.mint} text-white font-semibold hover:opacity-90 active:scale-95`,

    outline: `bg-transparent border-2 text-midnight-navy font-medium hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 border-midnight-navy/30 hover:border-midnight-navy/50`,
  };

  return variants[variant || "primary"];
};

const getSizeStyles = (size: ButtonProps["size"]) => {
  const sizes = {
    xs: "px-3 py-1.5 text-xs min-h-[28px]",
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[52px]",
    xl: "px-10 py-5 text-xl min-h-[60px]",
  };

  return sizes[size || "md"];
};

const getRoundedStyles = (rounded: ButtonProps["rounded"]) => {
  const styles = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full",
  };

  return styles[rounded || "lg"];
};

const getShadowStyles = (shadow: ButtonProps["shadow"]) => {
  const shadows = {
    none: "",
    soft: "shadow-soft",
    gentle: "shadow-gentle",
    strong: "shadow-lg shadow-midnight-navy/20",
  };

  return shadows[shadow || "gentle"];
};

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================

const LoadingSpinner: React.FC<{ size: ButtonProps["size"] }> = ({ size }) => {
  const spinnerSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  };

  return (
    <motion.div
      className={`${spinnerSizes[size || "md"]} border-2 border-current border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

// ============================================================================
// MAIN BUTTON COMPONENT
// ============================================================================

const ButtonSoftclub = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      gradient = "cyan",
      customGradient,
      isLoading = false,
      loadingText,
      icon,
      iconPosition = "left",
      fullWidth = false,
      rounded = "lg",
      shadow = "gentle",
      animate = true,
      className = "",
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const [isPressed, setIsPressed] = useState(false);

    const variantStyles = getVariantStyles(variant, gradient, customGradient);
    const sizeStyles = getSizeStyles(size);
    const roundedStyles = getRoundedStyles(rounded);
    const shadowStyles = getShadowStyles(shadow);

    const buttonClasses = [
      // Base styles
      "relative inline-flex items-center justify-center font-medium",
      "transition-all duration-300 ease-soft",
      "focus:outline-none focus:ring-2 focus:ring-soft-cyan/50 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",

      // Dynamic styles
      variantStyles,
      sizeStyles,
      roundedStyles,
      shadowStyles,

      // Conditional styles
      fullWidth ? "w-full" : "",
      isLoading ? "cursor-wait" : "",

      // Custom classes
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Animation variants
    const buttonVariants = {
      initial: { scale: 1, y: 0 },
      hover: animate
        ? {
            scale: 1.02,
            y: -2,
            transition: { duration: 0.2, ease: "easeOut" },
          }
        : {},
      tap: animate
        ? {
            scale: 0.98,
            transition: { duration: 0.1 },
          }
        : {},
      disabled: { scale: 1, y: 0 },
    };

    const iconVariants = {
      initial: { x: 0, rotate: 0 },
      hover: animate
        ? {
            x: iconPosition === "right" ? 2 : -2,
            transition: { duration: 0.2 },
          }
        : {},
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled) return;

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 100);

      onClick?.(e);
    };

    const content = (
      <>
        {/* Icon - Left Position */}
        {icon && iconPosition === "left" && !isLoading && (
          <motion.span
            className={`${sizeStyles.includes("text-xs") ? "mr-2" : sizeStyles.includes("text-sm") ? "mr-2.5" : "mr-3"}`}
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
          >
            {icon}
          </motion.span>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <motion.span
            className={`${iconPosition === "left" ? "mr-3" : iconPosition === "right" ? "ml-3" : "mr-2"}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSpinner size={size} />
          </motion.span>
        )}

        {/* Button Text */}
        <motion.span
          className="relative z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 0.7 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading && loadingText ? loadingText : children}
        </motion.span>

        {/* Icon - Right Position */}
        {icon && iconPosition === "right" && !isLoading && (
          <motion.span
            className={`${sizeStyles.includes("text-xs") ? "ml-2" : sizeStyles.includes("text-sm") ? "ml-2.5" : "ml-3"}`}
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
          >
            {icon}
          </motion.span>
        )}
      </>
    );

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        variants={buttonVariants}
        initial="initial"
        whileHover={!disabled && !isLoading ? "hover" : "disabled"}
        whileTap={!disabled && !isLoading ? "tap" : "disabled"}
        onClick={handleClick}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Gentle glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-inherit opacity-0"
          animate={{
            opacity: isPressed ? 0.3 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Press effect */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/20 rounded-inherit"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center">
          {content}
        </div>

        {/* Floating particles effect (subtle) */}
        {variant === "primary" && !disabled && (
          <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${30 + Math.random() * 40}%`,
                }}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </motion.button>
    );
  }
);

ButtonSoftclub.displayName = "ButtonSoftclub";

export default ButtonSoftclub;
