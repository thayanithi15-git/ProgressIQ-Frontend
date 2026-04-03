'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Eye, X, Trash2, Calendar,
  CheckCircle, Clock, Send, Bell, Zap, AlertCircle, AlertTriangle, Loader2,
  ChevronLeft, ChevronRight, Users
} from 'lucide-react';
import { useMentorTasksStore } from '@/store/mentor/tasks';
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

const isOverdueNow = (due: string, raw: string) =>
  !['APPROVED'].includes(raw) && new Date(due) < new Date();

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
const StatusBadge = ({ raw, due }: { raw: string; due: string }) => {
  const od = isOverdueNow(due, raw);
  if (od && raw === 'PENDING') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/10 gap-1">
        <AlertCircle size={10} /> Overdue
      </span>
    );
  }
  const meta = STATUS_META[raw?.toUpperCase()] ?? STATUS_META.PENDING;
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

const CreateTaskModal = ({ open, onClose, onCreate, loading, students }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setDueDate('');
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
    if (!title.trim() || !dueDate || selected.length === 0) return;
    await onCreate(title, description, dueDate, selected);
    onClose();
  };

  const canAssign = title.trim() && dueDate && selected.length > 0;

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
                <h3 className="text-base font-semibold text-foreground">Assign New Task</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Push tasks to selected students</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Task Identifier</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Implement Responsive Sidebar" className="h-11 rounded-xl bg-muted/20 border-border/60" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Instructions</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full min-h-[100px] rounded-xl bg-muted/20 border border-border/60 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Target Deadline</label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-11 rounded-xl bg-muted/20 border-border/60" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Assign Mentees</label>
                  <span className="text-[10px] font-semibold text-primary">{selected.length} targeted</span>
                </div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search mentees..."
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
              <Button onClick={handleCreate} disabled={loading || !canAssign} className="h-10 px-8 rounded-xl text-[11px] font-semibold uppercase tracking-wider gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />} Create & Assign
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TaskDetailModal = ({ task, onClose, onVerify, loading }: any) => {
  const [vNote, setVNote] = useState('');
  const [vPoints, setVPoints] = useState(0);

  useEffect(() => {
    if (task) {
      setVNote('');
      setVPoints(0);
    }
  }, [task]);

  if (!task) return null;

  const canVerify = task.rawStatus === 'SUBMITTED';
  const t = task;

  const handleVerify = async (status: 'APPROVED' | 'REJECTED') => {
    await onVerify(t.id, status, vNote, vPoints);
    onClose();
  };

  return (
    <AnimatePresence>
      {task && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-sheet max-w-xl p-0 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-border/50 bg-foreground/[0.02] flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-base font-semibold text-foreground truncate">{t.title}</h3>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Assignee: {t.assignedTo}</span>
                  <StatusBadge raw={t.rawStatus} due={t.dueDate} />
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 text-center">Mentee Information</p>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{t.assignedTo}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.student?.department} • Year {t.student?.year}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 text-center">Due On</p>
                  <p className={`text-sm font-semibold ${isOverdueNow(t.dueDate, t.rawStatus) ? 'text-destructive' : ''}`}>{fmt(t.dueDate)}</p>
                  {t.pointsAwarded > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                      <Zap className="w-3 h-3 fill-emerald-600" /> +{t.pointsAwarded} pts
                    </div>
                  )}
                </div>
              </div>

              {t.description && (
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Task Instructions</label>
                  <div className="p-4 rounded-xl bg-foreground/[0.01] border border-border/40 text-sm leading-relaxed text-muted-foreground">
                    {t.description}
                  </div>
                </div>
              )}

              {t.submissionNote && (
                <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10">
                  <label className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mb-1.5 block">Student Submission</label>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">"{t.submissionNote}"</p>
                </div>
              )}

              {canVerify && (
                <div className="pt-6 border-t border-border/50">
                  <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-widest mb-4">Evaluate Submission</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Review Comments</label>
                      <textarea
                        value={vNote}
                        onChange={(e) => setVNote(e.target.value)}
                        placeholder="Feedback for the student..."
                        className="w-full min-h-[80px] rounded-xl bg-muted/20 border border-border/60 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Reward Points</label>
                        <Input type="number" value={vPoints || ''} onChange={(e) => setVPoints(parseInt(e.target.value) || 0)} className="h-10 rounded-xl bg-muted/20 border-border/60" />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleVerify('REJECTED')} disabled={loading} className="h-10 px-5 rounded-xl text-destructive hover:bg-destructive/10 border-destructive/20 text-[11px] font-semibold uppercase tracking-wider">
                          Reject
                        </Button>
                        <Button onClick={() => handleVerify('APPROVED')} disabled={loading} className="h-10 px-5 rounded-xl text-[11px] font-semibold uppercase tracking-wider gap-2 shadow-lg shadow-primary/20">
                          {loading && <Loader2 size={14} className="animate-spin" />} Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {t.verificationNote && !canVerify && (
                <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10">
                  <label className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mb-1.5 block">Mentor Feedback</label>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">"{t.verificationNote}"</p>
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
export default function MentorTasksPage() {
  const {
    tasks, searchQuery, statusFilter, page, totalPages, total, isLoading, isSubmitting,
    fetchTasks, setSearchQuery, setStatusFilter, setPage, resetFilters,
    createTask, deleteTask, verifyTask, notifyStudents
  } = useMentorTasksStore();

  const { students, fetchStudents } = useAssignedStudentsStore();

  const [searchDraft, setSearchDraft] = useState(searchQuery);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const STATUS_PILLS = [
    { val: '', label: 'All' },
    { val: 'PENDING', label: 'Pending' },
    { val: 'IN_PROGRESS', label: 'In Progress' },
    { val: 'SUBMITTED', label: 'Submitted' },
    { val: 'APPROVED', label: 'Approved' },
    { val: 'REJECTED', label: 'Rejected' },
  ];

  useEffect(() => {
    fetchTasks();
    fetchStudents();
  }, [fetchTasks, fetchStudents]);

  const pendingReview = tasks.filter((t) => t.rawStatus === 'SUBMITTED').length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteTask(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const hasFilters = searchQuery || statusFilter;

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Tasks"
        subtitle="Maintain actionable items for your assigned mentees"
        HeaderComp={
          <Button onClick={() => setCreateOpen(true)} className="h-9 px-4 rounded-xl text-[11px] font-semibold uppercase tracking-wider gap-2 shadow-lg shadow-primary/20">
            <Plus size={14} /> Create Task
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
                <p className="text-sm font-semibold text-primary">{pendingReview} Tasks Awaiting Review</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Evaluate submissions to maintain student progress</p>
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
                placeholder="Search tasks..."
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

        {/* Tasks Table */}
        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-foreground/[0.01] border-b border-border/40">
                  {['#', 'Task Identity', 'Assignee', 'Deadline', 'Status', 'Actions'].map((h) => (
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
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      No Task Records Found
                    </td>
                  </tr>
                ) : (
                  tasks.map((task: any, idx: number) => {
                    const needsReview = task.rawStatus === 'SUBMITTED';
                    const od = isOverdueNow(task.dueDate, task.rawStatus);
                    return (
                      <motion.tr
                        key={task.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="group border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition-colors cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                        <td className="px-6 py-4 align-middle text-[11px] font-mono text-muted-foreground font-semibold">
                          {((page - 1) * 20) + idx + 1}
                        </td>
                        <td className="px-6 py-4 align-middle min-w-[300px]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate max-w-[240px] tracking-tight">{task.title}</p>
                              {task.description && <p className="text-[10px] text-muted-foreground truncate max-w-[240px]">{task.description}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div>
                            <p className="text-sm font-semibold">{task.assignedTo}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{task.student?.department}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${od ? 'text-destructive' : 'text-muted-foreground'}`}>
                            <Clock size={12} /> {fmt(task.dueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <StatusBadge raw={task.rawStatus} due={task.dueDate} />
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {needsReview ? (
                              <Button
                                size="sm"
                                onClick={() => setSelectedTask(task)}
                                className="h-8 px-4 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 text-[10px] font-semibold uppercase tracking-widest gap-2"
                              >
                                <Zap className="w-3.5 h-3.5" /> Evaluate
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedTask(task)}
                                className="h-8 px-4 rounded-lg text-[10px] font-semibold uppercase tracking-widest gap-2"
                              >
                                <Eye className="w-3.5 h-3.5" /> Details
                              </Button>
                            )}
                            {(task.rawStatus === 'PENDING' || task.rawStatus === 'REJECTED') && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setDeleteTarget(task)}
                                className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                            {['PENDING', 'IN_PROGRESS', 'REJECTED'].includes(task.rawStatus) && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  const msg = window.prompt('Message for student:', `Action Required: "${task.title}"`);
                                  if (msg) notifyStudents(task.id, msg);
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
              Showing <span className="text-primary">{tasks.length}</span> of {total} items
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

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createTask} loading={isSubmitting} students={students} />
      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} onVerify={verifyTask} loading={isSubmitting} />
      <ConfirmDialog open={!!deleteTarget} title="Delete Task" desc={`Remove "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
    </div>
  );
}
