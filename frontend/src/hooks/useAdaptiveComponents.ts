// ============================================================================
// ARCHIVO: src/hooks/useAdaptiveComponents.ts (VERSIÓN COMPLETA)
// ============================================================================

import { useMemo } from "react";
import { useTheme } from "@/theme/ThemeProvider";

// ============================================================================
// SOFTCLUB THEME COMPONENTS (TODOS)
// ============================================================================
import BookCardSoftclub from "@/components/themes/softclub/BookCard";
import BookGridSoftclub from "@/components/themes/softclub/BookGrid";
import ButtonSoftclub from "@/components/themes/softclub/Button";
import CardSoftclub from "@/components/themes/softclub/Card";
import DashboardSoftclub from "@/components/themes/softclub/Dashboard";
import FilterBarSoftclub from "@/components/themes/softclub/FilterBar";
import HeaderSoftclub from "@/components/themes/softclub/Header";
import InputSoftclub from "@/components/themes/softclub/Input";
import LoginSoftclub from "@/components/themes/softclub/Login";
import ModalSoftclub from "@/components/themes/softclub/Modal";
import SearchBoxSoftclub from "@/components/themes/softclub/SearchBox";
import StatCardSoftclub from "@/components/themes/softclub/StatCard";

// ============================================================================
// GLASS HEAVY THEME COMPONENTS (TODOS)
// ============================================================================
import BookCardGlassHeavy from "@/components/themes/glass-heavy/BookCard";
import BookGridGlassHeavy from "@/components/themes/glass-heavy/BookGrid";
import ButtonGlassHeavy from "@/components/themes/glass-heavy/Button";
import CardGlassHeavy from "@/components/themes/glass-heavy/Card";
import DashboardGlassHeavy from "@/components/themes/glass-heavy/Dashboard";
import FilterBarGlassHeavy from "@/components/themes/glass-heavy/FilterBar";
import HeaderGlassHeavy from "@/components/themes/glass-heavy/Header";
import InputGlassHeavy from "@/components/themes/glass-heavy/Input";
import LoginGlassHeavy from "@/components/themes/glass-heavy/Login";
import ModalGlassHeavy from "@/components/themes/glass-heavy/Modal";
import SearchBoxGlassHeavy from "@/components/themes/glass-heavy/SearchBox";
import StatCardGlassHeavy from "@/components/themes/glass-heavy/StatCard";

// ============================================================================
// INTERFACES COMPLETAS
// ============================================================================

export interface BookCardProps {
  book: any;
  onClick?: (book: any) => void;
  className?: string;
}

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
  filters?: any;
  onFiltersChange?: (filters: any) => void;
  categories?: string[];
  totalResults?: number;
  className?: string;
}

export interface BookGridProps {
  books: any[];
  onBookSelect?: (book: any) => void;
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
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  error?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
}

// ============================================================================
// ADAPTIVE COMPONENTS INTERFACE COMPLETA
// ============================================================================

export interface AdaptiveComponents {
  // Core Library Components
  BookCard: React.ComponentType<BookCardProps>;
  BookGrid: React.ComponentType<BookGridProps>;
  StatCard: React.ComponentType<StatCardProps>;
  FilterBar: React.ComponentType<FilterBarProps>;
  Dashboard: React.ComponentType<any>;

  // Layout Components
  Header: React.ComponentType<HeaderProps>;
  SearchBox: React.ComponentType<SearchBoxProps>;

  // UI Components
  Button: React.ComponentType<ButtonProps>;
  Input: React.ComponentType<InputProps>;
  Modal: React.ComponentType<ModalProps>;
  Card: React.ComponentType<CardProps>;

  // Auth Components
  Login: React.ComponentType<any>;
}

// ============================================================================
// HOOK PRINCIPAL COMPLETO
// ============================================================================

export const useAdaptiveComponents = (): AdaptiveComponents => {
  const theme = useTheme();

  const components = useMemo(() => {
    if (theme.isGlassMode) {
      // Glass Heavy Theme - TODOS los componentes
      return {
        // Core Library Components
        BookCard: BookCardGlassHeavy,
        BookGrid: BookGridGlassHeavy,
        StatCard: StatCardGlassHeavy,
        FilterBar: FilterBarGlassHeavy,
        Dashboard: DashboardGlassHeavy,

        // Layout Components
        Header: HeaderGlassHeavy,
        SearchBox: SearchBoxGlassHeavy,

        // UI Components
        Button: ButtonGlassHeavy,
        Input: InputGlassHeavy,
        Modal: ModalGlassHeavy,
        Card: CardGlassHeavy,

        // Auth Components
        Login: LoginGlassHeavy,
      };
    }

    // Softclub Theme - TODOS los componentes
    return {
      // Core Library Components
      BookCard: BookCardSoftclub,
      BookGrid: BookGridSoftclub,
      StatCard: StatCardSoftclub,
      FilterBar: FilterBarSoftclub,
      Dashboard: DashboardSoftclub,

      // Layout Components
      Header: HeaderSoftclub,
      SearchBox: SearchBoxSoftclub,

      // UI Components
      Button: ButtonSoftclub,
      Input: InputSoftclub,
      Modal: ModalSoftclub,
      Card: CardSoftclub,

      // Auth Components
      Login: LoginSoftclub,
    };
  }, [theme.variant, theme.isGlassMode]);

  return components;
};

// ============================================================================
// HOOKS ESPECIALIZADOS
// ============================================================================

export const useAdaptiveLibraryComponents = () => {
  const components = useAdaptiveComponents();

  return useMemo(
    () => ({
      BookCard: components.BookCard,
      BookGrid: components.BookGrid,
      StatCard: components.StatCard,
      FilterBar: components.FilterBar,
      Dashboard: components.Dashboard,
    }),
    [components]
  );
};

export const useAdaptiveUIComponents = () => {
  const components = useAdaptiveComponents();

  return useMemo(
    () => ({
      Button: components.Button,
      Input: components.Input,
      Modal: components.Modal,
      Card: components.Card,
      Header: components.Header,
      SearchBox: components.SearchBox,
    }),
    [components]
  );
};

// ============================================================================
// HOOK PARA COMPONENTE ESPECÍFICO
// ============================================================================

export const useAdaptiveComponent = <T extends keyof AdaptiveComponents>(
  componentName: T
): AdaptiveComponents[T] => {
  const components = useAdaptiveComponents();
  return components[componentName];
};
