// ============================================================================
// USE ADAPTIVE COMPONENTS HOOK - DYNAMIC COMPONENT SELECTION
// FILE LOCATION: src/hooks/useAdaptiveComponents.ts
// ============================================================================

import { useMemo } from "react";
import { useTheme } from "@/theme/ThemeProvider";
import type { BookCardProps } from "@/types";

// ============================================================================
// COMPONENT IMPORTS - FULL ARCHITECTURE (COMPONENTS WILL BE CREATED)
// ============================================================================

// Softclub Theme Components
import BookCardSoftclub from "@/components/themes/softclub/BookCard";
import StatCardSoftclub from "@/components/themes/softclub/StatCard";
import FilterBarSoftclub from "@/components/themes/softclub/FilterBar";
import DashboardSoftclub from "@/components/themes/softclub/Dashboard";
import BookGridSoftclub from "@/components/themes/softclub/BookGrid";
import HeaderSoftclub from "@/components/themes/softclub/Header";
import SearchBoxSoftclub from "@/components/themes/softclub/SearchBox";
import ButtonSoftclub from "@/components/themes/softclub/Button";
import InputSoftclub from "@/components/themes/softclub/Input";
import ModalSoftclub from "@/components/themes/softclub/Modal";
import CardSoftclub from "@/components/themes/softclub/Card";

// Glass Heavy Theme Components  
import BookCardGlassHeavy from "@/components/themes/glass-heavy/BookCard";
import StatCardGlassHeavy from "@/components/themes/glass-heavy/StatCard";
import FilterBarGlassHeavy from "@/components/themes/glass-heavy/FilterBar";
import DashboardGlassHeavy from "@/components/themes/glass-heavy/Dashboard";
import BookGridGlassHeavy from "@/components/themes/glass-heavy/BookGrid";
import HeaderGlassHeavy from "@/components/themes/glass-heavy/Header";
import SearchBoxGlassHeavy from "@/components/themes/glass-heavy/SearchBox";
import ButtonGlassHeavy from "@/components/themes/glass-heavy/Button";
import InputGlassHeavy from "@/components/themes/glass-heavy/Input";
import ModalGlassHeavy from "@/components/themes/glass-heavy/Modal";
import CardGlassHeavy from "@/components/themes/glass-heavy/Card";

// ============================================================================
// COMPONENT TYPES INTERFACES
// ============================================================================

export interface StatCardProps {
  label: string;
  value: number;
  gradient: string;
  icon?: string;
  trend?: "up" | "down" | "stable";
  isLoading?: boolean;
  className?: string;
}

export interface FilterBarProps {
  filters: any; // TODO: Import proper filter types
  onFiltersChange: (filters: any) => void;
  categories: string[];
  totalResults?: number;
  className?: string;
}

export interface DashboardProps {
  books: any[]; // TODO: Import proper book types
  stats: any; // TODO: Import proper stats types
  onBookAction: (action: string, bookId: string) => void;
  className?: string;
}

export interface BookGridProps {
  books: any[];
  onBookSelect: (book: any) => void;
  loading?: boolean;
  className?: string;
}

export interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// ============================================================================
// ADAPTIVE COMPONENTS INTERFACE
// ============================================================================

export interface AdaptiveComponents {
  // Core Components
  BookCard: React.ComponentType<BookCardProps>;
  StatCard: React.ComponentType<StatCardProps>;
  FilterBar: React.ComponentType<FilterBarProps>;
  Dashboard: React.ComponentType<DashboardProps>;
  BookGrid: React.ComponentType<BookGridProps>;
  
  // Layout Components
  Header: React.ComponentType<HeaderProps>;
  SearchBox: React.ComponentType<SearchBoxProps>;
  
  // UI Components (theme-aware versions)
  Button: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  Modal: React.ComponentType<any>;
  Card: React.ComponentType<any>;
}

// ============================================================================
// MAIN HOOK IMPLEMENTATION
// ============================================================================

export const useAdaptiveComponents = (): AdaptiveComponents => {
  const theme = useTheme();

  const components = useMemo(() => {
    if (theme.isGlassMode) {
      // Glass Heavy Theme Components
      return {
        // Core Components
        BookCard: BookCardGlassHeavy,
        StatCard: StatCardGlassHeavy,
        FilterBar: FilterBarGlassHeavy,
        Dashboard: DashboardGlassHeavy,
        BookGrid: BookGridGlassHeavy,
        
        // Layout Components
        Header: HeaderGlassHeavy,
        SearchBox: SearchBoxGlassHeavy,
        
        // UI Components
        Button: ButtonGlassHeavy,
        Input: InputGlassHeavy,
        Modal: ModalGlassHeavy,
        Card: CardGlassHeavy,
      };
    }

    // Softclub Theme Components (Default)
    return {
      // Core Components
      BookCard: BookCardSoftclub,
      StatCard: StatCardSoftclub,
      FilterBar: FilterBarSoftclub,
      Dashboard: DashboardSoftclub,
      BookGrid: BookGridSoftclub,
      
      // Layout Components  
      Header: HeaderSoftclub,
      SearchBox: SearchBoxSoftclub,
      
      // UI Components
      Button: ButtonSoftclub,
      Input: InputSoftclub,
      Modal: ModalSoftclub,
      Card: CardSoftclub,
    };
  }, [theme.variant, theme.isGlassMode]);

  return components;
};

// ============================================================================
// SPECIALIZED COMPONENT HOOKS
// ============================================================================

/**
 * Hook for getting specific component types
 */
export const useAdaptiveComponent = <T extends keyof AdaptiveComponents>(
  componentName: T
): AdaptiveComponents[T] => {
  const components = useAdaptiveComponents();
  return components[componentName];
};

/**
 * Hook for getting layout components specifically
 */
export const useAdaptiveLayout = () => {
  const components = useAdaptiveComponents();
  
  return useMemo(() => ({
    Header: components.Header,
    SearchBox: components.SearchBox,
  }), [components]);
};

/**
 * Hook for getting core business components
 */
export const useAdaptiveBookComponents = () => {
  const components = useAdaptiveComponents();
  
  return useMemo(() => ({
    BookCard: components.BookCard,
    BookGrid: components.BookGrid,
    Dashboard: components.Dashboard,
    FilterBar: components.FilterBar,
    StatCard: components.StatCard,
  }), [components]);
};

/**
 * Hook for getting UI components
 */
export const useAdaptiveUI = () => {
  const components = useAdaptiveComponents();
  
  return useMemo(() => ({
    Button: components.Button,
    Input: components.Input,
    Modal: components.Modal,
    Card: components.Card,
  }), [components]);
};

// ============================================================================
// COMPONENT FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a themed version of a component
 */
export const useThemedComponent = <T extends object>(
  softclubComponent: React.ComponentType<T>,
  glassHeavyComponent: React.ComponentType<T>
) => {
  const theme = useTheme();
  
  return useMemo(() => {
    return theme.isGlassMode ? glassHeavyComponent : softclubComponent;
  }, [theme.isGlassMode, softclubComponent, glassHeavyComponent]);
};

/**
 * Create an adaptive wrapper component
 */
export const useAdaptiveWrapper = () => {
  const theme = useTheme();
  
  return useMemo(() => {
    const WrapperComponent = ({ 
      children, 
      softclubProps = {}, 
      glassHeavyProps = {},
      ...commonProps 
    }: {
      children: React.ReactNode;
      softclubProps?: object;
      glassHeavyProps?: object;
    } & any) => {
      
      const themeProps = theme.isGlassMode ? glassHeavyProps : softclubProps;
      
      return (
        <div {...commonProps} {...themeProps}>
          {children}
        </div>
      );
    };

    return WrapperComponent;
  }, [theme.isGlassMode]);
};

// ============================================================================
// COMPONENT REGISTRY SYSTEM
// ============================================================================

/**
 * Component registry for dynamic registration
 */
class AdaptiveComponentRegistry {
  private softclubComponents: Map<string, React.ComponentType<any>> = new Map();
  private glassHeavyComponents: Map<string, React.ComponentType<any>> = new Map();

  register(
    name: string, 
    softclubComponent: React.ComponentType<any>, 
    glassHeavyComponent: React.ComponentType<any>
  ) {
    this.softclubComponents.set(name, softclubComponent);
    this.glassHeavyComponents.set(name, glassHeavyComponent);
  }

  get(name: string, variant: 'softclub' | 'glass-heavy') {
    const registry = variant === 'glass-heavy' 
      ? this.glassHeavyComponents 
      : this.softclubComponents;
    
    return registry.get(name);
  }

  getAll(variant: 'softclub' | 'glass-heavy') {
    const registry = variant === 'glass-heavy' 
      ? this.glassHeavyComponents 
      : this.softclubComponents;
    
    return Object.fromEntries(registry.entries());
  }
}

// Global registry instance
const componentRegistry = new AdaptiveComponentRegistry();

/**
 * Hook for using the component registry
 */
export const useComponentRegistry = () => {
  const theme = useTheme();
  
  return useMemo(() => ({
    register: componentRegistry.register.bind(componentRegistry),
    get: (name: string) => componentRegistry.get(name, theme.variant),
    getAll: () => componentRegistry.getAll(theme.variant),
  }), [theme.variant]);
};

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Hook for lazy loading theme components
 */
export const useLazyAdaptiveComponent = <T>(
  componentName: string,
  softclubLoader: () => Promise<{ default: React.ComponentType<T> }>,
  glassHeavyLoader: () => Promise<{ default: React.ComponentType<T> }>
) => {
  const theme = useTheme();
  
  return useMemo(async () => {
    const loader = theme.isGlassMode ? glassHeavyLoader : softclubLoader;
    const module = await loader();
    return module.default;
  }, [theme.isGlassMode, softclubLoader, glassHeavyLoader]);
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useAdaptiveComponents;

// Named exports for convenience
export {
  useAdaptiveComponent,
  useAdaptiveLayout,
  useAdaptiveBookComponents,
  useAdaptiveUI,
  useThemedComponent,
  useAdaptiveWrapper,
  useComponentRegistry,
  useLazyAdaptiveComponent,
};

// Export component registry for external use
export { componentRegistry };