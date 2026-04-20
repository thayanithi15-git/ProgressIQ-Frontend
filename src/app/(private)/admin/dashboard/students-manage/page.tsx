"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Plus, Edit, Trash2, ChevronLeft, ChevronRight, X, UserPlus, Upload,
  Mail, GraduationCap, Briefcase, Award, Zap, AlertCircle, Eye, Users, FileSpreadsheet,
  Database, Info, Globe, Smartphone, MapPin, Calendar, Heart, Shield
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useStudentManagementStore,
  CreateStudentPayload,
  UpdateStudentPayload,
} from "@/store/admin/student-manage";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: {
    label: "Active",
    color: "#059669",
    bg: "rgba(16, 185, 129, 0.12)",
  },
  INACTIVE: {
    label: "Inactive",
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.12)",
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const meta = status?.toUpperCase() === "ACTIVE" ? STATUS_META.ACTIVE : STATUS_META.INACTIVE;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
};

export default function StudentListPage() {
  const router = useRouter();
  const {
    students, total, isLoading, currentPage, pageSize, filters,
    fetchStudents, setCurrentPage, setPageSize, setFilters,
    deleteStudent, createStudent, updateStudent, resetFilters,
    fetchStudentById,
  } = useStudentManagementStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState<string | null>(null);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [createFormData, setCreateFormData] = useState<Partial<CreateStudentPayload>>({
    email: "", password: "", firstName: "", lastName: "", phone: "", dob: "",
    gender: "Male", department: "", year: "1", place: "", parentName: "",
    parentPhone: "", academicYear: "", rollNo: "", cgpa: 0, arrearCount: 0,
    familyIncome: "", goodAt: [],
  });

  const [editFormData, setEditFormData] = useState<UpdateStudentPayload>({});

  useEffect(() => {
    fetchStudents(1, pageSize);
  }, [fetchStudents, pageSize]);

  const handleCreateStudent = async () => {
    await createStudent(createFormData as CreateStudentPayload);
    setIsCreateDialogOpen(false);
    setCreateFormData({
      email: "", password: "", firstName: "", lastName: "", phone: "", dob: "",
      gender: "Male", department: "", year: "1", place: "", parentName: "",
      parentPhone: "", academicYear: "", rollNo: "", cgpa: 0, arrearCount: 0,
      familyIncome: "", goodAt: [],
    });
  };

  const handleEditStudent = (studentId: string) => {
    const student = students.find(s => s._id === studentId);
    if (student) {
      setSelectedStudentForEdit(studentId);
      setEditFormData({
        firstName: student.firstName, lastName: student.lastName, phone: student.phone,
        parentName: student.parentName, parentPhone: student.parentPhone, place: student.place,
        department: student.department, year: student.year, academicYear: student.academicYear,
        rollNo: student.rollNo, cgpa: student.cgpa, arrearCount: student.arrearCount,
        familyIncome: student.familyIncome, goodAt: student.goodAt, status: student.status,
        rewardPoints: student.rewardPoints,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (selectedStudentForEdit) {
      await updateStudent(selectedStudentForEdit, editFormData);
      setIsEditDialogOpen(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalNotification />
      <Header
        title="Student Directory"
        subtitle="Manage academic profiles and performance metrics"
      />

      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="h-11 rounded-xl px-6 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <UserPlus size={16} /> Add student
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsBulkUploadDialogOpen(true)}
              className="h-11 rounded-xl px-6 border-border/60 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2 hover:bg-muted/50 transition-all"
            >
              <Upload size={16} /> Bulk Upload
            </Button>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setFilters({ ...filters, searchName: e.target.value });
              }}
              className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60"
            />
          </div>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Department</Label>
              <Select value={filters.department || "all"} onValueChange={(v) => setFilters({ ...filters, department: v === "all" ? undefined : v })}>
                <SelectTrigger className="h-10 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Academic Year</Label>
              <Select value={filters.year || "all"} onValueChange={(v) => setFilters({ ...filters, year: v === "all" ? undefined : v })}>
                <SelectTrigger className="h-10 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Status</Label>
              <Select value={filters.status || "all"} onValueChange={(v) => setFilters({ ...filters, status: v === "all" ? undefined : v })}>
                <SelectTrigger className="h-10 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active Only</SelectItem>
                  <SelectItem value="Inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="h-10 w-full rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors border border-transparent hover:border-destructive/20"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse min-w-[1600px]">
              <thead>
                <tr className="bg-foreground/[0.02] border-b border-border/40">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Student Profile</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Academic Context</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Performance Metrics</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Family & Origin</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Skills & Socials</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td colSpan={7} className="px-6 py-5"><Skeleton className="h-12 w-full rounded-xl" /></td>
                    </tr>
                  ))
                ) : (
                  students.map((student, idx) => (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.01 }}
                      className="group border-b border-border/40 hover:bg-foreground/[0.01] transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/dashboard/students-manage/${student._id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
                            <GraduationCap className="text-primary w-5 h-5" />
                          </div>
                          <div className="min-w-0 max-w-[180px]">
                            <p className="text-sm font-semibold truncate text-foreground">{student.firstName} {student.lastName}</p>
                            <p className="text-[10px] text-muted-foreground truncate mb-1">{student.userId?.email || "No Email"}</p>
                            <div className="flex items-center gap-2">
                               <Badge variant="outline" className={`h-4 text-[8px] px-1.5 uppercase tracking-tighter ${student.gender?.toUpperCase() === 'MALE' ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' : 'border-pink-500/20 text-pink-500 bg-pink-500/5'}`}>
                                 {student.gender || "—"}
                               </Badge>
                               <span className="text-[9px] text-muted-foreground font-medium italic">
                                 {student.dob ? new Date(student.dob).toLocaleDateString('en-GB') : "—"}
                               </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="min-w-[120px]">
                          <p className="text-[11px] font-black text-foreground font-mono mb-0.5 tracking-tight">{student.rollNo || "N/A"}</p>
                          <p className="text-[10px] font-bold text-primary/80 uppercase">{student.department}</p>
                          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">{student.year} • {student.academicYear}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center p-1.5 rounded-lg bg-muted/30 border border-border/40 min-w-[50px]">
                            <span className="text-[10px] font-black text-primary leading-none">{student.cgpa || "0.0"}</span>
                            <span className="text-[7px] text-muted-foreground uppercase font-black tracking-tighter mt-1">GPA</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Badge variant="outline" className={`h-4 rounded-md text-[8px] font-black px-1.5 ${student.arrearCount > 0 ? "border-destructive/20 text-destructive bg-destructive/5" : "border-emerald-500/20 text-emerald-500 bg-emerald-500/5 shadow-none"}`}>
                              {student.arrearCount || 0} ARREARS
                            </Badge>
                            <div className="flex items-center gap-1">
                               <Zap size={10} className="text-amber-500 fill-amber-500" />
                               <span className="text-[10px] font-black text-foreground">{student.rewardPoints || 0}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="min-w-[160px] space-y-1">
                           <div className="flex items-center gap-2">
                             <Heart size={10} className="text-muted-foreground" />
                             <span className="text-[10px] font-bold text-foreground truncate">{student.parentName || "—"}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Smartphone size={10} className="text-muted-foreground" />
                             <span className="text-[9px] font-medium text-muted-foreground font-mono">{student.parentPhone || "—"}</span>
                           </div>
                           <div className="flex items-center gap-3 pt-0.5">
                              <span className="text-[9px] font-black text-primary flex items-center gap-1 uppercase tracking-tighter">
                                <MapPin size={8} /> {student.place || "—"}
                              </span>
                              <span className="text-[9px] font-black text-muted-foreground flex items-center gap-1 uppercase tracking-tighter">
                                <Database size={8} /> ₹{student.familyIncome || "—"}
                              </span>
                           </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="min-w-[140px] space-y-2">
                           <div className="flex flex-wrap gap-1">
                              {student.goodAt && student.goodAt.length > 0 ? (
                                student.goodAt.map((skill, i) => (
                                  <Badge key={i} variant="secondary" className="h-4 text-[7px] font-black uppercase tracking-tight bg-primary/5 text-primary border-none">
                                    {skill}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-[8px] text-muted-foreground italic uppercase">No Skills Listed</span>
                              )}
                           </div>
                           <div className="flex items-center gap-2 pt-1 border-t border-border/20">
                              {student.socials?.github && (
                                <a href={student.socials.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-muted rounded-md transition-colors">
                                  <Globe size={11} className="text-foreground/70" />
                                </a>
                              )}
                              {student.socials?.linkedin && (
                                <a href={student.socials.linkedin} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-muted rounded-md transition-colors">
                                  <Shield size={11} className="text-blue-500" />
                                </a>
                              )}
                              {student.socials?.leetcode && (
                                <a href={student.socials.leetcode} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-muted rounded-md transition-colors">
                                  <Zap size={11} className="text-amber-600" />
                                </a>
                              )}
                              {student.socials?.portfolio && (
                                <a href={student.socials.portfolio} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-muted rounded-md transition-colors">
                                  <Eye size={11} className="text-primary" />
                                </a>
                              )}
                           </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={student.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditStudent(student._id); }}
                            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedStudentForDelete(student._id); setIsDeleteDialogOpen(true); }}
                            className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-border/40">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Total <span className="text-primary">{total}</span> student profiles
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-bold uppercase tracking-wider"
              >
                <ChevronLeft size={14} className="mr-1" /> Previous
              </Button>
              <span className="text-xs font-bold text-muted-foreground px-2">{currentPage} / {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-bold uppercase tracking-wider"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="modal-sheet max-w-2xl p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40 bg-foreground/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                <UserPlus size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Add New Student</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Create system credential & profile</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsCreateDialogOpen(false)} className="rounded-full w-8 h-8">
              <X size={16} />
            </Button>
          </div>
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/20 p-1 rounded-xl">
                <TabsTrigger value="account" className="rounded-lg text-[10px] font-bold uppercase tracking-wider">Account</TabsTrigger>
                <TabsTrigger value="personal" className="rounded-lg text-[10px] font-bold uppercase tracking-wider">Personal</TabsTrigger>
                <TabsTrigger value="academic" className="rounded-lg text-[10px] font-bold uppercase tracking-wider">Academic</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Institutional Email</Label>
                    <Input
                      className="h-11 rounded-xl bg-muted/20 border-border/40"
                      placeholder="student@progress.edu"
                      value={createFormData.email}
                      onChange={e => setCreateFormData({...createFormData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Access Password</Label>
                    <Input
                      className="h-11 rounded-xl bg-muted/20 border-border/40"
                      type="password"
                      placeholder="••••••••"
                      value={createFormData.password}
                      onChange={e => setCreateFormData({...createFormData, password: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">First Name</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" value={createFormData.firstName} onChange={e => setCreateFormData({...createFormData, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Last Name</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" value={createFormData.lastName} onChange={e => setCreateFormData({...createFormData, lastName: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Contact Phone</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" value={createFormData.phone} onChange={e => setCreateFormData({...createFormData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Date of Birth</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" type="date" value={createFormData.dob} onChange={e => setCreateFormData({...createFormData, dob: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Gender</Label>
                    <Select value={createFormData.gender} onValueChange={v => setCreateFormData({...createFormData, gender: v as any})}>
                      <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-[11px] font-semibold uppercase tracking-wider"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Place / City</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" value={createFormData.place} onChange={e => setCreateFormData({...createFormData, place: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Parent Name</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" value={createFormData.parentName} onChange={e => setCreateFormData({...createFormData, parentName: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Parent Phone</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" value={createFormData.parentPhone} onChange={e => setCreateFormData({...createFormData, parentPhone: e.target.value})} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Department</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" value={createFormData.department} onChange={e => setCreateFormData({...createFormData, department: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Current Year</Label>
                    <Select value={createFormData.year} onValueChange={v => setCreateFormData({...createFormData, year: v})}>
                      <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-[11px] font-semibold uppercase tracking-wider"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Academic Year</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" placeholder="e.g. 2021-2025" value={createFormData.academicYear} onChange={e => setCreateFormData({...createFormData, academicYear: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Roll No</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" value={createFormData.rollNo} onChange={e => setCreateFormData({...createFormData, rollNo: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Current CGPA</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" type="number" step="0.01" value={createFormData.cgpa} onChange={e => setCreateFormData({...createFormData, cgpa: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Family Income</Label>
                    <Input className="h-11 rounded-xl bg-muted/20 border-border/40" value={createFormData.familyIncome} onChange={e => setCreateFormData({...createFormData, familyIncome: e.target.value})} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="p-4 border-t border-border/40 bg-foreground/[0.01] flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-bold tracking-widest">Cancel</Button>
            <Button onClick={handleCreateStudent} className="rounded-xl h-10 px-8 bg-primary text-primary-foreground uppercase text-[10px] font-bold tracking-widest shadow-md">Create Profile</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="modal-sheet max-w-2xl p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40 bg-foreground/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Edit size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Modify Profile</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Update academic & credentials</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(false)} className="rounded-full w-8 h-8">
              <X size={16} />
            </Button>
          </div>
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
             <div className="grid grid-cols-2 gap-x-6 gap-y-5">
               <div className="space-y-1.5">
                 <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">First Name</Label>
                 <Input className="h-11 rounded-xl bg-muted/20 border-border/60" value={editFormData.firstName || ""} onChange={e => setEditFormData({...editFormData, firstName: e.target.value})} />
               </div>
               <div className="space-y-1.5">
                 <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Last Name</Label>
                 <Input className="h-11 rounded-xl bg-muted/20 border-border/60" value={editFormData.lastName || ""} onChange={e => setEditFormData({...editFormData, lastName: e.target.value})} />
               </div>
               <div className="space-y-1.5">
                 <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Department</Label>
                 <Input className="h-11 rounded-xl bg-muted/20 border-border/60" value={editFormData.department || ""} onChange={e => setEditFormData({...editFormData, department: e.target.value})} />
               </div>
               <div className="space-y-1.5">
                 <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Status Access</Label>
                 <Select value={editFormData.status || "Active"} onValueChange={v => setEditFormData({...editFormData, status: v})}>
                    <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/60 text-[11px] font-semibold uppercase tracking-wider"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active Credentials</SelectItem>
                      <SelectItem value="Inactive">Suspended</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
               <div className="col-span-2 pt-4">
                 <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                   <div className="flex items-center justify-between mb-4">
                      <Label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="fill-primary" /> Reward Ecosystem</Label>
                      <span className="text-xs font-bold text-primary underline underline-offset-4">{editFormData.rewardPoints || 0} Points</span>
                   </div>
                   <Input
                      type="number"
                      className="h-11 rounded-xl bg-background border-primary/20 focus-visible:ring-primary/20"
                      placeholder="Adjust rewards balance"
                      value={editFormData.rewardPoints || 0}
                      onChange={e => setEditFormData({...editFormData, rewardPoints: parseInt(e.target.value) || 0})}
                   />
                 </div>
               </div>
             </div>
          </div>
          <div className="p-4 border-t border-border/40 bg-foreground/[0.01] flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-bold tracking-widest">Discard</Button>
            <Button onClick={handleSaveEdit} className="rounded-xl h-10 px-8 bg-primary text-primary-foreground uppercase text-[10px] font-bold tracking-widest shadow-md">Apply Edits</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
        <DialogContent className="modal-sheet max-w-3xl p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40 bg-foreground/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <FileSpreadsheet size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Bulk Enrollment</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Excel / CSV Context Intake</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const ws = XLSX.utils.json_to_sheet([
                  { Email: "student1@example.com", Password: "pass", FirstName: "John", LastName: "Doe", Phone: "9876543210", DOB: "2002-01-01", Gender: "Male", Department: "CSE", Year: "3rd Year", Place: "Chennai", ParentName: "Parent A", ParentPhone: "9876543211", AcademicYear: "2021-2025", RollNo: "21CS001", CGPA: 8.5, ArrearCount: 0 }
                ]);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Students Template");
                XLSX.writeFile(wb, "Student_Bulk_Template.xlsx");
              }}
              className="h-9 rounded-xl border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest bg-primary/5 hover:bg-primary/10 transition-all gap-2"
            >
              <Database size={14} /> Download Template
            </Button>
          </div>
          <div className="p-8 text-center space-y-6">
            <div className="mb-6">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 text-left">Protocol Map (Required Headers)</p>
                <div className="bg-muted/30 border border-border/40 rounded-2xl overflow-hidden shadow-inner">
                    <table className="w-full text-left text-[10px] border-collapse">
                        <thead className="bg-foreground/[0.03]">
                            <tr>
                                {["Email", "FirstName", "LastName", "RollNo", "Department"].map(h => (
                                    <th key={h} className="px-4 py-2 font-black text-muted-foreground uppercase tracking-widest border-r border-border/40 last:border-0">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border/40">
                                {["alex@edu.com", "Alex", "V", "21CS101", "CSE"].map((v, i) => (
                                    <td key={i} className="px-4 py-2 font-mono text-muted-foreground/60 border-r border-border/40 last:border-0 italic">{v}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col items-center py-8 px-4 rounded-3xl border-2 border-dashed border-primary/20 bg-primary/[0.02]">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                    <Upload className="text-primary w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1 uppercase tracking-tight">Upload Telemetry File</h4>
                <p className="text-[11px] text-muted-foreground font-medium mb-6">Select a .xlsx or .csv student manifest</p>
                <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden" id="bulk-file-input"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            console.log("File detected:", file.name);
                        }
                    }}
                />
                <Label htmlFor="bulk-file-input" className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] flex items-center cursor-pointer hover:shadow-lg transition-all shadow-md">
                    Select Manifest
                </Label>
            </div>
            <p className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-[0.1em]">Supported protocols: XLSX, XLSM, CSV (UTF-8)</p>
          </div>
          <div className="p-4 border-t border-border/40 bg-foreground/[0.01] flex justify-end">
            <Button variant="ghost" onClick={() => setIsBulkUploadDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-bold tracking-widest">Abort Intake</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="modal-sheet p-0 overflow-hidden max-w-md">
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
              <AlertCircle size={32} className="text-destructive" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">Purge Profile?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">This will erase all academic history and access credentials for the selected student. This is irreversible.</p>
            </div>
          </div>
          <div className="p-4 border-t border-border/40 bg-foreground/[0.01] flex justify-center gap-3">
            <AlertDialogCancel className="rounded-xl h-10 px-6 border-border shadow-none text-[10px] font-bold uppercase tracking-widest">Abort</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}