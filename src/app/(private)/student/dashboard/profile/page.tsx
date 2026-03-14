"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Calendar, BookOpen, Award,
  Building2, Edit2, Save, X, Loader2, CheckCircle,
  Star, GraduationCap, UserCheck, Heart, Shield, AlertCircle,
  Briefcase, Clock, Hash, ChevronRight,
  Github, Linkedin, Link2, Code, Terminal, Globe, Zap
} from "lucide-react";
import { useProfileStore, UpdateProfilePayload, SocialLinks } from "@/store/student/profile";
import Header from "@/components/layout/header";

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
  pink:    "#DB2777",
  teal:    "#0D9488",
  slate:   "#475569",
};

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  :root {
    --card-bg:#fff; --card-border:#E8EDF4; --card-shadow:0 2px 12px rgba(0,0,0,0.06);
    --body-bg:#F7F9FC; --text-primary:#1E293B; --text-secondary:#64748B; --text-muted:#94A3B8;
    --inp-bg:#F8FAFC; --inp-border:#E2E8F0;
    --sk-from:#EEF2F7; --sk-via:#E2E8F0;
    --divider:#F1F5F9;
  }
  .dark {
    --card-bg:#1E2432; --card-border:#2A3349; --card-shadow:0 2px 18px rgba(0,0,0,0.35);
    --body-bg:#141921; --text-primary:#E8EDF8; --text-secondary:#94A3B8; --text-muted:#64748B;
    --inp-bg:#252E42; --inp-border:#2A3349;
    --sk-from:#1E2432; --sk-via:#252E42;
    --divider:#1E2432;
  }
  .sk { background:linear-gradient(90deg,var(--sk-from) 25%,var(--sk-via) 50%,var(--sk-from) 75%); background-size:200% 100%; animation:shimmer 1.6s infinite linear; border-radius:10px; }
  .edit-input {
    width:100%; padding:9px 13px; border-radius:10px; font-size:13px; font-family:inherit;
    background:var(--inp-bg); border:1.5px solid var(--inp-border); color:var(--text-primary);
    outline:none; transition:border-color .18s,box-shadow .18s;
  }
  .edit-input:focus { border-color:${C.blue}; box-shadow:0 0 0 3px ${C.blue}1F; }
  .edit-input::placeholder { color:var(--text-muted); }
  .info-row { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid var(--divider); }
  .info-row:last-child { border-bottom:none; }

  @media(max-width:1024px){ .profile-layout{grid-template-columns:1fr!important;} }
  @media(max-width:680px){ .hero-inner{flex-direction:column!important;align-items:flex-start!important;} .stats-row-p{grid-template-columns:repeat(2,1fr)!important;} .edit-grid{grid-template-columns:1fr!important;} }
  @media(max-width:460px){ .stats-row-p{grid-template-columns:1fr!important;} }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const Sk = ({ w = "100%", h = 16, style = {} }: any) =>
  <div className="sk" style={{ width: w, height: h, ...style }} />;

const fmtDate = (v?: string) => {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return v; }
};

const initials = (f?: string, l?: string) =>
  `${(f ?? " ")[0]}${(l ?? " ")[0]}`.toUpperCase();

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CARD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const SectionCard = ({ title, icon: Icon, color, children, delay = 0, action }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    style={{
      background: "var(--card-bg)", border: "1px solid var(--card-border)",
      borderRadius: 18, boxShadow: "var(--card-shadow)", overflow: "hidden",
    }}
  >
    {/* Section header */}
    <div style={{
      padding: "16px 22px", borderBottom: "1px solid var(--divider)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}16`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color={color} />
        </div>
        <p style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{title}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
    <div style={{ padding: "6px 22px 18px" }}>{children}</div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// INFO ROW
// ─────────────────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value, color = "var(--text-muted)", link = false }: any) => (
  <div className="info-row">
    <div style={{ width: 30, height: 30, borderRadius: 8, background: `var(--body-bg)`, border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
      <Icon size={13} color={color} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: ".05em", textTransform: "uppercase", margin: "0 0 2px" }}>{label}</p>
      {link && value ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: C.blue, textDecoration: 'none', margin: 0, wordBreak: "break-word", display: "flex", alignItems: "center", gap: 4 }}>
          {value} <Link2 size={12} />
        </a>
      ) : (
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0, wordBreak: "break-word" }}>
          {value || <span style={{ color: "var(--text-muted)", fontWeight: 400, fontStyle: "italic" }}>Not provided</span>}
        </p>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// EDIT FORM FIELD
// ─────────────────────────────────────────────────────────────────────────────
const FormField = ({ label, required, children }: any) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: ".04em", textTransform: "uppercase" }}>
      {label}{required && <span style={{ color: C.rose }}> *</span>}
    </label>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
const ProfileSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <Sk h={200} style={{ borderRadius: 20 }} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Sk h={280} style={{ borderRadius: 18 }} />
      <Sk h={280} style={{ borderRadius: 18 }} />
      <Sk h={200} style={{ borderRadius: 18 }} />
      <Sk h={200} style={{ borderRadius: 18 }} />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// HERO BANNER
// ─────────────────────────────────────────────────────────────────────────────
const ProfileHero = ({ profile, onEdit }: any) => {
  const pi = profile.personalInfo;
  const ai = profile.academicInfo;
  const ach = profile.achievementInfo;

  const statusMeta: Record<string, { color: string; bg: string }> = {
    ACTIVE:    { color: C.emerald, bg: `${C.emerald}18` },
    INACTIVE:  { color: C.rose,    bg: `${C.rose}18`    },
    SUSPENDED: { color: C.amber,   bg: `${C.amber}18`   },
  };
  const st = statusMeta[pi.status?.toUpperCase()] ?? statusMeta.ACTIVE;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{
        background: "linear-gradient(135deg,#0F1B35 0%,#1A2540 55%,#0D2040 100%)",
        borderRadius: 22, padding: "28px 32px",
        position: "relative", overflow: "hidden",
        boxShadow: "0 16px 48px rgba(0,0,0,0.28)",
      }}>
        {/* Decorative circles */}
        {[
          { size: 200, right: -50, top: -50, opacity: 0.07 },
          { size: 140, right: 100, bottom: -70, opacity: 0.05 },
          { size: 100, left: -20,  bottom: -40, opacity: 0.04 },
        ].map((circle, i) => (
          <div key={i} style={{
            position: "absolute", width: circle.size, height: circle.size,
            borderRadius: "50%", background: "rgba(99,102,241,1)",
            opacity: circle.opacity, pointerEvents: "none",
            right: circle.right, top: circle.top, left: circle.left, bottom: circle.bottom,
          }} />
        ))}

        {/* Main row */}
        <div className="hero-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 22, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Avatar */}
            <div style={{
              width: 76, height: 76, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg,${C.blue},${C.violet})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 900, color: "#fff",
              boxShadow: `0 0 0 4px rgba(255,255,255,0.12), 0 8px 24px ${C.blue}44`,
            }}>
              {initials(pi.firstName, pi.lastName)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
                  {pi.firstName} {pi.lastName}
                </h1>
                <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: st.bg, color: st.color }}>
                  {pi.status || "Active"}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 4px" }}>{pi.email}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", margin: 0 }}>
                {ai.department} &bull; {ai.year} Year &bull; {ai.academicYear}
              </p>
            </div>
          </div>
          {/* Edit btn */}
          <button onClick={onEdit}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 11, border: "1.5px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", backdropFilter: "blur(4px)", flexShrink: 0 }}>
            <Edit2 size={14} /> Edit Profile
          </button>
        </div>

        {/* Stats bar */}
        <div className="stats-row-p" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 24 }}>
          {[
            { label: "Reward Points", value: ach.rewardPoints.toLocaleString(), icon: <Zap size={14} fill={C.amber} />, color: C.amber },
            { label: "Department",    value: ai.department,                      icon: "🏛️", color: C.cyan },
            { label: "Year",          value: ai.year + " Year",                  icon: "📅", color: C.violet },
            { label: "Academic Year", value: ai.academicYear,                    icon: "🎓", color: C.emerald },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{ padding: "12px 14px", borderRadius: 13, background: "rgba(255,255,255,0.07)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.38)", letterSpacing: ".06em", textTransform: "uppercase", margin: 0 }}>{label}</p>
              </div>
              <p style={{ fontSize: 17, fontWeight: 900, color, margin: 0, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || "—"}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT PROFILE MODAL
// ─────────────────────────────────────────────────────────────────────────────
const EditModal = ({ isOpen, editForm, setField, onSave, onCancel, isUpdating }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(5px)" }}
        onClick={onCancel}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          onClick={e => e.stopPropagation()}
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 20, width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.28)" }}
        >
          {/* Modal header */}
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.blue}16`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Edit2 size={16} color={C.blue} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Edit Profile</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Name & email cannot be changed</p>
              </div>
            </div>
            <button onClick={onCancel}
              style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--body-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} color="var(--text-muted)" />
            </button>
          </div>

          {/* Form */}
          <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Personal */}
            <p style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", letterSpacing: ".06em", textTransform: "uppercase", margin: 0 }}>Personal Details</p>
            <div className="edit-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Gender">
                <select className="edit-input" value={editForm.gender ?? ""} onChange={e => setField("gender", e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </FormField>
              <FormField label="Date of Birth">
                <input className="edit-input" type="date" value={editForm.dob ?? ""} onChange={e => setField("dob", e.target.value)} />
              </FormField>
              <FormField label="Phone Number">
                <input className="edit-input" placeholder="e.g. 9876543210" value={editForm.phone ?? ""} onChange={e => setField("phone", e.target.value)} />
              </FormField>
              <FormField label="Place / City">
                <input className="edit-input" placeholder="e.g. Chennai" value={editForm.place ?? ""} onChange={e => setField("place", e.target.value)} />
              </FormField>
            </div>

            {/* Family */}
            <p style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", letterSpacing: ".06em", textTransform: "uppercase", margin: "4px 0 0" }}>Family Details</p>
            <div className="edit-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Parent / Guardian Name">
                <input className="edit-input" placeholder="Parent's full name" value={editForm.parentName ?? ""} onChange={e => setField("parentName", e.target.value)} />
              </FormField>
              <FormField label="Parent Phone">
                <input className="edit-input" placeholder="e.g. 9876543210" value={editForm.parentPhone ?? ""} onChange={e => setField("parentPhone", e.target.value)} />
              </FormField>
              <FormField label="Family Income">
                <input className="edit-input" placeholder="e.g. 5,00,000 PA" value={editForm.familyIncome ?? ""} onChange={e => setField("familyIncome", e.target.value)} />
              </FormField>
            </div>

            {/* Academic Extras */}
            <p style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", letterSpacing: ".06em", textTransform: "uppercase", margin: "4px 0 0" }}>Academic Details</p>
            <div className="edit-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Roll Number">
                <input className="edit-input" placeholder="Roll No" value={editForm.rollNo ?? ""} onChange={e => setField("rollNo", e.target.value)} />
              </FormField>
              <FormField label="CGPA">
                <input className="edit-input" type="number" step="0.01" value={editForm.cgpa ?? 0} onChange={e => setField("cgpa", parseFloat(e.target.value) || 0)} />
              </FormField>
              <FormField label="Arrear Count">
                <input className="edit-input" type="number" value={editForm.arrearCount ?? 0} onChange={e => setField("arrearCount", parseInt(e.target.value) || 0)} />
              </FormField>
            </div>

            <FormField label="Good At (comma separated)">
              <input className="edit-input" placeholder="e.g. Fullstack, AI, DSA" value={editForm.goodAt?.join(", ") || ""} onChange={e => setField("goodAt", e.target.value.split(",").map(sh => sh.trim()).filter(sh => sh))} />
            </FormField>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 6, borderTop: "1px solid var(--divider)" }}>
              <button onClick={onCancel}
                style={{ padding: "9px 22px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={onSave} disabled={isUpdating}
                style={{ padding: "9px 26px", borderRadius: 10, border: "none", background: C.blue, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, opacity: isUpdating ? 0.7 : 1, boxShadow: `0 4px 16px ${C.blue}44` }}>
                {isUpdating ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={13} />}
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// EDIT SOCIALS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const EditSocialsModal = ({ isOpen, form, setField, onSave, onCancel, isUpdating }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(5px)" }}
        onClick={onCancel}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          onClick={e => e.stopPropagation()}
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 20, width: "100%", maxWidth: 500, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.28)" }}
        >
          {/* Modal header */}
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.indigo}16`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Globe size={16} color={C.indigo} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Social Profiles</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Add your online portfolios and links</p>
              </div>
            </div>
            <button onClick={onCancel}
              style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--body-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} color="var(--text-muted)" />
            </button>
          </div>

          {/* Form */}
          <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            
            <FormField label="LinkedIn URL">
              <input className="edit-input" placeholder="https://linkedin.com/in/username" value={form.linkedin ?? ""} onChange={e => setField("linkedin", e.target.value)} />
            </FormField>
            <FormField label="GitHub URL">
              <input className="edit-input" placeholder="https://github.com/username" value={form.github ?? ""} onChange={e => setField("github", e.target.value)} />
            </FormField>
            <FormField label="LeetCode URL">
              <input className="edit-input" placeholder="https://leetcode.com/u/username" value={form.leetcode ?? ""} onChange={e => setField("leetcode", e.target.value)} />
            </FormField>
            <FormField label="CodeChef URL">
              <input className="edit-input" placeholder="https://codechef.com/users/username" value={form.codechef ?? ""} onChange={e => setField("codechef", e.target.value)} />
            </FormField>
            <FormField label="Personal Portfolio URL">
              <input className="edit-input" placeholder="https://username.dev" value={form.portfolio ?? ""} onChange={e => setField("portfolio", e.target.value)} />
            </FormField>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 6, borderTop: "1px solid var(--divider)", marginTop: 8 }}>
              <button onClick={onCancel}
                style={{ padding: "9px 22px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={onSave} disabled={isUpdating}
                style={{ padding: "9px 26px", borderRadius: 10, border: "none", background: C.indigo, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, opacity: isUpdating ? 0.7 : 1, boxShadow: `0 4px 16px ${C.indigo}44` }}>
                {isUpdating ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={13} />}
                Save Links
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const {
    profile, socials, isLoading, isUpdating, isEditMode, editForm, isSocialsEditMode, socialsForm,
    fetchProfile, updateProfile, setEditMode, setEditField, cancelEdit,
    setSocialsEditMode, setSocialsField, updateSocials
  } = useProfileStore() as any; // Cast as any to bypass temporary type issues if store was just updated

  useEffect(() => { fetchProfile(); }, []);

  const handleSaveProfile = () => {
    const payload: UpdateProfilePayload = {};
    (Object.keys(editForm) as (keyof UpdateProfilePayload)[]).forEach(key => {
      if (editForm[key] !== undefined && editForm[key] !== "") {
        (payload as any)[key] = editForm[key];
      }
    });
    updateProfile(payload);
  };

  const handleSaveSocials = () => {
    updateSocials(socialsForm);
  };

  if (isLoading) return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "var(--body-bg)" }}>
        <Header subtitle="Your complete profile details." />
        <div style={{ padding: "24px 24px 56px" }}><ProfileSkeleton /></div>
      </div>
    </>
  );

  if (!profile) return null;

  const { personalInfo: pi, familyInfo: fi, academicInfo: ai, achievementInfo: ach, mentorInfo: mi, accountInfo: acc } = profile;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "var(--body-bg)" }}>
        <Header subtitle="Your complete student profile." />

        <div style={{ padding: "24px 24px 56px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Hero */}
          <ProfileHero profile={profile} onEdit={() => setEditMode(true)} />

          {/* ── 2-col layout */}
          <div className="profile-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

            {/* ── Personal Info */}
            <SectionCard title="Personal Information" icon={User} color={C.blue} delay={0.06}>
              <InfoRow icon={Mail}     label="Email Address" value={pi.email}  color={C.blue} />
              <InfoRow icon={Phone}    label="Phone Number"  value={pi.phone}  color={C.cyan} />
              <InfoRow icon={MapPin}   label="Location"      value={pi.place}  color={C.rose} />
              <InfoRow icon={Calendar} label="Date of Birth" value={fmtDate(pi.dob)} color={C.violet} />
              <InfoRow icon={User}     label="Gender"        value={pi.gender} color={C.indigo} />
              <InfoRow icon={Shield}   label="Account Status"
                value={
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: pi.status === "ACTIVE" ? `${C.emerald}18` : `${C.rose}18`, color: pi.status === "ACTIVE" ? C.emerald : C.rose }}>
                    {pi.status || "Active"}
                  </span>
                }
                color={C.emerald}
              />
            </SectionCard>

            {/* ── Academic Info */}
            <div>
              <SectionCard title="Academic Information" icon={GraduationCap} color={C.violet} delay={0.09}>
                <InfoRow icon={Building2}  label="Department"    value={ai.department}  color={C.violet} />
                <InfoRow icon={BookOpen}   label="Current Year"  value={ai.year}        color={C.blue} />
                <InfoRow icon={Calendar}   label="Academic Year" value={ai.academicYear} color={C.cyan} />
                <InfoRow icon={Hash}       label="Roll Number"   value={ai.rollNo}      color={C.slate} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <InfoRow icon={Star}       label="CGPA"          value={ai.cgpa || "0.00"} color={C.blue} />
                  <InfoRow icon={AlertCircle} label="Arrears"      value={ai.arrearCount || "0"} color={ai.arrearCount > 0 ? C.rose : C.emerald} />
                </div>
                <InfoRow icon={Zap}        label="Reward Points"
                  value={
                    <span style={{ fontSize: 16, fontWeight: 900, background: `linear-gradient(135deg,${C.amber},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {ach.rewardPoints.toLocaleString()} pts
                    </span>
                  }
                  color={C.amber}
                />
              </SectionCard>

              {/* ── Good At */}
              {ai.goodAt && ai.goodAt.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <SectionCard title="Areas of Expertise" icon={CheckCircle} color={C.emerald} delay={0.10}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 10 }}>
                      {ai.goodAt.map((skill: string, idx: number) => (
                        <span key={idx} style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20, background: "var(--body-bg)", border: "1px solid var(--card-border)", color: "var(--text-primary)" }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              )}

              {/* ── Social Profiles */}
              <div style={{ marginTop: 18 }}>
                <SectionCard 
                  title="Online Profiles" 
                  icon={Globe} 
                  color={C.indigo} 
                  delay={0.11}
                  action={
                    <button onClick={() => setSocialsEditMode(true)}
                      style={{ background: "transparent", border: "none", color: C.indigo, fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <Edit2 size={12} /> Edit
                    </button>
                  }
                >
                  <InfoRow icon={Linkedin} label="LinkedIn"  value={socials?.linkedin} color="#0A66C2" link />
                  <InfoRow icon={Github}   label="GitHub"    value={socials?.github} color="#181717" link />
                  <InfoRow icon={Code}     label="LeetCode"  value={socials?.leetcode} color="#FFA116" link />
                  <InfoRow icon={Terminal} label="CodeChef"  value={socials?.codechef} color="#5B4638" link />
                  <InfoRow icon={Link2}    label="Portfolio" value={socials?.portfolio} color={C.teal} link />
                </SectionCard>
              </div>
            </div>

            {/* ── Family Info */}
            <SectionCard title="Family Information" icon={Heart} color={C.pink} delay={0.12}>
              <InfoRow icon={User}  label="Parent / Guardian" value={fi.parentName}  color={C.pink} />
              <InfoRow icon={Phone} label="Parent Phone"      value={fi.parentPhone} color={C.rose} />
              <InfoRow icon={Award} label="Family Income"     value={fi.familyIncome} color={C.amber} />
            </SectionCard>

            {/* ── Account Info */}
            <SectionCard title="Account Details" icon={Shield} color={C.teal} delay={0.13}>
              <InfoRow icon={Clock}    label="Joined On"     value={fmtDate(acc.createdAt)}   color={C.teal} />
              <InfoRow icon={Clock}    label="Last Updated"  value={fmtDate(acc.lastUpdated)} color={C.cyan} />
              <InfoRow icon={Hash}     label="Student ID"    value={pi.id}                    color={C.indigo} />
            </SectionCard>
          </div>

          {/* ── Mentor Card (full width) */}
          {mi && (
            <SectionCard title="My Mentor" icon={UserCheck} color={C.emerald} delay={0.15}>
              <div style={{ paddingTop: 6 }}>
                {/* Mentor hero row */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0 16px", borderBottom: "1px solid var(--divider)", marginBottom: 4 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${C.emerald},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                    {mi.fullName?.split(" ").map((p: any) => p[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 3px" }}>{mi.fullName}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 8px" }}>{mi.email}</p>
                    {/* Expertise tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(mi.expertise ?? []).map((tag: string) => (
                        <span key={tag} style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: `${C.emerald}14`, color: C.emerald }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 0 }}>
                  <InfoRow icon={Building2}  label="Department"  value={mi.department}  color={C.emerald} />
                  <InfoRow icon={Phone}      label="Phone"       value={mi.phone ?? "—"} color={C.cyan} />
                  <InfoRow icon={Briefcase}  label="Experience"  value={mi.experience ?? "—"} color={C.violet} />
                </div>
              </div>
            </SectionCard>
          )}

        </div>
      </div>

      {/* Edit Modals */}
      <EditModal
        isOpen={isEditMode}
        editForm={editForm}
        setField={setEditField}
        onSave={handleSaveProfile}
        onCancel={() => setEditMode(false)}
        isUpdating={isUpdating}
      />
      <EditSocialsModal
        isOpen={isSocialsEditMode}
        form={socialsForm}
        setField={setSocialsField}
        onSave={handleSaveSocials}
        onCancel={() => setSocialsEditMode(false)}
        isUpdating={isUpdating}
      />
    </>
  );
}