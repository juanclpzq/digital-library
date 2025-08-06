// ============================================================================
// GLASS DEPTH EFFECT - 3D PERSPECTIVE & DEPTH FOR GLASS HEAVY THEME
// FILE LOCATION: src/components/themes/glass-heavy/effects/GlassDepth.tsx
// ============================================================================

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ============================================================================
// GLASS DEPTH PROPS INTERFACE
// ============================================================================

export interface GlassDepthProps {
  children: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong" | "extreme";
  enableParallax?: boolean;
  enableTilt?: boolean;
  enablePerspective?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// ============================================================================
// DEPTH INTENSITY CONFIGURATIONS
// ============================================================================

const depthConfigs = {
  subtle: {
    maxTilt: 5,
    maxParallax: 10,
    perspective: 800,
    transformOrigin: "center center",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
  medium: {
    maxTilt: 10,
    maxParallax: 20,
    perspective: 600,
    transformOrigin: "center center",
    shadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
  },
  strong: {
    maxTilt: 15,
    maxParallax: 30,
    perspective: 400,
    transformOrigin: "center center",
    shadow: "0 16px 64px rgba(0, 0, 0, 0.2)",
  },
  extreme: {
    maxTilt: 25,
    maxParallax: 50,
    perspective: 300,
    transformOrigin: "center center",
    shadow: "0 24px 80px rgba(0, 0, 0, 0.25)",
  },
};

// ============================================================================
// GLASS DEPTH COMPONENT
// ============================================================================

const GlassDepth: React.FC<GlassDepthProps> = ({
  children,
  intensity = "medium",
  enableParallax = true,
  enableTilt = true,
  enablePerspective = true,
  className = "",
  style = {},
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const config = depthConfigs[intensity];

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth movement
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [config.maxTilt, -config.maxTilt]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-config.maxTilt, config.maxTilt]),
    springConfig
  );

  // Parallax transforms for depth layers
  const parallaxX = useSpring(
    useTransform(mouseX, [0, 1], [-config.maxParallax, config.maxParallax]),
    springConfig
  );
  const parallaxY = useSpring(
    useTransform(mouseY, [0, 1], [-config.maxParallax, config.maxParallax]),
    springConfig
  );

  // Scale for hover effect
  const scale = useSpring(1, springConfig);

  // Update bounds when component mounts or resizes
  useEffect(() => {
    const updateBounds = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setBounds({ width: rect.width, height: rect.height });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  // Handle mouse movement for 3D effect
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt && !enableParallax) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseXPercent = (event.clientX - centerX) / (rect.width / 2);
    const mouseYPercent = (event.clientY - centerY) / (rect.height / 2);

    mouseX.set(Math.max(-1, Math.min(1, mouseXPercent)));
    mouseY.set(Math.max(-1, Math.min(1, mouseYPercent)));
  };

  // Reset transforms when mouse leaves
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    scale.set(1.02);
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative transform-gpu ${className}`}
      style={{
        perspective: enablePerspective ? config.perspective : "none",
        transformStyle: "preserve-3d",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Main 3D Container */}
      <motion.div
        className="relative w-full h-full transform-gpu"
        style={{
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          scale: scale,
          transformOrigin: config.transformOrigin,
          filter: isHovered ? "brightness(1.05)" : "brightness(1)",
        }}
        transition={{ type: "spring", ...springConfig }}
      >
        {/* Background Depth Layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 rounded-inherit backdrop-blur-[1px]"
          style={{
            translateX: enableParallax ? parallaxX : 0,
            translateY: enableParallax ? parallaxY : 0,
            translateZ: -20,
          }}
        />

        {/* Middle Depth Layer */}
        <motion.div
          className="absolute inset-2 bg-gradient-to-br from-white/3 to-transparent rounded-inherit"
          style={{
            translateX: enableParallax
              ? useTransform(parallaxX, (x) => x * 0.7)
              : 0,
            translateY: enableParallax
              ? useTransform(parallaxY, (y) => y * 0.7)
              : 0,
            translateZ: -10,
          }}
        />

        {/* Main Content Layer */}
        <motion.div
          className="relative z-10 w-full h-full"
          style={{
            translateZ: 0,
          }}
        >
          {children}
        </motion.div>

        {/* Foreground Highlight Layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-inherit pointer-events-none"
          style={{
            translateX: enableParallax
              ? useTransform(parallaxX, (x) => x * -0.3)
              : 0,
            translateY: enableParallax
              ? useTransform(parallaxY, (y) => y * -0.3)
              : 0,
            translateZ: 10,
            opacity: isHovered ? 0.6 : 0.3,
          }}
        />

        {/* Dynamic Shadow */}
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none"
          style={{
            boxShadow: config.shadow,
            translateZ: -30,
            opacity: isHovered ? 0.8 : 0.6,
          }}
        />

        {/* Edge Glints for Enhanced 3D Effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            translateZ: 1,
            opacity: isHovered ? 0.8 : 0.4,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            translateZ: 1,
            opacity: isHovered ? 0.6 : 0.3,
          }}
        />
        <motion.div
          className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/25 to-transparent"
          style={{
            translateZ: 1,
            opacity: isHovered ? 0.7 : 0.35,
          }}
        />
        <motion.div
          className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/25 to-transparent"
          style={{
            translateZ: 1,
            opacity: isHovered ? 0.7 : 0.35,
          }}
        />
      </motion.div>

      {/* Ambient Light Effect */}
      <motion.div
        className="absolute -inset-4 bg-gradient-radial from-white/5 via-transparent to-transparent rounded-full blur-2xl pointer-events-none"
        style={{
          opacity: isHovered ? 0.4 : 0.2,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default GlassDepth;

// ============================================================================
// USAGE EXAMPLES & PRESETS
// ============================================================================

/**
 * Preset configurations for common use cases
 */
export const GlassDepthPresets = {
  Card: {
    intensity: "medium" as const,
    enableParallax: true,
    enableTilt: true,
    enablePerspective: true,
  },

  Modal: {
    intensity: "strong" as const,
    enableParallax: false,
    enableTilt: true,
    enablePerspective: true,
  },

  Button: {
    intensity: "subtle" as const,
    enableParallax: false,
    enableTilt: true,
    enablePerspective: false,
  },

  Dashboard: {
    intensity: "extreme" as const,
    enableParallax: true,
    enableTilt: true,
    enablePerspective: true,
  },
};

/**
 * Utility component for quick card depth application
 */
export const GlassDepthCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <GlassDepth {...GlassDepthPresets.Card} className={className}>
    {children}
  </GlassDepth>
);
