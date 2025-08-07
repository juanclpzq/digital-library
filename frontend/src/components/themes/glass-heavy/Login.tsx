// ============================================================================
// ARCHIVO: src/components/themes/glass-heavy/LoginPage.tsx
// DESCRIPCIÓN: Login con efectos glassmorphism avanzados premium
// DEPENDENCIAS: src/components/themes/glass-heavy/effects/
// ============================================================================

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "../../../theme/ThemeProvider";

// Simulamos los efectos glass que ya tienes
const GlassContainer = ({
  children,
  className = "",
  effects = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      className={`relative overflow-hidden backdrop-blur-2xl bg-white/10 border border-white/20 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Glass Layers Effect */}
      {effects.layers && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          <div className="absolute inset-2 bg-gradient-to-tl from-white/10 to-transparent rounded-[inherit] border border-white/10" />
          <div className="absolute inset-4 bg-gradient-to-br from-white/5 to-transparent rounded-[inherit]" />
        </>
      )}

      {/* Condensation Effect */}
      {effects.condensation && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute w-32 h-32 bg-white/30 rounded-full blur-3xl"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Droplets */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              initial={{
                x: `${mousePosition.x + (Math.random() - 0.5) * 40}%`,
                y: `${mousePosition.y + (Math.random() - 0.5) * 40}%`,
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                y: `+=${Math.random() * 20 + 10}%`,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Refraction Lines */}
      {effects.refraction && (
        <>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </>
      )}

      {/* Shimmer Effect */}
      {effects.shimmer && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// ============================================================================
// MAIN LOGIN COMPONENT - GLASS HEAVY VERSION
// ============================================================================

export const LoginPageGlassHeavy = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 30 });

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simular login
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

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
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const formVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/80 to-slate-900 flex items-center justify-center p-4 overflow-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {/* Background Glass Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          style={{
            x: springX,
            y: springY,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-2xl right-20 top-20"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-pink-500/15 rounded-full blur-3xl left-10 bottom-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Main Login Container */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative z-10"
      >
        <GlassContainer
          className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
          effects={{
            layers: true,
            condensation: true,
            refraction: true,
            shimmer: true,
          }}
        >
          {/* Header Section */}
          <motion.div
            variants={formVariants}
            initial="initial"
            animate="animate"
            className="text-center mb-8"
          >
            {/* Logo Container */}
            <GlassContainer
              className="inline-flex p-4 rounded-2xl mb-6"
              effects={{ layers: true, refraction: true }}
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  className="w-10 h-10 text-white/90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </motion.div>
            </GlassContainer>

            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              Biblioteca Digital
            </h1>
            <p className="text-white/70">Accede a tu colección premium</p>
          </motion.div>

          {/* Login Form */}
          <motion.div variants={formVariants} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Email
              </label>
              <GlassContainer
                className={`rounded-xl transition-all duration-300 ${
                  focusedField === "email"
                    ? "border-white/40 bg-white/15"
                    : "border-white/20 bg-white/10"
                }`}
                effects={{
                  refraction: focusedField === "email",
                  shimmer: focusedField === "email",
                }}
              >
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-white/60 focus:outline-none"
                  placeholder="tu@email.com"
                />
              </GlassContainer>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Contraseña
              </label>
              <GlassContainer
                className={`rounded-xl transition-all duration-300 ${
                  focusedField === "password"
                    ? "border-white/40 bg-white/15"
                    : "border-white/20 bg-white/10"
                }`}
                effects={{
                  refraction: focusedField === "password",
                  shimmer: focusedField === "password",
                }}
              >
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 bg-transparent text-white placeholder-white/60 focus:outline-none pr-12"
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-white/60 hover:text-white/90 transition-colors"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </GlassContainer>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <GlassContainer
                  className="w-5 h-5 rounded border border-white/30"
                  effects={{ refraction: true }}
                >
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rememberMe: e.target.checked,
                      }))
                    }
                    className="w-full h-full opacity-0 cursor-pointer"
                  />
                  {formData.rememberMe && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-1 bg-white/80 rounded-sm"
                    />
                  )}
                </GlassContainer>
                <span className="text-sm text-white/80">Recordarme</span>
              </label>

              <button className="text-sm text-white/70 hover:text-white/90 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Login Button */}
            <GlassContainer
              className="rounded-xl overflow-hidden group cursor-pointer"
              effects={{
                layers: true,
                condensation: true,
                shimmer: true,
              }}
              onClick={handleSubmit}
            >
              <motion.button
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-white/20 to-white/30 text-white font-medium transition-all duration-300 group-hover:from-white/30 group-hover:to-white/40 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </motion.button>
            </GlassContainer>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-white/70 text-sm">
                ¿No tienes cuenta?{" "}
                <button className="text-white/90 hover:text-white font-medium transition-colors">
                  Regístrate aquí
                </button>
              </span>
            </div>
          </motion.div>
        </GlassContainer>
      </motion.div>

      {/* Floating Glass Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full backdrop-blur-sm"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
            }}
            animate={{
              y: [null, -100],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginPageGlassHeavy;
