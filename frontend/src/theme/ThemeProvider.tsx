// ============================================================================
// THEME PROVIDER - SISTEMA DE CONTEXTO DUAL THEME SWITCHING
// FILE LOCATION: src/theme/ThemeProvider.tsx
// ============================================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ============================================================================
// THEME CONTEXT INTERFACES
// ============================================================================

export type ThemeVariant = "softclub" | "glass-heavy";
export type GlassIntensity =
  | "whisper"
  | "light"
  | "medium"
  | "heavy"
  | "extreme";

// Temporary theme definitions until we fix the imports
export interface SoftclubTheme {
  name: string;
  colors: Record<string, string>;
  motionPresets: Record<string, any>;
}

export interface GlassHeavyTheme {
  name: string;
  colors: Record<string, string>;
  levels: Record<GlassIntensity, any>;
  motionPresets: Record<string, any>;
}

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
// TEMPORARY THEME OBJECTS (until we fix imports)
// ============================================================================

const tempSoftclubTheme: SoftclubTheme = {
  name: "softclub",
  colors: {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    background: "#F8FAFC",
    text: "#1E293B",
  },
  motionPresets: {
    gentle: { duration: 0.3, ease: "easeOut" },
    bounce: { duration: 0.5, ease: [0.25, 0.25, 0, 1] },
  },
};

const tempGlassHeavyTheme: GlassHeavyTheme = {
  name: "glass-heavy",
  colors: {
    primary: "rgba(59, 130, 246, 0.8)",
    secondary: "rgba(139, 92, 246, 0.8)",
    background: "rgba(248, 250, 252, 0.1)",
    text: "rgba(30, 41, 59, 0.9)",
  },
  levels: {
    whisper: { backdrop: "backdrop-blur-[6px]", border: "border-white/20" },
    light: { backdrop: "backdrop-blur-[12px]", border: "border-white/25" },
    medium: { backdrop: "backdrop-blur-[20px]", border: "border-white/30" },
    heavy: { backdrop: "backdrop-blur-[32px]", border: "border-white/35" },
    extreme: { backdrop: "backdrop-blur-[48px]", border: "border-white/40" },
  },
  motionPresets: {
    glassFloat: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    shimmer: { duration: 0.4, ease: "easeOut" },
  },
};

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
  storageKey?: string;
}

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  THEME_VARIANT: "digital-library-theme-variant",
  GLASS_INTENSITY: "digital-library-glass-intensity",
} as const;

// ============================================================================
// THEME PROVIDER COMPONENT
// ============================================================================

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultVariant = "softclub",
  defaultGlassIntensity = "medium",
  enablePersistence = true,
  storageKey = "digital-library-theme",
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [variant, setVariantState] = useState<ThemeVariant>(defaultVariant);
  const [glassIntensity, setGlassIntensityState] = useState<GlassIntensity>(
    defaultGlassIntensity
  );
  const [isLoading, setIsLoading] = useState(true);

  // ============================================================================
  // PERSISTENCE LOGIC
  // ============================================================================

  // Load theme from localStorage on mount
  useEffect(() => {
    if (!enablePersistence) {
      setIsLoading(false);
      return;
    }

    try {
      const savedVariant = localStorage.getItem(
        STORAGE_KEYS.THEME_VARIANT
      ) as ThemeVariant;
      const savedIntensity = localStorage.getItem(
        STORAGE_KEYS.GLASS_INTENSITY
      ) as GlassIntensity;

      if (savedVariant && ["softclub", "glass-heavy"].includes(savedVariant)) {
        setVariantState(savedVariant);
      }

      if (
        savedIntensity &&
        ["whisper", "light", "medium", "heavy", "extreme"].includes(
          savedIntensity
        )
      ) {
        setGlassIntensityState(savedIntensity);
      }
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, [enablePersistence]);

  // Save theme to localStorage when changed
  useEffect(() => {
    if (!enablePersistence || isLoading) return;

    try {
      localStorage.setItem(STORAGE_KEYS.THEME_VARIANT, variant);
      localStorage.setItem(STORAGE_KEYS.GLASS_INTENSITY, glassIntensity);
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error);
    }
  }, [variant, glassIntensity, enablePersistence, isLoading]);

  // ============================================================================
  // THEME SETTERS WITH VALIDATION
  // ============================================================================

  const setVariant = (newVariant: ThemeVariant) => {
    if (!["softclub", "glass-heavy"].includes(newVariant)) {
      console.warn(`Invalid theme variant: ${newVariant}`);
      return;
    }
    setVariantState(newVariant);
  };

  const setGlassIntensity = (newIntensity: GlassIntensity) => {
    if (
      !["whisper", "light", "medium", "heavy", "extreme"].includes(newIntensity)
    ) {
      console.warn(`Invalid glass intensity: ${newIntensity}`);
      return;
    }
    setGlassIntensityState(newIntensity);
  };

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
    ? { ...tempGlassHeavyTheme, currentIntensity: glassIntensity }
    : tempSoftclubTheme;

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
    softclub: tempSoftclubTheme,
    glassHeavy: tempGlassHeavyTheme,

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

// ============================================================================
// HIGHER-ORDER COMPONENT
// ============================================================================

/**
 * HOC to inject theme props into any component
 */
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: ThemeContextType }>
) => {
  const WrappedComponent = (props: P) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };

  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// ============================================================================
// THEME UTILITIES & HELPERS
// ============================================================================

/**
 * Get CSS classes for current theme variant
 */
export const useThemeClasses = () => {
  const { variant, glassIntensity, isGlassMode } = useTheme();

  return {
    page: isGlassMode
      ? `glass-page glass-${glassIntensity} bg-gradient-to-br from-slate-900/5 via-slate-800/10 to-slate-900/5`
      : "softclub-page bg-gradient-to-br from-slate-50 via-cyan-50/50 to-purple-50/50",

    card: isGlassMode
      ? `glass-card backdrop-blur-${glassIntensity === "whisper" ? "sm" : glassIntensity === "extreme" ? "3xl" : "xl"} bg-white/20 border border-white/30`
      : "softclub-card bg-gradient-to-br from-white/90 via-cyan-50/30 to-purple-50/20 rounded-3xl shadow-lg",

    text: isGlassMode
      ? "glass-text text-slate-900/90"
      : "softclub-text text-slate-800",
  };
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { SoftclubTheme, GlassHeavyTheme };

// ============================================================================
// DEBUG & DEVELOPMENT HELPERS
// ============================================================================

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  window.themeDebug = {
    getContext: () => {
      try {
        return useTheme();
      } catch {
        return "ThemeProvider not found in tree";
      }
    },
    themes: {
      softclub: tempSoftclubTheme,
      glassHeavy: tempGlassHeavyTheme,
    },
  };
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*
// In your App.tsx:
import { ThemeProvider } from '@/theme/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultVariant="softclub" enablePersistence={true}>
      <YourAppContent />
    </ThemeProvider>
  );
}

// In any component:
import { useTheme } from '@/theme/ThemeProvider';

function MyComponent() {
  const { variant, toggleTheme, isGlassMode, glassIntensity } = useTheme();
  
  return (
    <div className={isGlassMode ? 'glass-container' : 'softclub-container'}>
      <button onClick={toggleTheme}>
        Switch to {isGlassMode ? 'Softclub' : 'Glass Heavy'}
      </button>
      {isGlassMode && <p>Current intensity: {glassIntensity}</p>}
    </div>
  );
}
*/
