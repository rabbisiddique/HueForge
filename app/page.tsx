"use client";
import { useTheme } from "@/components/theme-provider";
import { motion, TargetAndTransition, Variants } from "framer-motion";
import {
  ArrowRight,
  Layers,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const LandingPage = () => {
  const [page, setPage] = useState("landing");
  const { theme, toggleTheme } = useTheme();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const floatingAnimation: TargetAndTransition = {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`min-h-screen relative overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={floatingAnimation}
          className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-30 ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-500 to-pink-500"
              : "bg-gradient-to-r from-blue-400 to-purple-400"
          }`}
        />
        <motion.div
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1 },
          }}
          className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-30 ${
            theme === "dark"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500"
              : "bg-gradient-to-r from-orange-400 to-pink-400"
          }`}
        />
        <motion.div
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 2 },
          }}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            theme === "dark"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500"
              : "bg-gradient-to-r from-purple-400 to-pink-400"
          }`}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                theme === "dark"
                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                  : "bg-gradient-to-br from-blue-600 to-purple-600"
              } shadow-lg`}
            >
              <Palette className="w-7 h-7 text-white" />
            </div>
            <span
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              HueForge
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all ${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-white/60 hover:bg-white/80 text-gray-900"
              } backdrop-blur-sm shadow-lg`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Link
              href={"/sign-in"}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-white/60 hover:bg-white/80 text-gray-900"
              } backdrop-blur-sm shadow-lg`}
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl mb-8 shadow-lg"
            style={{
              background:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(255, 255, 255, 0.6)",
            }}
          >
            <Sparkles
              className={`w-4 h-4 ${
                theme === "dark" ? "text-purple-400" : "text-purple-600"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              AI-Powered Design Systems
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={`text-6xl md:text-8xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Design Systems
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Reimagined
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Generate beautiful, consistent design systems in seconds with the
            power of AI. Perfect colors, typography, and components — instantly.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage("signup")}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-2xl font-semibold text-lg shadow-2xl overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.5 }}
              />
              <span className="relative flex items-center gap-2">
                Start Creating Free
                <ArrowRight className="w-5 h-5" />
              </span>
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(168, 85, 247, 0.4)",
                    "0 0 40px rgba(236, 72, 153, 0.4)",
                    "0 0 20px rgba(168, 85, 247, 0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-2xl font-semibold text-lg backdrop-blur-xl shadow-lg ${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-white/60 hover:bg-white/80 text-gray-900"
              }`}
            >
              View Demo
            </motion.button>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
        >
          {[
            {
              icon: Zap,
              title: "darkning Fast",
              desc: "Generate complete systems in seconds",
            },
            {
              icon: Layers,
              title: "Smart Components",
              desc: "Pre-built, accessible UI components",
            },
            {
              icon: Sparkles,
              title: "AI-Powered",
              desc: "Intelligent color and typography pairing",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`p-8 rounded-3xl backdrop-blur-xl shadow-2xl border ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white/40 border-white/60 hover:bg-white/60"
              } transition-all`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                    : "bg-gradient-to-br from-blue-600 to-purple-600"
                } shadow-lg`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
              >
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
