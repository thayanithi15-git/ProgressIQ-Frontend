"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight,
  Mail, Eye, EyeOff, UserPlus, Filter, X, Shield, GraduationCap, Briefcase,
  Upload, FileSpreadsheet, Database
} from "lucide-react";
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
  useUserManagementStore,
  CreateStudentPayload,
  CreateAdminPayload,
  UpdateUserPayload,
  User,
  StudentData,
} from "@/store/admin/user-manage";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ─── TOKENS ─────────────────────────────────────────────────────────────────
const ROLE_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  ADMIN: {
    label: "Admin",
    color: "#7c3aed",
    bg: "rgba(124, 58, 237, 0.12)",
    icon: Shield
  },
  STUDENT: {
    label: "Student",
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.12)",
    icon: GraduationCap
  },
  MENTOR: {
    label: "Mentor",
    color: "#059669",
    bg: "rgba(5, 150, 105, 0.12)",
    icon: Briefcase
  },
};

const STATUS_META = {
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

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
const RoleBadge = ({ role }: { role: string }) => {
  const meta = ROLE_META[role?.toUpperCase()] || ROLE_META.STUDENT;
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      <Icon size={10} />
      {meta.label}
    </span>
  );
};

const StatusBadge = ({ isActive }: { isActive: boolean }) => {
  const meta = isActive ? STATUS_META.ACTIVE : STATUS_META.INACTIVE;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
};

export default function UserManagementPage() {
  const {
    users,
    total,
    isLoading,
    currentPage,
    pageSize,
    totalPages,
    filters,
    fetchUsers,
    setCurrentPage,
    setPageSize,
    setFilters,
    deleteUser,
    createStudent,
    createAdmin,
    updateUser,
    resetFilters,
  } = useUserManagementStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<string | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | StudentData | null>(null);
  const [createType, setCreateType] = useState<"student" | "admin">("student");
  const [searchEmail, setSearchEmail] = useState("");

  const [createFormData, setCreateFormData] = useState<Partial<CreateStudentPayload & CreateAdminPayload>>({
    email: "", firstName: "", lastName: "", phone: "", dob: "",
    gender: "MALE", department: "", academicYear: "", year: "1",
    place: "", parentName: "", parentPhone: "", isActive: true,
    rewardPoints: 0, password: "",
  });

  const [editFormData, setEditFormData] = useState<UpdateUserPayload>({});

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUsers(1, pageSize);
  }, [fetchUsers, pageSize]);

  if (!mounted) return null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchEmail(value);
    setFilters({ ...filters, searchEmail: value });
  };

  const handleRoleFilter = (role: string) => {
    if (role === "all") resetFilters();
    else setFilters({ ...filters, role: role as "ADMIN" | "STUDENT" | "MENTOR" });
  };

  const handleStatusFilter = (status: string) => {
    if (status === "all") setFilters({ ...filters, isActive: undefined });
    else setFilters({ ...filters, isActive: status === "active" });
  };

  const isStudentData = (user: User | StudentData | null): user is StudentData => {
    return user !== null && "firstName" in user;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalNotification />
      <Header 
        title="User Management" 
        subtitle="Manage administrative, mentor, and student access"
      />

      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* Filters & Actions */}
        <div className="bg-card border border-border shadow-sm rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search user emails..."
                value={searchEmail}
                onChange={handleSearch}
                className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={filters.role || "all"} onValueChange={handleRoleFilter}>
                <SelectTrigger className="h-11 md:w-40 rounded-xl bg-muted/20 border-border/60 text-xs font-semibold uppercase tracking-wider">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="MENTOR">Mentor</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="h-11 rounded-xl px-6 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <UserPlus size={16} /> Create User
              </Button>

              <Button 
                variant="outline"
                onClick={() => setIsBulkUploadDialogOpen(true)}
                className="h-11 rounded-xl px-4 border-border/60 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-2 hover:bg-muted/50 transition-all shadow-sm"
              >
                <Upload size={16} />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Status:</span>
              <div className="flex gap-1">
                {['all', 'active', 'inactive'].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusFilter(s)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                      (filters.isActive === undefined && s === 'all') || 
                      (filters.isActive === true && s === 'active') || 
                      (filters.isActive === false && s === 'inactive')
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:bg-muted border border-transparent'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden md:inline">Per Page:</span>
              <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(parseInt(v))}>
                <SelectTrigger className="h-8 w-20 rounded-lg bg-muted/10 border-border/40 text-[10px] font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-foreground/[0.02] border-b border-border/40">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-16">#</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">User Profile</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Access Role</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Enrollment</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td colSpan={6} className="px-6 py-5"><Skeleton className="h-10 w-full rounded-xl" /></td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest">No matching users found</td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group border-b border-border/40 hover:bg-foreground/[0.01] transition-colors"
                    >
                      <td className="px-6 py-4 text-[11px] font-medium text-muted-foreground">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-6 py-4 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold border border-primary/10 group-hover:bg-primary/10 transition-colors uppercase">
                            {user.email.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate leading-none mb-1 text-foreground">
                              {isStudentData(user) ? `${user.firstName} ${user.lastName}` : (user.role === 'ADMIN' ? 'Administrator' : 'Academic Mentor')}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge isActive={user.isActive} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUserForEdit(user);
                              setIsEditDialogOpen(true);
                            }}
                            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-all"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserForDelete(user._id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-all"
                            title="Remove User"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-border/40">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Showing <span className="text-primary">{users.length}</span> of {total} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-bold"
              >
                <ChevronLeft size={14} className="mr-1" /> Prev
              </Button>
              <div className="flex items-center gap-1.5 px-2">
                <span className="text-xs font-bold text-foreground">{currentPage}</span>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-xs font-bold text-muted-foreground">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-9 px-4 rounded-xl border-border/40 text-[10px] font-bold"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog (Styled with Glassmorphism) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="modal-sheet max-w-xl p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 bg-foreground/[0.02] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Edit Profile</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">System access audit</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(false)} className="rounded-full w-8 h-8">
              <X size={16} />
            </Button>
          </div>
          
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {selectedUserForEdit && (
              <>
                <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">System Identifier (Email)</Label>
                    <Input 
                      className="h-11 rounded-xl bg-muted/20 border-border/60"
                      value={editFormData.email || selectedUserForEdit.email}
                      onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                    />
                  </div>
                  
                  {isStudentData(selectedUserForEdit) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">First Name</Label>
                        <Input 
                          className="h-11 rounded-xl bg-muted/20 border-border/60"
                          value={(editFormData as any).firstName || selectedUserForEdit.firstName}
                          onChange={e => setEditFormData({...editFormData, firstName: e.target.value} as any)}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Last Name</Label>
                        <Input 
                          className="h-11 rounded-xl bg-muted/20 border-border/60"
                          value={(editFormData as any).lastName || selectedUserForEdit.lastName}
                          onChange={e => setEditFormData({...editFormData, lastName: e.target.value} as any)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-border/40">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Access Control</Label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setEditFormData({...editFormData, isActive: true})}
                        className={`flex-1 h-12 rounded-xl border flex items-center justify-center gap-2 transition-all ${editFormData.isActive === true || (editFormData.isActive === undefined && selectedUserForEdit.isActive) ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-muted/10 border-border/60 text-muted-foreground'}`}
                      >
                        <Shield size={16} /> Active
                      </button>
                      <button
                        onClick={() => setEditFormData({...editFormData, isActive: false})}
                        className={`flex-1 h-12 rounded-xl border flex items-center justify-center gap-2 transition-all ${editFormData.isActive === false || (editFormData.isActive === undefined && !selectedUserForEdit.isActive) ? 'bg-destructive/10 border-destructive text-destructive font-bold' : 'bg-muted/10 border-border/60 text-muted-foreground'}`}
                      >
                        <EyeOff size={16} /> Inactive
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="p-4 border-t border-border/40 flex justify-end gap-3 bg-foreground/[0.01]">
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-bold tracking-widest">Cancel</Button>
            <Button 
               onClick={async () => {
                 if (selectedUserForEdit) {
                   await updateUser(selectedUserForEdit._id, editFormData);
                   setIsEditDialogOpen(false);
                 }
               }}
               className="rounded-xl h-10 px-8 bg-primary text-primary-foreground uppercase text-[10px] font-bold tracking-widest shadow-md"
            >
              Commit Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="modal-sheet p-0 overflow-hidden">
          <div className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-2">Confirm User Deletion</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This will permanently revoke all access for this identity. Academic records associated with this account may become inaccessible.
            </p>
          </div>
          <div className="p-4 border-t border-border/40 flex justify-end gap-3 bg-foreground/[0.01]">
            <AlertDialogCancel className="border-border hover:bg-muted rounded-xl h-10 px-6 uppercase text-[10px] font-bold tracking-widest">Abort Action</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                if (selectedUserForDelete) {
                  await deleteUser(selectedUserForDelete);
                  setIsDeleteDialogOpen(false);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl h-10 px-8 uppercase text-[10px] font-bold tracking-widest shadow-md"
            >
              Confirm Deletion
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* BULK UPLOAD DIALOG */}
      <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
        <DialogContent className="modal-sheet max-w-3xl p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40 bg-foreground/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <FileSpreadsheet size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Identity Ingestion</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Excel / CSV Context Intake</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Template logic
              }}
              className="h-9 rounded-xl border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest bg-primary/5 hover:bg-primary/10 transition-all gap-2"
            >
              <Database size={14} /> Download Template
            </Button>
          </div>
          
          <div className="p-8 text-center space-y-6">
            <div className="mb-6 text-left">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Header Protocol Map</p>
                <div className="bg-muted/30 border border-border/40 rounded-2xl overflow-hidden shadow-inner overflow-x-auto">
                    <table className="w-full text-left text-[10px] border-collapse">
                        <thead className="bg-foreground/[0.03]">
                            <tr>
                                {["Email", "Password", "Role", "FirstName", "LastName"].map(h => (
                                    <th key={h} className="px-4 py-2 font-black text-muted-foreground uppercase tracking-widest border-r border-border/40 last:border-0">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border/40">
                                {["user@edu.com", "********", "STUDENT", "John", "Doe"].map((v, i) => (
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
                <h4 className="text-sm font-bold text-foreground mb-1 uppercase tracking-tight">Upload Identity Manifest</h4>
                <p className="text-[11px] text-muted-foreground font-medium mb-6">Select a .xlsx or .csv member list</p>
                
                <Input type="file" className="hidden" id="user-bulk-input" />
                <Label htmlFor="user-bulk-input" className="h-11 px-10 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] flex items-center cursor-pointer shadow-md transition-all hover:scale-[1.02]">
                    Choose File
                </Label>
            </div>
          </div>
          
          <div className="p-4 border-t border-border/40 bg-foreground/[0.01] flex justify-end">
            <Button variant="ghost" onClick={() => setIsBulkUploadDialogOpen(false)} className="rounded-xl h-10 px-6 uppercase text-[10px] font-bold tracking-widest">Abort Intake</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}