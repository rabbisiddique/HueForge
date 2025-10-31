"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Layout,
  LogOut,
  Menu,
  Palette,
  Save,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const sidebarItems = [
    {
      icon: Home,
      label: "Home",
      href: "/dashboard",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Palette,
      label: "Palette",
      href: "/dashboard/palettes",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Type,
      label: "Typography",
      href: "/dashboard/typographys",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Layout,
      label: "Components",
      href: "/dashboard/generate-components",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Save,
      label: "Saved",
      href: "/dashboard/saved-systems",
      gradient: "from-indigo-500 to-blue-500",
    },
  ];

  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (isSignedIn && userId) {
      fetch("/api/users", { method: "POST" });
    }
  }, [isSignedIn, userId]);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"
            animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl"
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6 text-slate-900 dark:text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Sidebar Desktop */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            width: isCollapsed ? "6rem" : "18rem",
          }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="hidden lg:flex fixed left-0 top-0 h-full border-r border-slate-200 dark:border-slate-800 backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 p-6 flex-col z-40 shadow-2xl"
        >
          {/* Logo & Toggle */}
          <div
            className={`flex items-center ${
              isCollapsed ? "flex-col" : "justify-between"
            } mb-8 gap-4`}
          >
            {!isCollapsed && (
              <Link href="/" className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0"
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                    HueForge
                  </span>
                </motion.div>
              </Link>
            )}

            {isCollapsed && (
              <Link href="/">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg mx-auto"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
              </Link>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-hidden">
            {sidebarItems.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center ${
                          isCollapsed ? "justify-center" : "gap-3"
                        } px-4 py-3.5 rounded-xl transition-all relative overflow-hidden group cursor-pointer mb-3 ${
                          active
                            ? "shadow-lg"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {active && (
                          <motion.div
                            layoutId="activeTab"
                            className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl`}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}

                        <motion.div
                          animate={active ? { rotate: [0, 10, -10, 0] } : {}}
                          transition={{ duration: 0.5 }}
                          className="relative z-10"
                        >
                          <item.icon
                            className={`w-5 h-5 ${active ? "text-white" : ""}`}
                          />
                        </motion.div>

                        {!isCollapsed && (
                          <>
                            <span
                              className={`font-semibold relative z-10 ${
                                active ? "text-white" : ""
                              }`}
                            >
                              {item.label}
                            </span>

                            {active && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="ml-auto relative z-10"
                              >
                                <ChevronRight className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </>
                        )}
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent
                      side="right"
                      className="bg-slate-900 text-white border-slate-700"
                    >
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-6 border-t-2 border-slate-200 dark:border-slate-800">
            {!isCollapsed ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Theme
                  </span>
                  <ThemeToggle />
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="px-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-xl shadow-lg",
                      },
                    }}
                  />
                </motion.div>

                <Link href="/">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-semibold">Log Out</span>
                    </Button>
                  </motion.div>
                </Link>
              </>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex justify-center p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
                    >
                      <ThemeToggle />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-slate-900 text-white border-slate-700"
                  >
                    <p>Toggle Theme</p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-xl shadow-lg",
                      },
                    }}
                  />
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-full text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
                        >
                          <LogOut className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-slate-900 text-white border-slate-700"
                  >
                    <p>Log Out</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </motion.aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="lg:hidden fixed left-0 top-0 h-full w-72 border-r border-slate-200 dark:border-slate-800 backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 p-6 flex flex-col z-50 shadow-2xl overflow-y-auto"
              >
                {/* Logo */}
                <Link href="/">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 mb-8 p-3 rounded-xl"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg"
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      HueForge
                    </span>
                  </motion.div>
                </Link>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                  {sidebarItems.map((item, index) => {
                    const active = isActive(item.href);
                    return (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative overflow-hidden cursor-pointer ${
                            active
                              ? "shadow-lg"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {active && (
                            <motion.div
                              layoutId="activeMobileTab"
                              className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl`}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            />
                          )}

                          <item.icon
                            className={`w-5 h-5 relative z-10 ${
                              active ? "text-white" : ""
                            }`}
                          />
                          <span
                            className={`font-semibold relative z-10 ${
                              active ? "text-white" : ""
                            }`}
                          >
                            {item.label}
                          </span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </nav>

                {/* Bottom Actions */}
                <div className="space-y-3 pt-6 border-t-2 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>

                  <div className="px-2">
                    <UserButton />
                  </div>

                  <Link href="/">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-semibold">Log Out</span>
                    </Button>
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
