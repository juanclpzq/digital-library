// ============================================================================
// PLUGIN PROVIDER - REACT COMPONENT FOR PLUGIN SYSTEM (FIXED)
// FILE LOCATION: src/plugins/PluginProvider.tsx
// ============================================================================

import React, { useEffect, useState, useContext, createContext } from "react";
import { BasePlugin, PluginContext } from "./BasePlugin";
import PluginManager from "./PluginManager";

// ============================================================================
// PLUGIN PROVIDER CONTEXT
// ============================================================================

interface PluginProviderContextType {
  manager: PluginManager;
  registerPlugin: (plugin: BasePlugin) => void;
  unregisterPlugin: (name: string) => void;
  getActivePlugins: () => BasePlugin[];
  enablePlugin: (name: string) => void;
  disablePlugin: (name: string) => void;
  stats: {
    totalPlugins: number;
    activePlugins: number;
    enabledPlugins: number;
  };
}

const PluginProviderContext = createContext<PluginProviderContextType | null>(
  null
);

// ============================================================================
// PLUGIN PROVIDER PROPS
// ============================================================================

interface PluginProviderProps {
  children: React.ReactNode;
  context: PluginContext;
  plugins?: BasePlugin[];
  enabledByDefault?: boolean;
  autoCleanup?: boolean;
}

// ============================================================================
// PLUGIN PROVIDER COMPONENT
// ============================================================================

export const PluginProvider: React.FC<PluginProviderProps> = ({
  children,
  context,
  plugins = [],
  enabledByDefault = true,
  autoCleanup = true,
}) => {
  const [pluginManager] = useState(() => new PluginManager(context));
  const [stats, setStats] = useState({
    totalPlugins: 0,
    activePlugins: 0,
    enabledPlugins: 0,
  });

  // ============================================================================
  // PLUGIN REGISTRATION & CLEANUP
  // ============================================================================

  useEffect(() => {
    console.log(
      "🔌 PluginProvider: Initializing with",
      plugins.length,
      "plugins"
    );

    // Registrar plugins iniciales
    plugins.forEach((plugin) => {
      if (!enabledByDefault) {
        plugin.disable();
      }
      pluginManager.registerPlugin(plugin);
    });

    // Actualizar stats
    setStats(pluginManager.getStats());

    // Cleanup al desmontar
    return () => {
      if (autoCleanup) {
        console.log("🔌 PluginProvider: Cleaning up plugins");
        pluginManager.cleanup();
      }
    };
  }, [pluginManager, plugins, enabledByDefault, autoCleanup]);

  // ============================================================================
  // CONTEXT UPDATES
  // ============================================================================

  useEffect(() => {
    pluginManager.updateContext(context);
  }, [context, pluginManager]);

  // ============================================================================
  // THEME CHANGE NOTIFICATIONS
  // ============================================================================

  useEffect(() => {
    if (context.theme?.variant) {
      pluginManager.notifyThemeChange(context.theme.variant);
    }
  }, [context.theme?.variant, pluginManager]);

  // ============================================================================
  // ROUTE CHANGE NOTIFICATIONS
  // ============================================================================

  useEffect(() => {
    if (context.router?.currentPath) {
      pluginManager.notifyRouteChange(context.router.currentPath);
    }
  }, [context.router?.currentPath, pluginManager]);

  // ============================================================================
  // PLUGIN MANAGEMENT FUNCTIONS
  // ============================================================================

  const registerPlugin = (plugin: BasePlugin) => {
    pluginManager.registerPlugin(plugin);
    setStats(pluginManager.getStats());
  };

  const unregisterPlugin = (name: string) => {
    pluginManager.unregisterPlugin(name);
    setStats(pluginManager.getStats());
  };

  const getActivePlugins = () => {
    return pluginManager.getActivePlugins();
  };

  const enablePlugin = (name: string) => {
    pluginManager.enablePlugin(name);
    setStats(pluginManager.getStats());
  };

  const disablePlugin = (name: string) => {
    pluginManager.disablePlugin(name);
    setStats(pluginManager.getStats());
  };

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue: PluginProviderContextType = {
    manager: pluginManager,
    registerPlugin,
    unregisterPlugin,
    getActivePlugins,
    enablePlugin,
    disablePlugin,
    stats,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return React.createElement(
    PluginProviderContext.Provider,
    { value: contextValue },
    children,
    pluginManager.renderPlugins()
  );
};

// ============================================================================
// PLUGIN HOOK
// ============================================================================

/**
 * Hook para acceder al sistema de plugins
 * @returns Contexto del plugin provider
 */
export const usePlugins = (): PluginProviderContextType => {
  const context = useContext(PluginProviderContext);

  if (!context) {
    throw new Error(
      "usePlugins must be used within a PluginProvider. " +
        "Wrap your app with <PluginProvider>."
    );
  }

  return context;
};

// ============================================================================
// PLUGIN REGISTRY COMPONENT
// ============================================================================

interface PluginRegistryProps {
  plugins: BasePlugin[];
  autoRegister?: boolean;
}

/**
 * Componente para registrar plugins dinámicamente
 */
export const PluginRegistry: React.FC<PluginRegistryProps> = ({
  plugins,
  autoRegister = true,
}) => {
  const { registerPlugin } = usePlugins();

  useEffect(() => {
    if (autoRegister) {
      plugins.forEach((plugin) => {
        registerPlugin(plugin);
      });
    }
  }, [plugins, autoRegister, registerPlugin]);

  return null;
};

// ============================================================================
// PLUGIN DEBUGGER COMPONENT
// ============================================================================

export const PluginDebugger: React.FC = () => {
  const { stats, getActivePlugins, enablePlugin, disablePlugin } = usePlugins();
  const [showDebugger, setShowDebugger] = useState(false);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const activePlugins = getActivePlugins();

  const toggleButton = React.createElement(
    "button",
    {
      onClick: () => setShowDebugger(!showDebugger),
      className:
        "fixed bottom-4 right-4 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-mono z-[9998]",
      title: "Plugin Debugger",
    },
    `🔌 ${stats.activePlugins}`
  );

  if (!showDebugger) {
    return toggleButton;
  }

  const debuggerPanel = React.createElement(
    "div",
    {
      className:
        "fixed bottom-16 right-4 p-4 bg-gray-900/95 backdrop-blur-sm text-white rounded-lg text-xs border border-gray-700 z-[9999] max-w-xs",
    },
    React.createElement(
      "div",
      { className: "flex justify-between items-center mb-2" },
      React.createElement(
        "span",
        { className: "font-bold text-purple-300" },
        "Plugin Debugger"
      ),
      React.createElement(
        "button",
        {
          onClick: () => setShowDebugger(false),
          className: "text-gray-400 hover:text-white",
        },
        "×"
      )
    ),
    React.createElement(
      "div",
      { className: "space-y-1 mb-3" },
      React.createElement(
        "div",
        null,
        `Total: ${stats.totalPlugins} | Active: ${stats.activePlugins}`
      ),
      React.createElement("div", null, `Enabled: ${stats.enabledPlugins}`)
    ),
    React.createElement(
      "div",
      { className: "space-y-1" },
      React.createElement(
        "div",
        { className: "font-bold text-green-300 mb-1" },
        "Active Plugins:"
      ),
      ...activePlugins.map((plugin) =>
        React.createElement(
          "div",
          {
            key: plugin.name,
            className: "flex justify-between items-center text-xs",
          },
          React.createElement(
            "span",
            { className: "text-blue-300" },
            `${plugin.name} (${plugin.config.priority})`
          ),
          React.createElement(
            "button",
            {
              onClick: () => disablePlugin(plugin.name),
              className:
                "px-1 py-0.5 bg-red-600 hover:bg-red-700 rounded text-white",
            },
            "Stop"
          )
        )
      )
    )
  );

  return React.createElement(React.Fragment, null, toggleButton, debuggerPanel);
};
