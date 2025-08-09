// ============================================================================
// PLUGINS INDEX - EXPORTACIONES LIMPIAS Y CORREGIDAS
// FILE LOCATION: src/plugins/index.ts
// ============================================================================

// ============================================================================
// CORE PLUGIN SYSTEM
// ============================================================================

// Base classes and interfaces
export { BasePlugin } from "./BasePlugin";
export type { PluginContext, PluginConfig, PluginEvent } from "./BasePlugin";

// Plugin Manager
export { default as PluginManager } from "./PluginManager";

// React Provider (solo los que existen)
export {
  PluginProvider,
  usePlugins,
  PluginRegistry,
  PluginDebugger,
} from "./PluginProvider";

// ============================================================================
// BUILT-IN PLUGINS
// ============================================================================

// Development plugins
export { ThemeDebugPlugin } from "./ThemeDebugPlugin";
export { PerformancePlugin } from "./PerformancePlugin";

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
      const manager = (window as unknown as { __pluginManager?: PluginManager })
        .__pluginManager;
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
      }
    }
  },

  /**
   * Obtiene estadísticas detalladas de plugins
   */
  getDetailedStats: () => {
    if (process.env.NODE_ENV === "development") {
      const manager = (window as unknown as { __pluginManager?: PluginManager })
        .__pluginManager;
      if (manager) {
        return manager.getStats();
      }
    }
    return null;
  },

  /**
   * Fuerza re-render de todos los plugins
   */
  forceRerender: () => {
    if (process.env.NODE_ENV === "development") {
      const manager = (window as unknown as { __pluginManager?: PluginManager })
        .__pluginManager;
      if (manager) {
        const context = manager.getContext();
        manager.updateContext({ ...context });
      }
    }
  },
};

// ============================================================================
// GLOBAL PLUGIN REGISTRY (for debugging)
// ============================================================================

if (process.env.NODE_ENV === "development") {
  // Exponer utilidades globalmente para debugging
  (
    window as unknown as { __pluginDevUtils?: typeof PluginDevUtils }
  ).__pluginDevUtils = PluginDevUtils;
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Core
  BasePlugin,
  PluginManager,
  PluginProvider,
  usePlugins,

  // Built-in plugins
  getAllDevPlugins,
  getPluginsForEnvironment,

  // Utilities
  createPluginContext,
  PluginDevUtils,
};
