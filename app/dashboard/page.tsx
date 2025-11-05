"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Box,
  Clock,
  Layout,
  Loader2,
  Palette,
  TrendingUp,
  Type,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardStats {
  generatedComponentSystems: number;
  generatedPaletteSystems: number;
  generatedTypographySystems: number;
  savedComponentSystems: number;
  savedPaletteSystems: number;
  savedTypographySystems: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const { data } = await axios.get("/api/users-generated-systems");
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchUsersData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Loading your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  const totalGenerated =
    (stats?.generatedComponentSystems || 0) +
    (stats?.generatedPaletteSystems || 0) +
    (stats?.generatedTypographySystems || 0);

  const totalSaved =
    (stats?.savedComponentSystems || 0) +
    (stats?.savedPaletteSystems || 0) +
    (stats?.savedTypographySystems || 0);

  const statCards = [
    {
      title: "Generated Palettes",
      value: stats?.generatedPaletteSystems || 0,
      saved: stats?.savedPaletteSystems || 0,
      icon: Palette,
      gradient: "from-purple-500 to-pink-500",
      bgGradient:
        "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      iconBg: "from-purple-600 to-pink-600",
      borderColor: "border-purple-300 dark:border-purple-700",
    },
    {
      title: "Generated Typography",
      value: stats?.generatedTypographySystems || 0,
      saved: stats?.savedTypographySystems || 0,
      icon: Type,
      gradient: "from-orange-500 to-red-500",
      bgGradient:
        "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      iconBg: "from-orange-600 to-red-600",
      borderColor: "border-orange-300 dark:border-orange-700",
    },
    {
      title: "Generated Components",
      value: stats?.generatedComponentSystems || 0,
      saved: stats?.savedComponentSystems || 0,
      icon: Layout,
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      iconBg: "from-green-600 to-emerald-600",
      borderColor: "border-green-300 dark:border-green-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background */}
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

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Hero Section */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mb-6 flex justify-center"
          >
            <Image
              src="/logo.jpg"
              alt="HueForge Logo"
              width={100}
              height={100}
              className="object-contain rounded-lg"
              priority
            />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Your Dashboard
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Track your creative journey and design system progress
          </p>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
        >
          {/* Total Generated */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">
                    Total
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Total Generated
                  </p>
                  <p className="text-4xl font-black text-slate-900 dark:text-white">
                    {totalGenerated}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Saved */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Box className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">
                    Saved
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Total Saved
                  </p>
                  <p className="text-4xl font-black text-slate-900 dark:text-white">
                    {totalSaved}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Rate */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 group-hover:from-violet-500/10 group-hover:to-purple-500/10 transition-all" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-none">
                    Rate
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Save Rate
                  </p>
                  <p className="text-4xl font-black text-slate-900 dark:text-white">
                    {totalGenerated > 0
                      ? Math.round((totalSaved / totalGenerated) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 group-hover:from-pink-500/10 group-hover:to-rose-500/10 transition-all" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-none">
                    Active
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Active Today
                  </p>
                  <p className="text-4xl font-black text-slate-900 dark:text-white">
                    <Clock className="w-8 h-8 inline-block" />
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Detailed Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Detailed Statistics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {statCards.map((stat, index) => (
              <motion.div key={stat.title} variants={itemVariants}>
                <Card
                  className={`relative overflow-hidden rounded-3xl border-2 ${stat.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 group`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} group-hover:opacity-100 opacity-80 transition-opacity`}
                  />

                  <CardContent className="p-6 relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <motion.div
                        whileHover={{
                          rotate: [0, -10, 10, -10, 0],
                          scale: 1.1,
                        }}
                        transition={{ duration: 0.5 }}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-xl`}
                      >
                        <stat.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div className="text-right">
                        <Badge
                          className={`bg-gradient-to-r ${stat.gradient} text-white border-none shadow-lg`}
                        >
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                      {stat.title}
                    </h3>

                    {/* Stats */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.gradient}`}
                          />
                          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                            Generated
                          </span>
                        </div>
                        <span className="text-3xl font-black text-slate-900 dark:text-white">
                          {stat.value}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                            Saved
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {stat.saved}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Save Rate
                          </span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {stat.value > 0
                              ? Math.round((stat.saved / stat.value) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                stat.value > 0
                                  ? (stat.saved / stat.value) * 100
                                  : 0
                              }%`,
                            }}
                            transition={{
                              duration: 1,
                              delay: 0.5 + index * 0.2,
                            }}
                            className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* View Details Link */}
                    <motion.button
                      whileHover={{ x: 4 }}
                      className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 group/btn"
                      onClick={() => router.push("/dashboard/saved-systems")}
                    >
                      View Details
                      <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
