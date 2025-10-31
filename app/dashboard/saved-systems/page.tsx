"use client";

import DeleteActions from "@/components/DeleteActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneratedComponent } from "@/lib/type";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  Eye,
  Grid3x3,
  Layout,
  List,
  Palette as PaletteIcon,
  Plus,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TypographyLevel {
  level: string;
  size: string;
  weight: number;
  sample: string;
  fontFamily: string;
}

interface TypographyData {
  id: string;
  fontFamily: string;
  levels: string;
  name: string;
  prompt: string;
  createdAt: string;
  userId: string;
}

interface PaletteData {
  id: string;
  name: string;
  colors: { name: string; hex: string; rgb: string }[];
  createdAt: string;
}

export default function SavedSection() {
  const [savedPalettes, setSavedPalettes] = useState<PaletteData[]>([]);
  const [savedTypography, setSavedTypography] = useState<TypographyData[]>([]);
  const [savedComponents, setSavedComponents] = useState<GeneratedComponent[]>(
    []
  );
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedGradient, setCopiedGradient] = useState<string | null>(null);
  const [copiedTypoId, setCopiedTypoId] = useState<string | null>(null);
  const [copyMode, setCopyMode] = useState<"css" | "tailwind" | "preview">(
    "preview"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loadingPalettes, setLoadingPalettes] = useState<boolean>(false);
  const [loadingTypography, setLoadingTypography] = useState<boolean>(false);

  const [loadingComponents, setLoadingComponents] = useState<boolean>(false);
  const [componentViewMode, setComponentViewMode] = useState<{
    [key: string]: "preview" | "code";
  }>({});
  const [copiedComponentId, setCopiedComponentId] = useState<string | null>(
    null
  );
  const router = useRouter();
  // Fetch components
  console.log("components", savedComponents);

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

  const toggleComponentView = (id: string) => {
    setComponentViewMode((prev) => ({
      ...prev,
      [id]: prev[id] === "code" ? "preview" : "code",
    }));
  };

  const handleCopyComponentCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedComponentId(id);
    setTimeout(() => setCopiedComponentId(null), 2000);
  };

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

  const formattedDate = (timeStamp: string) => {
    return formatDistanceToNow(new Date(timeStamp), { addSuffix: true });
  };

  const copyColor = (systemId: string, colorIndex: number, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(`${systemId}-${colorIndex}`);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const copyGradient = (systemId: string, gradient: string) => {
    navigator.clipboard.writeText(gradient);
    setCopiedGradient(systemId);
    setTimeout(() => setCopiedGradient(null), 2000);
  };

  const copyToClipboardTypography = (
    sample: TypographyLevel,
    typoId: string,
    levelIndex: number
  ) => {
    let textToCopy = "";
    switch (copyMode) {
      case "css":
        textToCopy = `font-family: ${sample.fontFamily};
font-size: ${sample.size};
font-weight: ${sample.weight};`;
        break;

      case "tailwind":
        textToCopy = `text-[${sample.size}] font-[${
          sample.weight
        }] font-${sample.fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
        break;

      case "preview":
        textToCopy = sample.sample;
        break;
    }

    navigator.clipboard.writeText(textToCopy.trim());
    const uniqueId = `${typoId}-${levelIndex}`;
    setCopiedTypoId(uniqueId);
    setTimeout(() => setCopiedTypoId(null), 1500);
  };

  const parseTypographyData = (typography: TypographyData) => {
    try {
      const levels: TypographyLevel[] = JSON.parse(typography.levels);
      const names: string[] = JSON.parse(typography.name);
      return { levels, names };
    } catch (error) {
      console.error("Error parsing typography data", error);
      return { levels: [], names: [] };
    }
  };

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
            Palettes
            <Badge variant="secondary" className="ml-1">
              {savedPalettes.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="typography"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white transition-all flex items-center gap-2 font-semibold"
          >
            <Type className="w-4 h-4" />
            Typography
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
          <AnimatePresence mode="wait">
            {loadingPalettes ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="relative overflow-hidden rounded-3xl shadow-lg border-2"
                  >
                    <div className="relative h-32 md:h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
                    <CardHeader className="space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-6 gap-3">
                        {[...Array(6)].map((_, j) => (
                          <div
                            key={j}
                            className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    </CardContent>
                    <CardFooter className="border-t bg-muted/30 pt-4">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : savedPalettes.length > 0 ? (
              <motion.div
                key="palettes-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {savedPalettes.map((system, index) => (
                  <motion.div
                    key={system.id}
                    variants={itemVariants}
                    className="group"
                  >
                    <Card className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-600">
                      <div className="relative h-32 md:h-40 overflow-hidden">
                        <div className="absolute inset-0 flex">
                          {system.colors?.map((color, i) => (
                            <div
                              key={i}
                              className="flex-1 relative"
                              style={{ backgroundColor: color.hex }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          ))}
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            #{index + 1}
                          </span>
                        </div>
                      </div>

                      <CardHeader className="space-y-3 pb-4">
                        <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          {system.name}
                          <Sparkles className="w-5 h-5 text-purple-500" />
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span>{formattedDate(system.createdAt)}</span>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {system.colors.map((color, i) => {
                            const uniqueColorId = `${system.id}-${i}`;
                            const isThisCopied = copiedColor === uniqueColorId;

                            return (
                              <div key={i} className="space-y-2">
                                <button
                                  className="w-full aspect-square rounded-xl shadow-md relative overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                  style={{ backgroundColor: color.hex }}
                                  onClick={() =>
                                    copyColor(system.id, i, color.hex)
                                  }
                                >
                                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                                    {isThisCopied ? (
                                      <Check className="w-5 h-5 text-white drop-shadow-lg" />
                                    ) : (
                                      <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
                                    )}
                                  </div>
                                </button>
                                <div className="text-center">
                                  <p className="text-xs font-semibold truncate">
                                    {color.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-muted-foreground">
                                    {color.hex}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {system.colors.length >= 2 && (
                          <div className="space-y-2 pt-2">
                            <p className="text-sm font-semibold text-muted-foreground">
                              Gradient Preview
                            </p>
                            <button
                              className="w-full h-20 rounded-xl shadow-md relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                              style={{
                                background: `linear-gradient(135deg, ${
                                  system.colors[0].hex
                                }, ${
                                  system.colors[system.colors.length - 1].hex
                                })`,
                              }}
                              onClick={() => {
                                const gradient = `linear-gradient(135deg, ${
                                  system.colors[0].hex
                                }, ${
                                  system.colors[system.colors.length - 1].hex
                                })`;
                                copyGradient(system.id, gradient);
                              }}
                            >
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                                {copiedGradient === system.id ? (
                                  <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 px-4 py-2 rounded-full shadow-lg">
                                    <Check className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium">
                                      Copied!
                                    </span>
                                  </div>
                                ) : (
                                  <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
                                )}
                              </div>
                            </button>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t bg-muted/30 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                            {system.colors.length}
                          </div>
                          <span className="text-sm font-medium">Colors</span>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 sm:flex-none rounded-xl transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                          >
                            <Eye className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 sm:flex-none rounded-xl transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          >
                            <Download className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Export</span>
                          </Button>
                          <DeleteActions
                            component={{
                              id: system.id,
                              componentName: system.name,
                            }}
                            apiEndpoint="/api/save-palette"
                            onDelete={(id) =>
                              setSavedPalettes((prev) =>
                                prev.filter((p) => p.id !== id)
                              )
                            }
                          />{" "}
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-palettes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-[400px]"
              >
                <div className="text-center space-y-6 max-w-md mx-auto px-4">
                  <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-orange-600/20 flex items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-600">
                    <PaletteIcon className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">
                      No Saved Palettes Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Start creating beautiful color palettes
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Palette
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography">
          {/* Copy Mode Selector */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Copy as:
              </span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg p-1 shadow border">
                <Button
                  size="sm"
                  variant={copyMode === "preview" ? "default" : "ghost"}
                  onClick={() => setCopyMode("preview")}
                  className="rounded-md text-xs"
                >
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant={copyMode === "css" ? "default" : "ghost"}
                  onClick={() => setCopyMode("css")}
                  className="rounded-md text-xs"
                >
                  CSS
                </Button>
                <Button
                  size="sm"
                  variant={copyMode === "tailwind" ? "default" : "ghost"}
                  onClick={() => setCopyMode("tailwind")}
                  className="rounded-md text-xs"
                >
                  Tailwind
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loadingTypography ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="relative overflow-hidden rounded-3xl shadow-lg border-2"
                  >
                    <div className="relative h-32 md:h-40 bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30 p-6 border-b animate-pulse" />
                    <CardHeader className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                      </div>
                      <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      </div>
                      <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/30 pt-4">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : savedTypography.length > 0 ? (
              <motion.div
                key="typography-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {savedTypography.map((typo, index) => {
                  const { levels, names } = parseTypographyData(typo);
                  const heading1 = levels.find((l) => l.level === "Heading 1");
                  const body = levels.find((l) => l.level === "Body");

                  return (
                    <motion.div
                      key={typo.id}
                      variants={itemVariants}
                      className="group"
                    >
                      <Card className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 hover:border-orange-300 dark:hover:border-orange-600">
                        <div className="relative h-32 md:h-40 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30 p-6 flex flex-col justify-center border-b">
                          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                              #{index + 1}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Type className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                              <h3 className="text-lg font-bold text-foreground">
                                {names[0] || "Typography System"}
                              </h3>
                            </div>
                            {typo.prompt && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {typo.prompt}
                              </p>
                            )}
                          </div>
                        </div>

                        <CardHeader className="space-y-3 pb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>{formattedDate(typo.createdAt)}</span>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {names.slice(0, 3).map((name, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                              >
                                {name}
                              </Badge>
                            ))}
                          </div>

                          {heading1 && (
                            <div className="space-y-4">
                              <div
                                className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200/30 dark:border-orange-800/30 cursor-pointer hover:shadow-md transition-all"
                                onClick={() =>
                                  copyToClipboardTypography(
                                    heading1,
                                    typo.id,
                                    0
                                  )
                                }
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">
                                    {heading1.level}
                                  </span>
                                  {copiedTypoId === `${typo.id}-0` ? (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <Check className="w-4 h-4" />
                                      <span className="text-xs font-medium">
                                        Copied!
                                      </span>
                                    </div>
                                  ) : (
                                    <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  )}
                                </div>
                                <p
                                  className="text-2xl font-bold text-foreground"
                                  style={{
                                    fontFamily: heading1.fontFamily,
                                    fontWeight: heading1.weight,
                                  }}
                                >
                                  {heading1.sample}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2 font-mono">
                                  {heading1.size} • {heading1.weight}
                                </p>
                                {copyMode !== "preview" && (
                                  <div className="mt-2 p-2 bg-white/50 dark:bg-slate-900/50 rounded text-xs font-mono text-muted-foreground">
                                    {copyMode === "css" && (
                                      <div>
                                        font-family: {heading1.fontFamily};
                                        <br />
                                        font-size: {heading1.size};<br />
                                        font-weight: {heading1.weight};
                                      </div>
                                    )}
                                    {copyMode === "tailwind" && (
                                      <div>
                                        text-[{heading1.size}] font-[
                                        {heading1.weight}]
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {body && (
                                <div
                                  className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/30 dark:border-blue-800/30 cursor-pointer hover:shadow-md transition-all"
                                  onClick={() =>
                                    copyToClipboardTypography(body, typo.id, 1)
                                  }
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                                      {body.level}
                                    </span>
                                    {copiedTypoId === `${typo.id}-1` ? (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <Check className="w-4 h-4" />
                                        <span className="text-xs font-medium">
                                          Copied!
                                        </span>
                                      </div>
                                    ) : (
                                      <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                  </div>
                                  <p
                                    className="text-base text-foreground leading-relaxed"
                                    style={{
                                      fontFamily: body.fontFamily,
                                      fontWeight: body.weight,
                                    }}
                                  >
                                    {body.sample}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                                    {body.size} • {body.weight}
                                  </p>
                                  {copyMode !== "preview" && (
                                    <div className="mt-2 p-2 bg-white/50 dark:bg-slate-900/50 rounded text-xs font-mono text-muted-foreground">
                                      {copyMode === "css" && (
                                        <div>
                                          font-family: {body.fontFamily};<br />
                                          font-size: {body.size};<br />
                                          font-weight: {body.weight};
                                        </div>
                                      )}
                                      {copyMode === "tailwind" && (
                                        <div>
                                          text-[{body.size}] font-[{body.weight}
                                          ]
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                              {levels.length}
                            </div>
                            <span className="text-sm font-medium">
                              Typography Levels
                            </span>
                          </div>
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t bg-muted/30 pt-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300"
                            >
                              {names.length}{" "}
                              {names.length === 1 ? "Font" : "Fonts"}
                            </Badge>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 sm:flex-none rounded-xl transition-all duration-200 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                            >
                              <Eye className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 sm:flex-none rounded-xl transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            >
                              <Download className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Export</span>
                            </Button>
                            <DeleteActions
                              component={{
                                id: typo.id,
                                componentName: typo.name,
                              }}
                              apiEndpoint="/api/saved-typography"
                              onDelete={(id) =>
                                setSavedTypography((prev) =>
                                  prev.filter((c) => c.id !== id)
                                )
                              }
                            />
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty-typography"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-[400px]"
              >
                <div className="text-center space-y-6 max-w-md mx-auto px-4">
                  <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-orange-600/20 via-red-600/20 to-pink-600/20 flex items-center justify-center border-2 border-dashed border-orange-300 dark:border-orange-600">
                    <Type className="w-16 h-16 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">
                      No Typography Systems Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Start creating beautiful typography systems
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First System
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components">
          <AnimatePresence mode="wait">
            {loadingComponents ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="relative overflow-hidden rounded-3xl shadow-lg border-2"
                  >
                    <div className="relative h-32 md:h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
                    <CardHeader className="space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-6 gap-3">
                        {[...Array(6)].map((_, j) => (
                          <div
                            key={j}
                            className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    </CardContent>
                    <CardFooter className="border-t bg-muted/30 pt-4">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : savedComponents.length > 0 ? (
              <motion.div
                key="components-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {savedComponents.map((component, index) => (
                  <motion.div
                    key={component.id}
                    variants={itemVariants}
                    className="group"
                  >
                    <Card className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-400 dark:hover:border-green-600">
                      {/* Header with gradient */}
                      <div className="relative h-48 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 p-6 border-b overflow-hidden">
                        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[size:20px_20px]" />

                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="relative z-10 h-full flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-2xl"
                          >
                            <Layout className="w-10 h-10 text-white" />
                          </motion.div>
                        </div>
                      </div>

                      <CardHeader className="space-y-3 pb-4">
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-xl font-bold flex items-center gap-2 flex-1">
                            <span className="line-clamp-1">
                              {component.componentName}
                            </span>
                            <Sparkles className="w-4 h-4 text-green-500 flex-shrink-0" />
                          </CardTitle>
                        </div>

                        <CardDescription className="line-clamp-2">
                          {component.description}
                        </CardDescription>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span>{formattedDate(component.createdAt)}</span>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Tech Stack Tags */}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Tech Stack
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {component.techStack.slice(0, 4).map((tech, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs"
                              >
                                {tech}
                              </Badge>
                            ))}
                            {component.techStack.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{component.techStack.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Code Preview */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Code Preview
                          </p>
                          <div className="relative rounded-xl bg-slate-900 dark:bg-slate-950 p-4 overflow-hidden border border-slate-700">
                            <div className="absolute top-2 right-2 flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                              <div className="w-2 h-2 rounded-full bg-yellow-500" />
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                            <pre className="text-xs text-green-400 font-mono overflow-hidden line-clamp-3 mt-4">
                              {component.codeFiles?.[0]?.content.replace(
                                /\\n/g,
                                "\n"
                              ) || "No code available"}
                            </pre>
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="flex items-center gap-2 pt-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                            {component.codeFiles?.length || 1}
                          </div>
                          <span className="text-sm font-medium">
                            {component.codeFiles?.length === 1
                              ? "File"
                              : "Files"}
                          </span>
                          <Badge className="ml-auto bg-green-600 text-white border-none">
                            {component.category}
                          </Badge>
                        </div>
                      </CardContent>

                      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t bg-muted/30 pt-4">
                        <div className="flex gap-2 w-full">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              router.push(`/components_page/${component.id}`)
                            }
                            className="flex-1 sm:flex-none rounded-xl transition-all duration-200  hover:bg-green-100 dark:hover:text-white dark:hover:bg-black/10"
                          >
                            <Eye className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCopyComponentCode(
                                component.id,
                                component.codeFiles?.[0]?.content.replace(
                                  /\\n/g,
                                  "\n"
                                ) || "No code available right now"
                              )
                            }
                            className="flex-1 sm:flex-none rounded-xl transition-all duration-200 hover:bg-white/50 hover:text-black dark:hover:bg-black/30 dark:hover:text-white "
                          >
                            {copiedComponentId === component.id ? (
                              <>
                                <Check className="w-4 h-4 sm:mr-2 text-green-600" />
                                <span className="hidden sm:inline text-green-600">
                                  Copied!
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Copy</span>
                              </>
                            )}
                          </Button>
                          <DeleteActions
                            component={{
                              id: component.id,
                              componentName: component.componentName,
                            }}
                            apiEndpoint="/api/saved-component"
                            onDelete={(id) =>
                              setSavedComponents((prev) =>
                                prev.filter((c) => c.id !== id)
                              )
                            }
                          />
                        </div>
                      </CardFooter>

                      {/* Expanded View Modal */}
                      <AnimatePresence>
                        {componentViewMode[component.id] && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white dark:bg-slate-900 z-50 overflow-auto"
                          >
                            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b p-4 flex items-center justify-between z-10">
                              <h3 className="font-bold text-lg">
                                {component.componentName}
                              </h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  toggleComponentView(component.id)
                                }
                                className="rounded-lg"
                              >
                                <X className="w-5 h-5" />
                              </Button>
                            </div>
                            <div className="p-6">
                              {componentViewMode[component.id] === "code" ? (
                                <pre className="bg-slate-900 dark:bg-slate-950 text-green-400 p-6 rounded-xl overflow-auto text-sm font-mono">
                                  {component.codeFiles?.[0]?.content.replace(
                                    /\\n/g,
                                    "\n"
                                  ) || "No code available right now"}
                                </pre>
                              ) : (
                                <div className="flex items-center justify-center min-h-[400px] bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed">
                                  {/* <LivePlayground
                                    code={
                                      component.previewCode ||
                                      component.codeFiles?.[0]?.content
                                    }
                                  /> */}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-components"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-[400px]"
              >
                <div className="text-center space-y-6 max-w-md mx-auto px-4">
                  <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-green-600/20 via-emerald-600/20 to-teal-600/20 flex items-center justify-center border-2 border-dashed border-green-300 dark:border-green-700">
                    <Layout className="w-16 h-16 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">
                      No Components Saved Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Generate components from the Components section and save
                      them here
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => router.push("/components")}
                    className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Go to Components
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
