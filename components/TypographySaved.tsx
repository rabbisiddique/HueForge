"use client";

import DeleteActions from "@/components/DeleteActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { TypographyData, TypographyLevel } from "@/lib/type";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Eye, Plus, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface TypographySavedProps {
  savedTypography: TypographyData[];
  setSavedTypography: React.Dispatch<React.SetStateAction<TypographyData[]>>;
  viewMode: string;
  containerVariants: any;
  itemVariants: any;
  loadingTypography: boolean;
}
const TypographySaved: React.FC<TypographySavedProps> = ({
  savedTypography,
  setSavedTypography,
  viewMode,
  containerVariants,
  itemVariants,
  loadingTypography,
}) => {
  const [copiedTypoId, setCopiedTypoId] = useState<string | null>(null);
  const [copyMode, setCopyMode] = useState<"css" | "tailwind" | "preview">(
    "preview"
  );
  const router = useRouter();

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
  const formattedDate = (timeStamp: string) => {
    return formatDistanceToNow(new Date(timeStamp), { addSuffix: true });
  };

  return (
    <>
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
                              copyToClipboardTypography(heading1, typo.id, 0)
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
                                      text-[{body.size}] font-[{body.weight}]
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
                          {names.length} {names.length === 1 ? "Font" : "Fonts"}
                        </Badge>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 sm:flex-none rounded-xl transition-all duration-200 hover:bg-[#e9e9e9] hover:text-black dark:hover:bg-orange-900/30"
                          onClick={() =>
                            router.push(`/typography_page/${typo.id}`)
                          }
                        >
                          <Eye className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">View</span>
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
    </>
  );
};

export default TypographySaved;
