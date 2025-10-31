import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Palette, Sparkles, Zap } from "lucide-react";

interface DesignSystemToggleProps {
  useDesignSystem: boolean;
  handleDesignSystemToggle: (checked: boolean) => void;
}

const DesignSystemToggle = ({
  useDesignSystem,
  handleDesignSystemToggle,
}: DesignSystemToggleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative group"
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Main Container */}
      <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-2 border-white/50 dark:border-white/10 rounded-2xl p-5 shadow-xl group-hover:shadow-2xl transition-shadow">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side - Icon & Text */}
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              animate={{
                rotate: useDesignSystem ? [0, 360] : 0,
                scale: useDesignSystem ? [1, 1.1, 1] : 1,
              }}
              transition={{
                rotate: { duration: 0.6, ease: "easeInOut" },
                scale: { duration: 0.3 },
              }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                useDesignSystem
                  ? "bg-gradient-to-br from-purple-600 to-pink-600"
                  : "bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
              }`}
            >
              <AnimatePresence mode="wait">
                {useDesignSystem ? (
                  <motion.div
                    key="active"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Palette className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="inactive"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Palette className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <motion.h3
                  animate={{
                    color: useDesignSystem
                      ? ["#9333ea", "#ec4899", "#9333ea"]
                      : undefined,
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-base font-bold text-slate-900 dark:text-white"
                >
                  Design System
                </motion.h3>
                <AnimatePresence>
                  {useDesignSystem && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {useDesignSystem
                  ? "Using your colors palette & typography"
                  : "Apply your custom design system"}
              </p>
            </div>
          </div>

          {/* Right Side - Switch */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Switch
              checked={useDesignSystem}
              onCheckedChange={handleDesignSystemToggle}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600"
            />
          </motion.div>
        </div>

        {/* Status Indicator Bar */}
        <AnimatePresence>
          {useDesignSystem && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    System Active
                  </p>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full mt-1"
                  />
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Zap className="w-4 h-4 text-orange-500" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DesignSystemToggle;
