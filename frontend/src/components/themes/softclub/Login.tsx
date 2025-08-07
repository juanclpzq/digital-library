// ============================================================================
// ARCHIVO: src/components/themes/softclub/Login.tsx - VERSIÓN CORREGIDA
// DESCRIPCIÓN: Login nostálgico conectado al backend
// ============================================================================

import React, { useState } from "react";
import { motion } from "framer-motion";

interface LoginProps {
  onLogin?: (credentials: any) => Promise<void>;
  onRegister?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginPageSoftclub: React.FC<LoginProps> = ({
  onLogin,
  onRegister,
  isLoading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (onLogin) {
      await onLogin({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
    }
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
          className="absolute top-20 left-10 w-32 h-32 border-4 border-cyan-200/40 rounded-full"
          variants={floatingVariants}
          animate="animate"
        />

        <motion.div
          className="absolute bottom-20 right-16 w-24 h-24 border-4 border-indigo-200/40 rounded-full"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "-2s" }}
        />

        {/* Tech Squares */}
        <motion.div
          className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-lg"
          animate={{
            rotate: [0, 45, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Pixel Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-20 gap-2 h-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-sm"
                style={{
                  animationDelay: `${i * 0.01}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
          variants={cardVariants}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Biblioteca Digital 📚
            </motion.h1>
            <motion.p
              className="text-gray-600 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              ¡Bienvenido al futuro de la lectura! 🚀
            </motion.p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  focusedField === "email"
                    ? "border-indigo-400 ring-4 ring-indigo-100"
                    : "border-gray-200"
                } focus:outline-none`}
                placeholder="tu@email.com"
                required
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Contraseña
              </label>
              <div className="relative">
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
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 pr-12 ${
                    focusedField === "password"
                      ? "border-indigo-400 ring-4 ring-indigo-100"
                      : "border-gray-200"
                  } focus:outline-none`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </motion.div>

            {/* Remember Me */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-600"
              >
                🎯 Recordarme
              </label>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                ❌ {error}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-medium rounded-xl transition-all duration-300 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg hover:scale-105 active:scale-95"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "🚀 ¡Entrar al futuro!"
              )}
            </motion.button>

            {/* Register Link */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              <span className="text-gray-600">
                ¿Nuevo en el futuro?{" "}
                <button
                  type="button"
                  onClick={onRegister}
                  className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  ¡Únete ahora! 🚀
                </button>
              </span>
            </motion.div>
          </form>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-cyan-200 to-indigo-300 rounded-full opacity-50"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-40"></div>
        </motion.div>

        {/* Footer Tech Quote */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
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
