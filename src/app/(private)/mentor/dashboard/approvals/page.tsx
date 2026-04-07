'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle, XCircle, MessageSquare, Award, X,
  ChevronLeft, ChevronRight, Clock, Loader2,
  FolderKanban, ClipboardList, Briefcase, Eye, Zap, Send
} from 'lucide-react';
import { useApprovalsStore } from '@/store/mentor/approval';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: {
    label: "Pending",
    color: "#6b7280",
    bg: "rgba(107, 114, 128, 0.12)",
  },
  APPROVED: {
    label: "Approved",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
  },
  REJECTED: {
    label: "Rejected",
    color: "#dc2626",
    bg: "rgba(239, 68, 68, 0.12)",
  },
  SUBMITTED: {
    label: "Submitted",
    color: "#7c3aed",
    bg: "rgba(124, 58, 237, 0.12)",
  },
};

const getEntityIcon = (type: string) => {
  switch (type?.toUpperCase()) {
    case 'PROJECT': return FolderKanban;
    case 'TASK': return ClipboardList;
    case 'INTERNSHIP': return Briefcase;
    case 'CERTIFICATION': return Award;
    default: return Award;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status?.toUpperCase()] ?? STATUS_META.PENDING;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, subtext }: any) => (
  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors">{value}</p>
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-1.5">{label}</p>
        {subtext && <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">{subtext}</p>}
      </div>
      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        <Icon size={18} className="text-primary" />
      </div>
    </div>
  </div>
);

const ReviewModal = ({ submission, onClose, onApprove, isSubmitting }: any) => {
  const [pointType, setPointType] = useState('basic');
  const [customPoints, setCustomPoints] = useState('');
  const [feedback, setFeedback] = useState('');

  if (!submission) return null;

  const pointOptions: Record<string, number> = { basic: 10, intermediate: 20, premium: 50, issue: -10 };

  const handleApprove = () => {
    const points = pointType === 'manual' ? parseInt(customPoints) || 0 : pointOptions[pointType];
    onApprove(submission.submission._id, submission.entityType, 'Approved', points, feedback);
    onClose();
  };

  const handleReject = () => {
    onApprove(submission.submission._id, submission.entityType, 'Rejected', 0, feedback);
    onClose();
  };

  const EntityIcon = getEntityIcon(submission.entityType);

  return (
    <AnimatePresence>
      {submission && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-sheet max-w-xl p-0 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-border/50 bg-foreground/[0.02] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Evaluate Submission</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{submission.entityTitle}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="p-5 rounded-2xl bg-foreground/[0.01] border border-border/40">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <EntityIcon size={14} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">{submission.entityType}</span>
                  </div>
                  <StatusBadge status={submission.status} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Associate</label>
                    <p className="text-sm font-semibold text-foreground">{submission.studentName}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Receipt Date</label>
                    <p className="text-sm font-semibold text-foreground">{new Date(submission.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Audit Commentary</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide technical feedback or observations..."
                  className="w-full min-h-[100px] rounded-xl bg-muted/20 border border-border/60 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 block">Reward Configuration</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { val: 'basic', label: 'Basic Award', pts: '10 pts', desc: 'Standard item completion' },
                    { val: 'intermediate', label: 'Standard Award', pts: '20 pts', desc: 'Above-average execution' },
                    { val: 'premium', label: 'Excellence Award', pts: '50 pts', desc: 'Outstanding demonstration' },
                    { val: 'issue', label: 'Compliance Issue', pts: '-10 pts', desc: 'Policy divergence' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setPointType(opt.val)}
                      className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all text-left group ${
                        pointType === opt.val
                          ? 'bg-primary/5 border-primary shadow-sm'
                          : 'bg-transparent border-border/40 hover:bg-muted/10'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        pointType === opt.val ? 'border-primary' : 'border-border'
                      }`}>
                        {pointType === opt.val && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                             opt.val === 'issue' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                          }`}>
                            {opt.pts}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}

                  <div className={`mt-2 p-4 rounded-xl border transition-all ${
                     pointType === 'manual' ? 'bg-primary/5 border-primary shadow-sm' : 'bg-transparent border-border/40 hover:bg-muted/10'
                  }`}>
                    <label className="flex items-center gap-4 cursor-pointer" onClick={() => setPointType('manual')}>
                       <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        pointType === 'manual' ? 'border-primary' : 'border-border'
                      }`}>
                        {pointType === 'manual' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm font-semibold text-foreground">Manual Override</span>
                    </label>
                    {pointType === 'manual' && (
                      <div className="mt-3 pl-8">
                        <Input
                          type="number"
                          placeholder="Points"
                          value={customPoints}
                          onChange={(e) => setCustomPoints(e.target.value)}
                          className="h-10 rounded-xl bg-background border-border/60"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border/50 bg-foreground/[0.01] flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={isSubmitting}
                className="h-10 px-6 rounded-xl text-destructive hover:bg-destructive/10 border-destructive/20 text-[11px] font-semibold uppercase tracking-wider gap-2"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />} <XCircle size={14} /> Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="h-10 px-8 rounded-xl text-[11px] font-semibold uppercase tracking-wider gap-2 shadow-lg shadow-primary/20"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />} <CheckCircle size={14} /> Finalize Audit
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function MentorApprovalsPage() {
  const {
    submissions, submissionDetail, stats, searchQuery, statusFilter,
    entityTypeFilter, page, totalPages, isLoading, isSubmitting,
    fetchSubmissions, fetchSubmissionDetail, setSearchQuery, setStatusFilter,
    setEntityTypeFilter, setPage, resetFilters, closeDetail, updateApproval,
  } = useApprovalsStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions, searchQuery, statusFilter, entityTypeFilter, page]);

  const hasFilters = searchQuery || statusFilter || entityTypeFilter;

  const STATUS_PILLS = [
    { val: '', label: 'All Audits' },
    { val: 'Pending', label: 'Pending' },
    { val: 'Approved', label: 'Validated' },
    { val: 'Rejected', label: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Approvals"
        subtitle="Finalize records and award merit points to students"
      />

      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={MessageSquare} label="Total Records" value={stats.total} subtext="Full submission history" />
            <StatCard icon={Clock} label="Pending Review" value={stats.pending} subtext="Requires immediate attention" />
            <StatCard icon={CheckCircle} label="Validated" value={stats.approved} subtext="Successfully audited" />
            <StatCard icon={XCircle} label="Rejected" value={stats.rejected} subtext="Compliance issues" />
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-4">Functional Split</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    { label:'Projects', val:stats.byType.project, icon:FolderKanban },
                    { label:'Tasks', val:stats.byType.task, icon:ClipboardList },
                    { label:'Interns', val:stats.byType.internship, icon:Briefcase },
                    { label:'Certs', val:stats.byType.certification, icon:Award },
                  ].map(({ label, val, icon:Icon }) => (
                    <div key={label} className="flex items-center gap-2">
                       <Icon size={12} className="text-primary/60" />
                       <span className="text-[10px] font-semibold text-foreground">{val}</span>
                       <span className="text-[9px] text-muted-foreground uppercase font-medium">{label}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
              {STATUS_PILLS.map((p) => (
                <button
                  key={p.val}
                  onClick={() => setStatusFilter(p.val)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    statusFilter === p.val
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border/40'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search audit records..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(tempSearch)}
                className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
              <SelectTrigger className="h-10 w-full md:w-56 rounded-xl bg-muted/10 border-border/60 text-xs font-semibold uppercase tracking-wider">
                <SelectValue placeholder="All Category Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="PROJECT">Projects</SelectItem>
                <SelectItem value="TASK">Tasks</SelectItem>
                <SelectItem value="INTERNSHIP">Internships</SelectItem>
                <SelectItem value="CERTIFICATION">Certifications</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button
                variant="ghost"
                onClick={() => {
                  resetFilters();
                  setTempSearch('');
                }}
                className="h-10 rounded-xl text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-destructive gap-2"
              >
                <X className="w-4 h-4" /> Reset Controls
              </Button>
            )}
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-foreground/[0.01] border-b border-border/40">
                  {['Submission Target', 'Associate', 'Functional Unit', 'Status', 'Receipt Date', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/40">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-5">
                          <Skeleton className="h-4 w-full rounded-lg" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      No Records Awaiting Audit
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub: any, idx: number) => {
                    const EntityIcon = getEntityIcon(sub.entityType);
                    return (
                      <motion.tr
                        key={sub.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="group border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition-colors cursor-pointer"
                        onClick={() => fetchSubmissionDetail(sub.entityType, sub.entityId)}
                      >
                        <td className="px-6 py-4 align-middle min-w-[280px]">
                          <p className="text-sm font-semibold truncate max-w-[250px] tracking-tight">{sub.entityTitle}</p>
                          <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter mt-0.5 opacity-60">ID: {sub.entityId}</p>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center gap-2">
                             <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                               {sub.studentName?.charAt(0)}
                             </div>
                             <p className="text-sm font-semibold">{sub.studentName}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center gap-2 text-primary">
                            <EntityIcon size={12} className="text-primary/60" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest border border-primary/10 px-2 py-0.5 rounded bg-primary/5">
                              {sub.entityType}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-6 py-4 align-middle">
                           <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase">
                             <Clock size={12} className="opacity-60" />
                             {new Date(sub.submittedDate).toLocaleDateString()}
                           </div>
                        </td>
                        <td className="px-6 py-4 align-middle text-right">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchSubmissionDetail(sub.entityType, sub.entityId);
                            }}
                            className="h-8 px-4 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 text-[10px] font-semibold uppercase tracking-widest gap-2"
                          >
                            <Zap className="w-3.5 h-3.5" /> Review Audit
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Audit Index: <span className="text-primary">{page}</span> of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-semibold uppercase tracking-wider gap-2"
              >
                <ChevronLeft size={14} /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-semibold uppercase tracking-wider gap-2"
              >
                Forward <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ReviewModal
        submission={submissionDetail}
        onClose={closeDetail}
        onApprove={updateApproval}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
