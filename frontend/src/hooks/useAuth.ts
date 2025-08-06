// ============================================================================
// USE AUTH HOOK - AUTHENTICATION STATE MANAGEMENT
// FILE LOCATION: src/hooks/useAuth.ts
// ============================================================================

import { useState, useEffect, useCallback, useContext, createContext } from "react";
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
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'softclub' | 'glass-heavy';
  glassIntensity: 'whisper' | 'light' | 'medium' | 'heavy' | 'extreme';
  defaultView: 'grid' | 'list';
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
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  
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
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// ============================================================================
// AUTH API FUNCTIONS
// ============================================================================

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  register: async (data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  },

  getProfile: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  updateProfile: async (token: string, updates: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }

    return response.json();
  },

  changePassword: async (
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password change failed');
    }
  },

  logout: async (token: string, refreshToken: string): Promise<void> => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      // Logout should succeed even if server call fails
      console.warn('Server logout failed, proceeding with local logout');
    }
  },
};

// ============================================================================
// MAIN USE AUTH HOOK
// ============================================================================

export const useAuth = (): UseAuthReturn => {
  // Persistent storage for tokens
  const { value: storedTokens, setValue: setStoredTokens, removeValue: removeStoredTokens } = 
    useLocalStorage<AuthTokens | null>('authTokens', null, {
      syncAcrossTabs: true,
    });

  const { value: storedUser, setValue: setStoredUser, removeValue: removeStoredUser } = 
    useLocalStorage<User | null>('user', null, {
      syncAcrossTabs: true,
    });

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Computed state
  const isAuthenticated = !!(storedUser && storedTokens);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isTokenExpired = useCallback((): boolean => {
    if (!storedTokens) return true;
    return Date.now() >= storedTokens.expiresAt;
  }, [storedTokens]);

  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (!storedTokens) return null;

    // If token is not expired, return it
    if (!isTokenExpired()) {
      return storedTokens.accessToken;
    }

    // Try to refresh the token
    try {
      const newTokens = await authAPI.refreshToken(storedTokens.refreshToken);
      setStoredTokens(newTokens);
      return newTokens.accessToken;
    } catch (error) {
      // Refresh failed, clear auth state
      await logout();
      return null;
    }
  }, [storedTokens, isTokenExpired, setStoredTokens]);

  // Auth actions
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, tokens } = await authAPI.login(credentials);
      
      setStoredUser(user);
      setStoredTokens(tokens);
      
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setStoredUser, setStoredTokens]);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, tokens } = await authAPI.register(data);
      
      setStoredUser(user);
      setStoredTokens(tokens);
      
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setStoredUser, setStoredTokens]);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      if (storedTokens && storedTokens.accessToken) {
        await authAPI.logout(storedTokens.accessToken, storedTokens.refreshToken);
      }
    } catch (error) {
      console.warn('Server logout failed:', error);
    } finally {
      // Clear local auth state regardless of server response
      removeStoredUser();
      removeStoredTokens();
      setError(null);
      setIsLoading(false);
    }
  }, [storedTokens, removeStoredUser, removeStoredTokens]);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    if (!storedTokens) return false;

    try {
      const token = await getValidToken();
      if (!token) return false;

      // Fetch fresh user data
      const user = await authAPI.getProfile(token);
      setStoredUser(user);
      
      return true;
    } catch (error) {
      console.error('Auth refresh failed:', error);
      await logout();
      return false;
    }
  }, [storedTokens, getValidToken, setStoredUser, logout]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!storedUser) return false;

    setError(null);

    try {
      const token = await getValidToken();
      if (!token) return false;

      const updatedUser = await authAPI.updateProfile(token, updates);
      setStoredUser(updatedUser);
      
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      setError(message);
      return false;
    }
  }, [storedUser, getValidToken, setStoredUser]);

  const updatePreferences = useCallback(async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    if (!storedUser) return false;

    const updates = {
      preferences: {
        ...storedUser.preferences,
        ...preferences,
      },
    };

    return updateProfile(updates);
  }, [storedUser, updateProfile]);

  const changePassword = useCallback(async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    setError(null);

    try {
      const token = await getValidToken();
      if (!token) return false;

      await authAPI.changePassword(token, currentPassword, newPassword);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password change failed';
      setError(message);
      return false;
    }
  }, [getValidToken]);

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

      // Verify token is still valid with server
      const user = await authAPI.getProfile(token);
      setStoredUser(user);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Auth status check failed:', error);
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

    const refreshBuffer = 5 * 60 * 1000; // 5 minutes before expiration
    const timeUntilRefresh = storedTokens.expiresAt - Date.now() - refreshBuffer;

    if (timeUntilRefresh <= 0) {
      // Token expires soon, refresh now
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// AUTH GUARDS & UTILITIES
// ============================================================================

/**
 * HOC for protecting routes that require authentication
 */
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
      return <div>Loading...</div>; // Replace with proper loading component
    }

    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return <div>Please log in to access this page</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

/**
 * Hook for checking if user has specific permissions
 */
export const usePermissions = () => {
  const { user } = useAuthContext();

  return {
    canEditProfile: !!user,
    canChangePassword: !!user,
    canDeleteAccount: !!user,
    // Add more permissions as needed
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useAuth;