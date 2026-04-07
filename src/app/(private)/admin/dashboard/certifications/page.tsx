"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, Globe, Search, Filter, RefreshCw,
  ChevronLeft, ChevronRight, ExternalLink,
  ShieldCheck, Clock, XCircle, GraduationCap,
  Building2, Calendar, Medal
} from "lucide-react";
import Link from "next/link";
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
import { useAdminCertsStore } from "@/store/admin/certifications";

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  "VERIFIED": {
    label: "Verified",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
    icon: ShieldCheck
  },
  "COMPLETED": {
    label: "Completed",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
    icon: ShieldCheck
  },
  "PENDING": {
    label: "Pending Audit",
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

const CertStatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status?.toUpperCase()] || { label: status, color: "#6b7280", bg: "rgba(107, 114, 128, 0.12)", icon: Award };
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      <Icon size={10} className="stroke-[3]" />
      {meta.label}
    </span>
  );
};

export default function CertificationsPage() {
  const {
    certs, total, page, limit, isLoading, fetchCerts, setPage, setFilters,
  } = useAdminCertsStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetchCerts();
  }, [fetchCerts]);

  const handleSearch = () => {
    setFilters({ search: search === "" ? undefined : search });
    fetchCerts({ page: 1 });
  };

  const handleStatus = (s: string) => {
    setStatus(s);
    setFilters({ status: s === "all" ? undefined : s });
    fetchCerts({ page: 1 });
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalNotification />
      <Header
        title="Certification Ledger"
        subtitle="Verification and management of professional student credentials"
      />

      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-[450px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input
               placeholder="Search by certificate title or platform..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
               className="pl-11 h-12 rounded-2xl bg-muted/20 border-border/60 focus-visible:ring-primary/20 transition-all font-medium text-sm"
             />
             <Button
                onClick={handleSearch}
                className="absolute right-1.5 top-1.5 h-9 rounded-xl bg-primary text-primary-foreground font-semibold uppercase tracking-widest text-[10px] px-4"
             >
                Filter
             </Button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             <Select value={status} onValueChange={handleStatus}>
                <SelectTrigger className="h-12 w-full md:w-48 rounded-2xl bg-muted/20 border-border/60 text-[11px] font-semibold uppercase tracking-widest">
                   <div className="flex items-center gap-2">
                     <Filter size={14} className="text-muted-foreground" />
                     <SelectValue placeholder="Status Context" />
                   </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                   <SelectItem value="all">Global Catalog</SelectItem>
                   <SelectItem value="Verified">Verified Only</SelectItem>
                   <SelectItem value="Pending">Pending Audit</SelectItem>
                   <SelectItem value="Rejected">Rejected Credentials</SelectItem>
                </SelectContent>
             </Select>

             <Button
                variant="outline"
                onClick={() => fetchCerts()}
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
                      <Skeleton className="h-6 w-1/2 rounded-lg" />
                      <Skeleton className="h-6 w-1/4 rounded-lg" />
                   </div>
                   <Skeleton className="h-4 w-1/3 rounded-lg" />
                   <Skeleton className="h-12 w-full rounded-xl" />
                   <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                      <Skeleton className="h-9 w-20 rounded-lg" />
                   </div>
                </Card>
              ))
            ) : certs.length === 0 ? (
              <div className="col-span-full py-40 border-2 border-dashed border-border/40 rounded-[32px] flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Medal size={32} className="text-muted-foreground/40" />
                 </div>
                 <h3 className="text-base font-semibold text-foreground">Registry Empty</h3>
                 <p className="text-xs text-muted-foreground mt-1 uppercase font-semibold tracking-widest px-8 max-w-sm">No certifications match your current administrative filter context.</p>
              </div>
            ) : (
              certs.map((cert, idx) => (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                   <Card className="group relative bg-card border-border border-1 shadow-sm rounded-[24px] overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                      <div className="p-6 flex-1 space-y-4">
                         <div className="flex justify-between items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors shrink-0">
                               <Award size={20} className="text-primary" />
                            </div>
                            <CertStatusBadge status={cert.status} />
                         </div>

                         <div>
                            <h3 className="text-base font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                               {cert.title || "Provisional Certification"}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1.5">
                               <Building2 size={12} className="text-muted-foreground" />
                               <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{cert.platform || "Independent Source"}</span>
                            </div>
                         </div>

                         <div className="bg-foreground/[0.02] rounded-2xl p-4 border border-border/40 space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-tight">
                               <span className="text-muted-foreground">Issuance Window</span>
                               <Calendar size={12} className="text-primary/60" />
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-[11px] font-gray-600 font-semibold text-foreground tabular-nums">
                                  {cert.from ? new Date(cert.from).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "—"}
                               </span>
                               <div className="h-[1px] flex-1 bg-border/60" />
                               <span className="text-[11px] font-gray-600 font-semibold  text-foreground tabular-nums">
                                  {cert.to ? new Date(cert.to).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Permanent"}
                               </span>
                            </div>
                         </div>
                      </div>

                      <div className="px-6 py-4 border-t border-border/20 bg-foreground/[0.01] flex items-center justify-between mt-auto">
                         <div className="flex flex-col">
                            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Digital Credential</span>
                            <span className="text-[11px] font-gray-600 font-semibold text-foreground max-w-[120px] truncate">{cert.platform || "N/A"}</span>
                         </div>
                         {cert.platformLink ? (
                            <Link href={cert.platformLink} target="_blank">
                               <Button size="sm" className="h-9 rounded-xl px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold uppercase tracking-widest text-[9px] gap-2 shadow-sm flex items-center">
                                  <Globe size={14} /> Open URL
                               </Button>
                            </Link>
                         ) : (
                           <Button disabled size="sm" variant="ghost" className="h-9 rounded-xl px-4 text-[9px] font-semibold uppercase tracking-widest gap-2 opacity-40">
                             <XCircle size={14} /> No Link
                           </Button>
                         )}
                      </div>
                   </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-border/40 gap-4">
             <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Ledger focus: <span className="text-foreground font-black">{certs.length}</span> / {total} entries
             </p>
             <div className="flex items-center gap-3 bg-muted/20 p-1.5 rounded-2xl border border-border/40">
                <Button
                   variant="ghost"
                   size="sm"
                   disabled={page <= 1}
                   onClick={() => { setPage(page - 1); fetchCerts({ page: page - 1 }); }}
                   className="h-9 px-4 rounded-xl text-[10px] font-semibold uppercase tracking-widest hover:bg-background"
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
                   onClick={() => { setPage(page + 1); fetchCerts({ page: page + 1 }); }}
                   className="h-9 px-4 rounded-xl text-[10px] font-semibold uppercase tracking-widest hover:bg-background"
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