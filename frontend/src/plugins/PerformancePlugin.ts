// ============================================================================
// PERFORMANCE PLUGIN - REAL-TIME PERFORMANCE MONITORING (FIXED)
// FILE LOCATION: src/plugins/PerformancePlugin.ts
// ============================================================================

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BasePlugin, type PluginContext } from "./BasePlugin";

// ============================================================================
// PERFORMANCE METRICS INTERFACE
// ============================================================================

interface PerformanceMetrics {
  fps: number;
  memory: number;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  componentCount: number;
}

// ============================================================================
// PERFORMANCE PLUGIN CLASS
// ============================================================================

export class PerformancePlugin extends BasePlugin {
  name = "performance-monitor";
  version = "1.0.0";
  description = "Monitor de rendimiento en tiempo real con métricas detalladas";

  private renderCount = 0;
  private renderTimes: number[] = [];
  private lastRender = Date.now();
  private rafId: number | null = null;
  private fpsFrames: number[] = [];

  config = {
    enabled: true,
    priority: 5,
    position: "top-right" as const,
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
      return false;
    }
    return this.validateConditions(context);
  }

  onMount(context: PluginContext): void {
    this.log("Performance monitoring started");
    this.startFPSCounter();
  }

  onUnmount(context: PluginContext): void {
    this.log("Performance monitoring stopped");
    this.stopFPSCounter();
    this.renderTimes = [];
    this.renderCount = 0;
    this.fpsFrames = [];
  }

  // ============================================================================
  // FPS MONITORING
  // ============================================================================

  private startFPSCounter(): void {
    let lastTime = performance.now();
    const fpsCallback = (currentTime: number) => {
      const delta = currentTime - lastTime;
      const fps = 1000 / delta;

      this.fpsFrames.push(fps);
      if (this.fpsFrames.length > 60) {
        this.fpsFrames.shift();
      }

      lastTime = currentTime;
      this.rafId = requestAnimationFrame(fpsCallback);
    };

    this.rafId = requestAnimationFrame(fpsCallback);
  }

  private stopFPSCounter(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // ============================================================================
  // METRICS CALCULATION
  // ============================================================================

  private getMetrics(): PerformanceMetrics {
    const now = Date.now();
    const renderTime = now - this.lastRender;

    this.renderTimes.push(renderTime);
    if (this.renderTimes.length > 100) {
      this.renderTimes.shift();
    }

    this.renderCount++;
    this.lastRender = now;

    const averageRenderTime =
      this.renderTimes.length > 0
        ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
        : 0;

    const averageFPS =
      this.fpsFrames.length > 0
        ? this.fpsFrames.reduce((a, b) => a + b, 0) / this.fpsFrames.length
        : 0;

    // Memoria aproximada (solo disponible en algunos navegadores)
    const memory = (performance as any).memory?.usedJSHeapSize || 0;

    // Conteo aproximado de componentes React
    const componentCount = document.querySelectorAll(
      "[data-reactroot], [data-react-component]"
    ).length;

    return {
      fps: Math.round(averageFPS),
      memory: Math.round(memory / 1024 / 1024), // MB
      renderCount: this.renderCount,
      lastRenderTime: renderTime,
      averageRenderTime: Math.round(averageRenderTime * 100) / 100,
      componentCount,
    };
  }

  // ============================================================================
  // PERFORMANCE STATUS
  // ============================================================================

  private getPerformanceStatus(metrics: PerformanceMetrics): {
    color: string;
    status: string;
    severity: "good" | "warning" | "critical";
  } {
    if (metrics.fps >= 55 && metrics.averageRenderTime < 16) {
      return { color: "text-green-400", status: "Excellent", severity: "good" };
    } else if (metrics.fps >= 45 && metrics.averageRenderTime < 25) {
      return { color: "text-yellow-400", status: "Good", severity: "warning" };
    } else if (metrics.fps >= 30) {
      return { color: "text-orange-400", status: "Fair", severity: "warning" };
    } else {
      return { color: "text-red-400", status: "Poor", severity: "critical" };
    }
  }

  // ============================================================================
  // RENDER METHOD
  // ============================================================================

  render(context: PluginContext): React.ReactNode {
    const PerformanceMonitor: React.FC = () => {
      const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
      const [isCollapsed, setIsCollapsed] = useState(false);
      const intervalRef = useRef<NodeJS.Timeout | null>(null);

      useEffect(() => {
        // Actualizar métricas cada 500ms
        intervalRef.current = setInterval(() => {
          setMetrics(this.getMetrics());
        }, 500);

        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      }, []);

      if (!metrics) {
        return React.createElement(
          "div",
          {
            className:
              "fixed top-4 right-4 p-2 bg-gray-900/90 backdrop-blur-sm text-white rounded-lg text-xs z-[9997]",
          },
          "⏱️ Loading..."
        );
      }

      const perfStatus = this.getPerformanceStatus(metrics);

      // Versión colapsada (solo icono y FPS)
      if (isCollapsed) {
        return React.createElement(
          "div",
          {
            className: `fixed top-4 right-4 p-2 bg-gray-900/90 backdrop-blur-sm text-white rounded-lg text-xs cursor-pointer z-[9997] border border-gray-700 hover:border-gray-600 transition-colors`,
            onClick: () => setIsCollapsed(false),
            title: "Click to expand performance monitor",
          },
          React.createElement(
            "div",
            { className: "flex items-center space-x-2" },
            React.createElement("span", null, "⏱️"),
            React.createElement(
              "span",
              { className: perfStatus.color },
              `${metrics.fps} FPS`
            )
          )
        );
      }

      // Versión expandida (panel completo)
      return React.createElement(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          className:
            "fixed top-4 right-4 bg-gray-900/95 backdrop-blur-sm text-white rounded-lg text-xs border border-gray-700 z-[9997] min-w-[200px]",
        },
        // Header
        React.createElement(
          "div",
          {
            className:
              "flex justify-between items-center p-3 border-b border-gray-700 cursor-pointer",
            onClick: () => setIsCollapsed(true),
          },
          React.createElement(
            "div",
            { className: "flex items-center space-x-2" },
            React.createElement("span", null, "⏱️"),
            React.createElement(
              "span",
              { className: "font-bold text-blue-300" },
              "Performance"
            )
          ),
          React.createElement(
            "span",
            { className: "text-gray-400 hover:text-white transition-colors" },
            "−"
          )
        ),

        // Metrics Body
        React.createElement(
          "div",
          { className: "p-3 space-y-2" },

          // FPS & Status
          React.createElement(
            "div",
            { className: "flex justify-between items-center" },
            React.createElement("span", { className: "text-gray-300" }, "FPS:"),
            React.createElement(
              "span",
              { className: `font-bold ${perfStatus.color}` },
              `${metrics.fps} (${perfStatus.status})`
            )
          ),

          // Render Time
          React.createElement(
            "div",
            { className: "flex justify-between" },
            React.createElement(
              "span",
              { className: "text-gray-300" },
              "Render:"
            ),
            React.createElement(
              "span",
              { className: "text-cyan-300" },
              `${metrics.averageRenderTime}ms avg`
            )
          ),

          // Memory (if available)
          metrics.memory > 0 &&
            React.createElement(
              "div",
              { className: "flex justify-between" },
              React.createElement(
                "span",
                { className: "text-gray-300" },
                "Memory:"
              ),
              React.createElement(
                "span",
                { className: "text-purple-300" },
                `${metrics.memory}MB`
              )
            ),

          // Render Count
          React.createElement(
            "div",
            { className: "flex justify-between" },
            React.createElement(
              "span",
              { className: "text-gray-300" },
              "Renders:"
            ),
            React.createElement(
              "span",
              { className: "text-green-300" },
              metrics.renderCount.toString()
            )
          ),

          // Component Count
          React.createElement(
            "div",
            { className: "flex justify-between" },
            React.createElement(
              "span",
              { className: "text-gray-300" },
              "Components:"
            ),
            React.createElement(
              "span",
              { className: "text-yellow-300" },
              `~${metrics.componentCount}`
            )
          )
        ),

        // Footer
        React.createElement(
          "div",
          {
            className:
              "px-3 py-1 text-xs text-gray-400 text-center border-t border-gray-700",
          },
          `v${this.version} • Monitoring Active`
        )
      );
    };

    return React.createElement(PerformanceMonitor);
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default PerformancePlugin;
