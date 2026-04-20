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

const C = {
  blue:    "var(--piq-blue)",
  violet:  "#7C3AED",
  emerald: "#059669",
  amber:   "#D97706",
  rose:    "#E11D48",
  cyan:    "#0891B2",
  teal:    "#0D9488",
  orange:  "#EA580C",
};

const   STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: {
    label: "Pending",
    color: "#b45309",
    bg: "rgba(245, 158, 11, 0.12)",
    icon: Clock
  },

  APPROVED: {
    label: "Approved",
    color: "#047857",
    bg: "rgba(16, 185, 129, 0.12)",
    icon: CheckCircle
  },

  REJECTED: {
    label: "Rejected",
    color: "#b91c1c",
    bg: "rgba(239, 68, 68, 0.12)",
    icon: XCircle
  },
};

const TYPE_META: Record<string, { label: string; color: string; icon: any }> = {
  REMOTE: { label: "Remote", color: "var(--piq-blue)",   icon: Monitor },
  ONSITE: { label: "Onsite", color: "var(--piq-blue)", icon: Building2 },
  HYBRID: { label: "Hybrid", color: "var(--piq-blue)",   icon: Users },
};

const Sk = ({ h = 16, className = "" }: { h?: number; className?: string }) => (
  <div className={`animate-pulse bg-foreground/5 rounded-lg ${className}`} style={{ height: h }} />
);

const fmtDate = (v?: string) => {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return v; }
};

const getMentorName = (m: any) =>
  typeof m === "object" ? `${m?.firstName ?? ""} ${m?.lastName ?? ""}`.trim() : "—";

const StatusBadge = ({ status }: any) => {
  const meta = STATUS_META[status] ?? STATUS_META.PENDING;
  const Icon = meta.icon;

  return (
    <span
      style={{ background: meta.bg, color: meta.color }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase"
    >
      <Icon size={12} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
};

const TypeBadge = ({ type }: any) => {
  const meta = TYPE_META[type] ?? TYPE_META.REMOTE;
  const Icon = meta.icon;
  return (
    <span style={{ color: meta.color, background: `${meta.color}14` }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
      <Icon size={12} />{meta.label}
    </span>
  );
};

const Pill = ({ label, active, onClick, count }: any) => (
  <button onClick={onClick} className={`px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${active ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card/50 text-muted-foreground border-transparent hover:bg-foreground/5'}`}>
    {label}
    {count != null && <span className={`text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-md ${active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-foreground/10 text-muted-foreground'}`}>{count}</span>}
  </button>
);

const ConfirmDialog = ({ open, title, desc, onConfirm, onCancel, loading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onCancel}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-6 max-w-[420px] w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <AlertTriangle size={18} />
            </div>
            <p className="text-base font-display font-bold text-foreground m-0">{title}</p>
          </div>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{desc}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel} className="rounded-xl px-5 text-xs font-bold uppercase tracking-wider">Cancel</Button>
            <Button onClick={onConfirm} disabled={loading} className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-5 text-xs font-bold uppercase tracking-wider gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />} Delete
            </Button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const FeedbackModal = ({ open, feedback, onClose }: any) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl rounded-[1.5rem] w-full max-w-[480px] overflow-hidden flex flex-col">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><MessageSquare size={16} className="text-violet-600" /></div>
              <p className="text-base font-display font-bold text-foreground m-0">Mentor Feedback</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"><X size={14} className="text-muted-foreground" /></button>
          </div>
          <div className="p-6">
            {feedback ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/40 border border-border/50 rounded-xl p-3.5">
                    <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">From</p>
                    <p className="text-sm font-bold text-foreground">{feedback.mentor}</p>
                    <p className="text-[11px] text-muted-foreground">{feedback.mentorEmail}</p>
                  </div>
                  <div className="bg-background/40 border border-border/50 rounded-xl p-3.5">
                    <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">Date</p>
                    <p className="text-sm font-bold text-foreground">{fmtDate(feedback.createdAt)}</p>
                  </div>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{feedback.message}</p>
                </div>
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-6">No feedback available</p>}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Field = ({ label, required, children }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
      {label}
      {required && <span className="text-rose-500"> *</span>}
    </label>
    {children}
  </div>
);

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

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl rounded-[1.5rem] w-full max-w-[580px] overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 pb-4 flex items-center justify-between border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Building2 size={16} /></div>
                <div>
                  <p className="text-base font-display font-bold text-foreground m-0">{isEdit ? "Edit Internship" : "Add Internship"}</p>
                  <p className="text-[11px] font-mono text-muted-foreground m-0">{isEdit ? "Update internship details" : "Submit a new internship for review"}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"><X size={14} className="text-muted-foreground" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="p-6 overflow-y-auto flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Company Name" required><input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} required placeholder="e.g. Google" /></Field>
                <Field label="Company URL"><input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.companyUrl} onChange={e => setForm(p => ({ ...p, companyUrl: e.target.value }))} placeholder="https://..." /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Role" required><input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} required placeholder="e.g. SWE Intern" /></Field>
                <Field label="Type" required>
                  <select className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="From" required><input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" type="date" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))} required /></Field>
                <Field label="To" required><input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" type="date" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))} required /></Field>
              </div>
              <Field label="Description"><textarea className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y min-h-[90px]" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your role and responsibilities..." /></Field>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-background/50 border border-border/50 cursor-pointer hover:bg-foreground/5 transition-colors" onClick={() => setForm(p => ({ ...p, paid: !p.paid }))}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${form.paid ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30 bg-transparent'}`}>
                  {form.paid && <CheckCircle size={14} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground m-0">Paid Internship</p>
                  <p className="text-[11px] text-muted-foreground m-0">Check if this internship is paid</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl px-6 text-xs font-bold uppercase tracking-wider">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 text-xs font-bold uppercase tracking-wider gap-2">
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  {isEdit ? "Update" : "Submit"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const InternshipCard = ({ item, index, onEdit, onDelete, onFeedback }: any) => {
  const canEdit   = item.status === "PENDING";
  const canDelete = item.status === "PENDING";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}
      className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-display font-bold text-foreground truncate">{item.companyName}</p>
            <p className="text-[13px] font-bold text-muted-foreground truncate">{item.role}</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">Mentor: {getMentorName(item.mentorId)}</p>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="flex flex-wrap gap-2">
        <TypeBadge type={item.type} />
        {item.paid && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-foreground/5 text-muted-foreground">
            <DollarSign size={12} /> Paid
          </span>
        )}
        {item.durationDays && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-foreground/5 text-muted-foreground">
            {item.durationDays} days
          </span>
        )}
      </div>

      {item.description && (
        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 m-0">
          {item.description}
        </p>
      )}

      <div className="flex items-center gap-2.5 text-[11px] font-mono font-bold text-muted-foreground tracking-widest">
        <Calendar size={13} />
        <span className="uppercase">{fmtDate(item.from)} — {fmtDate(item.to)}</span>
        {item.companyUrl && (
          <a href={item.companyUrl} target="_blank" rel="noreferrer" className="ml-auto flex items-center gap-1.5 text-primary hover:text-primary/80 uppercase transition-colors">
            <Globe size={13} /> Website
          </a>
        )}
      </div>

      {item.feedback && (
        <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-foreground/80 leading-relaxed">
          <span className="font-bold text-rose-500 font-mono tracking-widest uppercase text-[10px]">Feedback: </span><br/>{item.feedback}
        </div>
      )}

      <div className="flex gap-2 pt-3 mt-1 border-t border-border/30">
        {item.status === "REJECTED" && (
          <button onClick={() => onFeedback(item._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 text-foreground border-none text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors hover:bg-foreground/10">
            <MessageSquare size={13} /> Feedback
          </button>
        )}
        {canEdit && (
          <button onClick={() => onEdit(item)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors hover:bg-primary/20">
            <Edit2 size={13} /> Edit
          </button>
        )}
        {canDelete && (
          <button onClick={() => onDelete(item)} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 border-none text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors hover:bg-rose-500/20">
            <Trash2 size={13} /> Delete
          </button>
        )}
      </div>
    </motion.div>
  );
};

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
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header subtitle="Track your internship experiences and applications." HeaderComp={
        <Button onClick={openCreateModal} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold uppercase tracking-wider text-[11px]">
          <Plus size={16} /> Add Internship
        </Button>
      } />

      <main className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total",    val: counts.ALL,      color: "var(--piq-blue)" },
            { label: "Pending",  val: counts.PENDING,  color: "var(--piq-blue)" },
            { label: "Approved", val: counts.APPROVED, color: "var(--piq-blue)" },
            { label: "Rejected", val: counts.REJECTED, color: "var(--piq-blue)" },
          ].map(({ label, val, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-5">
              <p className="text-[10px] font-mono font-bold text-muted-foreground tracking-[0.15em] uppercase mb-2">{label}</p>
              <p className="text-3xl font-display font-bold leading-none text-foreground">{val}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-4 flex flex-col lg:flex-row items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-4 w-full">
            <div className="flex gap-2 flex-wrap">
              {(["ALL","PENDING","APPROVED","REJECTED"] as InternshipStatusFilter[]).map(f => (
                <Pill key={f} label={f === "ALL" ? "All" : f} active={statusFilter === f} onClick={() => setStatusFilter(f)} count={f === "ALL" ? counts.ALL : counts[f]} />
              ))}
            </div>
            <div className="w-px h-6 bg-border/50 hidden md:block" />
            <div className="flex gap-2 flex-wrap">
              {(["ALL","REMOTE","ONSITE","HYBRID"] as InternshipTypeFilter[]).map(t => (
                <Pill key={t} label={t === "ALL" ? "All Types" : t} active={typeFilter === t} onClick={() => setTypeFilter(t)} />
              ))}
            </div>
          </div>
          <div className="relative w-full lg:max-w-[280px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="w-full bg-background border border-border/50 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Search internships..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <Sk key={i} h={240} className="rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl py-20 px-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4">
              <Building2 size={28} className="text-muted-foreground" />
            </div>
            <p className="text-base font-display font-bold text-foreground mb-1 mt-2">No internships found</p>
            <p className="text-sm text-muted-foreground mb-6">Add your first internship experience</p>
            <Button onClick={openCreateModal} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 font-bold uppercase tracking-wider text-xs gap-2">
              <Plus size={16} /> Add Internship
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((item, i) => (
              <InternshipCard key={item._id} item={item} index={i} onEdit={openEditModal} onDelete={setDeleteTarget} onFeedback={openFeedbackModal} />
            ))}
          </div>
        )}

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

      <InternshipFormModal open={isModalOpen} editing={editingInternship} onClose={closeModal} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <FeedbackModal open={isFeedbackModalOpen} feedback={selectedFeedback} onClose={closeFeedbackModal} />
      <ConfirmDialog open={!!deleteTarget} title="Delete Internship" desc={`Delete internship at "${deleteTarget?.companyName}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
    </div>
  );
}
