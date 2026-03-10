"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, Search, X, Loader2, CheckCircle,
  ChevronLeft, ChevronRight, Send, Eye, Star,
  MessageSquare, Calendar, User, ChevronRight as CR,
  CheckSquare, Circle, AlignLeft, ToggleLeft,
} from "lucide-react";
import { useSurveysStore, Survey, SurveyQuestion } from "@/store/student/surveys";
import { useThemeStore } from "@/store/layoutStore";
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
  pink:    "#EC4899",
};

const QTYPE_META: Record<string, { label: string; color: string; icon: any }> = {
  TEXT:            { label: "Text",     color: C.blue,   icon: AlignLeft },
  MULTIPLE_CHOICE: { label: "Choice",   color: C.violet, icon: CheckSquare },
  RATING:          { label: "Rating",   color: C.amber,  icon: Star },
  YES_NO:          { label: "Yes/No",   color: C.cyan, icon: ToggleLeft },
};

const GLOBAL_CSS = `
  @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  :root {
    --card-bg:#fff; --card-border:#E8EDF4; --card-shadow:0 2px 12px rgba(0,0,0,0.06);
    --body-bg:#F7F9FC; --text-primary:#1E293B; --text-secondary:#64748B; --text-muted:#94A3B8;
    --input-bg:#F8FAFC; --input-border:#E2E8F0;
    --modal-overlay:rgba(15,23,42,0.60);
    --sk-from:#EEF2F7; --sk-via:#E2E8F0;
    --table-border:#F1F5F9; --pill-inactive-bg:#F1F5F9; --pill-inactive-text:#64748B;
  }
  .dark {
    --card-bg:#1E2432; --card-border:#2A3349; --card-shadow:0 2px 12px rgba(0,0,0,0.30);
    --body-bg:#141921; --text-primary:#E8EDF8; --text-secondary:#94A3B8; --text-muted:#64748B;
    --input-bg:#252E42; --input-border:#2A3349;
    --modal-overlay:rgba(5,8,14,0.80);
    --sk-from:#1E2432; --sk-via:#252E42;
    --table-border:#1E2432; --pill-inactive-bg:#1E2432; --pill-inactive-text:#94A3B8;
  }
  .sk { background:linear-gradient(90deg,var(--sk-from) 25%,var(--sk-via) 50%,var(--sk-from) 75%); background-size:200% 100%; animation:shimmer 1.6s infinite linear; border-radius:10px; }
  .form-input { width:100%; padding:10px 14px; border-radius:10px; font-size:13px; font-family:inherit; background:var(--input-bg); border:1.5px solid var(--input-border); color:var(--text-primary); outline:none; transition:border-color 0.18s,box-shadow 0.18s; }
  .form-input:focus { border-color:${C.violet}; box-shadow:0 0 0 3px ${C.violet}22; }
  .form-input::placeholder { color:var(--text-muted); }
  .form-input.textarea { resize:vertical; min-height:80px; line-height:1.6; }
  .modal-overlay { position:fixed; inset:0; background:var(--modal-overlay); display:flex; align-items:flex-end; justify-content:center; z-index:1000; backdrop-filter:blur(5px); padding:0; }
  .modal-sheet { background:var(--card-bg); border:1px solid var(--card-border); border-radius:24px 24px 0 0; width:100%; max-width:680px; max-height:92vh; overflow-y:auto; box-shadow:0 -24px 64px rgba(0,0,0,0.22); animation:slide-up 0.3s ease-out; }
  .modal-overlay-center { align-items:center; padding:16px; }
  .modal-sheet-center { border-radius:18px; box-shadow:0 20px 54px rgba(0,0,0,0.28); max-height:88vh; }
  .radio-opt { padding:10px 14px; border-radius:10px; border:1.5px solid var(--input-border); cursor:pointer; transition:all 0.14s; display:flex; align-items:center; gap:10px; }
  .radio-opt:hover { border-color:${C.violet}; background:${C.violet}08; }
  .radio-opt.selected { border-color:${C.violet}; background:${C.violet}12; }

  @media(max-width:768px){ .survey-grid{grid-template-columns:repeat(2,1fr)!important;} .sv-stats{grid-template-columns:repeat(2,1fr)!important;} }
  @media(max-width:520px){ .survey-grid{grid-template-columns:1fr!important;} .sv-stats{grid-template-columns:1fr!important;} .filter-sv{flex-wrap:wrap!important;} }
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

const Pill = ({ label, active, onClick, count }: any) => (
  <button onClick={onClick} style={{ padding: "5px 13px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.18s", background: active ? C.violet : "var(--pill-inactive-bg)", color: active ? "#fff" : "var(--pill-inactive-text)", boxShadow: active ? `0 2px 10px ${C.violet}44` : "none", display: "flex", alignItems: "center", gap: 5 }}>
    {label}
    {count != null && <span style={{ fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.25)" : "var(--card-border)", color: active ? "#fff" : "var(--text-muted)", borderRadius: 10, padding: "1px 6px" }}>{count}</span>}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION INPUT RENDERER
// ─────────────────────────────────────────────────────────────────────────────
const QuestionInput = ({ q, idx, value, onChange, readOnly = false }: { q: SurveyQuestion; idx: number; value: any; onChange?: (v: any) => void; readOnly?: boolean }) => {
  const type = q.type ?? "TEXT";

  const baseInputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontFamily: "inherit",
    background: readOnly ? "var(--body-bg)" : "var(--input-bg)",
    border: `1.5px solid ${readOnly ? "var(--card-border)" : "var(--input-border)"}`,
    color: "var(--text-primary)", outline: "none", resize: "vertical" as any, lineHeight: 1.6,
    cursor: readOnly ? "default" : "text",
  };

  if (type === "TEXT") return (
    <textarea
      style={{ ...baseInputStyle, minHeight: 80 }}
      placeholder={readOnly ? "—" : "Your answer..."}
      value={value ?? ""}
      onChange={readOnly ? undefined : e => onChange?.(e.target.value)}
      readOnly={readOnly}
    />
  );

  if (type === "RATING") {
    const ratingVal = Number(value) || 0;
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={readOnly ? undefined : () => onChange?.(String(n))}
            style={{ width: 44, height: 44, borderRadius: 10, border: "none", cursor: readOnly ? "default" : "pointer", background: n <= ratingVal ? `${C.amber}22` : "var(--pill-inactive-bg)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.14s" }}>
            <Star size={18} fill={n <= ratingVal ? C.amber : "none"} stroke={n <= ratingVal ? C.amber : "var(--text-muted)"} />
          </button>
        ))}
        {ratingVal > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: C.amber, alignSelf: "center" }}>{ratingVal}/5</span>}
      </div>
    );
  }

  if (type === "YES_NO") {
    return (
      <div style={{ display: "flex", gap: 10 }}>
        {["Yes", "No"].map(opt => {
          const sel = value === opt;
          return (
            <button key={opt} type="button" onClick={readOnly ? undefined : () => onChange?.(opt)}
              style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `1.5px solid ${sel ? (opt === "Yes" ? C.emerald : C.rose) : "var(--input-border)"}`, cursor: readOnly ? "default" : "pointer", background: sel ? (opt === "Yes" ? `${C.emerald}14` : `${C.rose}14`) : "var(--input-bg)", color: sel ? (opt === "Yes" ? C.emerald : C.rose) : "var(--text-secondary)", fontSize: 13, fontWeight: 700, transition: "all 0.14s" }}>
              {opt === "Yes" ? "✓ " : "✕ "}{opt}
            </button>
          );
        })}
      </div>
    );
  }

  if (type === "MULTIPLE_CHOICE") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(q.options ?? []).map((opt, oi) => {
          const sel = value === opt;
          return (
            <div key={oi} className={`radio-opt${sel ? " selected" : ""}`}
              onClick={readOnly ? undefined : () => onChange?.(opt)}
              style={{ borderColor: sel ? C.violet : undefined, background: sel ? `${C.violet}12` : undefined, cursor: readOnly ? "default" : "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${sel ? C.violet : "var(--input-border)"}`, background: sel ? C.violet : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {sel && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
              </div>
              <span style={{ fontSize: 13, color: sel ? C.violet : "var(--text-primary)", fontWeight: sel ? 600 : 400 }}>{opt}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// ANSWER MODAL (bottom sheet)
// ─────────────────────────────────────────────────────────────────────────────
const AnswerModal = ({ open, survey, answers, onAnswer, onSubmit, onClose, isSubmitting, isLoading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay modal-overlay-center" onClick={onClose}>
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="modal-sheet modal-sheet-center" onClick={(e) => e.stopPropagation()}>

          {/* Handle */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4 }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--card-border)" }} />
          </div>

          <div style={{ padding: "12px 24px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${C.violet}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ClipboardList size={15} color={C.violet} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{survey?.title}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>By {survey?.postedBy} • {survey?.questions?.length ?? 0} questions</p>
                </div>
              </div>
              {survey?.description && <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "4px 0 0", lineHeight: 1.6 }}>{survey.description}</p>}
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--pill-inactive-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <X size={14} color="var(--text-muted)" />
            </button>
          </div>

          <div style={{ padding: "18px 24px 100px" }}>
            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[...Array(3)].map((_, i) => <Sk key={i} h={100} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {(survey?.questions ?? []).map((q: SurveyQuestion, idx: number) => {
                  const QMeta = QTYPE_META[q.type] ?? QTYPE_META.TEXT;
                  const QIcon = QMeta.icon;
                  return (
                    <div key={idx} style={{ padding: "18px", borderRadius: 14, background: "var(--body-bg)", border: "1px solid var(--card-border)" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: `${QMeta.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                          <QIcon size={13} color={QMeta.color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 2px", lineHeight: 1.4 }}>
                            {idx + 1}. {q.question}
                            {q.required && <span style={{ color: C.rose, marginLeft: 4 }}>*</span>}
                          </p>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 8, background: `${QMeta.color}14`, color: QMeta.color }}>{QMeta.label}</span>
                        </div>
                      </div>
                      <QuestionInput q={q} idx={idx} value={answers[idx]} onChange={v => onAnswer(idx, v)} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sticky footer */}
          <div style={{ position: "sticky", bottom: 0, padding: "16px 24px 24px", background: "var(--card-bg)", borderTop: "1px solid var(--card-border)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ padding: "10px 22px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={onSubmit} disabled={isSubmitting || isLoading} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: C.violet, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, opacity: isSubmitting ? 0.7 : 1, boxShadow: `0 4px 16px ${C.violet}44` }}>
              {isSubmitting ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={13} />}
              {survey?.hasResponded ? "Update Response" : "Submit Response"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// VIEW RESPONSE MODAL
// ─────────────────────────────────────────────────────────────────────────────
const ViewResponseModal = ({ open, response, onClose }: any) => (
  <AnimatePresence>
    {open && (
      <div className="modal-overlay modal-overlay-center" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} transition={{ duration: 0.2 }}
          className="modal-sheet modal-sheet-center" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4 }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--card-border)" }} />
          </div>
          <div style={{ padding: "12px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${C.emerald}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Eye size={15} color={C.emerald} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>My Response</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Submitted on {fmtDate(response?.submittedAt)}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--pill-inactive-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} color="var(--text-muted)" />
            </button>
          </div>
          <div style={{ padding: "18px 24px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
            {!response ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "24px 0", fontSize: 13 }}>No response data</p>
            ) : (
              (response.questionsWithAnswers ?? []).map((qa: any, i: number) => {
                const QMeta = QTYPE_META[qa.question?.type] ?? QTYPE_META.TEXT;
                const QIcon = QMeta.icon;
                return (
                  <div key={i} style={{ padding: "16px", borderRadius: 14, background: "var(--body-bg)", border: "1px solid var(--card-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 7, background: `${QMeta.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <QIcon size={12} color={QMeta.color} />
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{i + 1}. {qa.question?.question}</p>
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: 10, background: `${C.emerald}08`, border: `1px solid ${C.emerald}25` }}>
                      <QuestionInput q={qa.question} idx={i} value={qa.answer} readOnly />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// SURVEY CARD
// ─────────────────────────────────────────────────────────────────────────────
const SurveyCard = ({ survey, index, onAnswer, onView }: any) => {
  const responded = survey.hasResponded;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}
      style={{ background: "var(--card-bg)", border: `1px solid ${responded ? `${C.emerald}35` : "var(--card-border)"}`, borderRadius: 18, padding: "20px", boxShadow: "var(--card-shadow)", display: "flex", flexDirection: "column", gap: 14, position: "relative", overflow: "hidden", transition: "box-shadow 0.18s, transform 0.18s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>

      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: responded ? `linear-gradient(90deg,${C.emerald},${C.cyan})` : `linear-gradient(90deg,${C.violet},${C.pink})`, borderRadius: "18px 18px 0 0" }} />

      <div style={{ paddingTop: 4 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flex: 1, minWidth: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: responded ? `${C.emerald}18` : `${C.violet}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ClipboardList size={17} color={responded ? C.emerald : C.violet} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{survey.title}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <User size={10} color="var(--text-muted)" />
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{survey.postedBy}</span>
              </div>
            </div>
          </div>
          {responded
            ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: `${C.emerald}18`, color: C.emerald, fontSize: 11, fontWeight: 700, flexShrink: 0 }}><CheckCircle size={11} /> Answered</span>
            : <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: `${C.amber}14`, color: C.amber, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>Pending</span>
          }
        </div>

        {survey.description && (
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {survey.description}
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", background: "var(--pill-inactive-bg)", padding: "3px 9px", borderRadius: 20 }}>
            {survey.questions?.length ?? 0} questions
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
            <Calendar size={10} /> {fmtDate(survey.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, paddingTop: 6, borderTop: "1px solid var(--table-border)" }}>
        {responded ? (
          <>
            <button onClick={() => onView(survey._id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", borderRadius: 10, border: "none", background: `${C.emerald}14`, color: C.emerald, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <Eye size={13} /> View Response
            </button>
            <button onClick={() => onAnswer(survey._id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", borderRadius: 10, border: `1.5px solid ${C.violet}30`, background: "transparent", color: C.violet, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <MessageSquare size={13} /> Update
            </button>
          </>
        ) : (
          <button onClick={() => onAnswer(survey._id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 0", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.violet},${C.pink})`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${C.violet}35` }}>
            <Send size={13} /> Answer Survey
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SurveysPage() {
  const {
    surveys, selectedSurvey, myResponse, pagination,
    searchQuery, filterAnswered,
    isLoading, isLoadingSurvey, isSubmitting,
    isAnswerModalOpen, isViewResponseModalOpen,
    currentAnswers,
    fetchSurveys, submitResponse, updateResponse,
    setSearchQuery, setFilterAnswered, setPage,
    openAnswerModal, closeAnswerModal,
    openViewResponseModal, closeViewResponseModal,
    setCurrentAnswer,
  } = useSurveysStore();

  const { initializeTheme } = useThemeStore();

  useEffect(() => { initializeTheme(); fetchSurveys(); }, []);

  const filtered = useMemo(() => {
    let list = surveys;
    if (filterAnswered === "ANSWERED") list = list.filter(s => s.hasResponded);
    if (filterAnswered === "PENDING")  list = list.filter(s => !s.hasResponded);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.title.toLowerCase().includes(q) || s.postedBy?.toLowerCase().includes(q));
    }
    return list;
  }, [surveys, filterAnswered, searchQuery]);

  const counts = useMemo(() => ({
    ALL:      surveys.length,
    ANSWERED: surveys.filter(s => s.hasResponded).length,
    PENDING:  surveys.filter(s => !s.hasResponded).length,
  }), [surveys]);

  const handleSubmit = async () => {
    if (!selectedSurvey) return;
    if (selectedSurvey.hasResponded) {
      await updateResponse(selectedSurvey._id, currentAnswers);
    } else {
      await submitResponse(selectedSurvey._id, currentAnswers);
    }
    fetchSurveys();
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "var(--body-bg)" }}>
        <Header subtitle="Answer surveys posted by your mentor and track your responses." />

        <div style={{ padding: "24px 24px 48px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Stats */}
          <div className="sv-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[
              { label: "Total Surveys",  val: counts.ALL,      color: C.violet, icon: ClipboardList },
              { label: "Answered",       val: counts.ANSWERED, color: C.emerald, icon: CheckCircle },
              { label: "Pending",        val: counts.PENDING,  color: C.amber,   icon: MessageSquare },
            ].map(({ label, val, color, icon: Icon }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 14, padding: "18px 20px", boxShadow: "var(--card-shadow)", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}16`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 4px" }}>{label}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{val}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "14px 20px", boxShadow: "var(--card-shadow)" }}>
            <div className="filter-sv" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <Pill label="All" active={filterAnswered === "ALL"} onClick={() => setFilterAnswered("ALL")} count={counts.ALL} />
                <Pill label="Pending" active={filterAnswered === "PENDING"} onClick={() => setFilterAnswered("PENDING")} count={counts.PENDING} />
                <Pill label="Answered" active={filterAnswered === "ANSWERED"} onClick={() => setFilterAnswered("ANSWERED")} count={counts.ANSWERED} />
              </div>
              <div style={{ position: "relative", maxWidth: 260, width: "100%" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input className="form-input" placeholder="Search surveys..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 30 }} />
              </div>
            </div>
          </div>

          {/* Survey grid */}
          {isLoading ? (
            <div className="survey-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[...Array(6)].map((_, i) => <Sk key={i} h={220} style={{ borderRadius: 18 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "60px 24px", textAlign: "center", boxShadow: "var(--card-shadow)" }}>
              <ClipboardList size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>No surveys found</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Your mentor hasn't posted any surveys yet</p>
            </motion.div>
          ) : (
            <div className="survey-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {filtered.map((survey, i) => (
                <SurveyCard key={survey._id} survey={survey} index={i} onAnswer={openAnswerModal} onView={openViewResponseModal} />
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

      <AnswerModal
        open={isAnswerModalOpen}
        survey={selectedSurvey}
        answers={currentAnswers}
        onAnswer={setCurrentAnswer}
        onSubmit={handleSubmit}
        onClose={closeAnswerModal}
        isSubmitting={isSubmitting}
        isLoading={isLoadingSurvey}
      />

      <ViewResponseModal
        open={isViewResponseModalOpen}
        response={myResponse}
        onClose={closeViewResponseModal}
      />
    </>
  );
}
