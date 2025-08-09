// ============================================================================
// PLUGIN MANAGER - ORCHESTRATOR FOR ALL PLUGINS (FIXED)
// FILE LOCATION: src/plugins/PluginManager.ts
// ============================================================================

import React from "react";
import { BasePlugin, type PluginContext, type PluginEvent } from "./BasePlugin";

// ============================================================================
// PLUGIN STATS INTERFACE
// ============================================================================

interface PluginStats {
  totalPlugins: number;
  activePlugins: number;
  enabledPlugins: number;
  pluginsByPriority?: Array<{
    name: string;
    priority: number;
    position: string;
  }>;
}

// ============================================================================
// PLUGIN MANAGER CLASS
// ============================================================================

export class PluginManager {
  private plugins: BasePlugin[] = [];
  private context: PluginContext;
  private eventListeners: Map<string, ((event: PluginEvent) => void)[]> =
    new Map();

  constructor(context: PluginContext) {
    this.context = context;
    this.log("PluginManager initialized");
  }

  // ============================================================================
  // PLUGIN REGISTRATION
  // ============================================================================

  /**
   * Registra un nuevo plugin
   * @param plugin - Plugin a registrar
   */
  registerPlugin(plugin: BasePlugin): void {
    // Verificar si ya existe un plugin con el mismo nombre
    const existingIndex = this.plugins.findIndex((p) => p.name === plugin.name);

    if (existingIndex > -1) {
      this.log(`Plugin "${plugin.name}" already exists. Replacing...`, "warn");
      this.unregisterPlugin(plugin.name);
    }

    this.log(`Registering plugin: ${plugin.name} v${plugin.version}`);
    this.plugins.push(plugin);

    // Llamar hook de montaje
    try {
      plugin.onMount?.(this.context);
      this.emitEvent({ type: "PLUGIN_MOUNTED", plugin });
      this.log(`Plugin "${plugin.name}" mounted successfully`);
    } catch (error) {
      this.log(`Error mounting plugin "${plugin.name}": ${error}`, "error");
      this.emitEvent({ type: "PLUGIN_ERROR", plugin, error: error as Error });
    }
  }

  /**
   * Desregistra un plugin por nombre
   * @param pluginName - Nombre del plugin a desregistrar
   */
  unregisterPlugin(pluginName: string): void {
    const index = this.plugins.findIndex((p) => p.name === pluginName);

    if (index > -1) {
      const plugin = this.plugins[index];

      try {
        plugin.onUnmount?.(this.context);
        this.emitEvent({ type: "PLUGIN_UNMOUNTED", plugin });
        this.log(`Plugin "${pluginName}" unmounted successfully`);
      } catch (error) {
        this.log(`Error unmounting plugin "${pluginName}": ${error}`, "error");
        this.emitEvent({ type: "PLUGIN_ERROR", plugin, error: error as Error });
      }

      this.plugins.splice(index, 1);
      this.log(`Unregistered plugin: ${pluginName}`);
    } else {
      this.log(`Plugin "${pluginName}" not found`, "warn");
    }
  }

  /**
   * Registra múltiples plugins
   * @param plugins - Array de plugins a registrar
   */
  registerPlugins(plugins: BasePlugin[]): void {
    plugins.forEach((plugin) => this.registerPlugin(plugin));
  }

  // ============================================================================
  // PLUGIN MANAGEMENT
  // ============================================================================

  /**
   * Obtiene todos los plugins registrados
   * @returns Array de plugins
   */
  getAllPlugins(): BasePlugin[] {
    return [...this.plugins];
  }

  /**
   * Obtiene plugins activos ordenados por prioridad
   * @returns Array de plugins activos
   */
  getActivePlugins(): BasePlugin[] {
    return this.plugins
      .filter((plugin) => {
        try {
          return plugin.isEnabled() && plugin.shouldRender(this.context);
        } catch (error) {
          this.log(
            `Error checking if plugin "${plugin.name}" should render: ${error}`,
            "error"
          );
          this.emitEvent({
            type: "PLUGIN_ERROR",
            plugin,
            error: error as Error,
          });
          return false;
        }
      })
      .sort((a, b) => b.config.priority - a.config.priority);
  }

  /**
   * Obtiene un plugin específico por nombre
   * @param name - Nombre del plugin
   * @returns Plugin encontrado o undefined
   */
  getPlugin(name: string): BasePlugin | undefined {
    return this.plugins.find((p) => p.name === name);
  }

  /**
   * Habilita un plugin
   * @param name - Nombre del plugin
   */
  enablePlugin(name: string): void {
    const plugin = this.getPlugin(name);
    if (plugin) {
      plugin.enable();
      this.log(`Plugin "${name}" enabled`);
    } else {
      this.log(`Plugin "${name}" not found`, "warn");
    }
  }

  /**
   * Deshabilita un plugin
   * @param name - Nombre del plugin
   */
  disablePlugin(name: string): void {
    const plugin = this.getPlugin(name);
    if (plugin) {
      plugin.disable();
      this.log(`Plugin "${name}" disabled`);
    } else {
      this.log(`Plugin "${name}" not found`, "warn");
    }
  }

  // ============================================================================
  // CONTEXT MANAGEMENT
  // ============================================================================

  /**
   * Actualiza el contexto de todos los plugins
   * @param newContext - Nuevo contexto
   */
  updateContext(newContext: PluginContext): void {
    this.context = newContext;
    this.log("Context updated for all plugins");
  }

  /**
   * Obtiene el contexto actual
   * @returns Contexto actual
   */
  getContext(): PluginContext {
    return this.context;
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  /**
   * Suscribe a eventos del sistema de plugins
   * @param eventType - Tipo de evento
   * @param callback - Función callback
   */
  addEventListener(
    eventType: string,
    callback: (event: PluginEvent) => void
  ): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  /**
   * Desuscribe de eventos
   * @param eventType - Tipo de evento
   * @param callback - Función callback a remover
   */
  removeEventListener(
    eventType: string,
    callback: (event: PluginEvent) => void
  ): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emite un evento a todos los listeners
   * @param event - Evento a emitir
   */
  private emitEvent(event: PluginEvent): void {
    const listeners = this.eventListeners.get(event.type) || [];
    listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        this.log(
          `Error in event listener for ${event.type}: ${error}`,
          "error"
        );
      }
    });
  }

  // ============================================================================
  // NOTIFICATION METHODS
  // ============================================================================

  /**
   * Notifica cambio de tema a todos los plugins
   * @param newTheme - Nuevo tema
   */
  notifyThemeChange(newTheme: string): void {
    this.plugins.forEach((plugin) => {
      try {
        plugin.onThemeChange?.(newTheme, this.context);
      } catch (error) {
        this.log(
          `Error notifying theme change to plugin "${plugin.name}": ${error}`,
          "error"
        );
      }
    });
    this.emitEvent({ type: "THEME_CHANGED", theme: newTheme });
  }

  /**
   * Notifica cambio de ruta a todos los plugins
   * @param newRoute - Nueva ruta
   */
  notifyRouteChange(newRoute: string): void {
    this.plugins.forEach((plugin) => {
      try {
        plugin.onRouteChange?.(newRoute, this.context);
      } catch (error) {
        this.log(
          `Error notifying route change to plugin "${plugin.name}": ${error}`,
          "error"
        );
      }
    });
    this.emitEvent({ type: "ROUTE_CHANGED", route: newRoute });
  }

  // ============================================================================
  // RENDERING
  // ============================================================================

  /**
   * Renderiza todos los plugins activos
   * @returns Array de elementos React
   */
  renderPlugins(): React.ReactNode[] {
    const activePlugins = this.getActivePlugins();

    return activePlugins.map((plugin) => {
      try {
        const pluginElement = plugin.render(this.context);

        // Wrap cada plugin en un Error Boundary
        return React.createElement(
          PluginErrorBoundary,
          {
            key: `plugin-${plugin.name}`,
            pluginName: plugin.name,
            onError: (error: Error) => {
              this.emitEvent({ type: "PLUGIN_ERROR", plugin, error });
            },
          },
          pluginElement
        );
      } catch (error) {
        this.log(`Error rendering plugin "${plugin.name}": ${error}`, "error");
        this.emitEvent({ type: "PLUGIN_ERROR", plugin, error: error as Error });
        return null;
      }
    });
  }

  // ============================================================================
  // STATS & MONITORING
  // ============================================================================

  /**
   * Obtiene estadísticas del sistema de plugins
   * @returns Estadísticas detalladas
   */
  getStats(): PluginStats {
    const activePlugins = this.getActivePlugins();

    return {
      totalPlugins: this.plugins.length,
      activePlugins: activePlugins.length,
      enabledPlugins: this.plugins.filter((p) => p.isEnabled()).length,
      pluginsByPriority: activePlugins.map((p) => ({
        name: p.name,
        priority: p.config.priority,
        position: p.config.position,
      })),
    };
  }

  /**
   * Limpia todos los plugins y listeners
   */
  cleanup(): void {
    this.log("Cleaning up PluginManager");

    // Desregistrar todos los plugins
    [...this.plugins].forEach((plugin) => {
      this.unregisterPlugin(plugin.name);
    });

    // Limpiar listeners
    this.eventListeners.clear();

    this.log("PluginManager cleanup completed");
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  /**
   * MÉTODO LOG IMPLEMENTADO - ESTO ERA LO QUE FALTABA
   * @param message - Mensaje
   * @param level - Nivel del log
   */
  private log(
    message: string,
    level: "info" | "warn" | "error" = "info"
  ): void {
    if (process.env.NODE_ENV === "development") {
      const prefix = "🔌 [PluginManager]";
      switch (level) {
        case "info":
          console.log(`${prefix} ${message}`);
          break;
        case "warn":
          console.warn(`${prefix} ${message}`);
          break;
        case "error":
          console.error(`${prefix} ${message}`);
          break;
      }
    }
  }
}

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

interface PluginErrorBoundaryProps {
  children: React.ReactNode;
  pluginName: string;
  onError?: (error: Error) => void;
}

class PluginErrorBoundary extends React.Component<
  PluginErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: PluginErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `🔌 Plugin "${this.props.pluginName}" crashed:`,
      error,
      errorInfo
    );
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement(
        "div",
        {
          className:
            "fixed top-4 right-4 p-3 bg-red-900/90 text-red-200 rounded-lg text-xs border border-red-500/50 z-[9999]",
        },
        React.createElement(
          "div",
          { className: "font-bold text-red-300" },
          "Plugin Error"
        ),
        React.createElement(
          "div",
          { className: "text-red-400" },
          `${this.props.pluginName} failed to load`
        ),
        React.createElement(
          "div",
          { className: "text-red-500 text-xs mt-1" },
          this.state.error?.message
        )
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// EXPORT (CORREGIDO)
// ============================================================================

export default PluginManager;
