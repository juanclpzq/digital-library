import React, { useEffect } from "react";
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";
import {
  useAuth,
  type LoginCredentials,
  //type RegisterData,
} from "./hooks/useAuth";
import { AdaptiveLoginPage } from "./components/shared/AdaptiveLogin";
import AdaptiveDashboard from "./components/shared/AdaptiveDashboard";

import {
  PluginProvider,
  createPluginContext,
  //_getAllDevPlugins, // Prefijo para futuro uso
  PluginDebugger,
  createThemeDebugPlugin,
  createPerformancePlugin,
  PluginDevUtils,
} from "./plugins";

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

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const {
    isAuthenticated,
    isLoading,
    checkAuthStatus,
    login,
    //register,
    error,
  } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    await login(credentials);
  };

  const handleRegister = (): void => {
    // TODO: Implementar navegación a página de registro
    // Por ahora, mostrar alerta
    alert("Función de registro pendiente de implementar");
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <AdaptiveLoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return <>{children}</>;
};

const DashboardWrapper: React.FC = () => {
  const _user = useAuth().user; // Prefijo para indicar uso futuro

  // TODO: Mock data - será reemplazado por datos reales del backend
  // Eliminar cuando se implementen las interfaces reales

  return (
    <AdaptiveDashboard
      books={[]} // Mock empty books array - será reemplazado con datos reales
      isLoading={false}
      onBookClick={(_book) => {
        // Implementar click en libro
      }}
      onBookUpdate={(_book) => {
        // Implementar actualización de libro
      }}
      onBookDelete={(_bookId) => {
        // Implementar eliminación de libro
      }}
      onAddBook={() => {
        // Implementar agregar libro
      }}
    />
  );
};

interface PluginContextWrapperProps {
  children: React.ReactNode;
}

const PluginContextWrapper: React.FC<PluginContextWrapperProps> = ({
  children,
}) => {
  const theme = useTheme();
  const _user = useAuth().user; // Prefijo para indicar uso futuro

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
        user: _user
          ? {
              email: _user.email,
              isAuthenticated: true,
            }
          : {
              isAuthenticated: false,
            },
        router: {
          currentPath: window.location.pathname,
          navigate: (_path: string) => {
            // Implementar navegación si usas React Router
          },
        },
        app: {
          version: "1.0.0",
          environment: process.env.NODE_ENV || "development",
        },
      }),
    [theme, _user]
  );

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

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      (window as unknown as Record<string, unknown>).__pluginDevUtils =
        PluginDevUtils;
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
      {process.env.NODE_ENV === "development" && <PluginDebugger />}
    </PluginProvider>
  );
};

const AppContent: React.FC = () => {
  return (
    <PluginContextWrapper>
      <AuthGuard>
        <DashboardWrapper />
      </AuthGuard>
    </PluginContextWrapper>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultVariant="softclub" enablePersistence={true}>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
