"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Plus, Search, Edit2, Trash2, ExternalLink,
  Calendar, ChevronLeft, ChevronRight, MessageSquare,
  X, Loader2, CheckCircle, Clock, XCircle, AlertTriangle,
  Building2, MapPin, DollarSign, Monitor, Globe, Users,
} from "lucide-react";
import { useInternshipsStore, Internship, InternshipStatusFilter, InternshipTypeFilter } from "@/store/student/internships";
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
  teal:    "#0D9488",
  orange:  "#EA580C",
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:  { label: "Pending",  color: C.amber,   bg: `${C.amber}18`,   icon: Clock },
  APPROVED: { label: "Approved", color: C.emerald, bg: `${C.emerald}18`, icon: CheckCircle },
  REJECTED: { label: "Rejected", color: C.rose,    bg: `${C.rose}18`,    icon: XCircle },
};

const TYPE_META: Record<string, { label: string; color: string; icon: any }> = {
  REMOTE: { label: "Remote", color: C.cyan,   icon: Monitor },
  ONSITE: { label: "Onsite", color: C.violet, icon: Building2 },
  HYBRID: { label: "Hybrid", color: C.teal,   icon: Users },
};

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS (shared pattern)
// ─────────────────────────────────────────────────────────────────────────────
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
  }
  .dark {
    --card-bg:#1E2432; --card-border:#2A3349; --card-shadow:0 2px 12px rgba(0,0,0,0.30);
    --body-bg:#141921; --text-primary:#E8EDF8; --text-secondary:#94A3B8; --text-muted:#64748B;
    --input-bg:#252E42; --input-border:#2A3349;
    --modal-overlay:rgba(5,8,14,0.75);
    --sk-from:#1E2432; --sk-via:#252E42;
    --table-border:#1E2432; --pill-inactive-bg:#1E2432; --pill-inactive-text:#94A3B8;
  }
  .sk { background:linear-gradient(90deg,var(--sk-from) 25%,var(--sk-via) 50%,var(--sk-from) 75%); background-size:200% 100%; animation:shimmer 1.6s infinite linear; border-radius:10px; }
  .form-input { width:100%; padding:10px 14px; border-radius:10px; font-size:13px; font-family:inherit; background:var(--input-bg); border:1.5px solid var(--input-border); color:var(--text-primary); outline:none; transition:border-color 0.18s,box-shadow 0.18s; }
  .form-input:focus { border-color:${C.teal}; box-shadow:0 0 0 3px ${C.teal}22; }
  .form-input::placeholder { color:var(--text-muted); }
  .form-input.textarea { resize:vertical; min-height:80px; line-height:1.6; }
  .modal-overlay { position:fixed; inset:0; background:var(--modal-overlay); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; backdrop-filter:blur(4px); }
  .modal-box { background:var(--card-bg); border:1px solid var(--card-border); border-radius:20px; width:100%; max-width:580px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.22); }
  @media(max-width:900px){ .card-grid-i{grid-template-columns:repeat(2,1fr)!important;} }
  @media(max-width:580px){ .card-grid-i{grid-template-columns:1fr!important;} .stats-row-i{grid-template-columns:repeat(2,1fr)!important;} .filter-wrap{flex-wrap:wrap!important;} }
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
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: any) => {
  const meta = STATUS_META[status] ?? STATUS_META.PENDING;
  const Icon = meta.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: meta.bg, color: meta.color, fontSize: 11, fontWeight: 700 }}>
      <Icon size={11} strokeWidth={2.5} />{meta.label}
    </span>
  );
};

const TypeBadge = ({ type }: any) => {
  const meta = TYPE_META[type] ?? TYPE_META.REMOTE;
  const Icon = meta.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, background: `${meta.color}14`, color: meta.color, fontSize: 11, fontWeight: 600 }}>
      <Icon size={10} />{meta.label}
    </span>
  );
};

const Pill = ({ label, active, onClick, count, color = C.teal }: any) => (
  <button onClick={onClick} style={{ padding: "5px 13px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.18s", background: active ? color : "var(--pill-inactive-bg)", color: active ? "#fff" : "var(--pill-inactive-text)", boxShadow: active ? `0 2px 10px ${color}44` : "none", display: "flex", alignItems: "center", gap: 5 }}>
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
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.rose}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={18} color={C.rose} />
            </div>
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
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Mentor Feedback</p>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--pill-inactive-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} color="var(--text-muted)" /></button>
          </div>
          <div style={{ padding: "18px 24px 24px" }}>
            {feedback ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, padding: "12px 14px", borderRadius: 12, background: "var(--body-bg)", border: "1px solid var(--card-border)" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 3px" }}>From</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{feedback.mentor}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{feedback.mentorEmail}</p>
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--body-bg)", border: "1px solid var(--card-border)" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 3px" }}>Date</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{fmtDate(feedback.createdAt)}</p>
                  </div>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: 12, background: `${C.rose}08`, border: `1px solid ${C.rose}25`, lineHeight: 1.65 }}>
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
// INTERNSHIP FORM MODAL
// ─────────────────────────────────────────────────────────────────────────────
const InternshipFormModal = ({ open, editing, onClose, onSubmit, isSubmitting }: any) => {
  const isEdit = !!editing;
  const [form, setForm] = useState({ companyName: "", companyUrl: "", role: "", type: "REMOTE", paid: false, from: "", to: "", description: "" });

  useEffect(() => {
    if (editing) {
      setForm({
        companyName: editing.companyName ?? "",
        companyUrl: editing.companyUrl ?? "",
        role: editing.role ?? "",
        type: editing.type ?? "REMOTE",
        paid: editing.paid ?? false,
        from: editing.from ? editing.from.split("T")[0] : "",
        to: editing.to ? editing.to.split("T")[0] : "",
        description: editing.description ?? "",
      });
    } else {
      setForm({ companyName: "", companyUrl: "", role: "", type: "REMOTE", paid: false, from: "", to: "", description: "" });
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
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.teal}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={16} color={C.teal} /></div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{isEdit ? "Edit Internship" : "Add Internship"}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{isEdit ? "Update internship details" : "Submit a new internship for review"}</p>
                </div>
              </div>
              <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--pill-inactive-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} color="var(--text-muted)" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 15 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Company Name" required><input className="form-input" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} required placeholder="e.g. Google" /></Field>
                <Field label="Company URL"><input className="form-input" value={form.companyUrl} onChange={e => setForm(p => ({ ...p, companyUrl: e.target.value }))} placeholder="https://..." /></Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Role" required><input className="form-input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} required placeholder="e.g. SWE Intern" /></Field>
                <Field label="Type" required>
                  <select className="form-input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="From" required><input className="form-input" type="date" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))} required /></Field>
                <Field label="To" required><input className="form-input" type="date" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))} required /></Field>
              </div>
              <Field label="Description"><textarea className="form-input textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your role and responsibilities..." /></Field>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "var(--body-bg)", border: "1px solid var(--card-border)", cursor: "pointer" }} onClick={() => setForm(p => ({ ...p, paid: !p.paid }))}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${form.paid ? C.teal : "var(--input-border)"}`, background: form.paid ? C.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {form.paid && <CheckCircle size={11} color="#fff" />}
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Paid Internship</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Check if this internship is paid</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                <button type="button" onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: "9px 24px", borderRadius: 10, border: "none", background: C.teal, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: isSubmitting ? 0.7 : 1, boxShadow: `0 4px 14px ${C.teal}44` }}>
                  {isSubmitting && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
                  {isEdit ? "Update" : "Submit"}
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
// INTERNSHIP CARD
// ─────────────────────────────────────────────────────────────────────────────
const InternshipCard = ({ item, index, onEdit, onDelete, onFeedback }: any) => {
  const canEdit   = item.status === "PENDING";
  const canDelete = item.status === "PENDING";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "18px 20px", boxShadow: "var(--card-shadow)", display: "flex", flexDirection: "column", gap: 12, transition: "box-shadow 0.18s, transform 0.18s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C.teal}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Building2 size={17} color={C.teal} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.companyName}</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, fontWeight: 600 }}>{item.role}</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Mentor: {getMentorName(item.mentorId)}</p>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        <TypeBadge type={item.type} />
        {item.paid && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, background: `${C.emerald}14`, color: C.emerald, fontSize: 11, fontWeight: 600 }}>
            <DollarSign size={10} /> Paid
          </span>
        )}
        {item.durationDays && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, background: "var(--pill-inactive-bg)", color: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}>
            {item.durationDays} days
          </span>
        )}
      </div>

      {item.description && (
        <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.description}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "var(--text-muted)" }}>
        <Calendar size={11} />
        <span>{fmtDate(item.from)} — {fmtDate(item.to)}</span>
        {item.companyUrl && (
          <a href={item.companyUrl} target="_blank" rel="noreferrer" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, color: C.teal, textDecoration: "none", fontWeight: 600, fontSize: 11 }}>
            <Globe size={11} /> Website
          </a>
        )}
      </div>

      {item.feedback && (
        <div style={{ padding: "9px 12px", borderRadius: 10, background: `${C.rose}08`, border: `1px solid ${C.rose}25`, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          <span style={{ fontWeight: 700, color: C.rose }}>Feedback: </span>{item.feedback}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, paddingTop: 4, borderTop: "1px solid var(--table-border)" }}>
        {item.status === "REJECTED" && (
          <button onClick={() => onFeedback(item._id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: `${C.violet}14`, color: C.violet, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <MessageSquare size={12} /> Feedback
          </button>
        )}
        {canEdit && (
          <button onClick={() => onEdit(item)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: `${C.teal}14`, color: C.teal, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <Edit2 size={12} /> Edit
          </button>
        )}
        {canDelete && (
          <button onClick={() => onDelete(item)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: `${C.rose}14`, color: C.rose, fontSize: 12, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>
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
export default function InternshipsPage() {
  const {
    internships, pagination, statusFilter, typeFilter, searchQuery,
    isLoading, isSubmitting, isModalOpen, isFeedbackModalOpen,
    editingInternship, selectedFeedback,
    fetchInternships, createInternship, updateInternship, deleteInternship,
    setStatusFilter, setTypeFilter, setSearchQuery, setPage,
    openCreateModal, openEditModal, closeModal, openFeedbackModal, closeFeedbackModal,
  } = useInternshipsStore();

  const [deleteTarget, setDeleteTarget] = useState<Internship | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchInternships(); }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return internships;
    const q = searchQuery.toLowerCase();
    return internships.filter(i => i.companyName.toLowerCase().includes(q) || i.role.toLowerCase().includes(q));
  }, [internships, searchQuery]);

  const counts = useMemo(() => ({
    ALL: internships.length,
    PENDING: internships.filter(i => i.status === "PENDING").length,
    APPROVED: internships.filter(i => i.status === "APPROVED").length,
    REJECTED: internships.filter(i => i.status === "REJECTED").length,
  }), [internships]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteInternship(deleteTarget._id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleSubmit = async (form: any) => {
    if (editingInternship) await updateInternship(editingInternship._id, form);
    else await createInternship(form);
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "var(--body-bg)" }}>
        <Header subtitle="Track your internship experiences and applications." HeaderComp={
          <Button onClick={openCreateModal} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: C.teal, color: "#fff", boxShadow: `0 4px 14px ${C.teal}44` }}>
            <Plus size={15} /> Add Internship
          </Button>
        } />

        <div style={{ padding: "24px 24px 48px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Stats */}
          <div className="stats-row-i" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {[
              { label: "Total",    val: counts.ALL,      color: C.teal },
              { label: "Pending",  val: counts.PENDING,  color: C.amber },
              { label: "Approved", val: counts.APPROVED, color: C.emerald },
              { label: "Rejected", val: counts.REJECTED, color: C.rose },
            ].map(({ label, val, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 14, padding: "16px 18px", boxShadow: "var(--card-shadow)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 6px" }}>{label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{val}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "16px 20px", boxShadow: "var(--card-shadow)" }}>
            <div className="filter-wrap" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(["ALL","PENDING","APPROVED","REJECTED"] as InternshipStatusFilter[]).map(f => (
                  <Pill key={f} label={f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()} active={statusFilter === f} onClick={() => setStatusFilter(f)} count={f === "ALL" ? counts.ALL : counts[f]} color={C.teal} />
                ))}
              </div>
              <div style={{ width: 1, height: 22, background: "var(--card-border)" }} />
              <div style={{ display: "flex", gap: 6 }}>
                {(["ALL","REMOTE","ONSITE","HYBRID"] as InternshipTypeFilter[]).map(t => (
                  <Pill key={t} label={t === "ALL" ? "All Types" : t.charAt(0) + t.slice(1).toLowerCase()} active={typeFilter === t} onClick={() => setTypeFilter(t)} color={C.cyan} />
                ))}
              </div>
              <div style={{ position: "relative", maxWidth: 240, width: "100%", marginLeft: "auto" }}>
                <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input className="form-input" placeholder="Search internships..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 32 }} />
              </div>
            </div>
          </div>

          {/* Cards */}
          {isLoading ? (
            <div className="card-grid-i" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[...Array(6)].map((_, i) => <Sk key={i} h={220} style={{ borderRadius: 16 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "60px 24px", textAlign: "center", boxShadow: "var(--card-shadow)" }}>
              <Building2 size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>No internships found</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>Add your first internship experience</p>
              <button onClick={openCreateModal} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: C.teal, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Add Internship</button>
            </motion.div>
          ) : (
            <div className="card-grid-i" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {filtered.map((item, i) => (
                <InternshipCard key={item._id} item={item} index={i} onEdit={openEditModal} onDelete={setDeleteTarget} onFeedback={openFeedbackModal} />
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

      <InternshipFormModal open={isModalOpen} editing={editingInternship} onClose={closeModal} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <FeedbackModal open={isFeedbackModalOpen} feedback={selectedFeedback} onClose={closeFeedbackModal} />
      <ConfirmDialog open={!!deleteTarget} title="Delete Internship" desc={`Delete internship at "${deleteTarget?.companyName}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
    </>
  );
}
