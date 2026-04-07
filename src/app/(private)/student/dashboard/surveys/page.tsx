"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, Search, X, Loader2, CheckCircle,
  ChevronLeft, ChevronRight, Send, Eye, Star,
  MessageSquare, Calendar, User,
  CheckSquare, AlignLeft, ToggleLeft,
} from "lucide-react";
import { useSurveysStore, Survey, SurveyQuestion } from "@/store/student/surveys";
import { useThemeStore } from "@/store/layoutStore";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";

const QTYPE_META: Record<string, { label: string; icon: any }> = {
  TEXT:            { label: "Text",     icon: AlignLeft },
  MULTIPLE_CHOICE: { label: "Choice",   icon: CheckSquare },
  RATING:          { label: "Rating",   icon: Star },
  YES_NO:          { label: "Yes/No",   icon: ToggleLeft },
};

const Sk = ({ className = "", h = 16 }: any) => (
  <div className={`animate-pulse bg-foreground/5 rounded-lg ${className}`} style={{ height: h }} />
);

const fmtDate = (v?: string) => {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return v; }
};

const Pill = ({ label, active, onClick, count }: any) => (
  <button onClick={onClick} className={`px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${active ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card/50 text-muted-foreground border-transparent hover:bg-foreground/5'}`}>
    {label}
    {count != null && <span className={`text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-md ${active ? 'bg-background/20 text-white' : 'bg-foreground/10 text-muted-foreground'}`}>{count}</span>}
  </button>
);

const QuestionInput = ({ q, idx, value, onChange, readOnly = false }: { q: SurveyQuestion; idx: number; value: any; onChange?: (v: any) => void; readOnly?: boolean }) => {
  const type = q.type ?? "TEXT";

  if (type === "TEXT") return (
    <textarea
      className={`w-full bg-background border ${readOnly ? "border-border/30" : "border-border/50"} rounded-xl p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y min-h-[80px]`}
      placeholder={readOnly ? "—" : "Your answer..."}
      value={value ?? ""}
      onChange={readOnly ? undefined : e => onChange?.(e.target.value)}
      readOnly={readOnly}
    />
  );

  if (type === "RATING") {
    const ratingVal = Number(value) || 0;
    return (
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={readOnly ? undefined : () => onChange?.(String(n))}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${readOnly ? "cursor-default" : "cursor-pointer"} ${n <= ratingVal ? "bg-primary/20" : "bg-foreground/5"}`}>
            <Star size={18} className={n <= ratingVal ? "fill-primary text-primary" : "text-muted-foreground/50"} />
          </button>
        ))}
        {ratingVal > 0 && <span className="text-sm font-bold text-primary self-center ml-2">{ratingVal}/5</span>}
      </div>
    );
  }

  if (type === "YES_NO") {
    return (
      <div className="flex gap-3">
        {["Yes", "No"].map(opt => {
          const sel = value === opt;
          return (
            <button key={opt} type="button" onClick={readOnly ? undefined : () => onChange?.(opt)}
              className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${readOnly ? "cursor-default" : "cursor-pointer"} ${sel ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-background text-muted-foreground"}`}>
              {opt === "Yes" ? "✓ " : "✕ "}{opt}
            </button>
          );
        })}
      </div>
    );
  }

  if (type === "MULTIPLE_CHOICE") {
    return (
      <div className="flex flex-col gap-2">
        {(q.options ?? []).map((opt, oi) => {
          const sel = value === opt;
          return (
            <div key={oi} onClick={readOnly ? undefined : () => onChange?.(opt)}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${readOnly ? "cursor-default" : "cursor-pointer hover:bg-foreground/5"} ${sel ? "border-primary bg-primary/5" : "border-border/30 bg-background"}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex shrink-0 items-center justify-center ${sel ? "border-primary bg-primary" : "border-border/80 bg-transparent"}`}>
                {sel && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className={`text-sm ${sel ? "text-primary font-bold" : "text-foreground font-medium"}`}>{opt}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

const AnswerModal = ({ open, survey, answers, onAnswer, onSubmit, onClose, isSubmitting, isLoading }: any) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center sm:p-4" onClick={onClose}>
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="bg-card-glass/90 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-t-3xl sm:rounded-3xl w-full max-w-[680px] max-h-[92vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-border/50" />
          </div>

          <div className="px-6 py-4 flex items-start justify-between gap-4 border-b border-border/40">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ClipboardList size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-base font-display font-bold text-foreground m-0">{survey?.title}</p>
                  <p className="text-[11px] font-mono text-muted-foreground tracking-widest uppercase m-0 mt-0.5">By {survey?.postedBy} • {survey?.questions?.length ?? 0} questions</p>
                </div>
              </div>
              {survey?.description && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{survey.description}</p>}
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors shrink-0">
              <X size={14} className="text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => <Sk key={i} h={120} className="rounded-2xl" />)}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {(survey?.questions ?? []).map((q: SurveyQuestion, idx: number) => {
                  const QMeta = QTYPE_META[q.type] ?? QTYPE_META.TEXT;
                  const QIcon = QMeta.icon;
                  return (
                    <div key={idx} className="p-5 rounded-2xl bg-foreground/5 border border-border/30">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <QIcon size={14} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-foreground m-0 leading-relaxed mb-1">
                            {idx + 1}. {q.question}
                            {q.required && <span className="text-rose-500 ml-1">*</span>}
                          </p>
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary tracking-widest uppercase">{QMeta.label}</span>
                        </div>
                      </div>
                      <QuestionInput q={q} idx={idx} value={answers[idx]} onChange={v => onAnswer(idx, v)} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5 border-t border-border/40 bg-card-glass/50 flex gap-3 justify-end items-center">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-border/50 text-sm font-bold text-muted-foreground hover:bg-foreground/5 transition-colors">Cancel</button>
            <button onClick={onSubmit} disabled={isSubmitting || isLoading} className="px-8 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold flex items-center gap-2 transition-all">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {survey?.hasResponded ? "Update Response" : "Submit Response"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ViewResponseModal = ({ open, response, onClose }: any) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2 }}
          className="bg-card-glass/90 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-[1.5rem] w-full max-w-[640px] max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-5 flex items-center justify-between border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-base font-display font-bold text-foreground m-0">My Response</p>
                <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5 m-0">Submitted on {fmtDate(response?.submittedAt)}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors">
              <X size={14} className="text-muted-foreground" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
            {!response ? (
              <p className="text-muted-foreground text-center py-10 font-bold">No response data</p>
            ) : (
              (response.questionsWithAnswers ?? []).map((qa: any, i: number) => {
                const QMeta = QTYPE_META[qa.question?.type] ?? QTYPE_META.TEXT;
                const QIcon = QMeta.icon;
                return (
                  <div key={i} className="p-5 rounded-2xl bg-foreground/5 border border-border/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <QIcon size={14} className="text-primary" />
                      </div>
                      <p className="text-sm font-bold text-foreground m-0 leading-snug">{i + 1}. {qa.question?.question}</p>
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
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

const SurveyCard = ({ survey, index, onAnswer, onView }: any) => {
  const responded = survey.hasResponded;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}
      className={`bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${responded ? 'ring-1 ring-primary/20' : ''}`}>

      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ClipboardList size={18} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-display font-bold text-foreground truncate">{survey.title}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <User size={10} className="text-muted-foreground" />
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest truncate">{survey.postedBy}</span>
            </div>
          </div>
        </div>
        {responded
  ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
    bg-emerald-100 text-emerald-700
    dark:bg-emerald-900/30 dark:text-emerald-400
    text-[9px] font-mono font-bold uppercase tracking-widest shrink-0">
      <CheckCircle size={10} /> Answered
    </span>
  )
  : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
    bg-amber-100 text-amber-700
    dark:bg-amber-900/30 dark:text-amber-400
    text-[9px] font-mono font-bold uppercase tracking-widest shrink-0">
      Pending
    </span>
  )
}
      </div>

      {survey.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {survey.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground bg-foreground/5 px-2.5 py-1 rounded-full">
          {survey.questions?.length ?? 0} questions
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
          <Calendar size={11} /> {fmtDate(survey.createdAt)}
        </span>
      </div>

     <div className="flex gap-2 pt-4 mt-2 border-t border-border/30">
  {responded ? (
    <>
      <Button
        onClick={() => onView(survey._id)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
        bg-emerald-100 text-emerald-700
        hover:bg-emerald-200
        dark:bg-emerald-900/30 dark:text-emerald-400
        text-xs font-bold uppercase tracking-wider transition-colors"
      >
        <Eye size={14} /> View
      </Button>

      <Button
        onClick={() => onAnswer(survey._id)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
        bg-amber-100 text-amber-700
        hover:bg-amber-200
        dark:bg-amber-900/30 dark:text-amber-400
        text-xs font-bold uppercase tracking-wider transition-colors"
      >
        <MessageSquare size={14} /> Update
      </Button>
    </>
  ) : (
    <button
      onClick={() => onAnswer(survey._id)}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
      bg-blue-600 hover:bg-blue-700
      text-white
      text-xs font-bold uppercase tracking-wider
      transition-colors shadow-sm shadow-blue-500/20"
    >
      <Send size={14} /> Answer
    </button>
  )}
</div>
    </motion.div>
  );
};

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

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header subtitle="Answer surveys posted by your mentor and track your responses." />

      <main className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: "Total Surveys",  val: counts.ALL,      icon: ClipboardList },
            { label: "Answered",       val: counts.ANSWERED, icon: CheckCircle },
            { label: "Pending",        val: counts.PENDING,  icon: MessageSquare },
          ].map(({ label, val, icon: Icon }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-display font-bold text-foreground leading-none">{val}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <Pill label="All" active={filterAnswered === "ALL"} onClick={() => setFilterAnswered("ALL")} count={counts.ALL} />
            <Pill label="Pending" active={filterAnswered === "PENDING"} onClick={() => setFilterAnswered("PENDING")} count={counts.PENDING} />
            <Pill label="Answered" active={filterAnswered === "ANSWERED"} onClick={() => setFilterAnswered("ANSWERED")} count={counts.ANSWERED} />
          </div>
          <div className="relative w-full md:max-w-[280px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="w-full bg-background border border-border/50 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Search surveys..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <Sk key={i} h={220} className="rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl py-24 px-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-5">
              <ClipboardList size={32} className="text-muted-foreground" />
            </div>
            <p className="text-lg font-display font-bold text-foreground mb-1">No surveys found</p>
            <p className="text-sm text-muted-foreground">Your mentor hasn't posted any surveys yet, or none match your filters.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((survey, i) => (
              <SurveyCard key={survey._id} survey={survey} index={i} onAnswer={openAnswerModal} onView={openViewResponseModal} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <button onClick={() => setPage(pagination.skip - pagination.limit)} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-border/50 text-sm font-bold disabled:opacity-50 transition-colors">
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setPage(pagination.skip + pagination.limit)} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-border/50 text-sm font-bold disabled:opacity-50 transition-colors">
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

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
    </div>
  );
}
