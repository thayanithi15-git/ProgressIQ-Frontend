"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Briefcase, Clock, XCircle, Search, RefreshCw,
  ChevronLeft, ChevronRight, User, ArrowUpRight, ExternalLink,
  ShieldCheck, Upload, FileSpreadsheet, Database
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import Header from "@/components/layout/header";
import GlobalNotification from "@/components/notify/notification";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAdminInternshipsStore } from "@/store/admin/internships";

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  "APPROVED": {
    label: "Verified",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
    icon: ShieldCheck
  },
  "PENDING": {
    label: "Pending",
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.12)",
    icon: Clock
  },
  "REJECTED": {
    label: "Rejected",
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.12)",
    icon: XCircle
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status?.toUpperCase()] || { label: status, color: "#6b7280", bg: "rgba(107, 114, 128, 0.12)", icon: Clock };
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      <Icon size={10} className="stroke-[3]" />
      {meta.label}
    </span>
  );
};

export default function AdminInternshipsPage() {
  const {
    internships, total, page, totalPages, isLoading,
    fetchInternships, setSearchQuery, setStatusFilter, setPage, resetFilters,
    searchQuery, statusFilter
  } = useAdminInternshipsStore();

  const [mounted, setMounted] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchInternships();
  }, [fetchInternships]);

  if (!mounted) return null;

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { companyName: "Google", companyUrl: "https://google.com", role: "Software Engineer Intern", type: "Industry", paid: "Yes", from: "2024-06-01", to: "2024-08-31", studentEmail: "student@example.com", description: "Worked on core backend services." }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Internships Template");
    XLSX.writeFile(wb, "Internship_Bulk_Template.xlsx");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalNotification />
      <Header
        title="Industrial Placements"
        subtitle="Global oversight of student corporate engagements and internship verifications"
      />

      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8">
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col lg:flex-row items-center gap-4">

                <div className="relative w-full lg:flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by company, role, or student identity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-12 rounded-2xl bg-muted/20 border-border/60 focus-visible:ring-primary/20 transition-all font-medium text-sm"
                    />
                    <Button
                        onClick={() => fetchInternships()}
                        className="absolute right-1.5 top-1.5 h-9 rounded-xl bg-primary text-primary-foreground font-semibold uppercase tracking-widest text-[10px] px-4"
                    >
                        Sync
                    </Button>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 scrollbar-hide">
                    <Select value={statusFilter || "all"} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); fetchInternships(); }}>
                        <SelectTrigger className="h-12 w-[140px] rounded-2xl bg-muted/20 border-border/60 text-[10px] font-semibold uppercase tracking-widest">
                             <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">Every State</SelectItem>
                            <SelectItem value="Approved">Verified</SelectItem>
                            <SelectItem value="Pending">Queue</SelectItem>
                            <SelectItem value="Rejected">Void</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={() => { resetFilters(); fetchInternships(); }} className="h-12 w-12 p-0 rounded-2xl border-border/60 bg-muted/20 hover:bg-muted/50 transition-all">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </Button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {isLoading ? (
                    Array.from({ length: 9 }).map((_, i) => (
                        <Card key={i} className="rounded-[28px] border border-border/40 p-6 space-y-4 shadow-none">
                            <div className="flex justify-between p-6 pb-0">
                                <Skeleton className="h-6 w-1/2 rounded-lg" />
                                <Skeleton className="h-6 w-1/4 rounded-full" />
                            </div>
                            <div className="px-6 space-y-4 pb-6">
                                <Skeleton className="h-16 w-full rounded-2xl" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-24 rounded-lg" />
                                    <Skeleton className="h-8 w-24 rounded-lg" />
                                </div>
                            </div>
                        </Card>
                    ))
                ) : internships.length === 0 ? (
                    <div className="col-span-full py-20 border-2 border-dashed border-border/40 rounded-[40px] flex flex-col items-center justify-center text-center bg-muted/5">
                        <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-4 border border-border/40">
                            <Briefcase size={32} className="text-muted-foreground/30" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">No Placements Found</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold tracking-tight">Broaden your search scope</p>
                    </div>
                ) : (
                    internships.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.02 }}
                        >
                            <Card className="group relative bg-card border-border/60 border shadow-sm rounded-[32px] overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col">
                                <div className="p-6 flex-1 space-y-5">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="w-12 h-12 rounded-[20px] bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-all duration-500">
                                            <Building2 size={24} className="text-primary" />
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </div>

                                    <div>
                                        <h4 className="text-base font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                            {item.companyName}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                           <Link href={item.companyUrl || "#"} target="_blank" className="text-[10px] text-primary font-semibold uppercase tracking-tight flex items-center gap-1 hover:underline">
                                                Visit Site <ExternalLink size={10} />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="bg-foreground/[0.02] rounded-2xl p-4 border border-border/40">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                                <User size={16} className="text-orange-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[12px] font-semibold text-foreground truncate">{item.student?.name || "Unassigned"}</p>
                                                <p className="text-[9px] text-muted-foreground uppercase font-semibold   tracking-widest">{item.student?.department || "N/A"} • {item.student?.year || "Year"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-muted/10 rounded-xl p-3 border border-border/20 text-center">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Window</p>
                                            <p className="text-[10px] font-semibold text-foreground">{item.from ? new Date(item.from).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</p>
                                        </div>
                                        <div className="bg-muted/10 rounded-xl p-3 border border-border/20 text-center">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Duration</p>
                                            <p className="text-[10px] font-semibold text-foreground">3 Months</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <Badge variant="secondary" className="h-5 rounded-lg text-[8px] font-black uppercase tracking-widest border-emerald-500/10 text-emerald-600 bg-emerald-500/5">
                                            {item.type}
                                        </Badge>
                                        <Badge variant="secondary" className="h-5 rounded-lg text-[8px] font-black uppercase tracking-widest border-blue-500/10 text-blue-600 bg-blue-500/5">
                                            {item.paid ? "Compensated" : "Volunteer"}
                                        </Badge>
                                    </div>

                                    {item.description && (
                                        <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2 italic">
                                            "{item.description}"
                                        </p>
                                    )}
                                </div>

                                <div className="px-6 py-4 border-t border-border/20 bg-foreground/[0.01] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={12} className="text-muted-foreground/60" />
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.role || "Specialist"}</span>
                                    </div>
                                    <button className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:translate-x-1 transition-transform">
                                        Audit Insight <ArrowUpRight size={14} className="stroke-[3]" />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>

        {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-border/40 gap-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                    Registry Focus: <span className="text-foreground font-black">{internships.length}</span> of <span className="text-primary font-black">{total}</span> placements
                </p>
                <div className="flex items-center gap-3 bg-muted/20 p-1.5 rounded-2xl border border-border/40">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => { setPage(page - 1); fetchInternships(); }}
                        className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-background transition-all"
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <div className="w-[1px] h-4 bg-border/40 mx-1" />
                    <span className="text-xs font-black text-foreground px-4 tabular-nums">{page} <span className="text-muted-foreground/50 mx-1">/</span> {totalPages}</span>
                    <div className="w-[1px] h-4 bg-border/40 mx-1" />

                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => { setPage(page + 1); fetchInternships(); }}
                        className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-background transition-all"
                    >
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        )}
      </div>

      <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
        <DialogContent className="modal-sheet max-w-2xl p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40 bg-foreground/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <FileSpreadsheet size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Bulk Placement Ingestion</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Synchronize corporate engagement manifest</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="h-9 rounded-xl border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest bg-primary/5 hover:bg-primary/10 transition-all gap-2"
            >
              <Database size={14} /> Template
            </Button>
          </div>
          <div className="p-8 text-center space-y-6">
             <div className="mb-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 text-left">Protocol Map (Required Headers)</p>
                <div className="bg-muted/30 border border-border/40 rounded-2xl overflow-hidden shadow-inner">
                    <table className="w-full text-left text-[10px] border-collapse">
                        <thead className="bg-foreground/[0.03]">
                            <tr>
                                {["companyName", "role", "studentEmail", "status"].map(h => (
                                    <th key={h} className="px-4 py-3 font-black text-muted-foreground uppercase tracking-widest border-r border-border/40 last:border-0">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border/40">
                                {["Google", "SWE Intern", "alex@edu.com", "Approved"].map((v, i) => (
                                    <td key={i} className="px-4 py-3 font-mono text-muted-foreground/60 border-r border-border/40 last:border-0 italic">{v}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
             </div>

             <div className="flex flex-col items-center py-10 px-4 rounded-3xl border-2 border-dashed border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.04] transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                    <Upload className="text-primary w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-tight">Drop Manifest Here</h4>
                <p className="text-[11px] text-muted-foreground font-medium mb-6">Select a .xlsx or .csv placement manifest</p>
                <Input type="file" accept=".xlsx,.xls,.csv" className="hidden" id="internship-bulk-file" />
                <label htmlFor="internship-bulk-file" className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] flex items-center cursor-pointer hover:shadow-lg transition-all shadow-md">
                    Select Manifest
                </label>
             </div>
          </div>
          <div className="p-4 border-t border-border/40 bg-foreground/[0.01] flex justify-end">
            <Button variant="ghost" onClick={() => setIsBulkUploadDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-semibold tracking-widest">Abort Intake</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
