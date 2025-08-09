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
  }

  // ============================================================================
  // PERFORMANCE TRACKING METHODS
  // ============================================================================

  private startFPSCounter(): void {
    let frames = 0;
    let lastTime = performance.now();

    const countFrames = () => {
      frames++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const renderTime = currentTime - this.lastRender;
        this.renderTimes.push(renderTime);

        if (this.renderTimes.length > 60) {
          this.renderTimes.shift();
        }

        lastTime = currentTime;
        frames = 0;
      }

      this.rafId = requestAnimationFrame(countFrames);
    };

    this.rafId = requestAnimationFrame(countFrames);
  }

  private stopFPSCounter(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private getPerformanceMetrics(): PerformanceMetrics {
    const now = Date.now();
    const timeSinceLastRender = now - this.lastRender;

    const averageRenderTime =
      this.renderTimes.length > 0
        ? this.renderTimes.reduce((sum, time) => sum + time, 0) /
          this.renderTimes.length
        : 0;

    const estimatedFPS =
      timeSinceLastRender > 0
        ? Math.min(Math.round(1000 / timeSinceLastRender), 60)
        : 0;

    let memoryUsage = 0;
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    }

    const componentCount = document.querySelectorAll(
      "[data-reactroot], [data-react-component]"
    ).length;

    return {
      fps: estimatedFPS,
      memory: memoryUsage,
      renderCount: this.renderCount,
      lastRenderTime: timeSinceLastRender,
      averageRenderTime: Math.round(averageRenderTime * 100) / 100,
      componentCount,
    };
  }

  // ============================================================================
  // RENDER METHOD - USANDO React.createElement
  // ============================================================================

  render(context: PluginContext): React.ReactNode {
    this.renderCount++;
    this.lastRender = Date.now();

    // Crear componente funcional usando createElement
    const PerformanceMonitor = () => {
      const [metrics, setMetrics] = useState<PerformanceMetrics>(
        this.getPerformanceMetrics()
      );
      const [isExpanded, setIsExpanded] = useState(false);
      const [autoRefresh, setAutoRefresh] = useState(true);
      const intervalRef = useRef<NodeJS.Timeout | null>(null);

      // Update metrics periodically
      useEffect(() => {
        if (autoRefresh) {
          intervalRef.current = setInterval(() => {
            setMetrics(this.getPerformanceMetrics());
          }, 1000);
        } else if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      }, [autoRefresh]);

      // Performance status colors
      const getStatusColor = (
        value: number,
        thresholds: { good: number; warning: number }
      ) => {
        if (value >= thresholds.good) return "text-green-400";
        if (value >= thresholds.warning) return "text-yellow-400";
        return "text-red-400";
      };

      const fpsColor = getStatusColor(metrics.fps, { good: 50, warning: 30 });
      const memoryColor =
        metrics.memory > 100
          ? "text-red-400"
          : metrics.memory > 50
            ? "text-yellow-400"
            : "text-green-400";

      // Main container
      return React.createElement(
        motion.div,
        {
          className: "fixed top-4 right-4 z-[9999]",
          initial: { opacity: 0, scale: 0.9, x: 20 },
          animate: { opacity: 1, scale: 1, x: 0 },
          transition: { duration: 0.3 },
        },
        React.createElement(
          "div",
          {
            className:
              "bg-black/90 backdrop-blur-xl text-green-400 border border-green-500/30 rounded-lg overflow-hidden font-mono",
          },
          // Header
          React.createElement(
            "div",
            { className: "p-3 border-b border-green-500/30" },
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
                  { className: "font-bold text-xs" },
                  "PERFORMANCE"
                )
              ),
              React.createElement(
                "div",
                { className: "flex items-center gap-1" },
                React.createElement(
                  "button",
                  {
                    onClick: () => setAutoRefresh(!autoRefresh),
                    className: `p-1 rounded text-xs transition-all ${
                      autoRefresh
                        ? "bg-green-600 text-white"
                        : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    }`,
                    title: autoRefresh
                      ? "Pause auto-refresh"
                      : "Start auto-refresh",
                  },
                  autoRefresh ? "⏸️" : "▶️"
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => setIsExpanded(!isExpanded),
                    className:
                      "p-1 rounded text-xs bg-green-600/50 hover:bg-green-600 text-white transition-all",
                    title: "Toggle detailed view",
                  },
                  isExpanded ? "📊" : "📈"
                )
              )
            )
          ),
          // Basic Metrics
          React.createElement(
            "div",
            { className: "p-3 space-y-2 text-xs" },
            React.createElement(
              "div",
              { className: "flex justify-between" },
              React.createElement(
                "span",
                { className: "text-green-300" },
                "FPS:"
              ),
              React.createElement(
                "span",
                { className: fpsColor },
                `~${metrics.fps}`
              )
            ),
            React.createElement(
              "div",
              { className: "flex justify-between" },
              React.createElement(
                "span",
                { className: "text-green-300" },
                "Renders:"
              ),
              React.createElement(
                "span",
                { className: "text-yellow-400" },
                metrics.renderCount.toString()
              )
            ),
            metrics.memory > 0 &&
              React.createElement(
                "div",
                { className: "flex justify-between" },
                React.createElement(
                  "span",
                  { className: "text-green-300" },
                  "Memory:"
                ),
                React.createElement(
                  "span",
                  { className: memoryColor },
                  `${metrics.memory}MB`
                )
              )
          ),
          // Detailed Metrics (Expandable)
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
                  className: "border-t border-green-500/30",
                },
                React.createElement(
                  "div",
                  { className: "p-3 space-y-2 text-xs" },
                  React.createElement(
                    "div",
                    { className: "text-green-200 font-bold mb-2" },
                    "Detailed Metrics:"
                  ),
                  React.createElement(
                    "div",
                    { className: "flex justify-between" },
                    React.createElement(
                      "span",
                      { className: "text-green-300" },
                      "Last Render:"
                    ),
                    React.createElement(
                      "span",
                      { className: "text-cyan-400" },
                      `${metrics.lastRenderTime}ms`
                    )
                  ),
                  React.createElement(
                    "div",
                    { className: "flex justify-between" },
                    React.createElement(
                      "span",
                      { className: "text-green-300" },
                      "Avg Render:"
                    ),
                    React.createElement(
                      "span",
                      { className: "text-cyan-400" },
                      `${metrics.averageRenderTime}ms`
                    )
                  ),
                  React.createElement(
                    "div",
                    { className: "flex justify-between" },
                    React.createElement(
                      "span",
                      { className: "text-green-300" },
                      "Components:"
                    ),
                    React.createElement(
                      "span",
                      { className: "text-purple-400" },
                      `~${metrics.componentCount}`
                    )
                  ),
                  // Status Section
                  React.createElement(
                    "div",
                    { className: "pt-2 border-t border-green-500/20" },
                    React.createElement(
                      "div",
                      { className: "text-green-200 font-bold mb-1" },
                      "Status:"
                    ),
                    React.createElement(
                      "div",
                      { className: "space-y-1" },
                      React.createElement(
                        "div",
                        { className: `text-xs ${fpsColor}` },
                        `• FPS: ${metrics.fps >= 50 ? "Excellent" : metrics.fps >= 30 ? "Good" : "Poor"}`
                      ),
                      React.createElement(
                        "div",
                        { className: `text-xs ${memoryColor}` },
                        `• Memory: ${metrics.memory <= 50 ? "Optimal" : metrics.memory <= 100 ? "Moderate" : "High"}`
                      ),
                      React.createElement(
                        "div",
                        {
                          className: `text-xs ${metrics.averageRenderTime <= 16 ? "text-green-400" : "text-yellow-400"}`,
                        },
                        `• Render: ${metrics.averageRenderTime <= 16 ? "Smooth" : "Slow"}`
                      )
                    )
                  ),
                  // Action Buttons
                  React.createElement(
                    "div",
                    { className: "pt-2 border-t border-green-500/20" },
                    React.createElement(
                      "button",
                      {
                        onClick: () => {
                          if ((window as any).gc) {
                            (window as any).gc();
                            this.log("Forced garbage collection");
                          } else {
                            this.log(
                              "Garbage collection not available",
                              "warn"
                            );
                          }
                        },
                        className:
                          "w-full p-1 bg-blue-600/50 hover:bg-blue-600 text-white rounded text-xs transition-all",
                        title: "Force garbage collection",
                      },
                      "🗑️ Force GC"
                    ),
                    React.createElement(
                      "button",
                      {
                        onClick: () => setMetrics(this.getPerformanceMetrics()),
                        className:
                          "w-full mt-1 p-1 bg-green-600/50 hover:bg-green-600 text-white rounded text-xs transition-all",
                        title: "Refresh metrics now",
                      },
                      "🔄 Refresh Now"
                    )
                  )
                )
              )
          ),
          // Footer
          React.createElement(
            "div",
            {
              className:
                "px-3 py-1 text-xs text-green-500/70 text-center border-t border-green-500/30",
            },
            `v${this.version} • ${autoRefresh ? "Live" : "Paused"} • ${metrics.renderCount} renders`
          )
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
