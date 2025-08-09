// ============================================================================
// THEME DEBUG TOGGLE - PARA DIAGNOSTICAR PROBLEMAS DE TEMA
// FILE LOCATION: src/components/debug/ThemeDebugToggle.tsx
// ============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";

// ============================================================================
// THEME DEBUG COMPONENT
// ============================================================================

export const ThemeDebugToggle: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);

  // Safely try to get theme context
  let themeData: any = null;
  let hasThemeProvider = true;

  try {
    themeData = useTheme();
  } catch (error) {
    hasThemeProvider = false;
    console.error("❌ ThemeProvider not found:", error.message);
  }

  // ============================================================================
  // DEBUGGING INFO
  // ============================================================================

  const debugInfo = {
    hasProvider: hasThemeProvider,
    variant: themeData?.variant || "N/A",
    isGlassMode: themeData?.isGlassMode || false,
    glassIntensity: themeData?.glassIntensity || "N/A",
    isLoading: themeData?.isLoading || false,
    contextValue: themeData ? "✅ Available" : "❌ Missing",
    localStorage: {
      variant:
        localStorage.getItem("digital-library-theme-variant") || "Not set",
      intensity:
        localStorage.getItem("digital-library-glass-intensity") || "Not set",
    },
  };

  // ============================================================================
  // RENDER DEBUG UI
  // ============================================================================

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Debug Toggle Button */}
      <motion.button
        onClick={() => setShowDebug(!showDebug)}
        className={`
          p-3 rounded-full text-sm font-mono font-bold transition-all duration-300
          ${
            hasThemeProvider
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white animate-pulse"
          }
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {hasThemeProvider ? "🎨" : "⚠️"} DEBUG
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {showDebug && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="mt-3 p-4 bg-gray-900 text-green-400 rounded-lg shadow-2xl max-w-sm font-mono text-xs"
          >
            <div className="space-y-2">
              <div className="text-white font-bold border-b border-gray-700 pb-1">
                🔍 THEME DEBUG INFO
              </div>

              <div>
                <span className="text-yellow-400">Provider:</span>{" "}
                <span
                  className={
                    hasThemeProvider ? "text-green-400" : "text-red-400"
                  }
                >
                  {debugInfo.hasProvider ? "✅ Connected" : "❌ Missing"}
                </span>
              </div>

              <div>
                <span className="text-yellow-400">Variant:</span>{" "}
                <span className="text-cyan-400">{debugInfo.variant}</span>
              </div>

              <div>
                <span className="text-yellow-400">Glass Mode:</span>{" "}
                <span
                  className={
                    debugInfo.isGlassMode ? "text-green-400" : "text-gray-400"
                  }
                >
                  {debugInfo.isGlassMode ? "✅ Active" : "❌ Inactive"}
                </span>
              </div>

              <div>
                <span className="text-yellow-400">Intensity:</span>{" "}
                <span className="text-purple-400">
                  {debugInfo.glassIntensity}
                </span>
              </div>

              <div>
                <span className="text-yellow-400">Loading:</span>{" "}
                <span
                  className={
                    debugInfo.isLoading ? "text-yellow-400" : "text-green-400"
                  }
                >
                  {debugInfo.isLoading ? "⏳ Loading" : "✅ Ready"}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-2">
                <div className="text-white text-xs mb-1">LocalStorage:</div>
                <div>
                  <span className="text-yellow-400">Variant:</span>{" "}
                  <span className="text-blue-400">
                    {debugInfo.localStorage.variant}
                  </span>
                </div>
                <div>
                  <span className="text-yellow-400">Intensity:</span>{" "}
                  <span className="text-blue-400">
                    {debugInfo.localStorage.intensity}
                  </span>
                </div>
              </div>

              {/* Theme Actions (only if provider available) */}
              {hasThemeProvider && (
                <div className="border-t border-gray-700 pt-2 space-y-1">
                  <div className="text-white text-xs mb-1">Quick Actions:</div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => themeData?.toggleTheme?.()}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                    >
                      Toggle Theme
                    </button>
                    <button
                      onClick={() => themeData?.resetToDefault?.()}
                      className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs"
                    >
                      Reset
                    </button>
                  </div>

                  {themeData?.isGlassMode && (
                    <div className="flex gap-1 flex-wrap">
                      {["whisper", "light", "medium", "heavy", "extreme"].map(
                        (intensity) => (
                          <button
                            key={intensity}
                            onClick={() =>
                              themeData?.setGlassIntensity?.(intensity)
                            }
                            className={`px-1 py-0.5 rounded text-xs ${
                              themeData?.glassIntensity === intensity
                                ? "bg-purple-600 text-white"
                                : "bg-gray-600 hover:bg-gray-500 text-gray-300"
                            }`}
                          >
                            {intensity}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Error Help */}
              {!hasThemeProvider && (
                <div className="border-t border-red-700 pt-2">
                  <div className="text-red-400 text-xs">
                    ⚠️ <strong>Fix:</strong> Wrap your app with:
                  </div>
                  <div className="text-gray-300 text-xs mt-1 p-1 bg-gray-800 rounded">
                    &lt;ThemeProvider&gt;
                    <br />
                    &nbsp;&nbsp;&lt;App /&gt;
                    <br />
                    &lt;/ThemeProvider&gt;
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// THEME CONTEXT VALIDATOR
// ============================================================================

export const validateThemeSetup = () => {
  try {
    const theme = useTheme();

    const checks = {
      hasContext: !!theme,
      hasVariant: !!theme?.variant,
      hasToggle: typeof theme?.toggleTheme === "function",
      hasGlassIntensity: !!theme?.glassIntensity,
      hasThemeObjects: !!(theme?.softclub && theme?.glassHeavy),
    };

    const allChecksPass = Object.values(checks).every(Boolean);

    console.log("🎨 Theme Setup Validation:", {
      ...checks,
      overall: allChecksPass ? "✅ PASS" : "❌ FAIL",
    });

    return { valid: allChecksPass, checks };
  } catch (error) {
    console.error("❌ Theme validation failed:", error);
    return { valid: false, error: error.message };
  }
};

// ============================================================================
// USAGE INSTRUCTIONS
// ============================================================================

/*
// Para usar este componente de debug, simplemente agrégalo a tu App.tsx:

import { ThemeDebugToggle } from '@/components/debug/ThemeDebugToggle';

function App() {
  return (
    <div>
      {process.env.NODE_ENV === 'development' && <ThemeDebugToggle />}
      <YourAppContent />
    </div>
  );
}

// O puedes llamar la validación programáticamente:
import { validateThemeSetup } from '@/components/debug/ThemeDebugToggle';

// En cualquier componente
useEffect(() => {
  validateThemeSetup();
}, []);
*/
