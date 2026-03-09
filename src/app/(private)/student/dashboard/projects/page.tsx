"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Plus, Search, Edit2, Trash2, ExternalLink,
  Github, Globe, Calendar, ChevronLeft, ChevronRight,
  MessageSquare, X, Loader2, CheckCircle, Clock, XCircle,
  AlertTriangle, Filter, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useProjectsStore, Project, ProjectStatusFilter } from "@/store/student/projects";
import Header from "@/components/layout/header";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  blue:    "#3B6FD4",
  violet:  "#7C3AED",
  emerald: "#059669",
  amber:   "#D97706",
  rose:    "#E11D48",
  cyan:    "#0891B2",
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:  { label: "Pending",  color: C.amber,   bg: `${C.amber}18`,   icon: Clock },
  APPROVED: { label: "Approved", color: C.emerald, bg: `${C.emerald}18`, icon: CheckCircle },
  REJECTED: { label: "Rejected", color: C.rose,    bg: `${C.rose}18`,    icon: XCircle },
};

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes fade-in  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }

  :root {
    --card-bg:#fff; --card-border:#E8EDF4; --card-shadow:0 2px 12px rgba(0,0,0,0.06);
    --body-bg:#F7F9FC; --text-primary:#1E293B; --text-secondary:#64748B; --text-muted:#94A3B8;
    --input-bg:#F8FAFC; --input-border:#E2E8F0; --input-focus:#3B6FD4;
    --modal-overlay:rgba(15,23,42,0.55);
    --sk-from:#EEF2F7; --sk-via:#E2E8F0;
    --table-hover:#F8FAFC; --table-border:#F1F5F9;
    --pill-inactive-bg:#F1F5F9; --pill-inactive-text:#64748B;
  }
  .dark {
    --card-bg:#1E2432; --card-border:#2A3349; --card-shadow:0 2px 12px rgba(0,0,0,0.30);
    --body-bg:#141921; --text-primary:#E8EDF8; --text-secondary:#94A3B8; --text-muted:#64748B;
    --input-bg:#252E42; --input-border:#2A3349; --input-focus:#3B6FD4;
    --modal-overlay:rgba(5,8,14,0.75);
    --sk-from:#1E2432; --sk-via:#252E42;
    --table-hover:#1A2030; --table-border:#1E2432;
    --pill-inactive-bg:#1E2432; --pill-inactive-text:#94A3B8;
  }
  .sk { background:linear-gradient(90deg,var(--sk-from) 25%,var(--sk-via) 50%,var(--sk-from) 75%); background-size:200% 100%; animation:shimmer 1.6s infinite linear; border-radius:10px; }

  .form-input {
    width:100%; padding:10px 14px; border-radius:10px; font-size:13px; font-family:inherit;
    background:var(--input-bg); border:1.5px solid var(--input-border); color:var(--text-primary);
    outline:none; transition:border-color 0.18s, box-shadow 0.18s;
  }
  .form-input:focus { border-color:var(--input-focus); box-shadow:0 0 0 3px ${C.blue}22; }
  .form-input::placeholder { color:var(--text-muted); }
  .form-input.textarea { resize:vertical; min-height:90px; line-height:1.6; }

  .modal-overlay {
    position:fixed; inset:0; background:var(--modal-overlay);
    display:flex; align-items:center; justify-content:center;
    z-index:1000; padding:20px; backdrop-filter:blur(4px);
  }
  .modal-box {
    background:var(--card-bg); border:1px solid var(--card-border);
    border-radius:20px; width:100%; max-width:560px; max-height:90vh;
    overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.22);
  }

  @media(max-width:768px){
    .page-header-row{flex-direction:column!important;align-items:flex-start!important;gap:12px!important;}
    .filter-row{flex-wrap:wrap!important;}
    .card-grid{grid-template-columns:1fr!important;}
  }
  @media(max-width:520px){
    .stats-row{grid-template-columns:repeat(2,1fr)!important;}
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const Sk = ({ w = "100%", h = 16, style = {} }: any) => (
  <div className="sk" style={{ width: w, height: h, ...style }} />
);

const fmtDate = (v?: string) => {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return v; }
};

const getMentorName = (m: any) =>
  typeof m === "object" ? `${m?.firstName ?? ""} ${m?.lastName ?? ""}`.trim() : "—";

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status] ?? STATUS_META.PENDING;
  const Icon = meta.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: meta.bg, color: meta.color, fontSize: 11, fontWeight: 700 }}>
      <Icon size={11} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PILL FILTER
// ─────────────────────────────────────────────────────────────────────────────
const Pill = ({ label, active, onClick, count }: any) => (
  <button onClick={onClick} style={{
    padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer",
    fontSize: 12, fontWeight: 600, letterSpacing: "0.02em", transition: "all 0.18s",
    background: active ? C.blue : "var(--pill-inactive-bg)",
    color: active ? "#fff" : "var(--pill-inactive-text)",
    boxShadow: active ? `0 2px 10px ${C.blue}44` : "none",
    display: "flex", alignItems: "center", gap: 5,
  }}>
    {label}
    {count != null && (
      <span style={{ fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.25)" : "var(--card-border)", color: active ? "#fff" : "var(--text-muted)", borderRadius: 10, padding: "1px 6px" }}>
        {count}
      </span>
    )}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM DELETE DIALOG
// ─────────────────────────────────────────────────────────────────────────────
const ConfirmDialog = ({ open, title, desc, onConfirm, onCancel, loading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay" onClick={onCancel}>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
          onClick={(e) => e.stopPropagation()}
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 18, padding: "28px 28px 24px", maxWidth: 420, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.rose}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={18} color={C.rose} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{title}</p>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 22, lineHeight: 1.6 }}>{desc}</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onCancel} style={{ padding: "8px 18px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={onConfirm} disabled={loading} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: C.rose, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: loading ? 0.7 : 1 }}>
              {loading && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK MODAL
// ─────────────────────────────────────────────────────────────────────────────
const FeedbackModal = ({ open, feedback, onClose }: any) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
          onClick={(e) => e.stopPropagation()} className="modal-box" style={{ maxWidth: 480 }}>
          <div style={{ padding: "22px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.violet}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquare size={16} color={C.violet} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Mentor Feedback</p>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--pill-inactive-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} color="var(--text-muted)" />
            </button>
          </div>
          <div style={{ padding: "18px 24px 24px" }}>
            {feedback ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, padding: "12px 14px", borderRadius: 12, background: "var(--body-bg)", border: "1px solid var(--card-border)" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 3px" }}>From</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{feedback.mentor}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{feedback.mentorEmail}</p>
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--body-bg)", border: "1px solid var(--card-border)" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 3px" }}>Date</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{fmtDate(feedback.createdAt)}</p>
                  </div>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: 12, background: `${C.rose}08`, border: `1px solid ${C.rose}25`, lineHeight: 1.65 }}>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{feedback.message}</p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No feedback available</p>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT FORM MODAL
// ─────────────────────────────────────────────────────────────────────────────
const ProjectFormModal = ({ open, editing, onClose, onSubmit, isSubmitting }: any) => {
  const isEdit = !!editing;
  const [form, setForm] = useState({
    mentorId: "", title: "", description: "", githubLink: "", websiteLink: "", completedAt: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        mentorId: typeof editing.mentorId === "object" ? editing.mentorId._id : editing.mentorId,
        title: editing.title ?? "",
        description: editing.description ?? "",
        githubLink: editing.githubLink ?? "",
        websiteLink: editing.websiteLink ?? "",
        completedAt: editing.completedAt ? editing.completedAt.split("T")[0] : "",
      });
    } else {
      setForm({ mentorId: "", title: "", description: "", githubLink: "", websiteLink: "", completedAt: "" });
    }
  }, [editing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const F = ({ label, required, children }: any) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
        {label}{required && <span style={{ color: C.rose }}> *</span>}
      </label>
      {children}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 10 }}
            onClick={(e) => e.stopPropagation()} className="modal-box">
            <div style={{ padding: "22px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--card-border)", paddingBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.blue}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Briefcase size={16} color={C.blue} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{isEdit ? "Edit Project" : "Add Project"}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{isEdit ? "Update project details" : "Submit a new project for review"}</p>
                </div>
              </div>
              <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--pill-inactive-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={14} color="var(--text-muted)" />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <F label="Mentor ID" required>
                <input className="form-input" placeholder="Mentor ID" value={form.mentorId} onChange={e => setForm(p => ({ ...p, mentorId: e.target.value }))} required />
              </F>
              <F label="Project Title" required>
                <input className="form-input" placeholder="e.g. E-Commerce Platform" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              </F>
              <F label="Description" required>
                <textarea className="form-input textarea" placeholder="Describe your project..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
              </F>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="GitHub Link">
                  <input className="form-input" placeholder="https://github.com/..." value={form.githubLink} onChange={e => setForm(p => ({ ...p, githubLink: e.target.value }))} />
                </F>
                <F label="Website Link">
                  <input className="form-input" placeholder="https://..." value={form.websiteLink} onChange={e => setForm(p => ({ ...p, websiteLink: e.target.value }))} />
                </F>
              </div>
              <F label="Completed At" required>
                <input className="form-input" type="date" value={form.completedAt} onChange={e => setForm(p => ({ ...p, completedAt: e.target.value }))} required />
              </F>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                <button type="button" onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: "9px 24px", borderRadius: 10, border: "none", background: C.blue, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: isSubmitting ? 0.7 : 1, boxShadow: `0 4px 14px ${C.blue}44` }}>
                  {isSubmitting && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
                  {isEdit ? "Update Project" : "Submit Project"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT CARD
// ─────────────────────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index, onEdit, onDelete, onFeedback }: any) => {
  const canEdit = project.status === "PENDING";
  const canDelete = project.status === "PENDING";
  const hasRejection = project.status === "REJECTED";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "18px 20px", boxShadow: "var(--card-shadow)", display: "flex", flexDirection: "column", gap: 12, transition: "box-shadow 0.18s, transform 0.18s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.12)`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C.blue}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Briefcase size={17} color={C.blue} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{project.title}</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Mentor: {getMentorName(project.mentorId)}</p>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Description */}
      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {project.description}
      </p>

      {/* Links + Date */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {project.githubLink && (
          <a href={project.githubLink} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: C.blue, textDecoration: "none", background: `${C.blue}12`, padding: "3px 10px", borderRadius: 20 }}>
            <Github size={11} /> GitHub
          </a>
        )}
        {project.websiteLink && (
          <a href={project.websiteLink} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: C.cyan, textDecoration: "none", background: `${C.cyan}12`, padding: "3px 10px", borderRadius: 20 }}>
            <Globe size={11} /> Website
          </a>
        )}
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>
          <Calendar size={11} />
          {fmtDate(project.completedAt)}
        </span>
      </div>

      {/* Feedback note */}
      {project.feedback && (
        <div style={{ padding: "9px 12px", borderRadius: 10, background: `${C.rose}08`, border: `1px solid ${C.rose}25`, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          <span style={{ fontWeight: 700, color: C.rose }}>Feedback: </span>{project.feedback}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, paddingTop: 4, borderTop: "1px solid var(--table-border)" }}>
        {hasRejection && (
          <button onClick={() => onFeedback(project._id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: `${C.violet}14`, color: C.violet, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <MessageSquare size={12} /> Feedback
          </button>
        )}
        {canEdit && (
          <button onClick={() => onEdit(project)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: `${C.blue}14`, color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <Edit2 size={12} /> Edit
          </button>
        )}
        {canDelete && (
          <button onClick={() => onDelete(project)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: `${C.rose}14`, color: C.rose, fontSize: 12, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>
            <Trash2 size={12} /> Delete
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const {
    projects, pagination, statusFilter, searchQuery, isLoading, isSubmitting,
    isModalOpen, isFeedbackModalOpen, editingProject, selectedFeedback,
    fetchProjects, createProject, updateProject, deleteProject,
    setStatusFilter, setSearchQuery, setPage,
    openCreateModal, openEditModal, closeModal, openFeedbackModal, closeFeedbackModal,
  } = useProjectsStore();

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [projects, searchQuery]);

  const counts = useMemo(() => ({
    ALL: projects.length,
    PENDING: projects.filter(p => p.status === "PENDING").length,
    APPROVED: projects.filter(p => p.status === "APPROVED").length,
    REJECTED: projects.filter(p => p.status === "REJECTED").length,
  }), [projects]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteProject(deleteTarget._id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleSubmit = async (form: any) => {
    if (editingProject) {
      await updateProject(editingProject._id, form);
    } else {
      await createProject(form);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "var(--body-bg)" }}>
        <Header subtitle="Manage and track all your submitted projects." HeaderComp={
          <Button onClick={openCreateModal} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: C.blue, color: "#fff", boxShadow: `0 4px 14px ${C.blue}44` }}>
            <Plus size={15} /> Add Project
          </Button>
        } />

        <div style={{ padding: "24px 24px 48px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Stats row */}
          <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {[
              { label: "Total",    val: counts.ALL,      color: C.blue,    bg: `${C.blue}14` },
              { label: "Pending",  val: counts.PENDING,  color: C.amber,   bg: `${C.amber}14` },
              { label: "Approved", val: counts.APPROVED, color: C.emerald, bg: `${C.emerald}14` },
              { label: "Rejected", val: counts.REJECTED, color: C.rose,    bg: `${C.rose}14` },
            ].map(({ label, val, color, bg }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 14, padding: "16px 18px", boxShadow: "var(--card-shadow)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 6px" }}>{label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{val}</p>
              </motion.div>
            ))}
          </div>

          {/* Filter + Search */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "16px 20px", boxShadow: "var(--card-shadow)" }}>
            <div className="page-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
              <div className="filter-row" style={{ display: "flex", gap: 6 }}>
                {(["ALL","PENDING","APPROVED","REJECTED"] as ProjectStatusFilter[]).map(f => (
                  <Pill key={f} label={f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()} active={statusFilter === f} onClick={() => setStatusFilter(f)} count={f === "ALL" ? counts.ALL : counts[f]} />
                ))}
              </div>
              <div style={{ position: "relative", maxWidth: 260, width: "100%" }}>
                <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input className="form-input" placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 32 }} />
              </div>
            </div>
          </div>

          {/* Cards grid */}
          {isLoading ? (
            <div className="card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[...Array(6)].map((_, i) => <Sk key={i} h={200} style={{ borderRadius: 16 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "60px 24px", textAlign: "center", boxShadow: "var(--card-shadow)" }}>
              <Briefcase size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>No projects found</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>Start by adding your first project</p>
              <button onClick={openCreateModal} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: C.blue, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Add Project</button>
            </motion.div>
          ) : (
            <div className="card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {filtered.map((p, i) => (
                <ProjectCard key={p._id} project={p} index={i} onEdit={openEditModal} onDelete={setDeleteTarget} onFeedback={openFeedbackModal} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <button onClick={() => setPage(pagination.skip - pagination.limit)} disabled={currentPage === 1} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-secondary)", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
                <ChevronLeft size={13} /> Prev
              </button>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setPage(pagination.skip + pagination.limit)} disabled={currentPage === totalPages} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-secondary)", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
                Next <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProjectFormModal open={isModalOpen} editing={editingProject} onClose={closeModal} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <FeedbackModal open={isFeedbackModalOpen} feedback={selectedFeedback} onClose={closeFeedbackModal} />
      <ConfirmDialog open={!!deleteTarget} title="Delete Project" desc={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
    </>
  );
}