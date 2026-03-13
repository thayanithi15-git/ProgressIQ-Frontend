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

// ─── TOKENS ────────────────────────────────────────────────────────────────────
const C = {
  blue:    "#3B6FD4",
  violet:  "#7C3AED",
  emerald: "#059669",
  amber:   "#D97706",
  rose:    "#E11D48",
  cyan:    "#0891B2",
  indigo:  "#6366F1",
};
const ACCENT = C.indigo;

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:     { label: "Pending",     color: C.amber,   bg: `${C.amber}18`   },
  IN_PROGRESS: { label: "In Progress", color: C.blue,    bg: `${C.blue}18`    },
  SUBMITTED:   { label: "Submitted",   color: C.violet,  bg: `${C.violet}18`  },
  APPROVED:    { label: "Approved",    color: C.emerald, bg: `${C.emerald}18` },
  REJECTED:    { label: "Rejected",    color: C.rose,    bg: `${C.rose}18`    },
};

// ─── GLOBAL CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  :root {
    --card-bg:#fff; --card-border:#E8EDF4; --card-shadow:0 2px 12px rgba(0,0,0,0.06);
    --body-bg:#F7F9FC; --text-primary:#1E293B; --text-secondary:#64748B; --text-muted:#94A3B8;
    --input-bg:#F8FAFC; --input-border:#E2E8F0;
    --modal-overlay:rgba(15,23,42,0.55);
    --sk-from:#EEF2F7; --sk-via:#E2E8F0;
    --table-border:#F1F5F9; --pill-inactive-bg:#F1F5F9; --pill-inactive-text:#64748B;
    --table-hover:#F8FAFC;
  }
  .dark {
    --card-bg:#1E2432; --card-border:#2A3349; --card-shadow:0 2px 12px rgba(0,0,0,0.30);
    --body-bg:#141921; --text-primary:#E8EDF8; --text-secondary:#94A3B8; --text-muted:#64748B;
    --input-bg:#252E42; --input-border:#2A3349;
    --modal-overlay:rgba(5,8,14,0.75);
    --sk-from:#1E2432; --sk-via:#252E42;
    --table-border:#1E2432; --pill-inactive-bg:#1E2432; --pill-inactive-text:#94A3B8;
    --table-hover:#1A2030;
  }
  .sk { background:linear-gradient(90deg,var(--sk-from) 25%,var(--sk-via) 50%,var(--sk-from) 75%); background-size:200% 100%; animation:shimmer 1.6s infinite linear; border-radius:10px; }
  .fi { width:100%; padding:10px 14px; border-radius:10px; font-size:13px; font-family:inherit; background:var(--input-bg); border:1.5px solid var(--input-border); color:var(--text-primary); outline:none; transition:border-color 0.18s,box-shadow 0.18s; box-sizing:border-box; }
  .fi:focus { border-color:${ACCENT}; box-shadow:0 0 0 3px ${ACCENT}22; }
  .fi::placeholder { color:var(--text-muted); }
  .fi.ta { resize:vertical; min-height:84px; line-height:1.6; }
  .modal-overlay { position:fixed; inset:0; background:var(--modal-overlay); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; backdrop-filter:blur(4px); }
  .modal-box { background:var(--card-bg); border:1px solid var(--card-border); border-radius:20px; width:100%; max-width:540px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.22); }
  .ptr:hover { background:var(--table-hover) !important; }
  @media(max-width:900px){ .stat-grid{grid-template-columns:repeat(3,1fr)!important;} }
  @media(max-width:600px){ .stat-grid{grid-template-columns:repeat(2,1fr)!important;} .pill-row{flex-wrap:wrap!important;} }
`;

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const Sk = ({ h = 16, style = {} }: { h?: number; style?: React.CSSProperties }) => (
  <div className="sk" style={{ height: h, ...style }} />
);

const fmt = (v?: string) => {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return v; }
};

const mentorName = (m: any) =>
  m && typeof m === "object" ? `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || "—" : "—";

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const m = STATUS_META[status] ?? { label: status, color: C.amber, bg: `${C.amber}18` };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:20, background:m.bg, color:m.color, fontSize:11, fontWeight:700 }}>
      {m.label}
    </span>
  );
};

// ─── PILL ──────────────────────────────────────────────────────────────────────
const Pill = ({ label, active, onClick, count }: any) => (
  <button onClick={onClick} style={{ padding:"5px 13px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, transition:"all 0.18s", background:active ? ACCENT : "var(--pill-inactive-bg)", color:active ? "#fff" : "var(--pill-inactive-text)", boxShadow:active ? `0 2px 8px ${ACCENT}40` : "none", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
    {label}
    {count != null && <span style={{ fontSize:10, fontWeight:800, background:active ? "rgba(255,255,255,0.25)" : "var(--card-border)", color:active ? "#fff" : "var(--text-muted)", borderRadius:10, padding:"1px 5px" }}>{count}</span>}
  </button>
);

// ─── CONFIRM DIALOG ────────────────────────────────────────────────────────────
const ConfirmDialog = ({ open, title, desc, confirmLabel = "Confirm", confirmColor = C.rose, onConfirm, onCancel, loading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay" onClick={onCancel}>
        <motion.div initial={{ opacity:0, scale:0.93 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.93 }}
          onClick={e => e.stopPropagation()}
          style={{ background:"var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:18, padding:"28px", maxWidth:400, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,0.22)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:`${confirmColor}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <AlertTriangle size={18} color={confirmColor} />
            </div>
            <p style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)", margin:0 }}>{title}</p>
          </div>
          <p style={{ fontSize:13, color:"var(--text-secondary)", marginBottom:22, lineHeight:1.6 }}>{desc}</p>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button onClick={onCancel} style={{ padding:"8px 18px", borderRadius:10, border:"1.5px solid var(--card-border)", background:"transparent", color:"var(--text-secondary)", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
            <button onClick={onConfirm} disabled={loading} style={{ padding:"8px 20px", borderRadius:10, border:"none", background:confirmColor, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, opacity:loading?0.7:1 }}>
              {loading && <Loader2 size={13} style={{ animation:"spin 1s linear infinite" }} />} {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─── SUBMIT MODAL ─────────────────────────────────────────────────────────────
const SubmitModal = ({ open, onConfirm, onCancel, loading }: any) => {
  const [note, setNote] = useState("");
  useEffect(() => { if (!open) setNote(""); }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onCancel}>
          <motion.div initial={{ opacity:0, scale:0.93 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.93 }}
            onClick={e => e.stopPropagation()}
            style={{ background:"var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:18, padding:"28px", maxWidth:440, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,0.22)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${C.emerald}18`, display:"flex", alignItems:"center", justifyContent:"center" }}><Send size={18} color={C.emerald} /></div>
              <div>
                <p style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)", margin:0 }}>Submit Project</p>
                <p style={{ fontSize:12, color:"var(--text-muted)", margin:0 }}>Project will be submitted for mentor review</p>
              </div>
            </div>
            <label style={{ fontSize:12, fontWeight:700, color:"var(--text-secondary)", display:"block", marginBottom:6 }}>Submission Note <span style={{ color:"var(--text-muted)", fontWeight:400 }}>(optional)</span></label>
            <textarea className="fi ta" value={note} onChange={e => setNote(e.target.value)} placeholder="Add GitHub repo link, deployment URL, or notes for your mentor..." style={{ marginBottom:20 }} />
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={onCancel} style={{ padding:"8px 18px", borderRadius:10, border:"1.5px solid var(--card-border)", background:"transparent", color:"var(--text-secondary)", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
              <button onClick={() => onConfirm(note)} disabled={loading} style={{ padding:"8px 22px", borderRadius:10, border:"none", background:C.emerald, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, opacity:loading?0.7:1, boxShadow:`0 4px 12px ${C.emerald}44` }}>
                {loading && <Loader2 size={13} style={{ animation:"spin 1s linear infinite" }} />} Submit Project
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── DETAILS MODAL ────────────────────────────────────────────────────────────
const DetailsModal = ({ project, onClose }: { project: Project | null; onClose: () => void }) => (
  <AnimatePresence>
    {project && (
      <div className="modal-overlay" onClick={onClose}>
        <motion.div initial={{ opacity:0, scale:0.93 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.93 }}
          onClick={e => e.stopPropagation()} className="modal-box">
          <div style={{ padding:"20px 22px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid var(--card-border)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:`${ACCENT}18`, display:"flex", alignItems:"center", justifyContent:"center" }}><Briefcase size={15} color={ACCENT} /></div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", margin:0 }}>Project Details</p>
                <p style={{ fontSize:11, color:"var(--text-muted)", margin:0 }}>{project.title}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:"none", background:"var(--pill-inactive-bg)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={13} color="var(--text-muted)" /></button>
          </div>
          <div style={{ padding:"18px 22px 24px", display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ padding:"12px 14px", borderRadius:12, background:"var(--body-bg)", border:"1px solid var(--card-border)" }}>
                <p style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 3px" }}>Mentor</p>
                <p style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", margin:0 }}>{mentorName(project.mentorId)}</p>
              </div>
              <div style={{ padding:"12px 14px", borderRadius:12, background:"var(--body-bg)", border:"1px solid var(--card-border)" }}>
                <p style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 3px" }}>Status</p>
                <StatusBadge status={project.status} />
              </div>
            </div>

            <div style={{ padding:"12px 14px", borderRadius:12, background:"var(--body-bg)", border:"1px solid var(--card-border)" }}>
              <p style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 5px" }}>Description</p>
              <p style={{ fontSize:13, color:"var(--text-secondary)", margin:0, lineHeight:1.65 }}>{project.description}</p>
            </div>

            {/* Links */}
            {(project.githubLink || project.websiteLink) && (
              <div style={{ display:"flex", gap:8 }}>
                {project.githubLink  && <a href={project.githubLink}  target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, background:`${C.blue}12`, color:C.blue,  fontSize:12, fontWeight:600, textDecoration:"none" }}><Github size={12} />GitHub</a>}
                {project.websiteLink && <a href={project.websiteLink} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, background:`${C.cyan}12`, color:C.cyan,  fontSize:12, fontWeight:600, textDecoration:"none" }}><Globe  size={12} />Website</a>}
              </div>
            )}

            {project.submissionNote && (
              <div style={{ padding:"12px 14px", borderRadius:12, background:`${C.blue}08`, border:`1px solid ${C.blue}22` }}>
                <p style={{ fontSize:10, fontWeight:700, color:C.blue, textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 5px" }}>My Submission Note</p>
                <p style={{ fontSize:13, color:"var(--text-secondary)", margin:0, lineHeight:1.65, whiteSpace:"pre-wrap" }}>{project.submissionNote}</p>
              </div>
            )}

            {project.verificationNote ? (
              <div style={{ padding:"12px 14px", borderRadius:12, background:`${C.emerald}08`, border:`1px solid ${C.emerald}22` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <p style={{ fontSize:10, fontWeight:700, color:C.emerald, textTransform:"uppercase", letterSpacing:"0.05em", margin:0 }}>Mentor Feedback</p>
                  {project.pointsAwarded != null && project.pointsAwarded > 0 && (
                    <span style={{ fontSize:11, fontWeight:800, color:C.emerald, background:`${C.emerald}18`, padding:"2px 8px", borderRadius:8 }}>+{project.pointsAwarded} pts</span>
                  )}
                </div>
                <p style={{ fontSize:13, color:"var(--text-secondary)", margin:0, lineHeight:1.65, whiteSpace:"pre-wrap" }}>{project.verificationNote}</p>
              </div>
            ) : (
              <div style={{ padding:"12px 14px", borderRadius:12, background:"var(--body-bg)", border:"1px solid var(--card-border)", textAlign:"center" }}>
                <p style={{ fontSize:13, color:"var(--text-muted)", margin:0 }}>
                  {project.status === "SUBMITTED" ? "⏳ Awaiting mentor review…" : "No mentor feedback yet."}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─── PROJECT FORM MODAL ───────────────────────────────────────────────────────
const ProjectFormModal = ({ open, editing, onClose, onSubmit, loading }: any) => {
  const [form, setForm] = useState({ title:"", description:"", githubLink:"", websiteLink:"" });
  useEffect(() => {
    if (editing) setForm({ title:editing.title ?? "", description:editing.description ?? "", githubLink:editing.githubLink ?? "", websiteLink:editing.websiteLink ?? "" });
    else setForm({ title:"", description:"", githubLink:"", websiteLink:"" });
  }, [editing, open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity:0, scale:0.93, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.93, y:10 }}
            onClick={e => e.stopPropagation()} className="modal-box">
            <div style={{ padding:"20px 22px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid var(--card-border)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:`${ACCENT}18`, display:"flex", alignItems:"center", justifyContent:"center" }}><Briefcase size={15} color={ACCENT} /></div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", margin:0 }}>{editing ? "Edit Project" : "Create Project"}</p>
                  <p style={{ fontSize:11, color:"var(--text-muted)", margin:0 }}>{editing ? "Update your project details" : "Create a new personal project"}</p>
                </div>
              </div>
              <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:"none", background:"var(--pill-inactive-bg)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={13} color="var(--text-muted)" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} style={{ padding:"18px 22px 24px", display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"var(--text-secondary)", display:"block", marginBottom:5 }}>Title <span style={{ color:C.rose }}>*</span></label>
                <input className="fi" value={form.title} onChange={e => setForm(p => ({...p, title:e.target.value}))} required placeholder="e.g. E-commerce Platform" />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"var(--text-secondary)", display:"block", marginBottom:5 }}>Description <span style={{ color:C.rose }}>*</span></label>
                <textarea className="fi ta" value={form.description} onChange={e => setForm(p => ({...p, description:e.target.value}))} required placeholder="Describe your project..." />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:"var(--text-secondary)", display:"block", marginBottom:5 }}>GitHub Link</label>
                  <input className="fi" value={form.githubLink} onChange={e => setForm(p => ({...p, githubLink:e.target.value}))} placeholder="https://github.com/..." />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:"var(--text-secondary)", display:"block", marginBottom:5 }}>Website Link</label>
                  <input className="fi" value={form.websiteLink} onChange={e => setForm(p => ({...p, websiteLink:e.target.value}))} placeholder="https://..." />
                </div>
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
                <button type="button" onClick={onClose} style={{ padding:"9px 18px", borderRadius:10, border:"1.5px solid var(--card-border)", background:"transparent", color:"var(--text-secondary)", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding:"9px 22px", borderRadius:10, border:"none", background:ACCENT, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, opacity:loading?0.7:1, boxShadow:`0 4px 12px ${ACCENT}44` }}>
                  {loading && <Loader2 size={13} style={{ animation:"spin 1s linear infinite" }} />}
                  {editing ? "Update" : "Create Project"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── PROJECT ROW ─────────────────────────────────────────────────────────────
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
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 9px", borderRadius:7, border:"none", background:`${bg}18`, color:color ?? bg, fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
      {children}
    </button>
  );

  return (
    <motion.tr className="ptr" initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:idx*0.03 }}
      style={{ borderBottom:"1px solid var(--table-border)", transition:"background 0.14s" }}>
      <td style={{ padding:"12px 14px", fontSize:12, fontWeight:700, color:"var(--text-muted)", width:40 }}>{idx+1}</td>
      <td style={{ padding:"12px 14px", minWidth:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:`${ACCENT}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Briefcase size={13} color={ACCENT} /></div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:220 }}>{project.title}</p>
            <p style={{ fontSize:11, color:"var(--text-muted)", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:220 }}>{project.description}</p>
          </div>
        </div>
      </td>
      <td style={{ padding:"12px 14px", fontSize:12, color:"var(--text-secondary)", fontWeight:500 }}>{mentorName(project.mentorId)}</td>
      <td style={{ padding:"12px 14px" }}>
        <div style={{ display:"flex", gap:6 }}>
          {project.githubLink  && <a href={project.githubLink}  target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:C.blue, textDecoration:"none" }}><Github size={11} />GitHub</a>}
          {project.websiteLink && <a href={project.websiteLink} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:C.cyan, textDecoration:"none" }}><Globe  size={11} />Site</a>}
          {!project.githubLink && !project.websiteLink && <span style={{ fontSize:11, color:"var(--text-muted)" }}>—</span>}
        </div>
      </td>
      <td style={{ padding:"12px 14px" }}><StatusBadge status={project.status} /></td>
      <td style={{ padding:"12px 14px" }}>
        <div style={{ display:"flex", gap:5, alignItems:"center", flexWrap:"wrap" }}>
          {canStart    && <Btn onClick={()=>onStart(project)}      bg={C.blue}    color={C.blue}><Play size={11} fill="currentColor" /> Start</Btn>}
          {canSubmit   && <Btn onClick={()=>onSubmit(project._id)} bg={C.emerald} color={C.emerald}><Send size={11} /> Submit</Btn>}
          {showDetails && <Btn onClick={()=>onDetails(project)}    bg={C.violet}  color={C.violet}><Eye size={11} /> Details</Btn>}
          {canEdit     && <Btn onClick={()=>onEdit(project)}       bg={ACCENT}    color={ACCENT}><Edit2 size={11} /></Btn>}
          {canDelete   && <Btn onClick={()=>onDelete(project)}     bg={C.rose}    color={C.rose}><Trash2 size={11} /></Btn>}
        </div>
      </td>
    </motion.tr>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
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
    { label:"Pending",     val:counts.PENDING,     color:C.amber },
    { label:"In Progress", val:counts.IN_PROGRESS, color:C.blue },
    { label:"Submitted",   val:counts.SUBMITTED,   color:C.violet },
    { label:"Approved",    val:counts.APPROVED,    color:C.emerald },
    { label:"Rejected",    val:counts.REJECTED,    color:C.rose },
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width:"100%", minHeight:"100vh", background:"var(--body-bg)" }}>
        <Header subtitle="Manage your projects and submit them for mentor review." 
        // HeaderComp={
        //   hasMentor ? (
        //     <Button onClick={openCreateModal} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, background:ACCENT, color:"#fff", boxShadow:`0 4px 12px ${ACCENT}44` }}>
        //       <Plus size={14} /> Add Project
        //     </Button>
        //   ) : undefined
        // } 
        />

        <div style={{ padding:"22px 22px 48px", display:"flex", flexDirection:"column", gap:18 }}>

          {/* No mentor warning */}
          {!hasMentor && (
            <div style={{ padding:"14px 18px", borderRadius:12, background:`${C.amber}10`, border:`1.5px solid ${C.amber}30`, display:"flex", alignItems:"center", gap:10 }}>
              <AlertCircle size={16} color={C.amber} />
              <p style={{ fontSize:13, color:C.amber, fontWeight:600, margin:0 }}>You have no mentor assigned. Contact admin to get a mentor.</p>
            </div>
          )}

          {/* Stats */}
          <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
            {STATS.map(({ label, val, color }, i) => (
              <motion.div key={label} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                style={{ background:"var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:14, padding:"14px 16px", boxShadow:"var(--card-shadow)" }}>
                <p style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.05em", textTransform:"uppercase", margin:"0 0 5px" }}>{label}</p>
                <p style={{ fontSize:26, fontWeight:800, color, margin:0, lineHeight:1 }}>{val}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ background:"var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:16, padding:"14px 18px", boxShadow:"var(--card-shadow)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:14, flexWrap:"wrap" }}>
            <div className="pill-row" style={{ display:"flex", gap:6, flexWrap:"wrap", flex:1 }}>
              {FILTERS.map(f => (
                <Pill key={f.key} label={f.label} active={statusFilter === f.key} onClick={() => setStatusFilter(f.key)} count={counts[f.key] as number} />
              ))}
            </div>
            <div style={{ position:"relative", maxWidth:240, width:"100%" }}>
              <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)" }} />
              <input className="fi" placeholder="Search projects…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft:30 }} />
            </div>
          </div>

          {/* Table */}
          <div style={{ background:"var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:16, boxShadow:"var(--card-shadow)", overflow:"hidden" }}>
            {isLoading ? (
              <div style={{ padding:18, display:"flex", flexDirection:"column", gap:10 }}>
                {Array.from({length:5}).map((_,i) => <Sk key={i} h={50} style={{ borderRadius:10 }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding:"56px 24px", textAlign:"center" }}>
                <Briefcase size={38} color="var(--text-muted)" style={{ marginBottom:12 }} />
                <p style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)", marginBottom:6 }}>No projects found</p>
                <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:20 }}>
                  {statusFilter !== "ALL" ? "Try a different filter" : "Create a project or wait for your mentor to assign one"}
                </p>
                {hasMentor && (
                  <button onClick={openCreateModal} style={{ padding:"9px 22px", borderRadius:10, border:"none", background:ACCENT, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 12px ${ACCENT}44` }}>
                    + Create Project
                  </button>
                )}
              </div>
            ) : (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"var(--body-bg)", borderBottom:"1px solid var(--table-border)" }}>
                      {["#","Project","Mentor","Links","Status","Actions"].map(h => (
                        <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <button onClick={() => setPage(pagination.skip - pagination.limit)} disabled={currentPage === 1}
                style={{ padding:"7px 14px", borderRadius:8, border:"1.5px solid var(--card-border)", background:"var(--card-bg)", color:"var(--text-secondary)", cursor:currentPage===1?"not-allowed":"pointer", opacity:currentPage===1?0.5:1, display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600 }}>
                <ChevronLeft size={13} /> Prev
              </button>
              <span style={{ fontSize:13, fontWeight:600, color:"var(--text-secondary)" }}>Page {currentPage} / {totalPages}</span>
              <button onClick={() => setPage(pagination.skip + pagination.limit)} disabled={currentPage === totalPages}
                style={{ padding:"7px 14px", borderRadius:8, border:"1.5px solid var(--card-border)", background:"var(--card-bg)", color:"var(--text-secondary)", cursor:currentPage===totalPages?"not-allowed":"pointer", opacity:currentPage===totalPages?0.5:1, display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600 }}>
                Next <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProjectFormModal open={isModalOpen} editing={editingProject} onClose={closeModal} onSubmit={handleFormSubmit} loading={isSubmitting} />
      <SubmitModal      open={isSubmitModalOpen} onConfirm={handleSubmit} onCancel={closeSubmitModal} loading={isSubmitting} />
      <DetailsModal     project={detailProject} onClose={() => setDetailProject(null)} />

      <ConfirmDialog open={!!deleteTarget} title="Delete Project" desc={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
      <ConfirmDialog open={!!startTarget} title="Start Project" desc={`Start working on "${startTarget?.title}"? Status will change to In Progress.`}
        confirmLabel="Start" confirmColor={C.blue} onConfirm={handleStart} onCancel={() => setStartTarget(null)} loading={isStarting} />
    </>
  );
}
