import React from "react";
import { motion } from "framer-motion";

// ============================================================================
// REFRACTION EFFECT COMPONENT - LIGHT SIMULATION ON GLASS
// FILE LOCATION: src/components/themes/glass-heavy/effects/Refraction.tsx
// ============================================================================

interface RefractionProps {
  children: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
  animated?: boolean;
  direction?: "top" | "bottom" | "left" | "right" | "all";
  className?: string;
}

const Refraction: React.FC<RefractionProps> = ({
  children,
  intensity = "medium",
  animated = true,
  direction = "all",
  className = "",
}) => {
  // ============================================================================
  // INTENSITY CONFIGURATION
  // ============================================================================

  const intensityMap = {
    subtle: {
      highlight: "rgba(255,255,255,0.3)",
      shadow: "rgba(0,0,0,0.1)",
      thickness: "1px",
      blur: "0.5px",
    },
    medium: {
      highlight: "rgba(255,255,255,0.5)",
      shadow: "rgba(0,0,0,0.15)",
      thickness: "2px",
      blur: "1px",
    },
    strong: {
      highlight: "rgba(255,255,255,0.7)",
      shadow: "rgba(0,0,0,0.2)",
      thickness: "3px",
      blur: "1.5px",
    },
  };

  const config = intensityMap[intensity];

  // ============================================================================
  // REFRACTION LINES COMPONENTS
  // ============================================================================

  const TopRefraction = () => (
    <motion.div
      className="absolute top-0 left-0 right-0 z-10"
      initial={animated ? { opacity: 0, y: -2 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={animated ? { duration: 0.6, ease: "easeOut" } : undefined}
      style={{
        height: config.thickness,
        background: `linear-gradient(90deg, transparent 0%, ${config.highlight} 50%, transparent 100%)`,
        filter: `blur(${config.blur})`,
      }}
    />
  );

  const BottomRefraction = () => (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-10"
      initial={animated ? { opacity: 0, y: 2 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={
        animated ? { duration: 0.6, delay: 0.1, ease: "easeOut" } : undefined
      }
      style={{
        height: config.thickness,
        background: `linear-gradient(90deg, transparent 0%, ${config.shadow} 50%, transparent 100%)`,
        filter: `blur(${config.blur})`,
      }}
    />
  );

  const LeftRefraction = () => (
    <motion.div
      className="absolute top-0 bottom-0 left-0 z-10"
      initial={animated ? { opacity: 0, x: -2 } : undefined}
      animate={animated ? { opacity: 1, x: 0 } : undefined}
      transition={
        animated ? { duration: 0.6, delay: 0.2, ease: "easeOut" } : undefined
      }
      style={{
        width: config.thickness,
        background: `linear-gradient(180deg, transparent 0%, ${config.highlight} 50%, transparent 100%)`,
        filter: `blur(${config.blur})`,
      }}
    />
  );

  const RightRefraction = () => (
    <motion.div
      className="absolute top-0 bottom-0 right-0 z-10"
      initial={animated ? { opacity: 0, x: 2 } : undefined}
      animate={animated ? { opacity: 1, x: 0 } : undefined}
      transition={
        animated ? { duration: 0.6, delay: 0.3, ease: "easeOut" } : undefined
      }
      style={{
        width: config.thickness,
        background: `linear-gradient(180deg, transparent 0%, ${config.shadow} 50%, transparent 100%)`,
        filter: `blur(${config.blur})`,
      }}
    />
  );

  // ============================================================================
  // CORNER LIGHT EFFECTS
  // ============================================================================

  const CornerLights = () => (
    <>
      {/* Top-left corner highlight */}
      <motion.div
        className="absolute top-0 left-0 z-10"
        initial={animated ? { opacity: 0, scale: 0 } : undefined}
        animate={animated ? { opacity: 0.6, scale: 1 } : undefined}
        transition={
          animated ? { duration: 0.8, delay: 0.4, ease: "easeOut" } : undefined
        }
        style={{
          width: "8px",
          height: "8px",
          background: `radial-gradient(circle, ${config.highlight} 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: `blur(${config.blur})`,
        }}
      />

      {/* Top-right corner highlight */}
      <motion.div
        className="absolute top-0 right-0 z-10"
        initial={animated ? { opacity: 0, scale: 0 } : undefined}
        animate={animated ? { opacity: 0.4, scale: 1 } : undefined}
        transition={
          animated ? { duration: 0.8, delay: 0.5, ease: "easeOut" } : undefined
        }
        style={{
          width: "6px",
          height: "6px",
          background: `radial-gradient(circle, ${config.highlight} 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: `blur(${config.blur})`,
        }}
      />

      {/* Bottom-left shadow */}
      <motion.div
        className="absolute bottom-0 left-0 z-10"
        initial={animated ? { opacity: 0, scale: 0 } : undefined}
        animate={animated ? { opacity: 0.3, scale: 1 } : undefined}
        transition={
          animated ? { duration: 0.8, delay: 0.6, ease: "easeOut" } : undefined
        }
        style={{
          width: "4px",
          height: "4px",
          background: `radial-gradient(circle, ${config.shadow} 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: `blur(${config.blur})`,
        }}
      />

      {/* Bottom-right shadow */}
      <motion.div
        className="absolute bottom-0 right-0 z-10"
        initial={animated ? { opacity: 0, scale: 0 } : undefined}
        animate={animated ? { opacity: 0.5, scale: 1 } : undefined}
        transition={
          animated ? { duration: 0.8, delay: 0.7, ease: "easeOut" } : undefined
        }
        style={{
          width: "5px",
          height: "5px",
          background: `radial-gradient(circle, ${config.shadow} 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: `blur(${config.blur})`,
        }}
      />
    </>
  );

  // ============================================================================
  // ANIMATED LIGHT SWEEP
  // ============================================================================

  const LightSweep = () => (
    <motion.div
      className="absolute inset-0 z-10 pointer-events-none"
      initial={{
        background: `linear-gradient(45deg, transparent 0%, ${config.highlight} 50%, transparent 100%)`,
        backgroundSize: "200% 200%",
        backgroundPosition: "-100% -100%",
      }}
      animate={{
        backgroundPosition: "100% 100%",
      }}
      transition={{
        duration: 3,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 5,
      }}
      style={{
        opacity: animated ? 0.3 : 0,
      }}
    />
  );

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Refraction Lines Based on Direction */}
      {(direction === "all" || direction === "top") && <TopRefraction />}
      {(direction === "all" || direction === "bottom") && <BottomRefraction />}
      {(direction === "all" || direction === "left") && <LeftRefraction />}
      {(direction === "all" || direction === "right") && <RightRefraction />}

      {/* Corner Light Effects (only for "all" direction) */}
      {direction === "all" && <CornerLights />}

      {/* Animated Light Sweep */}
      {animated && <LightSweep />}

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
};

export default Refraction;
