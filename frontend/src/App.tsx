// ============================================================================
// ARCHIVO: src/App.tsx
// ============================================================================

import React, { useEffect } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { useAuth } from "./hooks/useAuth";
import { AdaptiveLoginPage } from "./components/shared/AdaptiveLogin";
import Dashboard from "./components/shared/AdaptiveDashboard";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-white/10 rounded-full blur-md mx-auto"></div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Cargando Biblioteca Digital
          </h2>
          <p className="text-white/70">
            Preparando tu experiencia de lectura...
          </p>
        </div>
      </div>
    </div>
  );
};

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginFlow />;
  }

  return <>{children}</>;
};

const LoginFlow = () => {
  const { login, register, isLoading, error, clearError } = useAuth();

  const [currentView, setCurrentView] = React.useState("login");

  const handleLogin = async (credentials) => {
    clearError();

    try {
      const success = await login({
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      });

      if (success) {
        console.log("✅ Login exitoso");
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
    }
  };

  const handleRegister = async (userData) => {
    clearError();

    try {
      const success = await register({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      if (success) {
        console.log("✅ Registro exitoso");
      }
    } catch (err) {
      console.error("❌ Error en registro:", err);
    }
  };

  switch (currentView) {
    case "register":
      return (
        <RegisterPage
          onRegister={handleRegister}
          onBackToLogin={() => setCurrentView("login")}
          isLoading={isLoading}
          error={error}
        />
      );

    default:
      return (
        <AdaptiveLoginPage
          onLogin={handleLogin}
          onRegister={() => setCurrentView("register")}
          isLoading={isLoading}
          error={error}
        />
      );
  }
};

const RegisterPage = ({ onRegister, onBackToLogin, isLoading, error }) => {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    await onRegister(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">Únete a nuestra biblioteca digital</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all"
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>

          <button
            onClick={onBackToLogin}
            className="w-full py-3 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            ← Volver al login
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
