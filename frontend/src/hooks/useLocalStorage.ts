// ============================================================================
// FIX PARA useLocalStorage.ts - OPTIMIZAR EVENTOS Y REDUCIR LOOPS
// PROBLEMA: Eventos personalizados excesivos causando re-renders
// ============================================================================

import { useState, useEffect, useCallback, useRef } from "react";

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

  // Refs para evitar loops y eventos innecesarios
  const lastValueRef = useRef<T>();
  const isUpdatingRef = useRef(false);

  // State para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      if (item === null) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `📦 useLocalStorage: No existe '${key}', usando valor inicial`
          );
        }
        lastValueRef.current = initialValue;
        return initialValue;
      }

      const parsed = serializer.parse(item);
      if (process.env.NODE_ENV === "development") {
        console.log(`📦 useLocalStorage: Cargado '${key}' desde localStorage`);
      }
      lastValueRef.current = parsed;
      return parsed;
    } catch (error) {
      console.warn(`⚠️ useLocalStorage: Error leyendo '${key}':`, error);
      lastValueRef.current = initialValue;
      return initialValue;
    }
  });

  // Función optimizada para establecer el valor
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      // Evitar actualizaciones innecesarias
      if (isUpdatingRef.current) return;

      try {
        isUpdatingRef.current = true;

        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Verificar si el valor realmente cambió
        const stringifiedNew = serializer.stringify(valueToStore);
        const stringifiedOld =
          lastValueRef.current !== undefined
            ? serializer.stringify(lastValueRef.current)
            : null;

        if (stringifiedNew === stringifiedOld) {
          // No hay cambios reales, no hacer nada
          return;
        }

        // Actualizar referencias
        lastValueRef.current = valueToStore;
        setStoredValue(valueToStore);

        // Guardar en localStorage
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
          if (process.env.NODE_ENV === "development") {
            console.log(
              `🗑️ useLocalStorage: Removido '${key}' del localStorage`
            );
          }
        } else {
          window.localStorage.setItem(key, stringifiedNew);
          if (process.env.NODE_ENV === "development") {
            console.log(
              `💾 useLocalStorage: Guardado '${key}' en localStorage`
            );
          }
        }

        // Disparar evento personalizado solo si es necesario para sync
        if (syncAcrossTabs) {
          // Usar un debounce para evitar eventos excesivos
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent(`localStorage-${key}`, {
                detail: valueToStore,
              })
            );
          }, 0);
        }
      } catch (error) {
        console.error(`❌ useLocalStorage: Error guardando '${key}':`, error);
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [key, storedValue, serializer, syncAcrossTabs]
  );

  // Función para remover el valor
  const removeValue = useCallback(() => {
    if (isUpdatingRef.current) return;

    try {
      isUpdatingRef.current = true;

      lastValueRef.current = initialValue;
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);

      if (process.env.NODE_ENV === "development") {
        console.log(`🗑️ useLocalStorage: Removido '${key}' completamente`);
      }

      // Disparar evento para sincronización
      if (syncAcrossTabs) {
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent(`localStorage-${key}`, {
              detail: initialValue,
            })
          );
        }, 0);
      }
    } catch (error) {
      console.error(`❌ useLocalStorage: Error removiendo '${key}':`, error);
    } finally {
      isUpdatingRef.current = false;
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

  // Escuchar cambios en localStorage (optimizado)
  useEffect(() => {
    if (!syncAcrossTabs) return;

    let timeoutId: NodeJS.Timeout;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && !isUpdatingRef.current) {
        // Debounce para evitar múltiples actualizaciones rápidas
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          try {
            if (e.newValue !== null) {
              const newValue = serializer.parse(e.newValue);
              const stringifiedNew = serializer.stringify(newValue);
              const stringifiedCurrent =
                lastValueRef.current !== undefined
                  ? serializer.stringify(lastValueRef.current)
                  : null;

              if (stringifiedNew !== stringifiedCurrent) {
                if (process.env.NODE_ENV === "development") {
                  console.log(
                    `🔄 useLocalStorage: Sincronizado '${key}' desde otra tab`
                  );
                }
                lastValueRef.current = newValue;
                setStoredValue(newValue);
              }
            } else {
              // La key fue removida en otra tab
              if (process.env.NODE_ENV === "development") {
                console.log(
                  `🔄 useLocalStorage: '${key}' fue removido en otra tab`
                );
              }
              lastValueRef.current = initialValue;
              setStoredValue(initialValue);
            }
          } catch (error) {
            console.warn(
              `⚠️ useLocalStorage: Error sincronizando '${key}':`,
              error
            );
          }
        }, 50); // Debounce de 50ms
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      if (!isUpdatingRef.current) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const newValue = e.detail;
          const stringifiedNew = serializer.stringify(newValue);
          const stringifiedCurrent =
            lastValueRef.current !== undefined
              ? serializer.stringify(lastValueRef.current)
              : null;

          if (stringifiedNew !== stringifiedCurrent) {
            if (process.env.NODE_ENV === "development") {
              console.log(
                `🔄 useLocalStorage: Evento personalizado para '${key}'`
              );
            }
            lastValueRef.current = newValue;
            setStoredValue(newValue);
          }
        }, 50);
      }
    };

    // Escuchar eventos nativos de storage
    window.addEventListener("storage", handleStorageChange);

    // Escuchar eventos personalizados para sincronización en la misma tab
    window.addEventListener(
      `localStorage-${key}`,
      handleCustomEvent as EventListener
    );

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        `localStorage-${key}`,
        handleCustomEvent as EventListener
      );
    };
  }, [key, initialValue, serializer, syncAcrossTabs]);

  // Debug optimizado: Log cambios solo cuando sea realmente necesario
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && !isUpdatingRef.current) {
      const stringifiedValue = serializer.stringify(storedValue);
      const stringifiedLast =
        lastValueRef.current !== undefined
          ? serializer.stringify(lastValueRef.current)
          : null;

      if (stringifiedValue !== stringifiedLast) {
        console.log(`🔍 useLocalStorage: '${key}' cambió a:`, storedValue);
      }
    }
  }, [key, storedValue, serializer]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    getCurrentValue,
  };
}

// ============================================================================
// HOOKS AUXILIARES OPTIMIZADOS
// ============================================================================

export function useSimpleLocalStorage<T>(key: string, initialValue: T) {
  const { value, setValue } = useLocalStorage(key, initialValue, {
    syncAcrossTabs: false, // Disable sync for simple usage
  });
  return [value, setValue] as const;
}

export function useSyncedLocalStorage<T>(key: string, initialValue: T) {
  return useLocalStorage(key, initialValue, { syncAcrossTabs: true });
}

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
// UTILIDADES DE LOCALSTORAGE (sin cambios)
// ============================================================================

export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`⚠️ getLocalStorageItem: Error leyendo '${key}':`, error);
    return defaultValue;
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    if (process.env.NODE_ENV === "development") {
      console.log(`💾 setLocalStorageItem: Guardado '${key}'`);
    }
  } catch (error) {
    console.error(`❌ setLocalStorageItem: Error guardando '${key}':`, error);
  }
}

export function removeLocalStorageItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
    if (process.env.NODE_ENV === "development") {
      console.log(`🗑️ removeLocalStorageItem: Removido '${key}'`);
    }
  } catch (error) {
    console.error(
      `❌ removeLocalStorageItem: Error removiendo '${key}':`,
      error
    );
  }
}

export function clearLocalStorage(): void {
  try {
    window.localStorage.clear();
    console.log("🧹 clearLocalStorage: localStorage completamente limpiado");
  } catch (error) {
    console.error("❌ clearLocalStorage: Error limpiando localStorage:", error);
  }
}

export function getLocalStorageKeys(): string[] {
  try {
    return Object.keys(window.localStorage);
  } catch (error) {
    console.error("❌ getLocalStorageKeys: Error obteniendo keys:", error);
    return [];
  }
}

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

export default useLocalStorage;
