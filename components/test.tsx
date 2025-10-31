import ButtonVariants from "@/components/ButtonVariants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Button Variants Demo",
  description:
    "Demonstration of shadcn button variants with icons and animations.",
};

export default function Page() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background p-8">
      <ButtonVariants />
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Plus, ShoppingCart, User } from "lucide-react";
import { FC } from "react";

interface Variant {
  type: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  label: string;
  icon?: JSX.Element;
}

const variants: Variant[] = [
  { type: "default", label: "Default", icon: <Plus size={20} /> },
  { type: "secondary", label: "Secondary", icon: <User size={20} /> },
  { type: "outline", label: "Outline", icon: <ShoppingCart size={20} /> },
  { type: "ghost", label: "Ghost", icon: <ArrowRight size={20} /> },
  { type: "link", label: "Link" },
  { type: "destructive", label: "Delete", icon: <Plus size={20} /> },
];

const variantsMap: Record<
  string,
  React.ComponentProps<typeof Button>["variant"]
> = {
  default: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  link: "link",
  destructive: "destructive",
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const ButtonVariants: FC = () => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {variants.map((v) => (
        <motion.div
          key={v.type}
          variants={itemVariants}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
        >
          <Button
            variant={variantsMap[v.type]}
            className="w-full flex items-center justify-center gap-2"
            aria-label={v.label}
          >
            {v.icon && <span className="flex-shrink-0">{v.icon}</span>}
            <span>{v.label}</span>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ButtonVariants;
