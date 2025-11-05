"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyData, TypographyLevel } from "@/lib/type";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Copy,
  Loader2,
  Palette,
  Sparkles,
  Type,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ViewTypography = () => {
  const [typographyData, setTypographyData] = useState<TypographyData | null>(
    null
  );
  const [parsedLevels, setParsedLevels] = useState<TypographyLevel[]>([]);
  const [parsedNames, setParsedNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLevel, setCopiedLevel] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const router = useRouter();
  const params = useParams();
  const typographyId = params.typographyId;

  useEffect(() => {
    const fetchTypography = async () => {
      if (!typographyId) return;
      try {
        const { data } = await axios.get(
          `/api/getIdByTypography/${typographyId}`
        );
        setTypographyData(data.typography);

        // Parse levels
        const levels = JSON.parse(data.typography.levels);
        setParsedLevels(levels);

        // Parse names
        const names = JSON.parse(data.typography.name);
        setParsedNames(names);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching typography:", error);
        setLoading(false);
      }
    };
    fetchTypography();
  }, [typographyId]);

  const copyToClipboard = (text: string, levelId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLevel(levelId);
    setTimeout(() => setCopiedLevel(null), 2000);
  };

  const copyAllCSS = () => {
    const css = parsedLevels
      .map(
        (level) =>
          `.${level.level.toLowerCase().replace(/\s+/g, "-")} {
  font-family: ${level.fontFamily};
  font-size: ${level.size};
  font-weight: ${level.weight};
}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(css);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Loading typography...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!typographyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
            <Type className="w-12 h-12 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Typography Not Found
          </h2>
          <Button
            onClick={() => router.push("/dashboard/saved-systems")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 "
        >
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/saved-systems")}
              className="mb-4 gap-2 hover:bg-orange-100 hover:text-black dark:hover:bg-orange-900/30 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <ThemeToggle />
          </div>

          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border-2 border-white/50 dark:border-white/10 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg"
                  >
                    <Type className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {parsedNames[0] || "Typography System"}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(typographyData.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {parsedNames.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {parsedNames.slice(1).map((name, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1">
                        {name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                      Generated Prompt
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {typographyData.prompt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={copyAllCSS}
                    className="gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
                  >
                    {copiedAll ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied CSS!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All CSS
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Typography Levels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Typography Scale
            </h2>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-none">
              {parsedLevels.length} Levels
            </Badge>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {parsedLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="group"
              >
                <Card className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-300 dark:hover:border-orange-600">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className="text-xs font-semibold"
                        >
                          {level.level}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-mono">{level.size}</span>
                          <span>•</span>
                          <span>Weight {level.weight}</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          copyToClipboard(
                            `font-family: ${level.fontFamily}; font-size: ${level.size}; font-weight: ${level.weight};`,
                            level.level
                          )
                        }
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                      >
                        {copiedLevel === level.level ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-semibold text-green-600">
                              Copied!
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-orange-600" />
                            <span className="text-xs font-semibold text-orange-600">
                              Copy CSS
                            </span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      style={{
                        fontFamily: level.fontFamily,
                        fontSize: level.size,
                        fontWeight: level.weight,
                      }}
                      className="text-slate-900 dark:text-white break-words"
                    >
                      {level.sample}
                    </p>
                    <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
                      <code>
                        font-family: {level.fontFamily};<br />
                        font-size: {level.size};<br />
                        font-weight: {level.weight};
                      </code>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Font Family Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="rounded-2xl shadow-lg border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5 text-orange-600" />
                Primary Font Family
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800">
                <p
                  style={{ fontFamily: typographyData.fontFamily }}
                  className="text-4xl font-bold text-slate-900 dark:text-white mb-4"
                >
                  {typographyData.fontFamily}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                  font-family: {typographyData.fontFamily};
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewTypography;
