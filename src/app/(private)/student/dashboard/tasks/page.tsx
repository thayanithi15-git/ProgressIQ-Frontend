"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare, Plus, Search, Edit2, Trash2, Calendar,
  ChevronLeft, ChevronRight, MessageSquare, X, Loader2,
  CheckCircle, Clock, XCircle, AlertTriangle, Send,
  AlertCircle, ClipboardList, Play, Eye,
} from "lucide-react";
import { useTasksStore, Task, TaskStatusFilter } from "@/store/student/tasks";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";

const C = {
  blue:    "var(--piq-blue)",
  violet:  "#7C3AED",
  emerald: "#059669",
  amber:   "#D97706",
  rose:    "#E11D48",
  cyan:    "#0891B2",
  indigo:  "#6366F1",
};
const ACCENT = C.indigo;

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING:     { label: "Pending",     color: C.amber,   bg: `${C.amber}18`,   icon: Clock },
  IN_PROGRESS: { label: "In Progress", color: C.blue,    bg: `${C.blue}18`,    icon: Play },
  SUBMITTED:   { label: "Submitted",   color: C.indigo,  bg: `${C.indigo}18`,  icon: Send },
  APPROVED:    { label: "Approved",    color: C.emerald, bg: `${C.emerald}18`, icon: CheckCircle },
  REJECTED:    { label: "Rejected",    color: C.rose,    bg: `${C.rose}18`,    icon: XCircle },
};

const Sk = ({ h = 16, className = "" }: { h?: number; className?: string }) => (
  <div className={`animate-pulse bg-foreground/5 rounded-lg ${className}`} style={{ height: h }} />
);

const fmt = (v?: string) => {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return v; }
};

const mentorName = (m: any) =>
  m && typeof m === "object" ? `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || "—" : "—";

const isOverdue = (due: string, status: string) =>
  !["SUBMITTED", "APPROVED"].includes(status) && new Date(due) < new Date();

const StatusBadge = ({ status, overdue }: { status: string; overdue?: boolean }) => {
  if (overdue && !["APPROVED", "SUBMITTED"].includes(status)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-rose-500/10 text-rose-600">
        <AlertCircle size={12} />Overdue
      </span>
    );
  }
  const m = STATUS_META[status] ?? STATUS_META.PENDING;
  const Icon = m.icon;
  return (
    <span style={{ background: m.bg, color: m.color }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
      <Icon size={12} />{m.label}
    </span>
  );
};

const Pill = ({ label, active, onClick, count }: { label:string; active:boolean; onClick:()=>void; count?:number }) => (
  <button onClick={onClick} className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${active ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card/50 text-muted-foreground border-transparent hover:bg-foreground/5'}`}>
    {label}
    {count != null && <span className={`text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-md ${active ? 'bg-background/20 text-white' : 'bg-foreground/10 text-muted-foreground'}`}>{count}</span>}
  </button>
);

const ConfirmDialog = ({ open, title, desc, confirmLabel = "Confirm", confirmColor = C.rose, onConfirm, onCancel, loading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onCancel}>
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-6 max-w-[400px] w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${confirmColor}18` }}>
              <AlertTriangle size={18} color={confirmColor} />
            </div>
            <p className="text-base font-display font-bold text-foreground">{title}</p>
          </div>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{desc}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel} className="rounded-xl px-5 text-xs font-bold uppercase tracking-wider">Cancel</Button>
            <Button onClick={onConfirm} disabled={loading} style={{ background: confirmColor, color: "#fff" }} className="rounded-xl px-5 text-xs font-bold uppercase tracking-wider gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />} {confirmLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const SubmitModal = ({ open, onConfirm, onCancel, loading }: any) => {
  const [note, setNote] = useState("");
  useEffect(() => { if (!open) setNote(""); }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onCancel}>
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-6 max-w-[420px] w-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Send size={18} className="text-emerald-500" /></div>
              <div>
                <p className="text-base font-display font-bold text-foreground">Submit Task</p>
                <p className="text-xs text-muted-foreground">This will mark task as ready for mentor review</p>
              </div>
            </div>
            <label className="text-xs font-bold text-muted-foreground block mb-2 uppercase tracking-widest">Submission Note <span className="text-muted-foreground/50 font-normal lowercase">(optional)</span></label>
            <textarea className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-y min-h-[90px] mb-5" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a GitHub link, deployment URL, or notes for your mentor..." />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onCancel} className="rounded-xl px-5 text-xs font-bold uppercase tracking-wider">Cancel</Button>
              <Button onClick={() => onConfirm(note)} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 text-xs font-bold uppercase tracking-wider gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />} Submit Task
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const DetailsModal = ({ task, onClose }: { task: Task | null; onClose: () => void }) => (
  <AnimatePresence>
    {task && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
          onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl rounded-[1.5rem] w-full max-w-[540px] overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><MessageSquare size={16} className="text-violet-600" /></div>
              <div>
                <p className="text-base font-display font-bold text-foreground">Task Details</p>
                <p className="text-[11px] font-mono text-muted-foreground">{task.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"><X size={14} className="text-muted-foreground" /></button>
          </div>

          <div className="p-6 overflow-y-auto flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/40 border border-border/50 rounded-xl p-3.5">
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">Mentor</p>
                <p className="text-sm font-bold text-foreground">{mentorName(task.mentorId)}</p>
              </div>
              <div className="bg-background/40 border border-border/50 rounded-xl p-3.5">
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">Due Date</p>
                <p className="text-sm font-bold text-foreground flex items-center gap-2"><Calendar size={14} className="text-muted-foreground" /> {fmt(task.dueDate)}</p>
              </div>
            </div>

            <div className="bg-background/40 border border-border/50 rounded-xl p-4">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2">Description</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
            </div>

            {task.submissionNote && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <p className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-[0.15em] mb-2">My Submission Note</p>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{task.submissionNote}</p>
              </div>
            )}

            {task.verificationNote ? (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-[0.15em]">Mentor Feedback</p>
                  {task.pointsAwarded != null && task.pointsAwarded > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-1 rounded-md">+{task.pointsAwarded} pts</span>
                  )}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{task.verificationNote}</p>
              </div>
            ) : (
              <div className="bg-background/20 border border-border/30 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">{task.status === "SUBMITTED" ? "⏳ Awaiting mentor review…" : "No mentor feedback yet."}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const TaskFormModal = ({ open, editing, onClose, onSubmit, loading }: any) => {
  const [form, setForm] = useState({ title:"", description:"", dueDate:"" });
  useEffect(() => {
    if (editing) setForm({ title:editing.title ?? "", description:editing.description ?? "", dueDate:editing.dueDate ? editing.dueDate.split("T")[0] : "" });
    else setForm({ title:"", description:"", dueDate:"" });
  }, [editing, open]);

  const isEdit = !!editing;
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ opacity:0, scale:0.95, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:10 }}
            onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl rounded-[1.5rem] w-full max-w-[540px] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 pb-4 flex items-center justify-between border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><CheckSquare size={16} className="text-primary" /></div>
                <div>
                  <p className="text-base font-display font-bold text-foreground">{isEdit ? "Edit Task" : "Create Task"}</p>
                  <p className="text-[11px] font-mono text-muted-foreground">{isEdit ? "Update task details" : "Create a new personal task"}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"><X size={14} className="text-muted-foreground" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="p-6 overflow-y-auto flex flex-col gap-5">
              <div>
                <label className="text-[10px] font-mono font-bold text-muted-foreground block mb-1.5 uppercase tracking-widest">Title <span className="text-rose-500">*</span></label>
                <input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.title} onChange={e => setForm(p => ({...p, title:e.target.value}))} required placeholder="e.g. Build Authentication Module" />
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold text-muted-foreground block mb-1.5 uppercase tracking-widest">Description <span className="text-rose-500">*</span></label>
                <textarea className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y min-h-[90px]" value={form.description} onChange={e => setForm(p => ({...p, description:e.target.value}))} required placeholder="Describe what needs to be done..." />
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold text-muted-foreground block mb-1.5 uppercase tracking-widest">Due Date <span className="text-rose-500">*</span></label>
                <input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" type="date" value={form.dueDate} onChange={e => setForm(p => ({...p, dueDate:e.target.value}))} required />
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl px-6 text-xs font-bold uppercase tracking-wider">Cancel</Button>
                <Button type="submit" disabled={loading} className="rounded-xl px-6 text-xs font-bold uppercase tracking-wider gap-2">
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {isEdit ? "Update" : "Create Task"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TaskRow = ({ task, idx, onEdit, onDelete, onStart, onSubmit, onDetails }: {
  task: Task; idx: number;
  onEdit:(t:Task)=>void; onDelete:(t:Task)=>void;
  onStart:(t:Task)=>void; onSubmit:(id:string)=>void; onDetails:(t:Task)=>void;
}) => {
  const od = isOverdue(task.dueDate, task.status);
  const canStart  = task.status === "PENDING";
  const canSubmit = task.status === "IN_PROGRESS" || task.status === "REJECTED";
  const canEdit   = task.status === "PENDING";
  const canDelete = task.status === "PENDING";
  const showDetails = ["SUBMITTED","APPROVED","REJECTED"].includes(task.status) || !!task.submissionNote;

  const Btn = ({ onClick, bg, color, children }: any) => (
    <button onClick={onClick} style={{ background: `${bg}18`, color }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-none text-[10px] font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap transition-transform hover:scale-105 active:scale-95">
      {children}
    </button>
  );

  return (
    <motion.tr className="group hover:bg-foreground/5 transition-colors border-b border-border/30 last:border-0" initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:idx*0.03 }}>
      <td className="p-4 text-[11px] font-mono font-bold text-muted-foreground w-10 text-center">{idx+1}</td>
      <td className="p-4 min-w-[200px]">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${od ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'}`}>
            <CheckSquare size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate max-w-[220px] lg:max-w-[320px]">{task.title}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[220px] lg:max-w-[320px] mt-0.5">{task.description}</p>
          </div>
        </div>
      </td>
      <td className="p-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">{mentorName(task.mentorId)}</td>
      <td className="p-4 whitespace-nowrap">
        <span className={`text-[11px] font-mono font-bold flex items-center gap-2 ${od?'text-rose-500':'text-muted-foreground'}`}>
          <Calendar size={14} />{fmt(task.dueDate)}
        </span>
      </td>
      <td className="p-4"><StatusBadge status={task.status} overdue={od} /></td>
      <td className="p-4">
        <div className="flex gap-2 items-center flex-wrap">
          {canStart  && <Btn onClick={()=>onStart(task)}      bg="var(--piq-blue)" color="var(--piq-blue)"><Play size={12} fill="currentColor" /> Start</Btn>}
          {canSubmit && <Btn onClick={()=>onSubmit(task._id)} bg="#059669" color="#059669"><Send size={12} /> Submit</Btn>}
          {showDetails && <Btn onClick={()=>onDetails(task)}  bg="#7C3AED" color="#7C3AED"><Eye size={12} /> Details</Btn>}
          {canEdit   && <Btn onClick={()=>onEdit(task)}       bg="var(--piq-blue)" color="var(--piq-blue)"><Edit2 size={12} /></Btn>}
          {canDelete && <Btn onClick={()=>onDelete(task)}     bg="#E11D48" color="#E11D48"><Trash2 size={12} /></Btn>}
        </div>
      </td>
    </motion.tr>
  );
};

export default function TasksPage() {
  const {
    tasks, pagination, statusFilter, searchQuery,
    isLoading, isSubmitting,
    isModalOpen, isCompleteModalOpen,
    editingTask, completingTaskId,
    fetchTasks, createTask, updateTask, deleteTask, startTask, submitTask,
    setStatusFilter, setSearchQuery, setPage,
    openCreateModal, openEditModal, closeModal,
    openCompleteModal, closeCompleteModal,
  } = useTasksStore();

  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [startTarget,  setStartTarget]  = useState<Task | null>(null);
  const [detailTask,   setDetailTask]   = useState<Task | null>(null);
  const [isDeleting,   setIsDeleting]   = useState(false);
  const [isStarting,   setIsStarting]   = useState(false);

  useEffect(() => { fetchTasks(); }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [tasks, searchQuery]);

  const counts = useMemo(() => ({
    ALL:         tasks.length,
    PENDING:     tasks.filter(t => t.status === "PENDING").length,
    IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS").length,
    SUBMITTED:   tasks.filter(t => t.status === "SUBMITTED").length,
    APPROVED:    tasks.filter(t => t.status === "APPROVED").length,
    REJECTED:    tasks.filter(t => t.status === "REJECTED").length,
    OVERDUE:     tasks.filter(t => isOverdue(t.dueDate, t.status)).length,
  }), [tasks]);

  const totalPages  = Math.max(1, Math.ceil(pagination.total / pagination.limit));
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteTask(deleteTarget._id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleStart = async () => {
    if (!startTarget) return;
    setIsStarting(true);
    await startTask(startTarget._id);
    setIsStarting(false);
    setStartTarget(null);
  };

  const handleSubmit = async (note: string) => {
    if (!completingTaskId) return;
    await submitTask(completingTaskId, undefined, note);
  };

  const handleFormSubmit = async (form: any) => {
    if (editingTask) await updateTask(editingTask._id, form);
    else await createTask(form);
  };

  const FILTERS: { key: TaskStatusFilter; label: string }[] = [
    { key:"ALL",         label:"All" },
    { key:"PENDING",     label:"Pending" },
    { key:"IN_PROGRESS", label:"In Progress" },
    { key:"SUBMITTED",   label:"Submitted" },
    { key:"APPROVED",    label:"Approved" },
    { key:"REJECTED",    label:"Rejected" },
  ];

  const STATS = [
    { label:"Pending",     val:counts.PENDING,     color:C.amber },
    { label:"In Progress", val:counts.IN_PROGRESS, color:C.blue },
    { label:"Submitted",   val:counts.SUBMITTED,   color:C.indigo },
    { label:"Approved",    val:counts.APPROVED,    color:C.emerald },
    { label:"Rejected",    val:counts.REJECTED,    color:C.rose },
    { label:"Overdue",     val:counts.OVERDUE,     color:C.rose, bg:`${C.rose}08` },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <Header subtitle="View and manage tasks assigned by your mentor." />

      <main className="p-6 lg:padding-8 max-w-[1600px] mx-auto space-y-6">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map(({ label, val, color }, i) => (
            <motion.div key={label} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
              className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-5">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2">{label}</p>
              <p className="text-3xl font-display font-bold text-foreground leading-none" style={{ color }}>{val}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-4 flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <Pill key={f.key} label={f.label} active={statusFilter === f.key} onClick={() => setStatusFilter(f.key)} count={counts[f.key] as number} />
            ))}
          </div>
          <div className="relative w-full max-w-[280px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="w-full bg-background border border-border/50 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Search tasks…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-6 flex flex-col gap-3">
              {Array.from({length:5}).map((_,i) => <Sk key={i} h={52} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 px-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4">
                <ClipboardList size={28} className="text-muted-foreground" />
              </div>
              <p className="text-base font-display font-bold text-foreground mb-1 mt-2">No tasks found</p>
              <p className="text-sm text-muted-foreground mb-6">
                {statusFilter !== "ALL" ? "Try matching a different status filter." : "Your mentor hasn't assigned any tasks yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-foreground/[0.02] border-b border-border/40">
                    {["#","Task","Mentor","Due Date","Status","Actions"].map((h, i) => (
                      <th key={h} className={`p-4 text-left text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap ${i===0?'text-center':''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((task, i) => (
                    <TaskRow key={task._id} task={task} idx={i} onEdit={openEditModal} onDelete={setDeleteTarget} onStart={setStartTarget} onSubmit={openCompleteModal} onDetails={setDetailTask} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button variant="outline" size="sm" onClick={() => setPage(pagination.skip - pagination.limit)} disabled={currentPage === 1} className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 h-9 px-4">
              <ChevronLeft size={14} /> Prev
            </Button>
            <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(pagination.skip + pagination.limit)} disabled={currentPage === totalPages} className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 h-9 px-4">
              Next <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </main>

      <TaskFormModal open={isModalOpen} editing={editingTask} onClose={closeModal} onSubmit={handleFormSubmit} loading={isSubmitting} />
      <SubmitModal   open={isCompleteModalOpen} onConfirm={handleSubmit} onCancel={closeCompleteModal} loading={isSubmitting} />
      <DetailsModal  task={detailTask} onClose={() => setDetailTask(null)} />

      <ConfirmDialog open={!!deleteTarget} title="Delete Task" desc={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
      <ConfirmDialog open={!!startTarget} title="Start Task" desc={`Start working on "${startTarget?.title}"? Status will change to In Progress.`}
        confirmLabel="Start Work" confirmColor="var(--piq-blue)" onConfirm={handleStart} onCancel={() => setStartTarget(null)} loading={isStarting} />
    </div>
  );
}
