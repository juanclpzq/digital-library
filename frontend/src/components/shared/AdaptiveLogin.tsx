// ============================================================================
// ARCHIVO: src/components/shared/LoginPage.tsx
// DESCRIPCIÓN: Componente adaptativo que auto-selecciona tema
// DEPENDENCIAS: src/components/themes/glass-heavy/LoginPage.tsx, src/components/themes/softclub/LoginPage.tsx
// ============================================================================

import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../theme/ThemeProvider";

// Lazy loading de componentes por tema para optimización
const LoginPageGlassHeavy = lazy(() => import("../themes/glass-heavy/Login"));
const LoginPageSoftclub = lazy(() => import("../themes/softclub/Login"));

// ============================================================================
// LOADING COMPONENT
// ============================================================================

const LoginLoading = () => {
  const { theme } = useTheme();

  const isGlass = theme === "glassheavy";

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isGlass
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-cyan-50 via-indigo-50 to-purple-100"
      }`}
    >
      <motion.div
        className={`flex flex-col items-center space-y-4 ${
          isGlass ? "text-white" : "text-gray-700"
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Loading Spinner */}
        <motion.div
          className={`w-12 h-12 border-4 rounded-full ${
            isGlass
              ? "border-white/20 border-t-white/80"
              : "border-indigo-200 border-t-indigo-600"
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Loading Text */}
        <motion.p
          className="text-lg font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Cargando experiencia {isGlass ? "premium" : "nostálgica"}...
        </motion.p>

        {/* Theme Indicator */}
        <div
          className={`px-4 py-2 rounded-full text-sm ${
            isGlass
              ? "bg-white/10 backdrop-blur-sm border border-white/20"
              : "bg-white/80 backdrop-blur-sm border border-indigo-200"
          }`}
        >
          {isGlass ? "🔮 Glass Heavy Mode" : "🌈 Softclub Mode"}
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LoginErrorBoundary extends React.Component<
  { children: React.ReactNode; theme: string },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; theme: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Login component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isGlass = this.props.theme === "glassheavy";

      return (
        <div
          className={`min-h-screen flex items-center justify-center p-4 ${
            isGlass
              ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
              : "bg-gradient-to-br from-cyan-50 via-indigo-50 to-purple-100"
          }`}
        >
          <motion.div
            className={`max-w-md w-full p-8 rounded-2xl text-center ${
              isGlass
                ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white"
                : "bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className={`text-6xl mb-4 ${isGlass ? "text-white/80" : "text-red-400"}`}
            >
              ⚠️
            </div>
            <h2 className="text-xl font-bold mb-2">Error al cargar el login</h2>
            <p
              className={`text-sm mb-6 ${isGlass ? "text-white/70" : "text-gray-600"}`}
            >
              Hubo un problema al cargar la interfaz de login. Por favor,
              recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isGlass
                  ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              Recargar Página
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// MAIN ADAPTIVE LOGIN COMPONENT
// ============================================================================

interface AdaptiveLoginProps {
  onLogin?: (credentials: any) => Promise<void>;
  onRegister?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const AdaptiveLoginPage: React.FC<AdaptiveLoginProps> = (props) => {
  const { theme, isGlassMode } = useTheme();

  // Debug info (solo en desarrollo)
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🎨 Login rendering in ${theme} mode (Glass: ${isGlassMode})`
      );
    }
  }, [theme, isGlassMode]);

  return (
    <LoginErrorBoundary theme={theme}>
      <Suspense fallback={<LoginLoading />}>
        <motion.div
          key={theme} // Re-render cuando cambia el tema
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isGlassMode ? (
            <LoginPageGlassHeavy {...props} />
          ) : (
            <LoginPageSoftclub {...props} />
          )}
        </motion.div>
      </Suspense>
    </LoginErrorBoundary>
  );
};

// ============================================================================
// THEME TOGGLE COMPONENT (para pruebas)
// ============================================================================

export const LoginThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isGlassMode } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 ${
        isGlassMode
          ? "bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30"
          : "bg-white/90 backdrop-blur-sm border border-indigo-200 text-indigo-600 hover:bg-white shadow-lg"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={`Cambiar a ${isGlassMode ? "Softclub" : "Glass Heavy"} theme`}
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 0.5 }}
        key={theme}
      >
        {isGlassMode ? "🌈" : "🔮"}
      </motion.div>
    </motion.button>
  );
};

// ============================================================================
// COMPLETE LOGIN WITH THEME TOGGLE
// ============================================================================

export const CompleteLoginPage: React.FC<AdaptiveLoginProps> = (props) => {
  return (
    <>
      <AdaptiveLoginPage {...props} />
      <LoginThemeToggle />
    </>
  );
};

// Default export
export default AdaptiveLoginPage;

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Uso básico adaptativo
<AdaptiveLoginPage 
  onLogin={async (credentials) => {
    // Tu lógica de login
  }}
  onRegister={() => {
    // Navegar a registro
  }}
/>

// Con toggle de tema para testing
<CompleteLoginPage 
  onLogin={handleLogin}
  onRegister={handleRegister}
  isLoading={authLoading}
  error={authError}
/>

// Solo tema específico (si necesitas forzar uno)
<LoginPageGlassHeavy onLogin={handleLogin} />
<LoginPageSoftclub onLogin={handleLogin} />
*/
