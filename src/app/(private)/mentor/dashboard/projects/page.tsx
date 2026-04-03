'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Eye, X, Trash2, Github, Globe,
  Briefcase, AlertTriangle, Loader2,
  ChevronLeft, ChevronRight, Send, Bell, Zap, Calendar, ExternalLink
} from 'lucide-react';
import { useMentorProjectsStore } from '@/store/mentor/projects';
import { useAssignedStudentsStore } from '@/store/mentor/assignedStudents';
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

// ─── TOKENS ─────────────────────────────────────────────────────────────────
const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: {
    label: "Pending",
    color: "#6b7280",
    bg: "rgba(107, 114, 128, 0.12)",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#2563eb",
    bg: "rgba(59, 130, 246, 0.12)",
  },
  SUBMITTED: {
    label: "Submitted",
    color: "#7c3aed",
    bg: "rgba(124, 58, 237, 0.12)",
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
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (v?: string) => {
  if (!v) return '—';
  try {
    return new Date(v).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return v;
  }
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
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

const ConfirmDialog = ({ open, title, desc, onConfirm, onCancel, loading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay" onClick={onCancel}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="modal-sheet max-w-sm p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-destructive" />
            </div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{desc}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={onCancel} className="h-9 px-4 rounded-xl text-[11px] font-semibold uppercase tracking-wider">
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={loading} variant="destructive" className="h-9 px-5 rounded-xl text-[11px] font-semibold uppercase tracking-wider gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />} Delete
            </Button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const CreateProjectModal = ({ open, onClose, onCreate, loading, students }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setGithubLink('');
      setWebsiteLink('');
      setSelected([]);
      setSearch('');
    }
  }, [open]);

  const filtered = students.filter((s: any) => {
    const q = search.toLowerCase();
    return !q || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) || s.department?.toLowerCase().includes(q);
  });

  const toggle = (id: string) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const handleCreate = async () => {
    if (!title.trim() || !description.trim() || selected.length === 0) return;
    await onCreate({ title, description, dueDate: dueDate || undefined, githubLink, websiteLink, studentIds: selected });
    onClose();
  };

  const canCreate = title.trim() && description.trim() && selected.length > 0;

  return (
    <AnimatePresence>
      {open && (
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
                <h3 className="text-base font-semibold text-foreground">Assign Project</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Define scope and target students</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Project Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Next.js Analytics Dashboard" className="h-11 rounded-xl bg-muted/20 border-border/60" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed project requirements..."
                  className="w-full min-h-[100px] rounded-xl bg-muted/20 border border-border/60 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Due Date</label>
                  <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-11 rounded-xl bg-muted/20 border-border/60" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Website (Optional)</label>
                  <Input value={websiteLink} onChange={(e) => setWebsiteLink(e.target.value)} placeholder="Live demo URL" className="h-11 rounded-xl bg-muted/20 border-border/60" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Reference Repo</label>
                <Input value={githubLink} onChange={(e) => setGithubLink(e.target.value)} placeholder="GitHub repository URL" className="h-11 rounded-xl bg-muted/20 border-border/60" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Assign Mentees</label>
                  <span className="text-[10px] font-semibold text-primary">{selected.length} selected</span>
                </div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 text-xs rounded-lg border-border/40"
                  />
                </div>
                <div className="border border-border/40 rounded-xl max-h-[160px] overflow-y-auto bg-foreground/[0.01]">
                  {filtered.length === 0 ? (
                    <p className="p-4 text-center text-xs text-muted-foreground">No students located</p>
                  ) : (
                    filtered.map((s: any) => (
                      <label key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-foreground/[0.03] transition-colors cursor-pointer border-b border-border/20 last:border-0">
                        <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} className="w-4 h-4 rounded border-border/60 text-primary focus:ring-primary/20" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{s.firstName} {s.lastName}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.department} • Year {s.year}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border/50 bg-foreground/[0.01] flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} className="h-10 px-6 rounded-xl text-[11px] font-semibold uppercase tracking-wider">Cancel</Button>
              <Button onClick={handleCreate} disabled={loading || !canCreate} className="h-10 px-8 rounded-xl text-[11px] font-semibold uppercase tracking-wider gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />} Assign
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ProjectDetailModal = ({ project, onClose, onVerify, loading }: any) => {
  const [vNote, setVNote] = useState('');
  const [vPoints, setVPoints] = useState(0);

  useEffect(() => {
    if (project) {
      setVNote('');
      setVPoints(0);
    }
  }, [project]);

  if (!project) return null;

  const canVerify = project.status === 'SUBMITTED';
  const p = project;

  const handleVerify = async (status: 'APPROVED' | 'REJECTED') => {
    await onVerify(p.id, status, vNote, vPoints);
    onClose();
  };

  return (
    <AnimatePresence>
      {project && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-sheet max-w-2xl p-0 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-border/50 bg-foreground/[0.02] flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-base font-semibold text-foreground truncate">{p.title}</h3>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">by {p.student?.name}</span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 text-center">Student Context</p>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{p.student?.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.student?.department} • Year {p.student?.year}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Submitted On</p>
                  <p className="text-sm font-semibold">{fmt(p.links?.completedAt || p.createdDate)}</p>
                  {p.pointsAwarded > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                      <Zap className="w-3 h-3 fill-emerald-600" /> +{p.pointsAwarded} pts
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Project Summary</label>
                <div className="p-4 rounded-xl bg-foreground/[0.01] border border-border/40 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </div>
              </div>

              {(p.links?.github || p.links?.website) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {p.links.github && (
                    <a href={p.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors text-xs font-semibold uppercase tracking-wider">
                      <Github size={14} /> Repository
                    </a>
                  )}
                  {p.links.website && (
                    <a href={p.links.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/5 text-blue-500 border border-blue-500/10 hover:bg-blue-500/10 transition-colors text-xs font-semibold uppercase tracking-wider">
                      <Globe size={14} /> Live View
                    </a>
                  )}
                </div>
              )}

              {p.submissionNote && (
                <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10">
                  <label className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mb-1.5 block">Student Note</label>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">"{p.submissionNote}"</p>
                </div>
              )}

              {canVerify && (
                <div className="pt-6 border-t border-border/50">
                  <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-widest mb-4">Submission Verification</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Verification Note</label>
                      <textarea
                        value={vNote}
                        onChange={(e) => setVNote(e.target.value)}
                        placeholder="Feedback for the student..."
                        className="w-full min-h-[80px] rounded-xl bg-muted/20 border border-border/60 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Points to Award</label>
                        <Input type="number" value={vPoints || ''} onChange={(e) => setVPoints(parseInt(e.target.value) || 0)} className="h-10 rounded-xl bg-muted/20 border-border/60" />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleVerify('REJECTED')} disabled={loading} className="h-10 px-5 rounded-xl text-destructive hover:bg-destructive/10 border-destructive/20 text-[11px] font-semibold uppercase tracking-wider">
                          Reject
                        </Button>
                        <Button onClick={() => handleVerify('APPROVED')} disabled={loading} className="h-10 px-5 rounded-xl text-[11px] font-semibold uppercase tracking-wider gap-2 shadow-lg shadow-primary/20">
                          {loading && <Loader2 size={14} className="animate-spin" />} Approve & Award
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {p.verificationNote && !canVerify && (
                <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10">
                  <label className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mb-1.5 block">Verification Outcome</label>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">"{p.verificationNote}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function MentorProjectsPage() {
  const {
    projects, searchQuery, statusFilter, page, totalPages, total,
    isLoading, isSubmitting,
    fetchProjects, setSearchQuery, setStatusFilter, setPage, resetFilters,
    createProject, deleteProject, verifyProject, notifyStudents
  } = useMentorProjectsStore();

  const { students, fetchStudents } = useAssignedStudentsStore();

  const [searchDraft, setSearchDraft] = useState(searchQuery);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const STATUS_PILLS = [
    { val: '', label: 'All' },
    { val: 'PENDING', label: 'Pending' },
    { val: 'IN_PROGRESS', label: 'In Flux' },
    { val: 'SUBMITTED', label: 'Submitted' },
    { val: 'APPROVED', label: 'Approved' },
    { val: 'REJECTED', label: 'Rejected' },
  ];

  useEffect(() => {
    fetchProjects();
    fetchStudents();
  }, [fetchProjects, fetchStudents]);

  const pendingReview = projects.filter((p: any) => p.status === 'SUBMITTED').length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteProject(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const hasFilters = searchQuery || statusFilter;

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Projects"
        subtitle="Manage assignments and evaluate submissions"
        HeaderComp={
          <Button onClick={() => setCreateOpen(true)} className="h-9 px-4 rounded-xl text-[11px] font-semibold uppercase tracking-wider gap-2 shadow-lg shadow-primary/20">
            <Plus size={14} /> Assign Project
          </Button>
        }
      />

      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* Status Alert */}
        {pendingReview > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">{pendingReview} Projects Pending Review</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Evaluate submissions to award points</p>
              </div>
            </div>
            <Button variant="ghost" className="h-8 px-4 rounded-lg text-[10px] font-semibold uppercase tracking-widest text-primary hover:bg-primary/5" onClick={() => setStatusFilter('SUBMITTED')}>
              Review Now
            </Button>
          </motion.div>
        )}

        {/* Filter Bar */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
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

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchDraft)}
                className="pl-10 h-10 rounded-xl border-border/60 bg-muted/20"
              />
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetFilters();
                  setSearchDraft('');
                }}
                className="h-10 rounded-xl text-xs text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Projects Grid/Table */}
        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-foreground/[0.01] border-b border-border/40">
                  {['#', 'Project Details', 'Assigned Mentee', 'Submitted', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/40">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-5">
                          <Skeleton className="h-4 w-full rounded-lg" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      No Projects Identified
                    </td>
                  </tr>
                ) : (
                  projects.map((proj: any, idx: number) => {
                    const needsReview = proj.status === 'SUBMITTED';
                    return (
                      <motion.tr
                        key={proj.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="group border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition-colors cursor-pointer"
                        onClick={() => setSelectedProject(proj)}
                      >
                        <td className="px-6 py-4 align-middle text-[11px] font-mono text-muted-foreground font-semibold">
                          {((page - 1) * 20) + idx + 1}
                        </td>
                        <td className="px-6 py-4 align-middle min-w-[300px]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate max-w-[240px] tracking-tight">{proj.title}</p>
                              {(proj.links?.github || proj.links?.website) && (
                                <div className="flex gap-2.5 mt-1">
                                  {proj.links.github && <div className="flex items-center gap-1.5 text-[9px] font-semibold text-muted-foreground uppercase"><Github size={10} /> Repo</div>}
                                  {proj.links.website && <div className="flex items-center gap-1.5 text-[9px] font-semibold text-muted-foreground uppercase"><Globe size={10} /> Web</div>}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div>
                            <p className="text-sm font-semibold">{proj.student?.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{proj.student?.department}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {fmt(proj.createdDate)}
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <StatusBadge status={proj.status} />
                          {needsReview && <p className="text-[9px] font-semibold text-primary uppercase mt-1">Pending Evaluation</p>}
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {needsReview ? (
                              <Button
                                size="sm"
                                onClick={() => setSelectedProject(proj)}
                                className="h-8 px-4 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none text-[10px] font-semibold uppercase tracking-widest gap-2"
                              >
                                <Zap className="w-3.5 h-3.5" /> Evaluate
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedProject(proj)}
                                className="h-8 px-4 rounded-lg text-[10px] font-semibold uppercase tracking-widest gap-2"
                              >
                                <Eye className="w-3.5 h-3.5" /> Details
                              </Button>
                            )}
                            {proj.status === 'PENDING' && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setDeleteTarget(proj)}
                                className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                            {['PENDING', 'IN_PROGRESS', 'REJECTED'].includes(proj.status) && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  const msg = window.prompt('Message for student:', `Reminder for "${proj.title}"`);
                                  if (msg) notifyStudents(proj.id, msg);
                                }}
                                className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10"
                              >
                                <Bell className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Showing <span className="text-primary">{projects.length}</span> of {total} items
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-semibold uppercase tracking-wider gap-2"
              >
                <ChevronLeft size={14} /> Prev
              </Button>
              <div className="px-4 text-xs font-semibold text-muted-foreground">
                {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-semibold uppercase tracking-wider gap-2"
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createProject} loading={isSubmitting} students={students} />
      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} onVerify={verifyProject} loading={isSubmitting} />
      <ConfirmDialog open={!!deleteTarget} title="Delete Project" desc={`Remove "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
    </div>
  );
}