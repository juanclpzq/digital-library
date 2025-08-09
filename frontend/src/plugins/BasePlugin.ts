// ============================================================================
// BASE PLUGIN CLASS - FOUNDATION FOR ALL PLUGINS
// FILE LOCATION: src/plugins/BasePlugin.ts
// ============================================================================

import React from "react";

// ============================================================================
// PLUGIN CONTEXT INTERFACE
// ============================================================================

export interface PluginContext {
  theme: {
    variant: "softclub" | "glass-heavy";
    isGlassMode: boolean;
    glassIntensity: "whisper" | "light" | "medium" | "heavy" | "extreme";
    toggleTheme: () => void;
    setGlassIntensity: (intensity: any) => void;
  };
  user: {
    id?: string;
    email?: string;
    isAuthenticated: boolean;
  } | null;
  router: {
    currentPath: string;
    navigate?: (path: string) => void;
  } | null;
  app: {
    version: string;
    environment: string;
  };
}

// ============================================================================
// PLUGIN CONFIG INTERFACE
// ============================================================================

export interface PluginConfig {
  enabled: boolean;
  priority: number;
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "floating";
  conditions?: {
    development?: boolean;
    production?: boolean;
    authenticated?: boolean;
    theme?: string[];
  };
}

// ============================================================================
// BASE PLUGIN ABSTRACT CLASS
// ============================================================================

export abstract class BasePlugin {
  // Metadata requerida
  abstract name: string;
  abstract version: string;
  abstract description: string;

  // Configuración por defecto
  config: PluginConfig = {
    enabled: true,
    priority: 0,
    position: "top-right",
  };

  // ============================================================================
  // MÉTODOS ABSTRACTOS (DEBEN SER IMPLEMENTADOS)
  // ============================================================================

  /**
   * Determina si el plugin debe renderizarse
   * @param context - Contexto actual de la aplicación
   * @returns boolean - true si debe renderizarse
   */
  abstract shouldRender(context: PluginContext): boolean;

  /**
   * Renderiza el contenido del plugin
   * @param context - Contexto actual de la aplicación
   * @returns React.ReactNode - Elemento a renderizar
   */
  abstract render(context: PluginContext): React.ReactNode;

  // ============================================================================
  // HOOKS OPCIONALES DEL CICLO DE VIDA
  // ============================================================================

  /**
   * Se ejecuta cuando el plugin se monta
   * @param context - Contexto de la aplicación
   */
  onMount?(context: PluginContext): void;

  /**
   * Se ejecuta cuando el plugin se desmonta
   * @param context - Contexto de la aplicación
   */
  onUnmount?(context: PluginContext): void;

  /**
   * Se ejecuta cuando cambia el tema
   * @param newTheme - Nuevo tema activado
   * @param context - Contexto de la aplicación
   */
  onThemeChange?(newTheme: string, context: PluginContext): void;

  /**
   * Se ejecuta cuando cambia la ruta
   * @param newRoute - Nueva ruta
   * @param context - Contexto de la aplicación
   */
  onRouteChange?(newRoute: string, context: PluginContext): void;

  // ============================================================================
  // MÉTODOS DE UTILIDAD
  // ============================================================================

  /**
   * Verifica si el plugin está habilitado
   * @returns boolean
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Habilita el plugin
   */
  enable(): void {
    this.config.enabled = true;
  }

  /**
   * Deshabilita el plugin
   */
  disable(): void {
    this.config.enabled = false;
  }

  /**
   * Actualiza la configuración del plugin
   * @param newConfig - Nueva configuración
   */
  updateConfig(newConfig: Partial<PluginConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Obtiene información del plugin
   * @returns Metadata del plugin
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      description: this.description,
      enabled: this.config.enabled,
      priority: this.config.priority,
      position: this.config.position,
    };
  }

  /**
   * Valida las condiciones del plugin
   * @param context - Contexto de la aplicación
   * @returns boolean - true si las condiciones se cumplen
   */
  protected validateConditions(context: PluginContext): boolean {
    const conditions = this.config.conditions;
    if (!conditions) return true;

    // Verificar entorno
    if (conditions.development !== undefined) {
      const isDev = process.env.NODE_ENV === "development";
      if (conditions.development !== isDev) return false;
    }

    if (conditions.production !== undefined) {
      const isProd = process.env.NODE_ENV === "production";
      if (conditions.production !== isProd) return false;
    }

    // Verificar autenticación
    if (conditions.authenticated !== undefined) {
      const isAuth = context.user?.isAuthenticated || false;
      if (conditions.authenticated !== isAuth) return false;
    }

    // Verificar tema
    if (conditions.theme && conditions.theme.length > 0) {
      if (!conditions.theme.includes(context.theme.variant)) return false;
    }

    return true;
  }

  /**
   * Log de actividad del plugin
   * @param message - Mensaje a loggear
   * @param level - Nivel del log
   */
  protected log(
    message: string,
    level: "info" | "warn" | "error" = "info"
  ): void {
    if (process.env.NODE_ENV === "development") {
      const prefix = `🔌 [${this.name}]`;
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
// PLUGIN REGISTRY TYPE
// ============================================================================

export type PluginRegistry = {
  [key: string]: BasePlugin;
};

// ============================================================================
// PLUGIN EVENT TYPES
// ============================================================================

export type PluginEvent =
  | { type: "PLUGIN_MOUNTED"; plugin: BasePlugin }
  | { type: "PLUGIN_UNMOUNTED"; plugin: BasePlugin }
  | { type: "PLUGIN_ERROR"; plugin: BasePlugin; error: Error }
  | { type: "THEME_CHANGED"; theme: string }
  | { type: "ROUTE_CHANGED"; route: string };

// ============================================================================
// EXPORTS
// ============================================================================

export default BasePlugin;
