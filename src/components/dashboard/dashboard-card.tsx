import React from "react";
import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface DashboardCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  gradient?: boolean;
}

export const DashboardCard = ({ children, className, gradient, ...props }: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-white rounded-[1.5rem] border border-border/50 shadow-sm overflow-hidden",
        gradient && "bg-brand-gradient text-white border-none shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
