// ============================================================================
// BUTTON GLASS HEAVY - INTENSE GLASSMORPHISM BUTTON COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/Button.tsx
// ============================================================================

import React, { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import GlassShimmer from "./effects/GlassShimmer";
import GlassRipple from "./effects/GlassRipple";
import Refraction from "./effects/Refraction";

// ============================================================================
// BUTTON PROPS INTERFACE (SAME AS SOFTCLUB + GLASS EXTRAS)
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
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  shimmer?: boolean;
  condensation?: boolean;
  rippleEffect?: boolean;
  children: React.ReactNode;
}

// ============================================================================
// GLASS HEAVY BUTTON STYLES
// ============================================================================

const getVariantStyles = (
  variant: ButtonProps["variant"],
  gradient: ButtonProps["gradient"],
  intensity: string,
  customGradient?: string
) => {
  const glassIntensityMap = {
    whisper: "backdrop-blur-[6px] bg-white/10",
    light: "backdrop-blur-[12px] bg-white/15",
    medium: "backdrop-blur-[20px] bg-white/20",
    heavy: "backdrop-blur-[32px] bg-white/25",
    extreme: "backdrop-blur-[48px] bg-white/30",
  };

  const gradients = {
    mint: "bg-gradient-to-r from-emerald-400/30 via-teal-400/25 to-cyan-400/20",
    cyan: "bg-gradient-to-r from-cyan-400/30 via-blue-400/25 to-indigo-400/20",
    peach: "bg-gradient-to-r from-orange-400/25 via-pink-400/30 to-red-400/20",
    lavender:
      "bg-gradient-to-r from-purple-400/30 via-pink-400/25 to-rose-400/20",
    coral: "bg-gradient-to-r from-pink-400/25 via-rose-400/30 to-orange-400/20",
    custom:
      customGradient || "bg-gradient-to-r from-cyan-400/25 to-blue-400/25",
  };

  const baseGlass =
    glassIntensityMap[intensity as keyof typeof glassIntensityMap];
  const baseGradient = gradients[gradient || "cyan"];

  const variants = {
    primary: `${baseGlass} ${baseGradient} text-white font-semibold border border-white/30 hover:border-white/50 hover:bg-white/30 active:scale-95`,

    secondary: `${baseGlass} bg-white/10 text-white/90 font-medium border border-white/20 hover:border-white/40 hover:bg-white/20`,

    ghost: `bg-transparent text-white/80 font-medium hover:${baseGlass} hover:${baseGradient} border border-transparent hover:border-white/20`,

    danger: `${baseGlass} bg-gradient-to-r from-red-400/30 to-pink-400/30 text-white font-semibold border border-red-400/40 hover:border-red-400/60 hover:from-red-400/40 hover:to-pink-400/40 active:scale-95`,

    success: `${baseGlass} ${gradients.mint} text-white font-semibold border border-emerald-400/40 hover:border-emerald-400/60 hover:bg-white/25 active:scale-95`,

    outline: `bg-transparent border-2 text-white/90 font-medium hover:${baseGlass} hover:${baseGradient} border-white/30 hover:border-white/50`,
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

  return styles[rounded || "xl"];
};

const getShadowStyles = (shadow: ButtonProps["shadow"]) => {
  const shadows = {
    none: "",
    soft: "shadow-glass-md",
    gentle: "shadow-glass-lg",
    strong: "shadow-glass-xl",
  };

  return shadows[shadow || "gentle"];
};

// ============================================================================
// GLASS LOADING SPINNER COMPONENT
// ============================================================================

const GlassLoadingSpinner: React.FC<{ size: ButtonProps["size"] }> = ({
  size,
}) => {
  const spinnerSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  };

  return (
    <motion.div className={`${spinnerSizes[size || "md"]} relative`}>
      <motion.div
        className="absolute inset-0 border-2 border-white/30 border-t-white/80 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-1 border border-white/20 border-t-white/60 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

// ============================================================================
// MAIN GLASS BUTTON COMPONENT
// ============================================================================

const ButtonGlassHeavy = forwardRef<HTMLButtonElement, ButtonProps>(
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
      rounded = "xl",
      shadow = "gentle",
      animate = true,
      glassIntensity = "medium",
      shimmer = true,
      condensation = false,
      rippleEffect = true,
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
    const [isHovered, setIsHovered] = useState(false);

    const variantStyles = getVariantStyles(
      variant,
      gradient,
      glassIntensity,
      customGradient
    );
    const sizeStyles = getSizeStyles(size);
    const roundedStyles = getRoundedStyles(rounded);
    const shadowStyles = getShadowStyles(shadow);

    const buttonClasses = [
      // Base styles
      "relative inline-flex items-center justify-center font-medium overflow-hidden",
      "transition-all duration-400 ease-glass",
      "focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent",
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

    // Glass animation variants
    const buttonVariants = {
      initial: {
        scale: 1,
        y: 0,
        filter: "blur(0px)",
      },
      hover: animate
        ? {
            scale: 1.03,
            y: -3,
            filter: "blur(0px) brightness(1.1)",
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
          }
        : {},
      tap: animate
        ? {
            scale: 0.97,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.15 },
          }
        : {},
      disabled: {
        scale: 1,
        y: 0,
        filter: "blur(1px) brightness(0.8)",
      },
    };

    const iconVariants = {
      initial: { x: 0, rotate: 0, scale: 1 },
      hover: animate
        ? {
            x: iconPosition === "right" ? 3 : -3,
            scale: 1.1,
            transition: { duration: 0.3 },
          }
        : {},
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled) return;

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 200);

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
            initial={{ opacity: 0, scale: 0.5, filter: "blur(5px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
          >
            <GlassLoadingSpinner size={size} />
          </motion.span>
        )}

        {/* Button Text */}
        <motion.span
          className="relative z-10"
          initial={{ opacity: 1 }}
          animate={{
            opacity: isLoading ? 0.7 : 1,
            filter: isLoading ? "blur(0.5px)" : "blur(0px)",
          }}
          transition={{ duration: 0.3 }}
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
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Glass Effects Layer */}
        {shimmer && (
          <GlassShimmer
            intensity={glassIntensity}
            active={isHovered && !disabled}
          />
        )}

        {/* Refraction Lines */}
        <Refraction
          intensity={isHovered ? "high" : "low"}
          animated={isHovered}
        />

        {/* Ripple Effect */}
        {rippleEffect && (
          <GlassRipple active={isPressed} intensity={glassIntensity} />
        )}

        {/* Enhanced Glass Border */}
        <motion.div
          className="absolute inset-0 rounded-inherit border border-white/20 pointer-events-none"
          animate={{
            borderColor: isHovered
              ? "rgba(255, 255, 255, 0.4)"
              : "rgba(255, 255, 255, 0.2)",
            boxShadow: isHovered
              ? "inset 0 1px 0 rgba(255, 255, 255, 0.3)"
              : "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Press Wave Effect */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-inherit"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.2, 1.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center">
          {content}
        </div>

        {/* Glass Particles (Premium Effect) */}
        {variant === "primary" && !disabled && isHovered && (
          <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full backdrop-blur-sm"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [0.5, 1.5, 0.5],
                  filter: ["blur(1px)", "blur(0px)", "blur(1px)"],
                }}
                transition={{
                  duration: 2 + Math.random() * 1,
                  repeat: Infinity,
                  delay: Math.random() * 1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        {/* Corner Highlight */}
        <motion.div
          className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-tr-inherit rounded-bl-2xl pointer-events-none"
          animate={{
            opacity: isHovered ? 0.6 : 0.3,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Bottom Glow */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-white/20 blur-sm rounded-full pointer-events-none"
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
            scaleX: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    );
  }
);

ButtonGlassHeavy.displayName = "ButtonGlassHeavy";

export default ButtonGlassHeavy;
