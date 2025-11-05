"use client";

import { PaletteData } from "@/lib/type";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Eye, PaletteIcon, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteActions from "./DeleteActions";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
interface PaletteSavedProps {
  savedPalettes: PaletteData[];
  setSavedPalettes: React.Dispatch<React.SetStateAction<PaletteData[]>>;
  viewMode: string;
  containerVariants: any;
  itemVariants: any;
  loadingPalettes: boolean;
}

const PaletteSaved: React.FC<PaletteSavedProps> = ({
  savedPalettes,
  setSavedPalettes,
  viewMode,
  itemVariants,
  containerVariants,
  loadingPalettes,
}) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedGradient, setCopiedGradient] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <>
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
                              onClick={() => copyColor(system.id, i, color.hex)}
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
                            }, ${system.colors[system.colors.length - 1].hex})`,
                          }}
                          onClick={() => {
                            const gradient = `linear-gradient(135deg, ${
                              system.colors[0].hex
                            }, ${system.colors[system.colors.length - 1].hex})`;
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
                        className="flex-1 sm:flex-none rounded-xl transition-all duration-200 hover:bg-[#e9e9e9] hover:text-black dark:hover:bg-purple-900/30"
                        onClick={() =>
                          router.push(`/color_palette_page/${system.id}`)
                        }
                      >
                        <Eye className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">View</span>
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
                <h3 className="text-2xl font-bold">No Saved Palettes Yet</h3>
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
    </>
  );
};

export default PaletteSaved;
