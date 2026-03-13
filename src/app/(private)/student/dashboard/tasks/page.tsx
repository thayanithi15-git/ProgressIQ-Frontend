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

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING:     { label: "Pending",     color: C.amber,   bg: `${C.amber}18`,   icon: Clock },
  IN_PROGRESS: { label: "In Progress", color: C.blue,    bg: `${C.blue}18`,    icon: Play },
  SUBMITTED:   { label: "Submitted",   color: C.indigo,  bg: `${C.indigo}18`,  icon: Send },
  APPROVED:    { label: "Approved",    color: C.emerald, bg: `${C.emerald}18`, icon: CheckCircle },
  REJECTED:    { label: "Rejected",    color: C.rose,    bg: `${C.rose}18`,    icon: XCircle },
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
  .fi { width:100%; padding:10px 14px; border-radius:10px; font-size:13px; font-family:inherit; background:var(--input-bg); border:1.5px solid var(--input-border); color:var(--text-primary); outline:none; transition:border-color 0.18s,box-shadow 0.18s; }
  .fi:focus { border-color:${ACCENT}; box-shadow:0 0 0 3px ${ACCENT}22; }
  .fi::placeholder { color:var(--text-muted); }
  .fi.ta { resize:vertical; min-height:90px; line-height:1.6; }
  .modal-overlay { position:fixed; inset:0; background:var(--modal-overlay); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; backdrop-filter:blur(4px); }
  .modal-box { background:var(--card-bg); border:1px solid var(--card-border); border-radius:20px; width:100%; max-width:520px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.22); }
  .tr:hover { background:var(--table-hover) !important; }
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

const isOverdue = (due: string, status: string) =>
  !["SUBMITTED", "APPROVED"].includes(status) && new Date(due) < new Date();

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status, overdue }: { status: string; overdue?: boolean }) => {
  if (overdue && !["APPROVED", "SUBMITTED"].includes(status)) {
    return (
      <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:20, background:`${C.rose}18`, color:C.rose, fontSize:11, fontWeight:700 }}>
        <AlertCircle size={11} />Overdue
      </span>
    );
  }
  const m = STATUS_META[status] ?? STATUS_META.PENDING;
  const Icon = m.icon;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:20, background:m.bg, color:m.color, fontSize:11, fontWeight:700 }}>
      <Icon size={11} />{m.label}
    </span>
  );
};

// ─── PILL ──────────────────────────────────────────────────────────────────────
const Pill = ({ label, active, onClick, count }: { label:string; active:boolean; onClick:()=>void; count?:number }) => (
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
          onClick={(e) => e.stopPropagation()}
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
            <button onClick={onConfirm} disabled={loading} style={{ padding:"8px 20px", borderRadius:10, border:"none", background:confirmColor, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, opacity:loading ? 0.7 : 1 }}>
              {loading && <Loader2 size={13} style={{ animation:"spin 1s linear infinite" }} />} {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─── SUBMIT TASK MODAL ────────────────────────────────────────────────────────
const SubmitModal = ({ open, onConfirm, onCancel, loading }: any) => {
  const [note, setNote] = useState("");
  useEffect(() => { if (!open) setNote(""); }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onCancel}>
          <motion.div initial={{ opacity:0, scale:0.93 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.93 }}
            onClick={(e) => e.stopPropagation()}
            style={{ background:"var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:18, padding:"28px", maxWidth:420, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,0.22)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${C.emerald}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Send size={18} color={C.emerald} />
              </div>
              <div>
                <p style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)", margin:0 }}>Submit Task</p>
                <p style={{ fontSize:12, color:"var(--text-muted)", margin:0 }}>This will mark task as ready for mentor review</p>
              </div>
            </div>
            <label style={{ fontSize:12, fontWeight:700, color:"var(--text-secondary)", display:"block", marginBottom:6 }}>Submission Note <span style={{ color:"var(--text-muted)", fontWeight:400 }}>(optional)</span></label>
            <textarea className="fi ta" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a GitHub link, deployment URL, or notes for your mentor..." style={{ marginBottom:20 }} />
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={onCancel} style={{ padding:"8px 18px", borderRadius:10, border:"1.5px solid var(--card-border)", background:"transparent", color:"var(--text-secondary)", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
              <button onClick={() => onConfirm(note)} disabled={loading} style={{ padding:"8px 22px", borderRadius:10, border:"none", background:C.emerald, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, opacity:loading ? 0.7 : 1, boxShadow:`0 4px 12px ${C.emerald}44` }}>
                {loading && <Loader2 size={13} style={{ animation:"spin 1s linear infinite" }} />} Submit Task
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── DETAILS MODAL (feedback + submission note) ───────────────────────────────
const DetailsModal = ({ task, onClose }: { task: Task | null; onClose: () => void }) => (
  <AnimatePresence>
    {task && (
      <div className="modal-overlay" onClick={onClose}>
        <motion.div initial={{ opacity:0, scale:0.93 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.93 }}
          onClick={(e) => e.stopPropagation()} className="modal-box">
          {/* Header */}
          <div style={{ padding:"20px 22px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid var(--card-border)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:`${C.violet}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <MessageSquare size={15} color={C.violet} />
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", margin:0 }}>Task Details</p>
                <p style={{ fontSize:11, color:"var(--text-muted)", margin:0 }}>{task.title}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:"none", background:"var(--pill-inactive-bg)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <X size={13} color="var(--text-muted)" />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding:"18px 22px 24px", display:"flex", flexDirection:"column", gap:12 }}>
            {/* Task info */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ padding:"12px 14px", borderRadius:12, background:"var(--body-bg)", border:"1px solid var(--card-border)" }}>
                <p style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 3px" }}>Mentor</p>
                <p style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", margin:0 }}>{mentorName(task.mentorId)}</p>
              </div>
              <div style={{ padding:"12px 14px", borderRadius:12, background:"var(--body-bg)", border:"1px solid var(--card-border)" }}>
                <p style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 3px" }}>Due Date</p>
                <p style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", margin:0 }}>{fmt(task.dueDate)}</p>
              </div>
            </div>

            {/* Description */}
            <div style={{ padding:"12px 14px", borderRadius:12, background:"var(--body-bg)", border:"1px solid var(--card-border)" }}>
              <p style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 5px" }}>Description</p>
              <p style={{ fontSize:13, color:"var(--text-secondary)", margin:0, lineHeight:1.65 }}>{task.description}</p>
            </div>

            {/* Submission Note */}
            {task.submissionNote && (
              <div style={{ padding:"12px 14px", borderRadius:12, background:`${C.blue}08`, border:`1px solid ${C.blue}22` }}>
                <p style={{ fontSize:10, fontWeight:700, color:C.blue, textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 5px" }}>My Submission Note</p>
                <p style={{ fontSize:13, color:"var(--text-secondary)", margin:0, lineHeight:1.65, whiteSpace:"pre-wrap" }}>{task.submissionNote}</p>
              </div>
            )}

            {/* Mentor Feedback */}
            {task.verificationNote ? (
              <div style={{ padding:"12px 14px", borderRadius:12, background:`${C.emerald}08`, border:`1px solid ${C.emerald}22` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <p style={{ fontSize:10, fontWeight:700, color:C.emerald, textTransform:"uppercase", letterSpacing:"0.05em", margin:0 }}>Mentor Feedback</p>
                  {task.pointsAwarded != null && task.pointsAwarded > 0 && (
                    <span style={{ fontSize:11, fontWeight:800, color:C.emerald, background:`${C.emerald}18`, padding:"2px 8px", borderRadius:8 }}>+{task.pointsAwarded} pts</span>
                  )}
                </div>
                <p style={{ fontSize:13, color:"var(--text-secondary)", margin:0, lineHeight:1.65, whiteSpace:"pre-wrap" }}>{task.verificationNote}</p>
              </div>
            ) : (
              <div style={{ padding:"12px 14px", borderRadius:12, background:"var(--body-bg)", border:"1px solid var(--card-border)", textAlign:"center" }}>
                <p style={{ fontSize:13, color:"var(--text-muted)", margin:0 }}>
                  {task.status === "SUBMITTED" ? "⏳ Awaiting mentor review…" : "No mentor feedback yet."}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─── TASK FORM MODAL ───────────────────────────────────────────────────────────
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
        <div className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity:0, scale:0.93, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.93, y:10 }}
            onClick={(e) => e.stopPropagation()} className="modal-box">
            <div style={{ padding:"20px 22px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid var(--card-border)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:`${ACCENT}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <CheckSquare size={15} color={ACCENT} />
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", margin:0 }}>{isEdit ? "Edit Task" : "Create Task"}</p>
                  <p style={{ fontSize:11, color:"var(--text-muted)", margin:0 }}>{isEdit ? "Update task details" : "Create a new personal task"}</p>
                </div>
              </div>
              <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:"none", background:"var(--pill-inactive-bg)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <X size={13} color="var(--text-muted)" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} style={{ padding:"18px 22px 24px", display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"var(--text-secondary)", display:"block", marginBottom:5 }}>Title <span style={{color:C.rose}}>*</span></label>
                <input className="fi" value={form.title} onChange={e => setForm(p => ({...p, title:e.target.value}))} required placeholder="e.g. Build Authentication Module" />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"var(--text-secondary)", display:"block", marginBottom:5 }}>Description <span style={{color:C.rose}}>*</span></label>
                <textarea className="fi ta" value={form.description} onChange={e => setForm(p => ({...p, description:e.target.value}))} required placeholder="Describe what needs to be done..." />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"var(--text-secondary)", display:"block", marginBottom:5 }}>Due Date <span style={{color:C.rose}}>*</span></label>
                <input className="fi" type="date" value={form.dueDate} onChange={e => setForm(p => ({...p, dueDate:e.target.value}))} required />
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
                <button type="button" onClick={onClose} style={{ padding:"9px 18px", borderRadius:10, border:"1.5px solid var(--card-border)", background:"transparent", color:"var(--text-secondary)", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding:"9px 22px", borderRadius:10, border:"none", background:ACCENT, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, opacity:loading ? 0.7 : 1, boxShadow:`0 4px 12px ${ACCENT}44` }}>
                  {loading && <Loader2 size={13} style={{ animation:"spin 1s linear infinite" }} />}
                  {isEdit ? "Update" : "Create Task"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── TASK ROW ─────────────────────────────────────────────────────────────────
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
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 9px", borderRadius:7, border:"none", background:`${bg}18`, color:bg, fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", color:color ?? bg }}>
      {children}
    </button>
  );

  return (
    <motion.tr className="tr" initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:idx*0.03 }}
      style={{ borderBottom:"1px solid var(--table-border)", transition:"background 0.14s" }}>
      <td style={{ padding:"12px 14px", fontSize:12, fontWeight:700, color:"var(--text-muted)", width:40 }}>{idx+1}</td>
      <td style={{ padding:"12px 14px", minWidth:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:od?`${C.rose}18`:`${ACCENT}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <CheckSquare size={13} color={od?C.rose:ACCENT} />
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:240 }}>{task.title}</p>
            <p style={{ fontSize:11, color:"var(--text-muted)", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:240 }}>{task.description}</p>
          </div>
        </div>
      </td>
      <td style={{ padding:"12px 14px", fontSize:12, color:"var(--text-secondary)", fontWeight:500, whiteSpace:"nowrap" }}>{mentorName(task.mentorId)}</td>
      <td style={{ padding:"12px 14px", whiteSpace:"nowrap" }}>
        <span style={{ fontSize:12, fontWeight:600, color:od?C.rose:"var(--text-secondary)", display:"flex", alignItems:"center", gap:4 }}>
          <Calendar size={12} />{fmt(task.dueDate)}
        </span>
      </td>
      <td style={{ padding:"12px 14px" }}><StatusBadge status={task.status} overdue={od} /></td>
      <td style={{ padding:"12px 14px" }}>
        <div style={{ display:"flex", gap:5, alignItems:"center", flexWrap:"wrap" }}>
          {canStart  && <Btn onClick={()=>onStart(task)}      bg={C.blue}    color={C.blue}><Play size={11} fill="currentColor" /> Start</Btn>}
          {canSubmit && <Btn onClick={()=>onSubmit(task._id)} bg={C.emerald} color={C.emerald}><Send size={11} /> Submit</Btn>}
          {showDetails && <Btn onClick={()=>onDetails(task)}  bg={C.violet}  color={C.violet}><Eye size={11} /> Details</Btn>}
          {canEdit   && <Btn onClick={()=>onEdit(task)}       bg={ACCENT}    color={ACCENT}><Edit2 size={11} /></Btn>}
          {canDelete && <Btn onClick={()=>onDelete(task)}     bg={C.rose}    color={C.rose}><Trash2 size={11} /></Btn>}
        </div>
      </td>
    </motion.tr>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
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
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width:"100%", minHeight:"100vh", background:"var(--body-bg)" }}>
        <Header subtitle="View and manage tasks assigned by your mentor." 
        // HeaderComp={
        //   <Button onClick={openCreateModal} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, background:ACCENT, color:"#fff", boxShadow:`0 4px 12px ${ACCENT}44` }}>
        //     <Plus size={14} /> Add Task
        //   </Button>
        // }
         />

        <div style={{ padding:"22px 22px 48px", display:"flex", flexDirection:"column", gap:18 }}>

          {/* Stats */}
          <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
            {STATS.map(({ label, val, color, bg }, i) => (
              <motion.div key={label} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                style={{ background:bg ?? "var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:14, padding:"14px 16px", boxShadow:"var(--card-shadow)" }}>
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
              <input className="fi" placeholder="Search tasks…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft:30 }} />
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
                <ClipboardList size={38} color="var(--text-muted)" style={{ marginBottom:12 }} />
                <p style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)", marginBottom:6 }}>No tasks found</p>
                <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:20 }}>
                  {statusFilter !== "ALL" ? "Try a different filter" : "Your mentor hasn't assigned any tasks yet"}
                </p>
              </div>
            ) : (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"var(--body-bg)", borderBottom:"1px solid var(--table-border)" }}>
                      {["#","Task","Mentor","Due Date","Status","Actions"].map(h => (
                        <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <button onClick={() => setPage(pagination.skip - pagination.limit)} disabled={currentPage === 1}
                style={{ padding:"7px 14px", borderRadius:8, border:"1.5px solid var(--card-border)", background:"var(--card-bg)", color:"var(--text-secondary)", cursor:currentPage===1?"not-allowed":"pointer", opacity:currentPage===1?0.5:1, display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600 }}>
                <ChevronLeft size={13} /> Prev
              </button>
              <span style={{ fontSize:13, fontWeight:600, color:"var(--text-secondary)", padding:"0 4px" }}>Page {currentPage} / {totalPages}</span>
              <button onClick={() => setPage(pagination.skip + pagination.limit)} disabled={currentPage === totalPages}
                style={{ padding:"7px 14px", borderRadius:8, border:"1.5px solid var(--card-border)", background:"var(--card-bg)", color:"var(--text-secondary)", cursor:currentPage===totalPages?"not-allowed":"pointer", opacity:currentPage===totalPages?0.5:1, display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600 }}>
                Next <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TaskFormModal open={isModalOpen} editing={editingTask} onClose={closeModal} onSubmit={handleFormSubmit} loading={isSubmitting} />
      <SubmitModal   open={isCompleteModalOpen} onConfirm={handleSubmit} onCancel={closeCompleteModal} loading={isSubmitting} />
      <DetailsModal  task={detailTask} onClose={() => setDetailTask(null)} />

      <ConfirmDialog open={!!deleteTarget} title="Delete Task" desc={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
      <ConfirmDialog open={!!startTarget} title="Start Task" desc={`Start working on "${startTarget?.title}"? Status will change to In Progress.`}
        confirmLabel="Start Work" confirmColor={C.blue} onConfirm={handleStart} onCancel={() => setStartTarget(null)} loading={isStarting} />
    </>
  );
}
