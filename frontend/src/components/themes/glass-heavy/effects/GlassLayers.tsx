import React from "react";
import { motion } from "framer-motion";

// ============================================================================
// GLASS LAYERS COMPONENT - MULTI-LAYER GLASSMORPHISM EFFECT
// FILE LOCATION: src/components/themes/glass-heavy/effects/GlassLayers.tsx
// ============================================================================

interface GlassLayersProps {
  children: React.ReactNode;
  layers?: number;
  intensity?: "light" | "medium" | "heavy" | "extreme";
  tint?: string;
  className?: string;
  animated?: boolean;
}

const GlassLayers: React.FC<GlassLayersProps> = ({
  children,
  layers = 3,
  intensity = "medium",
  tint = "from-white/20 to-white/5",
  className = "",
  animated = true,
}) => {
  // ============================================================================
  // INTENSITY MAPPING
  // ============================================================================

  const intensityMap = {
    light: {
      blur: "backdrop-blur-md",
      opacity: "bg-opacity-20",
      border: "border-white/20",
    },
    medium: {
      blur: "backdrop-blur-lg",
      opacity: "bg-opacity-30",
      border: "border-white/30",
    },
    heavy: {
      blur: "backdrop-blur-xl",
      opacity: "bg-opacity-40",
      border: "border-white/40",
    },
    extreme: {
      blur: "backdrop-blur-3xl",
      opacity: "bg-opacity-50",
      border: "border-white/50",
    },
  };

  const layerStyle = intensityMap[intensity];

  // ============================================================================
  // RENDER GLASS LAYERS
  // ============================================================================

  return (
    <div className={`relative ${className}`}>
      {/* Multiple Glass Layers */}
      {Array.from({ length: layers }).map((_, index) => (
        <motion.div
          key={index}
          className={`
            absolute inset-0 rounded-[inherit]
            ${layerStyle.blur} ${layerStyle.opacity} ${layerStyle.border}
            bg-gradient-to-br ${tint}
            border
          `}
          initial={
            animated
              ? {
                  opacity: 0,
                  scale: 0.9 + index * 0.02,
                  z: -index * 5,
                }
              : undefined
          }
          animate={
            animated
              ? {
                  opacity: 1 - index * 0.15,
                  scale: 1 - index * 0.02,
                  z: -index * 5,
                }
              : undefined
          }
          transition={
            animated
              ? {
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }
              : undefined
          }
          style={{
            transform: `translateZ(${-index * 5}px) scale(${1 - index * 0.02})`,
            opacity: 1 - index * 0.15,
          }}
        />
      ))}

      {/* Content Layer */}
      <div className="relative z-10">{children}</div>

      {/* Top Light Refraction Line */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent z-20" />

      {/* Bottom Shadow Line */}
      <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-20" />
    </div>
  );
};

export default GlassLayers;
