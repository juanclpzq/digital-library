// ============================================================================
// ARCHIVO: src/App.tsx - CON SISTEMA DE PLUGINS INTEGRADO
// DESCRIPCIÓN: Aplicación principal con sistema completo de plugins
// ============================================================================

import React, { useEffect } from "react";
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";
import { useAuth } from "./hooks/useAuth";
import { AdaptiveLoginPage } from "./components/shared/AdaptiveLogin";
import AdaptiveDashboard from "./components/shared/AdaptiveDashboard";

// ============================================================================
// IMPORTACIONES DEL SISTEMA DE PLUGINS
// ============================================================================

import {
  PluginProvider,
  createPluginContext,
  getAllDevPlugins,
  PluginDebugger,
  createThemeDebugPlugin,
  createPerformancePlugin,
  PluginDevUtils,
} from "./plugins";

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
  const {
    isAuthenticated,
    isLoading,
    checkAuthStatus,
    login,
    register,
    error,
  } = useAuth();

  useEffect(() => {
    console.log("🔍 AuthGuard: Verificando estado de autenticación...");
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    console.log("⏳ AuthGuard: Mostrando loading...");
    return <LoadingScreen />;
  }

  // Si no está autenticado, usar AdaptiveLoginPage
  if (!isAuthenticated) {
    console.log(
      "🚪 AuthGuard: Usuario no autenticado, usando AdaptiveLoginPage..."
    );

    return (
      <AdaptiveLoginPage
        onLogin={login}
        onRegister={register}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // Si está autenticado, mostrar contenido protegido
  console.log("✅ AuthGuard: Usuario autenticado, mostrando dashboard...");
  return <>{children}</>;
};

// ============================================================================
// DASHBOARD WRAPPER COMPONENT
// ============================================================================

const DashboardWrapper: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadBooks = async () => {
      try {
        const authTokens = localStorage.getItem("authTokens");
        const token = authTokens ? JSON.parse(authTokens).accessToken : "";

        const response = await fetch("http://localhost:3000/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
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
    completedBooks: books.filter((b: any) => b.readingStatus === "completed")
      .length,
    currentlyReading: books.filter((b: any) => b.readingStatus === "reading")
      .length,
    totalPages: books.reduce(
      (acc: number, book: any) => acc + (book.pages || 0),
      0
    ),
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
// PLUGIN CONTEXT WRAPPER
// ============================================================================

const PluginContextWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();
  const { user } = useAuth();

  // Crear contexto para plugins
  const pluginContext = React.useMemo(
    () =>
      createPluginContext({
        theme: {
          variant: theme.variant,
          isGlassMode: theme.isGlassMode,
          glassIntensity: theme.glassIntensity,
          toggleTheme: theme.toggleTheme,
          setGlassIntensity: theme.setGlassIntensity,
        },
        user: user
          ? {
              id: user.id,
              email: user.email,
              isAuthenticated: true,
            }
          : {
              isAuthenticated: false,
            },
        router: {
          currentPath: window.location.pathname,
          navigate: (path: string) => {
            // Implementar navegación si usas React Router
            console.log("Navigate to:", path);
          },
        },
        app: {
          version: "1.0.0",
          environment: process.env.NODE_ENV || "development",
        },
      }),
    [theme, user]
  );

  // Crear plugins según el entorno
  const plugins = React.useMemo(() => {
    if (process.env.NODE_ENV === "development") {
      return [
        createThemeDebugPlugin({
          priority: 10,
          position: "top-left",
        }),
        createPerformancePlugin({
          priority: 5,
          position: "top-right",
        }),
      ];
    }
    return [];
  }, []);

  // Exponer plugin manager globalmente para debugging
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🔌 Plugin system initialized with",
        plugins.length,
        "plugins"
      );

      // Exponer utilidades de desarrollo
      (window as any).__pluginDevUtils = PluginDevUtils;
    }
  }, [plugins]);

  return (
    <PluginProvider
      context={pluginContext}
      plugins={plugins}
      enabledByDefault={true}
      autoCleanup={true}
    >
      {children}

      {/* Plugin Debugger - Solo en desarrollo */}
      {process.env.NODE_ENV === "development" && <PluginDebugger />}
    </PluginProvider>
  );
};

// ============================================================================
// APP CONTENT COMPONENT
// ============================================================================

const AppContent: React.FC = () => {
  return (
    <PluginContextWrapper>
      <AuthGuard>
        <DashboardWrapper />
      </AuthGuard>
    </PluginContextWrapper>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App: React.FC = () => {
  console.log("🚀 App: Iniciando aplicación con sistema de plugins...");

  // Configurar debugging en desarrollo
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Development mode - Plugin utilities available:");
      console.log("  - window.__pluginDevUtils.listActivePlugins()");
      console.log("  - window.__pluginDevUtils.getDetailedStats()");
      console.log("  - window.__pluginDevUtils.forceRerender()");
    }
  }, []);

  return (
    <ThemeProvider defaultVariant="softclub" enablePersistence={true}>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
