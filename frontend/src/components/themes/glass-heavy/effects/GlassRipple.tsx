import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// GLASS RIPPLE EFFECT COMPONENT - INTERACTIVE WAVE ANIMATION
// FILE LOCATION: src/components/themes/glass-heavy/effects/GlassRipple.tsx
// ============================================================================

interface RippleData {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  intensity: number;
}

interface GlassRippleProps {
  children: React.ReactNode;
  duration?: number;
  intensity?: number;
  color?: string;
  trigger?: "click" | "hover" | "auto";
  className?: string;
  maxRipples?: number;
  rippleSize?: number;
}

const GlassRipple: React.FC<GlassRippleProps> = ({
  children,
  duration = 0.8,
  intensity = 0.3,
  color = "rgba(255,255,255,0.4)",
  trigger = "click",
  className = "",
  maxRipples = 3,
  rippleSize = 400,
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [ripples, setRipples] = useState<RippleData[]>([]);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // ============================================================================
  // RIPPLE CREATION
  // ============================================================================

  const createRipple = (
    clientX: number,
    clientY: number,
    customIntensity?: number
  ) => {
    if (!containerRef) return;

    const rect = containerRef.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const newRipple: RippleData = {
      id: Date.now() + Math.random(),
      x,
      y,
      timestamp: Date.now(),
      intensity: customIntensity || intensity,
    };

    setRipples((prev) => {
      const updated = [...prev, newRipple];
      // Keep only the most recent ripples
      return updated.slice(-maxRipples);
    });

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, duration * 1000);
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger === "click") {
      createRipple(e.clientX, e.clientY);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger === "hover") {
      createRipple(e.clientX, e.clientY, intensity * 0.7);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (trigger === "hover") {
      // Create subtle ripples on mouse movement
      const now = Date.now();
      const lastRipple = ripples[ripples.length - 1];

      // Throttle ripple creation
      if (!lastRipple || now - lastRipple.timestamp > 200) {
        createRipple(e.clientX, e.clientY, intensity * 0.3);
      }
    }
  };

  // ============================================================================
  // AUTO RIPPLE EFFECT
  // ============================================================================

  useEffect(() => {
    if (trigger === "auto" && containerRef) {
      const interval = setInterval(() => {
        const rect = containerRef.getBoundingClientRect();
        const randomX = Math.random() * rect.width;
        const randomY = Math.random() * rect.height;

        // Convert to client coordinates
        const clientX = rect.left + randomX;
        const clientY = rect.top + randomY;

        createRipple(clientX, clientY, intensity * 0.8);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [trigger, containerRef, intensity]);

  // ============================================================================
  // RIPPLE VARIANTS FOR ANIMATION
  // ============================================================================

  const rippleVariants = {
    initial: {
      scale: 0,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: [0, 1, 0.7, 0],
    },
    exit: {
      scale: 1.2,
      opacity: 0,
    },
  };

  // ============================================================================
  // ENHANCED RIPPLE STYLES
  // ============================================================================

  const getRippleStyle = (ripple: RippleData) => {
    const baseSize = rippleSize;
    const adjustedColor = color.replace(/[\d.]+\)$/, `${ripple.intensity})`);

    return {
      width: baseSize,
      height: baseSize,
      left: ripple.x - baseSize / 2,
      top: ripple.y - baseSize / 2,
      background: `radial-gradient(circle, ${adjustedColor} 0%, transparent 70%)`,
    };
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <div
      ref={setContainerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
    >
      {/* Ripple Effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none z-10"
            variants={rippleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: duration,
              ease: "easeOut",
              times: [0, 0.2, 0.8, 1],
            }}
            style={getRippleStyle(ripple)}
          />
        ))}
      </AnimatePresence>

      {/* Secondary Ripple Layer (for depth) */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={`secondary-${ripple.id}`}
            className="absolute rounded-full pointer-events-none z-10"
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 0.6,
              opacity: [0, ripple.intensity * 0.5, 0],
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
            }}
            transition={{
              duration: duration * 1.3,
              ease: "easeInOut",
              delay: duration * 0.1,
            }}
            style={{
              width: rippleSize * 0.7,
              height: rippleSize * 0.7,
              left: ripple.x - (rippleSize * 0.7) / 2,
              top: ripple.y - (rippleSize * 0.7) / 2,
              background: `radial-gradient(circle, ${color.replace(/[\d.]+\)$/, `${ripple.intensity * 0.3})`)} 0%, transparent 50%)`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Edge Glow Effect */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={`edge-${ripple.id}`}
            className="absolute rounded-full pointer-events-none z-10 border"
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1.2,
              opacity: [0, ripple.intensity * 0.8, 0],
            }}
            exit={{
              scale: 1.5,
              opacity: 0,
            }}
            transition={{
              duration: duration * 0.8,
              ease: "easeOut",
            }}
            style={{
              width: rippleSize * 1.1,
              height: rippleSize * 1.1,
              left: ripple.x - (rippleSize * 1.1) / 2,
              top: ripple.y - (rippleSize * 1.1) / 2,
              borderColor: color.replace(
                /[\d.]+\)$/,
                `${ripple.intensity * 0.4})`
              ),
              borderWidth: "1px",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default GlassRipple;
