"use client";

import CodeBlock from "@/components/CodeBlock";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { handleDownload } from "@/lib/downloadFiles";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Box,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Download,
  FileCode,
  Maximize2,
  Menu,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ComponentViewPage() {
  const router = useRouter();
  const [component, setComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("preview");
  const [copiedCode, setCopiedCode] = useState(false);
  const [expandedFile, setExpandedFile] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const params = useParams();
  const componentId = params.componentId;
  console.log(component);

  useEffect(() => {
    const fetchComponent = async () => {
      if (!componentId) return;
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/getById/${componentId}`);
        console.log(data);
        setComponent(data.component);
      } catch (error) {
        console.error("Error fetching component:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComponent();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-green-200 dark:border-green-800 border-t-green-600 rounded-full"
          />
          <Sparkles className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Box className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-bold">Component Not Found</h2>
          <Button
            onClick={() => router.push("/dashboard/generate-components")}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Description Card */}
      <Card className="border-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {component.description}
          </p>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {component.techStack?.map((tech: string, i: number) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {component.category && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Category
              </p>
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-none text-xs">
                {component.category}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files Card */}
      {component.codeFiles && component.codeFiles.length > 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileCode className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Files ({component.codeFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {component.codeFiles.map((file: any, index: number) => (
              <div
                key={index}
                className="p-2.5 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-600 transition-colors cursor-pointer"
                onClick={() => setExpandedFile(index)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium truncate">
                      {file.filename}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {file.language}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions Card */}
      <Card className="border-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="glass"
            className="w-full justify-start gap-2 rounded-lg text-sm hover:bg-black/10 dark:hover:bg-white/10"
            onClick={() =>
              handleDownload(
                component.codeFiles?.[0]?.filename || "component.tsx",
                component.codeFiles?.[0]?.content ||
                  component.codeFiles?.[0]?.content
              )
            }
          >
            <Download className="w-4 h-4" />
            Download Files
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-lg"
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard/generate-components")}
                className="rounded-xl flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/10 hover:dark:bg-black/10 hover:dark:text-black transition-all duration-500"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-xl flex-shrink-0 lg:hidden h-8 w-8 sm:h-10 sm:w-10 hover:bg-black/10 dark:hover:bg-white/10"
              >
                {isSidebarOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>

              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent truncate">
                  {component.componentName}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block truncate">
                  {component.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <ThemeToggle />

              <Button
                size="sm"
                className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-8 sm:h-9 px-2 sm:px-3"
                onClick={() =>
                  handleCopyCode(component.codeFiles?.[0]?.content)
                }
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 z-50 overflow-y-auto p-4 lg:hidden shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Component Info</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarOpen(false)}
                      className="rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <SidebarContent />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop Sidebar */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:block lg:col-span-1"
          >
            <SidebarContent />
          </motion.div>

          {/* Right Content - Preview & Code */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-2 border-slate-200 dark:border-slate-800">
              <CardHeader className="border-b p-3 sm:p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12">
                    <TabsTrigger
                      value="preview"
                      className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-xs sm:text-sm"
                    >
                      <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Code JSX
                    </TabsTrigger>
                    <TabsTrigger
                      value="code"
                      className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs sm:text-sm"
                    >
                      <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Code
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "preview" ? (
                      <div className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 rounded-lg h-8 w-8 sm:h-10 sm:w-10"
                          onClick={() => setIsFullscreen(true)}
                        >
                          <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>

                        <div className="flex items-center justify-center min-h-[350px] sm:min-h-[450px] lg:min-h-[550px]">
                          <CodeBlock
                            code={
                              component.previewCode ||
                              component.codeFiles?.[0]?.content
                            }
                            language={component.codeFiles?.[0]?.language}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        {component.codeFiles?.map(
                          (file: any, index: number) => (
                            <div
                              key={index}
                              className="border-b border-slate-200 dark:border-slate-800 last:border-b-0"
                            >
                              <button
                                onClick={() =>
                                  setExpandedFile(
                                    expandedFile === index ? -1 : index
                                  )
                                }
                                className="w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-2"
                              >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                  <FileCode className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                                  <span className="font-semibold text-xs sm:text-sm lg:text-base truncate">
                                    {file.filename}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-xs flex-shrink-0"
                                  >
                                    {file.language}
                                  </Badge>
                                </div>
                                {expandedFile === index ? (
                                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                                )}
                              </button>

                              <AnimatePresence>
                                {expandedFile === index && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="relative bg-slate-900 dark:bg-slate-950">
                                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
                                        <Button
                                          size="sm"
                                          variant="secondary"
                                          onClick={() =>
                                            handleCopyCode(file.content)
                                          }
                                          className="rounded-lg h-7 sm:h-8 px-2 sm:px-3 text-xs"
                                        >
                                          {copiedCode ? (
                                            <>
                                              <Check className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                                              <span className="hidden sm:inline">
                                                Copied
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                                              <span className="hidden sm:inline">
                                                Copy
                                              </span>
                                            </>
                                          )}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="secondary"
                                          onClick={() =>
                                            handleDownload(
                                              file.filename,
                                              file.content
                                            )
                                          }
                                          className="rounded-lg h-7 sm:h-8 px-2 sm:px-3 text-xs hidden sm:flex"
                                        >
                                          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                          Download
                                        </Button>
                                      </div>

                                      <pre className="p-3 sm:p-4 lg:p-6 pt-12 sm:pt-14 lg:pt-16 overflow-x-auto">
                                        <code className="text-xs sm:text-sm text-green-400 font-mono">
                                          <CodeBlock
                                            code={file.content}
                                            language={file.language}
                                          />
                                        </code>
                                      </pre>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Preview Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] sm:max-w-7xl h-[85vh] sm:h-[90vh] p-0">
          <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b">
            <DialogTitle className="text-base sm:text-lg">
              Fullscreen Preview
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 sm:p-6 overflow-auto h-full">
            <CodeBlock
              code={component.codeFiles?.[0]?.content}
              language={component.codeFiles?.[0]?.language}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
