"use client";

import HueHeader from "@/components/HueHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle,
  CircleCheck,
  Copy,
  SaveAll,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
interface PaletteData {
  name: string;
  rgb: string;
  hex: string;
}

export default function PaletteSection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [colorPalette, setColorPalette] = useState<PaletteData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaveing, setIsSaveing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const copyToClipboard = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyGradient = (startIndex: number) => {
    if (colorPalette.length < 2) return;

    const endIndex = (startIndex + 1) % colorPalette.length;
    const gradient = `linear-gradient(135deg, ${colorPalette[startIndex].hex}, ${colorPalette[endIndex].hex})`;

    navigator.clipboard.writeText(gradient);
    setCopiedIndex(startIndex);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const generatePalette = async () => {
    setIsGenerating(true);
    try {
      const { data } = await axios.post("/api/generate-palette", {
        colorPalette: prompt,
      });

      if (data) {
        setColorPalette(data.colors);
        toast(data?.message || "Palette generated successfully!", {
          icon: <CircleCheck className="w-4 h-4 text-green-500" />,
        });
      }

      setPrompt("");
      setIsSaved(false);
    } catch (error: any) {
      console.log(error);
      toast(
        error.response?.data?.error ||
          "Something went wrong while generating the palette.",
        {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
        }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const savedPalette = async () => {
    if (isSaved || isSaveing) return;
    setIsSaveing(true);
    setIsSaved(false);
    if (colorPalette.length === 0) return;

    // Take the first color name as palette name (you can change this logic later)
    const name = colorPalette[0].name;

    try {
      setIsSaveing(true);

      const { data } = await axios.post("/api/save-palette", {
        colorPalette,
        name,
      });

      toast(data?.message || "Palette saved successfully!", {
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      });
      setIsSaved(true);
    } catch (error: any) {
      console.error("Error saving palette:", error);
      toast(
        error.response?.data?.error ||
          "Something went wrong while saving the palette.",
        {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
        }
      );
    } finally {
      setIsSaveing(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-orange-600/10 dark:from-purple-600/20 dark:via-pink-600/20 dark:to-orange-600/20 p-6 md:p-8 border border-purple-200/20 dark:border-purple-500/20"
      >
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <HueHeader />
          </div>

          {!isGenerating && colorPalette.length >= 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Button
                onClick={savedPalette}
                disabled={isSaveing || isSaved}
                className="gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <SaveAll className="w-4 h-4" />
                {isSaveing
                  ? "Saving..."
                  : isSaved
                  ? "Saved Palette"
                  : "Save Palette"}{" "}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-400 to-pink-400 rounded-full blur-3xl opacity-20 pointer-events-none" />
      </motion.div>

      {/* Title and Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full" />
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Color Palette Generator
          </h2>
        </div>
        <p className="text-base text-muted-foreground ml-3">
          Create stunning, AI-powered color harmonies for your designs
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glassmorphism rounded-2xl p-6 shadow-lg border border-white/20 dark:border-white/10"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative group">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 dark:text-purple-400 transition-transform group-focus-within:scale-110" />
            <Input
              placeholder='e.g., "Vibrant sunset", "Ocean breeze", "Professional dark mode"'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && generatePalette()}
              className="pl-12 pr-4 h-12 rounded-xl border-2 border-transparent bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 transition-all"
            />
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={generatePalette}
              disabled={isGenerating || !prompt.trim()}
              className="gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 font-semibold"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate New
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Color Cards Grid */}
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glassmorphism rounded-2xl p-8 shadow-lg border border-white/20 dark:border-white/10 flex flex-col items-center justify-center space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent"
            />
            <p className="text-muted-foreground animate-pulse">
              Creating your color palette...
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={colorPalette[0]?.hex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {colorPalette.map((color, index) => (
              <motion.div
                key={`${color.name}-${color.hex}`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="group"
              >
                <button
                  onClick={() => copyToClipboard(color.hex, index)}
                  className="w-full glassmorphism rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-white/20 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {/* Color Preview */}
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <motion.div
                      className="w-full h-40 rounded-xl shadow-md"
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: `0 8px 32px ${color.hex}60`,
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Copy indicator */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: copiedIndex === index ? 1 : 0 }}
                          className="bg-white/95 dark:bg-slate-900/95 rounded-full p-3 shadow-lg"
                        >
                          <Check className="w-6 h-6 text-green-600" />
                        </motion.div>
                      </div>

                      {/* Hover copy icon */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2">
                          <Copy className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Color Info */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-foreground">
                        {color.name}
                      </h3>
                      {copiedIndex === index && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full"
                        >
                          Copied!
                        </motion.span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-white dark:border-slate-700 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-mono font-semibold text-foreground">
                        {color.hex}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground font-mono">
                        RGB: {color.rgb}
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Preview Section */}
      {!isGenerating && colorPalette.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glassmorphism rounded-2xl p-6 md:p-8 shadow-lg border border-white/20 dark:border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Gradient Variations
              </h3>
              <p className="text-sm text-muted-foreground">
                Click to copy gradient CSS
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* First Gradient */}
            <div className="space-y-3">
              <button
                onClick={() => copyGradient(0)}
                className="relative group w-full h-40 rounded-2xl shadow-lg cursor-pointer transition-all hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colorPalette[0].hex}, ${colorPalette[1].hex})`,
                }}
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  {copiedIndex === 0 ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white/95 dark:bg-slate-900/95 rounded-full p-3 shadow-lg"
                    >
                      <Check className="w-6 h-6 text-green-600" />
                    </motion.div>
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm rounded-full p-3">
                      <Copy className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Color dots */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: colorPalette[0].hex }}
                  />
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: colorPalette[1].hex }}
                  />
                </div>
              </button>

              <div className="bg-muted/30 dark:bg-slate-800/30 rounded-xl p-3 border border-white/10">
                <p className="text-xs font-mono text-muted-foreground break-all leading-relaxed">
                  {`linear-gradient(135deg, ${colorPalette[0].hex}, ${colorPalette[1].hex})`}
                </p>
              </div>
            </div>

            {/* Second Gradient */}
            <div className="space-y-3">
              <button
                onClick={() => copyGradient(1)}
                className="relative group w-full h-40 rounded-2xl shadow-lg cursor-pointer transition-all hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colorPalette[1].hex}, ${colorPalette[0].hex})`,
                }}
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  {copiedIndex === 1 ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white/95 dark:bg-slate-900/95 rounded-full p-3 shadow-lg"
                    >
                      <Check className="w-6 h-6 text-green-600" />
                    </motion.div>
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm rounded-full p-3">
                      <Copy className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Color dots */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: colorPalette[1].hex }}
                  />
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: colorPalette[0].hex }}
                  />
                </div>
              </button>

              <div className="bg-muted/30 dark:bg-slate-800/30 rounded-xl p-3 border border-white/10">
                <p className="text-xs font-mono text-muted-foreground break-all leading-relaxed">
                  {`linear-gradient(135deg, ${colorPalette[1].hex}, ${colorPalette[0].hex})`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!isGenerating && colorPalette.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glassmorphism rounded-2xl p-12 text-center shadow-lg border border-white/20 dark:border-white/10"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30 flex items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-700">
            <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">
            No Palette Generated Yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Describe your desired color palette and let AI create something
            beautiful
          </p>

          <Button className="gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
            <Sparkles className="w-5 h-5" />
            Generate Your First Palette
          </Button>
        </motion.div>
      )}
    </div>
  );
}
