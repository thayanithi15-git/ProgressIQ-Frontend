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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAssignedStudentsStore } from '@/store/mentor/assignedStudents';
// import { MentorHeader } from '@/components/mentor/header';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from '@/components/ui/select';

const statusBadgeClass = (status?: string) => {
  if (status === 'Active') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (status === 'Inactive') return 'bg-rose-100 text-rose-700 border-rose-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const StudentProfileModal = ({ student, onClose }: any) => {
  if (!student) return null;

  const { profile, stats, recent } = student;

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins">Student Profile</DialogTitle>
          <DialogDescription className="font-poppins">Complete student information and statistics</DialogDescription>
        </DialogHeader>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold font-poppins mb-2">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-muted-foreground font-poppins mb-3">{profile.email}</p>
              <div className="flex gap-4 text-sm font-poppins">
                <span className="font-medium">{profile.department}</span>
                <span className="text-muted-foreground">Year {profile.year}</span>
                <Badge variant="outline" className={statusBadgeClass(profile.status)}>
                  {profile.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-600 font-poppins flex items-center justify-end gap-2">
                <Zap className="w-6 h-6 fill-amber-600" />
                {stats.totalPoints}
              </p>
              <p className="text-sm text-muted-foreground font-poppins">Total Points</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2 font-poppins">Projects</p>
              <p className="text-2xl font-bold font-poppins">{stats.projects.approved}</p>
              <p className="text-xs text-muted-foreground mt-1 font-poppins">
                {stats.projects.pending} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2 font-poppins">Tasks</p>
              <p className="text-2xl font-bold font-poppins">{stats.tasks.approved}</p>
              <p className="text-xs text-muted-foreground mt-1 font-poppins">
                {stats.tasks.pending} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2 font-poppins">Internships</p>
              <p className="text-2xl font-bold font-poppins">{stats.internships.approved}</p>
              <p className="text-xs text-muted-foreground mt-1 font-poppins">
                {stats.internships.pending} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2 font-poppins">Certifications</p>
              <p className="text-2xl font-bold font-poppins">{stats.certifications.approved}</p>
              <p className="text-xs text-muted-foreground mt-1 font-poppins">
                {stats.certifications.pending} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-poppins">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-poppins">Phone</p>
                <p className="font-medium font-poppins">{profile.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-poppins">Location</p>
                <p className="font-medium font-poppins">{profile.place || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-poppins">Academic Year</p>
                <p className="font-medium font-poppins">{profile.academicYear || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-poppins">Roll No</p>
                <p className="font-medium font-poppins uppercase">{profile.rollNo || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-poppins">CGPA</p>
                <p className="font-bold font-poppins text-blue-600">{profile.cgpa || '0.00'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-poppins">Arrears</p>
                <p className={`font-bold font-poppins ${profile.arrearCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {profile.arrearCount || '0'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-poppins">Family Income</p>
                <p className="font-medium font-poppins">{profile.familyIncome || 'Not specified'}</p>
              </div>
            </div>
            {profile.goodAt && profile.goodAt.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2 font-poppins">Good At</p>
                <div className="flex flex-wrap gap-2">
                  {profile.goodAt.map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary" className="font-poppins">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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
    limit,
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
    setMaxPoints,
    setSortBy,
    setSortOrder,
    setPage,
    resetFilters,
    closeProfileModal,
    rollNo,
    familyIncome,
    minCgpa,
    maxArrears,
    goodAt,
    setRollNo,
    setFamilyIncome,
    setMinCgpa,
    setMaxArrears,
    setGoodAt,
  } = useAssignedStudentsStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);

  useEffect(() => {
    fetchStudents();
  }, [searchQuery, department, year, status, minPoints, maxPoints, page, sortBy, sortOrder, rollNo, familyIncome, minCgpa, maxArrears, goodAt]);

  const hasActiveFilters =
    searchQuery || department || year || status || minPoints !== null || maxPoints !== null || rollNo || familyIncome || minCgpa !== null || maxArrears !== null || goodAt;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(tempSearch);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
          // subtitle={student ? `Welcome back, ${student.name.split(" ")[0]}! Keep up the great work.` : "Welcome back!"}
          HeaderComp={
            <div style={{ display: "flex", gap: 10 }}>
              <Button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: "var(--primary)", color: "var(--primary-foreground)" }}>
                <Download size={14} />
                Export
              </Button>
            </div>
          }
        />

      {/* Main Content */}
     <div className="h-[calc(100vh-80px)] bg-background p-6 flex flex-col gap-6 overflow-x-hidden">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="shadow-none">
            <CardContent className="p-6">
              {/* Search Bar */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={tempSearch}
                    onChange={handleSearch}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    className="pl-10 font-poppins"
                  />
                </div>
                <Button onClick={handleSearchSubmit} className="gap-2 font-poppins">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="CSE">Computer Science</SelectItem>
                    <SelectItem value="ECE">Electronics</SelectItem>
                    <SelectItem value="ME">Mechanical</SelectItem>
                    <SelectItem value="CE">Civil</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
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
                  className="font-poppins"
                />

                <Input
                  type="number"
                  placeholder="Max Points"
                  value={maxPoints ?? ''}
                  onChange={(e) => setMaxPoints(e.target.value ? Number(e.target.value) : null)}
                  className="font-poppins"
                />

                <Input
                  placeholder="Roll No"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="font-poppins"
                />

                <Input
                  type="number"
                  step="0.01"
                  placeholder="Min CGPA"
                  value={minCgpa ?? ''}
                  onChange={(e) => setMinCgpa(e.target.value ? Number(e.target.value) : null)}
                  className="font-poppins"
                />

                <Input
                  type="number"
                  placeholder="Max Arrears"
                  value={maxArrears ?? ''}
                  onChange={(e) => setMaxArrears(e.target.value ? Number(e.target.value) : null)}
                  className="font-poppins"
                />

                <Input
                  placeholder="Family Income"
                  value={familyIncome}
                  onChange={(e) => setFamilyIncome(e.target.value)}
                  className="font-poppins"
                />

                <Input
                  placeholder="Skills (Good At)"
                  value={goodAt}
                  onChange={(e) => setGoodAt(e.target.value)}
                  className="font-poppins"
                />

                {hasActiveFilters && (
                  <div className="flex items-end">
                    <Button variant="outline" onClick={resetFilters} className="gap-2 font-poppins w-full">
                      <X className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                )}
               </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-4"
        >
          <p className="text-sm text-muted-foreground font-poppins">
            Showing {students.length} of {total} students
          </p>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <SelectTrigger className="w-40 font-poppins">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-poppins">
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
              className="gap-2 font-poppins"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </Button>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-muted/50 border-b text-[13px]">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold font-poppins">Roll No</th>
                      <th className="px-6 py-3 text-left font-semibold font-poppins">Name</th>
                      <th className="px-6 py-3 text-left font-semibold font-poppins">Department</th>
                      <th className="px-6 py-3 text-center font-semibold font-poppins">Year</th>
                      <th className="px-6 py-3 text-center font-semibold font-poppins">CGPA</th>
                      <th className="px-6 py-3 text-center font-semibold font-poppins">Arrears</th>
                      <th className="px-6 py-3 text-right font-semibold font-poppins">Points</th>
                      <th className="px-6 py-3 text-center font-semibold font-poppins">Status</th>
                      <th className="px-6 py-3 text-center font-semibold font-poppins">Socials</th>
                      <th className="px-6 py-3 text-center font-semibold font-poppins">Joined</th>
                      <th className="px-6 py-3 text-center font-semibold font-poppins">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px]">
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b">
                          {[...Array(7)].map((_, j) => (
                            <td key={j} className="px-6 py-4">
                              <Skeleton className="h-4 w-20" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : students.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground font-poppins">
                          No students found
                        </td>
                      </tr>
                    ) : (
                      students.map((student, idx) => (
                        <motion.tr
                          key={student.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                           <td className="px-6 py-4 font-medium font-poppins text-blue-600 uppercase">
                            {student.rollNo || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold font-poppins">
                                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold font-poppins">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-poppins">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-poppins">{student.department}</td>
                          <td className="px-6 py-4 text-center font-poppins whitespace-nowrap">{student.year}</td>
                          <td className="px-6 py-4 text-center font-bold text-blue-600">
                            {student.cgpa?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-bold ${student.arrearCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {student.arrearCount || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold">
                            <div className="flex items-center justify-end gap-1.5 text-amber-600 font-poppins font-bold">
                              <Zap className="w-4 h-4 fill-amber-600" />
                              {student.points.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge
                              variant="outline"
                              className={`text-[11px] px-2 py-0 h-5 ${statusBadgeClass(student.status)}`}
                            >
                              {student.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            {student.socials && Object.values(student.socials).some(v => v) ? (
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {student.socials.linkedin && <a href={student.socials.linkedin.startsWith('http') ? student.socials.linkedin : `https://${student.socials.linkedin}`} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-[#0A66C2] hover:opacity-80"><Linkedin size={14} /></a>}
                                {student.socials.github && <a href={student.socials.github.startsWith('http') ? student.socials.github : `https://${student.socials.github}`} target="_blank" rel="noopener noreferrer" title="GitHub" className="text-foreground hover:opacity-80"><Github size={14} /></a>}
                                {student.socials.leetcode && <a href={student.socials.leetcode.startsWith('http') ? student.socials.leetcode : `https://${student.socials.leetcode}`} target="_blank" rel="noopener noreferrer" title="LeetCode" className="text-[#FFA116] hover:opacity-80"><Code size={14} /></a>}
                              </div>
                            ) : (
                              <div className="text-center text-[10px] text-muted-foreground italic">None</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-muted-foreground whitespace-nowrap">
                            {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => fetchStudentProfile(student.id)}
                              disabled={isLoadingProfile}
                              className="gap-2 font-poppins"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mt-6"
          >
            <p className="text-sm text-muted-foreground font-poppins">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="gap-2 font-poppins"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="gap-2 font-poppins"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Student Profile Modal */}
      <StudentProfileModal student={selectedStudent} onClose={closeProfileModal} />
    </div>
  );
}
