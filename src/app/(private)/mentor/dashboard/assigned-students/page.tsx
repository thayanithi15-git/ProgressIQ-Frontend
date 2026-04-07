'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, ArrowUpDown, X, Download, Github, Linkedin, Code, Terminal, Link2, Globe, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAssignedStudentsStore } from '@/store/mentor/assignedStudents';

import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from '@/components/ui/select';

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: {
    label: "Active",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
  },
  INACTIVE: {
    label: "Inactive",
    color: "#dc2626",
    bg: "rgba(239, 68, 68, 0.12)",
  },
  PENDING: {
    label: "Pending",
    color: "#6b7280",
    bg: "rgba(107, 114, 128, 0.12)",
  },
};

const StatusBadge = ({ status }: { status?: string }) => {
  const key = status?.toUpperCase() || 'PENDING';
  const meta = STATUS_META[key] || STATUS_META.PENDING;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
};

const StudentProfileModal = ({ student, onClose }: any) => {
  if (!student) return null;

  const { profile, stats, recent } = student;

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-none p-0 bg-transparent shadow-none">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-5 border-b border-border/50 bg-foreground/[0.02] flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">Student Profile</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Complete student metrics</DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            <div className="relative overflow-hidden bg-primary/[0.03] border border-primary/10 rounded-2xl p-6">
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 uppercase tracking-wider">{profile.department}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Year {profile.year}</span>
                    <StatusBadge status={profile.status} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-3xl font-semibold text-primary tracking-tighter">
                    <Zap className="w-6 h-6 fill-primary" />
                    {stats.totalPoints}
                  </div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Total Points</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Projects", val: stats.projects.approved, sub: `${stats.projects.pending} Pending` },
                { label: "Tasks", val: stats.tasks.approved, sub: `${stats.tasks.pending} Pending` },
                { label: "Internships", val: stats.internships.approved, sub: `${stats.internships.pending} Pending` },
                { label: "Certs", val: stats.certifications.approved, sub: `${stats.certifications.pending} Pending` },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-2xl font-semibold text-foreground tracking-tight">{s.val}</p>
                  <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-foreground/[0.01] border-b border-border/40">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Personal & Academic Details</p>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                {[
                  { label: "Phone", val: profile.phone },
                  { label: "Location", val: profile.place },
                  { label: "Academic Year", val: profile.academicYear },
                  { label: "Roll No", val: profile.rollNo, className: "uppercase" },
                  { label: "CGPA", val: profile.cgpa?.toFixed(2), textClass: "text-primary font-semibold" },
                  { label: "Arrears", val: profile.arrearCount, textClass: profile.arrearCount > 0 ? "text-destructive" : "text-emerald-600" },
                  { label: "Family Income", val: profile.familyIncome },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className={`text-sm font-semibold text-foreground ${item.className || ""} ${item.textClass || ""}`}>{item.val || "—"}</p>
                  </div>
                ))}
              </div>

              {profile.goodAt && profile.goodAt.length > 0 && (
                <div className="px-4 py-4 border-t border-border/40 bg-foreground/[0.01]">
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Core Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.goodAt.map((skill: string, i: number) => (
                      <span key={i} className="text-[10px] font-semibold px-3 py-1 rounded-lg bg-background border border-border text-muted-foreground uppercase hover:border-primary/30 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function AssignedStudentsPage() {
  const {
    students,
    selectedStudent,
    searchQuery,
    department,
    year,
    status,
    minPoints,
    maxPoints,
    sortBy,
    sortOrder,
    page,
    total,
    totalPages,
    isLoading,
    isLoadingProfile,
    fetchStudents,
    fetchStudentProfile,
    setSearchQuery,
    setDepartment,
    setYear,
    setStatus,
    setMinPoints,
    setSortBy,
    setSortOrder,
    setPage,
    resetFilters,
    closeProfileModal,
    rollNo,
    setRollNo,
  } = useAssignedStudentsStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);

  useEffect(() => {
    fetchStudents();
  }, [searchQuery, department, year, status, minPoints, maxPoints, page, sortBy, sortOrder, rollNo, fetchStudents]);

  const hasActiveFilters = searchQuery || department || year || status || minPoints !== null || rollNo;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(tempSearch);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Students"
        subtitle="View and monitor your assigned students"
        HeaderComp={
          <div className="flex gap-2">
            <Button size="sm" className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold uppercase tracking-wider text-[11px]">
              <Download size={14} />
              Export
            </Button>
          </div>
        }
      />

      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email or roll number..."
                value={tempSearch}
                onChange={handleSearch}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                className="pl-10 h-11 rounded-xl border-border/60 bg-muted/20 focus-visible:ring-primary/20"
              />
            </div>
            <Button onClick={handleSearchSubmit} className="h-11 px-6 rounded-xl gap-2 font-semibold uppercase tracking-wider text-xs">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="h-10 rounded-xl border-border/60 bg-muted/10 text-xs font-semibold uppercase tracking-wider">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CSE">Computer Science</SelectItem>
                <SelectItem value="ECE">Electronics</SelectItem>
                <SelectItem value="ME">Mechanical</SelectItem>
                <SelectItem value="CE">Civil</SelectItem>
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="h-10 rounded-xl border-border/60 bg-muted/10 text-xs font-semibold uppercase tracking-wider">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1st">1st Year</SelectItem>
                <SelectItem value="2nd">2nd Year</SelectItem>
                <SelectItem value="3rd">3rd Year</SelectItem>
                <SelectItem value="4th">4th Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 rounded-xl border-border/60 bg-muted/10 text-xs font-semibold uppercase tracking-wider">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Min Points"
              value={minPoints ?? ''}
              onChange={(e) => setMinPoints(e.target.value ? Number(e.target.value) : null)}
              className="h-10 rounded-xl border-border/60 bg-muted/10 text-xs font-semibold"
            />

            <Input
              placeholder="Roll No"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="h-10 rounded-xl border-border/60 bg-muted/10 text-xs font-semibold"
            />

            {hasActiveFilters && (
              <Button variant="ghost" onClick={resetFilters} className="h-10 rounded-xl gap-2 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground hover:text-destructive">
                <X className="w-4 h-4" />
                Reset Filters
              </Button>
            )}
          </div>
        </motion.div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Mentees Overview <span className="ml-2 text-primary/40 font-mono tracking-tighter">({total} total)</span>
          </p>
          <div className="flex gap-3">
            <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <SelectTrigger className="w-44 h-9 rounded-xl border-border/60 bg-background text-[11px] font-semibold uppercase tracking-widest">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="points">Sort by Points</SelectItem>
                <SelectItem value="department">Sort by Department</SelectItem>
                <SelectItem value="year">Sort by Year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="h-9 px-4 rounded-xl border-border/60 gap-2 font-semibold uppercase tracking-wider text-[10px]"
            >
              <ArrowUpDown className="w-4 h-4 text-primary" />
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-foreground/[0.01] border-b border-border/40">
                  {["Student", "Roll No", "Department", "Year", "CGPA", "Points", "Status", "Joined", "Action"].map((h) => (
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
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className="px-6 py-5">
                          <Skeleton className="h-4 w-full rounded-lg" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      No Records Located
                    </td>
                  </tr>
                ) : (
                  students.map((student, idx) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-[10px] font-semibold text-primary border border-primary/10">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-[11px] font-semibold text-primary tracking-tighter uppercase">
                        {student.rollNo || '—'}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 uppercase tracking-wider">
                          {student.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle text-xs font-semibold text-muted-foreground">
                        {student.year}
                      </td>
                      <td className="px-6 py-4 align-middle text-xs font-semibold text-foreground tracking-tight">
                        {student.cgpa?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-1.5 px-6 py-4 align-middle text-xs font-semibold text-muted-foreground">
                          <Zap className="w-4 h-4 fill-primary" />
                          {student.points.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <StatusBadge status={student.status} />
                      </td>
                      <td className="px-6 py-4 align-middle text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        {(student as any).createdAt ? new Date((student as any).createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => fetchStudentProfile(student.id)}
                          disabled={isLoadingProfile}
                          className="h-8 px-4 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 text-[10px] font-semibold uppercase tracking-widest gap-2"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
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
          <div className="flex items-center justify-between mt-8 border-t border-border/40 pt-6">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Page <span className="text-primary">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="h-9 px-4 rounded-xl border-border/40 bg-background gap-2 font-semibold uppercase tracking-wider text-[10px]"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="h-9 px-4 rounded-xl border-border/40 bg-background gap-2 font-semibold uppercase tracking-wider text-[10px]"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <StudentProfileModal student={selectedStudent} onClose={closeProfileModal} />
    </div>
  );
}
