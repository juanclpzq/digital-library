// ============================================================================
// MODAL GLASS HEAVY - INTENSE GLASSMORPHISM MODAL COMPONENT
// FILE LOCATION: src/components/themes/glass-heavy/Modal.tsx
// ============================================================================

import React, { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useTheme } from "@/theme/ThemeProvider";
import GlassContainer from "./effects/GlassContainer";
import GlassShimmer from "./effects/GlassShimmer";
import Condensation from "./effects/Condensation";
import Refraction from "./effects/Refraction";

// ============================================================================
// MODAL PROPS INTERFACE (SAME AS SOFTCLUB + GLASS EXTRAS)
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
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  shimmer?: boolean;
  condensation?: boolean;
  depth?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  onAnimationComplete?: () => void;
}

// ============================================================================
// GLASS HEAVY MODAL STYLES
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
    mint: "bg-gradient-to-br from-emerald-400/20 via-teal-400/15 to-cyan-400/10",
    cyan: "bg-gradient-to-br from-cyan-400/20 via-blue-400/15 to-indigo-400/10",
    peach: "bg-gradient-to-br from-orange-400/15 via-pink-400/20 to-red-400/10",
    lavender:
      "bg-gradient-to-br from-purple-400/20 via-pink-400/15 to-rose-400/10",
    coral:
      "bg-gradient-to-br from-pink-400/15 via-rose-400/20 to-orange-400/10",
    custom: customGradient || "bg-gradient-to-br from-white/15 to-white/5",
  };

  return gradients[gradient || "cyan"];
};

// ============================================================================
// GLASS CLOSE BUTTON COMPONENT
// ============================================================================

const GlassCloseButton: React.FC<{
  onClose: () => void;
  className?: string;
  intensity: string;
}> = ({ onClose, className = "", intensity }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClose}
      className={`
        relative p-3 rounded-xl backdrop-blur-md bg-white/15 
        text-white/80 hover:text-white 
        border border-white/25 hover:border-white/40
        hover:bg-white/25 transition-all duration-300 overflow-hidden ${className}
      `}
      whileHover={{ scale: 1.05, rotate: 90 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      aria-label="Close modal"
    >
      {/* Glass effects */}
      {isHovered && <GlassShimmer intensity={intensity} active />}
      <Refraction intensity={isHovered ? "high" : "low"} animated={isHovered} />

      <svg
        className="w-5 h-5 relative z-10"
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

      {/* Corner highlight */}
      <motion.div
        className="absolute top-0 right-0 w-4 h-4 bg-white/10 rounded-tr-xl rounded-bl-lg"
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

// ============================================================================
// MAIN GLASS MODAL COMPONENT
// ============================================================================

const ModalGlassHeavy: React.FC<ModalProps> = ({
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
  glassIntensity = "medium",
  shimmer = true,
  condensation = true,
  depth = true,
  className = "",
  overlayClassName = "",
  contentClassName = "",
  headerClassName = "",
  footerClassName = "",
  footer,
  onAnimationComplete,
}) => {
  const theme = useTheme();
  const [isContentHovered, setIsContentHovered] = useState(false);

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

  // Glass animation variants
  const overlayVariants = {
    hidden: {
      opacity: 0,
      backdropFilter: "blur(0px)",
    },
    visible: {
      opacity: 1,
      backdropFilter: "blur(8px)",
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 80,
      filter: "blur(20px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        onComplete: onAnimationComplete,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 50,
      filter: "blur(10px)",
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const drawerVariants = {
    hidden: {
      opacity: 0,
      x: -400,
      filter: "blur(20px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -400,
      filter: "blur(10px)",
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  const getModalVariants = () => {
    if (variant === "drawer") return drawerVariants;
    if (variant === "fullscreen") return modalVariants;
    return modalVariants;
  };

  const overlayClasses = [
    "fixed inset-0 z-50 flex",
    variant === "centered"
      ? "items-center justify-center"
      : "items-start justify-center",
    variant === "drawer" ? "justify-start" : "",
    variant === "fullscreen" ? "items-center justify-center" : "",
    "bg-black/40",
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
            className={`
              relative w-full flex flex-col ${sizeStyles} ${variantStyles}
              ${variant === "fullscreen" ? "h-full" : "max-h-[90vh]"}
            `}
            variants={animate ? getModalVariants() : undefined}
            initial={animate ? "hidden" : false}
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            onHoverStart={() => setIsContentHovered(true)}
            onHoverEnd={() => setIsContentHovered(false)}
          >
            <GlassContainer
              variant="modal"
              intensity={glassIntensity}
              className={`w-full h-full flex flex-col ${gradientStyles} ${contentClassName}`}
              effects={{
                layers: true,
                condensation: condensation && isContentHovered,
                refraction: true,
                shimmer: shimmer && isContentHovered,
                ripple: false,
                depth: depth,
              }}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <motion.div
                  className={`
                    flex items-center justify-between p-6 border-b border-white/20
                    ${headerClassName}
                  `}
                  initial={
                    animate
                      ? { opacity: 0, y: -30, filter: "blur(10px)" }
                      : false
                  }
                  animate={
                    animate
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : undefined
                  }
                  transition={
                    animate ? { delay: 0.2, duration: 0.4 } : undefined
                  }
                >
                  {title && (
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {title}
                    </h2>
                  )}

                  {showCloseButton && (
                    <GlassCloseButton
                      onClose={onClose}
                      intensity={glassIntensity}
                      className="ml-4"
                    />
                  )}
                </motion.div>
              )}

              {/* Content */}
              <motion.div
                className={`flex-1 overflow-y-auto p-6 relative ${className}`}
                initial={
                  animate ? { opacity: 0, y: 30, filter: "blur(10px)" } : false
                }
                animate={
                  animate
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : undefined
                }
                transition={animate ? { delay: 0.3, duration: 0.4 } : undefined}
              >
                {children}

                {/* Content area glass particles */}
                {isContentHovered && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full backdrop-blur-sm"
                        style={{
                          left: `${10 + Math.random() * 80}%`,
                          top: `${10 + Math.random() * 80}%`,
                        }}
                        animate={{
                          y: [0, -25, 0],
                          opacity: [0.3, 0.8, 0.3],
                          scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                          duration: 4 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Footer */}
              {footer && (
                <motion.div
                  className={`
                    flex items-center justify-end gap-4 p-6 border-t border-white/20
                    ${footerClassName}
                  `}
                  initial={
                    animate
                      ? { opacity: 0, y: 30, filter: "blur(10px)" }
                      : false
                  }
                  animate={
                    animate
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : undefined
                  }
                  transition={
                    animate ? { delay: 0.4, duration: 0.4 } : undefined
                  }
                >
                  {footer}
                </motion.div>
              )}
            </GlassContainer>

            {/* Enhanced ambient glow */}
            <motion.div
              className="absolute -inset-4 bg-gradient-radial from-white/10 via-transparent to-transparent rounded-full blur-2xl pointer-events-none"
              animate={{
                opacity: isContentHovered ? 0.6 : 0.3,
                scale: isContentHovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Corner accent lights */}
            <motion.div
              className="absolute top-2 right-2 w-8 h-8 bg-white/10 rounded-full blur-md pointer-events-none"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute bottom-2 left-2 w-6 h-6 bg-white/5 rounded-full blur-sm pointer-events-none"
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ModalGlassHeavy;
