"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, Plus, Search, Edit2, Trash2, ExternalLink,
  Calendar, ChevronLeft, ChevronRight, MessageSquare,
  X, Loader2, CheckCircle, Clock, XCircle, AlertTriangle, Link,
} from "lucide-react";
import { useCertificationsStore, Certification, CertStatusFilter } from "@/store/student/certifications";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";

const C = {
  blue: "var(--piq-blue)",
  violet: "#7C3AED",
  emerald: "#059669",
  amber: "#D97706",
  rose: "#E11D48",
  cyan: "#0891B2",
  pink: "#EC4899",
  orange: "#EA580C",
};

const ACCENT = C.amber;

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

const Sk = ({ h = 16, className = "" }: { h?: number; className?: string }) => (
  <div className={`animate-pulse bg-foreground/5 rounded-lg ${className}`} style={{ height: h }} />
);

const fmtDate = (v?: string) => {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return v; }
};

const getMentorName = (m: any) => typeof m === "object" ? `${m?.firstName ?? ""} ${m?.lastName ?? ""}`.trim() : "—";

const durationDays = (from: string, to: string) => {
  try { return Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / 86400000); }
  catch { return 0; }
};

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

const Pill = ({ label, active, onClick, count }: any) => (
  <button onClick={onClick} className={`px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${active ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card/50 text-muted-foreground border-transparent hover:bg-foreground/5'}`}>
    {label}
    {count != null && <span className={`text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-md ${active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-foreground/10 text-muted-foreground'}`}>{count}</span>}
  </button>
);

const ConfirmDialog = ({ open, title, desc, onConfirm, onCancel, loading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onCancel}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}
          className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl p-6 max-w-[420px] w-full">
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
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}
          className="bg-card-glass/80 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-[1.5rem] w-full max-w-[480px] overflow-hidden flex flex-col">
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

const CertFormModal = ({ open, editing, onClose, onSubmit, isSubmitting }: any) => {
  const isEdit = !!editing;
  const [form, setForm] = useState({ title: "", platform: "", platformLink: "", from: "", to: "" });

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title ?? "",
        platform: editing.platform ?? "",
        platformLink: editing.platformLink ?? "",
        from: editing.from ? editing.from.split("T")[0] : "",
        to: editing.to ? editing.to.split("T")[0] : "",
      });
    } else {
      setForm({ title: "", platform: "", platformLink: "", from: "", to: "" });
    }
  }, [editing, open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} onClick={(e) => e.stopPropagation()}
            className="bg-card-glass/80 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-[1.5rem] w-full max-w-[540px] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 pb-4 flex items-center justify-between border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Award size={16} /></div>
                <div>
                  <p className="text-base font-display font-bold text-foreground m-0">{isEdit ? "Edit Certification" : "Add Certification"}</p>
                  <p className="text-[11px] font-mono text-muted-foreground m-0">{isEdit ? "Update certification details" : "Add a new certification for review"}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"><X size={14} className="text-muted-foreground" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="p-6 overflow-y-auto flex flex-col gap-5">
              <Field label="Certification Title" required><input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. AWS Solutions Architect" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Platform" required><input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} required placeholder="e.g. Coursera" /></Field>
                <Field label="Platform URL" required><input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={form.platformLink} onChange={e => setForm(p => ({ ...p, platformLink: e.target.value }))} required placeholder="https://..." /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Date" required><input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" type="date" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))} required /></Field>
                <Field label="End Date" required><input className="w-full bg-background border border-border/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" type="date" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))} required /></Field>
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

const CertCard = ({ item, index, onEdit, onDelete, onFeedback }: any) => {
  const days = durationDays(item.from, item.to);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}
      className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

      <div className="flex justify-between items-start gap-3 mt-1">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Award size={18} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-display font-bold text-foreground truncate">{item.title}</p>
            <p className="text-[13px] font-bold text-muted-foreground truncate">{item.platform}</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">Mentor: {getMentorName(item.mentorId)}</p>
          </div>
        </div>
        <StatusBadge status={item.feedback ? 'REJECTED' : item.status} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-foreground/5 text-muted-foreground">
          <Calendar size={12} /> {fmtDate(item.from)} — {fmtDate(item.to)}
        </span>
        {days > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-foreground/5 text-muted-foreground">{days} days</span>
        )}
      </div>

      {item.feedback && (
        <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-foreground/80 leading-relaxed">
          <span className="font-bold text-rose-500 font-mono tracking-widest uppercase text-[10px]">Feedback: </span><br />{item.feedback}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-3 mt-1 border-t border-border/30 items-center">

  <a
    href={item.platformLink}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
    bg-blue-100 text-blue-700
    hover:bg-blue-200
    dark:bg-blue-900/30 dark:text-blue-400
    text-[10px] font-bold uppercase tracking-widest transition-colors"
  >
    <Link size={13} /> View Cert
  </a>

  {item.feedback && (
    <Button
      onClick={() => onFeedback(item._id)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
      bg-muted text-muted-foreground
      hover:bg-muted/80
      text-[10px] font-bold  uppercase tracking-widest transition-colors"
    >
      <MessageSquare size={13} /> Feedback
    </Button>
  )}

  {item.status === "PENDING" && (
    <>
      <button
        onClick={() => onEdit(item)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
        bg-amber-100 text-amber-700
        hover:bg-amber-200
        dark:bg-amber-900/30 dark:text-amber-400
        text-[10px] font-bold uppercase tracking-widest transition-colors"
      >
        <Edit2 size={13} /> Edit
      </button>

      <button
        onClick={() => onDelete(item)}
        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg
        bg-rose-100 text-rose-700
        hover:bg-rose-200
        dark:bg-rose-900/30 dark:text-rose-400
        text-[10px] font-bold uppercase tracking-widest transition-colors"
      >
        <Trash2 size={13} /> Delete
      </button>
    </>
  )}

</div>
    </motion.div>
  );
};

export default function CertificationsPage() {
  const {
    certifications, pagination, statusFilter, searchQuery,
    isLoading, isSubmitting, isModalOpen, isFeedbackModalOpen,
    editingCertification, selectedFeedback,
    fetchCertifications, createCertification, updateCertification, deleteCertification,
    setStatusFilter, setSearchQuery, setPage,
    openCreateModal, openEditModal, closeModal, openFeedbackModal, closeFeedbackModal,
  } = useCertificationsStore();

  const [deleteTarget, setDeleteTarget] = useState<Certification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchCertifications(); }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return certifications;
    const q = searchQuery.toLowerCase();
    return certifications.filter(c => c.title.toLowerCase().includes(q) || c.platform.toLowerCase().includes(q));
  }, [certifications, searchQuery]);

  const counts = useMemo(() => ({
    ALL: certifications.length,
    PENDING: certifications.filter(c => c.status === "PENDING").length,
    APPROVED: certifications.filter(c => c.status === "APPROVED").length,
    REJECTED: certifications.filter(c => c.status === "REJECTED").length,
  }), [certifications]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteCertification(deleteTarget._id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleSubmit = async (form: any) => {
    if (editingCertification) await updateCertification(editingCertification._id, form);
    else await createCertification(form);
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header subtitle="Showcase your certifications and earned credentials." HeaderComp={
        <Button onClick={openCreateModal} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold uppercase tracking-wider text-[11px]">
          <Plus size={16} /> Add Certification
        </Button>
      } />

      <main className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", val: counts.ALL, color: "var(--piq-blue)" },
            { label: "Pending", val: counts.PENDING, color: "var(--piq-blue)" },
            { label: "Earned", val: counts.APPROVED, color: "var(--piq-blue)" },
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
          <div className="flex gap-2 flex-wrap w-full lg:w-auto">
            {(["ALL", "PENDING", "APPROVED", "REJECTED"] as CertStatusFilter[]).map(f => (
              <Pill key={f} label={f === "ALL" ? "All" : f === "APPROVED" ? "Earned" : f} active={statusFilter === f} onClick={() => setStatusFilter(f)} count={f === "ALL" ? counts.ALL : counts[f]} />
            ))}
          </div>
          <div className="relative w-full lg:max-w-[280px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="w-full bg-background border border-border/50 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Search certifications..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(6)].map((_, i) => <Sk key={i} h={220} className="rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl py-20 px-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4">
              <Award size={28} className="text-muted-foreground" />
            </div>
            <p className="text-base font-display font-bold text-foreground mb-1 mt-2">No certifications found</p>
            <p className="text-sm text-muted-foreground mb-6">Add your first certification</p>
            <Button onClick={openCreateModal} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 font-bold uppercase tracking-wider text-xs gap-2">
              <Plus size={16} /> Add Certification
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, i) => (
              <CertCard key={item._id} item={item} index={i} onEdit={openEditModal} onDelete={setDeleteTarget} onFeedback={openFeedbackModal} />
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

      <CertFormModal open={isModalOpen} editing={editingCertification} onClose={closeModal} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <FeedbackModal open={isFeedbackModalOpen} feedback={selectedFeedback} onClose={closeFeedbackModal} />
      <ConfirmDialog open={!!deleteTarget} title="Delete Certification" desc={`Delete "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
    </div>
  );
}
