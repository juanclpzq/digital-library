// ============================================================================
// FIX PARA useAuth.ts - RESOLVER LOOP INFINITO
// PROBLEMA IDENTIFICADO: Loop causado por múltiples efectos reactivos
// ============================================================================

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
  useRef,
} from "react";
import { useLocalStorage } from "./useLocalStorage";

// ============================================================================
// INTERFACES (mismas que antes)
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
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  getValidToken: () => Promise<string | null>;
  isTokenExpired: () => boolean;
  clearError: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const authAPI = {
  login: async (
    credentials: LoginCredentials
  ): Promise<{ user: User; tokens: AuthTokens }> => {
    try {
      console.log("🔐 authAPI.login: Enviando solicitud...");

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      return {
        user: data.data.user,
        tokens: {
          accessToken: data.data.token,
          refreshToken: data.data.refreshToken || data.data.token,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        },
      };
    } catch (error) {
      console.error("💥 authAPI.login: Error:", error);
      throw error;
    }
  },

  register: async (
    data: RegisterData
  ): Promise<{ user: User; tokens: AuthTokens }> => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const responseData = await response.json();

      return {
        user: responseData.data.user,
        tokens: {
          accessToken: responseData.data.token,
          refreshToken:
            responseData.data.refreshToken || responseData.data.token,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        },
      };
    } catch (error) {
      console.error("💥 authAPI.register: Error:", error);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

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
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.warn("⚠️ authAPI.logout: Error en servidor:", error);
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
// MAIN USE AUTH HOOK - VERSIÓN CORREGIDA
// ============================================================================

export const useAuth = (): UseAuthReturn => {
  // Refs para evitar loops infinitos
  const initializeRef = useRef(false);
  const checkingStatusRef = useRef(false);

  // LocalStorage hooks
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

  // Estado local
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Token expiration check (memoized)
  const isTokenExpired = useCallback((): boolean => {
    if (!storedTokens) return true;
    return Date.now() >= storedTokens.expiresAt;
  }, [storedTokens?.expiresAt]); // Solo dependiendo de expiresAt

  // Estado de autenticación (memoizado para evitar recálculos innecesarios)
  const isAuthenticated = React.useMemo(() => {
    return !!storedUser && !!storedTokens && !isTokenExpired();
  }, [storedUser, storedTokens, isTokenExpired]);

  // ============================================================================
  // FUNCIONES DE UTILIDAD
  // ============================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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

  // ============================================================================
  // FUNCIONES DE AUTENTICACIÓN
  // ============================================================================

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      try {
        console.log("🔑 useAuth.login: Iniciando proceso de login...");
        const response = await authAPI.login(credentials);

        // Actualizar datos de forma atómica
        setStoredTokens(response.tokens);
        setStoredUser(response.user);

        console.log("✅ useAuth.login: Login completado exitosamente");
        setIsLoading(false);
        return true;
      } catch (error) {
        console.error("❌ useAuth.login: Error:", error);
        const message = error instanceof Error ? error.message : "Login failed";
        setError(message);
        setIsLoading(false);
        return false;
      }
    },
    [setStoredTokens, setStoredUser]
  );

  const register = useCallback(
    async (data: RegisterData): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      try {
        console.log("📝 useAuth.register: Iniciando proceso de registro...");
        const response = await authAPI.register(data);

        setStoredTokens(response.tokens);
        setStoredUser(response.user);

        console.log("✅ useAuth.register: Registro completado exitosamente");
        setIsLoading(false);
        return true;
      } catch (error) {
        console.error("❌ useAuth.register: Error:", error);
        const message =
          error instanceof Error ? error.message : "Registration failed";
        setError(message);
        setIsLoading(false);
        return false;
      }
    },
    [setStoredTokens, setStoredUser]
  );

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
      console.warn("⚠️ useAuth.logout: Error en logout del servidor");
    } finally {
      // Limpiar estado
      removeStoredTokens();
      removeStoredUser();
      setError(null);
      setIsLoading(false);
      console.log("🚪 useAuth.logout: Logout completado");
    }
  }, [storedTokens, removeStoredTokens, removeStoredUser]);

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

  // ============================================================================
  // CHECK AUTH STATUS - VERSIÓN OPTIMIZADA
  // ============================================================================

  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    // Evitar múltiples verificaciones simultáneas
    if (checkingStatusRef.current) {
      console.log("🔍 useAuth.checkAuthStatus: Ya verificando, omitiendo...");
      return isAuthenticated;
    }

    checkingStatusRef.current = true;

    try {
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
          const newTokens = await authAPI.refreshToken(
            storedTokens.refreshToken
          );
          setStoredTokens(newTokens);
          console.log(
            "✅ useAuth.checkAuthStatus: Token refrescado exitosamente"
          );
        } catch {
          console.log(
            "❌ useAuth.checkAuthStatus: Refresh falló, limpiando datos"
          );
          await logout();
          return false;
        }
      }

      // Verificar perfil solo si es necesario (ej: cada 5 minutos)
      const lastCheck = localStorage.getItem("lastProfileCheck");
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (!lastCheck || now - parseInt(lastCheck) > fiveMinutes) {
        try {
          const token = await getValidToken();
          if (!token) {
            console.log(
              "❌ useAuth.checkAuthStatus: No se pudo obtener token válido"
            );
            setIsLoading(false);
            return false;
          }

          const user = await authAPI.getProfile(token);

          // Solo actualizar si el usuario realmente cambió
          if (JSON.stringify(user) !== JSON.stringify(storedUser)) {
            setStoredUser(user);
          }

          localStorage.setItem("lastProfileCheck", now.toString());
          console.log(
            "✅ useAuth.checkAuthStatus: Usuario autenticado:",
            user.email
          );
        } catch (error) {
          console.error(
            "❌ useAuth.checkAuthStatus: Error verificando perfil:",
            error
          );
          await logout();
          return false;
        }
      } else {
        console.log(
          "✅ useAuth.checkAuthStatus: Usuario autenticado (cache):",
          storedUser.email
        );
      }

      setIsLoading(false);
      return true;
    } finally {
      checkingStatusRef.current = false;
    }
  }, [
    storedTokens,
    storedUser,
    isTokenExpired,
    getValidToken,
    setStoredTokens,
    setStoredUser,
    logout,
    isAuthenticated,
  ]);

  // ============================================================================
  // EFECTOS OPTIMIZADOS
  // ============================================================================

  // Inicialización única
  useEffect(() => {
    if (initializeRef.current) return;

    initializeRef.current = true;

    const initializeAuth = async () => {
      console.log("🚀 useAuth: Inicializando estado de autenticación...");
      await checkAuthStatus();
    };

    initializeAuth();
  }, []); // Solo al montar

  // Log de cambios solo en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 useAuth: Estado de autenticación:", {
        hasUser: !!storedUser,
        hasTokens: !!storedTokens,
        isTokenExpired: isTokenExpired(),
        isAuthenticated,
        userEmail: storedUser?.email,
      });
    }
  }, [storedUser?.email, storedTokens?.accessToken, isAuthenticated]); // Dependencias específicas

  // Auto-refresh token antes de expiración
  useEffect(() => {
    if (!storedTokens || !isAuthenticated) return;

    const refreshBuffer = 5 * 60 * 1000; // 5 minutos
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
  }, [storedTokens?.expiresAt, isAuthenticated, refreshAuth]);

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
// EXPORTS
// ============================================================================

export default useAuth;
