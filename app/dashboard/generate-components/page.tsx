"use client";

import ActionButtons from "@/components/ActionButtons";
import CodeBlock from "@/components/CodeBlock";
import DesignSystemToggle from "@/components/DesignSystemToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GeneratedComponent } from "@/lib/type";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  CircleCheck,
  Code2,
  CreditCard,
  Grid3x3,
  Layers,
  Layout,
  MessageSquare,
  MousePointer,
  Navigation,
  Play,
  Sparkles,
  Star,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ComponentTemplate {
  id: string;
  componentName: string;
  category: string;
  description: string;
  icon: any;
  gradient: string;
  color: string;
  prompt: string;
  techStack: string[];
}

export default function ComponentsSection() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedComponents, setGeneratedComponents] = useState<
    GeneratedComponent[]
  >([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [palette, setPalette] = useState(null);
  const [typography, setTypography] = useState(null);
  const [useDesignSystem, setUseDesignSystem] = useState(false);
  const [loadingDesignSystem, setLoadingDesignSystem] = useState(false);

  const handleDesignSystemToggle = async (checked: boolean) => {
    setUseDesignSystem(checked);

    if (checked) {
      setLoadingDesignSystem(true);
      try {
        const [paletteRes, typoRes] = await Promise.all([
          fetch("/api/get-palette"),
          fetch("/api/get-typography"),
        ]);

        setPalette(await paletteRes.json());
        setTypography(await typoRes.json());
      } catch (error: any) {
        console.error("Error loading design system:", error);
        toast(
          error?.response?.data?.error ||
            "Something went wrong while toggling the design system.",
          {
            icon: <XCircle className="w-4 h-4 text-red-500" />,
          }
        );
      } finally {
        setLoadingDesignSystem(false);
      }
    } else {
      // reset to default if user disables the toggle
      setPalette(null);
      setTypography(null);
    }
  };

  const componentTemplates: ComponentTemplate[] = [
    {
      id: "pricing-card",
      componentName: "Pricing Card",
      category: "Card",
      description: "Modern pricing card with glassmorphism effect",
      icon: CreditCard,
      gradient: "from-purple-500 to-pink-500",
      color: "text-purple-600 dark:text-purple-400",
      prompt: "Generate a modern pricing card with glassmorphism",
      techStack: [],
    },
    {
      id: "hero-section",
      componentName: "Hero Section",
      category: "Hero",
      description: "Animated hero with gradient background",
      icon: Navigation,
      gradient: "from-blue-500 to-cyan-500",
      color: "text-blue-600 dark:text-blue-400",
      prompt: "Design a hero section with heading and CTA",
      techStack: [],
    },
    {
      id: "testimonial-card",
      componentName: "Testimonial Card",
      category: "Card",
      description: "Testimonial with avatar and rating",
      icon: MessageSquare,
      gradient: "from-orange-500 to-red-500",
      color: "text-orange-600 dark:text-orange-400",
      prompt: "Build a testimonial card with avatar",
      techStack: [],
    },
    {
      id: "login-form",
      componentName: "Login Form",
      category: "Form",
      description: "Minimal login form",
      icon: User,
      gradient: "from-green-500 to-emerald-500",
      color: "text-green-600 dark:text-green-400",
      prompt: "Design a minimalist login form",
      techStack: [],
    },
    {
      id: "dashboard-card",
      componentName: "Dashboard Card",
      category: "Card",
      description: "Metric card with stats",
      icon: Layout,
      gradient: "from-indigo-500 to-blue-500",
      color: "text-indigo-600 dark:text-indigo-400",
      prompt: "Create a dashboard metric card",
      techStack: [],
    },
    {
      id: "feature-grid",
      componentName: "Feature Grid",
      category: "Section",
      description: "Grid layout with icons",
      icon: Grid3x3,
      gradient: "from-pink-500 to-rose-500",
      color: "text-pink-600 dark:text-pink-400",
      prompt: "Build a responsive feature grid",
      techStack: [],
    },
    {
      id: "button-variants",
      componentName: "Button Set",
      category: "Button",
      description: "Collection of button styles",
      icon: MousePointer,
      gradient: "from-violet-500 to-purple-500",
      color: "text-violet-600 dark:text-violet-400",
      prompt: "Generate button variants",
      techStack: [],
    },
    {
      id: "modal-dialog",
      componentName: "Modal Dialog",
      category: "Modal",
      description: "Centered modal with blur",
      icon: Box,
      gradient: "from-cyan-500 to-blue-500",
      color: "text-cyan-600 dark:text-cyan-400",
      prompt: "Create a glassmorphic modal",
      techStack: [],
    },
  ];

  const handleGenerate = async (templateId?: string) => {
    setIsGenerating(true);
    const template = templateId
      ? componentTemplates.find((t) => t.id === templateId)
      : null;
    const promptToUse = template?.prompt || prompt;
    setPrompt(promptToUse);
    if (!promptToUse.trim()) {
      setIsGenerating(false);
      return;
    }

    try {
      const { data } = await axios.post("/api/generate-component", {
        prompt: promptToUse,
        typography,
        palette,
        useDesignSystem,
      });
      console.log(data);

      const componentsArray = Array.isArray(data.component)
        ? data.component
        : [data.component];
      const generated = componentsArray.map((item: any) => ({
        id: Date.now().toString() + Math.random(),
        componentName: item.componentName || "Untitled Component",
        category: item.category || template?.category || "General",
        description: item.description || promptToUse,
        techStack: item.techStack
          ? item.techStack.split(",").map((t: string) => t.trim())
          : template?.techStack || [
              "Next.js",
              "TypeScript",
              "Tailwind",
              "Framer Motion",
            ],
        codeFiles: Array.isArray(item.codeFiles) ? item.codeFiles : [],
        previewCode: item.previewCode || "",
      }));

      setGeneratedComponents((prev) => [...generated, ...prev]);
      setPrompt("");
      if (data) {
        toast(data?.message || "Component generated successfully!", {
          icon: <CircleCheck className="w-4 h-4 text-green-500" />,
        });
      }
    } catch (error: any) {
      console.error("Error generating component:", error);
      toast(
        error?.response?.data?.error ||
          "Something went wrong while generating the component.",
        {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
        }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Animated Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 space-y-12">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-12 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">
                AI-Powered Components
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl font-black text-white mb-6"
            >
              Build UI Components
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                In Seconds
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Generate stunning, production-ready UI components with AI. Choose
              from templates or describe your vision.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-md">
                <Zap className="w-4 h-4 mr-2" />
                Instant Preview
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-md">
                <Code2 className="w-4 h-4 mr-2" />
                Copy Code
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-md">
                <Layers className="w-4 h-4 mr-2" />
                Export Ready
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* Generator Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-500/20 rounded-3xl blur-2xl" />

          <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl p-8 shadow-2xl border border-white/40 dark:border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className=""
              >
                <Image
                  src="/logo.jpg"
                  alt="HueForge Logo"
                  width={80}
                  height={80}
                  className="object-contain rounded-lg"
                  priority
                />
              </motion.div>
              <div>
                <div>
                  {/* Overlay for loading design context */}
                  {loadingDesignSystem && (
                    <div className="fixed inset-0 flex items-center justify-center bg-[#ffffff94] dark:bg-[#00000094] rounded-[20px] text-gray-900 text-lg z-50">
                      <div className="animate-pulse text-center space-y-2">
                        <p className="font-semibold dark:text-white ">
                          🎨 Loading design context...
                        </p>
                        <p className="text-sm text-gray-600 dark:text-white font-bold">
                          Preparing color palette and typography
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Overlay while generating */}
                  {isGenerating && (
                    <div className="fixed inset-0 flex items-center justify-center bg-[#ffffff94] dark:bg-[#00000094] rounded-[20px] text-gray-900 text-lg z-50">
                      <div className="animate-pulse text-center space-y-2">
                        <p className="font-semibold dark:text-white">
                          ⏳ It may take 30–40 seconds to generate your
                          component...
                        </p>
                        <p className="text-sm text-gray-600 dark:text-white">
                          AI is crafting your design masterpiece ✨
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  AI Component Generator
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Describe your component or pick a template
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative group">
                <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-30 transition-opacity" />
                <Input
                  placeholder='✨ "A glassmorphic pricing card with hover effects..."'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                  className="relative h-14 pl-6 pr-6 rounded-2xl text-lg font-medium bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500 shadow-lg transition-all"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !prompt.trim()}
                  className="h-14 px-8 rounded-2xl text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500
                   hover:from-purple-700 hover:via-pink-700 hover:to-orange-600
                   shadow-xl"
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
                        <Sparkles className="w-6 h-6 mr-2" />
                      </motion.div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-2" />
                      Generate
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
            <div className="mt-4 mb-4">
              <DesignSystemToggle
                useDesignSystem={useDesignSystem}
                handleDesignSystemToggle={handleDesignSystemToggle}
              />
            </div>
            {/* Template Gallery */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Popular Templates
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {componentTemplates.map((template) => (
                  <motion.button
                    key={template.id}
                    // whileHover={{ scale: 1.05, y: -8 }}
                    // whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setHoveredTemplate(template.id)}
                    onHoverEnd={() => setHoveredTemplate(null)}
                    onClick={() => handleGenerate(template.id)}
                    disabled={isGenerating}
                    className="relative group overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-800 hover:bg-gradient-to-br hover:from-white hover:to-slate-50 dark:hover:from-slate-800 dark:hover:to-slate-700 border-2 border-slate-200 dark:border-slate-700 hover:border-transparent shadow-lg hover:shadow-2xl transition-all"
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                    />

                    <div className="relative z-10 space-y-3">
                      <motion.div
                        // animate={
                        //   hoveredTemplate === template.id
                        //     ? {
                        //         rotate: [0, -10, 10, -10, 0],
                        //         scale: [1, 1.1, 1],
                        //       }
                        //     : {}
                        // }
                        // transition={{ duration: 0.5 }}
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow`}
                      >
                        <template.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                          {template.componentName}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </div>

                    {hoveredTemplate === template.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-2 right-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg">
                          <ArrowRight className="w-4 h-4 text-slate-900 dark:text-white" />
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Generated Components */}
        <AnimatePresence mode="wait">
          {generatedComponents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center shadow-lg">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Your Components
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {generatedComponents.length} generated
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-none px-4 py-2 text-base shadow-lg">
                  {generatedComponents.length} Total
                </Badge>
              </div>

              <div className="grid gap-8">
                {generatedComponents.map((component, index) => (
                  <motion.div
                    key={component.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-orange-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-8 shadow-2xl border border-white/40 dark:border-white/10">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Preview */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-3 py-1.5 text-sm font-bold">
                                {component.category}
                              </Badge>
                              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                {component.componentName}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="gap-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 font-semibold"
                              >
                                <>
                                  <Code2 className="w-4 h-4" />
                                  Code
                                </>
                              </Button>
                            </div>
                          </div>

                          <motion.div
                            className="relative rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-[400px] shadow-xl"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key="code"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="p-4 overflow-auto max-h-[500px]"
                              >
                                {/* <pre className="text-sm font-mono text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed"> */}
                                <code>
                                  <CodeBlock
                                    code={
                                      component.codeFiles
                                        ?.map((file) =>
                                          file?.content?.replace(/\\n/g, "\n")
                                        )
                                        .join("\n\n") || ""
                                    }
                                    language="ts"
                                  />
                                </code>
                                {/* </pre> */}
                              </motion.div>
                            </AnimatePresence>
                          </motion.div>
                        </div>

                        {/* Details & Actions */}
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Description
                              </h5>
                            </div>
                            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-10">
                              {component.description}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                              Tech Stack
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {component.techStack.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs px-3 py-1"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 pt-6 border-t-2 border-gradient-to-r from-purple-200 via-pink-200 to-orange-200 dark:from-purple-800 dark:via-pink-800 dark:to-orange-800">
                            <div className="flex items-center gap-3 mb-4">
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
                              >
                                <Zap className="w-5 h-5 text-white" />
                              </motion.div>
                              <div>
                                <h5 className="text-base font-bold text-slate-900 dark:text-white">
                                  Quick Actions
                                </h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Manage your component
                                </p>
                              </div>
                            </div>
                            <div className="grid gap-3">
                              <ActionButtons
                                component={component}
                                copiedId={copiedId}
                                handleCopyCode={handleCopyCode}
                                handleGenerate={handleGenerate}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-16 text-center shadow-2xl border-2 border-dashed border-slate-300 dark:border-slate-700"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30 flex items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-700 shadow-xl"
              >
                <Layers className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </motion.div>

              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                No Components Yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
                Click any template above or describe your own component to get
                started with AI generation
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleGenerate(componentTemplates[0].id)}
                  className="gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-xl text-lg px-8 py-6 h-auto"
                >
                  <Play className="w-6 h-6" />
                  Try First Template
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Sync Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-8 shadow-2xl border border-white/40 dark:border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-teal-500/10 to-blue-500/10" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                🎨 Theme Sync Enabled
              </h4>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                All generated components automatically use your saved color
                palette and typography settings for perfect consistency across
                your design system. Supports both light and dark modes with
                responsive layouts.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
