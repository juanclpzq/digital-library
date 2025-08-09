// ============================================================================
// THEME DEBUG PLUGIN - DEBUG PANEL FOR ADAPTIVE THEMES (FIXED)
// FILE LOCATION: src/plugins/ThemeDebugPlugin.ts
// ============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BasePlugin, type PluginContext } from "./BasePlugin";

// ============================================================================
// GLASS INTENSITY OPTIONS TYPE
// ============================================================================

interface GlassIntensityOption {
  key: "whisper" | "light" | "medium" | "heavy" | "extreme";
  label: string;
  icon: string;
}

// ============================================================================
// THEME DEBUG PLUGIN CLASS
// ============================================================================

export class ThemeDebugPlugin extends BasePlugin {
  name = "theme-debug";
  version = "1.0.0";
  description = "Debug panel para temas adaptativos con controles interactivos";

  config = {
    enabled: true,
    priority: 10,
    position: "top-left" as const,
    conditions: {
      development: true,
      production: false,
    },
  };

  // ============================================================================
  // LIFECYCLE METHODS
  // ============================================================================

  shouldRender(context: PluginContext): boolean {
    if (process.env.NODE_ENV !== "development") {
      this.log("Skipping render - not in development mode");
      return false;
    }

    if (!context.theme) {
      this.log("Skipping render - no theme context available", "warn");
      return false;
    }

    return this.validateConditions(context);
  }

  onMount(context: PluginContext): void {
    this.log(`Mounted with theme: ${context.theme?.variant}`);
  }

  onUnmount(context: PluginContext): void {
    this.log("Unmounted");
  }

  onThemeChange(newTheme: string, context: PluginContext): void {
    this.log(`Theme changed to: ${newTheme}`);
  }

  // ============================================================================
  // RENDER METHOD - USANDO React.createElement
  // ============================================================================

  render(context: PluginContext): React.ReactNode {
    const { theme } = context;

    // Crear componente funcional usando createElement
    const ThemeDebugComponent = () => {
      const [isExpanded, setIsExpanded] = useState(false);
      const [showControls, setShowControls] = useState(true);

      // Glass intensity options
      const glassIntensities: GlassIntensityOption[] = [
        { key: "whisper", label: "Whisper", icon: "👻" },
        { key: "light", label: "Light", icon: "🌙" },
        { key: "medium", label: "Medium", icon: "💫" },
        { key: "heavy", label: "Heavy", icon: "🔮" },
        { key: "extreme", label: "Extreme", icon: "💎" },
      ];

      // Theme-aware styles
      const getStyles = () => {
        if (theme.isGlassMode) {
          return {
            container:
              "bg-black/80 backdrop-blur-xl text-white border border-white/30",
            button:
              "bg-white/20 hover:bg-white/30 text-white border border-white/20",
            text: {
              primary: "text-white",
              secondary: "text-white/80",
              accent: "text-cyan-400",
            },
          };
        }

        return {
          container:
            "bg-white/95 backdrop-blur-sm text-gray-800 border border-gray-300 shadow-lg",
          button:
            "bg-blue-500 hover:bg-blue-600 text-white border border-blue-400",
          text: {
            primary: "text-gray-800",
            secondary: "text-gray-600",
            accent: "text-blue-600",
          },
        };
      };

      const styles = getStyles();

      // Main container
      return React.createElement(
        motion.div,
        {
          className: "fixed top-4 left-4 z-[9999]",
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.3 },
        },
        React.createElement(
          "div",
          { className: `rounded-lg overflow-hidden ${styles.container}` },
          // Header
          React.createElement(
            "div",
            { className: "p-3 border-b border-current/20" },
            React.createElement(
              "div",
              { className: "flex items-center justify-between" },
              React.createElement(
                "div",
                { className: "flex items-center gap-2" },
                React.createElement("div", {
                  className: "w-2 h-2 bg-green-500 rounded-full animate-pulse",
                }),
                React.createElement(
                  "span",
                  { className: "font-bold text-xs font-mono" },
                  "THEME DEBUG"
                )
              ),
              React.createElement(
                "div",
                { className: "flex items-center gap-1" },
                React.createElement(
                  "button",
                  {
                    onClick: () => setShowControls(!showControls),
                    className: `p-1 rounded text-xs transition-all ${styles.button}`,
                    title: "Toggle Controls",
                  },
                  "⚙️"
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => setIsExpanded(!isExpanded),
                    className: `p-1 rounded text-xs transition-all ${styles.button}`,
                    title: "Toggle Expanded View",
                  },
                  isExpanded ? "📋" : "📊"
                )
              )
            )
          ),
          // Basic Info
          React.createElement(
            "div",
            { className: "p-3 space-y-2 text-xs font-mono" },
            React.createElement(
              "div",
              { className: "flex justify-between" },
              React.createElement(
                "span",
                { className: styles.text.secondary },
                "Variant:"
              ),
              React.createElement(
                "span",
                { className: styles.text.accent },
                theme.variant
              )
            ),
            React.createElement(
              "div",
              { className: "flex justify-between" },
              React.createElement(
                "span",
                { className: styles.text.secondary },
                "Glass Mode:"
              ),
              React.createElement(
                "span",
                {
                  className: theme.isGlassMode
                    ? "text-green-500"
                    : "text-gray-500",
                },
                theme.isGlassMode ? "ON" : "OFF"
              )
            ),
            theme.isGlassMode &&
              React.createElement(
                "div",
                { className: "flex justify-between" },
                React.createElement(
                  "span",
                  { className: styles.text.secondary },
                  "Intensity:"
                ),
                React.createElement(
                  "span",
                  { className: styles.text.accent },
                  theme.glassIntensity
                )
              )
          ),
          // Controls
          React.createElement(
            AnimatePresence,
            null,
            showControls &&
              React.createElement(
                motion.div,
                {
                  initial: { height: 0, opacity: 0 },
                  animate: { height: "auto", opacity: 1 },
                  exit: { height: 0, opacity: 0 },
                  className: "border-t border-current/20",
                },
                React.createElement(
                  "div",
                  { className: "p-3 space-y-2" },
                  // Theme Toggle
                  React.createElement(
                    "button",
                    {
                      onClick: () => theme.toggleTheme(),
                      className: `w-full px-3 py-2 rounded text-xs font-medium transition-all ${styles.button}`,
                    },
                    `Switch to ${theme.isGlassMode ? "Softclub" : "Glass Heavy"}`
                  ),
                  // Glass Intensity Controls
                  theme.isGlassMode &&
                    React.createElement(
                      "div",
                      { className: "space-y-2" },
                      React.createElement(
                        "div",
                        { className: `text-xs ${styles.text.secondary}` },
                        "Glass Intensity:"
                      ),
                      React.createElement(
                        "div",
                        { className: "grid grid-cols-5 gap-1" },
                        ...glassIntensities.map(
                          (intensity: GlassIntensityOption) =>
                            React.createElement(
                              "button",
                              {
                                key: intensity.key,
                                onClick: () =>
                                  theme.setGlassIntensity(intensity.key),
                                className: `
                            p-1 rounded text-xs transition-all border
                            ${
                              theme.glassIntensity === intensity.key
                                ? "bg-purple-600 text-white border-purple-500"
                                : "bg-gray-600/50 hover:bg-gray-500/50 text-gray-300 border-gray-500"
                            }
                          `,
                                title: intensity.label,
                              },
                              intensity.icon
                            )
                        )
                      )
                    )
                )
              )
          ),
          // Expanded Details
          React.createElement(
            AnimatePresence,
            null,
            isExpanded &&
              React.createElement(
                motion.div,
                {
                  initial: { height: 0, opacity: 0 },
                  animate: { height: "auto", opacity: 1 },
                  exit: { height: 0, opacity: 0 },
                  className: "border-t border-current/20",
                },
                React.createElement(
                  "div",
                  { className: "p-3 space-y-2" },
                  React.createElement(
                    "div",
                    {
                      className: `text-xs font-bold ${styles.text.primary} mb-2`,
                    },
                    "Theme Details:"
                  ),
                  React.createElement(
                    "div",
                    { className: "space-y-1 text-xs font-mono" },
                    React.createElement(
                      "div",
                      { className: "flex justify-between" },
                      React.createElement(
                        "span",
                        { className: styles.text.secondary },
                        "Context:"
                      ),
                      React.createElement(
                        "span",
                        { className: styles.text.accent },
                        "Available"
                      )
                    ),
                    React.createElement(
                      "div",
                      { className: "flex justify-between" },
                      React.createElement(
                        "span",
                        { className: styles.text.secondary },
                        "Provider:"
                      ),
                      React.createElement(
                        "span",
                        { className: "text-green-500" },
                        "Connected"
                      )
                    ),
                    React.createElement(
                      "div",
                      { className: "flex justify-between" },
                      React.createElement(
                        "span",
                        { className: styles.text.secondary },
                        "Persistence:"
                      ),
                      React.createElement(
                        "span",
                        { className: styles.text.accent },
                        "LocalStorage"
                      )
                    ),
                    // User info
                    React.createElement(
                      "div",
                      { className: "pt-2 border-t border-current/20" },
                      React.createElement(
                        "div",
                        { className: "flex justify-between" },
                        React.createElement(
                          "span",
                          { className: styles.text.secondary },
                          "User:"
                        ),
                        React.createElement(
                          "span",
                          {
                            className: context.user?.isAuthenticated
                              ? "text-green-500"
                              : "text-red-500",
                          },
                          context.user?.isAuthenticated ? "Auth" : "Guest"
                        )
                      )
                    ),
                    // Performance info
                    React.createElement(
                      "div",
                      { className: "pt-2 border-t border-current/20" },
                      React.createElement(
                        "div",
                        { className: "flex justify-between" },
                        React.createElement(
                          "span",
                          { className: styles.text.secondary },
                          "Plugin:"
                        ),
                        React.createElement(
                          "span",
                          { className: "text-green-500" },
                          "Active"
                        )
                      ),
                      React.createElement(
                        "div",
                        { className: "flex justify-between" },
                        React.createElement(
                          "span",
                          { className: styles.text.secondary },
                          "Version:"
                        ),
                        React.createElement(
                          "span",
                          { className: styles.text.accent },
                          this.version
                        )
                      )
                    )
                  )
                )
              )
          ),
          // Footer
          React.createElement(
            "div",
            {
              className: `px-3 py-1 text-xs ${styles.text.secondary} text-center border-t border-current/20`,
            },
            `v${this.version} • Development Mode`
          )
        )
      );
    };

    return React.createElement(ThemeDebugComponent);
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default ThemeDebugPlugin;
