// ============================================================================
// USE AUTH HOOK - AUTHENTICATION STATE MANAGEMENT
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
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: "softclub" | "glass-heavy";
  glassIntensity: "whisper" | "light" | "medium" | "heavy" | "extreme";
  defaultView: "grid" | "list";
  booksPerPage: number;
  notifications: {
    email: boolean;
    push: boolean;
    readingReminders: boolean;
  };
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
  updatePreferences: (
    preferences: Partial<UserPreferences>
  ) => Promise<boolean>;
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
// AUTH API FUNCTIONS
// ============================================================================

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
//                                                                    ^^^^^
//                                                               Debería ser 3000
const authAPI = {
  login: async (
    credentials: LoginCredentials
  ): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  register: async (
    data: RegisterData
  ): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    return response.json();
  },

  getProfile: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },

  updateProfile: async (
    token: string,
    updates: Partial<User>
  ): Promise<User> => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Profile update failed");
    }

    return response.json();
  },

  changePassword: async (
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Password change failed");
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
      console.warn("Server logout failed, proceeding with local logout");
    }
  },
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

  // Token expiration check - MOVED BEFORE isAuthenticated
  const isTokenExpired = useCallback((): boolean => {
    if (!storedTokens) return true;
    return Date.now() >= storedTokens.expiresAt;
  }, [storedTokens]);

  // Computed state
  const isAuthenticated = !!storedUser && !!storedTokens && !isTokenExpired();

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

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      try {
        const response = await authAPI.login(credentials);
        setStoredTokens(response.tokens);
        setStoredUser(response.user);
        setIsLoading(false);
        return true;
      } catch (error) {
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
        const response = await authAPI.register(data);
        setStoredTokens(response.tokens);
        setStoredUser(response.user);
        setIsLoading(false);
        return true;
      } catch (error) {
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
    if (storedTokens) {
      await authAPI.logout(storedTokens.accessToken, storedTokens.refreshToken);
    }

    removeStoredTokens();
    removeStoredUser();
    setError(null);
  }, [storedTokens, removeStoredTokens, removeStoredUser]);

  // Refresh authentication
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

      setError(null);

      try {
        const token = await getValidToken();
        if (!token) return false;

        const updatedUser = await authAPI.updateProfile(token, updates);
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

  // Update preferences
  const updatePreferences = useCallback(
    async (preferences: Partial<UserPreferences>): Promise<boolean> => {
      if (!storedUser) return false;

      const updates: Partial<User> = {
        preferences: {
          ...storedUser.preferences,
          ...preferences,
        },
      };

      return updateProfile(updates);
    },
    [storedUser, updateProfile]
  );

  // Change password
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      setError(null);

      try {
        const token = await getValidToken();
        if (!token) return false;

        await authAPI.changePassword(token, currentPassword, newPassword);
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

  // Check auth status
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    if (!storedTokens || !storedUser) {
      setIsLoading(false);
      return false;
    }

    try {
      const token = await getValidToken();
      if (!token) {
        setIsLoading(false);
        return false;
      }

      const user = await authAPI.getProfile(token);
      setStoredUser(user);
      setIsLoading(false);
      return true;
    } catch {
      console.error("Auth status check failed");
      await logout();
      setIsLoading(false);
      return false;
    }
  }, [storedTokens, storedUser, getValidToken, setStoredUser, logout]);

  // Initialize auth state on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

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
    updatePreferences,
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
