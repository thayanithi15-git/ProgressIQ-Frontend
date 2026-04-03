"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, Globe, GraduationCap, User, Search, Filter, 
  ExternalLink, Layers, CheckCircle2, Clock, AlertCircle,
  MoreVertical, ArrowUpRight, FolderGit2, ChevronLeft, ChevronRight, RefreshCw,
  Database
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminProjectsStore } from "@/store/admin/projects";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ─── TOKENS ─────────────────────────────────────────────────────────────────
const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  "COMPLETED": {
    label: "Completed",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
    icon: CheckCircle2
  },
  "ONGOING": {
    label: "In Progress",
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.12)",
    icon: Clock
  },
  "IN PROGRESS": {
    label: "In Progress",
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.12)",
    icon: Clock
  },
  "PENDING": {
    label: "Pending Review",
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.12)",
    icon: AlertCircle
  }
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
const ProjectStatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status?.toUpperCase()] || { label: status, color: "#6b7280", bg: "rgba(107, 114, 128, 0.12)", icon: Layers };
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

export default function ProjectsAdmin() {
  const { projects, total, page, limit, isLoading, fetchProjects, setPage, setFilters } =
    useAdminProjectsStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProjects();
  }, [fetchProjects]);

  if (!mounted) return null;

  const handleSearch = () => {
    setFilters({ search: search === "" ? undefined : search });
    fetchProjects({ page: 1 });
  };

  const handleStatus = (s: string) => {
    setStatus(s);
    setFilters({ status: s === "all" ? undefined : s });
    fetchProjects({ page: 1 });
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { title: "Smart Health Monitor", description: "IoT based health tracking", githubLink: "https://github.com/...", websiteLink: "https://...", status: "Ongoing", studentEmail: "student@example.com" }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects Template");
    XLSX.writeFile(wb, "Project_Bulk_Template.xlsx");
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalNotification />
      <Header
        title="Project Repository"
        subtitle="Oversight of student clinical implementations and technical portfolios"
      />

      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Modern Filter Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
             <Button 
                onClick={() => setIsBulkUploadDialogOpen(true)}
                className="h-11 rounded-xl px-6 bg-primary text-primary-foreground font-semibold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
             >
                <FolderGit2 size={16} /> Bulk Upload
             </Button>
          </div>

          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by project name or student identifier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-11 h-12 rounded-2xl bg-muted/20 border-border/60 focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all font-medium text-sm"
            />
            <Button 
                onClick={handleSearch}
                className="absolute right-1.5 top-1.5 h-9 rounded-xl bg-primary text-primary-foreground font-semibold uppercase tracking-widest text-[10px] px-4"
            >
                Search
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={status} onValueChange={handleStatus}>
                <SelectTrigger className="h-12 w-full md:w-48 rounded-2xl bg-muted/20 border-border/60 text-[11px] font-semibold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-muted-foreground" />
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Global Catalog</SelectItem>
                  <SelectItem value="Completed">Verified Completion</SelectItem>
                  <SelectItem value="In Progress">Active Development</SelectItem>
                  <SelectItem value="Pending">Queue Pending</SelectItem>
                </SelectContent>
            </Select>

            <Button 
                variant="outline" 
                onClick={() => fetchProjects()}
                className="h-12 w-12 p-0 rounded-2xl border-border/60 hover:bg-muted/50 transition-all"
            >
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="rounded-2xl border border-border/40 p-6 space-y-4">
                   <Skeleton className="h-6 w-3/4 rounded-lg" />
                   <Skeleton className="h-4 w-1/2 rounded-lg" />
                   <Skeleton className="h-24 w-full rounded-xl" />
                   <div className="flex gap-2">
                      <Skeleton className="h-8 w-20 rounded-lg" />
                      <Skeleton className="h-8 w-20 rounded-lg" />
                   </div>
                </Card>
              ))
            ) : projects.length === 0 ? (
              <div className="col-span-full py-40 border-2 border-dashed border-border/40 rounded-[32px] flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <FolderGit2 size={32} className="text-muted-foreground/40" />
                 </div>
                 <h3 className="text-base font-semibold text-foreground">No Projects Found</h3>
                 <p className="text-xs text-muted-foreground mt-1 uppercase font-semibold tracking-widest">Broaden your filter search parameters</p>
              </div>
            ) : (
                projects.map((project, idx) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                        <Card className="group relative bg-card border-border border-1 shadow-sm rounded-[24px] overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                           <div className="p-6 space-y-4 flex-1">
                              <div className="flex justify-between items-start gap-4">
                                 <div>
                                    <h3 className="text-base font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">{project.title || "Experimental Build"}</h3>
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest mt-1 opacity-70">Project Identity</p>
                                 </div>
                                 <ProjectStatusBadge status={project.status} />
                              </div>

                              <div className="space-y-3 bg-foreground/[0.02] rounded-2xl p-4 border border-border/40">
                                 {project.studentId ? (
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                         <User size={14} className="text-orange-600" />
                                      </div>
                                      <div className="min-w-0">
                                         <p className="text-[11px] font-semibold text-foreground truncate">{project.studentId.firstName} {project.studentId.lastName}</p>
                                         <p className="text-[9px] text-muted-foreground uppercase font-semibold tracking-tighter">{project.studentId.department} • {project.studentId.year}</p>
                                      </div>
                                   </div>
                                 ) : (
                                   <div className="flex items-center gap-3 opacity-50">
                                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><User size={14} /></div>
                                      <p className="text-[11px] font-semibold italic">Anonymous Contributor</p>
                                   </div>
                                 )}

                                 {project.mentorId && (
                                   <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                         <GraduationCap size={14} className="text-blue-600" />
                                      </div>
                                      <div className="min-w-0">
                                         <p className="text-[11px] font-semibold text-foreground truncate">Advisor: {project.mentorId.name}</p>
                                         <p className="text-[9px] text-muted-foreground uppercase font-semibold tracking-widest">Faculty Reviewer</p>
                                      </div>
                                   </div>
                                 )}
                              </div>

                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 min-h-[4.5em]">
                                 {project.description || "Systematic analysis and implementation of core modules within the specified technical scope. No extended documentation available."}
                              </p>

                              <div className="flex items-center gap-3 pt-2">
                                 {project.githubLink && (
                                   <Link href={project.githubLink} target="_blank" className="flex-1">
                                      <Button variant="outline" className="w-full h-9 rounded-xl border-border/60 bg-muted/20 hover:bg-black hover:text-white transition-all text-[10px] font-semibold uppercase tracking-widest gap-2">
                                         <Github size={14} /> Repo
                                      </Button>
                                   </Link>
                                 )}
                                 {project.websiteLink && (
                                   <Link href={project.websiteLink} target="_blank" className="flex-1">
                                      <Button className="w-full h-9 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-[10px] font-semibold uppercase tracking-widest gap-2 shadow-sm">
                                         <Globe size={14} /> Live
                                      </Button>
                                   </Link>
                                 )}
                              </div>
                           </div>
                           
                           <div className="px-6 py-4 border-t border-border/20 bg-foreground/[0.01] flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                 {project.completedAt ? `Finalized: ${new Date(project.completedAt).toLocaleDateString()}` : "Active Pipeline"}
                              </span>
                              <Link href={`/admin/dashboard/projects/${project._id}`}>
                                 <button className="flex items-center gap-1 text-[10px] font-semibold text-primary uppercase tracking-widest hover:translate-x-1 transition-transform">
                                    Deep Audit <ArrowUpRight size={12} />
                                 </button>
                              </Link>
                           </div>
                        </Card>
                    </motion.div>
                ))
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Upload Dialog */}
        <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
          <DialogContent className="modal-sheet max-w-2xl p-0 overflow-hidden">
            <div className="px-6 py-5 border-b border-border/40 bg-foreground/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <FolderGit2 size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Bulk Project Ingestion</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Synchronize external project manifest</p>
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
                                  {["title", "description", "studentEmail", "status"].map(h => (
                                      <th key={h} className="px-4 py-3 font-black text-muted-foreground uppercase tracking-widest border-r border-border/40 last:border-0">{h}</th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody>
                              <tr className="border-t border-border/40">
                                  {["Smart Health", "IoT monitor...", "alex@edu.com", "Ongoing"].map((v, i) => (
                                      <td key={i} className="px-4 py-3 font-mono text-muted-foreground/60 border-r border-border/40 last:border-0 italic">{v}</td>
                                  ))}
                              </tr>
                          </tbody>
                      </table>
                  </div>
               </div>

               <div className="flex flex-col items-center py-10 px-4 rounded-3xl border-2 border-dashed border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.04] transition-all cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <ArrowUpRight className="text-primary w-8 h-8 -rotate-45" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-tight">Drop Manifest Here</h4>
                  <p className="text-[11px] text-muted-foreground font-medium mb-6">Select a .xlsx or .csv project dataset</p>
                  
                  <Input type="file" accept=".xlsx,.xls,.csv" className="hidden" id="project-bulk-file" />
                  <label htmlFor="project-bulk-file" className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] flex items-center cursor-pointer hover:shadow-lg transition-all shadow-md">
                      Select Manifest
                  </label>
               </div>
            </div>
            
            <div className="p-4 border-t border-border/40 bg-foreground/[0.01] flex justify-end">
              <Button variant="ghost" onClick={() => setIsBulkUploadDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-semibold tracking-widest">Abort Intake</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pagination Console */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-border/40 gap-4">
             <div className="flex items-center gap-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                   Viewing <span className="text-foreground font-black">{projects.length}</span> of {total} records
                </p>
             </div>
             
             <div className="flex items-center gap-3 bg-muted/20 p-1.5 rounded-2xl border border-border/40">
                <Button
                   variant="ghost"
                   size="sm"
                   disabled={page <= 1}
                   onClick={() => { setPage(page - 1); fetchProjects({ page: page - 1 }); }}
                   className="h-9 px-4 rounded-xl text-[10px] font-semibold uppercase tracking-widest hover:bg-background"
                >
                  <ChevronLeft size={16} className="mr-1" /> Previous
                </Button>
                
                <div className="w-[1px] h-4 bg-border/60 mx-1" />
                
                <span className="text-xs font-black text-foreground px-2 tabular-nums">
                   {page} <span className="text-muted-foreground font-medium mx-1">/</span> {totalPages}
                </span>

                <div className="w-[1px] h-4 bg-border/60 mx-1" />

                <Button
                   variant="ghost"
                   size="sm"
                   disabled={page >= totalPages}
                   onClick={() => { setPage(page + 1); fetchProjects({ page: page + 1 }); }}
                   className="h-9 px-4 rounded-xl text-[10px] font-semibold uppercase tracking-widest hover:bg-background"
                >
                  Next <ChevronRight size={16} className="ml-1" />
                </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}