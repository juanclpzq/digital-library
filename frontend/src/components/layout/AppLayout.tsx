// ============================================================================
// APP LAYOUT ADAPTIVE - MAIN APPLICATION LAYOUT
// FILE LOCATION: src/components/layout/AppLayout.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { useAdaptiveStyles } from "@/hooks/useAdaptiveStyles";
import AdaptiveButton from "@/components/shared/AdaptiveButton";
import ThemeToggle from "@/components/ui/ThemeToggle";

// ============================================================================
// LAYOUT PROPS INTERFACE
// ============================================================================

export interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
  contentClassName?: string;
  sidebarContent?: React.ReactNode;
  headerActions?: React.ReactNode;
  footerContent?: React.ReactNode;
}

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
        />
      </svg>
    ),
    href: "/dashboard",
  },
  {
    id: "library",
    label: "My Library",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    href: "/library",
  },
  {
    id: "reading",
    label: "Currently Reading",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
    href: "/reading",
  },
  {
    id: "stats",
    label: "Statistics",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    href: "/stats",
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    href: "/settings",
  },
];

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

const AdaptiveSidebar: React.FC<{
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}> = ({ isCollapsed, onToggle, className = "" }) => {
  const theme = useTheme();
  const styles = useAdaptiveStyles();
  const [activeItem, setActiveItem] = useState("dashboard");

  const sidebarClasses = theme.isGlassMode
    ? "backdrop-blur-[20px] bg-white/20 border-r border-white/25"
    : "bg-gradient-to-b from-cloud-white/95 to-silver-matte/85 border-r border-white/50";

  const itemClasses = (isActive: boolean) => {
    if (theme.isGlassMode) {
      return isActive
        ? "backdrop-blur-md bg-white/25 text-white border border-white/30 shadow-glass-md"
        : "text-white/80 hover:bg-white/15 hover:text-white border border-transparent hover:border-white/20";
    }
    return isActive
      ? "bg-gradient-to-r from-lavender-mist/80 to-soft-cyan/60 text-midnight-navy font-semibold shadow-gentle"
      : "text-midnight-navy/70 hover:bg-white/50 hover:text-midnight-navy";
  };

  return (
    <motion.aside
      className={`
        fixed left-0 top-0 h-full z-40 flex flex-col
        ${sidebarClasses} ${className}
      `}
      initial={false}
      animate={{
        width: isCollapsed ? "80px" : "280px",
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
    >
      {/* Logo/Brand */}
      <motion.div
        className="p-6 border-b border-white/30 flex items-center gap-3"
        initial={false}
        animate={{
          justifyContent: isCollapsed ? "center" : "flex-start",
        }}
      >
        <motion.div
          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            theme.isGlassMode
              ? "bg-white/20 border border-white/30"
              : "bg-gradient-to-br from-soft-cyan to-lavender-mist"
          }`}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <span className="text-lg font-bold">📚</span>
        </motion.div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              className={`font-bold text-xl ${
                theme.isGlassMode ? "text-white" : "text-midnight-navy"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              BookVault
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => (
          <motion.button
            key={item.id}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300
              ${itemClasses(activeItem === item.id)}
            `}
            onClick={() => setActiveItem(item.id)}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <span className="flex-shrink-0">{item.icon}</span>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="font-medium text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-white/30">
        <AdaptiveButton
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full"
          icon={
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </motion.svg>
          }
        >
          {!isCollapsed && "Collapse"}
        </AdaptiveButton>
      </div>
    </motion.aside>
  );
};

// ============================================================================
// HEADER COMPONENT
// ============================================================================

const AdaptiveHeader: React.FC<{
  onSidebarToggle: () => void;
  actions?: React.ReactNode;
  className?: string;
}> = ({ onSidebarToggle, actions, className = "" }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const headerClasses = theme.isGlassMode
    ? "backdrop-blur-[20px] bg-white/20 border-b border-white/25"
    : "bg-gradient-to-r from-cloud-white/95 via-soft-cyan/20 to-lavender-mist/30 border-b border-white/40";

  return (
    <motion.header
      className={`
        sticky top-0 z-30 flex items-center justify-between px-6 py-4
        ${headerClasses} ${className}
      `}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <AdaptiveButton
          variant="ghost"
          size="sm"
          onClick={onSidebarToggle}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          }
          className="lg:hidden"
        />

        <div>
          <h1
            className={`text-2xl font-bold ${
              theme.isGlassMode ? "text-white" : "text-midnight-navy"
            }`}
          >
            Dashboard
          </h1>
          <p
            className={`text-sm ${
              theme.isGlassMode ? "text-white/70" : "text-midnight-navy/60"
            }`}
          >
            Welcome back, {user?.firstName || "Reader"}!
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Custom actions */}
        {actions}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User menu */}
        <div className="relative">
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`
              flex items-center gap-3 p-2 rounded-xl transition-all duration-300
              ${
                theme.isGlassMode
                  ? "hover:bg-white/15 text-white"
                  : "hover:bg-white/50 text-midnight-navy"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme.isGlassMode
                  ? "bg-white/20 border border-white/30"
                  : "bg-gradient-to-br from-lavender-mist to-peachy-keen"
              }`}
            >
              <span className="text-sm font-bold">
                {user?.firstName?.[0] || "U"}
              </span>
            </div>
          </motion.button>

          {/* User dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className={`
                  absolute right-0 top-full mt-2 w-48 py-2 rounded-xl border shadow-lg
                  ${
                    theme.isGlassMode
                      ? "backdrop-blur-md bg-white/20 border-white/30"
                      : "bg-white border-gray-200"
                  }
                `}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={logout}
                  className={`
                    w-full text-left px-4 py-2 text-sm transition-colors
                    ${
                      theme.isGlassMode
                        ? "text-white/90 hover:bg-white/15"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

// ============================================================================
// MAIN APP LAYOUT COMPONENT
// ============================================================================

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar = true,
  sidebarCollapsed: controlledCollapsed,
  onSidebarToggle,
  showHeader = true,
  showFooter = false,
  className = "",
  contentClassName = "",
  sidebarContent,
  headerActions,
  footerContent,
}) => {
  const theme = useTheme();
  const styles = useAdaptiveStyles();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Use controlled or internal state
  const sidebarCollapsed = controlledCollapsed ?? internalCollapsed;
  const handleSidebarToggle =
    onSidebarToggle || (() => setInternalCollapsed(!internalCollapsed));

  // Background classes
  const backgroundClasses = theme.isGlassMode
    ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    : "bg-gradient-to-br from-cloud-white via-silver-matte/30 to-lavender-mist/10";

  return (
    <div className={`min-h-screen flex ${backgroundClasses} ${className}`}>
      {/* Sidebar */}
      {showSidebar && (
        <AdaptiveSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
      )}

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{
          marginLeft: showSidebar
            ? sidebarCollapsed
              ? "80px"
              : "280px"
            : "0px",
        }}
      >
        {/* Header */}
        {showHeader && (
          <AdaptiveHeader
            onSidebarToggle={handleSidebarToggle}
            actions={headerActions}
          />
        )}

        {/* Content */}
        <main className={`flex-1 p-6 ${contentClassName}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        {showFooter && footerContent && (
          <footer
            className={`
            px-6 py-4 border-t
            ${
              theme.isGlassMode
                ? "border-white/20 bg-white/10 backdrop-blur-md"
                : "border-white/40 bg-white/30"
            }
          `}
          >
            {footerContent}
          </footer>
        )}
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {showSidebar && !sidebarCollapsed && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSidebarToggle}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
