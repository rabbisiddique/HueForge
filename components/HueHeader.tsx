import { motion } from "framer-motion";

const HueHeader = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Design System Generator
        </h1>
        <p className="text-muted-foreground text-lg">
          Create and customize your perfect design system
        </p>
      </motion.div>
    </>
  );
};

export default HueHeader;
