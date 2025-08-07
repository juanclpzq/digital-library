// ============================================================================
// INPUT SOFTCLUB - GEN X NOSTALGIC INPUT COMPONENT
// FILE LOCATION: src/components/themes/softclub/Input.tsx
// ============================================================================

import React, { useState, forwardRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";

// ============================================================================
// INPUT PROPS INTERFACE
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
}

// ============================================================================
// SOFTCLUB INPUT STYLES
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
  isInvalid?: boolean,
  isValid?: boolean,
  isFocused?: boolean
) => {
  const getStateColors = () => {
    if (isInvalid) {
      return {
        border: "border-red-300 focus:border-red-400",
        ring: "focus:ring-red-200/50",
        bg: "bg-red-50/50",
      };
    }

    if (isValid) {
      return {
        border: "border-emerald-300 focus:border-emerald-400",
        ring: "focus:ring-emerald-200/50",
        bg: "bg-emerald-50/30",
      };
    }

    return {
      border: "border-soft-cyan/30 focus:border-lavender-mist",
      ring: "focus:ring-lavender-mist/20",
      bg: "bg-white/80",
    };
  };

  const stateColors = getStateColors();

  const variants = {
    default: `${stateColors.bg} ${stateColors.border} border backdrop-blur-sm rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 ${stateColors.ring}`,

    filled: `${stateColors.bg} ${stateColors.border} border-0 bg-cloud-white/60 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 ${stateColors.ring} focus:bg-white/90`,

    outline: `bg-transparent ${stateColors.border} border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 ${stateColors.ring}`,

    underline: `bg-transparent border-0 border-b-2 ${stateColors.border} rounded-none transition-all duration-300 focus:outline-none px-0`,

    glass: `bg-white/60 backdrop-blur-sm ${stateColors.border} border rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 ${stateColors.ring} focus:bg-white/80`,
  };

  return variants[variant || "default"];
};

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================

const InputLoadingSpinner: React.FC<{ size: string }> = ({ size }) => {
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
    <motion.div
      className={`${sizeClass} border-2 border-soft-cyan/30 border-t-lavender-mist rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

// ============================================================================
// CLEAR BUTTON COMPONENT
// ============================================================================

const ClearButton: React.FC<{
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
          className={`${sizeClass} flex items-center justify-center text-midnight-navy/50 hover:text-midnight-navy/80 rounded-full hover:bg-white/50 transition-colors duration-200`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-full h-full"
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
// MAIN INPUT COMPONENT
// ============================================================================

const InputSoftclub = forwardRef<HTMLInputElement, InputProps>(
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
    const inputId = useId();

    const sizeStyles = getSizeStyles(size);
    const variantStyles = getVariantStyles(
      variant,
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

    // Container animation variants
    const containerVariants = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      focus: animate ? { scale: 1.01 } : {},
    };

    const labelVariants = {
      initial: { opacity: 0, y: 5 },
      animate: { opacity: 1, y: 0 },
      focus: animate
        ? {
            scale: 0.95,
            color: isInvalid ? "#ef4444" : isValid ? "#10b981" : "#B19CD9",
          }
        : {},
    };

    const inputClasses = [
      "w-full transition-all duration-300 placeholder-midnight-navy/40",
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
        transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
      >
        {/* Label */}
        {label && (
          <motion.label
            htmlFor={inputId}
            className={`block font-medium text-midnight-navy/80 mb-2 ${sizeStyles.label}`}
            variants={labelVariants}
            initial={animate ? "initial" : false}
            animate={isFocused ? "focus" : "animate"}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Addon */}
          {leftAddon && (
            <div className="absolute left-0 top-0 bottom-0 flex items-center">
              {leftAddon}
            </div>
          )}

          {/* Left Icon */}
          {leftIcon && !leftAddon && (
            <motion.div
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-navy/50 ${sizeStyles.icon}`}
              animate={{
                color: isFocused
                  ? isInvalid
                    ? "#ef4444"
                    : isValid
                      ? "#10b981"
                      : "#B19CD9"
                  : "#001122",
              }}
              transition={{ duration: 0.2 }}
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
                      ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                      : isValid
                        ? "0 0 0 3px rgba(16, 185, 129, 0.1)"
                        : "0 0 0 3px rgba(177, 156, 217, 0.1)",
                  }
                : undefined
            }
            transition={{ duration: 0.2 }}
            {...props}
          />

          {/* Right Icons Container */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {/* Loading Spinner */}
            {isLoading && <InputLoadingSpinner size={sizeStyles.icon} />}

            {/* Clear Button */}
            {clearable && !isLoading && (
              <ClearButton
                onClear={handleClear}
                size={sizeStyles.icon}
                show={hasValue && !disabled}
              />
            )}

            {/* Right Icon */}
            {rightIcon && !isLoading && !(clearable && hasValue) && (
              <motion.div
                className={`text-midnight-navy/50 ${sizeStyles.icon}`}
                animate={{
                  color: isFocused
                    ? isInvalid
                      ? "#ef4444"
                      : isValid
                        ? "#10b981"
                        : "#B19CD9"
                    : "#001122",
                }}
                transition={{ duration: 0.2 }}
              >
                {rightIcon}
              </motion.div>
            )}
          </div>

          {/* Right Addon */}
          {rightAddon && (
            <div className="absolute right-0 top-0 bottom-0 flex items-center">
              {rightAddon}
            </div>
          )}
        </div>

        {/* Helper Text / Error / Success */}
        <AnimatePresence mode="wait">
          {(error || success || helperText) && (
            <motion.div
              className={`mt-2 ${sizeStyles.helper}`}
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error && (
                <motion.p
                  className="text-red-500 font-medium flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
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
                  className="text-emerald-600 font-medium flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
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
                  className="text-midnight-navy/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {helperText}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Focus glow effect */}
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none"
          animate={{
            boxShadow: isFocused
              ? "0 0 20px rgba(177, 156, 217, 0.15)"
              : "0 0 0px transparent",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  }
);

InputSoftclub.displayName = "InputSoftclub";

export default InputSoftclub;
