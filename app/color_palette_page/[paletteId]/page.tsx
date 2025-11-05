"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Loader2,
  Palette,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewPalette() {
  const router = useRouter();
  const [paletteData, setPaletteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { paletteId } = useParams();

  useEffect(() => {
    const fetchPalette = async () => {
      if (!paletteId) return;
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/getIdByPalette/${paletteId}`);
        console.log(data);
        setPaletteData(data.palette);
      } catch (error) {
        console.error("Error fetching palette:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPalette();
  }, [paletteId]);

  const handleCopyColor = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(name);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleCopyAllColors = () => {
    if (!paletteData?.colors) return;
    const colors = JSON.parse(paletteData.colors);
    const colorText = colors.map((c: any) => `${c.name}: ${c.hex}`).join("\n");
    navigator.clipboard.writeText(colorText);
    setCopiedColor("all");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleDownloadPalette = () => {
    if (!paletteData?.colors) return;
    const colors = JSON.parse(paletteData.colors);
    const content = JSON.stringify(colors, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${paletteData.name
      .replace(/\s+/g, "-")
      .toLowerCase()}-palette.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 animate-spin text-emerald-600 dark:text-emerald-500 mx-auto mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Loading Palette...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!paletteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Palette className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Palette Not Found
          </h2>
          <Button
            onClick={() => router.push("/dashboard/saved-systems")}
            variant="outline"
            className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 "
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const colors = JSON.parse(paletteData.colors);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-emerald-500/20 shadow-lg dark:shadow-2xl transition-colors duration-300"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard/saved-systems")}
                className="rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-black"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {paletteData.name}
                </h1>
                <p className="text-sm text-slate-600 dark:text-emerald-400/60">
                  {colors.length} Colors
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <ThemeToggle />

              <Button
                size="sm"
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                onClick={handleCopyAllColors}
              >
                {copiedColor === "all" ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Color Showcase - Large Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {colors.map((color: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group"
            >
              <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl hover:shadow-emerald-500/20">
                <div
                  className="h-48 relative overflow-hidden cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleCopyColor(color.hex, color.name)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {copiedColor === color.name ? (
                        <Check className="w-8 h-8 text-white" />
                      ) : (
                        <Copy className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </motion.div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {color.name}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-emerald-400/60 font-medium">
                        HEX
                      </span>
                      <code className="text-sm font-mono text-emerald-700 dark:text-emerald-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                        {color.hex}
                      </code>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-emerald-400/60 font-medium">
                        RGB
                      </span>
                      <code className="text-sm font-mono text-emerald-700 dark:text-emerald-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                        {color.rgb}
                      </code>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-black"
                    onClick={() => handleCopyColor(color.hex, color.name)}
                  >
                    {copiedColor === color.name ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy HEX
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Horizontal Color Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Palette className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Full Palette Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-6 gap-0 rounded-xl overflow-hidden h-32 shadow-xl dark:shadow-2xl">
                {colors.map((color: any, index: number) => (
                  <motion.div
                    key={index}
                    className="relative group cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    onClick={() => handleCopyColor(color.hex, color.name)}
                  >
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Copy className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPalette}
                  className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
                <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50">
                  Created:{" "}
                  {new Date(paletteData.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white text-lg">
                CSS Variables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-200 dark:border-slate-800">
                <code className="text-sm text-emerald-700 dark:text-emerald-400 font-mono">
                  {`:root {\n${colors
                    .map((c: any, i: number) => `  --color-${i + 1}: ${c.hex};`)
                    .join("\n")}\n}`}
                </code>
              </pre>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white text-lg">
                Tailwind Config
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-200 dark:border-slate-800">
                <code className="text-sm text-emerald-700 dark:text-emerald-400 font-mono">
                  {`colors: {\n${colors
                    .map(
                      (c: any) =>
                        `  '${c.name.toLowerCase().replace(/\s+/g, "-")}': '${
                          c.hex
                        }',`
                    )
                    .join("\n")}\n}`}
                </code>
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
