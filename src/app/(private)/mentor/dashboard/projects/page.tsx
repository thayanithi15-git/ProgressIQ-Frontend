'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Eye, ExternalLink, X, Trash2, Github, Globe,
  Briefcase, Calendar, CheckCircle, XCircle, Loader2, AlertTriangle,
  ChevronLeft, ChevronRight, Users, Send, Clock,
} from 'lucide-react';
import { useMentorProjectsStore } from '@/store/mentor/projects';
import { useAssignedStudentsStore } from '@/store/mentor/assignedStudents';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';

// ─── TOKENS ─────────────────────────────────────────────────────────────────
const C = {
  blue:    '#3B6FD4',
  violet:  '#7C3AED',
  emerald: '#059669',
  amber:   '#D97706',
  rose:    '#E11D48',
  cyan:    '#0891B2',
  indigo:  '#6366F1',
};
const ACCENT = C.indigo;

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:     { label: 'Pending',     color: C.amber,   bg: `${C.amber}18`   },
  IN_PROGRESS: { label: 'In Progress', color: C.blue,    bg: `${C.blue}18`    },
  SUBMITTED:   { label: 'Submitted',   color: C.violet,  bg: `${C.violet}18`  },
  APPROVED:    { label: 'Approved',    color: C.emerald, bg: `${C.emerald}18` },
  REJECTED:    { label: 'Rejected',    color: C.rose,    bg: `${C.rose}18`    },
};

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  :root {
    --card-bg:#fff; --card-border:#E8EDF4; --card-shadow:0 2px 12px rgba(0,0,0,0.06);
    --body-bg:#F7F9FC; --text-primary:#1E293B; --text-secondary:#64748B; --text-muted:#94A3B8;
    --input-bg:#F8FAFC; --input-border:#E2E8F0;
    --modal-overlay:rgba(15,23,42,0.55);
    --sk-from:#EEF2F7; --sk-via:#E2E8F0;
    --pill-inactive-bg:#F1F5F9; --pill-inactive-text:#64748B;
    --table-border:#F1F5F9; --table-hover:#F8FAFC;
  }
  .dark {
    --card-bg:#1E2432; --card-border:#2A3349; --card-shadow:0 2px 12px rgba(0,0,0,0.30);
    --body-bg:#141921; --text-primary:#E8EDF8; --text-secondary:#94A3B8; --text-muted:#64748B;
    --input-bg:#252E42; --input-border:#2A3349;
    --modal-overlay:rgba(5,8,14,0.75);
    --sk-from:#1E2432; --sk-via:#252E42;
    --pill-inactive-bg:#1E2432; --pill-inactive-text:#94A3B8;
    --table-border:#1E2432; --table-hover:#1A2030;
  }
  .sk  { background:linear-gradient(90deg,var(--sk-from) 25%,var(--sk-via) 50%,var(--sk-from) 75%); background-size:200% 100%; animation:shimmer 1.6s infinite linear; border-radius:10px; }
  .fi  { width:100%; padding:10px 14px; border-radius:10px; font-size:13px; font-family:inherit; background:var(--input-bg); border:1.5px solid var(--input-border); color:var(--text-primary); outline:none; transition:border-color 0.18s,box-shadow 0.18s; box-sizing:border-box; }
  .fi:focus { border-color:${ACCENT}; box-shadow:0 0 0 3px ${ACCENT}22; }
  .fi::placeholder { color:var(--text-muted); }
  .fi.ta { resize:vertical; min-height:80px; line-height:1.6; }
  .modal-overlay { position:fixed; inset:0; background:var(--modal-overlay); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; backdrop-filter:blur(4px); }
  .modal-box { background:var(--card-bg); border:1px solid var(--card-border); border-radius:20px; width:100%; max-width:600px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.22); }
  .mtr:hover { background:var(--table-hover) !important; }
  @media(max-width:600px){ .pill-row{flex-wrap:wrap!important;} }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const Sk = ({ h = 16, style = {} }: { h?: number; style?: React.CSSProperties }) => (
  <div className="sk" style={{ height: h, ...style }} />
);

const fmt = (v?: string) => {
  if (!v) return '—';
  try { return new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return v; }
};

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const m = STATUS_META[status] ?? { label: status, color: C.amber, bg: `${C.amber}18` };
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:20, background:m.bg, color:m.color, fontSize:11, fontWeight:700 }}>{m.label}</span>;
};

// ─── PILL ────────────────────────────────────────────────────────────────────
const Pill = ({ label, active, onClick }: any) => (
  <button onClick={onClick} style={{ padding:'5px 13px', borderRadius:20, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, transition:'all 0.18s', background:active ? ACCENT : 'var(--pill-inactive-bg)', color:active ? '#fff' : 'var(--pill-inactive-text)', boxShadow:active ? `0 2px 8px ${ACCENT}40` : 'none', whiteSpace:'nowrap' }}>
    {label}
  </button>
);

// ─── CONFIRM DIALOG ──────────────────────────────────────────────────────────
const ConfirmDialog = ({ open, title, desc, onConfirm, onCancel, loading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay" onClick={onCancel}>
        <motion.div initial={{ opacity:0, scale:0.93 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.93 }}
          onClick={e => e.stopPropagation()}
          style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:18, padding:'28px', maxWidth:400, width:'100%', boxShadow:'0 24px 60px rgba(0,0,0,0.22)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:`${C.rose}18`, display:'flex', alignItems:'center', justifyContent:'center' }}><AlertTriangle size={18} color={C.rose} /></div>
            <p style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', margin:0 }}>{title}</p>
          </div>
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:22, lineHeight:1.6 }}>{desc}</p>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <button onClick={onCancel} style={{ padding:'8px 18px', borderRadius:10, border:'1.5px solid var(--card-border)', background:'transparent', color:'var(--text-secondary)', fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            <button onClick={onConfirm} disabled={loading} style={{ padding:'8px 20px', borderRadius:10, border:'none', background:C.rose, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, opacity:loading?0.7:1 }}>
              {loading && <Loader2 size={13} style={{ animation:'spin 1s linear infinite' }} />} Delete
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─── CREATE PROJECT MODAL ────────────────────────────────────────────────────
const CreateProjectModal = ({ open, onClose, onCreate, loading, students }: any) => {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [dueDate,     setDueDate]     = useState('');
  const [githubLink,  setGithubLink]  = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [selected,    setSelected]    = useState<string[]>([]);
  const [search,      setSearch]      = useState('');

  useEffect(() => { if (!open) { setTitle(''); setDescription(''); setDueDate(''); setGithubLink(''); setWebsiteLink(''); setSelected([]); setSearch(''); } }, [open]);

  const filtered = students.filter((s: any) => {
    const q = search.toLowerCase();
    return !q || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) || s.department?.toLowerCase().includes(q);
  });

  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim() || selected.length === 0) return;
    await onCreate({ title, description, dueDate: dueDate || undefined, githubLink, websiteLink, studentIds: selected });
    onClose();
  };

  const canCreate = title.trim() && description.trim() && selected.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity:0, scale:0.93, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.93, y:10 }}
            onClick={e => e.stopPropagation()} className="modal-box">
            {/* Header */}
            <div style={{ padding:'20px 22px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--card-border)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:`${ACCENT}18`, display:'flex', alignItems:'center', justifyContent:'center' }}><Briefcase size={15} color={ACCENT} /></div>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:0 }}>Assign Project</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)', margin:0 }}>Create a project and assign to students</p>
                </div>
              </div>
              <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:'none', background:'var(--pill-inactive-bg)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={13} color="var(--text-muted)" /></button>
            </div>

            <div style={{ padding:'18px 22px 24px', display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Project Title <span style={{ color:C.rose }}>*</span></label>
                <input className="fi" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. E-commerce Platform" />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Description <span style={{ color:C.rose }}>*</span></label>
                <textarea className="fi ta" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the project requirements and goals..." />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Due Date</label>
                  <input className="fi" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Website Link</label>
                  <input className="fi" value={websiteLink} onChange={e => setWebsiteLink(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>GitHub Link</label>
                <input className="fi" value={githubLink} onChange={e => setGithubLink(e.target.value)} placeholder="https://github.com/..." />
              </div>

              {/* Student Picker */}
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>Assign to Students <span style={{ color:C.rose }}>*</span></label>
                  <span style={{ fontSize:11, color:ACCENT, fontWeight:700 }}>{selected.length} selected</span>
                </div>
                <div style={{ position:'relative', marginBottom:8 }}>
                  <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                  <input className="fi" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:30 }} />
                </div>
                <div style={{ border:'1.5px solid var(--input-border)', borderRadius:10, maxHeight:180, overflowY:'auto', background:'var(--input-bg)' }}>
                  {filtered.length === 0 ? (
                    <p style={{ textAlign:'center', padding:'14px', fontSize:12, color:'var(--text-muted)' }}>No students found</p>
                  ) : filtered.map((s: any) => (
                    <label key={s.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', cursor:'pointer', borderBottom:'1px solid var(--table-border)' }}>
                      <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} style={{ width:14, height:14, accentColor:ACCENT }} />
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', margin:0 }}>{s.firstName} {s.lastName}</p>
                        <p style={{ fontSize:11, color:'var(--text-muted)', margin:0 }}>{s.department} • {s.year}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:4 }}>
                <button onClick={onClose} style={{ padding:'9px 18px', borderRadius:10, border:'1.5px solid var(--card-border)', background:'transparent', color:'var(--text-secondary)', fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
                <button onClick={handleCreate} disabled={loading || !canCreate}
                  style={{ padding:'9px 22px', borderRadius:10, border:'none', background:ACCENT, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, opacity:(loading || !canCreate)?0.6:1, boxShadow:`0 4px 12px ${ACCENT}44` }}>
                  {loading && <Loader2 size={13} style={{ animation:'spin 1s linear infinite' }} />} Assign Project
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── PROJECT DETAIL MODAL ────────────────────────────────────────────────────
const ProjectDetailModal = ({ project, onClose, onVerify, loading }: any) => {
  const [vNote,   setVNote]   = useState('');
  const [vPoints, setVPoints] = useState(0);

  useEffect(() => { if (project) { setVNote(''); setVPoints(0); } }, [project]);

  if (!project) return null;

  const canVerify = project.status === 'SUBMITTED';
  const p = project;

  const handleVerify = async (status: 'APPROVED' | 'REJECTED') => {
    await onVerify(p.id, status, vNote, vPoints);
    onClose();
  };

  return (
    <AnimatePresence>
      {project && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity:0, scale:0.93 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.93 }}
            onClick={e => e.stopPropagation()} className="modal-box" style={{ maxWidth:620 }}>
            {/* Header */}
            <div style={{ padding:'20px 22px 16px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', borderBottom:'1px solid var(--card-border)' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', margin:'0 0 4px' }}>{p.title}</p>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>by <strong style={{ color:'var(--text-secondary)' }}>{p.student?.name || 'Unknown'}</strong></span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
              <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:'none', background:'var(--pill-inactive-bg)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><X size={13} color="var(--text-muted)" /></button>
            </div>

            <div style={{ padding:'18px 22px 24px', display:'flex', flexDirection:'column', gap:12 }}>
              {/* Student info */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div style={{ padding:'11px 13px', borderRadius:11, background:'var(--body-bg)', border:'1px solid var(--card-border)' }}>
                  <p style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 3px' }}>Student</p>
                  <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', margin:0 }}>{p.student?.name}</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)', margin:0 }}>{p.student?.department} • {p.student?.year}</p>
                </div>
                <div style={{ padding:'11px 13px', borderRadius:11, background:'var(--body-bg)', border:'1px solid var(--card-border)' }}>
                  <p style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 3px' }}>Completed At</p>
                  <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', margin:0 }}>{fmt(p.links?.completedAt ?? p.createdDate)}</p>
                  {p.pointsAwarded > 0 && <p style={{ fontSize:11, color:C.emerald, fontWeight:700, margin:0 }}>+{p.pointsAwarded} pts awarded</p>}
                </div>
              </div>

              {/* Description */}
              <div style={{ padding:'11px 13px', borderRadius:11, background:'var(--body-bg)', border:'1px solid var(--card-border)' }}>
                <p style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 5px' }}>Description</p>
                <p style={{ fontSize:13, color:'var(--text-secondary)', margin:0, lineHeight:1.65 }}>{p.description}</p>
              </div>

              {/* Links */}
              {(p.links?.github || p.links?.website) && (
                <div style={{ display:'flex', gap:8 }}>
                  {p.links?.github && (
                    <a href={p.links.github} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:8, background:`${C.blue}12`, color:C.blue, fontSize:12, fontWeight:600, textDecoration:'none' }}>
                      <Github size={12} /> GitHub
                    </a>
                  )}
                  {p.links?.website && (
                    <a href={p.links.website} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:8, background:`${C.cyan}12`, color:C.cyan, fontSize:12, fontWeight:600, textDecoration:'none' }}>
                      <Globe size={12} /> Website
                    </a>
                  )}
                </div>
              )}

              {/* Submission Note */}
              {p.submissionNote && (
                <div style={{ padding:'11px 13px', borderRadius:11, background:`${C.amber}08`, border:`1px solid ${C.amber}22` }}>
                  <p style={{ fontSize:10, fontWeight:700, color:C.amber, textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 5px' }}>Student's Submission Note</p>
                  <p style={{ fontSize:13, color:'var(--text-secondary)', margin:0, lineHeight:1.65, whiteSpace:'pre-wrap' }}>{p.submissionNote}</p>
                </div>
              )}

              {/* Previous verification */}
              {p.verificationNote && (
                <div style={{ padding:'11px 13px', borderRadius:11, background:`${C.emerald}08`, border:`1px solid ${C.emerald}22` }}>
                  <p style={{ fontSize:10, fontWeight:700, color:C.emerald, textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 5px' }}>Your Previous Feedback</p>
                  <p style={{ fontSize:13, color:'var(--text-secondary)', margin:0, lineHeight:1.65, whiteSpace:'pre-wrap' }}>{p.verificationNote}</p>
                </div>
              )}

              {/* Verify Section */}
              {canVerify && (
                <div style={{ borderTop:'1px solid var(--card-border)', paddingTop:16, display:'flex', flexDirection:'column', gap:12 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', margin:0 }}>Verify Submission</p>
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Feedback / Note</label>
                    <textarea className="fi ta" value={vNote} onChange={e => setVNote(e.target.value)} placeholder="Provide feedback on the student's project..." />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', display:'block', marginBottom:5 }}>Award Points</label>
                    <input className="fi" type="number" min={0} value={vPoints || ''} onChange={e => setVPoints(parseInt(e.target.value)||0)} placeholder="e.g. 100" style={{ maxWidth:160 }} />
                  </div>
                  <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                    <button onClick={() => handleVerify('REJECTED')} disabled={loading}
                      style={{ padding:'9px 20px', borderRadius:10, border:'none', background:`${C.rose}18`, color:C.rose, fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, opacity:loading?0.7:1 }}>
                      {loading && <Loader2 size={13} style={{ animation:'spin 1s linear infinite' }} />} Reject
                    </button>
                    <button onClick={() => handleVerify('APPROVED')} disabled={loading}
                      style={{ padding:'9px 22px', borderRadius:10, border:'none', background:C.emerald, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, opacity:loading?0.7:1, boxShadow:`0 4px 12px ${C.emerald}40` }}>
                      {loading && <Loader2 size={13} style={{ animation:'spin 1s linear infinite' }} />} Approve &amp; Award
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function MentorProjectsPage() {
  const {
    projects, searchQuery, statusFilter, page, totalPages, total,
    isLoading, isSubmitting,
    fetchProjects, setSearchQuery, setStatusFilter, setPage, resetFilters,
    createProject, deleteProject, verifyProject, notifyStudents
  } = useMentorProjectsStore();

  const { students, fetchStudents } = useAssignedStudentsStore();

  const [searchDraft,      setSearchDraft]      = useState(searchQuery);
  const [createOpen,       setCreateOpen]       = useState(false);
  const [selectedProject,  setSelectedProject]  = useState<any>(null);
  const [deleteTarget,     setDeleteTarget]     = useState<any>(null);
  const [isDeleting,       setIsDeleting]       = useState(false);

  const STATUS_PILLS = [
    { val: '',            label: 'All'         },
    { val: 'PENDING',     label: 'Pending'     },
    { val: 'IN_PROGRESS', label: 'In Progress' },
    { val: 'SUBMITTED',   label: 'Submitted'   },
    { val: 'APPROVED',    label: 'Approved'    },
    { val: 'REJECTED',    label: 'Rejected'    },
  ];

  useEffect(() => { fetchProjects(); fetchStudents(); }, []);

  const pendingReview = projects.filter((p: any) => p.status === 'SUBMITTED').length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteProject(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const hasFilters = searchQuery || statusFilter;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width:'100%', minHeight:'100vh', background:'var(--body-bg)' }}>
        <Header subtitle="Assign projects to students and verify their submissions." HeaderComp={
          <Button onClick={() => setCreateOpen(true)}
            style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, background:ACCENT, color:'#fff', boxShadow:`0 4px 12px ${ACCENT}44` }}>
            <Plus size={14} /> Assign Project
          </Button>
        } />

        <div style={{ padding:'22px 22px 48px', display:'flex', flexDirection:'column', gap:18 }}>

          {/* Review alert */}
          {pendingReview > 0 && (
            <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
              style={{ padding:'12px 18px', borderRadius:12, background:`${C.violet}10`, border:`1.5px solid ${C.violet}30`, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:`${C.violet}20`, display:'flex', alignItems:'center', justifyContent:'center' }}><Send size={14} color={C.violet} /></div>
              <p style={{ fontSize:13, fontWeight:700, color:C.violet, margin:0 }}>{pendingReview} project{pendingReview > 1 ? 's' : ''} awaiting your review</p>
            </motion.div>
          )}

          {/* Filters */}
          <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:16, padding:'14px 18px', boxShadow:'var(--card-shadow)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
            <div className="pill-row" style={{ display:'flex', gap:6, flexWrap:'wrap', flex:1 }}>
              {STATUS_PILLS.map(p => <Pill key={p.val} label={p.label} active={statusFilter === p.val} onClick={() => setStatusFilter(p.val)} />)}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ position:'relative', maxWidth:240, width:'100%' }}>
                <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
                <input className="fi" placeholder="Search projects..." value={searchDraft}
                  onChange={e => setSearchDraft(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setSearchQuery(searchDraft)}
                  style={{ paddingLeft:30 }} />
              </div>
              {hasFilters && (
                <button onClick={() => { resetFilters(); setSearchDraft(''); }}
                  style={{ padding:'8px 12px', borderRadius:10, border:'1.5px solid var(--card-border)', background:'transparent', color:'var(--text-secondary)', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}>
                  <X size={12} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:16, boxShadow:'var(--card-shadow)', overflow:'hidden' }}>
            {isLoading ? (
              <div style={{ padding:18, display:'flex', flexDirection:'column', gap:10 }}>
                {Array.from({ length:5 }).map((_, i) => <Sk key={i} h={52} style={{ borderRadius:10 }} />)}
              </div>
            ) : projects.length === 0 ? (
              <div style={{ padding:'56px 24px', textAlign:'center' }}>
                <Briefcase size={38} color="var(--text-muted)" style={{ marginBottom:12 }} />
                <p style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', marginBottom:6 }}>No projects found</p>
                <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:20 }}>Assign a project to your students to get started</p>
                <button onClick={() => setCreateOpen(true)}
                  style={{ padding:'9px 22px', borderRadius:10, border:'none', background:ACCENT, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:`0 4px 12px ${ACCENT}44` }}>
                  + Assign Project
                </button>
              </div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'var(--body-bg)', borderBottom:'1px solid var(--table-border)' }}>
                      {['#','Project','Student','Submitted','Status','Actions'].map(h => (
                        <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj: any, i: number) => {
                      const needsReview = proj.status === 'SUBMITTED';
                      return (
                        <motion.tr key={proj.id} className="mtr" initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.025 }}
                          style={{ borderBottom:'1px solid var(--table-border)', transition:'background 0.14s', cursor:'pointer' }}
                          onClick={() => setSelectedProject(proj)}>
                          <td style={{ padding:'12px 14px', fontSize:12, fontWeight:700, color:'var(--text-muted)', width:40 }}>{((page-1)*20)+i+1}</td>
                          <td style={{ padding:'12px 14px', minWidth:200 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <div style={{ width:30, height:30, borderRadius:8, background:`${ACCENT}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <Briefcase size={13} color={ACCENT} />
                              </div>
                              <div style={{ minWidth:0 }}>
                                <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:240 }}>{proj.title}</p>
                                {(proj.links?.github || proj.links?.website) && (
                                  <div style={{ display:'flex', gap:6, marginTop:2 }}>
                                    {proj.links?.github  && <a href={proj.links.github}  target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize:10, color:C.blue,  fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:2 }}><Github size={9} /> GitHub</a>}
                                    {proj.links?.website && <a href={proj.links.website} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize:10, color:C.cyan,  fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:2 }}><Globe  size={9} /> Website</a>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'12px 14px' }}>
                            <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', margin:0 }}>{proj.student?.name}</p>
                            <p style={{ fontSize:11, color:'var(--text-muted)', margin:0 }}>{proj.student?.department}</p>
                          </td>
                          <td style={{ padding:'12px 14px', whiteSpace:'nowrap' }}>
                            <span style={{ fontSize:12, color:'var(--text-secondary)', fontWeight:500 }}>{fmt(proj.createdDate)}</span>
                          </td>
                          <td style={{ padding:'12px 14px' }}>
                            <StatusBadge status={proj.status} />
                            {needsReview && <p style={{ fontSize:10, color:C.violet, fontWeight:700, margin:'2px 0 0' }}>Needs Review</p>}
                          </td>
                          <td style={{ padding:'12px 14px' }}>
                            <div style={{ display:'flex', gap:5, alignItems:'center' }} onClick={e => e.stopPropagation()}>
                              {needsReview ? (
                                <button onClick={() => setSelectedProject(proj)}
                                  style={{ padding:'5px 10px', borderRadius:7, border:'none', background:`${C.emerald}18`, color:C.emerald, fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                                  <CheckCircle size={11} /> Verify
                                </button>
                              ) : (
                                <button onClick={() => setSelectedProject(proj)}
                                  style={{ padding:'5px 10px', borderRadius:7, border:'none', background:`${ACCENT}14`, color:ACCENT, fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                                  <Eye size={11} /> View
                                </button>
                              )}
                              {proj.status === 'PENDING' && (
                                <button onClick={() => setDeleteTarget(proj)}
                                  style={{ padding:'5px 8px', borderRadius:7, border:'none', background:`${C.rose}14`, color:C.rose, fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center' }}>
                                  <Trash2 size={11} />
                                </button>
                              )}
                              {(proj.status === 'PENDING' || proj.status === 'IN_PROGRESS' || proj.status === 'REJECTED') && (
                                <button onClick={() => {
                                  const msg = window.prompt('Enter reminder message for students:', `Reminder: Your project "${proj.title}" is due soon!`);
                                  if (msg) notifyStudents(proj.id, msg);
                                }}
                                  style={{ padding:'5px 10px', borderRadius:7, border:'none', background:'rgba(59,130,246,0.1)', color:'#3B82F6', fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                                  <Bell size={11} /> Notify
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <p style={{ fontSize:13, color:'var(--text-secondary)', margin:0 }}>Showing {projects.length} of {total} projects</p>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  style={{ padding:'7px 14px', borderRadius:8, border:'1.5px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-secondary)', cursor:page===1?'not-allowed':'pointer', opacity:page===1?0.5:1, display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:600 }}>
                  <ChevronLeft size={13} /> Prev
                </button>
                <span style={{ padding:'7px 12px', fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>Page {page} / {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                  style={{ padding:'7px 14px', borderRadius:8, border:'1.5px solid var(--card-border)', background:'var(--card-bg)', color:'var(--text-secondary)', cursor:page===totalPages?'not-allowed':'pointer', opacity:page===totalPages?0.5:1, display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:600 }}>
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal  open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createProject} loading={isSubmitting} students={students} />
      <ProjectDetailModal  project={selectedProject} onClose={() => setSelectedProject(null)} onVerify={verifyProject} loading={isSubmitting} />
      <ConfirmDialog       open={!!deleteTarget} title="Delete Project" desc={`Delete "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={isDeleting} />
    </>
  );
}