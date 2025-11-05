"use client";

import ComponentSaved from "@/components/ComponentSaved";
import PaletteSaved from "@/components/PaletteSaved";
import TypographySaved from "@/components/TypographySaved";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneratedComponent, PaletteData, TypographyData } from "@/lib/type";
import axios from "axios";
import { motion, Variants } from "framer-motion";
import {
  Grid3x3,
  Layout,
  List,
  Palette as PaletteIcon,
  Sparkles,
  Type,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SavedSection() {
  const [savedTypography, setSavedTypography] = useState<TypographyData[]>([]);
  const [savedComponents, setSavedComponents] = useState<GeneratedComponent[]>(
    []
  );
  const [loadingComponents, setLoadingComponents] = useState<boolean>(false);
  const [loadingPalettes, setLoadingPalettes] = useState<boolean>(false);

  const [savedPalettes, setSavedPalettes] = useState<PaletteData[]>([]);
  const [loadingTypography, setLoadingTypography] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchPalettes = async () => {
      setLoadingPalettes(true);
      try {
        const { data } = await axios.get("/api/get-palette");
        if (!data) throw new Error("Failed to fetch palettes");
        setSavedPalettes(data);
      } catch (error) {
        console.error("Error fetching palettes", error);
      } finally {
        setLoadingPalettes(false);
      }
    };
    fetchPalettes();
  }, []);

  useEffect(() => {
    const fetchTypography = async () => {
      setLoadingTypography(true);
      try {
        const { data } = await axios.get("/api/get-typography");
        if (!data) throw new Error("Failed to fetch typography");
        setSavedTypography(data);
      } catch (error) {
        console.error("Error fetching typography", error);
      } finally {
        setLoadingTypography(false);
      }
    };
    fetchTypography();
  }, []);

  useEffect(() => {
    const fetchComponents = async () => {
      setLoadingComponents(true);
      try {
        const { data } = await axios.get("/api/get-components");
        console.log(data);
        if (!data) throw new Error("Failed to fetch components");

        setSavedComponents(data.components);
      } catch (error) {
        console.error("Error fetching components", error);
      } finally {
        setLoadingComponents(false);
      }
    };
    fetchComponents();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-orange-600/10 dark:from-purple-600/20 dark:via-pink-600/20 dark:to-orange-600/20 p-8 md:p-12 mb-8 border border-purple-200/20 dark:border-purple-500/20"
      >
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  delay: 0.2,
                  stiffness: 200,
                  damping: 20,
                }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-300/20 dark:border-purple-500/30"
              >
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  Your Collection
                </span>
              </motion.div>

              <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Saved Design Systems
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                All your beautiful design assets in one place. Colors,
                typography, and more.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Badge
                variant="secondary"
                className="text-lg px-6 py-2 rounded-full shadow-lg bg-white dark:bg-slate-800 border-2"
              >
                <motion.span
                  key={savedPalettes.length + savedTypography.length}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-bold"
                >
                  {savedPalettes.length + savedTypography.length}
                </motion.span>
                <span className="ml-2">Total Items</span>
              </Badge>

              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-lg border">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="rounded-lg"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="rounded-lg"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-400 to-pink-400 rounded-full blur-3xl opacity-20 pointer-events-none" />
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="palettes" className="w-full">
        <TabsList className="grid w-full  grid-cols-3 mb-8 h-12 bg-white dark:bg-slate-800 border shadow-lg rounded-xl p-1">
          <TabsTrigger
            value="palettes"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all flex items-center gap-2 font-semibold"
          >
            <PaletteIcon className="w-4 h-4" />

            <span className="hidden sm:inline">Palettes</span>

            <Badge variant="secondary" className="ml-1">
              {savedPalettes.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="typography"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white transition-all flex items-center gap-2 font-semibold"
          >
            <Type className="w-4 h-4" />

            <span className="hidden sm:inline">Typography</span>

            <Badge variant="secondary" className="ml-1">
              {savedTypography.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="components"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all flex items-center justify-center gap-2 font-semibold data-[state=active]:shadow-lg"
          >
            <Layout className="w-4 h-4" />
            <span className="hidden sm:inline">Components</span>
            <Badge
              variant="secondary"
              className="ml-1 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:border-white/30"
            >
              {savedComponents.length || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Palettes Tab */}
        <TabsContent value="palettes">
          <PaletteSaved
            savedPalettes={savedPalettes}
            loadingPalettes={loadingPalettes}
            setSavedPalettes={setSavedPalettes}
            viewMode={viewMode}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography">
          <TypographySaved
            savedTypography={savedTypography}
            loadingTypography={loadingTypography}
            setSavedTypography={setSavedTypography}
            viewMode={viewMode}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components">
          <ComponentSaved
            savedComponents={savedComponents}
            loadingComponents={loadingComponents}
            setSavedComponents={setSavedComponents}
            viewMode={viewMode}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
