import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  loading?: boolean;
}

export const ChartContainer = ({
  title,
  subtitle,
  icon: Icon,
  actions,
  loading,
  className,
  children,
  ...props
}: ChartContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-card-glass p-6 rounded-[1.5rem] border border-border/50 shadow-sm flex flex-col h-full",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/10">
              <Icon size={18} className="text-foreground/70" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div className="flex-1 w-full min-h-[280px]">
        {loading ? (
          <div className="w-full h-full bg-foreground/[0.02] rounded-2xl animate-shimmer" />
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
};
