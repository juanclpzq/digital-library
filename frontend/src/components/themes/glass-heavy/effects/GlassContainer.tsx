// ============================================================================
// GLASS CONTAINER - COMPOSITE CONTAINER WITH ALL GLASS EFFECTS
// FILE LOCATION: src/components/themes/glass-heavy/effects/GlassContainer.tsx
// ============================================================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import GlassLayers from "./GlassLayers";
import Condensation from "./Condensation";
import Refraction from "./Refraction";
import GlassShimmer from "./GlassShimmer";
import GlassRipple from "./GlassRipple";
import GlassDepth from "./GlassDepth";

// ============================================================================
// GLASS CONTAINER PROPS INTERFACE
// ============================================================================

export interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  // Glass intensity control
  intensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";

  // Effect toggles
  effects?: {
    layers?: boolean;
    condensation?: boolean;
    refraction?: boolean;
    shimmer?: boolean;
    ripple?: boolean;
    depth?: boolean;
  };

  // Effect configurations
  layerCount?: number;
  condensationDensity?: "low" | "medium" | "high";
  refractionIntensity?: "low" | "medium" | "high";
  shimmerSpeed?: "slow" | "medium" | "fast";
  depthIntensity?: "subtle" | "medium" | "strong" | "extreme";

  // Interaction
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
  interactive?: boolean;

  // Variants
  variant?: "card" | "modal" | "button" | "panel" | "custom";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

  // Advanced settings
  blendMode?: "normal" | "multiply" | "screen" | "overlay" | "soft-light";
  preserveAspectRatio?: boolean;
}

// ============================================================================
// VARIANT CONFIGURATIONS
// ============================================================================

const variantConfigs = {
  card: {
    intensity: "medium" as const,
    effects: {
      layers: true,
      condensation: true,
      refraction: true,
      shimmer: true,
      ripple: true,
      depth: true,
    },
    rounded: "2xl" as const,
    padding: "p-6",
    border: "border border-white/20",
  },

  modal: {
    intensity: "heavy" as const,
    effects: {
      layers: true,
      condensation: true,
      refraction: true,
      shimmer: false,
      ripple: false,
      depth: true,
    },
    rounded: "3xl" as const,
    padding: "p-8",
    border: "border border-white/30",
  },

  button: {
    intensity: "light" as const,
    effects: {
      layers: false,
      condensation: false,
      refraction: true,
      shimmer: true,
      ripple: true,
      depth: false,
    },
    rounded: "xl" as const,
    padding: "px-6 py-3",
    border: "border border-white/25",
  },

  panel: {
    intensity: "medium" as const,
    effects: {
      layers: true,
      condensation: true,
      refraction: false,
      shimmer: false,
      ripple: false,
      depth: true,
    },
    rounded: "2xl" as const,
    padding: "p-8",
    border: "border border-white/15",
  },

  custom: {
    intensity: "medium" as const,
    effects: {
      layers: true,
      condensation: true,
      refraction: true,
      shimmer: true,
      ripple: true,
      depth: true,
    },
    rounded: "2xl" as const,
    padding: "",
    border: "",
  },
};

// ============================================================================
// GLASS INTENSITY MAPPINGS
// ============================================================================

const glassIntensityStyles = {
  whisper: "backdrop-blur-[6px] bg-white/10",
  light: "backdrop-blur-[12px] bg-white/15",
  medium: "backdrop-blur-[20px] bg-white/20",
  heavy: "backdrop-blur-[32px] bg-white/25",
  extreme: "backdrop-blur-[48px] bg-white/30",
};

const roundedStyles = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

// ============================================================================
// MAIN GLASS CONTAINER COMPONENT
// ============================================================================

const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className = "",
  style = {},

  // Configuration
  intensity = "medium",
  effects = {},
  layerCount = 3,
  condensationDensity = "medium",
  refractionIntensity = "medium",
  shimmerSpeed = "medium",
  depthIntensity = "medium",

  // Interaction
  onClick,
  onHover,
  interactive = false,

  // Variants
  variant = "custom",
  rounded = "2xl",
  blendMode = "normal",
  preserveAspectRatio = false,

  ...props
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Merge variant config with props
  const config = variant !== "custom" ? variantConfigs[variant] : {};
  const finalIntensity = intensity || config.intensity || "medium";
  const finalEffects = { ...config.effects, ...effects };
  const finalRounded = rounded || config.rounded || "2xl";

  // Handle interactions
  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    onHover?.(false);
  };

  const handleMouseDown = () => {
    if (interactive) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    onClick?.();
  };

  // Build container classes
  const containerClasses = [
    "relative overflow-hidden transform-gpu",
    glassIntensityStyles[finalIntensity],
    roundedStyles[finalRounded],
    config.padding || "",
    config.border || "",
    interactive || onClick ? "cursor-pointer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Animation variants
  const containerVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(20px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    hover: {
      scale: interactive ? 1.02 : 1,
      y: interactive ? -2 : 0,
    },
    tap: {
      scale: interactive ? 0.98 : 1,
    },
  };

  const ContentWrapper = finalEffects.depth ? GlassDepth : React.Fragment;
  const depthProps = finalEffects.depth ? { intensity: depthIntensity } : {};

  return (
    <motion.div
      className={containerClasses}
      style={{
        mixBlendMode: blendMode,
        aspectRatio: preserveAspectRatio ? "1" : "auto",
        ...style,
      }}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      {...props}
    >
      {/* Glass Layers Effect */}
      {finalEffects.layers && (
        <GlassLayers
          count={layerCount}
          intensity={finalIntensity}
          animated={isHovered}
        />
      )}

      {/* Condensation Effect */}
      {finalEffects.condensation && (
        <Condensation density={condensationDensity} animated={isHovered} />
      )}

      {/* Refraction Effect */}
      {finalEffects.refraction && (
        <Refraction intensity={refractionIntensity} animated={isHovered} />
      )}

      {/* Shimmer Effect */}
      {finalEffects.shimmer && (
        <GlassShimmer
          speed={shimmerSpeed}
          intensity={finalIntensity}
          active={isHovered}
        />
      )}

      {/* Ripple Effect */}
      {finalEffects.ripple && (
        <GlassRipple active={isPressed} intensity={finalIntensity} />
      )}

      {/* Main Content */}
      <ContentWrapper {...depthProps}>
        <div className="relative z-10">{children}</div>
      </ContentWrapper>

      {/* Enhanced Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-inherit border border-white/20 pointer-events-none"
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
          borderColor: isHovered
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(255, 255, 255, 0.2)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Corner Highlights */}
      <motion.div
        className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/20 to-transparent rounded-tr-inherit pointer-events-none"
        animate={{
          opacity: isHovered ? 0.8 : 0.4,
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-white/15 to-transparent rounded-bl-inherit pointer-events-none"
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default GlassContainer;

// ============================================================================
// PRESET COMPONENTS
// ============================================================================

export const GlassCard: React.FC<Omit<GlassContainerProps, "variant">> = (
  props
) => <GlassContainer variant="card" {...props} />;

export const GlassModal: React.FC<Omit<GlassContainerProps, "variant">> = (
  props
) => <GlassContainer variant="modal" {...props} />;

export const GlassButton: React.FC<Omit<GlassContainerProps, "variant">> = (
  props
) => <GlassContainer variant="button" interactive {...props} />;

export const GlassPanel: React.FC<Omit<GlassContainerProps, "variant">> = (
  props
) => <GlassContainer variant="panel" {...props} />;
