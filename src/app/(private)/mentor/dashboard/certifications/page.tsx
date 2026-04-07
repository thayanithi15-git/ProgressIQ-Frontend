'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Eye, ExternalLink, X, Award, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { useMentorCertificationsStore } from '@/store/mentor/certifications';
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
  PENDING: {
    label: "Pending",
    color: "#6b7280",
    bg: "rgba(107, 114, 128, 0.12)",
  },
  APPROVED: {
    label: "Approved",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
  },
  REJECTED: {
    label: "Rejected",
    color: "#dc2626",
    bg: "rgba(239, 68, 68, 0.12)",
  },
};

const fmt = (v?: string) => {
  if (!v) return '—';
  try {
    return new Date(v).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return v;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status?.toUpperCase()] ?? STATUS_META.PENDING;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
};

const CertificationDetailModal = ({ certification, onClose }: any) => {
  if (!certification) return null;
  const { title, platform, platformLink, from, to, status, student, feedback } = certification;

  return (
    <AnimatePresence>
      {certification && (
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
                <h3 className="text-base font-semibold text-foreground">Certification Detail</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Verified credentials and student context</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">{title}</h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{platform}</p>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Issue Date</p>
                  <p className="text-sm font-semibold">{fmt(from)}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Expiry Date</p>
                  <p className="text-sm font-semibold">{to ? fmt(to) : 'Doesn\'t Expire'}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-foreground/[0.01] border border-border/40">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 block">Student Identification</label>
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Full Name</p>
                    <p className="text-sm font-semibold text-foreground">{student?.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Academic Year</p>
                    <p className="text-sm font-semibold text-foreground">Year {student?.year}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Department</p>
                    <p className="text-sm font-semibold text-foreground">{student?.department}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Contact</p>
                    <p className="text-sm font-semibold text-foreground truncate">{student?.email}</p>
                  </div>
                </div>
              </div>

              {platformLink && (
                <a href={platformLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <ExternalLink size={18} />
                    <span className="text-sm font-semibold uppercase tracking-wider">Verify Credentials</span>
                  </div>
                  <ChevronRight size={16} />
                </a>
              )}

              {feedback && (
                <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10">
                  <label className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mb-1.5 block">Reviewer Feedback</label>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">"{feedback}"</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border/50 flex justify-end">
              <Button onClick={onClose} className="h-9 px-6 rounded-xl text-[11px] font-semibold uppercase tracking-wider">Close View</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function MentorCertificationsPage() {
  const {
    certifications, certificationDetail, searchQuery, statusFilter,
    departmentFilter, yearFilter, page, total, totalPages,
    isLoading, isLoadingDetail,
    fetchCertifications, fetchCertificationDetail, setSearchQuery,
    setStatusFilter, setDepartmentFilter, setYearFilter, setPage, resetFilters, closeDetail,
  } = useMentorCertificationsStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications, searchQuery, statusFilter, departmentFilter, yearFilter, page]);

  const hasFilters = searchQuery || statusFilter || departmentFilter || yearFilter;

  const STATUS_PILLS = [
    { val: '', label: 'All' },
    { val: 'APPROVED', label: 'Approved' },
    { val: 'PENDING', label: 'In Review' },
    { val: 'REJECTED', label: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Certifications"
        subtitle="Validate and audit student professional development"
      />

      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search certificates..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(tempSearch)}
                className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-border/40">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/10 border-border/60 text-xs font-semibold uppercase tracking-wider">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CSE">Computer Science</SelectItem>
                <SelectItem value="ECE">Electronics</SelectItem>
                <SelectItem value="ME">Mechanical</SelectItem>
                <SelectItem value="CE">Civil</SelectItem>
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

            {hasFilters && (
              <Button
                variant="ghost"
                onClick={() => {
                  resetFilters();
                  setTempSearch('');
                }}
                className="h-10 rounded-xl text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-destructive gap-2"
              >
                <X className="w-4 h-4" /> Reset Filters
              </Button>
            )}
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-foreground/[0.01] border-b border-border/40">
                  {['Certificate Info', 'Platform', 'Earned By', 'Completion Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/40">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-5">
                          <Skeleton className="h-4 w-full rounded-lg" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : certifications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      No Certification Records Located
                    </td>
                  </tr>
                ) : (
                  certifications.map((cert: any, idx: number) => (
                    <motion.tr
                      key={cert.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition-colors cursor-pointer"
                      onClick={() => fetchCertificationDetail(cert.id)}
                    >
                      <td className="px-6 py-4 align-middle min-w-[280px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold truncate max-w-[200px]">{cert.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest border border-border/60 px-2 py-0.5 rounded bg-muted/20">
                          {cert.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div>
                          <p className="text-sm font-semibold">{cert.student?.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">{cert.student?.department}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {fmt(cert.to)}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <StatusBadge status={cert.status} />
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchCertificationDetail(cert.id);
                          }}
                          className="h-8 px-4 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 text-[10px] font-semibold uppercase tracking-widest gap-2"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Reviewing <span className="text-primary">{certifications.length}</span> of {total} submissions
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
              <div className="px-4 text-xs font-semibold text-muted-foreground">
                {page} / {totalPages}
              </div>
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

      <CertificationDetailModal
        certification={certificationDetail}
        onClose={closeDetail}
      />
    </div>
  );
}
