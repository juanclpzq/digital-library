// ============================================================================
// MODAL SOFTCLUB - GEN X NOSTALGIC MODAL COMPONENT
// FILE LOCATION: src/components/themes/softclub/Modal.tsx
// ============================================================================

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useTheme } from "@/theme/ThemeProvider";

// ============================================================================
// MODAL PROPS INTERFACE
// ============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  variant?: "default" | "centered" | "drawer" | "fullscreen";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  gradient?: "mint" | "cyan" | "peach" | "lavender" | "coral" | "custom";
  customGradient?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  shadow?: "soft" | "gentle" | "strong";
  animate?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  onAnimationComplete?: () => void;
}

// ============================================================================
// SOFTCLUB MODAL STYLES
// ============================================================================

const getSizeStyles = (size: ModalProps["size"]) => {
  const sizes = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return sizes[size || "md"];
};

const getVariantStyles = (variant: ModalProps["variant"]) => {
  const variants = {
    default: "mx-4 my-8",
    centered: "mx-4",
    drawer: "ml-0 mr-4 my-0 h-full",
    fullscreen: "m-0 w-full h-full",
  };

  return variants[variant || "default"];
};

const getGradientStyles = (
  gradient: ModalProps["gradient"],
  customGradient?: string
) => {
  if (gradient === "custom" && customGradient) {
    return customGradient;
  }

  const gradients = {
    mint: "bg-gradient-to-br from-cloud-white via-mint-dream/20 to-emerald-100",
    cyan: "bg-gradient-to-br from-cloud-white via-soft-cyan/20 to-blue-100",
    peach:
      "bg-gradient-to-br from-cloud-white via-peachy-keen/20 to-orange-100",
    lavender:
      "bg-gradient-to-br from-cloud-white via-lavender-mist/30 to-purple-100",
    coral: "bg-gradient-to-br from-cloud-white via-sunset-coral/20 to-pink-100",
    custom:
      customGradient || "bg-gradient-to-br from-cloud-white to-silver-matte/50",
  };

  return gradients[gradient || "cyan"];
};

const getRoundedStyles = (rounded: ModalProps["rounded"]) => {
  const styles = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    "2xl": "rounded-3xl",
    "3xl": "rounded-3xl",
  };

  return styles[rounded || "2xl"];
};

const getShadowStyles = (shadow: ModalProps["shadow"]) => {
  const shadows = {
    soft: "shadow-soft",
    gentle: "shadow-gentle",
    strong: "shadow-lg shadow-midnight-navy/20",
  };

  return shadows[shadow || "gentle"];
};

// ============================================================================
// CLOSE BUTTON COMPONENT
// ============================================================================

const CloseButton: React.FC<{ onClose: () => void; className?: string }> = ({
  onClose,
  className = "",
}) => {
  return (
    <motion.button
      onClick={onClose}
      className={`
        p-2 rounded-xl bg-gradient-to-r from-silver-matte/60 to-cloud-white/80 
        text-midnight-navy/70 hover:text-midnight-navy 
        border border-white/40 hover:border-white/60
        hover:from-silver-matte/80 hover:to-cloud-white
        transition-all duration-300 ${className}
      `}
      whileHover={{ scale: 1.05, rotate: 90 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Close modal"
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </motion.button>
  );
};

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

const ModalSoftclub: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  variant = "default",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventScroll = true,
  gradient = "cyan",
  customGradient,
  rounded = "2xl",
  shadow = "gentle",
  animate = true,
  className = "",
  overlayClassName = "",
  contentClassName = "",
  headerClassName = "",
  footerClassName = "",
  footer,
  onAnimationComplete,
}) => {
  const theme = useTheme();

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape && isOpen) {
        onClose();
      }
    },
    [closeOnEscape, isOpen, onClose]
  );

  // Handle scroll prevention
  useEffect(() => {
    if (isOpen && preventScroll) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, preventScroll]);

  // Add event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleEscape]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Get styles
  const sizeStyles = getSizeStyles(size);
  const variantStyles = getVariantStyles(variant);
  const gradientStyles = getGradientStyles(gradient, customGradient);
  const roundedStyles = getRoundedStyles(rounded);
  const shadowStyles = getShadowStyles(shadow);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 50,
      rotate: -2,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.25, 0, 1],
        onComplete: onAnimationComplete,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 30,
      rotate: 1,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const drawerVariants = {
    hidden: {
      opacity: 0,
      x: -300,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.25, 0, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -300,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const getModalVariants = () => {
    if (variant === "drawer") return drawerVariants;
    if (variant === "fullscreen") return modalVariants;
    return modalVariants;
  };

  const modalClasses = [
    "relative w-full flex flex-col",
    "border border-white/50 backdrop-blur-sm",
    gradientStyles,
    roundedStyles,
    shadowStyles,
    sizeStyles,
    variantStyles,
    variant === "fullscreen" ? "h-full" : "max-h-[90vh]",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const overlayClasses = [
    "fixed inset-0 z-50 flex",
    variant === "centered"
      ? "items-center justify-center"
      : "items-start justify-center",
    variant === "drawer" ? "justify-start" : "",
    variant === "fullscreen" ? "items-center justify-center" : "",
    "bg-midnight-navy/50 backdrop-blur-sm",
    overlayClassName,
  ]
    .filter(Boolean)
    .join(" ");

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={overlayClasses}
          variants={animate ? overlayVariants : undefined}
          initial={animate ? "hidden" : false}
          animate="visible"
          exit="exit"
          onClick={handleOverlayClick}
        >
          <motion.div
            className={modalClasses}
            variants={animate ? getModalVariants() : undefined}
            initial={animate ? "hidden" : false}
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <motion.div
                className={`
                  flex items-center justify-between p-6 border-b border-white/30
                  ${headerClassName}
                `}
                initial={animate ? { opacity: 0, y: -20 } : false}
                animate={animate ? { opacity: 1, y: 0 } : undefined}
                transition={animate ? { delay: 0.1, duration: 0.3 } : undefined}
              >
                {title && (
                  <h2 className="text-2xl font-bold text-midnight-navy tracking-tight">
                    {title}
                  </h2>
                )}

                {showCloseButton && (
                  <CloseButton onClose={onClose} className="ml-4" />
                )}
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              className={`flex-1 overflow-y-auto p-6 ${className}`}
              initial={animate ? { opacity: 0, y: 20 } : false}
              animate={animate ? { opacity: 1, y: 0 } : undefined}
              transition={animate ? { delay: 0.2, duration: 0.3 } : undefined}
            >
              {children}
            </motion.div>

            {/* Footer */}
            {footer && (
              <motion.div
                className={`
                  flex items-center justify-end gap-3 p-6 border-t border-white/30
                  ${footerClassName}
                `}
                initial={animate ? { opacity: 0, y: 20 } : false}
                animate={animate ? { opacity: 1, y: 0 } : undefined}
                transition={animate ? { delay: 0.3, duration: 0.3 } : undefined}
              >
                {footer}
              </motion.div>
            )}

            {/* Decorative floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-inherit">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-soft-cyan/20 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Gentle glow effect */}
            <motion.div
              className="absolute inset-0 rounded-inherit pointer-events-none"
              animate={{
                boxShadow: "0 0 40px rgba(177, 156, 217, 0.1)",
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ModalSoftclub;
