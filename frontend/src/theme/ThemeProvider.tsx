import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  ThemeVariant,
  GlassIntensity,
  SoftclubTheme,
  GlassHeavyTheme,
  softclubTheme,
  glassHeavyTheme,
} from "./constants";

// ============================================================================
// THEME CONTEXT INTERFACE
// ============================================================================

export interface ThemeContextType {
  // Core Theme State
  variant: ThemeVariant;
  setVariant: (variant: ThemeVariant) => void;

  // Glass-Specific Controls
  glassIntensity: GlassIntensity;
  setGlassIntensity: (intensity: GlassIntensity) => void;

  // Theme Objects
  currentTheme: SoftclubTheme | GlassHeavyTheme;
  softclub: SoftclubTheme;
  glassHeavy: GlassHeavyTheme;

  // Utility Helpers
  isGlassMode: boolean;
  isSoftclubMode: boolean;

  // Theme Actions
  toggleTheme: () => void;
  resetToDefault: () => void;

  // Persistence State
  isLoading: boolean;
}

// ============================================================================
// THEME CONTEXT CREATION
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// THEME PROVIDER PROPS
// ============================================================================

export interface ThemeProviderProps {
  children: ReactNode;
  defaultVariant?: ThemeVariant;
  defaultGlassIntensity?: GlassIntensity;
  enablePersistence?: boolean;
  _storageKey?: string; // Prefijo para indicar uso futuro
}

// ============================================================================
// THEME PROVIDER COMPONENT
// ============================================================================

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultVariant = "softclub",
  defaultGlassIntensity = "medium",
  enablePersistence = true,
  _storageKey = "digital-library-theme", // Prefijo para uso futuro
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [variant, setVariant] = useState<ThemeVariant>(defaultVariant);
  const [glassIntensity, setGlassIntensity] = useState<GlassIntensity>(
    defaultGlassIntensity
  );
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // PERSISTENCE LOGIC
  // ============================================================================

  useEffect(() => {
    if (enablePersistence) {
      setIsLoading(true);
      try {
        const savedTheme = localStorage.getItem("theme-variant");
        const savedIntensity = localStorage.getItem("glass-intensity");

        if (
          savedTheme &&
          (savedTheme === "softclub" || savedTheme === "glass-heavy")
        ) {
          setVariant(savedTheme as ThemeVariant);
        }

        if (savedIntensity) {
          const validIntensities = [
            "whisper",
            "light",
            "medium",
            "heavy",
            "extreme",
          ];
          if (validIntensities.includes(savedIntensity)) {
            setGlassIntensity(savedIntensity as GlassIntensity);
          }
        }
      } catch (error) {
        console.warn("Failed to load theme from localStorage:", error);
      }
      setIsLoading(false);
    }
  }, [enablePersistence]);

  useEffect(() => {
    if (enablePersistence) {
      try {
        localStorage.setItem("theme-variant", variant);
        localStorage.setItem("glass-intensity", glassIntensity);
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
    }
  }, [variant, glassIntensity, enablePersistence]);

  // ============================================================================
  // THEME ACTIONS
  // ============================================================================

  const toggleTheme = () => {
    setVariant(variant === "softclub" ? "glass-heavy" : "softclub");
  };

  const resetToDefault = () => {
    setVariant(defaultVariant);
    setGlassIntensity(defaultGlassIntensity);
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const isGlassMode = variant === "glass-heavy";
  const isSoftclubMode = variant === "softclub";

  // Get current theme object with glass intensity applied
  const currentTheme = isGlassMode
    ? { ...glassHeavyTheme, currentIntensity: glassIntensity }
    : softclubTheme;

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue: ThemeContextType = {
    // Core State
    variant,
    setVariant,
    glassIntensity,
    setGlassIntensity,

    // Theme Objects
    currentTheme,
    softclub: softclubTheme,
    glassHeavy: glassHeavyTheme,

    // Utilities
    isGlassMode,
    isSoftclubMode,

    // Actions
    toggleTheme,
    resetToDefault,

    // State
    isLoading,
  };

  // ============================================================================
  // RENDER WITH LOADING STATE
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        className={`theme-container theme-${variant} glass-${glassIntensity}`}
        data-theme={variant}
        data-glass-intensity={glassIntensity}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// ============================================================================
// THEME HOOK
// ============================================================================

/**
 * Hook to access theme context
 * @returns ThemeContextType
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "useTheme must be used within a ThemeProvider. " +
        "Wrap your app or component tree with <ThemeProvider>."
    );
  }

  return context;
};
