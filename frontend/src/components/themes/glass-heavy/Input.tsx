// ============================================================================
// INPUT GLASS HEAVY - INTENSE GLASSMORPHISM INPUT COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/Input.tsx
// ============================================================================

import React, { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import GlassShimmer from "./effects/GlassShimmer";
import Refraction from "./effects/Refrations";

// ============================================================================
// INPUT PROPS INTERFACE (SAME AS SOFTCLUB + GLASS EXTRAS)
// ============================================================================

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined" | "ghost";
  inputSize?: "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  glow?: boolean;
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  shimmer?: boolean;
  refraction?: boolean;
  condensation?: boolean;
}

// ============================================================================
// GLASS HEAVY INPUT VARIANTS
// ============================================================================

const getGlassVariantStyles = (
  variant: InputProps["variant"],
  hasError: boolean,
  isSuccess: boolean,
  isFocused: boolean,
  glassLevel: string
) => {
  const baseTransition = "transition-all duration-400 ease-out";

  // Error state overrides everything
  if (hasError) {
    return `
      ${glassLevel} bg-gradient-to-r from-red-400/25 to-pink-400/15
      border border-red-300/50 text-gray-900/90
      ring-2 ring-red-300/30 shadow-glass-md shadow-red-500/20
      placeholder:text-red-600/60
      focus:border-red-300/70 focus:ring-red-300/40 focus:bg-red-400/20
      ${baseTransition}
    `;
  }

  // Success state
  if (isSuccess) {
    return `
      ${glassLevel} bg-gradient-to-r from-emerald-400/25 to-teal-400/15
      border border-emerald-300/50 text-gray-900/90
      ring-2 ring-emerald-300/30 shadow-glass-md shadow-emerald-500/20
      placeholder:text-emerald-600/60
      focus:border-emerald-300/70 focus:ring-emerald-300/40 focus:bg-emerald-400/20
      ${baseTransition}
    `;
  }

  const variants = {
    default: `
      ${glassLevel} bg-gradient-to-r from-white/20 to-white/10
      border border-white/30 text-gray-900/95
      placeholder:text-gray-600/60 shadow-glass-sm
      focus:border-white/50 focus:ring-2 focus:ring-white/25
      focus:bg-gradient-to-r focus:from-white/30 focus:to-white/15
      hover:border-white/40 hover:bg-gradient-to-r hover:from-white/25 hover:to-white/12
      ${isFocused ? "border-white/60 ring-2 ring-white/30 shadow-glass-md" : ""}
      ${baseTransition}
    `,

    filled: `
      ${glassLevel} bg-gradient-to-br from-white/30 to-white/15
      border border-white/20 text-gray-900/95
      placeholder:text-gray-700/60 shadow-glass-md
      focus:ring-2 focus:ring-white/30 focus:bg-gradient-to-br focus:from-white/40 focus:to-white/20
      hover:from-white/35 hover:to-white/18 hover:border-white/30
      ${baseTransition}
    `,

    outlined: `
      ${glassLevel} bg-transparent border-2 border-white/40
      text-gray-900/90 placeholder:text-gray-600/70
      shadow-none hover:border-white/60 hover:bg-white/5
      focus:border-white/70 focus:ring-2 focus:ring-white/25
      focus:bg-white/10
      ${baseTransition}
    `,

    ghost: `
      ${glassLevel} bg-transparent border border-transparent
      text-gray-900/85 placeholder:text-gray-600/60
      shadow-none hover:bg-white/10 hover:border-white/20
      focus:bg-white/15 focus:border-white/30
      focus:ring-2 focus:ring-white/20
      ${baseTransition}
    `,
  };

  return variants[variant || "default"];
};

// ============================================================================
// SIZE VARIANTS (SAME AS SOFTCLUB)
// ============================================================================

const getSizeStyles = (inputSize: InputProps["inputSize"]) => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  };

  return sizes[inputSize || "md"];
};

// ============================================================================
// ROUNDED VARIANTS (MORE GLASS-APPROPRIATE)
// ============================================================================

const getRoundedStyles = (rounded: InputProps["rounded"]) => {
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

const InputGlassHeavy = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success = false,
      helperText,
      leftIcon,
      rightIcon,
      variant = "default",
      inputSize = "md",
      rounded = "md",
      glow = false,
      loading = false,
      clearable = false,
      onClear,
      glassIntensity,
      shimmer = true,
      refraction = true,
      condensation = false,
      disabled,
      className = "",
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    // ============================================================================
    // STATE & THEME
    // ============================================================================

    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || "");

    const intensity = glassIntensity || theme.glassIntensity;
    const glassLevel = theme.glassHeavy.levels[intensity];

    const hasError = Boolean(error);
    const hasValue = Boolean(internalValue || value);
    const showClearButton = clearable && hasValue && !disabled;

    // ============================================================================
    // DYNAMIC STYLES
    // ============================================================================

    const variantStyles = getGlassVariantStyles(
      variant,
      hasError,
      success,
      isFocused,
      glassLevel.backdrop
    );
    const sizeStyles = getSizeStyles(inputSize);
    const roundedStyles = getRoundedStyles(rounded);

    const containerStyles = `
    relative w-full
    ${glow && isFocused ? "filter drop-shadow-xl drop-shadow-white/20" : ""}
  `;

    const inputStyles = `
    w-full outline-none disabled:opacity-60 disabled:cursor-not-allowed
    relative z-10 overflow-hidden
    ${variantStyles}
    ${sizeStyles}  
    ${roundedStyles}
    ${leftIcon ? "pl-12" : ""}
    ${rightIcon || showClearButton || loading ? "pr-12" : ""}
    ${className}
  `;

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue("");
      onClear?.();
      if (onChange && ref && "current" in ref && ref.current) {
        const syntheticEvent = {
          target: { ...ref.current, value: "" },
          currentTarget: ref.current,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    // ============================================================================
    // GLASS LOADING SPINNER
    // ============================================================================

    const GlassLoadingSpinner = () => (
      <motion.div
        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full backdrop-blur-sm"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );

    // ============================================================================
    // RENDER COMPONENT
    // ============================================================================

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <motion.label
            className={`
            block text-sm font-semibold transition-colors duration-300
            ${
              hasError
                ? "text-red-600/90"
                : success
                  ? "text-emerald-600/90"
                  : isFocused
                    ? "text-gray-900/95"
                    : "text-gray-800/80"
            }
          `}
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container with Glass Effects */}
        <div className={containerStyles}>
          <div className="relative">
            {/* Glass Refraction Effects */}
            {refraction && (
              <Refraction
                intensity="medium"
                animated={isFocused}
                className="absolute inset-0 rounded-[inherit]"
              />
            )}

            {/* Left Icon */}
            {leftIcon && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700/70 pointer-events-none z-20">
                <span
                  className={`
                ${inputSize === "sm" ? "text-sm" : inputSize === "lg" ? "text-lg" : "text-base"}
                transition-colors duration-300
                ${isFocused ? "text-gray-900/90" : ""}
              `}
                >
                  {leftIcon}
                </span>
              </div>
            )}

            {/* Main Glass Input */}
            <div className="relative">
              <motion.input
                ref={ref}
                className={inputStyles}
                disabled={disabled}
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                whileFocus={{ scale: glow ? 1.01 : 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                {...props}
              />

              {/* Glass Shimmer Effect */}
              {shimmer && (
                <GlassShimmer
                  trigger={isFocused ? "auto" : "none"}
                  intensity={0.3}
                  duration={2}
                  className="absolute inset-0 rounded-[inherit]"
                />
              )}
            </div>

            {/* Right Side Icons */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-20">
              {/* Loading Spinner */}
              {loading && <GlassLoadingSpinner />}

              {/* Clear Button */}
              <AnimatePresence>
                {showClearButton && (
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    className={`
                    ${theme.glassHeavy.levels.light.backdrop} bg-white/20 border border-white/30
                    text-gray-700/80 hover:text-red-600/90 hover:bg-red-400/20
                    transition-all duration-300 p-1.5 rounded-lg
                    hover:border-red-300/50
                    ${inputSize === "sm" ? "text-xs p-1" : "text-sm"}
                  `}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="w-3 h-3"
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
              </AnimatePresence>

              {/* Right Icon */}
              {rightIcon && (
                <span
                  className={`
                text-gray-700/70 transition-colors duration-300
                ${inputSize === "sm" ? "text-sm" : inputSize === "lg" ? "text-lg" : "text-base"}
                ${isFocused ? "text-gray-900/90" : ""}
              `}
                >
                  {rightIcon}
                </span>
              )}
            </div>

            {/* Focus Glow Effect */}
            <AnimatePresence>
              {isFocused && glow && (
                <motion.div
                  className="absolute inset-0 rounded-[inherit] ring-2 ring-white/40 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            {/* Glass Depth Layer */}
            <div className="absolute inset-1 rounded-[inherit] border border-white/20 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-60" />
          </div>
        </div>

        {/* Helper Text / Error Message */}
        <AnimatePresence>
          {(error || helperText) && (
            <motion.div
              className={`
              text-xs font-medium transition-colors duration-300
              ${
                hasError
                  ? "text-red-600/90"
                  : success
                    ? "text-emerald-600/90"
                    : "text-gray-700/70"
              }
            `}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {error || helperText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

// ============================================================================
// GLASS SEARCH INPUT VARIANT
// ============================================================================

interface SearchInputProps extends Omit<InputProps, "leftIcon" | "rightIcon"> {
  onSearch?: (value: string) => void;
  searchIcon?: React.ReactNode;
  showSearchButton?: boolean;
}

export const SearchInputGlassHeavy: React.FC<SearchInputProps> = ({
  onSearch,
  searchIcon,
  showSearchButton = true,
  placeholder = "Search...",
  rounded = "full",
  glassIntensity = "medium",
  ...props
}) => {
  const [searchValue, setSearchValue] = useState("");
  const theme = useTheme();

  const defaultSearchIcon = (
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const handleSearch = () => {
    onSearch?.(searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <InputGlassHeavy
      {...props}
      placeholder={placeholder}
      rounded={rounded}
      glassIntensity={glassIntensity}
      shimmer={true}
      leftIcon={searchIcon || defaultSearchIcon}
      rightIcon={
        showSearchButton ? (
          <motion.button
            type="button"
            onClick={handleSearch}
            className={`
              ${theme.glassHeavy.levels.medium.backdrop} bg-blue-400/30 border border-blue-300/50
              text-white hover:bg-blue-400/40 transition-all duration-300
              p-1.5 rounded-lg shadow-glass-sm
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5-5 5M6 12h12"
              />
            </svg>
          </motion.button>
        ) : undefined
      }
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyPress={handleKeyPress}
    />
  );
};

// ============================================================================
// GLASS TEXTAREA VARIANT
// ============================================================================

interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  variant?: InputProps["variant"];
  inputSize?: InputProps["inputSize"];
  rounded?: InputProps["rounded"];
  glow?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
  glassIntensity?: InputProps["glassIntensity"];
  shimmer?: boolean;
  refraction?: boolean;
}

export const TextareaGlassHeavy = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      label,
      error,
      success = false,
      helperText,
      variant = "default",
      inputSize = "md",
      rounded = "md",
      glow = false,
      resize = "vertical",
      glassIntensity,
      shimmer = true,
      refraction = true,
      disabled,
      className = "",
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const intensity = glassIntensity || theme.glassIntensity;
    const glassLevel = theme.glassHeavy.levels[intensity];

    const hasError = Boolean(error);
    const variantStyles = getGlassVariantStyles(
      variant,
      hasError,
      success,
      isFocused,
      glassLevel.backdrop
    );
    const sizeStyles = getSizeStyles(inputSize);
    const roundedStyles = getRoundedStyles(rounded);

    const resizeStyles = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const textareaStyles = `
    w-full outline-none disabled:opacity-60 disabled:cursor-not-allowed
    min-h-[120px] relative z-10 ${resizeStyles[resize]}
    ${variantStyles}
    ${sizeStyles}
    ${roundedStyles}
    ${className}
  `;

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <label
            className={`
          block text-sm font-semibold transition-colors duration-300
          ${
            hasError
              ? "text-red-600/90"
              : success
                ? "text-emerald-600/90"
                : isFocused
                  ? "text-gray-900/95"
                  : "text-gray-800/80"
          }
        `}
          >
            {label}
          </label>
        )}

        {/* Textarea Container */}
        <div className="relative">
          {/* Glass Refraction Effects */}
          {refraction && (
            <Refraction
              intensity="medium"
              animated={isFocused}
              className="absolute inset-0 rounded-[inherit]"
            />
          )}

          <div className="relative">
            <motion.textarea
              ref={ref}
              className={textareaStyles}
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              whileFocus={{ scale: glow ? 1.005 : 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              {...props}
            />

            {/* Glass Shimmer Effect */}
            {shimmer && (
              <GlassShimmer
                trigger={isFocused ? "auto" : "none"}
                intensity={0.2}
                duration={3}
                className="absolute inset-0 rounded-[inherit]"
              />
            )}

            {/* Glass Depth Layer */}
            <div className="absolute inset-1 rounded-[inherit] border border-white/20 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-40" />
          </div>
        </div>

        {/* Helper Text / Error Message */}
        <AnimatePresence>
          {(error || helperText) && (
            <motion.div
              className={`
              text-xs font-medium transition-colors duration-300
              ${
                hasError
                  ? "text-red-600/90"
                  : success
                    ? "text-emerald-600/90"
                    : "text-gray-700/70"
              }
            `}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {error || helperText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

// ============================================================================
// FLOATING LABEL INPUT (GLASS SPECIFIC)
// ============================================================================

interface FloatingLabelInputProps extends InputProps {
  label: string;
}

export const FloatingLabelInputGlassHeavy: React.FC<
  FloatingLabelInputProps
> = ({ label, value, glassIntensity = "heavy", ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = Boolean(value);
  const isFloating = isFocused || hasValue;

  return (
    <div className="relative">
      <InputGlassHeavy
        {...props}
        value={value}
        glassIntensity={glassIntensity}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className="pt-6"
      />

      <motion.label
        className={`
          absolute left-4 pointer-events-none transition-all duration-300
          ${
            isFloating
              ? "top-2 text-xs font-medium text-gray-700/80"
              : "top-1/2 -translate-y-1/2 text-base text-gray-600/60"
          }
        `}
        animate={{
          y: isFloating ? 0 : "0",
          scale: isFloating ? 0.85 : 1,
          color: isFocused ? "#374151" : "#6b7280",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {label}
      </motion.label>
    </div>
  );
};

InputGlassHeavy.displayName = "InputGlassHeavy";
TextareaGlassHeavy.displayName = "TextareaGlassHeavy";

export default InputGlassHeavy;
