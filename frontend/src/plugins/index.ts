// ============================================================================
// PLUGINS INDEX - EXPORTACIONES LIMPIAS Y CORREGIDAS
// FILE LOCATION: src/plugins/index.ts
// ============================================================================

// ============================================================================
// CORE PLUGIN SYSTEM - IMPORTACIONES DIRECTAS
// ============================================================================

// Base classes and interfaces
export { BasePlugin } from "./BasePlugin";
export type { PluginContext, PluginConfig, PluginEvent } from "./BasePlugin";

// Plugin Manager - CORREGIDO: importación directa
import PluginManagerClass from "./PluginManager";
export { PluginManagerClass as PluginManager };
export default PluginManagerClass;

// React Provider - CORREGIDO: importación verificada
import {
  PluginProvider as PluginProviderComponent,
  usePlugins as usePluginsHook,
  PluginRegistry as PluginRegistryComponent,
  PluginDebugger as PluginDebuggerComponent,
} from "./PluginProvider";

export const PluginProvider = PluginProviderComponent;
export const usePlugins = usePluginsHook;
export const PluginRegistry = PluginRegistryComponent;
export const PluginDebugger = PluginDebuggerComponent;

// ============================================================================
// BUILT-IN PLUGINS
// ============================================================================

// Development plugins (CORREGIDO: nombres de archivos)
export { ThemeDebugPlugin } from "./ThemeDebugPlugin";
export { PerformancePlugin } from "./PerformancePlugin";

// ============================================================================
// IMPORTS FOR LOCAL USE (CORREGIDOS)
// ============================================================================

import {
  BasePlugin,
  type PluginContext,
  type PluginConfig,
} from "./BasePlugin";
import { ThemeDebugPlugin } from "./ThemeDebugPlugin";
import { PerformancePlugin } from "./PerformancePlugin";

// ============================================================================
// PLUGIN FACTORY FUNCTIONS
// ============================================================================

/**
 * Crea un contexto de plugin con valores por defecto
 * @param overrides - Valores a sobrescribir
 * @returns Contexto de plugin completo
 */
export const createPluginContext = (
  overrides: Partial<PluginContext> = {}
): PluginContext => {
  const defaultContext: PluginContext = {
    theme: {
      variant: "softclub",
      isGlassMode: false,
      glassIntensity: "medium",
      toggleTheme: () => console.log("toggleTheme called"),
      setGlassIntensity: () => console.log("setGlassIntensity called"),
    },
    user: null,
    router: {
      currentPath: window.location.pathname,
      navigate: (path: string) => {
        console.log("Navigate to:", path);
      },
    },
    app: {
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    },
  };

  return { ...defaultContext, ...overrides };
};

/**
 * Crea un plugin de debug de tema con configuración personalizada
 * @param config - Configuración opcional
 * @returns Instancia de ThemeDebugPlugin
 */
export const createThemeDebugPlugin = (config?: Partial<PluginConfig>) => {
  const plugin = new ThemeDebugPlugin();
  if (config) {
    plugin.updateConfig(config);
  }
  return plugin;
};

/**
 * Crea un plugin de monitoreo de performance con configuración personalizada
 * @param config - Configuración opcional
 * @returns Instancia de PerformancePlugin
 */
export const createPerformancePlugin = (config?: Partial<PluginConfig>) => {
  const plugin = new PerformancePlugin();
  if (config) {
    plugin.updateConfig(config);
  }
  return plugin;
};

// ============================================================================
// PLUGIN COLLECTIONS
// ============================================================================

/**
 * Obtiene todos los plugins de desarrollo con configuración por defecto
 * @returns Array de plugins de desarrollo
 */
export const getAllDevPlugins = (): BasePlugin[] => {
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
};

/**
 * Obtiene plugins según el entorno
 * @param environment - Entorno objetivo
 * @returns Array de plugins apropiados
 */
export const getPluginsForEnvironment = (
  environment: string = process.env.NODE_ENV || "development"
): BasePlugin[] => {
  switch (environment) {
    case "development":
      return getAllDevPlugins();
    case "production":
      return []; // Sin plugins debug en producción
    case "testing":
      return []; // Plugins específicos para testing
    default:
      return [];
  }
};

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

/**
 * Utilidades de desarrollo para debugging de plugins
 */
export const PluginDevUtils = {
  /**
   * Lista todos los plugins activos en la consola
   */
  listActivePlugins: () => {
    if (process.env.NODE_ENV === "development") {
      const manager = (window as any).__pluginManager as
        | PluginManagerClass
        | undefined;
      if (manager) {
        const active = manager.getActivePlugins();
        console.table(
          active.map((p) => ({
            name: p.name,
            version: p.version,
            enabled: p.isEnabled(),
            priority: p.config.priority,
            position: p.config.position,
          }))
        );
      } else {
        console.warn(
          "Plugin manager not found. Make sure PluginProvider is mounted."
        );
      }
    }
  },

  /**
   * Obtiene estadísticas detalladas de plugins
   */
  getDetailedStats: () => {
    if (process.env.NODE_ENV === "development") {
      const manager = (window as any).__pluginManager as
        | PluginManagerClass
        | undefined;
      if (manager) {
        return manager.getStats();
      }
      console.warn(
        "Plugin manager not found. Make sure PluginProvider is mounted."
      );
    }
    return null;
  },

  /**
   * Fuerza re-render de todos los plugins
   */
  forceRerender: () => {
    if (process.env.NODE_ENV === "development") {
      const manager = (window as any).__pluginManager as
        | PluginManagerClass
        | undefined;
      if (manager) {
        const context = manager.getContext();
        manager.updateContext({ ...context });
        console.log("🔌 Forced plugin re-render");
      } else {
        console.warn(
          "Plugin manager not found. Make sure PluginProvider is mounted."
        );
      }
    }
  },

  /**
   * Registra el plugin manager globalmente para debugging
   * @param manager - Instancia del PluginManager
   */
  registerGlobalManager: (manager: PluginManagerClass) => {
    if (process.env.NODE_ENV === "development") {
      (window as any).__pluginManager = manager;
      console.log("🔌 Plugin manager registered globally for debugging");
    }
  },

  /**
   * Limpia el plugin manager global
   */
  unregisterGlobalManager: () => {
    if (process.env.NODE_ENV === "development") {
      delete (window as any).__pluginManager;
      console.log("🔌 Plugin manager unregistered from global scope");
    }
  },
};

// ============================================================================
// GLOBAL PLUGIN REGISTRY (for debugging)
// ============================================================================

if (process.env.NODE_ENV === "development") {
  // Exponer utilidades globalmente para debugging
  (window as any).__pluginDevUtils = PluginDevUtils;

  console.log("🔌 Plugin development utilities available:");
  console.log("  - window.__pluginDevUtils.listActivePlugins()");
  console.log("  - window.__pluginDevUtils.getDetailedStats()");
  console.log("  - window.__pluginDevUtils.forceRerender()");
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Verifica si un objeto es un plugin válido
 * @param obj - Objeto a verificar
 * @returns boolean
 */
export const isValidPlugin = (obj: unknown): obj is BasePlugin => {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "name" in obj &&
    "version" in obj &&
    "render" in obj &&
    "shouldRender" in obj &&
    typeof (obj as any).render === "function" &&
    typeof (obj as any).shouldRender === "function"
  );
};

/**
 * Filtra solo plugins válidos de un array
 * @param plugins - Array de posibles plugins
 * @returns Array de plugins válidos
 */
export const filterValidPlugins = (plugins: unknown[]): BasePlugin[] => {
  return plugins.filter(isValidPlugin);
};

// ============================================================================
// EVITAR DEFAULT EXPORT PROBLEMÁTICO - REMOVIDO
// ============================================================================
// El default export original causaba el problema de referencia circular
// Se mantiene solo la exportación de PluginManagerClass como default

// ============================================================================
// EXPORTACIONES COLECTIVAS (SIN PROBLEMAS DE REFERENCIA)
// ============================================================================

export const PluginSystemExports = {
  // Core
  BasePlugin,
  PluginManager: PluginManagerClass,
  PluginProvider: PluginProviderComponent,
  usePlugins: usePluginsHook,

  // Components
  PluginRegistry: PluginRegistryComponent,
  PluginDebugger: PluginDebuggerComponent,

  // Built-in plugins
  ThemeDebugPlugin,
  PerformancePlugin,

  // Collections
  getAllDevPlugins,
  getPluginsForEnvironment,

  // Factories
  createPluginContext,
  createThemeDebugPlugin,
  createPerformancePlugin,

  // Utilities
  PluginDevUtils,
  isValidPlugin,
  filterValidPlugins,
};
