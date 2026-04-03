'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Eye, ExternalLink, X, Building2, Calendar,
  ChevronLeft, ChevronRight, DollarSign, Zap, Briefcase
} from 'lucide-react';
import { useMentorInternshipsStore } from '@/store/mentor/internships';
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

// ─── TOKENS ─────────────────────────────────────────────────────────────────
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
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

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
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

const InternshipDetailModal = ({ internship, onClose }: any) => {
  if (!internship) return null;
  const { companyName, companyUrl, role, type, paid, from, to, description, status, student, feedback } = internship;
  const duration = Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <AnimatePresence>
      {internship && (
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
                <h3 className="text-base font-semibold text-foreground">Internship Detail</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Professional experience audit</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">{companyName}</h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{role}</p>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={status} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/20 border border-border/40 text-center">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Type</p>
                  <p className="text-sm font-semibold">{type}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20 border border-border/40 text-center">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Stipend</p>
                  <p className="text-sm font-semibold">{paid ? 'Paid' : 'Unpaid'}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20 border border-border/40 text-center">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-sm font-semibold text-primary">{duration} Days</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Start Date</p>
                  <p className="text-sm font-semibold">{fmt(from)}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">End Date</p>
                  <p className="text-sm font-semibold">{fmt(to)}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-foreground/[0.01] border border-border/40">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 block">Associate Information</label>
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Student Name</p>
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
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Email</p>
                    <p className="text-sm font-semibold text-foreground truncate">{student?.email}</p>
                  </div>
                </div>
              </div>

              {description && (
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Experience Summary</label>
                  <div className="p-4 rounded-xl bg-foreground/[0.01] border border-border/40 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </div>
                </div>
              )}

              {companyUrl && (
                <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <ExternalLink size={18} />
                    <span className="text-sm font-semibold uppercase tracking-wider">Company Hub</span>
                  </div>
                  <ChevronRight size={16} />
                </a>
              )}

              {feedback && (
                <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10">
                  <label className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mb-1.5 block">Audit Feedback</label>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">"{feedback}"</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border/50 flex justify-end">
              <Button onClick={onClose} className="h-9 px-6 rounded-xl text-[11px] font-semibold uppercase tracking-wider">Close Audit</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function MentorInternshipsPage() {
  const {
    internships, internshipDetail, searchQuery, statusFilter, typeFilter,
    paidFilter, departmentFilter, yearFilter, page, total, totalPages,
    isLoading, fetchInternships, fetchInternshipDetail, setSearchQuery, setStatusFilter,
    setTypeFilter, setPaidFilter, setDepartmentFilter, setYearFilter,
    setPage, resetFilters, closeDetail,
  } = useMentorInternshipsStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships, searchQuery, statusFilter, typeFilter, paidFilter, departmentFilter, yearFilter, page]);

  const hasFilters = searchQuery || statusFilter || typeFilter || paidFilter || departmentFilter || yearFilter;

  const STATUS_PILLS = [
    { val: '', label: 'All Status' },
    { val: 'APPROVED', label: 'Approved' },
    { val: 'PENDING', label: 'Pending Audit' },
    { val: 'REJECTED', label: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Internships"
        subtitle="Manage and verify professional work experiences"
      />

      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* Policy Section */}
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
                placeholder="Search companies or roles..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(tempSearch)}
                className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/40">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/10 border-border/60 text-xs font-semibold uppercase tracking-wider">
                <SelectValue placeholder="All Work Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paidFilter} onValueChange={setPaidFilter}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/10 border-border/60 text-xs font-semibold uppercase tracking-wider">
                <SelectValue placeholder="All Stipends" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="true">Paid</SelectItem>
                <SelectItem value="false">Unpaid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/10 border-border/60 text-xs font-semibold uppercase tracking-wider">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Depts</SelectItem>
                <SelectItem value="CSE">Computer Science</SelectItem>
                <SelectItem value="ECE">Electronics</SelectItem>
                <SelectItem value="ME">Mechanical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/10 border-border/60 text-xs font-semibold uppercase tracking-wider">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="3rd">3rd Year</SelectItem>
                <SelectItem value="4th">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasFilters && (
            <div className="flex justify-end border-t border-border/40 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  resetFilters();
                  setTempSearch('');
                }}
                className="h-8 rounded-xl text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-destructive gap-2"
              >
                <X className="w-4 h-4" /> Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Internships Table */}
        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-foreground/[0.01] border-b border-border/40">
                  {['Company & Role', 'Student Identity', 'Configuration', 'Internship Term', 'Status', 'Actions'].map((h) => (
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
                ) : internships.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      No Internship Records Found
                    </td>
                  </tr>
                ) : (
                  internships.map((intern: any, idx: number) => (
                    <motion.tr
                      key={intern.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition-colors cursor-pointer"
                      onClick={() => fetchInternshipDetail(intern.id)}
                    >
                      <td className="px-6 py-4 align-middle min-w-[280px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate max-w-[200px]">{intern.companyName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">{intern.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div>
                          <p className="text-sm font-semibold">{intern.student?.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">{intern.student?.department}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[9px] font-semibold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                            {intern.type}
                          </span>
                          <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${intern.paid ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' : 'bg-muted/10 text-muted-foreground border-border/40'}`}>
                            {intern.paid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-[10px] font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-primary/60" />
                          {fmt(intern.from)} — {fmt(intern.to)}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <StatusBadge status={intern.status} />
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchInternshipDetail(intern.id);
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Reviewing <span className="text-primary">{internships.length}</span> of {total} records
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

      <InternshipDetailModal
        internship={internshipDetail}
        onClose={closeDetail}
      />
    </div>
  );
}
