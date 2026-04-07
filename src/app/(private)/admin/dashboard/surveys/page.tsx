"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck, Users, Calendar, CheckCircle2,
  Clock, XCircle, Search, Filter, RefreshCw,
  ChevronLeft, ChevronRight, MessageSquare,
  BarChart3, User, GraduationCap, ArrowUpRight,
  Layers, ShieldAlert, History, ExternalLink,
  Table as TableIcon, Upload, Database, FileSpreadsheet
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { useAdminSurveysStore } from "@/store/admin/surveys";
import { ScrollArea } from "@/components/ui/scroll-area";

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  "ACTIVE": {
    label: "Live Protocol",
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.12)",
    icon: RefreshCw
  },
  "COMPLETED": {
    label: "Resolved Archive",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
    icon: CheckCircle2
  },
  "CLOSED": {
    label: "Inactive Stream",
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.12)",
    icon: XCircle
  }
};

const SurveyStatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status?.toUpperCase()] || { label: status, color: "#6b7280", bg: "rgba(107, 114, 128, 0.12)", icon: Layers };
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      <Icon size={10} className={`stroke-[3] ${status?.toUpperCase() === 'ACTIVE' ? 'animate-spin-slow' : ''}`} />
      {meta.label}
    </span>
  );
};

export default function AdminSurveysPage() {
  const {
    surveys, surveyResponses, isLoading, isResponsesLoading,
    statusFilter, page, total, totalPages,
    fetchSurveys, fetchSurveyResponses, setStatusFilter, setPage, resetFilters, clearResponses
  } = useAdminSurveysStore();

  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSurveys();
  }, [fetchSurveys]);

  if (!mounted) return null;

  const handleViewResponses = async (survey: any) => {
    setSelectedSurvey(survey);
    await fetchSurveyResponses(survey.id);
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { title: "Exit Feedback 2024", description: "Final year student feedback", status: "Active", mentorEmail: "mentor@example.com", questions: "How was your experience?;What can be improved?;Rating(1-5)" }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Surveys Template");
    XLSX.writeFile(wb, "Survey_Bulk_Template.xlsx");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalNotification />
      <Header
        title="Insight Protocols"
        subtitle="Operational oversight of academic surveys and student feedback streams"
      />

      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-3 w-full md:w-auto">
                <Select value={statusFilter || "all"} onValueChange={(v) => { setStatusFilter(v); fetchSurveys(); }}>
                    <SelectTrigger className="h-11 w-full md:w-48 rounded-2xl bg-muted/20 border-border/60 text-[10px] font-semibold uppercase tracking-widest">
                         <div className="flex items-center gap-2">
                            <Filter size={14} className="text-muted-foreground" />
                            <SelectValue placeholder="Protocol State" />
                         </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">Global Archive</SelectItem>
                        <SelectItem value="Active">Live Protocols</SelectItem>
                        <SelectItem value="Completed">Resolved State</SelectItem>
                        <SelectItem value="Closed">Inactive Context</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => { resetFilters(); fetchSurveys(); }} className="h-11 w-11 p-0 rounded-2xl border-border/60 bg-muted/20 hover:bg-muted/50 transition-all">
                    <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="rounded-[28px] border border-border/40 p-6 space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-1/2 rounded-lg" />
                                <Skeleton className="h-6 w-1/4 rounded-full" />
                            </div>
                            <Skeleton className="h-16 w-full rounded-2xl" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-24 rounded-lg" />
                                <Skeleton className="h-8 w-24 rounded-lg" />
                            </div>
                        </Card>
                    ))
                ) : surveys.length === 0 ? (
                    <div className="col-span-full py-40 border-2 border-dashed border-border/40 rounded-[40px] flex flex-col items-center justify-center text-center bg-muted/5">
                        <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6 border border-border/40">
                            <MessageSquare size={40} className="text-muted-foreground/30" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Registry Empty</h3>
                        <p className="text-[11px] text-muted-foreground mt-2 uppercase font-semibold tracking-[0.2em] px-10 max-w-md">No protocols match the current global administrative filter state.</p>
                    </div>
                ) : (
                    surveys.map((survey, idx) => (
                        <motion.div
                            key={survey.id}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="group relative bg-card border-border/60 border-1 shadow-sm rounded-[32px] overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col">
                                <div className="p-6 flex-1 space-y-5">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="w-12 h-12 rounded-[20px] bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-all duration-500">
                                            <ClipboardCheck size={24} className="text-primary" />
                                        </div>
                                        <SurveyStatusBadge status={survey.status} />
                                    </div>

                                    <div>
                                        <h4 className="text-base font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                            {survey.title || "Experimental Insight Protocol"}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-2 opacity-70">
                                            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                <GraduationCap size={12} className="text-blue-600" />
                                            </div>
                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest truncate">{survey.mentor?.name || "System Automated"}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-foreground/[0.02] rounded-2xl p-4 border border-border/40 text-center">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Analysis Query</p>
                                            <p className="text-xl font-black text-foreground tabular-nums">{survey.questions?.length || 0}</p>
                                            <p className="text-[9px] font-semibold text-muted-foreground uppercase mt-1">Questions</p>
                                        </div>
                                        <div className="bg-primary/[0.03] rounded-2xl p-4 border border-primary/10 text-center">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Responds</p>
                                            <p className="text-xl font-black text-primary tabular-nums">{survey.respondents || 0}</p>
                                            <p className="text-[9px] font-semibold text-primary uppercase mt-1">Respondents</p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2 min-h-[3em]">
                                        {survey.description || "Systematic analysis of student feedback loops within the specified operational domain."}
                                    </p>
                                </div>

                                <div className="px-6 py-4 border-t border-border/20 bg-foreground/[0.01] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="text-muted-foreground/60" />
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{new Date(survey.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => handleViewResponses(survey)}
                                        className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:translate-x-1 transition-transform group-hover:drop-shadow-sm"
                                    >
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
                    Archive Focus: <span className="text-foreground font-black">{surveys.length}</span> of <span className="text-primary font-black">{total}</span> protocols
                </p>
                <div className="flex items-center gap-3 bg-muted/20 p-1.5 rounded-2xl border border-border/40 text-[10px] font-black uppercase tracking-widest">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => { setPage(page - 1); fetchSurveys(); }}
                        className="h-9 px-4 rounded-xl hover:bg-background transition-all"
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <div className="w-[1px] h-4 bg-border/40 mx-1" />
                    <span className="text-xs px-4 tabular-nums text-foreground">{page} / {totalPages}</span>
                    <div className="w-[1px] h-4 bg-border/40 mx-1" />

                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => { setPage(page + 1); fetchSurveys(); }}
                        className="h-9 px-4 rounded-xl hover:bg-background transition-all"
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
                <h3 className="text-base font-semibold text-foreground">Bulk Protocol Creation</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Synchronize large-scale insight streams</p>
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
                                {["title", "description", "mentorEmail", "questions"].map(h => (
                                    <th key={h} className="px-4 py-3 font-black text-muted-foreground uppercase tracking-widest border-r border-border/40 last:border-0">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border/40">
                                {["Exit 24", "Final feed...", "m@edu.com", "Q1;Q2;Q3"].map((v, i) => (
                                    <td key={i} className="px-4 py-3 font-mono text-muted-foreground/60 border-r border-border/40 last:border-0 italic">{v}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-[9px] text-muted-foreground/60 mt-2 text-left italic">* Semicolon (;) delimited questions for array parsing</p>
             </div>

             <div className="flex flex-col items-center py-10 px-4 rounded-3xl border-2 border-dashed border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.04] transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                    <Upload className="text-primary w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-tight">Drop Manifest Here</h4>
                <p className="text-[11px] text-muted-foreground font-medium mb-6">Select a .xlsx or .csv protocol dataset</p>
                <Input type="file" accept=".xlsx,.xls,.csv" className="hidden" id="survey-bulk-file" />
                <label htmlFor="survey-bulk-file" className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] flex items-center cursor-pointer hover:shadow-lg transition-all shadow-md">
                    Select Manifest
                </label>
             </div>
          </div>
          <div className="p-4 border-t border-border/40 bg-foreground/[0.01] flex justify-end">
            <Button variant="ghost" onClick={() => setIsBulkUploadDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-semibold tracking-widest">Abort Intake</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSurvey} onOpenChange={() => { setSelectedSurvey(null); clearResponses(); }}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[32px] bg-background shadow-2xl">
              <div className="p-8 border-b border-border/40 bg-foreground/[0.01]">
                  <DialogHeader>
                      <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                              <MessageSquare className="text-primary w-6 h-6" />
                          </div>
                          <div>
                              <DialogTitle className="text-xl font-black text-foreground uppercase tracking-tight">{selectedSurvey?.title}</DialogTitle>
                              <div className="flex items-center gap-2 mt-1">
                                  <SurveyStatusBadge status={selectedSurvey?.status || ""} />
                                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">• Global Telemetry Audit</span>
                              </div>
                          </div>
                      </div>
                      <DialogDescription className="text-xs text-muted-foreground leading-relaxed font-medium">
                          Comprehensive analysis of student responses captured within this insight stream. All data points are validated and archived.
                      </DialogDescription>
                  </DialogHeader>
              </div>

              <ScrollArea className="max-h-[60vh]">
                  <div className="p-8 space-y-6">
                      {isResponsesLoading ? (
                          <div className="space-y-4">
                             {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
                          </div>
                      ) : surveyResponses.length === 0 ? (
                          <div className="py-20 text-center">
                              <ShieldAlert className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">No Response Data Captured</h4>
                          </div>
                      ) : (
                          <div className="space-y-6">
                              {surveyResponses.map((resp: any, idx: number) => (
                                  <Card key={idx} className="border-border/40 bg-muted/10 rounded-2xl overflow-hidden shadow-sm">
                                      <div className="p-4 border-b border-border/40 bg-foreground/[0.02] flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                  <User size={14} className="text-primary" />
                                              </div>
                                              <div>
                                                  <p className="text-[11px] font-black text-foreground">{resp.studentId?.firstName} {resp.studentId?.lastName}</p>
                                                  <p className="text-[9px] text-muted-foreground uppercase font-semibold tracking-tighter">{resp.studentId?.email}</p>
                                              </div>
                                          </div>
                                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{new Date(resp.createdAt).toLocaleString()}</span>
                                      </div>
                                      <div className="p-5 space-y-4">
                                          {resp.answers?.map((ans: any, qIdx: number) => (
                                              <div key={qIdx} className="space-y-2">
                                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Context Query 0{qIdx + 1}</p>
                                                  <p className="text-xs font-semibold text-foreground leading-relaxed p-3 rounded-xl bg-background border border-border/40 shadow-inner">
                                                      {ans.answer}
                                                  </p>
                                              </div>
                                          ))}
                                      </div>
                                  </Card>
                              ))}
                          </div>
                      )}
                  </div>
              </ScrollArea>

              <div className="p-6 border-t border-border/40 bg-foreground/[0.01] flex justify-end gap-3">
                  <Button onClick={() => setSelectedSurvey(null)} variant="outline" className="h-11 rounded-xl px-8 border-border/60 text-[10px] font-black uppercase tracking-widest">Terminate Audit</Button>
                  <Button className="h-11 rounded-xl px-8 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest gap-2">
                      <ExternalLink size={14} /> Export Insight
                  </Button>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
