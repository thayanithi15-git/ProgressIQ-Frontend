"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare, Plus, Search, Edit2, Trash2, Calendar,
  ChevronLeft, ChevronRight, MessageSquare, X, Loader2,
  CheckCircle, Clock, XCircle, AlertTriangle, Send,
  AlertCircle, ClipboardList,
} from "lucide-react";
import { useTasksStore, Task, TaskStatusFilter } from "@/store/student/tasks";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────────────────────
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

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:   { label: "Pending",   color: C.amber,   bg: `${C.amber}18`,   icon: Clock },
  SUBMITTED: { label: "Submitted", color: C.blue,    bg: `${C.blue}18`,    icon: Send },
  COMPLETED: { label: "Completed", color: C.emerald, bg: `${C.emerald}18`, icon: CheckCircle },
  REJECTED:  { label: "Rejected",  color: C.rose,    bg: `${C.rose}18`,    icon: XCircle },
};

const GLOBAL_CSS = `
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes spin { to{transform:rotate(360deg)} }
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
  .form-input { width:100%; padding:10px 14px; border-radius:10px; font-size:13px; font-family:inherit; background:var(--input-bg); border:1.5px solid var(--input-border); color:var(--text-primary); outline:none; transition:border-color 0.18s,box-shadow 0.18s; }
  .form-input:focus { border-color:${ACCENT}; box-shadow:0 0 0 3px ${ACCENT}22; }
  .form-input::placeholder { color:var(--text-muted); }
  .form-input.textarea { resize:vertical; min-height:90px; line-height:1.6; }
  .modal-overlay { position:fixed; inset:0; background:var(--modal-overlay); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; backdrop-filter:blur(4px); }
  .modal-box { background:var(--card-bg); border:1px solid var(--card-border); border-radius:20px; width:100%; max-width:540px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.22); }
  .task-row:hover { background:var(--table-hover) !important; }
  @media(max-width:768px){ .task-stats{grid-template-columns:repeat(2,1fr)!important;} .filter-tasks{flex-wrap:wrap!important;} }
  @media(max-width:480px){ .task-stats{grid-template-columns:1fr!important;} }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const Sk = ({ w = "100%", h = 16, style = {} }: any) => <div className="sk" style={{ width: w, height: h, ...style }} />;

const fmtDate = (v?: string) => {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return v; }
};

const getMentorName = (m: any) => typeof m === "object" ? `${m?.firstName ?? ""} ${m?.lastName ?? ""}`.trim() : "—";

const isOverdueNow = (dueDate: string, status: string) => {
  if (status === "COMPLETED" || status === "SUBMITTED") return false;
  return new Date(dueDate) < new Date();
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status, isOverdue }: any) => {
  if (isOverdue && status === "PENDING") {
    return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: `${C.rose}18`, color: C.rose, fontSize: 11, fontWeight: 700 }}><AlertCircle size={11} strokeWidth={2.5} />Overdue</span>;
  }
  const meta = STATUS_META[status] ?? STATUS_META.PENDING;
  const Icon = meta.icon;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: meta.bg, color: meta.color, fontSize: 11, fontWeight: 700 }}><Icon size={11} strokeWidth={2.5} />{meta.label}</span>;
};

const Pill = ({ label, active, onClick, count }: any) => (
  <button onClick={onClick} style={{ padding: "5px 13px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.18s", background: active ? ACCENT : "var(--pill-inactive-bg)", color: active ? "#fff" : "var(--pill-inactive-text)", boxShadow: active ? `0 2px 10px ${ACCENT}44` : "none", display: "flex", alignItems: "center", gap: 5 }}>
    {label}
    {count != null && <span style={{ fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.25)" : "var(--card-border)", color: active ? "#fff" : "var(--text-muted)", borderRadius: 10, padding: "1px 6px" }}>{count}</span>}
  </button>
);

const ConfirmDialog = ({ open, title, desc, onConfirm, onCancel, loading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay" onClick={onCancel}>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} onClick={(e) => e.stopPropagation()}
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 18, padding: "28px", maxWidth: 420, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.rose}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><AlertTriangle size={18} color={C.rose} /></div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{title}</p>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 22, lineHeight: 1.6 }}>{desc}</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onCancel} style={{ padding: "8px 18px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={onConfirm} disabled={loading} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: C.rose, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: loading ? 0.7 : 1 }}>
              {loading && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />} Delete
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const FeedbackModal = ({ open, feedback, onClose }: any) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} onClick={(e) => e.stopPropagation()} className="modal-box" style={{ maxWidth: 480 }}>
          <div style={{ padding: "22px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.violet}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><MessageSquare size={16} color={C.violet} /></div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Task Feedback</p>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--pill-inactive-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} color="var(--text-muted)" /></button>
          </div>
          <div style={{ padding: "18px 24px 24px" }}>
            {feedback ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1, padding: "12px 14px", borderRadius: 12, background: "var(--body-bg)", border: "1px solid var(--card-border)" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 3px" }}>From</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{feedback.mentor}</p>
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--body-bg)", border: "1px solid var(--card-border)" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 3px" }}>Date</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{fmtDate(feedback.createdAt)}</p>
                  </div>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: 12, background: `${ACCENT}08`, border: `1px solid ${ACCENT}25`, lineHeight: 1.65 }}>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{feedback.message}</p>
                </div>
              </div>
            ) : <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No feedback available</p>}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// Submit confirm modal
const SubmitTaskModal = ({ open, onConfirm, onCancel, isSubmitting }: any) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay" onClick={onCancel}>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} onClick={(e) => e.stopPropagation()}
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 18, padding: "28px", maxWidth: 420, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.emerald}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Send size={18} color={C.emerald} /></div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Submit Task</p>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 22, lineHeight: 1.6 }}>Mark this task as submitted for mentor review? The completion date will be set to today.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onCancel} style={{ padding: "8px 18px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={onConfirm} disabled={isSubmitting} style={{ padding: "8px 22px", borderRadius: 10, border: "none", background: C.emerald, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />} Submit Task
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);


const Field = ({ label, required, children }: any) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: "var(--text-secondary)",
        letterSpacing: "0.04em",
      }}
    >
      {label}
      {required && <span style={{ color: C.rose }}> *</span>}
    </label>
    {children}
  </div>
);
// ─────────────────────────────────────────────────────────────────────────────
// TASK FORM MODAL
// ─────────────────────────────────────────────────────────────────────────────
const TaskFormModal = ({ open, editing, onClose, onSubmit, isSubmitting }: any) => {
  const isEdit = !!editing;
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title ?? "",
        description: editing.description ?? "",
        dueDate: editing.dueDate ? editing.dueDate.split("T")[0] : "",
      });
    } else {
      setForm({ title: "", description: "", dueDate: "" });
    }
  }, [editing, open]);

  // const F = ({ label, required, children }: any) => (
  //   <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
  //     <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>{label}{required && <span style={{ color: C.rose }}> *</span>}</label>
  //     {children}
  //   </div>
  // );

  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 10 }} onClick={(e) => e.stopPropagation()} className="modal-box">
            <div style={{ padding: "22px 24px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--card-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><CheckSquare size={16} color={ACCENT} /></div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{isEdit ? "Edit Task" : "Create Task"}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{isEdit ? "Update task details" : "Create a new task assigned by your mentor"}</p>
                </div>
              </div>
              <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--pill-inactive-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} color="var(--text-muted)" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Task Title" required><input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Build Authentication Module" /></Field>
              <Field label="Description" required><textarea className="form-input textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required placeholder="Describe what needs to be done..." /></Field>
              <Field label="Due Date" required><input className="form-input" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} required /></Field>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                <button type="button" onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: "9px 24px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: isSubmitting ? 0.7 : 1, boxShadow: `0 4px 14px ${ACCENT}44` }}>
                  {isSubmitting && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
                  {isEdit ? "Update Task" : "Create Task"}
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
// TASK ROW (table row)
// ─────────────────────────────────────────────────────────────────────────────
const TaskRow = ({ task, index, onEdit, onDelete, onSubmitTask, onFeedback }: any) => {
  const overdue = isOverdueNow(task.dueDate, task.status);
  const canEdit   = task.status === "PENDING";
  const canDelete = task.status === "PENDING";
  const canSubmit = task.status === "PENDING" || task.status === "REJECTED";

  return (
    <motion.tr
      className="task-row"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.035 }}
      style={{ borderBottom: "1px solid var(--table-border)", transition: "background 0.14s", cursor: "default" }}
    >
      {/* # */}
      <td style={{ padding: "13px 16px", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", width: 44 }}>{index + 1}</td>

      {/* Title + desc */}
      <td style={{ padding: "13px 16px", minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: overdue ? `${C.rose}18` : `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CheckSquare size={14} color={overdue ? C.rose : ACCENT} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260 }}>{task.title}</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260 }}>{task.description}</p>
          </div>
        </div>
      </td>

      {/* Mentor */}
      <td style={{ padding: "13px 16px", fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, whiteSpace: "nowrap" }}>{getMentorName(task.mentorId)}</td>

      {/* Due date */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: overdue ? C.rose : "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
          <Calendar size={12} />{fmtDate(task.dueDate)}
        </span>
      </td>

      {/* Status */}
      <td style={{ padding: "13px 16px" }}>
        <StatusBadge status={task.status} isOverdue={overdue} />
      </td>

      {/* Actions */}
      <td style={{ padding: "13px 16px" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {canSubmit && (
            <button onClick={() => onSubmitTask(task._id)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: `${C.emerald}14`, color: C.emerald, fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              <Send size={11} /> Submit
            </button>
          )}
          {(task.status === "COMPLETED" || task.status === "REJECTED" || task.status === "SUBMITTED") && (
            <button onClick={() => onFeedback(task._id)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: `${C.violet}14`, color: C.violet, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              <MessageSquare size={11} /> Feedback
            </button>
          )}
          {canEdit && (
            <button onClick={() => onEdit(task)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: `${ACCENT}14`, color: ACCENT, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              <Edit2 size={11} />
            </button>
          )}
          {canDelete && (
            <button onClick={() => onDelete(task)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: `${C.rose}14`, color: C.rose, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function TasksPage() {
  const {
    tasks, pagination, statusFilter, searchQuery,
    isLoading, isSubmitting, isModalOpen, isCompleteModalOpen, isFeedbackModalOpen,
    editingTask, completingTaskId, selectedFeedback,
    fetchTasks, createTask, updateTask, deleteTask, submitTask,
    setStatusFilter, setSearchQuery, setPage,
    openCreateModal, openEditModal, closeModal,
    openCompleteModal, closeCompleteModal,
    openFeedbackModal, closeFeedbackModal,
  } = useTasksStore();

  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchTasks(); }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [tasks, searchQuery]);

  const counts = useMemo(() => ({
    ALL:       tasks.length,
    PENDING:   tasks.filter(t => t.status === "PENDING").length,
    SUBMITTED: tasks.filter(t => t.status === "SUBMITTED").length,
    COMPLETED: tasks.filter(t => t.status === "COMPLETED").length,
    REJECTED:  tasks.filter(t => t.status === "REJECTED").length,
    OVERDUE:   tasks.filter(t => isOverdueNow(t.dueDate, t.status)).length,
  }), [tasks]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteTask(deleteTarget._id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleSubmitTask = async () => {
    if (!completingTaskId) return;
    await submitTask(completingTaskId);
  };

  const handleFormSubmit = async (form: any) => {
    if (editingTask) await updateTask(editingTask._id, form);
    else await createTask(form);
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "var(--body-bg)" }}>
        <Header subtitle="Manage tasks assigned by your mentor." HeaderComp={
          <Button onClick={openCreateModal} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: ACCENT, color: "#fff", boxShadow: `0 4px 14px ${ACCENT}44` }}>
            <Plus size={15} /> Add Task
          </Button>
        } />

        <div style={{ padding: "24px 24px 48px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Stats */}
          <div className="task-stats" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 13 }}>
            {[
              { label: "Total",     val: counts.ALL,       color: ACCENT },
              { label: "Pending",   val: counts.PENDING,   color: C.amber },
              { label: "Submitted", val: counts.SUBMITTED, color: C.blue },
              { label: "Completed", val: counts.COMPLETED, color: C.emerald },
              { label: "Rejected",  val: counts.REJECTED,  color: C.rose },
              { label: "Overdue",   val: counts.OVERDUE,   color: C.rose, bg: `${C.rose}08` },
            ].map(({ label, val, color, bg }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                style={{ background: bg ?? "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 14, padding: "14px 16px", boxShadow: "var(--card-shadow)" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 5px" }}>{label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{val}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "16px 20px", boxShadow: "var(--card-shadow)" }}>
            <div className="filter-tasks" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(["ALL","PENDING","SUBMITTED","COMPLETED","REJECTED"] as TaskStatusFilter[]).map(f => (
                  <Pill key={f} label={f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()} active={statusFilter === f} onClick={() => setStatusFilter(f)} count={f === "ALL" ? counts.ALL : counts[f]} />
                ))}
              </div>
              <div style={{ position: "relative", maxWidth: 240, width: "100%" }}>
                <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input className="form-input" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 32 }} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, boxShadow: "var(--card-shadow)", overflow: "hidden" }}>
            {isLoading ? (
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[...Array(6)].map((_, i) => <Sk key={i} h={52} style={{ borderRadius: 10 }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "60px 24px", textAlign: "center" }}>
                <ClipboardList size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>No tasks found</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>Create your first task or check your filters</p>
                <button onClick={openCreateModal} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Add Task</button>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
                      {["#","Task","Mentor","Due Date","Status","Actions"].map((h, i) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap", background: "var(--body-bg)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((task, i) => (
                      <TaskRow key={task._id} task={task} index={i} onEdit={openEditModal} onDelete={setDeleteTarget} onSubmitTask={openCompleteModal} onFeedback={openFeedbackModal} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

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

      <TaskFormModal open={isModalOpen} editing={editingTask} onClose={closeModal} onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
      <SubmitTaskModal open={isCompleteModalOpen} onConfirm={handleSubmitTask} onCancel={closeCompleteModal} isSubmitting={isSubmitting} />
      <FeedbackModal open={isFeedbackModalOpen} feedback={selectedFeedback} onClose={closeFeedbackModal} />
      <ConfirmDialog open={!!deleteTarget} title="Delete Task" desc={`Delete "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
    </>
  );
}
