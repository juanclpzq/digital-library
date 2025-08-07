// ============================================================================
// USE LOCAL STORAGE HOOK - ALMACENAMIENTO SEGURO Y REACTIVO
// FILE LOCATION: src/hooks/useLocalStorage.ts
// ============================================================================

import { useState, useEffect, useCallback } from "react";

interface UseLocalStorageOptions {
  syncAcrossTabs?: boolean;
  serializer?: {
    parse: (value: string) => any;
    stringify: (value: any) => string;
  };
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
) {
  const {
    syncAcrossTabs = false,
    serializer = {
      parse: JSON.parse,
      stringify: JSON.stringify,
    },
  } = options;

  // State para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Intentar obtener el valor del localStorage
      const item = window.localStorage.getItem(key);

      if (item === null) {
        console.log(
          `📦 useLocalStorage: No existe '${key}', usando valor inicial`
        );
        return initialValue;
      }

      const parsed = serializer.parse(item);
      console.log(`📦 useLocalStorage: Cargado '${key}' desde localStorage`);
      return parsed;
    } catch (error) {
      console.warn(`⚠️ useLocalStorage: Error leyendo '${key}':`, error);
      return initialValue;
    }
  });

  // Función para establecer el valor
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permitir que el valor sea una función para que tengamos la misma API que useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Guardar estado
        setStoredValue(valueToStore);

        // Guardar en localStorage
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
          console.log(`🗑️ useLocalStorage: Removido '${key}' del localStorage`);
        } else {
          const stringValue = serializer.stringify(valueToStore);
          window.localStorage.setItem(key, stringValue);
          console.log(`💾 useLocalStorage: Guardado '${key}' en localStorage`);
        }

        // Disparar evento personalizado para sincronización entre tabs
        if (syncAcrossTabs) {
          window.dispatchEvent(
            new CustomEvent(`localStorage-${key}`, {
              detail: valueToStore,
            })
          );
        }
      } catch (error) {
        console.error(`❌ useLocalStorage: Error guardando '${key}':`, error);
      }
    },
    [key, storedValue, serializer, syncAcrossTabs]
  );

  // Función para remover el valor
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
      console.log(`🗑️ useLocalStorage: Removido '${key}' completamente`);

      // Disparar evento para sincronización
      if (syncAcrossTabs) {
        window.dispatchEvent(
          new CustomEvent(`localStorage-${key}`, {
            detail: initialValue,
          })
        );
      }
    } catch (error) {
      console.error(`❌ useLocalStorage: Error removiendo '${key}':`, error);
    }
  }, [key, initialValue, syncAcrossTabs]);

  // Función para obtener el valor actual del localStorage
  const getCurrentValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? serializer.parse(item) : initialValue;
    } catch (error) {
      console.warn(
        `⚠️ useLocalStorage: Error leyendo valor actual de '${key}':`,
        error
      );
      return initialValue;
    }
  }, [key, initialValue, serializer]);

  // Escuchar cambios en localStorage (entre tabs/ventanas)
  useEffect(() => {
    if (!syncAcrossTabs) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = serializer.parse(e.newValue);
          console.log(
            `🔄 useLocalStorage: Sincronizado '${key}' desde otra tab`
          );
          setStoredValue(newValue);
        } catch (error) {
          console.warn(
            `⚠️ useLocalStorage: Error sincronizando '${key}':`,
            error
          );
        }
      } else if (e.key === key && e.newValue === null) {
        // La key fue removida en otra tab
        console.log(`🔄 useLocalStorage: '${key}' fue removido en otra tab`);
        setStoredValue(initialValue);
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      console.log(`🔄 useLocalStorage: Evento personalizado para '${key}'`);
      setStoredValue(e.detail);
    };

    // Escuchar eventos nativos de storage
    window.addEventListener("storage", handleStorageChange);

    // Escuchar eventos personalizados para sincronización en la misma tab
    window.addEventListener(
      `localStorage-${key}`,
      handleCustomEvent as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        `localStorage-${key}`,
        handleCustomEvent as EventListener
      );
    };
  }, [key, initialValue, serializer, syncAcrossTabs]);

  // Debug: Log cambios en el valor
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🔍 useLocalStorage: '${key}' cambió a:`, storedValue);
    }
  }, [key, storedValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    getCurrentValue,
  };
}

// ============================================================================
// HOOKS AUXILIARES
// ============================================================================

/**
 * Hook para localStorage que solo devuelve el valor y una función setter simple
 */
export function useSimpleLocalStorage<T>(key: string, initialValue: T) {
  const { value, setValue } = useLocalStorage(key, initialValue);
  return [value, setValue] as const;
}

/**
 * Hook para localStorage con sincronización automática entre tabs
 */
export function useSyncedLocalStorage<T>(key: string, initialValue: T) {
  return useLocalStorage(key, initialValue, { syncAcrossTabs: true });
}

/**
 * Hook para localStorage con serialización personalizada
 */
export function useLocalStorageWithSerializer<T>(
  key: string,
  initialValue: T,
  serializer: {
    parse: (value: string) => T;
    stringify: (value: T) => string;
  }
) {
  return useLocalStorage(key, initialValue, { serializer });
}

// ============================================================================
// UTILIDADES DE LOCALSTORAGE
// ============================================================================

/**
 * Obtener un valor del localStorage de forma directa
 */
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`⚠️ getLocalStorageItem: Error leyendo '${key}':`, error);
    return defaultValue;
  }
}

/**
 * Establecer un valor en localStorage de forma directa
 */
export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    console.log(`💾 setLocalStorageItem: Guardado '${key}'`);
  } catch (error) {
    console.error(`❌ setLocalStorageItem: Error guardando '${key}':`, error);
  }
}

/**
 * Remover un item del localStorage
 */
export function removeLocalStorageItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
    console.log(`🗑️ removeLocalStorageItem: Removido '${key}'`);
  } catch (error) {
    console.error(
      `❌ removeLocalStorageItem: Error removiendo '${key}':`,
      error
    );
  }
}

/**
 * Limpiar todo el localStorage (usar con cuidado)
 */
export function clearLocalStorage(): void {
  try {
    window.localStorage.clear();
    console.log("🧹 clearLocalStorage: localStorage completamente limpiado");
  } catch (error) {
    console.error("❌ clearLocalStorage: Error limpiando localStorage:", error);
  }
}

/**
 * Obtener todas las keys del localStorage
 */
export function getLocalStorageKeys(): string[] {
  try {
    return Object.keys(window.localStorage);
  } catch (error) {
    console.error("❌ getLocalStorageKeys: Error obteniendo keys:", error);
    return [];
  }
}

/**
 * Obtener el tamaño usado del localStorage en bytes (aproximado)
 */
export function getLocalStorageSize(): number {
  try {
    let total = 0;
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        total += window.localStorage[key].length + key.length;
      }
    }
    return total;
  } catch (error) {
    console.error("❌ getLocalStorageSize: Error calculando tamaño:", error);
    return 0;
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useLocalStorage;
