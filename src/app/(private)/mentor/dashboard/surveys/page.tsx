'use client';

import React, { useEffect, useState } from 'react';
import {
  Search, Plus, Eye, Trash2, X,
  MessageCircle, BarChart3, ChevronLeft, ChevronRight, Loader2, Zap, Send, Clipboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurveysStore } from '@/store/mentor/survey';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: {
    label: "Active",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
  },
  CLOSED: {
    label: "Closed",
    color: "#6b7280",
    bg: "rgba(107, 114, 128, 0.12)",
  },
  DRAFT: {
    label: "Draft",
    color: "#2563eb",
    bg: "rgba(59, 130, 246, 0.12)",
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status?.toUpperCase()] ?? STATUS_META.CLOSED;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
};

const CreateSurveyModal = ({ open, onClose, onCreate, isSubmitting }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(['', '']);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setQuestions(['', '']);
    }
  }, [open]);

  const handleSubmit = async () => {
    const validQuestions = questions.filter((q) => q.trim());
    if (!title.trim() || validQuestions.length === 0) return;
    await onCreate(title, description, validQuestions);
    onClose();
  };

  const addQuestion = () => setQuestions([...questions, '']);
  const removeQuestion = (idx: number) => setQuestions(questions.filter((_, i) => i !== idx));

  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-sheet max-w-xl p-0 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-border/50 bg-foreground/[0.02] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Launch New Survey</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Collect qualitative feedback from mentees</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Survey Identifier</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mid-Term Program Feedback" className="h-11 rounded-xl bg-muted/20 border-border/60" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Strategic Objective</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Context for respondents..."
                  className="w-full min-h-[80px] rounded-xl bg-muted/20 border border-border/60 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 pt-2 border-t border-border/20">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Questionnaire Design</label>
                  <Button variant="outline" size="sm" onClick={addQuestion} className="h-7 px-3 border-primary/20 text-primary hover:bg-primary/5 text-[10px] font-semibold uppercase tracking-widest gap-2">
                    <Plus size={12} /> Add Query
                  </Button>
                </div>
                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div key={idx} className="flex gap-3 items-start group">
                      <div className="mt-2.5 w-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-tighter">Q{idx + 1}</div>
                      <Input
                        placeholder={`Query ${idx + 1}...`}
                        value={q}
                        onChange={(e) => {
                          const nq = [...questions];
                          nq[idx] = e.target.value;
                          setQuestions(nq);
                        }}
                        className="flex-1 h-10 rounded-xl bg-muted/20 border-border/60"
                      />
                      {questions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestion(idx)}
                          className="h-10 w-10 text-destructive/40 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border/50 bg-foreground/[0.01] flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} className="h-10 px-6 rounded-xl text-[11px] font-semibold uppercase tracking-wider">Draft</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !title.trim() || questions.filter(q => q.trim()).length === 0} className="h-10 px-8 rounded-xl text-[11px] font-semibold uppercase tracking-wider gap-2">
                {isSubmitting && <Loader2 size={14} className="animate-spin" />} Launch Survey
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ResponsesModal = ({ surveyDetail, onClose }: any) => {
  const [deptFilter, setDeptFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  useEffect(() => {
    if (!surveyDetail) {
      setDeptFilter('all');
      setYearFilter('all');
    }
  }, [surveyDetail]);

  if (!surveyDetail) return null;
  const { survey, responses } = surveyDetail;

  const filtered = responses.filter((r: any) => {
    if (deptFilter !== 'all' && r.student.department !== deptFilter) return false;
    if (yearFilter !== 'all' && r.student.year !== yearFilter) return false;
    return true;
  });

  return (
    <AnimatePresence>
      {surveyDetail && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-sheet max-w-3xl p-0 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-border/50 bg-foreground/[0.02] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">{survey.title}</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Aggregated respondent intelligence</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger className="h-10 rounded-xl bg-muted/10 border-border/60 text-xs font-semibold uppercase tracking-wider">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="h-10 rounded-xl bg-muted/10 border-border/60 text-xs font-semibold uppercase tracking-wider">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filtered.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-border/40 rounded-2xl">
                  <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">No matching datasets</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((r: any, idx: number) => (
                    <motion.div
                      key={r.responseId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="p-5 rounded-2xl bg-foreground/[0.01] border border-border/40 group"
                    >
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/20">
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{r.student.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{r.student.department} • Year {r.student.year} • {new Date(r.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                          <Zap size={14} className="text-primary/60" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        {r.answers.map((ans: any, aIdx: number) => (
                          <div key={aIdx} className="space-y-1.5">
                            <p className="text-[13px] font-semibold text-foreground/40 ">Query {aIdx + 1}: {ans.question}</p>
                            <div className="p-3.5 rounded-xl bg-muted/10 border border-border/20 text-xs text-foreground/80 leading-relaxed font-medium">
                              {ans.answer || <span className="opacity-40 italic">Data not provided</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border/50 flex justify-end">
              <Button onClick={onClose} className="h-9 px-6 rounded-xl text-[11px] font-semibold uppercase tracking-wider">Close Analysis</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function MentorSurveysPage() {
  const {
    surveys, surveyDetail, searchQuery, statusFilter, page, totalPages,
    isLoading, isLoadingDetail, isSubmitting,
    fetchSurveys, fetchSurveyResponses, createSurvey,
    setSearchQuery, setStatusFilter, setPage, resetFilters, closeSurveyDetail,
  } = useSurveysStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys, searchQuery, statusFilter, page]);

  const hasActiveFilters = searchQuery || statusFilter;

  const STATUS_PILLS = [
    { val: '', label: 'All Indices' },
    { val: 'Active', label: 'Active' },
    { val: 'Closed', label: 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Surveys"
        subtitle="Capture qualitative feedback through targeted inquiries"
        HeaderComp={
          <Button onClick={() => setCreateOpen(true)} className="h-9 px-4 rounded-xl text-[11px] font-semibold uppercase tracking-wider gap-2 shadow-lg shadow-primary/20">
            <Plus size={14} /> Launch Survey
          </Button>
        }
      />

      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
            {STATUS_PILLS.map((p) => (
              <button
                key={p.val}
                onClick={() => setStatusFilter(p.val)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  statusFilter === p.val
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border/40'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search survey indices..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(tempSearch)}
                className="pl-10 h-10 rounded-xl border-border/60 bg-muted/20"
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetFilters();
                  setTempSearch('');
                }}
                className="h-10 rounded-xl text-xs text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-12 rounded-xl" />
                  <Skeleton className="h-12 rounded-xl" />
                </div>
              </div>
            ))
          ) : surveys.length === 0 ? (
            <div className="col-span-full py-32 text-center bg-card border border-dashed border-border rounded-3xl">
              <MessageCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-base font-semibold text-muted-foreground uppercase tracking-widest">No Intelligence Surveys Launched</p>
              <Button onClick={() => setCreateOpen(true)} variant="outline" className="mt-6 border-primary/20 text-primary uppercase font-semibold text-[10px] tracking-widest">Initial Launch</Button>
            </div>
          ) : (
            surveys.map((survey: any, idx: number) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-card border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Clipboard className="w-5 h-5 text-primary" />
                  </div>
                  <StatusBadge status={survey.status} />
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">{survey.title}</h4>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2 min-h-[40px]">
                    {survey.description || 'Actionable intelligence collection index for assigned mentees.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-muted/10 border border-border/40 text-center group-hover:bg-primary/[0.02] transition-colors">
                    <p className="text-2xl font-black text-foreground/80">{survey.questions?.length || 0}</p>
                    <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">Queries</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/10 border border-border/40 text-center group-hover:bg-primary/[0.02] transition-colors">
                    <p className="text-2xl font-black text-primary">{survey.respondents || 0}</p>
                    <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">Datasets</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => fetchSurveyResponses(survey.id)}
                    disabled={isLoadingDetail}
                    className="flex-1 h-10 rounded-2xl bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 text-[10px] font-semibold uppercase tracking-widest gap-2"
                  >
                    <BarChart3 size={14} /> Analytics
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-2xl text-destructive/40 hover:text-destructive hover:bg-destructive/5"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-border/40">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Survey Index: <span className="text-primary">{page}</span> of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-semibold uppercase tracking-wider gap-2"
              >
                <ChevronLeft size={14} /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-semibold uppercase tracking-wider gap-2"
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateSurveyModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createSurvey}
        isSubmitting={isSubmitting}
      />
      <ResponsesModal
        surveyDetail={surveyDetail}
        onClose={closeSurveyDetail}
      />
    </div>
  );
}