import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// CONDENSATION EFFECT COMPONENT - GLASS FOGGING SIMULATION
// FILE LOCATION: src/components/themes/glass-heavy/effects/Condensation.tsx
// ============================================================================

interface CondensationProps {
  trigger?: "hover" | "click" | "auto";
  intensity?: number;
  duration?: number;
  className?: string;
  dropletsCount?: number;
}

const Condensation: React.FC<CondensationProps> = ({
  trigger = "hover",
  intensity = 0.6,
  duration = 1.5,
  className = "",
  dropletsCount = 8,
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [isActive, setIsActive] = useState(false);
  const [droplets, setDroplets] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      delay: number;
    }>
  >([]);

  // ============================================================================
  // DROPLET GENERATION
  // ============================================================================

  const generateDroplets = () => {
    const newDroplets = Array.from({ length: dropletsCount }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1, // 1-4px
      delay: index * 0.1,
    }));
    setDroplets(newDroplets);
  };

  // ============================================================================
  // TRIGGER HANDLERS
  // ============================================================================

  const handleTrigger = () => {
    if (trigger === "click") {
      setIsActive(true);
      generateDroplets();
      setTimeout(() => setIsActive(false), duration * 1000);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      setIsActive(true);
      generateDroplets();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setIsActive(false);
    }
  };

  // ============================================================================
  // AUTO TRIGGER EFFECT
  // ============================================================================

  useEffect(() => {
    if (trigger === "auto") {
      const interval = setInterval(() => {
        setIsActive(true);
        generateDroplets();
        setTimeout(() => setIsActive(false), duration * 1000);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [trigger, duration, dropletsCount]);

  // ============================================================================
  // EVENT PROPS
  // ============================================================================

  const eventProps = {
    ...(trigger === "hover" && {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    }),
    ...(trigger === "click" && {
      onClick: handleTrigger,
    }),
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      {...eventProps}
    >
      <AnimatePresence>
        {isActive && (
          <>
            {/* Main Condensation Fog Effect */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: intensity }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity}) 0%, transparent 70%)`,
              }}
            />

            {/* Secondary Fog Layers */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: intensity * 0.6, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                background: `radial-gradient(ellipse at 30% 70%, rgba(255,255,255,${intensity * 0.4}) 0%, transparent 60%)`,
              }}
            />

            {/* Water Droplets */}
            {droplets.map((droplet) => (
              <motion.div
                key={droplet.id}
                className="absolute bg-white/40 rounded-full backdrop-blur-sm"
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: `${droplet.x}%`,
                  y: `${droplet.y}%`,
                }}
                animate={{
                  opacity: [0, intensity, intensity * 0.8, 0],
                  scale: [0, 1, 1.2, 0.8],
                  y: `${droplet.y + 20}%`, // Droplets fall down
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: duration,
                  delay: droplet.delay,
                  ease: "easeOut",
                }}
                style={{
                  width: `${droplet.size}px`,
                  height: `${droplet.size}px`,
                }}
              />
            ))}

            {/* Subtle Shimmer Effect */}
            <motion.div
              className="absolute inset-0"
              initial={{
                background:
                  "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                backgroundSize: "200% 200%",
                backgroundPosition: "-100% -100%",
              }}
              animate={{
                backgroundPosition: "100% 100%",
              }}
              transition={{
                duration: duration * 0.8,
                ease: "linear",
              }}
            />

            {/* Edge Condensation Lines */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px]"
              initial={{
                opacity: 0,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
              }}
              animate={{
                opacity: intensity * 0.8,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            />

            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[1px]"
              initial={{
                opacity: 0,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              }}
              animate={{
                opacity: intensity * 0.6,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Condensation;
