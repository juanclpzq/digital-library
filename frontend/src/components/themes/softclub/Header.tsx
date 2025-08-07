// src/components/themes/softclub/Header.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Book,
  Search,
  User,
  Settings,
  Moon,
  Sun,
  Bell,
  LogOut,
} from "lucide-react";

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
    email: string;
  };
  onThemeToggle?: () => void;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  notificationCount?: number;
  className?: string;
}

/**
 * Header Softclub - Navegación principal con estética Gen X nostálgica
 *
 * Features:
 * - Gradientes suaves característicos del tema Softclub
 * - Animaciones gentle y welcoming
 * - Logo con branding nostálgico
 * - Menu de usuario con efectos glass sutiles
 * - Theme toggle suave
 * - Notificaciones con badge animado
 * - Responsive design mobile-first
 */
const Header: React.FC<HeaderProps> = ({
  user,
  onThemeToggle,
  onSearch,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogout,
  isDarkMode = false,
  notificationCount = 0,
  className = "",
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded && searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`
        relative bg-gradient-to-r from-soft-cyan/90 via-lavender-mist/85 to-mint-dream/90
        backdrop-blur-md border-b border-white/30
        shadow-lg shadow-soft-cyan/20
        ${className}
      `}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="p-2 rounded-xl bg-gradient-to-br from-peachy-keen to-mint-dream 
                         shadow-lg shadow-peachy-keen/30"
              >
                <Book className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-1 rounded-xl bg-gradient-to-r from-soft-cyan 
                         to-lavender-mist opacity-30 blur-lg -z-10"
              />
            </div>

            <div className="hidden sm:block">
              <h1
                className="text-2xl font-bold bg-gradient-to-r from-purple-700 
                           to-blue-600 bg-clip-text text-transparent"
              >
                Digital Library
              </h1>
              <p className="text-sm text-purple-600/70 font-medium">
                Your knowledge sanctuary
              </p>
            </div>
          </motion.div>

          {/* Search Section */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <motion.form
              onSubmit={handleSearchSubmit}
              className="relative w-full"
              initial={false}
              animate={{
                scale: isSearchExpanded ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 
                               w-5 h-5 text-purple-500/70"
                />
                <motion.input
                  type="text"
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => setIsSearchExpanded(false)}
                  className="
                    w-full pl-12 pr-4 py-3 rounded-2xl
                    bg-white/70 backdrop-blur-sm
                    border border-white/50
                    placeholder-purple-500/50 text-purple-700
                    focus:outline-none focus:ring-2 focus:ring-purple-400/50
                    focus:border-purple-300 focus:bg-white/80
                    shadow-inner shadow-purple-100/50
                    transition-all duration-300
                  "
                  whileFocus={{
                    boxShadow: "0 0 0 4px rgba(147, 51, 234, 0.1)",
                  }}
                />
                {searchQuery && (
                  <motion.button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2
                             text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    ×
                  </motion.button>
                )}
              </div>
            </motion.form>
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearchToggle}
              className="md:hidden p-2 rounded-xl bg-white/60 backdrop-blur-sm
                       hover:bg-white/80 transition-all duration-300
                       shadow-soft"
            >
              <Search className="w-5 h-5 text-purple-600" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNotificationClick}
              className="relative p-2 rounded-xl bg-white/60 backdrop-blur-sm
                       hover:bg-white/80 transition-all duration-300
                       shadow-soft"
            >
              <Bell className="w-5 h-5 text-purple-600" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r 
                           from-peachy-keen to-coral-sunset text-white text-xs 
                           font-bold rounded-full flex items-center justify-center
                           shadow-lg"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </motion.span>
              )}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onThemeToggle}
              className="p-2 rounded-xl bg-white/60 backdrop-blur-sm
                       hover:bg-white/80 transition-all duration-300
                       shadow-soft"
            >
              <motion.div
                animate={{ rotate: isDarkMode ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-600" />
                )}
              </motion.div>
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-xl 
                         bg-white/60 backdrop-blur-sm hover:bg-white/80 
                         transition-all duration-300 shadow-soft"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-r 
                               from-purple-400 to-pink-400 flex items-center 
                               justify-center text-white font-bold text-sm"
                  >
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="hidden sm:block text-purple-700 font-medium">
                  {user?.name || "User"}
                </span>
              </motion.button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-xl
                             rounded-2xl shadow-xl border border-white/50 z-20
                             overflow-hidden"
                  >
                    {/* User Info Header */}
                    <div
                      className="p-4 bg-gradient-to-r from-soft-cyan/20 to-lavender-mist/20
                                  border-b border-white/30"
                    >
                      <div className="flex items-center space-x-3">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full bg-gradient-to-r 
                                       from-purple-400 to-pink-400 flex items-center 
                                       justify-center text-white font-bold"
                          >
                            {user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-purple-700">
                            {user?.name || "User"}
                          </p>
                          <p className="text-sm text-purple-500">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <motion.button
                        whileHover={{
                          backgroundColor: "rgba(147, 51, 234, 0.1)",
                        }}
                        onClick={() => {
                          onProfileClick?.();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3
                                 text-purple-700 hover:text-purple-800 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                      </motion.button>

                      <motion.button
                        whileHover={{
                          backgroundColor: "rgba(147, 51, 234, 0.1)",
                        }}
                        onClick={() => {
                          onSettingsClick?.();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3
                                 text-purple-700 hover:text-purple-800 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </motion.button>

                      <div className="border-t border-white/30 mt-2 pt-2">
                        <motion.button
                          whileHover={{
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                          }}
                          onClick={() => {
                            onLogout?.();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left flex items-center space-x-3
                                   text-red-600 hover:text-red-700 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden pb-4"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 
                             w-5 h-5 text-purple-500/70"
              />
              <input
                type="text"
                placeholder="Search your library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="
                  w-full pl-12 pr-4 py-3 rounded-2xl
                  bg-white/70 backdrop-blur-sm
                  border border-white/50
                  placeholder-purple-500/50 text-purple-700
                  focus:outline-none focus:ring-2 focus:ring-purple-400/50
                  focus:border-purple-300 focus:bg-white/80
                  shadow-inner shadow-purple-100/50
                "
              />
            </form>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
