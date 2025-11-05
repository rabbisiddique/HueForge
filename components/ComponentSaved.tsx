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

import { GeneratedComponent } from "@/lib/type";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Eye, Layout, Plus, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
interface ComponentSavedProps {
  savedComponents: GeneratedComponent[];
  setSavedComponents: React.Dispatch<
    React.SetStateAction<GeneratedComponent[]>
  >;
  viewMode: string;
  containerVariants: any;
  itemVariants: any;
  loadingComponents: boolean;
}
const ComponentSaved: React.FC<ComponentSavedProps> = ({
  savedComponents,
  setSavedComponents,
  viewMode,
  containerVariants,
  itemVariants,
  loadingComponents,
}) => {
  const [copiedComponentId, setCopiedComponentId] = useState<string | null>(
    null
  );
  const [componentViewMode, setComponentViewMode] = useState<{
    [key: string]: "preview" | "code";
  }>({});
  const router = useRouter();

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

  const formattedDate = (timeStamp: string) => {
    return formatDistanceToNow(new Date(timeStamp), { addSuffix: true });
  };
  return (
    <>
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
                        {component.codeFiles?.length === 1 ? "File" : "Files"}
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
                        className="flex-1 sm:flex-none rounded-xl transition-all duration-200  hover:bg-[#e9e9e9] hover:text-black dark:hover:text-white dark:hover:bg-black/10"
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
                            onClick={() => toggleComponentView(component.id)}
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
                <h3 className="text-2xl font-bold">No Components Saved Yet</h3>
                <p className="text-muted-foreground">
                  Generate components from the Components section and save them
                  here
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
    </>
  );
};

export default ComponentSaved;
