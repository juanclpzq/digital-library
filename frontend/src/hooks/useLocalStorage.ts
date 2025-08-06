// ============================================================================
// USE LOCAL STORAGE HOOK - PERSISTENT STATE WITH LOCALSTORAGE
// FILE LOCATION: src/hooks/useLocalStorage.ts
// ============================================================================

import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UseLocalStorageOptions<T> {
  serializer?: {
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
  };
  syncAcrossTabs?: boolean;
  errorHandler?: (error: Error) => void;
  validator?: (value: any) => value is T;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prevValue: T) => T)) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: Error | null;
}

// ============================================================================
// DEFAULT SERIALIZER
// ============================================================================

const defaultSerializer = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

// ============================================================================
// STORAGE EVENT LISTENER MANAGER
// ============================================================================

class StorageEventManager {
  private listeners = new Map<string, Set<(newValue: any) => void>>();

  subscribe(key: string, callback: (newValue: any) => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(callback);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  notify(key: string, newValue: any) {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach((callback) => callback(newValue));
    }
  }

  hasListeners(key: string): boolean {
    return this.listeners.has(key) && this.listeners.get(key)!.size > 0;
  }
}

const storageManager = new StorageEventManager();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const isClient = typeof window !== "undefined";

const getStorageValue = <T>(
  key: string,
  defaultValue: T,
  serializer: UseLocalStorageOptions<T>["serializer"],
  validator?: (value: any) => value is T,
  errorHandler?: (error: Error) => void
): T => {
  if (!isClient) {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);

    if (item === null) {
      return defaultValue;
    }

    const deserializedValue =
      serializer?.deserialize(item) ?? defaultSerializer.deserialize(item);

    // Validate the deserialized value if validator is provided
    if (validator && !validator(deserializedValue)) {
      console.warn(
        `Invalid data found in localStorage for key "${key}". Using default value.`
      );
      return defaultValue;
    }

    return deserializedValue;
  } catch (error) {
    const err =
      error instanceof Error
        ? error
        : new Error(`Failed to parse localStorage item "${key}"`);
    errorHandler?.(err);
    console.error(`Error reading localStorage key "${key}":`, err);
    return defaultValue;
  }
};

const setStorageValue = <T>(
  key: string,
  value: T,
  serializer: UseLocalStorageOptions<T>["serializer"],
  errorHandler?: (error: Error) => void
): boolean => {
  if (!isClient) {
    return false;
  }

  try {
    const serializedValue =
      serializer?.serialize(value) ?? defaultSerializer.serialize(value);
    window.localStorage.setItem(key, serializedValue);

    // Notify other hook instances
    storageManager.notify(key, value);

    return true;
  } catch (error) {
    const err =
      error instanceof Error
        ? error
        : new Error(`Failed to set localStorage item "${key}"`);
    errorHandler?.(err);
    console.error(`Error setting localStorage key "${key}":`, err);
    return false;
  }
};

const removeStorageValue = (
  key: string,
  errorHandler?: (error: Error) => void
): boolean => {
  if (!isClient) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);

    // Notify other hook instances
    storageManager.notify(key, undefined);

    return true;
  } catch (error) {
    const err =
      error instanceof Error
        ? error
        : new Error(`Failed to remove localStorage item "${key}"`);
    errorHandler?.(err);
    console.error(`Error removing localStorage key "${key}":`, err);
    return false;
  }
};

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook for managing localStorage with React state synchronization
 *
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @param options - Configuration options
 * @returns Object with value, setter, remover, and status
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { value: theme, setValue: setTheme } = useLocalStorage('theme', 'light');
 *
 * // With validation
 * const { value: user, setValue: setUser, error } = useLocalStorage(
 *   'user',
 *   null,
 *   {
 *     validator: (value): value is User => value && typeof value.id === 'string',
 *     syncAcrossTabs: true
 *   }
 * );
 *
 * // With custom serialization
 * const { value: settings, setValue: setSettings } = useLocalStorage(
 *   'settings',
 *   {},
 *   {
 *     serializer: {
 *       serialize: (value) => btoa(JSON.stringify(value)),
 *       deserialize: (value) => JSON.parse(atob(value))
 *     }
 *   }
 * );
 * ```
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> => {
  const {
    serializer,
    syncAcrossTabs = false,
    errorHandler,
    validator,
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  const handleError = useCallback(
    (err: Error) => {
      setError(err);
      errorHandler?.(err);
    },
    [errorHandler]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize value from localStorage
  useEffect(() => {
    const initialValue = getStorageValue(
      key,
      defaultValue,
      serializer,
      validator,
      handleError
    );

    setStoredValue(initialValue);
    setIsLoading(false);
  }, [key, defaultValue, serializer, validator, handleError]);

  // Set up cross-tab synchronization
  useEffect(() => {
    if (!syncAcrossTabs || !isClient) {
      return;
    }

    // Subscribe to storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue =
            serializer?.deserialize(e.newValue) ??
            defaultSerializer.deserialize(e.newValue);

          if (validator && !validator(newValue)) {
            console.warn(
              `Invalid data received from storage event for key "${key}"`
            );
            return;
          }

          setStoredValue(newValue);
          clearError();
        } catch (error) {
          const err =
            error instanceof Error
              ? error
              : new Error(`Failed to parse storage event for key "${key}"`);
          handleError(err);
        }
      } else if (e.key === key && e.newValue === null) {
        // Key was removed
        setStoredValue(defaultValue);
        clearError();
      }
    };

    // Subscribe to internal storage manager (for same-tab updates)
    const unsubscribeInternal = storageManager.subscribe(key, (newValue) => {
      if (newValue === undefined) {
        setStoredValue(defaultValue);
      } else {
        setStoredValue(newValue);
      }
      clearError();
    });

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      unsubscribeInternal();
    };
  }, [
    key,
    defaultValue,
    serializer,
    validator,
    syncAcrossTabs,
    handleError,
    clearError,
  ]);

  // Set value function
  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        clearError();

        const newValue = value instanceof Function ? value(storedValue) : value;

        const success = setStorageValue(key, newValue, serializer, handleError);

        if (success) {
          setStoredValue(newValue);
        }
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error(`Failed to set value for key "${key}"`);
        handleError(err);
      }
    },
    [key, storedValue, serializer, handleError, clearError]
  );

  // Remove value function
  const removeValue = useCallback(() => {
    try {
      clearError();

      const success = removeStorageValue(key, handleError);

      if (success) {
        setStoredValue(defaultValue);
      }
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error(`Failed to remove value for key "${key}"`);
      handleError(err);
    }
  }, [key, defaultValue, handleError, clearError]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
    error,
  };
};

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook for boolean values in localStorage
 */
export const useLocalStorageBoolean = (
  key: string,
  defaultValue = false,
  options?: Omit<UseLocalStorageOptions<boolean>, "validator">
) => {
  return useLocalStorage(key, defaultValue, {
    ...options,
    validator: (value): value is boolean => typeof value === "boolean",
  });
};

/**
 * Hook for number values in localStorage
 */
export const useLocalStorageNumber = (
  key: string,
  defaultValue = 0,
  options?: Omit<UseLocalStorageOptions<number>, "validator">
) => {
  return useLocalStorage(key, defaultValue, {
    ...options,
    validator: (value): value is number =>
      typeof value === "number" && !isNaN(value),
  });
};

/**
 * Hook for string values in localStorage
 */
export const useLocalStorageString = (
  key: string,
  defaultValue = "",
  options?: Omit<UseLocalStorageOptions<string>, "validator">
) => {
  return useLocalStorage(key, defaultValue, {
    ...options,
    validator: (value): value is string => typeof value === "string",
  });
};

/**
 * Hook for array values in localStorage
 */
export const useLocalStorageArray = <T = any>(
  key: string,
  defaultValue: T[] = [],
  options?: Omit<UseLocalStorageOptions<T[]>, "validator">
) => {
  return useLocalStorage(key, defaultValue, {
    ...options,
    validator: (value): value is T[] => Array.isArray(value),
  });
};

/**
 * Hook for object values in localStorage
 */
export const useLocalStorageObject = <T extends Record<string, any>>(
  key: string,
  defaultValue: T,
  options?: Omit<UseLocalStorageOptions<T>, "validator">
) => {
  return useLocalStorage(key, defaultValue, {
    ...options,
    validator: (value): value is T =>
      value !== null && typeof value === "object" && !Array.isArray(value),
  });
};

// ============================================================================
// UTILITY FUNCTIONS FOR EXTERNAL USE
// ============================================================================

/**
 * Get a value from localStorage without using the hook
 */
export const getLocalStorageItem = <T>(
  key: string,
  defaultValue: T,
  options: Pick<UseLocalStorageOptions<T>, "serializer" | "validator"> = {}
): T => {
  return getStorageValue(
    key,
    defaultValue,
    options.serializer,
    options.validator
  );
};

/**
 * Set a value in localStorage without using the hook
 */
export const setLocalStorageItem = <T>(
  key: string,
  value: T,
  options: Pick<UseLocalStorageOptions<T>, "serializer"> = {}
): boolean => {
  return setStorageValue(key, value, options.serializer);
};

/**
 * Remove a value from localStorage without using the hook
 */
export const removeLocalStorageItem = (key: string): boolean => {
  return removeStorageValue(key);
};

/**
 * Clear all localStorage
 */
export const clearLocalStorage = (): boolean => {
  if (!isClient) {
    return false;
  }

  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useLocalStorage;
