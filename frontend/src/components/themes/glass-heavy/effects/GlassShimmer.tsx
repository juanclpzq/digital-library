import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ============================================================================
// GLASS SHIMMER EFFECT COMPONENT - ANIMATED LIGHT REFLECTION
// FILE LOCATION: src/components/themes/glass-heavy/effects/GlassShimmer.tsx
// ============================================================================

interface GlassShimmerProps {
  children: React.ReactNode;
  direction?: "horizontal" | "vertical" | "diagonal";
  duration?: number;
  intensity?: number;
  trigger?: "hover" | "auto" | "none";
  className?: string;
  repeat?: boolean;
  repeatDelay?: number;
}

const GlassShimmer: React.FC<GlassShimmerProps> = ({
  children,
  direction = "horizontal",
  duration = 2,
  intensity = 0.3,
  trigger = "auto",
  className = "",
  repeat = true,
  repeatDelay = 5,
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [isShimmering, setIsShimmering] = useState(trigger === "auto");
  const [shimmerKey, setShimmerKey] = useState(0);

  // ============================================================================
  // SHIMMER DIRECTION CONFIGURATION
  // ============================================================================

  const getShimmerDirection = () => {
    switch (direction) {
      case "vertical":
        return {
          from: "0% -100%",
          to: "0% 200%",
          gradient: "0deg", // vertical gradient
          size: "100% 200%",
        };
      case "diagonal":
        return {
          from: "-100% -100%",
          to: "200% 200%",
          gradient: "45deg", // diagonal gradient
          size: "200% 200%",
        };
      default: // horizontal
        return {
          from: "-100% 0%",
          to: "200% 0%",
          gradient: "90deg", // horizontal gradient
          size: "200% 100%",
        };
    }
  };

  const shimmerConfig = getShimmerDirection();

  // ============================================================================
  // SHIMMER GRADIENT CREATION
  // ============================================================================

  const createShimmerGradient = () => {
    const baseIntensity = intensity;
    const peakIntensity = Math.min(intensity * 2, 1);

    return `linear-gradient(${shimmerConfig.gradient}, 
      transparent 0%, 
      rgba(255,255,255,${baseIntensity * 0.3}) 20%,
      rgba(255,255,255,${peakIntensity}) 50%, 
      rgba(255,255,255,${baseIntensity * 0.3}) 80%,
      transparent 100%)`;
  };

  // ============================================================================
  // TRIGGER HANDLERS
  // ============================================================================

  const triggerShimmer = () => {
    setIsShimmering(true);
    setShimmerKey((prev) => prev + 1); // Force re-animation

    setTimeout(() => {
      if (trigger !== "auto") {
        setIsShimmering(false);
      }
    }, duration * 1000);
  };

  const handleHover = () => {
    if (trigger === "hover") {
      triggerShimmer();
    }
  };

  const handleHoverEnd = () => {
    if (trigger === "hover") {
      setIsShimmering(false);
    }
  };

  // ============================================================================
  // AUTO SHIMMER EFFECT
  // ============================================================================

  useEffect(() => {
    if (trigger === "auto" && repeat) {
      const interval = setInterval(
        () => {
          triggerShimmer();
        },
        (duration + repeatDelay) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [trigger, duration, repeatDelay, repeat]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const eventProps = {
    ...(trigger === "hover" && {
      onMouseEnter: handleHover,
      onMouseLeave: handleHoverEnd,
    }),
  };

  // ============================================================================
  // ANIMATION VARIANTS
  // ============================================================================

  const shimmerVariants = {
    initial: {
      backgroundPosition: shimmerConfig.from,
      opacity: 0,
    },
    animate: {
      backgroundPosition: shimmerConfig.to,
      opacity: [0, 1, 1, 0],
    },
    exit: {
      opacity: 0,
    },
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <div className={`relative overflow-hidden ${className}`} {...eventProps}>
      {/* Main Shimmer Effect */}
      {isShimmering && (
        <motion.div
          key={shimmerKey} // Force re-mount for re-animation
          className="absolute inset-0 z-10 pointer-events-none"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: duration,
            ease: "linear",
            times: [0, 0.1, 0.9, 1], // Control opacity timing
          }}
          style={{
            background: createShimmerGradient(),
            backgroundSize: shimmerConfig.size,
          }}
        />
      )}

      {/* Secondary Shimmer Layer (for depth) */}
      {isShimmering && intensity > 0.4 && (
        <motion.div
          key={`secondary-${shimmerKey}`}
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{
            backgroundPosition: shimmerConfig.from,
            opacity: 0,
          }}
          animate={{
            backgroundPosition: shimmerConfig.to,
            opacity: [0, intensity * 0.5, intensity * 0.5, 0],
          }}
          transition={{
            duration: duration * 1.2,
            ease: "easeInOut",
            delay: duration * 0.2,
            times: [0, 0.2, 0.8, 1],
          }}
          style={{
            background: `linear-gradient(${shimmerConfig.gradient}, 
              transparent 0%, 
              rgba(255,255,255,${intensity * 0.2}) 50%, 
              transparent 100%)`,
            backgroundSize: shimmerConfig.size,
          }}
        />
      )}

      {/* Sparkle Effects (for high intensity) */}
      {isShimmering && intensity > 0.6 && (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={`sparkle-${shimmerKey}-${index}`}
              className="absolute z-10 pointer-events-none"
              initial={{
                opacity: 0,
                scale: 0,
                x: `${20 + index * 30}%`,
                y: `${30 + index * 20}%`,
              }}
              animate={{
                opacity: [0, intensity, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: duration * 0.3,
                delay: duration * 0.3 + index * 0.1,
                ease: "easeOut",
              }}
              style={{
                width: "4px",
                height: "4px",
                background: `radial-gradient(circle, rgba(255,255,255,${intensity}) 0%, transparent 70%)`,
                borderRadius: "50%",
                filter: "blur(0.5px)",
              }}
            />
          ))}
        </>
      )}

      {/* Pre-shimmer Glow (anticipation effect) */}
      {trigger === "auto" && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isShimmering ? 0 : [0, intensity * 0.1, 0],
          }}
          transition={{
            duration: repeatDelay,
            ease: "easeInOut",
            repeat: trigger === "auto" ? Infinity : 0,
            repeatDelay: duration,
          }}
          style={{
            background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,${intensity * 0.1}) 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
};

export default GlassShimmer;
