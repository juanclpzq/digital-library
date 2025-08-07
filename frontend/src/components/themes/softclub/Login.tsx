// ============================================================================
// ARCHIVO: src/components/themes/softclub/LoginPage.tsx
// DESCRIPCIÓN: Login nostálgico Gen X con optimismo tecnológico de los 2000s
// DEPENDENCIAS: src/theme/softclub.ts
// ============================================================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../theme/ThemeProvider";

// ============================================================================
// MAIN LOGIN COMPONENT - SOFTCLUB VERSION
// ============================================================================

export const LoginPageSoftclub = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simular login
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const containerVariants = {
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Tech Elements - Gen X Nostalgia */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* CD/DVD Rings */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border-4 border-gradient-to-r from-cyan-200 to-blue-300 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 border-4 border-purple-300 rounded-full opacity-25"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
        />

        {/* Tech Grid Pattern */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 to-purple-100/30"
          style={{
            backgroundImage: `
                 linear-gradient(cyan 1px, transparent 1px),
                 linear-gradient(90deg, cyan 1px, transparent 1px)
               `,
            backgroundSize: "40px 40px",
            opacity: 0.1,
          }}
        />

        {/* Floating Bubbles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full opacity-30"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: typeof window !== "undefined" ? window.innerHeight + 50 : 800,
            }}
            animate={{
              y: -50,
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1200),
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full max-w-md"
      >
        {/* Login Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 relative overflow-hidden"
          whileHover={{
            y: -5,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            transition: { duration: 0.3 },
          }}
        >
          {/* Soft Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 via-indigo-100/30 to-purple-100/50 rounded-3xl" />

          {/* Header Section */}
          <div className="relative z-10 text-center mb-8">
            {/* Logo Container */}
            <motion.div
              className="inline-flex p-4 bg-gradient-to-br from-cyan-200 to-indigo-300 rounded-2xl mb-6 shadow-lg"
              whileHover={{
                scale: 1.05,
                rotate: 3,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  className="w-10 h-10 text-indigo-700"
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
            </motion.div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Mi Biblioteca Digital
            </h1>
            <p className="text-gray-600 font-medium">
              ¡Bienvenido de vuelta! 📚✨
            </p>
          </div>

          {/* Login Form */}
          <div className="relative z-10 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <motion.div
                className={`relative rounded-2xl transition-all duration-300 ${
                  focusedField === "email"
                    ? "shadow-lg scale-[1.02]"
                    : "shadow-md"
                }`}
                whileFocus={{ scale: 1.02 }}
              >
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm focus:outline-none ${
                    focusedField === "email"
                      ? "border-indigo-400 bg-white shadow-lg shadow-indigo-200/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="tu@email.com"
                />
                {focusedField === "email" && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-200/30 to-indigo-200/30 -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  />
                )}
              </motion.div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <motion.div
                className={`relative rounded-2xl transition-all duration-300 ${
                  focusedField === "password"
                    ? "shadow-lg scale-[1.02]"
                    : "shadow-md"
                }`}
              >
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
                  className={`w-full px-4 py-3 pr-12 rounded-2xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm focus:outline-none ${
                    focusedField === "password"
                      ? "border-indigo-400 bg-white shadow-lg shadow-indigo-200/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors text-lg"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                {focusedField === "password" && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-200/30 to-indigo-200/30 -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  />
                )}
              </motion.div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <motion.label
                className="flex items-center space-x-3 cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rememberMe: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all duration-200"
                  />
                  {formData.rememberMe && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded text-white flex items-center justify-center text-xs"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                  Recordarme
                </span>
              </motion.label>

              <motion.button
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ¿Olvidaste tu contraseña?
              </motion.button>
            </div>

            {/* Login Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px -12px rgba(99, 102, 241, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Button Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <span className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
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
                  <>Iniciar Sesión ✨</>
                )}
              </span>
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <div className="flex-shrink-0 px-4">
                <span className="text-sm text-gray-500 bg-white px-2 rounded-full">
                  o
                </span>
              </div>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                className="flex items-center justify-center py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl mr-2">🌐</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Google
                </span>
              </motion.button>

              <motion.button
                className="flex items-center justify-center py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl mr-2">📱</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Apple
                </span>
              </motion.button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4">
              <span className="text-gray-600 text-sm">
                ¿No tienes cuenta?{" "}
                <motion.button
                  className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ¡Únete ahora! 🚀
                </motion.button>
              </span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-cyan-200 to-indigo-300 rounded-full opacity-50"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-40"></div>
        </motion.div>

        {/* Footer Tech Quote */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-sm text-gray-500 italic">
            "El futuro es ahora, ¡y está lleno de libros digitales!" 📖💫
          </p>
        </motion.div>
      </motion.div>

      {/* Corner Tech Elements */}
      <div className="absolute top-8 left-8 text-6xl opacity-10 text-indigo-400">
        💾
      </div>
      <div className="absolute bottom-8 right-8 text-4xl opacity-15 text-cyan-400">
        🖥️
      </div>
      <div className="absolute top-1/3 right-8 text-5xl opacity-10 text-purple-400">
        💿
      </div>
    </div>
  );
};

export default LoginPageSoftclub;
