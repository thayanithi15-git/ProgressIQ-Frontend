"use client";

import React, { useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
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
import { useSystemLogStore } from "@/store/admin/systemLogStore";
import {
  Activity, ShieldAlert, Cpu, UserCheck, Shield, Database, RefreshCw,
  Search, Clock, HardDrive, History, Filter, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  ADMIN:   { label: "ADMIN", color: "#7c3aed", bg: "rgba(124, 58, 237, 0.12)" },
  MENTOR:  { label: "MENTOR", color: "#059669", bg: "rgba(5, 150, 105, 0.12)" },
  STUDENT: { label: "STUDENT", color: "#2563eb", bg: "rgba(37, 99, 235, 0.12)" },
};

const RoleBadge = ({ role }: { role: string }) => {
  const meta = ROLE_META[role] || { label: role, color: "#6b7280", bg: "rgba(107, 114, 128, 0.12)" };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
};

export default function SystemLogsPage() {
  const {
    logs, total, currentPage, totalPages, isLoading, filters,
    fetchLogs, setFilters,
  } = useSystemLogStore();

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleRoleFilter = (value: string) => {
    setFilters({ role: value });
  };

  const stats = [
    { label: "Audit Records", value: total, icon: Database, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "System Uptime", value: "99.9%", icon: Cpu, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Access Control", value: filters.role === "all" ? "Full System" : filters.role, icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header
        title="Audit Logs"
        subtitle="Chronological trail of system access and security events"
      />

      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
           {stats.map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
             >
               <Card className="bg-card border border-border shadow-sm rounded-2xl p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <p className="text-xl font-black text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
               </Card>
             </motion.div>
           ))}
        </div>

        <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
           <div className="p-6 border-b border-border/40 bg-foreground/[0.01] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    <History className="text-primary w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-sm font-semibold text-foreground leading-none mb-1">Access History</h3>
                    <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-tight">Real-time session authorization logs</p>
                 </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                 <Select value={filters.role || "all"} onValueChange={handleRoleFilter}>
                    <SelectTrigger className="h-10 md:w-40 rounded-xl bg-muted/20 border-border/60 text-xs font-semibold uppercase tracking-wider">
                       <SelectValue placeholder="All Entities" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="all">All Roles</SelectItem>
                       <SelectItem value="ADMIN">Administrators</SelectItem>
                       <SelectItem value="MENTOR">Academic Mentors</SelectItem>
                       <SelectItem value="STUDENT">Student Base</SelectItem>
                    </SelectContent>
                 </Select>
                 <Button
                   variant="secondary"
                   size="sm"
                   onClick={() => fetchLogs(currentPage)}
                   className="h-10 rounded-xl px-4 bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px] gap-2"
                 >
                   <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                   Force Sync
                 </Button>
              </div>
           </div>

           <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full border-collapse min-w-[1000px]">
                 <thead>
                    <tr className="bg-foreground/[0.01] border-b border-border/40">
                       {['#', 'Timestamp', 'Identity Identifier', 'Entity Role', 'Security Event'].map((h, i) => (
                         <th key={h} className={`px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest ${i === 0 ? 'w-16' : ''}`}>
                            {h}
                         </th>
                       ))}
                    </tr>
                 </thead>
                 <tbody>
                    {isLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/40">
                           <td colSpan={5} className="px-6 py-5"><Skeleton className="h-10 w-full rounded-xl" /></td>
                        </tr>
                      ))
                    ) : logs.length === 0 ? (
                      <tr>
                         <td colSpan={5} className="py-20 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No audit trails captured</td>
                      </tr>
                    ) : (
                      logs.map((log, idx) => (
                         <motion.tr
                           key={log._id}
                           initial={{ opacity: 0, x: -5 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: idx * 0.01 }}
                           className="group border-b border-border/40 hover:bg-foreground/[0.01] transition-colors"
                         >
                            <td className="px-6 py-5 text-[11px] font-bold text-muted-foreground tabular-nums">{(currentPage - 1) * 50 + idx + 1}</td>
                            <td className="px-6 py-5">
                               <div className="flex flex-col">
                                  <span className="text-[11px] font-bold text-foreground tabular-nums">{format(new Date(log.createdAt), "dd MMM yyyy")}</span>
                                  <span className="text-[10px] text-muted-foreground tabular-nums">{format(new Date(log.createdAt), "HH:mm:ss")}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <div className="min-w-0">
                                  <p className="text-sm font-semibold text-foreground leading-none mb-1">{log.name}</p>
                                  <p className="text-[11px] text-muted-foreground font-medium">{log.email}</p>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <RoleBadge role={log.role} />
                            </td>
                            <td className="px-6 py-5">
                               <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/[0.08] border border-emerald-500/20 px-3 py-1 rounded-lg">
                                  <Activity size={12} className="opacity-70" />
                                  {log.action}
                               </div>
                            </td>
                         </motion.tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>

           {totalPages > 1 && (
             <div className="p-4 border-t border-border/40 flex items-center justify-between bg-foreground/[0.01]">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                   Auditing page <span className="text-primary font-black">{currentPage}</span> of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                   <Button
                      variant="outline" size="sm"
                      onClick={() => fetchLogs(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                      className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-bold uppercase tracking-wider gap-2"
                   >
                     <ChevronLeft size={14} /> Back
                   </Button>
                   <Button
                      variant="outline" size="sm"
                      onClick={() => fetchLogs(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoading}
                      className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-bold uppercase tracking-wider gap-2"
                   >
                     Next <ChevronRight size={14} />
                   </Button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
