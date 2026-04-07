"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, GraduationCap, Calendar, CheckCircle2,
  Clock, AlertCircle, Loader2, Search, Filter,
  RefreshCw, ChevronLeft, ChevronRight, Hash,
  MoreVertical, Layout
} from "lucide-react";
import Header from "@/components/layout/header";
import GlobalNotification from "@/components/notify/notification";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminTasksStore } from "@/store/admin/tasks";

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  "COMPLETED": {
    label: "Task Resolved",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
    icon: CheckCircle2
  },
  "APPROVED": {
    label: "Task Resolved",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
    icon: CheckCircle2
  },
  "IN PROGRESS": {
    label: "Active Focus",
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.12)",
    icon: Loader2
  },
  "ONGOING": {
    label: "Active Focus",
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.12)",
    icon: Loader2
  },
  "PENDING": {
    label: "Awaiting Action",
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.12)",
    icon: Clock
  },
  "OVERDUE": {
    label: "Critical Delay",
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.12)",
    icon: AlertCircle
  },
  "REJECTED": {
    label: "Rejected",
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.12)",
    icon: AlertCircle
  }
};

const TaskStatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status?.toUpperCase()] || { label: status, color: "#6b7280", bg: "rgba(107, 114, 128, 0.12)", icon: ClipboardList };
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      <Icon size={10} className={`stroke-[3] ${status?.toUpperCase() === 'IN PROGRESS' ? 'animate-spin' : ''}`} />
      {meta.label}
    </span>
  );
};

export default function TasksPage() {
  const {
    tasks, total, page, limit, isLoading, fetchTasks, setPage, setFilters,
  } = useAdminTasksStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSearch = () => {
    setFilters({ search: search === "" ? undefined : search });
    fetchTasks({ page: 1 });
  };

  const handleStatus = (s: string) => {
    setStatus(s);
    setFilters({ status: s === "all" ? undefined : s });
    fetchTasks({ page: 1 });
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalNotification />
      <Header
        title="Protocol Records"
        subtitle="Operational oversight of academic workflows and delegated student tasks"
      />

      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search protocol title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-11 h-12 rounded-2xl bg-muted/20 border-border/60 focus-visible:ring-primary/20 transition-all font-medium text-sm"
            />
            <Button
                onClick={handleSearch}
                className="absolute right-1.5 top-1.5 h-9 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] px-4"
            >
                Search
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={status} onValueChange={handleStatus}>
                <SelectTrigger className="h-12 w-full md:w-48 rounded-2xl bg-muted/20 border-border/60 text-[11px] font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-2">
                     <Filter size={14} className="text-muted-foreground" />
                     <SelectValue placeholder="Protocol State" />
                   </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                   <SelectItem value="all">Global Archive</SelectItem>
                   <SelectItem value="Completed">Resolved Protocol</SelectItem>
                   <SelectItem value="In Progress">Active Focus</SelectItem>
                   <SelectItem value="Pending">Queue Pending</SelectItem>
                   <SelectItem value="Overdue">Critical Delay</SelectItem>
                </SelectContent>
            </Select>

            <Button
                variant="outline"
                onClick={() => fetchTasks()}
                className="h-12 w-12 p-0 rounded-2xl border-border/60 hover:bg-muted/50 transition-all"
            >
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="rounded-2xl border border-border/40 p-6 space-y-4 shadow-sm">
                   <div className="flex justify-between">
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                      <Skeleton className="h-6 w-1/4 rounded-full" />
                   </div>
                   <Skeleton className="h-4 w-1/3 rounded-lg" />
                   <Skeleton className="h-16 w-full rounded-xl" />
                   <div className="pt-2 flex justify-between">
                      <Skeleton className="h-8 w-24 rounded-lg" />
                      <Skeleton className="h-4 w-16 rounded-lg" />
                   </div>
                </Card>
              ))
            ) : tasks.length === 0 ? (
              <div className="col-span-full py-40 border-2 border-dashed border-border/40 rounded-[32px] flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <ClipboardList size={32} className="text-muted-foreground/40" />
                 </div>
                 <h3 className="text-base font-semibold text-foreground">Registry Empty</h3>
                 <p className="text-xs text-muted-foreground mt-1 uppercase font-bold tracking-widest px-8 max-w-sm">No protocols match the current global administrative query.</p>
              </div>
            ) : (
              tasks.map((task, idx) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                   <Card className="group relative bg-card border-border border-1 shadow-sm rounded-[28px] overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                      <div className="p-6 flex-1 space-y-4">
                         <div className="flex justify-between items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors shrink-0">
                               <ClipboardList size={20} className="text-primary" />
                            </div>
                            <TaskStatusBadge status={task.status} />
                         </div>

                         <div>
                            <h4 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                               {task.title || "Experimental Protocol"}
                            </h4>
                            <div className="flex items-center gap-2 mt-2 opacity-70">
                               <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                  <GraduationCap size={12} className="text-blue-600" />
                               </div>
                               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">{task.mentorId?.name || "System Automated"}</span>
                            </div>
                         </div>

                         <div className="relative">
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 min-h-[4.5em]">
                               {task.description || "Systematic analysis of delegated workflows within the specified technical boundary. No additional context layers available."}
                            </p>
                         </div>

                         <div className="pt-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/[0.05] border border-orange-500/10 text-orange-600">
                               <Calendar size={13} className="opacity-70" />
                               <span className="text-[10px] font-black uppercase tracking-wider tabular-nums">
                                  Deadline: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : "Indefinite"}
                               </span>
                            </div>
                         </div>
                      </div>

                      <div className="px-6 py-4 border-t border-border/20 bg-foreground/[0.01] flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                           <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{task.mentorId?.department || "General Ops"}</span>
                         </div>
                         <span className="text-[10px] font-gray-600 font-semibold text-foreground tabular-nums">
                            {task.completedAt ? `Synced ${new Date(task.completedAt).toLocaleDateString()}` : "Active Stream"}
                         </span>
                      </div>
                   </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-border/40 gap-4">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Operational focus: <span className="text-foreground font-black">{tasks.length}</span> / {total} records
             </p>
             <div className="flex items-center gap-3 bg-muted/20 p-1.5 rounded-2xl border border-border/40">
                <Button
                   variant="ghost"
                   size="sm"
                   disabled={page <= 1}
                   onClick={() => { setPage(page - 1); fetchTasks({ page: page - 1 }); }}
                   className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-background"
                >
                  <ChevronLeft size={16} />
                </Button>
                <div className="w-[1px] h-4 bg-border/60 mx-1" />
                <span className="text-xs font-black text-foreground px-2 tabular-nums">{page} / {totalPages}</span>
                <div className="w-[1px] h-4 bg-border/60 mx-1" />

                <Button
                   variant="ghost"
                   size="sm"
                   disabled={page >= totalPages}
                   onClick={() => { setPage(page + 1); fetchTasks({ page: page + 1 }); }}
                   className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-background"
                >
                  <ChevronRight size={16} />
                </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}