// ============================================================================
// LAYOUT COMPONENTS INDEX - CENTRALIZED LAYOUT EXPORTS
// FILE LOCATION: src/components/layout/index.ts
// ============================================================================

// ============================================================================
// MAIN LAYOUT COMPONENTS
// ============================================================================

// Primary layout component
export { default as AppLayout } from "./AppLayout";
export type { AppLayoutProps } from "./AppLayout";

// Additional layout components (TO BE CREATED)
// export { default as PageLayout } from "./PageLayout";
// export { default as Navigation } from "./Navigation";
// export { default as Sidebar } from "./Sidebar";
// export { default as Header } from "./Header";
// export { default as Footer } from "./Footer";

// ============================================================================
// LAYOUT UTILITIES & HOOKS
// ============================================================================

/**
 * Hook for managing responsive layout state
 */
export const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar: () => setSidebarCollapsed(prev => !prev),
  };
};

/**
 * Hook for managing layout state persistence
 */
export const useLayoutState = (key = 'layout-preferences') => {
  const [preferences, setPreferences] = React.useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {
        sidebarCollapsed: false,
        theme: 'softclub',
        density: 'comfortable',
      };
    } catch {
      return {
        sidebarCollapsed: false,
        theme: 'softclub',
        density: 'comfortable',
      };
    }
  });

  const updatePreferences = React.useCallback((updates: Partial<typeof preferences>) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      localStorage.setItem(key, JSON.stringify(newPrefs));
      return newPrefs;
    });
  }, [key]);

  return {
    preferences,
    updatePreferences,
    resetPreferences: () => updatePreferences({
      sidebarCollapsed: false,
      theme: 'softclub',
      density: 'comfortable',
    }),
  };
};

// ============================================================================
// LAYOUT PRESETS
// ============================================================================

/**
 * Predefined layout configurations
 */
export const LayoutPresets = {
  // Standard dashboard layout
  Dashboard: {
    showSidebar: true,
    showHeader: true,
    showFooter: false,
    sidebarCollapsed: false,
  },

  // Minimal layout for focus
  Minimal: {
    showSidebar: false,
    showHeader: true,
    showFooter: false,
  },

  // Full-featured layout
  Complete: {
    showSidebar: true,
    showHeader: true,
    showFooter: true,
    sidebarCollapsed: false,
  },

  // Mobile-optimized layout
  Mobile: {
    showSidebar: true,
    showHeader: true,
    showFooter: false,
    sidebarCollapsed: true,
  },

  // Reading-focused layout
  Reader: {
    showSidebar: false,
    showHeader: false,
    showFooter: false,
  },
};

// ============================================================================
// LAYOUT CONTEXT
// ============================================================================

interface LayoutContextType {
  currentLayout: keyof typeof LayoutPresets;
  setLayout: (layout: keyof typeof LayoutPresets) => void;
  layoutProps: any;
  customizeLayout: (props: Partial<any>) => void;
}

const LayoutContext = React.createContext<LayoutContextType | null>(null);

/**
 * Provider for layout state management
 */
export const LayoutProvider: React.FC<{ 
  children: React.ReactNode;
  defaultLayout?: keyof typeof LayoutPresets;
}> = ({ children, defaultLayout = 'Dashboard' }) => {
  const [currentLayout, setCurrentLayout] = React.useState<keyof typeof LayoutPresets>(defaultLayout);
  const [customProps, setCustomProps] = React.useState({});

  const layoutProps = React.useMemo(() => ({
    ...LayoutPresets[currentLayout],
    ...customProps,
  }), [currentLayout, customProps]);

  const setLayout = React.useCallback((layout: keyof typeof LayoutPresets) => {
    setCurrentLayout(layout);
    setCustomProps({}); // Reset custom props when changing layout
  }, []);

  const customizeLayout = React.useCallback((props: Partial<any>) => {
    setCustomProps(prev => ({ ...prev, ...props }));
  }, []);

  const value = {
    currentLayout,
    setLayout,
    layoutProps,
    customizeLayout,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

/**
 * Hook to use layout context
 */
export const useLayout = () => {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// ============================================================================
// LAYOUT COMPONENTS FACTORY
// ============================================================================

/**
 * Factory for creating layout components with preset configurations
 */
export const createLayoutComponent = (preset: keyof typeof LayoutPresets) => {
  return ({ children, ...overrides }: { children: React.ReactNode; [key: string]: any }) => (
    <AppLayout {...LayoutPresets[preset]} {...overrides}>
      {children}
    </AppLayout>
  );
};

// Pre-created layout components
export const DashboardLayout = createLayoutComponent('Dashboard');
export const MinimalLayout = createLayoutComponent('Minimal');
export const CompleteLayout = createLayoutComponent('Complete');
export const MobileLayout = createLayoutComponent('Mobile');
export const ReaderLayout = createLayoutComponent('Reader');

// ============================================================================
// RESPONSIVE LAYOUT WRAPPER
// ============================================================================

/**
 * Responsive layout that automatically adapts to screen size
 */
export const ResponsiveLayout: React.FC<{
  children: React.ReactNode;
  desktopLayout?: keyof typeof LayoutPresets;
  tabletLayout?: keyof typeof LayoutPresets;
  mobileLayout?: keyof typeof LayoutPresets;
}> = ({ 
  children, 
  desktopLayout = 'Dashboard',
  tabletLayout = 'Dashboard',
  mobileLayout = 'Mobile'
}) => {
  const { isMobile, isTablet } = useResponsiveLayout();

  const currentPreset = isMobile ? mobileLayout : isTablet ? tabletLayout : desktopLayout;
  const LayoutComponent = createLayoutComponent(currentPreset);

  return <LayoutComponent>{children}</LayoutComponent>;
};

// ============================================================================
// LAYOUT ANIMATION VARIANTS
// ============================================================================

export const layoutAnimations = {
  // Page transition animations
  pageTransition: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeInOut" }
  },

  // Sidebar animations
  sidebarSlide: {
    open: { x: 0 },
    closed: { x: -280 },
    transition: { duration: 0.3, ease: [0.25, 0.25, 0, 1] }
  },

  // Content fade
  contentFade: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.1 }
  },

  // Staggered children
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
};

// ============================================================================
// LAYOUT UTILITIES
// ============================================================================

export const LayoutUtils = {
  // Get layout breakpoints
  getBreakpoints: () => ({
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
  }),

  // Calculate content width based on sidebar state
  getContentWidth: (sidebarOpen: boolean, sidebarWidth = 280) => {
    return sidebarOpen ? `calc(100vw - ${sidebarWidth}px)` : '100vw';
  },

  // Get responsive padding
  getResponsivePadding: (isMobile: boolean) => ({
    padding: isMobile ? '1rem' : '1.5rem',
    paddingTop: isMobile ? '1rem' : '2rem',
  }),
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Main components
  AppLayout,
  DashboardLayout,
  MinimalLayout,
  CompleteLayout,
  ResponsiveLayout,

  // Providers and hooks
  LayoutProvider,
  useLayout,
  useResponsiveLayout,
  useLayoutState,

  // Utilities
  LayoutPresets,
  LayoutUtils,
  layoutAnimations,
  createLayoutComponent,
};