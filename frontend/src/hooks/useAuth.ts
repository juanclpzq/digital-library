// ============================================================================
// USE AUTH HOOK - CONECTADO CORRECTAMENTE AL BACKEND
// FILE LOCATION: src/hooks/useAuth.ts
// ============================================================================

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";
import { useLocalStorage } from "./useLocalStorage";

// ============================================================================
// AUTH TYPES & INTERFACES
// ============================================================================

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  avatar?: string;
  theme?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;

  // User management
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;

  // Token management
  getValidToken: () => Promise<string | null>;
  isTokenExpired: () => boolean;

  // Utilities
  clearError: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

console.log("🔧 useAuth: API_BASE configurado como:", API_BASE);

// ============================================================================
// AUTH API FUNCTIONS - AJUSTADAS AL BACKEND EXISTENTE
// ============================================================================

const authAPI = {
  login: async (
    credentials: LoginCredentials
  ): Promise<{
    user: User;
    tokens: AuthTokens;
  }> => {
    try {
      console.log(
        "🔐 authAPI.login: Enviando solicitud a:",
        `${API_BASE}/auth/login`
      );
      console.log("📧 authAPI.login: Email:", credentials.email);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      console.log("📡 authAPI.login: Respuesta recibida:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ authAPI.login: Error del servidor:", errorData);
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("✅ authAPI.login: Datos recibidos:", {
        success: data.success,
        user: data.data?.user?.email,
        hasToken: !!data.data?.token,
      });

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      // El backend devuelve: { success: true, data: { user, token, refreshToken } }
      return {
        user: data.data.user,
        tokens: {
          accessToken: data.data.token,
          refreshToken: data.data.refreshToken || data.data.token,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
        },
      };
    } catch (error) {
      console.error("💥 authAPI.login: Error:", error);
      throw error;
    }
  },

  register: async (
    data: RegisterData
  ): Promise<{
    user: User;
    tokens: AuthTokens;
  }> => {
    try {
      console.log(
        "📝 authAPI.register: Enviando solicitud a:",
        `${API_BASE}/auth/register`
      );
      console.log("📧 authAPI.register: Email:", data.email);

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      console.log("📡 authAPI.register: Respuesta recibida:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ authAPI.register: Error del servidor:", errorData);
        throw new Error(errorData.message || "Registration failed");
      }

      const responseData = await response.json();
      console.log("✅ authAPI.register: Datos recibidos:", {
        success: responseData.success,
        user: responseData.data?.user?.email,
        hasToken: !!responseData.data?.token,
      });

      if (!responseData.success) {
        throw new Error(responseData.message || "Registration failed");
      }

      // El backend devuelve: { success: true, data: { user, token, refreshToken } }
      return {
        user: responseData.data.user,
        tokens: {
          accessToken: responseData.data.token,
          refreshToken:
            responseData.data.refreshToken || responseData.data.token,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
        },
      };
    } catch (error) {
      console.error("💥 authAPI.register: Error:", error);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    try {
      console.log("🔄 authAPI.refreshToken: Enviando solicitud...");

      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      console.log("✅ authAPI.refreshToken: Token refrescado exitosamente");

      return {
        accessToken: data.data.token,
        refreshToken: data.data.refreshToken || refreshToken,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
    } catch (error) {
      console.error("💥 authAPI.refreshToken: Error:", error);
      throw error;
    }
  },

  getProfile: async (token: string): Promise<User> => {
    try {
      console.log("👤 authAPI.getProfile: Obteniendo perfil...");

      const response = await fetch(`${API_BASE}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get profile");
      }

      const data = await response.json();
      console.log("✅ authAPI.getProfile: Perfil obtenido:", data.data.email);

      return data.data;
    } catch (error) {
      console.error("💥 authAPI.getProfile: Error:", error);
      throw error;
    }
  },

  logout: async (token: string, refreshToken: string): Promise<void> => {
    try {
      console.log("🚪 authAPI.logout: Cerrando sesión en servidor...");

      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      console.log("✅ authAPI.logout: Sesión cerrada en servidor");
    } catch (error) {
      console.warn(
        "⚠️ authAPI.logout: Error en servidor, continuando con logout local:",
        error
      );
    }
  },
};

// ============================================================================
// AUTH CONTEXT
// ============================================================================

const AuthContext = createContext<UseAuthReturn | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

// ============================================================================
// MAIN USE AUTH HOOK
// ============================================================================

export const useAuth = (): UseAuthReturn => {
  // Persistent storage for tokens and user
  const {
    value: storedTokens,
    setValue: setStoredTokens,
    removeValue: removeStoredTokens,
  } = useLocalStorage<AuthTokens | null>("authTokens", null, {
    syncAcrossTabs: true,
  });

  const {
    value: storedUser,
    setValue: setStoredUser,
    removeValue: removeStoredUser,
  } = useLocalStorage<User | null>("user", null, {
    syncAcrossTabs: true,
  });

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Token expiration check
  const isTokenExpired = useCallback((): boolean => {
    if (!storedTokens) return true;
    return Date.now() >= storedTokens.expiresAt;
  }, [storedTokens]);

  // Computed state - CLAVE PARA LA REDIRECCIÓN AUTOMÁTICA
  const isAuthenticated = !!storedUser && !!storedTokens && !isTokenExpired();

  // Debug del estado de autenticación
  useEffect(() => {
    console.log("🔍 useAuth: Estado de autenticación:", {
      hasUser: !!storedUser,
      hasTokens: !!storedTokens,
      isTokenExpired: isTokenExpired(),
      isAuthenticated,
      userEmail: storedUser?.email,
    });
  }, [storedUser, storedTokens, isTokenExpired, isAuthenticated]);

  // Clear error utility
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get valid token with auto-refresh
  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (!storedTokens) return null;

    if (!isTokenExpired()) {
      return storedTokens.accessToken;
    }

    try {
      const newTokens = await authAPI.refreshToken(storedTokens.refreshToken);
      setStoredTokens(newTokens);
      return newTokens.accessToken;
    } catch {
      removeStoredTokens();
      removeStoredUser();
      return null;
    }
  }, [
    storedTokens,
    isTokenExpired,
    setStoredTokens,
    removeStoredTokens,
    removeStoredUser,
  ]);

  // Login function - PUNTO CLAVE PARA LA REDIRECCIÓN
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      try {
        console.log("🔑 useAuth.login: Iniciando proceso de login...");
        const response = await authAPI.login(credentials);

        console.log("💾 useAuth.login: Guardando datos en localStorage...");

        // Guardar tokens y usuario en localStorage
        setStoredTokens(response.tokens);
        setStoredUser(response.user);

        console.log("✅ useAuth.login: Login completado exitosamente");
        console.log(
          "🎯 useAuth.login: isAuthenticated será true en el próximo render"
        );

        setIsLoading(false);
        return true;
      } catch (error) {
        console.error("❌ useAuth.login: Error en proceso de login:", error);
        const message = error instanceof Error ? error.message : "Login failed";
        setError(message);
        setIsLoading(false);
        return false;
      }
    },
    [setStoredTokens, setStoredUser]
  );

  // Register function
  const register = useCallback(
    async (data: RegisterData): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      try {
        console.log("📝 useAuth.register: Iniciando proceso de registro...");
        const response = await authAPI.register(data);

        console.log("💾 useAuth.register: Guardando datos en localStorage...");

        // Guardar tokens y usuario después del registro
        setStoredTokens(response.tokens);
        setStoredUser(response.user);

        console.log("✅ useAuth.register: Registro completado exitosamente");
        console.log("🎯 useAuth.register: Usuario automáticamente logueado");

        setIsLoading(false);
        return true;
      } catch (error) {
        console.error(
          "❌ useAuth.register: Error en proceso de registro:",
          error
        );
        const message =
          error instanceof Error ? error.message : "Registration failed";
        setError(message);
        setIsLoading(false);
        return false;
      }
    },
    [setStoredTokens, setStoredUser]
  );

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      if (storedTokens) {
        await authAPI.logout(
          storedTokens.accessToken,
          storedTokens.refreshToken
        );
      }
    } catch (error) {
      console.warn(
        "⚠️ useAuth.logout: Error en logout del servidor, continuando con logout local"
      );
    } finally {
      // Limpiar estado local
      removeStoredTokens();
      removeStoredUser();
      setError(null);
      setIsLoading(false);

      console.log("🚪 useAuth.logout: Logout completado");
    }
  }, [storedTokens, removeStoredTokens, removeStoredUser]);

  // Refresh auth
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    if (!storedTokens) return false;

    try {
      const newTokens = await authAPI.refreshToken(storedTokens.refreshToken);
      setStoredTokens(newTokens);
      return true;
    } catch {
      await logout();
      return false;
    }
  }, [storedTokens, setStoredTokens, logout]);

  // Update profile
  const updateProfile = useCallback(
    async (updates: Partial<User>): Promise<boolean> => {
      if (!storedUser) return false;

      try {
        const token = await getValidToken();
        if (!token) return false;

        const updatedUser = { ...storedUser, ...updates };
        setStoredUser(updatedUser);
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Profile update failed";
        setError(message);
        return false;
      }
    },
    [storedUser, getValidToken, setStoredUser]
  );

  // Change password
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      try {
        const token = await getValidToken();
        if (!token) return false;

        // TODO: Implementar llamada API para cambio de contraseña
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Password change failed";
        setError(message);
        return false;
      }
    },
    [getValidToken]
  );

  // Check auth status - CRUCIAL PARA VERIFICACIÓN INICIAL
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    console.log("🔍 useAuth.checkAuthStatus: Verificando estado inicial...");

    if (!storedTokens || !storedUser) {
      console.log("❌ useAuth.checkAuthStatus: No hay datos almacenados");
      setIsLoading(false);
      return false;
    }

    if (isTokenExpired()) {
      console.log(
        "⏰ useAuth.checkAuthStatus: Token expirado, intentando refresh..."
      );
      try {
        const newTokens = await authAPI.refreshToken(storedTokens.refreshToken);
        setStoredTokens(newTokens);
        console.log(
          "✅ useAuth.checkAuthStatus: Token refrescado exitosamente"
        );
      } catch {
        console.log(
          "❌ useAuth.checkAuthStatus: Refresh falló, limpiando datos"
        );
        await logout();
        setIsLoading(false);
        return false;
      }
    }

    try {
      const token = await getValidToken();
      if (!token) {
        console.log(
          "❌ useAuth.checkAuthStatus: No se pudo obtener token válido"
        );
        setIsLoading(false);
        return false;
      }

      // Verificar que el perfil aún sea válido
      const user = await authAPI.getProfile(token);
      setStoredUser(user);

      console.log(
        "✅ useAuth.checkAuthStatus: Usuario autenticado:",
        user.email
      );
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error(
        "❌ useAuth.checkAuthStatus: Error verificando perfil:",
        error
      );
      await logout();
      setIsLoading(false);
      return false;
    }
  }, [
    storedTokens,
    storedUser,
    isTokenExpired,
    getValidToken,
    setStoredTokens,
    setStoredUser,
    logout,
  ]);

  // Initialize auth state on mount - SOLO UNA VEZ
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (mounted) {
        console.log("🚀 useAuth: Inicializando estado de autenticación...");
        await checkAuthStatus();
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!storedTokens || !isAuthenticated) return;

    const refreshBuffer = 5 * 60 * 1000; // 5 minutes
    const timeUntilRefresh =
      storedTokens.expiresAt - Date.now() - refreshBuffer;

    if (timeUntilRefresh <= 0) {
      refreshAuth();
      return;
    }

    const refreshTimer = setTimeout(() => {
      refreshAuth();
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimer);
  }, [storedTokens, isAuthenticated, refreshAuth]);

  return {
    // State
    user: storedUser,
    tokens: storedTokens,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    refreshAuth,

    // User management
    updateProfile,
    changePassword,

    // Token management
    getValidToken,
    isTokenExpired,

    // Utilities
    clearError,
    checkAuthStatus,
  };
};

// ============================================================================
// AUTH PROVIDER COMPONENT
// ============================================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();

  return React.createElement(AuthContext.Provider, { value: auth }, children);
};

// ============================================================================
// AUTH GUARDS & UTILITIES
// ============================================================================

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthGuardedComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
      return React.createElement("div", null, "Loading...");
    }

    if (!isAuthenticated) {
      return React.createElement(
        "div",
        null,
        "Please log in to access this page"
      );
    }

    return React.createElement(WrappedComponent, props);
  };

  AuthGuardedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthGuardedComponent;
};

export const usePermissions = () => {
  const { user } = useAuthContext();

  return {
    canEditProfile: !!user,
    canChangePassword: !!user,
    canDeleteAccount: !!user,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useAuth;
