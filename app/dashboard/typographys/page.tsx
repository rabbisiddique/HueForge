"use client";

import HueHeader from "@/components/HueHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle,
  Copy,
  SaveAll,
  Sparkles,
  Type,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TypographyLevel {
  level: string;
  sample: string;
  size: string;
  weight: number;
}

interface TypographyPreset {
  fontFamily: string;
  description: string;
  name: string[];
  levels: TypographyLevel[];
}

type CopyFormate = "css" | "tailwind" | "preview";

export default function TypographySection() {
  const [prompt, setPrompt] = useState("");
  const [currentPresetIndex, setCurrentPresetIndex] = useState(0);
  const [typographySamples, setTypographySamples] = useState<
    TypographyPreset[]
  >([]);
  const [lastPrompt, setLastPrompt] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const [copyMode, setCopyMode] = useState<CopyFormate>("tailwind");
  const [isSaveing, setIsSaveing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (sample: any, index: number) => {
    let textToCopy = "";

    switch (copyMode) {
      case "css":
        textToCopy = `
font-family: ${sample.fontFamily};
font-size: ${sample.size};
font-weight: ${sample.weight};
`;
        break;

      case "tailwind":
        textToCopy = `
text-[${sample.size}] font-${sample.weight} font-${sample.fontFamily}
`;
        break;

      case "preview":
        textToCopy = sample.sample;
        break;
    }

    navigator.clipboard.writeText(textToCopy.trim());
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLastPrompt(prompt); // store for later saving

    try {
      const { data } = await axios.post("/api/generate-typography", { prompt });
      console.log(data);

      setTypographySamples(data.typographyPresets);
      toast(data?.message || "Palette saved successfully!", {
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      });
      setPrompt("");
      setIsSaved(false);
    } catch (error: any) {
      console.log(error);
      toast(
        error?.response?.data?.error ||
          "Something went wrong while saving the palette.",
        {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
        }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const savedTypography = async (simple: TypographyPreset): Promise<void> => {
    if (isSaved || isSaveing) return; // prevent multiple clicks
    setIsSaveing(true);
    setIsSaved(false);
    console.log("simple", simple);
    const { fontFamily, name, levels } = simple;
    const promptToSave = lastPrompt || prompt;
    // Take the first color name as palette name (you can change this logic later)
    console.log("simle 2", fontFamily, name, levels);
    console.log("Prompt", prompt);

    try {
      setIsSaveing(true);
      const { data } = await axios.post("/api/saved-typography", {
        fontFamily,
        name,
        levels,
        prompt: promptToSave,
      });
      console.log(data);
      // await new Promise((resolve) => setTimeout(resolve, 500));

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
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            {!isGenerating &&
              typographySamples.map((typo, inx) => (
                <Button
                  key={inx}
                  onClick={() => savedTypography(typo)}
                  disabled={isSaveing || isSaved}
                  className="gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  <SaveAll className="w-4 h-4" />
                  {isSaveing
                    ? "Saving..."
                    : isSaved
                    ? "Saved Typography"
                    : "Save Typography"}
                </Button>
              ))}
          </motion.div>
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
          <div className="w-1 h-8 bg-gradient-to-b from-orange-600 to-red-600 rounded-full" />
          <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            Typography System
          </h2>
        </div>
        <p className="text-base text-muted-foreground ml-3">
          Beautiful font pairings and harmonious type scales
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
            <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500 dark:text-orange-400 transition-transform group-focus-within:scale-110" />
            <Input
              placeholder='e.g., "Bold and modern for a tech startup" or leave empty for auto-generate'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
              className="pl-12 pr-4 h-12 rounded-xl border-2 border-transparent bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 focus:border-orange-500 transition-all"
            />
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 font-semibold whitespace-nowrap"
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

      {/* Typography Content */}
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
              Creating your typography...
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={currentPresetIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: isGenerating ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {typographySamples.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glassmorphism rounded-2xl p-12 text-center shadow-lg border border-white/20 dark:border-white/10"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30 flex items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-700">
                  <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                  No Typography Generated Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Describe your desired color <strong>Typography</strong> and
                  let AI create something beautiful
                </p>

                <Button className="gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                  <Sparkles className="w-5 h-5" />
                  Generate Your First Palette
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glassmorphism rounded-2xl p-6 md:p-8 shadow-lg border border-white/20 dark:border-white/10"
                >
                  {typographySamples.map((simple, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg">
                          <Type className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            Font Families
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Primary typefaces for your design system
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Heading Font */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-6 border border-orange-200/50 dark:border-orange-800/50 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-2xl" />

                          <div className="relative space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-md">
                                Headings
                              </span>
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  H
                                </span>
                              </div>
                            </div>

                            <p className="text-3xl font-bold text-foreground">
                              {simple.fontFamily}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {simple.name.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs text-muted-foreground bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-white/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <p className="text-sm text-muted-foreground pt-2">
                              {simple.description}
                            </p>
                          </div>
                        </motion.div>

                        {/* Body Font */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl" />

                          <div className="relative space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                                Body Text
                              </span>
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  B
                                </span>
                              </div>
                            </div>

                            <p className="text-3xl font-normal text-foreground">
                              {simple.fontFamily}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {simple.name.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs text-muted-foreground bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-white/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <p className="text-sm text-muted-foreground pt-2">
                              {simple.description}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glassmorphism rounded-2xl p-6 md:p-8 shadow-lg border border-white/20 dark:border-white/10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        Type Scale
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Harmonious hierarchy and sizing
                      </p>
                    </div>
                  </div>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Copy Format:
                    </span>
                    <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
                      {[
                        { value: "css" as const, label: "CSS" },
                        { value: "tailwind" as const, label: "Tailwind" },
                        { value: "preview" as const, label: "Preview Text" },
                      ].map((mode) => (
                        <button
                          key={mode.value}
                          onClick={() => setCopyMode(mode.value)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            copyMode === mode.value
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {typographySamples.map((levelPreset, presetIndex) => (
                      <div key={presetIndex} className="space-y-4">
                        {/* Optional: Font Family / Preset Header */}
                        <h4 className="text-lg font-semibold text-foreground">
                          {levelPreset.fontFamily}
                        </h4>

                        {/* Levels */}
                        <div className="space-y-4">
                          {levelPreset.levels.map((sample, sampleIndex) => {
                            const isCopied = copiedIndex === sampleIndex;
                            return (
                              <motion.div
                                key={sampleIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + sampleIndex * 0.05 }}
                                whileHover={{ x: 8 }}
                                className="group relative overflow-hidden rounded-xl bg-white/50 dark:bg-slate-800/50 p-6 border border-white/20 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all"
                              >
                                {/* Background gradient on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative">
                                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                                        {sample.level}
                                      </span>
                                      <span className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded-md">
                                        {sample.size}
                                      </span>
                                      <span className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded-md">
                                        {sample.weight}
                                      </span>
                                    </div>

                                    <button
                                      onClick={() =>
                                        copyToClipboard(sample, sampleIndex)
                                      }
                                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        isCopied
                                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                      }`}
                                    >
                                      {isCopied ? (
                                        <>
                                          <Check className="w-3 h-3" />
                                          Copied!
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          Copy
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  <p
                                    className={`${sample.size} font-[${sample.weight}] text-foreground text-pretty leading-relaxed`}
                                    style={{
                                      fontFamily: levelPreset.fontFamily,
                                    }}
                                  >
                                    {sample.sample}
                                  </p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
