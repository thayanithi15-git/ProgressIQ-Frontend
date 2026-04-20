"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Plus, Search, Edit2, Trash2, Calendar,
  ChevronLeft, ChevronRight, X, Loader2,
  AlertTriangle, Send, Eye, Github, Globe,
  CheckCircle, Clock, XCircle, Play, AlertCircle,
} from "lucide-react";
import { useProjectsStore, Project, ProjectStatusFilter } from "@/store/student/projects";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { getStoredMentorId } from "@/utils/mentorSession";

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

const StatusBadge = ({ status }: { status: string }) => {
  const m = STATUS_META[status] ?? { label: status, color: C.amber, bg: `${C.amber}18` };
  return (
    <span style={{ background: m.bg, color: m.color }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
      {m.label}
    </span>
  );
};

const Pill = ({ label, active, onClick, count }: any) => (
  <button onClick={onClick} className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${active ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card/50 text-muted-foreground border-transparent hover:bg-foreground/5'}`}>
    {label}
    {count != null && <span className={`text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-md ${active ? 'bg-background/20 text-white' : 'bg-foreground/10 text-muted-foreground'}`}>{count}</span>}
  </button>
);

const ConfirmDialog = ({ open, title, desc, confirmLabel = "Confirm", confirmColor = C.rose, onConfirm, onCancel, loading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4" onClick={onCancel}>
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
          onClick={e => e.stopPropagation()}
          className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl p-6 max-w-[400px] w-full">
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4" onClick={onCancel}>
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
            onClick={e => e.stopPropagation()}
            className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl p-6 max-w-[440px] w-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Send size={18} className="text-primary" /></div>
              <div>
                <p className="text-base font-display font-bold text-foreground">Submit Project</p>
                <p className="text-xs text-muted-foreground">Project will be submitted for mentor review</p>
              </div>
            </div>
            <label className="text-xs font-bold text-muted-foreground block mb-2 uppercase tracking-widest">Submission Note <span className="text-muted-foreground/50 font-normal lowercase">(optional)</span></label>
            <textarea className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y min-h-[90px] mb-5" value={note} onChange={e => setNote(e.target.value)} placeholder="Add GitHub repo link, deployment URL, or notes for your mentor..." />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onCancel} className="rounded-xl px-5 text-xs font-bold uppercase tracking-wider">Cancel</Button>
              <Button onClick={() => onConfirm(note)} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 text-xs font-bold uppercase tracking-wider gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />} Submit Project
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const DetailsModal = ({ project, onClose }: { project: Project | null; onClose: () => void }) => (
  <AnimatePresence>
    {project && (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
          onClick={e => e.stopPropagation()} className="bg-card-glass/80 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-[1.5rem] p-0 w-full max-w-[540px] overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Briefcase size={16} className="text-primary" /></div>
              <div>
                <p className="text-base font-display font-bold text-foreground">Project Details</p>
                <p className="text-xs font-mono text-muted-foreground">{project.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"><X size={14} className="text-muted-foreground" /></button>
          </div>
          <div className="p-6 overflow-y-auto flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/40 border border-border/50 rounded-xl p-3.5">
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">Mentor</p>
                <p className="text-sm font-bold text-foreground">{mentorName(project.mentorId)}</p>
              </div>
              <div className="bg-background/40 border border-border/50 rounded-xl p-3.5">
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2">Status</p>
                <StatusBadge status={project.status} />
              </div>
            </div>

            <div className="bg-background/40 border border-border/50 rounded-xl p-4">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2">Description</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
            </div>

            {(project.githubLink || project.websiteLink) && (
              <div className="flex gap-3">
                {project.githubLink  && <a href={project.githubLink}  target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 text-xs font-bold hover:bg-blue-500/20 transition-colors"><Github size={14} />GitHub</a>}
                {project.websiteLink && <a href={project.websiteLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-600 text-xs font-bold hover:bg-cyan-500/20 transition-colors"><Globe  size={14} />Website</a>}
              </div>
            )}

            {project.submissionNote && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <p className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-[0.15em] mb-2">My Submission Note</p>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{project.submissionNote}</p>
              </div>
            )}

            {project.verificationNote ? (
              <div className="bg-foreground/5 border border-border/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono font-bold text-foreground uppercase tracking-[0.15em]">Mentor Feedback</p>
                  {project.pointsAwarded != null && project.pointsAwarded > 0 && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">+{project.pointsAwarded} pts</span>
                  )}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{project.verificationNote}</p>
              </div>
            ) : (
              <div className="bg-background/20 border border-border/30 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">{project.status === "SUBMITTED" ? "⏳ Awaiting mentor review…" : "No mentor feedback yet."}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ProjectFormModal = ({ open, editing, onClose, onSubmit, loading }: any) => {
  const [form, setForm] = useState({ title:"", description:"", githubLink:"", websiteLink:"" });
  useEffect(() => {
    if (editing) setForm({ title:editing.title ?? "", description:editing.description ?? "", githubLink:editing.githubLink ?? "", websiteLink:editing.websiteLink ?? "" });
    else setForm({ title:"", description:"", githubLink:"", websiteLink:"" });
  }, [editing, open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ opacity:0, scale:0.95, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:10 }}
            onClick={e => e.stopPropagation()} className="bg-card-glass/80 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-[1.5rem] w-full max-w-[540px] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 pb-4 flex items-center justify-between border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Briefcase size={16} className="text-primary" /></div>
                <div>
                  <p className="text-base font-display font-bold text-foreground">{editing ? "Edit Project" : "Create Project"}</p>
                  <p className="text-[11px] font-mono text-muted-foreground">{editing ? "Update your project details" : "Create a new personal project"}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"><X size={14} className="text-muted-foreground" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="p-6 overflow-y-auto flex flex-col gap-5">
              <div>
                <label className="text-[10px] font-mono font-bold text-muted-foreground block mb-1.5 uppercase tracking-widest">Title <span className="text-rose-500">*</span></label>
                <input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.title} onChange={e => setForm(p => ({...p, title:e.target.value}))} required placeholder="e.g. E-commerce Platform" />
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold text-muted-foreground block mb-1.5 uppercase tracking-widest">Description <span className="text-rose-500">*</span></label>
                <textarea className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y min-h-[90px]" value={form.description} onChange={e => setForm(p => ({...p, description:e.target.value}))} required placeholder="Describe your project..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono font-bold text-muted-foreground block mb-1.5 uppercase tracking-widest">GitHub Link</label>
                  <input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.githubLink} onChange={e => setForm(p => ({...p, githubLink:e.target.value}))} placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold text-muted-foreground block mb-1.5 uppercase tracking-widest">Website Link</label>
                  <input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.websiteLink} onChange={e => setForm(p => ({...p, websiteLink:e.target.value}))} placeholder="https://..." />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl px-6 text-xs font-bold uppercase tracking-wider">Cancel</Button>
                <Button type="submit" disabled={loading} className="rounded-xl px-6 text-xs font-bold uppercase tracking-wider gap-2">
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {editing ? "Update" : "Create Project"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ProjectRow = ({ project, idx, onEdit, onDelete, onStart, onSubmit, onDetails }: {
  project: Project; idx: number;
  onEdit:(p:Project)=>void; onDelete:(p:Project)=>void;
  onStart:(p:Project)=>void; onSubmit:(id:string)=>void; onDetails:(p:Project)=>void;
}) => {
  const canStart    = project.status === "PENDING";
  const canSubmit   = project.status === "IN_PROGRESS" || project.status === "REJECTED";
  const canEdit     = project.status === "PENDING" && !project.createdByMentor;
  const canDelete   = project.status === "PENDING" && !project.createdByMentor;
  const showDetails = ["SUBMITTED","APPROVED","REJECTED"].includes(project.status) || !!project.submissionNote || !!project.verificationNote;

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
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Briefcase size={16} className="text-primary" /></div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate max-w-[220px] lg:max-w-[300px]">{project.title}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[220px] lg:max-w-[300px] mt-0.5">{project.description}</p>
          </div>
        </div>
      </td>
      <td className="p-4 text-xs text-muted-foreground font-semibold">{mentorName(project.mentorId)}</td>
      <td className="p-4">
        <div className="flex gap-3">
          {project.githubLink  && <a href={project.githubLink}  target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-wider bg-blue-500/10 px-2 py-1 rounded-md"><Github size={12} />GitHub</a>}
          {project.websiteLink && <a href={project.websiteLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-600 hover:text-cyan-500 transition-colors uppercase tracking-wider bg-cyan-500/10 px-2 py-1 rounded-md"><Globe  size={12} />Site</a>}
          {!project.githubLink && !project.websiteLink && <span className="text-xs text-muted-foreground">—</span>}
        </div>
      </td>
      <td className="p-4"><StatusBadge status={project.status} /></td>
      <td className="p-4">
        <div className="flex gap-2 items-center flex-wrap">
          {canStart    && <Btn onClick={()=>onStart(project)}      bg="var(--piq-blue)" color="var(--piq-blue)"><Play size={12} fill="currentColor" /> Start</Btn>}
          {canSubmit   && <Btn onClick={()=>onSubmit(project._id)} bg="var(--piq-blue)" color="var(--piq-blue)"><Send size={12} /> Submit</Btn>}
          {showDetails && <Btn onClick={()=>onDetails(project)}    bg="var(--piq-blue)" color="var(--piq-blue)"><Eye size={12} /> Details</Btn>}
          {canEdit     && <Btn onClick={()=>onEdit(project)}       bg="var(--piq-blue)" color="var(--piq-blue)"><Edit2 size={12} /></Btn>}
          {canDelete   && <Btn onClick={()=>onDelete(project)}     bg="var(--piq-blue)" color="var(--piq-blue)"><Trash2 size={12} /></Btn>}
        </div>
      </td>
    </motion.tr>
  );
};

export default function ProjectsPage() {
  const {
    projects, pagination, statusFilter, searchQuery,
    isLoading, isSubmitting,
    isModalOpen, isSubmitModalOpen,
    editingProject, submittingProjectId,
    fetchProjects, createProject, updateProject, deleteProject,
    startProject, submitProject,
    setStatusFilter, setSearchQuery, setPage,
    openCreateModal, openEditModal, closeModal,
    openSubmitModal, closeSubmitModal,
  } = useProjectsStore();

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [startTarget,  setStartTarget]  = useState<Project | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [isDeleting,   setIsDeleting]   = useState(false);
  const [isStarting,   setIsStarting]   = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const hasMentor = !!getStoredMentorId();

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [projects, searchQuery]);

  const counts = useMemo(() => ({
    ALL:         projects.length,
    PENDING:     projects.filter(p => p.status === "PENDING").length,
    IN_PROGRESS: projects.filter(p => p.status === "IN_PROGRESS").length,
    SUBMITTED:   projects.filter(p => p.status === "SUBMITTED").length,
    APPROVED:    projects.filter(p => p.status === "APPROVED").length,
    REJECTED:    projects.filter(p => p.status === "REJECTED").length,
  }), [projects]);

  const totalPages  = Math.max(1, Math.ceil(pagination.total / pagination.limit));
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteProject(deleteTarget._id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleStart = async () => {
    if (!startTarget) return;
    setIsStarting(true);
    await startProject(startTarget._id);
    setIsStarting(false);
    setStartTarget(null);
  };

  const handleSubmit = async (note: string) => {
    if (!submittingProjectId) return;
    await submitProject(submittingProjectId, note);
  };

  const handleFormSubmit = async (form: any) => {
    if (editingProject) await updateProject(editingProject._id, form);
    else await createProject(form);
  };

  const FILTERS: { key: ProjectStatusFilter; label: string }[] = [
    { key:"ALL",         label:"All" },
    { key:"PENDING",     label:"Pending" },
    { key:"IN_PROGRESS", label:"In Progress" },
    { key:"SUBMITTED",   label:"Submitted" },
    { key:"APPROVED",    label:"Approved" },
    { key:"REJECTED",    label:"Rejected" },
  ];

  const STATS = [
    { label:"Pending",     val:counts.PENDING,     color:"var(--piq-blue)" },
    { label:"In Progress", val:counts.IN_PROGRESS, color:"var(--piq-blue)" },
    { label:"Submitted",   val:counts.SUBMITTED,   color:"var(--piq-blue)" },
    { label:"Approved",    val:counts.APPROVED,    color:"var(--piq-blue)" },
    { label:"Rejected",    val:counts.REJECTED,    color:"var(--piq-blue)" },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <Header subtitle="Manage your projects and submit them for mentor review." />

      <main className="p-6 lg:padding-8 max-w-[1600px] mx-auto space-y-6">

        {!hasMentor && (
          <div className="p-4 rounded-xl bg-foreground/5 border border-border/40 flex items-center gap-3">
            <AlertCircle size={18} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-bold m-0">You have no mentor assigned. Contact admin to get a mentor.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATS.map(({ label, val, color }, i) => (
            <motion.div key={label} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
              className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-5">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2">{label}</p>
              <p className="text-3xl font-display font-bold text-foreground leading-none">{val}</p>
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
            <input className="w-full bg-background border border-border/50 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Search projects…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                <Briefcase size={28} className="text-muted-foreground" />
              </div>
              <p className="text-base font-display font-bold text-foreground mb-1 mt-2">No projects found</p>
              <p className="text-sm text-muted-foreground mb-6">
                {statusFilter !== "ALL" ? "Try matching a different status filter." : "Create a personal project or wait for your mentor to assign one."}
              </p>
              {hasMentor && (
                <Button onClick={openCreateModal} className="rounded-xl px-6 font-bold uppercase tracking-wider text-xs gap-2">
                  <Plus size={16} /> Create Project
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-foreground/[0.02] border-b border-border/40">
                    {["#","Project","Mentor","Links","Status","Actions"].map((h, i) => (
                      <th key={h} className={`p-4 text-left text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap ${i===0?'text-center':''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project, i) => (
                    <ProjectRow key={project._id} project={project} idx={i} onEdit={openEditModal} onDelete={setDeleteTarget} onStart={setStartTarget} onSubmit={openSubmitModal} onDetails={setDetailProject} />
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

      <ProjectFormModal open={isModalOpen} editing={editingProject} onClose={closeModal} onSubmit={handleFormSubmit} loading={isSubmitting} />
      <SubmitModal      open={isSubmitModalOpen} onConfirm={handleSubmit} onCancel={closeSubmitModal} loading={isSubmitting} />
      <DetailsModal     project={detailProject} onClose={() => setDetailProject(null)} />

      <ConfirmDialog open={!!deleteTarget} title="Delete Project" desc={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete" confirmColor="var(--piq-blue)" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
      <ConfirmDialog open={!!startTarget} title="Start Project" desc={`Start working on "${startTarget?.title}"? Status will change to In Progress.`}
        confirmLabel="Start" confirmColor="var(--piq-blue)" onConfirm={handleStart} onCancel={() => setStartTarget(null)} loading={isStarting} />
    </div>
  );
}
