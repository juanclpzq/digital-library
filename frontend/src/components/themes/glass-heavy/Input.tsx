// ============================================================================
// INPUT GLASS HEAVY - INTENSE GLASSMORPHISM INPUT COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/Input.tsx
// ============================================================================

import React, { useState, forwardRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import GlassShimmer from "./effects/GlassShimmer";
import Refraction from "./effects/Refraction";

// ============================================================================
// INPUT PROPS INTERFACE (SAME AS SOFTCLUB + GLASS EXTRAS)
// ============================================================================

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "filled" | "outline" | "underline" | "glass";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  isLoading?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
  focusOnMount?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
  animate?: boolean;
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  shimmer?: boolean;
  condensation?: boolean;
}

// ============================================================================
// GLASS HEAVY INPUT STYLES
// ============================================================================

const getSizeStyles = (size: InputProps["size"]) => {
  const sizes = {
    xs: {
      input: "px-3 py-1.5 text-xs min-h-[28px]",
      icon: "w-3 h-3",
      label: "text-xs",
      helper: "text-xs",
    },
    sm: {
      input: "px-3 py-2 text-sm min-h-[36px]",
      icon: "w-4 h-4",
      label: "text-sm",
      helper: "text-xs",
    },
    md: {
      input: "px-4 py-3 text-base min-h-[44px]",
      icon: "w-5 h-5",
      label: "text-sm",
      helper: "text-sm",
    },
    lg: {
      input: "px-5 py-4 text-lg min-h-[52px]",
      icon: "w-6 h-6",
      label: "text-base",
      helper: "text-sm",
    },
    xl: {
      input: "px-6 py-5 text-xl min-h-[60px]",
      icon: "w-7 h-7",
      label: "text-lg",
      helper: "text-base",
    },
  };

  return sizes[size || "md"];
};

const getVariantStyles = (
  variant: InputProps["variant"],
  intensity: string,
  isInvalid?: boolean,
  isValid?: boolean,
  isFocused?: boolean
) => {
  const glassIntensityMap = {
    whisper: "backdrop-blur-[6px] bg-white/10",
    light: "backdrop-blur-[12px] bg-white/15",
    medium: "backdrop-blur-[20px] bg-white/20",
    heavy: "backdrop-blur-[32px] bg-white/25",
    extreme: "backdrop-blur-[48px] bg-white/30",
  };

  const getStateColors = () => {
    if (isInvalid) {
      return {
        border: "border-red-400/50 focus:border-red-400/80",
        ring: "focus:ring-red-400/20",
        bg: "bg-red-400/10",
      };
    }

    if (isValid) {
      return {
        border: "border-emerald-400/50 focus:border-emerald-400/80",
        ring: "focus:ring-emerald-400/20",
        bg: "bg-emerald-400/10",
      };
    }

    return {
      border: "border-white/25 focus:border-white/50",
      ring: "focus:ring-white/20",
      bg: glassIntensityMap[intensity as keyof typeof glassIntensityMap],
    };
  };

  const stateColors = getStateColors();
  const baseGlass =
    glassIntensityMap[intensity as keyof typeof glassIntensityMap];

  const variants = {
    default: `${stateColors.bg} ${stateColors.border} border rounded-xl transition-all duration-400 focus:outline-none focus:ring-2 ${stateColors.ring} shadow-glass-md`,

    filled: `${baseGlass} border-0 rounded-xl transition-all duration-400 focus:outline-none focus:ring-2 ${stateColors.ring} focus:bg-white/30 shadow-glass-md`,

    outline: `bg-transparent ${stateColors.border} border-2 rounded-xl transition-all duration-400 focus:outline-none focus:ring-2 ${stateColors.ring}`,

    underline: `bg-transparent border-0 border-b-2 ${stateColors.border} rounded-none transition-all duration-400 focus:outline-none px-0`,

    glass: `${baseGlass} ${stateColors.border} border rounded-xl transition-all duration-400 focus:outline-none focus:ring-2 ${stateColors.ring} shadow-glass-lg`,
  };

  return variants[variant || "default"];
};

// ============================================================================
// GLASS LOADING SPINNER COMPONENT
// ============================================================================

const GlassInputLoadingSpinner: React.FC<{ size: string }> = ({ size }) => {
  const sizeClass = size.includes("w-3")
    ? "w-3 h-3"
    : size.includes("w-4")
      ? "w-4 h-4"
      : size.includes("w-5")
        ? "w-5 h-5"
        : size.includes("w-6")
          ? "w-6 h-6"
          : "w-5 h-5";

  return (
    <motion.div className={`${sizeClass} relative`}>
      <motion.div
        className="absolute inset-0 border-2 border-white/20 border-t-white/70 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-1 border border-white/30 border-t-white/80 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

// ============================================================================
// GLASS CLEAR BUTTON COMPONENT
// ============================================================================

const GlassClearButton: React.FC<{
  onClear: () => void;
  size: string;
  show: boolean;
}> = ({ onClear, size, show }) => {
  const sizeClass = size.includes("w-3")
    ? "w-3 h-3"
    : size.includes("w-4")
      ? "w-4 h-4"
      : size.includes("w-5")
        ? "w-5 h-5"
        : size.includes("w-6")
          ? "w-6 h-6"
          : "w-5 h-5";

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={onClear}
          className={`${sizeClass} flex items-center justify-center text-white/60 hover:text-white/90 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200`}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1, filter: "blur(0px) brightness(1.2)" }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-3/4 h-3/4"
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
    </AnimatePresence>
  );
};

// ============================================================================
// MAIN GLASS INPUT COMPONENT
// ============================================================================

const InputGlassHeavy = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      size = "md",
      variant = "default",
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      isLoading = false,
      isInvalid = false,
      isValid = false,
      focusOnMount = false,
      clearable = false,
      onClear,
      containerClassName = "",
      animate = true,
      glassIntensity = "medium",
      shimmer = true,
      condensation = false,
      className = "",
      disabled,
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);
    const [isHovered, setIsHovered] = useState(false);
    const inputId = useId();

    const sizeStyles = getSizeStyles(size);
    const variantStyles = getVariantStyles(
      variant,
      glassIntensity,
      isInvalid,
      isValid,
      isFocused
    );

    // Auto-focus on mount
    React.useEffect(() => {
      if (focusOnMount && ref && "current" in ref && ref.current) {
        ref.current.focus();
      }
    }, [focusOnMount, ref]);

    // Track value changes
    React.useEffect(() => {
      setHasValue(!!value);
    }, [value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setHasValue(false);
      onClear?.();
    };

    // Glass animation variants
    const containerVariants = {
      initial: { opacity: 0, y: 20, filter: "blur(10px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      focus: animate
        ? {
            scale: 1.02,
            filter: "blur(0px) brightness(1.1)",
          }
        : {},
    };

    const labelVariants = {
      initial: { opacity: 0, y: 10, filter: "blur(5px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      focus: animate
        ? {
            scale: 0.95,
            color: isInvalid ? "#f87171" : isValid ? "#34d399" : "#e0e7ff",
            filter: "blur(0px) brightness(1.2)",
          }
        : {},
    };

    const inputClasses = [
      "w-full transition-all duration-400 placeholder-white/50 text-white",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      variantStyles,
      sizeStyles.input,
      leftIcon || leftAddon ? "pl-10" : "",
      rightIcon || rightAddon || isLoading || (clearable && hasValue)
        ? "pr-10"
        : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <motion.div
        className={`relative ${containerClassName}`}
        variants={containerVariants}
        initial={animate ? "initial" : false}
        animate="animate"
        whileFocus={isFocused ? "focus" : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Label */}
        {label && (
          <motion.label
            htmlFor={inputId}
            className={`block font-medium text-white/90 mb-3 ${sizeStyles.label}`}
            variants={labelVariants}
            initial={animate ? "initial" : false}
            animate={isFocused ? "focus" : "animate"}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative overflow-hidden rounded-xl">
          {/* Glass Effects Layer */}
          {shimmer && (
            <GlassShimmer
              intensity={glassIntensity}
              active={isFocused || isHovered}
            />
          )}

          <Refraction
            intensity={isFocused ? "high" : "low"}
            animated={isFocused || isHovered}
          />

          {/* Left Addon */}
          {leftAddon && (
            <div className="absolute left-0 top-0 bottom-0 flex items-center z-20">
              {leftAddon}
            </div>
          )}

          {/* Left Icon */}
          {leftIcon && !leftAddon && (
            <motion.div
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 ${sizeStyles.icon} z-20`}
              animate={{
                color: isFocused
                  ? isInvalid
                    ? "#f87171"
                    : isValid
                      ? "#34d399"
                      : "#e0e7ff"
                  : "#ffffff60",
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {leftIcon}
            </motion.div>
          )}

          {/* Input Field */}
          <motion.input
            ref={ref}
            id={inputId}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            disabled={disabled}
            whileFocus={
              animate
                ? {
                    boxShadow: isInvalid
                      ? "0 0 0 3px rgba(248, 113, 113, 0.2), 0 8px 32px rgba(248, 113, 113, 0.1)"
                      : isValid
                        ? "0 0 0 3px rgba(52, 211, 153, 0.2), 0 8px 32px rgba(52, 211, 153, 0.1)"
                        : "0 0 0 3px rgba(255, 255, 255, 0.2), 0 8px 32px rgba(255, 255, 255, 0.1)",
                  }
                : undefined
            }
            transition={{ duration: 0.3 }}
            {...props}
          />

          {/* Right Icons Container */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 z-20">
            {/* Loading Spinner */}
            {isLoading && <GlassInputLoadingSpinner size={sizeStyles.icon} />}

            {/* Clear Button */}
            {clearable && !isLoading && (
              <GlassClearButton
                onClear={handleClear}
                size={sizeStyles.icon}
                show={hasValue && !disabled}
              />
            )}

            {/* Right Icon */}
            {rightIcon && !isLoading && !(clearable && hasValue) && (
              <motion.div
                className={`text-white/60 ${sizeStyles.icon}`}
                animate={{
                  color: isFocused
                    ? isInvalid
                      ? "#f87171"
                      : isValid
                        ? "#34d399"
                        : "#e0e7ff"
                    : "#ffffff60",
                  scale: isFocused ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {rightIcon}
              </motion.div>
            )}
          </div>

          {/* Right Addon */}
          {rightAddon && (
            <div className="absolute right-0 top-0 bottom-0 flex items-center z-20">
              {rightAddon}
            </div>
          )}

          {/* Enhanced Glass Border */}
          <motion.div
            className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none"
            animate={{
              borderColor: isFocused
                ? isInvalid
                  ? "rgba(248, 113, 113, 0.5)"
                  : isValid
                    ? "rgba(52, 211, 153, 0.5)"
                    : "rgba(255, 255, 255, 0.4)"
                : "rgba(255, 255, 255, 0.2)",
              boxShadow: isFocused
                ? "inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                : "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Corner Highlights */}
          <motion.div
            className="absolute top-0 right-0 w-6 h-6 bg-white/10 rounded-tr-xl rounded-bl-lg pointer-events-none"
            animate={{
              opacity: isFocused || isHovered ? 0.6 : 0.3,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Helper Text / Error / Success */}
        <AnimatePresence mode="wait">
          {(error || success || helperText) && (
            <motion.div
              className={`mt-3 ${sizeStyles.helper}`}
              initial={{ opacity: 0, y: -10, height: 0, filter: "blur(5px)" }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                filter: "blur(0px)",
              }}
              exit={{ opacity: 0, y: -10, height: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.4 }}
            >
              {error && (
                <motion.p
                  className="text-red-400 font-medium flex items-center gap-2 backdrop-blur-sm bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20"
                  initial={{ opacity: 0, x: -10, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4 }}
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </motion.p>
              )}

              {success && !error && (
                <motion.p
                  className="text-emerald-400 font-medium flex items-center gap-2 backdrop-blur-sm bg-emerald-400/10 px-3 py-2 rounded-lg border border-emerald-400/20"
                  initial={{ opacity: 0, x: -10, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4 }}
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {success}
                </motion.p>
              )}

              {helperText && !error && !success && (
                <motion.p
                  className="text-white/70 backdrop-blur-sm bg-white/5 px-3 py-2 rounded-lg border border-white/10"
                  initial={{ opacity: 0, filter: "blur(3px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.4 }}
                >
                  {helperText}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Focus glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: isFocused
              ? "0 0 40px rgba(255, 255, 255, 0.1)"
              : "0 0 0px transparent",
            filter: isFocused ? "blur(20px)" : "blur(0px)",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Floating particles on focus */}
        {isFocused && (
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${30 + Math.random() * 40}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.3, 0.8],
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
      </motion.div>
    );
  }
);

InputGlassHeavy.displayName = "InputGlassHeavy";

export default InputGlassHeavy;
