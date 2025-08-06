// ============================================================================
// INPUT SOFTCLUB - GEN X NOSTALGIC INPUT COMPONENT
// FILE LOCATION: src/components/themes/softclub/Input.tsx
// ============================================================================

import React, { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { softclubColors } from "@/theme/softclub";

// ============================================================================
// INPUT PROPS INTERFACE
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
}

// ============================================================================
// SOFTCLUB INPUT VARIANTS
// ============================================================================

const getSoftclubVariantStyles = (
  variant: InputProps["variant"],
  hasError: boolean,
  isSuccess: boolean,
  isFocused: boolean
) => {
  const baseTransition = "transition-all duration-300 ease-soft";

  // Error state overrides everything
  if (hasError) {
    return `
      bg-peachy-keen/20 border-sunset-coral/60 text-midnight-navy
      ring-2 ring-sunset-coral/20 shadow-gentle shadow-sunset-coral/10
      placeholder:text-sunset-coral/60
      focus:border-sunset-coral/80 focus:ring-sunset-coral/30
      ${baseTransition}
    `;
  }

  // Success state
  if (isSuccess) {
    return `
      bg-mint-dream/20 border-mint-dream/60 text-midnight-navy
      ring-2 ring-mint-dream/20 shadow-gentle shadow-mint-dream/10
      placeholder:text-mint-dream/60
      focus:border-mint-dream/80 focus:ring-mint-dream/30
      ${baseTransition}
    `;
  }

  const variants = {
    default: `
      bg-cloud-white/60 border border-silver-matte/40
      text-midnight-navy placeholder:text-midnight-navy/50
      shadow-gentle hover:shadow-mint-glow
      focus:border-soft-cyan/60 focus:ring-2 focus:ring-soft-cyan/20
      hover:border-soft-cyan/40 hover:bg-cloud-white/70
      ${isFocused ? "bg-cloud-white/80 border-soft-cyan/60 ring-2 ring-soft-cyan/20" : ""}
      ${baseTransition}
    `,

    filled: `
      bg-gradient-to-r from-cloud-white/80 to-silver-matte/60
      border border-transparent text-midnight-navy
      placeholder:text-midnight-navy/60 shadow-inset-soft
      focus:ring-2 focus:ring-soft-cyan/30 focus:bg-cloud-white/90
      hover:from-cloud-white/85 hover:to-silver-matte/65
      ${baseTransition}
    `,

    outlined: `
      bg-transparent border-2 border-soft-cyan/40
      text-midnight-navy placeholder:text-midnight-navy/60
      shadow-none hover:border-soft-cyan/60
      focus:border-soft-cyan/80 focus:ring-2 focus:ring-soft-cyan/20
      hover:bg-cloud-white/10
      ${baseTransition}
    `,

    ghost: `
      bg-transparent border border-transparent
      text-midnight-navy placeholder:text-midnight-navy/60
      shadow-none hover:bg-cloud-white/20 hover:border-silver-matte/30
      focus:bg-cloud-white/30 focus:border-soft-cyan/40
      focus:ring-2 focus:ring-soft-cyan/15
      ${baseTransition}
    `,
  };

  return variants[variant || "default"];
};

// ============================================================================
// SIZE VARIANTS
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
// ROUNDED VARIANTS
// ============================================================================

const getRoundedStyles = (rounded: InputProps["rounded"]) => {
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

const InputSoftclub = forwardRef<HTMLInputElement, InputProps>(
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
    // STATE MANAGEMENT
    // ============================================================================

    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || "");

    const hasError = Boolean(error);
    const hasValue = Boolean(internalValue || value);
    const showClearButton = clearable && hasValue && !disabled;

    // ============================================================================
    // DYNAMIC STYLES
    // ============================================================================

    const variantStyles = getSoftclubVariantStyles(
      variant,
      hasError,
      success,
      isFocused
    );
    const sizeStyles = getSizeStyles(inputSize);
    const roundedStyles = getRoundedStyles(rounded);

    const containerStyles = `
    relative w-full
    ${glow && isFocused ? "filter drop-shadow-lg drop-shadow-soft-cyan/20" : ""}
  `;

    const inputStyles = `
    w-full outline-none disabled:opacity-60 disabled:cursor-not-allowed
    ${variantStyles}
    ${sizeStyles}  
    ${roundedStyles}
    ${leftIcon ? "pl-10" : ""}
    ${rightIcon || showClearButton || loading ? "pr-10" : ""}
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
      // Create synthetic event for onChange
      if (onChange && ref && "current" in ref && ref.current) {
        const syntheticEvent = {
          target: { ...ref.current, value: "" },
          currentTarget: ref.current,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    // ============================================================================
    // LOADING SPINNER
    // ============================================================================

    const LoadingSpinner = () => (
      <motion.div
        className="w-4 h-4 border-2 border-soft-cyan border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );

    // ============================================================================
    // RENDER COMPONENT
    // ============================================================================

    return (
      <div className="w-full space-y-1">
        {/* Label */}
        {label && (
          <motion.label
            className={`
            block text-sm font-medium transition-colors duration-200
            ${
              hasError
                ? "text-sunset-coral"
                : success
                  ? "text-mint-dream"
                  : isFocused
                    ? "text-soft-cyan"
                    : "text-midnight-navy/70"
            }
          `}
            animate={{
              color: hasError
                ? softclubColors.sunsetCoral
                : success
                  ? softclubColors.mintDream
                  : isFocused
                    ? softclubColors.softCyan
                    : softclubColors.midnightNavy + "70",
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className={containerStyles}>
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-navy/60 pointer-events-none">
              <span
                className={`
              ${inputSize === "sm" ? "text-sm" : inputSize === "lg" ? "text-lg" : "text-base"}
              transition-colors duration-200
              ${isFocused ? "text-soft-cyan" : ""}
            `}
              >
                {leftIcon}
              </span>
            </div>
          )}

          {/* Main Input */}
          <motion.input
            ref={ref}
            className={inputStyles}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            whileFocus={{ scale: glow ? 1.02 : 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            {...props}
          />

          {/* Right Side Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {/* Loading Spinner */}
            {loading && <LoadingSpinner />}

            {/* Clear Button */}
            <AnimatePresence>
              {showClearButton && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  className={`
                  text-midnight-navy/60 hover:text-sunset-coral
                  transition-colors duration-200 p-1 rounded-full
                  hover:bg-sunset-coral/10
                  ${inputSize === "sm" ? "text-xs" : "text-sm"}
                `}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
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
            </AnimatePresence>

            {/* Right Icon */}
            {rightIcon && (
              <span
                className={`
              text-midnight-navy/60 transition-colors duration-200
              ${inputSize === "sm" ? "text-sm" : inputSize === "lg" ? "text-lg" : "text-base"}
              ${isFocused ? "text-soft-cyan" : ""}
            `}
              >
                {rightIcon}
              </span>
            )}
          </div>

          {/* Focus Ring Animation */}
          <AnimatePresence>
            {isFocused && glow && (
              <motion.div
                className="absolute inset-0 rounded-[inherit] ring-2 ring-soft-cyan/30 pointer-events-none"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Helper Text / Error Message */}
        <AnimatePresence>
          {(error || helperText) && (
            <motion.div
              className={`
              text-xs transition-colors duration-200
              ${
                hasError
                  ? "text-sunset-coral"
                  : success
                    ? "text-mint-dream"
                    : "text-midnight-navy/60"
              }
            `}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
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
// SEARCH INPUT VARIANT
// ============================================================================

interface SearchInputProps extends Omit<InputProps, "leftIcon" | "rightIcon"> {
  onSearch?: (value: string) => void;
  searchIcon?: React.ReactNode;
  showSearchButton?: boolean;
}

export const SearchInputSoftclub: React.FC<SearchInputProps> = ({
  onSearch,
  searchIcon,
  showSearchButton = true,
  placeholder = "Search...",
  rounded = "full",
  ...props
}) => {
  const [searchValue, setSearchValue] = useState("");

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
    <InputSoftclub
      {...props}
      placeholder={placeholder}
      rounded={rounded}
      leftIcon={searchIcon || defaultSearchIcon}
      rightIcon={
        showSearchButton ? (
          <motion.button
            type="button"
            onClick={handleSearch}
            className="text-soft-cyan hover:text-soft-cyan/80 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
// TEXTAREA VARIANT
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
}

export const TextareaSoftclub = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      disabled,
      className = "",
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const hasError = Boolean(error);
    const variantStyles = getSoftclubVariantStyles(
      variant,
      hasError,
      success,
      isFocused
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
    min-h-[100px] ${resizeStyles[resize]}
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
      <div className="w-full space-y-1">
        {/* Label */}
        {label && (
          <label
            className={`
          block text-sm font-medium transition-colors duration-200
          ${
            hasError
              ? "text-sunset-coral"
              : success
                ? "text-mint-dream"
                : isFocused
                  ? "text-soft-cyan"
                  : "text-midnight-navy/70"
          }
        `}
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <motion.textarea
          ref={ref}
          className={textareaStyles}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          whileFocus={{ scale: glow ? 1.01 : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          {...props}
        />

        {/* Helper Text / Error Message */}
        <AnimatePresence>
          {(error || helperText) && (
            <motion.div
              className={`
              text-xs transition-colors duration-200
              ${
                hasError
                  ? "text-sunset-coral"
                  : success
                    ? "text-mint-dream"
                    : "text-midnight-navy/60"
              }
            `}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {error || helperText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

InputSoftclub.displayName = "InputSoftclub";
TextareaSoftclub.displayName = "TextareaSoftclub";

export default InputSoftclub;
