"use client";
import { Button } from "@/components/ui/button";
import { handleDownload } from "@/lib/downloadFiles";
import { GeneratedComponent } from "@/lib/type";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Check,
  CircleCheck,
  Copy,
  Download,
  RefreshCw,
  Save,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ActionButtonsProps {
  component: GeneratedComponent;
  copiedId: string | null;
  handleCopyCode: (id: string, code: string) => void;
  handleGenerate: (id: string) => void;
}

const ActionButtons = ({
  component,

  copiedId,
  handleCopyCode,
  handleGenerate,
}: ActionButtonsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});

  const handleSave = async (component: GeneratedComponent) => {
    if (savedMap[component.id] || isSaving) return;
    setIsSaving(true);

    try {
      const cleanedComponent = {
        ...component,
        codeFiles: component.codeFiles.map((file) => ({
          ...file,
          content: file.content.replace(/\\n/g, "\n").replace(/\\t/g, "\t"),
        })),
      };

      const { data } = await axios.post("/api/saved-component", {
        component: cleanedComponent,
      });
      if (data) {
        toast(data?.message || "Component saved to library", {
          icon: <CircleCheck className="w-4 h-4 text-green-500" />,
        });
      }
      setSavedMap((prev) => ({ ...prev, [component.id]: true }));
    } catch (error: any) {
      console.log(error);
      toast(
        error.response?.data?.error ||
          "Something went wrong while saving component.",
        {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
        }
      );
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Save Button */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-300" />
        <Button
          onClick={() => handleSave(component)}
          className="relative w-full h-auto py-4 px-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed border-0 transition-all"
          disabled={isSaving || savedMap[component.id]}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%", skewX: -15 }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">
              {isSaving
                ? "Saving..."
                : savedMap[component.id]
                ? "Saved Component"
                : "Save Component"}
            </span>
          </div>
        </Button>
      </motion.div>

      {/* Copy Code Button */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-300" />
        <Button
          onClick={() =>
            handleCopyCode(
              component.id,
              component.codeFiles
                ?.map((file) => file?.content?.replace(/\\n/g, "\n"))
                .join("\n\n") || ""
            )
          }
          className="relative w-full h-auto py-4 px-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg overflow-hidden group border-0 transition-all"
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%", skewX: -15 }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            {copiedId === component.id ? (
              <Check className="w-6 h-6" />
            ) : (
              <Copy className="w-6 h-6 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-xs font-bold">
              {copiedId === component.id ? "Copied!" : "Copy"}
            </span>
          </div>
        </Button>
      </motion.div>

      {/* Regenerate Button */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-300" />
        <Button
          onClick={() => handleGenerate(component.id)}
          className="relative w-full h-auto py-4 px-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-md hover:shadow-lg overflow-hidden group border-0 transition-all"
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%", skewX: -15 }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <RefreshCw className="w-6 h-6" />
            </motion.div>
            <span className="text-xs font-bold">Regenerate</span>
          </div>
        </Button>
      </motion.div>

      {/* Export Button */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
        onClick={() =>
          handleDownload(
            component.codeFiles?.[0]?.filename || "component.tsx",
            component.codeFiles?.[0]?.content ||
              component.codeFiles?.[0]?.content
          )
        }
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-300" />
        <Button className="relative w-full h-auto py-4 px-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md hover:shadow-lg overflow-hidden group border-0 transition-all">
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%", skewX: -15 }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <motion.div whileHover={{ y: 2 }} transition={{ duration: 0.3 }}>
              <Download className="w-6 h-6" />
            </motion.div>
            <span className="text-xs font-bold">Export</span>
          </div>
        </Button>
      </motion.div>
    </div>
  );
};

export default ActionButtons;
