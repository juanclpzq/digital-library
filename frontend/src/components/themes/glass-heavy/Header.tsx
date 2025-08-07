// src/components/themes/glass-heavy/Header.tsx
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
  glassIntensity?: "whisper" | "light" | "medium" | "heavy" | "extreme";
  className?: string;
}

/**
 * Header Glass Heavy - Navigation with intense glassmorphism and premium effects
 *
 * Features:
 * - Triple layer glassmorphism with variable backdrop-blur
 * - Condensation and refraction effects
 * - Dramatic animations and 3D transforms
 * - Shimmer effects on hover
 * - Floating content containers
 * - Configurable glass intensity system
 * - Premium cutting-edge aesthetics
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
  glassIntensity = "heavy",
  className = "",
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Glass intensity mapping
  const glassLevels = {
    whisper: "backdrop-blur-sm",
    light: "backdrop-blur-md",
    medium: "backdrop-blur-lg",
    heavy: "backdrop-blur-xl",
    extreme: "backdrop-blur-3xl",
  };

  const backgroundIntensity = {
    whisper: "bg-white/10",
    light: "bg-white/15",
    medium: "bg-white/20",
    heavy: "bg-white/25",
    extreme: "bg-white/30",
  };

  const currentBlur = glassLevels[glassIntensity];
  const currentBg = backgroundIntensity[glassIntensity];

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
      initial={{ y: -100, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        damping: 20,
      }}
      className={`
        relative ${currentBg} ${currentBlur}
        border-b border-white/20
        shadow-2xl shadow-black/20
        ${className}
      `}
    >
      {/* Triple Layer Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />

      {/* Condensation Effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section with 3D Effect */}
          <motion.div
            whileHover={{
              scale: 1.05,
              rotateY: 10,
              z: 50,
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 cursor-pointer perspective-1000"
          >
            <div className="relative">
              <motion.div
                animate={{
                  rotateX: [0, 360],
                  rotateY: [0, 180],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className={`
                  p-3 rounded-2xl ${currentBg} ${currentBlur}
                  border border-white/30 shadow-2xl
                  transform-gpu
                `}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.4),
                    inset 0 -1px 0 rgba(0,0,0,0.1),
                    0 8px 32px rgba(0,0,0,0.3),
                    0 0 0 1px rgba(255,255,255,0.1)
                  `,
                }}
              >
                <Book className="w-8 h-8 text-white drop-shadow-lg" />
              </motion.div>

              {/* Shimmer Effect */}
              <motion.div
                animate={{
                  x: [-100, 200],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                         rounded-2xl transform -skew-x-12"
              />

              {/* Floating particles */}
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-cyan-400/20 
                         to-blue-400/20 blur-xl -z-10"
              />
            </div>

            <div className="hidden sm:block">
              <motion.h1
                className="text-2xl font-bold text-white drop-shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Digital Library
              </motion.h1>
              <p className="text-sm text-white/80 font-medium drop-shadow">
                Crystalline Knowledge
              </p>
            </div>
          </motion.div>

          {/* Floating Search Container */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <motion.form
              onSubmit={handleSearchSubmit}
              className="relative w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`
                  relative ${currentBg} ${currentBlur}
                  border border-white/30 rounded-3xl
                  shadow-2xl shadow-black/20
                `}
                style={{
                  background: `
                    linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%),
                    linear-gradient(45deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)
                  `,
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.4),
                    inset 0 -1px 0 rgba(0,0,0,0.1),
                    0 8px 32px rgba(0,0,0,0.3)
                  `,
                }}
                animate={{
                  boxShadow: isSearchExpanded
                    ? [
                        "0 8px 32px rgba(0,0,0,0.3)",
                        "0 12px 40px rgba(59,130,246,0.4)",
                        "0 8px 32px rgba(0,0,0,0.3)",
                      ]
                    : "0 8px 32px rgba(0,0,0,0.3)",
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 
                               w-5 h-5 text-white/70 drop-shadow"
                />
                <motion.input
                  type="text"
                  placeholder="Search the crystalline archives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => setIsSearchExpanded(false)}
                  className="
                    w-full pl-12 pr-4 py-4 rounded-3xl
                    bg-transparent text-white placeholder-white/50
                    focus:outline-none
                    font-medium
                  "
                  whileFocus={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                />
                {searchQuery && (
                  <motion.button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    whileHover={{ rotate: 90 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2
                             text-white/70 hover:text-white transition-colors
                             text-xl font-bold"
                  >
                    ×
                  </motion.button>
                )}
              </motion.div>
            </motion.form>
          </div>

          {/* Floating Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Orb */}
            <motion.button
              whileHover={{
                scale: 1.1,
                rotateY: 180,
                transition: { duration: 0.6 },
              }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSearchToggle}
              className={`
                md:hidden p-3 rounded-2xl ${currentBg} ${currentBlur}
                border border-white/30 shadow-2xl
                transform-gpu
              `}
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.4),
                  0 8px 24px rgba(0,0,0,0.3)
                `,
              }}
            >
              <Search className="w-5 h-5 text-white drop-shadow" />
            </motion.button>

            {/* Notification Orb */}
            <motion.button
              whileHover={{
                scale: 1.1,
                rotateZ: [0, -10, 10, 0],
                transition: { duration: 0.5 },
              }}
              whileTap={{ scale: 0.9 }}
              onClick={onNotificationClick}
              className={`
                relative p-3 rounded-2xl ${currentBg} ${currentBlur}
                border border-white/30 shadow-2xl
                transform-gpu overflow-hidden
              `}
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.4),
                  0 8px 24px rgba(0,0,0,0.3)
                `,
              }}
            >
              <Bell className="w-5 h-5 text-white drop-shadow relative z-10" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r 
                           from-red-400 to-pink-500 text-white text-xs 
                           font-bold rounded-full flex items-center justify-center
                           shadow-2xl border-2 border-white/50"
                  style={{
                    boxShadow: "0 4px 20px rgba(239, 68, 68, 0.5)",
                  }}
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </motion.span>
              )}

              {/* Ripple effect */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-2xl bg-white/20"
              />
            </motion.button>

            {/* Theme Toggle Orb */}
            <motion.button
              whileHover={{
                scale: 1.1,
                rotateY: 360,
                transition: { duration: 0.8 },
              }}
              whileTap={{ scale: 0.9 }}
              onClick={onThemeToggle}
              className={`
                p-3 rounded-2xl ${currentBg} ${currentBlur}
                border border-white/30 shadow-2xl
                transform-gpu
              `}
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.4),
                  0 8px 24px rgba(0,0,0,0.3)
                `,
              }}
            >
              <motion.div
                animate={{ rotate: isDarkMode ? 360 : 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-amber-300 drop-shadow-lg" />
                ) : (
                  <Moon className="w-5 h-5 text-white drop-shadow" />
                )}
              </motion.div>
            </motion.button>

            {/* User Profile Floating Container */}
            <div className="relative">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  rotateY: 15,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`
                  flex items-center space-x-2 p-2 rounded-2xl 
                  ${currentBg} ${currentBlur}
                  border border-white/30 shadow-2xl
                  transform-gpu
                `}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.4),
                    0 8px 24px rgba(0,0,0,0.3)
                  `,
                }}
              >
                {user?.avatar ? (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/50"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br 
                               from-blue-400 via-purple-500 to-cyan-400 
                               flex items-center justify-center text-white 
                               font-bold text-sm shadow-inner"
                  >
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="hidden sm:block text-white font-medium drop-shadow">
                  {user?.name || "User"}
                </span>
              </motion.button>

              {/* Floating Dropdown Menu */}
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
                    initial={{
                      opacity: 0,
                      y: -20,
                      scale: 0.8,
                      rotateX: -90,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotateX: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -20,
                      scale: 0.8,
                      rotateX: -90,
                    }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      bounce: 0.2,
                    }}
                    className={`
                      absolute right-0 mt-3 w-72 ${currentBg} ${currentBlur}
                      rounded-3xl shadow-2xl border border-white/30 z-20
                      overflow-hidden transform-gpu
                    `}
                    style={{
                      background: `
                        linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%),
                        linear-gradient(45deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)
                      `,
                      boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.4),
                        inset 0 -1px 0 rgba(0,0,0,0.1),
                        0 20px 60px rgba(0,0,0,0.4)
                      `,
                    }}
                  >
                    {/* User Info Header with Glass Effect */}
                    <div className="p-6 border-b border-white/20">
                      <div className="flex items-center space-x-4">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/50"
                          />
                        ) : (
                          <div
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br 
                                       from-blue-400 via-purple-500 to-cyan-400 
                                       flex items-center justify-center text-white 
                                       font-bold text-xl shadow-2xl"
                          >
                            {user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white text-lg drop-shadow">
                            {user?.name || "User"}
                          </p>
                          <p className="text-sm text-white/70 drop-shadow">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Floating Menu Items */}
                    <div className="p-2">
                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: "rgba(255,255,255,0.1)",
                          x: 4,
                        }}
                        onClick={() => {
                          onProfileClick?.();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-4 text-left flex items-center space-x-4
                                 text-white rounded-2xl transition-all duration-300
                                 backdrop-blur-sm"
                      >
                        <User className="w-6 h-6 drop-shadow" />
                        <span className="font-medium drop-shadow">Profile</span>
                      </motion.button>

                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: "rgba(255,255,255,0.1)",
                          x: 4,
                        }}
                        onClick={() => {
                          onSettingsClick?.();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-4 text-left flex items-center space-x-4
                                 text-white rounded-2xl transition-all duration-300
                                 backdrop-blur-sm"
                      >
                        <Settings className="w-6 h-6 drop-shadow" />
                        <span className="font-medium drop-shadow">
                          Settings
                        </span>
                      </motion.button>

                      <div className="border-t border-white/20 mt-2 pt-2">
                        <motion.button
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: "rgba(239, 68, 68, 0.2)",
                            x: 4,
                          }}
                          onClick={() => {
                            onLogout?.();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-4 text-left flex items-center space-x-4
                                   text-red-300 rounded-2xl transition-all duration-300
                                   backdrop-blur-sm"
                        >
                          <LogOut className="w-6 h-6 drop-shadow" />
                          <span className="font-medium drop-shadow">
                            Logout
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Floating Mobile Search */}
        {isSearchExpanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
              scale: 0.9,
              y: -20,
            }}
            animate={{
              height: "auto",
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              height: 0,
              opacity: 0,
              scale: 0.9,
              y: -20,
            }}
            transition={{ duration: 0.4, type: "spring" }}
            className="md:hidden pb-6"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <motion.div
                className={`
                  relative ${currentBg} ${currentBlur}
                  border border-white/30 rounded-3xl
                  shadow-2xl shadow-black/20
                `}
                style={{
                  background: `
                    linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%),
                    linear-gradient(45deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)
                  `,
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.4),
                    0 8px 32px rgba(0,0,0,0.3)
                  `,
                }}
              >
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 
                               w-5 h-5 text-white/70 drop-shadow"
                />
                <input
                  type="text"
                  placeholder="Search the crystalline archives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="
                    w-full pl-12 pr-4 py-4 rounded-3xl
                    bg-transparent text-white placeholder-white/50
                    focus:outline-none font-medium
                  "
                />
              </motion.div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Ambient Light Effect */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 pointer-events-none"
      />
    </motion.header>
  );
};

export default Header;
