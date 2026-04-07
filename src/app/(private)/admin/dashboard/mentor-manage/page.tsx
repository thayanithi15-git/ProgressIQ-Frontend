"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical, UserPlus, Link2, Upload, FileSpreadsheet, Database,
  BarChart3, Search, Briefcase, Phone, MapPin, Users, Edit, Trash2,
  ChevronLeft, ChevronRight, X, AlertCircle
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  useMentorManagementStore,
  CreateMentorPayload,
  UpdateMentorPayload,
} from "@/store/admin/mentor-manage";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const DESIGNATION_META: Record<string, { label: string; color: string; bg: string }> = {
  "PROFESSOR": { label: "Professor", color: "#7c3aed", bg: "rgba(124, 58, 237, 0.12)" },
  "ASSOCIATE PROFESSOR": { label: "Assoc. Professor", color: "#2563eb", bg: "rgba(37, 99, 235, 0.12)" },
  "ASSISTANT PROFESSOR": { label: "Asst. Professor", color: "#059669", bg: "rgba(5, 150, 105, 0.12)" },
  "LECTURER": { label: "Lecturer", color: "#6b7280", bg: "rgba(107, 114, 128, 0.12)" },
};

const CHART_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#06b6d4", "#ec4899"];

const DesignationBadge = ({ designation }: { designation: string }) => {
  const meta = DESIGNATION_META[designation?.toUpperCase()] || { label: designation, color: "#6b7280", bg: "rgba(107, 114, 128, 0.12)" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
};

export default function MentorListPage() {
  const router = useRouter();
  const {
    mentors, total, isLoading, currentPage, pageSize, totalPages, filters,
    fetchMentors, setCurrentPage, setPageSize, setFilters,
    deleteMentor, createMentor, updateMentor, resetFilters,
    fetchMentorById, students, studentsLoading, fetchStudentsForMapping,
    mapStudentsToMentor,
  } = useMentorManagementStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [selectedMentorForDelete, setSelectedMentorForDelete] = useState<string | null>(null);
  const [selectedMentorForEdit, setSelectedMentorForEdit] = useState<string | null>(null);
  const [selectedMentorForMapping, setSelectedMentorForMapping] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);

  const [createFormData, setCreateFormData] = useState<Partial<CreateMentorPayload>>({
    name: "", email: "", contactNo: "", place: "", department: "", designation: "",
  });

  const [editFormData, setEditFormData] = useState<UpdateMentorPayload>({});

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchMentors(1, pageSize);
  }, [fetchMentors, pageSize]);

  const handleViewProfile = (mentorId: string) => {
    router.push(`/admin/dashboard/mentor-manage/${mentorId}`);
  };

  const handleSaveEdit = async () => {
    if (selectedMentorForEdit) {
      await updateMentor(selectedMentorForEdit, editFormData);
      setIsEditDialogOpen(false);
      setSelectedMentorForEdit(null);
    }
  };

  if (!mounted) return null;

  const handleCreateMentor = async () => {
    await createMentor(createFormData as CreateMentorPayload);
    setIsCreateDialogOpen(false);
    setCreateFormData({ name: "", email: "", contactNo: "", place: "", department: "", designation: "" });
  };

  const handleEditMentor = (mentorId: string) => {
    const mentor = mentors.find(m => m._id === mentorId);
    if (mentor) {
      setSelectedMentorForEdit(mentorId);
      setEditFormData({
        name: mentor.name, email: mentor.email, contactNo: mentor.contactNo,
        place: mentor.place, department: mentor.department, designation: mentor.designation,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleOpenMappingDialog = async (mentorId: string) => {
    setSelectedMentorForMapping(mentorId);
    setSelectedStudents([]);
    setIsMappingDialogOpen(true);
    await fetchStudentsForMapping();
  };

  const handleMapStudents = async () => {
    if (selectedMentorForMapping && selectedStudents.length > 0) {
      await mapStudentsToMentor(selectedMentorForMapping, selectedStudents);
      setIsMappingDialogOpen(false);
    }
  };

  const departmentChartData = Object.entries(
    mentors.reduce((acc, m) => { acc[m.department] = (acc[m.department] || 0) + 1; return acc; }, {} as any)
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalNotification />
      <Header
        title="Faculty Management"
        subtitle="Orchestrate academic mentorship and faculty assignments"
      />

      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
               onClick={() => setIsCreateDialogOpen(true)}
               className="h-11 rounded-xl px-6 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <UserPlus size={16} /> Recruit Mentor
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsBulkUploadDialogOpen(true)}
              className="h-11 rounded-xl px-6 border-border/60 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2 hover:bg-muted/50 transition-all"
            >
              <Upload size={16} /> Bulk Upload
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowStats(!showStats)}
              className={`h-11 rounded-xl px-4 border-border/60 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2 transition-all ${showStats ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-muted/50'}`}
            >
              <BarChart3 size={16} />
            </Button>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search faculty by name..."
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setFilters({ ...filters, searchName: e.target.value });
              }}
              className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60"
            />
          </div>
        </div>

        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card className="bg-card border-border border shadow-sm rounded-2xl overflow-hidden p-6 md:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Departmental Distribution</h4>
                  <Badge variant="outline" className="text-[9px] font-bold">REAL-TIME DATA</Badge>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentChartData}
                        cx="50%" cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {departmentChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip
                         contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Legend
                        verticalAlign="middle" align="right" layout="vertical"
                        iconType="circle" iconSize={8}
                        formatter={(value) => <span className="text-[10px] font-bold text-muted-foreground uppercase ml-2">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="bg-card border-border border shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                <div>
                   <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Quick Statistics</h4>
                   <div className="space-y-4">
                     <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                       <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Total Active Mentors</p>
                       <p className="text-2xl font-black text-foreground">{total}</p>
                     </div>
                     <div className="p-4 rounded-xl bg-foreground/[0.02] border border-border/40">
                       <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Departments Represented</p>
                       <p className="text-2xl font-black text-foreground">{departmentChartData.length}</p>
                     </div>
                   </div>
                </div>
                <div className="pt-4 mt-auto border-t border-border/40 flex items-center justify-between">
                   <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted" />)}
                   </div>
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Expertise verified</span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Specialization</Label>
              <Select value={filters.department || "all"} onValueChange={(v) => setFilters({...filters, department: v === "all" ? undefined : v})}>
                <SelectTrigger className="h-10 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold">
                  <SelectValue placeholder="All Depts" />
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
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Designation</Label>
              <Select value={filters.designation || "all"} onValueChange={(v) => setFilters({...filters, designation: v === "all" ? undefined : v})}>
                <SelectTrigger className="h-10 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold">
                  <SelectValue placeholder="All Ranks" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="all">All Designations</SelectItem>
                   <SelectItem value="Professor">Professor</SelectItem>
                   <SelectItem value="Associate Professor">Associate Prof.</SelectItem>
                   <SelectItem value="Assistant Professor">Assistant Prof.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Geographic Hub</Label>
              <Select value={filters.place || "all"} onValueChange={(v) => setFilters({...filters, place: v === "all" ? undefined : v})}>
                <SelectTrigger className="h-10 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold">
                  <SelectValue placeholder="All Hubs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Places</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Coimbatore">Coimbatore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
               <Button
                variant="ghost"
                onClick={resetFilters}
                className="h-10 w-full rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors border border-transparent hover:border-destructive/20"
              >
                Reset Filter Context
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-foreground/[0.02] border-b border-border/40">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Faculty Identity</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Specialization</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rank/Role</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Contact</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Hub</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Assignment Tool</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td colSpan={5} className="px-6 py-4"><Skeleton className="h-12 w-full rounded-xl" /></td>
                    </tr>
                  ))
                ) : (
                  mentors.map((mentor, idx) => (
                    <motion.tr
                      key={mentor._id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.01 }}
                      className="group border-b border-border/40 hover:bg-foreground/[0.01] transition-colors cursor-pointer"
                      onClick={() => handleViewProfile(mentor._id)}
                    >
                      <td className="px-6 py-4 min-w-[300px]">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
                              <Briefcase className="text-primary w-5 h-5" />
                           </div>
                           <div className="min-w-0">
                             <p className="text-sm font-semibold truncate text-foreground">{mentor.name}</p>
                             <p className="text-[11px] text-muted-foreground truncate font-medium">{mentor.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="border-border/60 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-orange-500/[0.03] text-orange-600">
                          {mentor.department}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <DesignationBadge designation={mentor.designation} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                           <Phone size={12} className="text-muted-foreground/60" />
                           {mentor.contactNo || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                           <MapPin size={12} className="text-muted-foreground/60" />
                           {mentor.place}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button
                             variant="secondary"
                             size="sm"
                             onClick={(e) => { e.stopPropagation(); handleOpenMappingDialog(mentor._id); }}
                             className="h-8 rounded-lg bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 hover:bg-emerald-500/10 text-[9px] font-bold uppercase tracking-widest gap-1.5"
                           >
                             <Users size={12} /> Assign Students
                           </Button>
                           <button
                             onClick={(e) => { e.stopPropagation(); handleEditMentor(mentor._id); }}
                             className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-all"
                           >
                             <Edit size={16} />
                           </button>
                           <button
                             onClick={(e) => { e.stopPropagation(); setSelectedMentorForDelete(mentor._id); setIsDeleteDialogOpen(true); }}
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
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Reviewing <span className="text-primary">{mentors.length}</span> faculty profiles
             </p>
             <div className="flex items-center gap-2">
                <Button
                   variant="outline" size="sm"
                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                   disabled={currentPage === 1}
                   className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-bold"
                >
                  <ChevronLeft size={14} /> Back
                </Button>
                <span className="text-xs font-bold text-muted-foreground px-2">{currentPage} / {totalPages}</span>
                <Button
                   variant="outline" size="sm"
                   onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                   disabled={currentPage === totalPages}
                   className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-bold"
                >
                  Next <ChevronRight size={14} />
                </Button>
             </div>
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="modal-sheet max-w-xl p-0 overflow-hidden">
           <div className="px-6 py-4 border-b border-border/40 bg-foreground/[0.02] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Faculty Enrollment</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Institutional profile creation</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsCreateDialogOpen(false)} className="rounded-full w-8 h-8"><X size={16} /></Button>
           </div>
           <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Full Identity Name</Label>
                <Input className="h-11 rounded-xl bg-muted/20 border-border/60" value={createFormData.name} onChange={e => setCreateFormData({...createFormData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Educational Email</Label>
                   <Input className="h-11 rounded-xl bg-muted/20 border-border/60" value={createFormData.email} onChange={e => setCreateFormData({...createFormData, email: e.target.value})} />
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Contact Reference</Label>
                   <Input className="h-11 rounded-xl bg-muted/20 border-border/60" value={createFormData.contactNo} onChange={e => setCreateFormData({...createFormData, contactNo: e.target.value})} />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Department</Label>
                   <Input className="h-11 rounded-xl bg-muted/20 border-border/60" value={createFormData.department} onChange={e => setCreateFormData({...createFormData, department: e.target.value})} />
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Current Rank</Label>
                   <Select value={createFormData.designation} onValueChange={v => setCreateFormData({...createFormData, designation: v})}>
                     <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/60 text-[11px] font-bold uppercase tracking-wider"><SelectValue /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Professor">Professor</SelectItem>
                       <SelectItem value="Associate Professor">Associate Prof.</SelectItem>
                       <SelectItem value="Assistant Professor">Assistant Prof.</SelectItem>
                       <SelectItem value="Lecturer">Lecturer</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
              </div>
           </div>
           <div className="p-4 border-t border-border/40 bg-foreground/[0.01] flex justify-end gap-3">
             <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-bold tracking-widest">Discard</Button>
             <Button onClick={handleCreateMentor} className="rounded-xl h-10 px-8 bg-primary text-primary-foreground uppercase text-[10px] font-bold tracking-widest shadow-md">Complete Registration</Button>
           </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="modal-sheet max-w-xl p-0 overflow-hidden">
           <div className="px-6 py-4 border-b border-border/40 bg-foreground/[0.02]">
              <h3 className="text-base font-semibold text-foreground">Modify Credentials</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Audit faculty metadata</p>
           </div>
           <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Full Identity Name</Label>
                <Input className="h-11 rounded-xl bg-muted/20 border-border/60" value={editFormData.name || ""} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
              </div>
           </div>
           <div className="p-4 border-t border-border/40 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-bold tracking-widest">Cancel</Button>
              <Button onClick={handleSaveEdit} className="rounded-xl h-10 px-8 bg-primary text-primary-foreground uppercase text-[10px] font-bold tracking-widest">Apply Edits</Button>
           </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMappingDialogOpen} onOpenChange={setIsMappingDialogOpen}>
        <DialogContent className="modal-sheet max-w-2xl p-0 overflow-hidden">
           <div className="px-6 py-5 border-b border-border/40 bg-foreground/[0.02]">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                 <Link2 size={20} className="text-emerald-600" />
               </div>
               <div>
                  <h3 className="text-base font-semibold text-foreground">Relational Mapping</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Assign students to this mentor</p>
               </div>
             </div>
           </div>
           <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{selectedStudents.length} Students Selected</p>
                <div className="flex items-center gap-2">
                   <Checkbox
                      id="select-all"
                      className="rounded-md border-border/60"
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onCheckedChange={(checked) => setSelectedStudents(checked ? students.map(s => s._id) : [])}
                   />
                   <Label htmlFor="select-all" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer">Global Select</Label>
                </div>
              </div>
              <div className="max-h-[350px] overflow-y-auto border border-border/40 rounded-xl divide-y divide-border/40">
                {studentsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-6 w-full" /></div>)
                ) : students.length === 0 ? (
                  <div className="p-10 text-center text-[10px] font-bold text-muted-foreground uppercase">No unmapped students available</div>
                ) : (
                  students.map((student) => (
                    <div key={student._id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                       <div className="flex items-center gap-3 min-w-0">
                          <Checkbox
                            id={student._id}
                            className="rounded-md border-border/60"
                            checked={selectedStudents.includes(student._id)}
                            onCheckedChange={() => setSelectedStudents(prev => prev.includes(student._id) ? prev.filter(id => id !== student._id) : [...prev, student._id])}
                          />
                          <div className="min-w-0 cursor-pointer" onClick={() => setSelectedStudents(prev => prev.includes(student._id) ? prev.filter(id => id !== student._id) : [...prev, student._id])}>
                            <p className="text-xs font-semibold text-foreground truncate">{student.firstName} {student.lastName}</p>
                            <p className="text-[9px] text-muted-foreground uppercase font-bold">{student.department} • {student.year}</p>
                          </div>
                       </div>
                       <Badge variant="secondary" className="text-[8px] font-bold rounded-md bg-muted/40">{student.rollNo}</Badge>
                    </div>
                  ))
                )}
              </div>
           </div>
           <div className="p-4 border-t border-border/40 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsMappingDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-bold tracking-widest">Abort Mapping</Button>
              <Button
                onClick={handleMapStudents}
                className="rounded-xl h-10 px-8 bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-md"
                disabled={selectedStudents.length === 0}
              >
                Sync Mapping
              </Button>
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
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Faculty Protocol Context Intake</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const ws = XLSX.utils.json_to_sheet([
                  { Name: "Dr. Jane Smith", Email: "jane@edu.com", ContactNo: "9876543210", Department: "CSE", Designation: "Professor", Place: "Chennai" }
                ]);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Mentors Template");
                XLSX.writeFile(wb, "Mentor_Bulk_Template.xlsx");
              }}
              className="h-9 rounded-xl border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest bg-primary/5 hover:bg-primary/10 transition-all gap-2"
            >
              <Database size={14} /> Download Template
            </Button>
          </div>
          <div className="p-8 text-center space-y-6">
             <div className="mb-6">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 text-left">Faculty Protocol Map</p>
                <div className="bg-muted/30 border border-border/40 rounded-2xl overflow-hidden shadow-inner">
                    <table className="w-full text-left text-[10px] border-collapse">
                        <thead className="bg-foreground/[0.03]">
                            <tr>
                                {["Name", "Email", "ContactNo", "Department", "Designation", "Place"].map(h => (
                                    <th key={h} className="px-4 py-2 font-black text-muted-foreground uppercase tracking-widest border-r border-border/40 last:border-0">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border/40">
                                {["Dr. Smith", "smith@edu.com", "9876543210", "CSE", "Professor", "Chennai"].map((v, i) => (
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
                <h4 className="text-sm font-bold text-foreground mb-1 uppercase tracking-tight">Upload Faculty Matrix</h4>
                <p className="text-[11px] text-muted-foreground font-medium mb-6">Select a .xlsx or .csv manifest</p>
                <Input type="file" className="hidden" id="mentor-bulk-input" />
                <Label htmlFor="mentor-bulk-input" className="h-11 px-10 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] flex items-center cursor-pointer shadow-md transition-all hover:scale-[1.02]">
                    Choose Manifest
                </Label>
            </div>
             <p className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-[0.1em]">Protocol verification required before ingestion</p>
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
              <div>
                <h3 className="text-base font-semibold text-foreground">Confirm Removal</h3>
                <p className="text-xs text-muted-foreground leading-relaxed px-4">This will dissolve all mentorship assignments and revoke credentials for this faculty member. Action is permanent.</p>
              </div>
           </div>
           <div className="p-4 border-t border-border/40 bg-foreground/[0.01] flex justify-center gap-3">
              <AlertDialogCancel className="rounded-xl h-10 px-6">Abort</AlertDialogCancel>
              <AlertDialogAction onClick={() => { if (selectedMentorForDelete) deleteMentor(selectedMentorForDelete); setIsDeleteDialogOpen(false); }} className="bg-destructive text-white rounded-xl h-10 px-8 uppercase text-[10px] font-bold shadow-md">Confirm Delete</AlertDialogAction>
           </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}