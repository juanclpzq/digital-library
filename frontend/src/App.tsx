// ============================================================================
// ARCHIVO: src/App.tsx - VERSIÓN FINAL CORREGIDA
// DESCRIPCIÓN: Aplicación principal con flujo de autenticación completo
// ============================================================================

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { useAuth } from "./hooks/useAuth";
import { AdaptiveLoginPage } from "./components/shared/AdaptiveLogin";
import AdaptiveDashboard from "./components/shared/AdaptiveDashboard";

// ============================================================================
// LOADING SCREEN COMPONENT
// ============================================================================

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

// ============================================================================
// AUTH GUARD COMPONENT
// ============================================================================

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();

  useEffect(() => {
    console.log("🔍 AuthGuard: Verificando estado de autenticación...");
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    console.log("🔍 AuthGuard: Estado actualizado:", {
      isAuthenticated,
      isLoading,
    });
  }, [isAuthenticated, isLoading]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    console.log("⏳ AuthGuard: Mostrando loading...");
    return <LoadingScreen />;
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    console.log("🚪 AuthGuard: Usuario no autenticado, mostrando login...");
    return <LoginFlow />;
  }

  // Si está autenticado, mostrar contenido protegido
  console.log("✅ AuthGuard: Usuario autenticado, mostrando dashboard...");
  return <>{children}</>;
};

// ============================================================================
// LOGIN FLOW COMPONENT
// ============================================================================

const LoginFlow: React.FC = () => {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Formulario de Login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Formulario de Registro
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  // Manejar login
  const handleLogin = async (credentials: any) => {
    console.log("🔑 LoginFlow: Iniciando login con:", credentials.email);
    clearError();

    try {
      const success = await login(credentials);

      if (success) {
        console.log(
          "✅ LoginFlow: Login exitoso, AuthGuard detectará el cambio automáticamente"
        );
        // No necesitamos hacer nada más, AuthGuard detectará isAuthenticated = true
      } else {
        console.log("❌ LoginFlow: Login falló");
      }
    } catch (error) {
      console.error("❌ LoginFlow: Error en login:", error);
    }
  };

  // Manejar registro
  const handleRegister = async (userData: any) => {
    console.log("📝 LoginFlow: Iniciando registro con:", userData.email);
    clearError();

    // Validar contraseñas
    if (userData.password !== userData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const success = await register({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      if (success) {
        console.log(
          "✅ LoginFlow: Registro exitoso, AuthGuard detectará el cambio automáticamente"
        );
        // Después del registro exitoso, el usuario ya está logueado automáticamente
      } else {
        console.log("❌ LoginFlow: Registro falló");
      }
    } catch (error) {
      console.error("❌ LoginFlow: Error en registro:", error);
    }
  };

  // Si está en modo registro, mostrar formulario de registro
  if (isRegisterMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Crear Cuenta
            </h1>
            <p className="text-gray-600 mt-2">
              Únete a nuestra biblioteca digital
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister(registerData);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={registerData.firstName}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all"
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={registerData.lastName}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all"
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all"
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all"
              required
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-all"
              required
            />

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>

              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="w-full py-3 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
              >
                ← Volver al login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Usar el componente AdaptiveLoginPage existente
  return (
    <AdaptiveLoginPage
      onLogin={handleLogin}
      onRegister={() => setIsRegisterMode(true)}
      isLoading={isLoading}
      error={error}
    />
  );
};

// ============================================================================
// DASHBOARD WRAPPER COMPONENT
// ============================================================================

// Reemplaza DashboardWrapper con esto:
const DashboardWrapper: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/books", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")).accessToken : ""}`,
          },
        });
        const data = await response.json();
        setBooks(data.success ? data.data : []);
      } catch (error) {
        console.error("Error loading books:", error);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  const mockStats = {
    totalBooks: books.length,
    completedBooks: books.filter((b) => b.readingStatus === "completed").length,
    currentlyReading: books.filter((b) => b.readingStatus === "reading").length,
    totalPages: books.reduce((acc, book) => acc + (book.pages || 0), 0),
  };

  return (
    <AdaptiveDashboard
      books={books}
      stats={mockStats}
      isLoading={isLoading}
      onBookClick={(book) => console.log("📖 Clicked book:", book.title)}
      onBookUpdate={(book) => console.log("📝 Update book:", book.title)}
      onBookDelete={(book) => console.log("🗑️ Delete book:", book.title)}
      onAddBook={() => console.log("➕ Add new book")}
    />
  );
};

// ============================================================================
// APP CONTENT COMPONENT
// ============================================================================

const AppContent: React.FC = () => {
  return (
    <AuthGuard>
      <DashboardWrapper />
    </AuthGuard>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App: React.FC = () => {
  console.log("🚀 App: Iniciando aplicación...");

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
