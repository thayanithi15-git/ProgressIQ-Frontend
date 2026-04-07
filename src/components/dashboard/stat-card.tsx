import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number | null;
  subLabel?: string;
  icon: LucideIcon;
  color?: string;
  index?: number;
  loading?: boolean;
}

export const StatCard = ({
  label,
  value,
  subLabel,
  icon: Icon,
  color = "var(--piq-blue)",
  index = 0,
  loading = false,
}: StatCardProps) => {
  if (loading) {
    return (
      <div className="bg-card-glass p-6 rounded-[1.5rem] border border-border/50 h-[140px] flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-start">
          <div className="h-4 w-24 bg-foreground/5 rounded" />
          <div className="h-10 w-10 bg-foreground/5 rounded-xl" />
        </div>
        <div className="h-10 w-32 bg-foreground/5 rounded" />
        <div className="h-3 w-40 bg-foreground/5 rounded" />
      </div>
    );
  }

  const isNull = value === null || value === undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white backdrop-blur-xl p-6 rounded-[1.5rem] border border-border/40 shadow-sm relative overflow-hidden group h-[140px] flex flex-col justify-between"
    >
      <div className="flex justify-between items-start relative z-10">
        <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none opacity-80">
          {label}
        </p>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 duration-300 shadow-sm"
          style={{ background: `${color}12`, border: `1px solid ${color}20` }}
        >
          <Icon size={18} style={{ color }} strokeWidth={2.4} />
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <h3 className="text-3xl font-display font-bold tracking-tight text-foreground leading-none mb-2.5">
          {isNull ? "—" : Number(value).toLocaleString()}
        </h3>
        {subLabel && (
          <p className="text-[10px] text-muted-foreground font-mono font-bold flex items-center gap-1.5 uppercase tracking-widest leading-none opacity-70">
            {subLabel}
          </p>
        )}
      </div>

      <div
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-700 pointer-events-none"
        style={{ background: color }}
      />
    </motion.div>

  );
};
