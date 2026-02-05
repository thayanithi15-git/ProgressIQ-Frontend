"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function UserManagementPage() {
  const {
    users,
    total,
    isLoading,
    currentPage,
    pageSize,
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<string | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | StudentData | null>(null);
  const [createType, setCreateType] = useState<"student" | "admin">("student");
  const [searchEmail, setSearchEmail] = useState("");

  const [createFormData, setCreateFormData] = useState<
    Partial<CreateStudentPayload & CreateAdminPayload>
  >({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    gender: "MALE",
    department: "",
    academicYear: "",
    year: "1",
    place: "",
    parentName: "",
    parentPhone: "",
    isActive: true,
    rewardPoints: 0,
    password: "",
  });

  const [editFormData, setEditFormData] = useState<UpdateUserPayload>({});

  useEffect(() => {
    fetchUsers(1, pageSize);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchEmail(value);
    setFilters({ ...filters, searchEmail: value });
  };

  const handleRoleFilter = (role: string) => {
    if (role === "all") {
      resetFilters();
    } else {
      setFilters({ ...filters, role: role as "ADMIN" | "STUDENT" | "MENTOR" });
    }
  };

  const handleStatusFilter = (status: string) => {
    if (status === "all") {
      setFilters({ ...filters, isActive: undefined });
    } else {
      setFilters({ ...filters, isActive: status === "active" });
    }
  };

  const handleCreateUser = async () => {
    try {
      if (createType === "student") {
        const studentPayload: CreateStudentPayload = {
          email: createFormData.email || "",
          firstName: createFormData.firstName || "",
          lastName: createFormData.lastName || "",
          phone: createFormData.phone || "",
          dob: createFormData.dob || "",
          gender: (createFormData.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
          department: createFormData.department || "",
          academicYear: createFormData.academicYear || "",
          year: createFormData.year || "1",
          place: createFormData.place || "",
          parentName: createFormData.parentName || "",
          parentPhone: createFormData.parentPhone || "",
          isActive: true,
          rewardPoints: createFormData.rewardPoints || 0,
        };
        await createStudent(studentPayload);
      } else {
        const adminPayload: CreateAdminPayload = {
          email: createFormData.email || "",
          password: createFormData.password || "",
        };
        await createAdmin(adminPayload);
      }

      resetCreateForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditUser = (user: User | StudentData) => {
    setSelectedUserForEdit(user);
    setEditFormData({
      email: user.email,
      isActive: user.isActive,
      ...(isStudentData(user) && {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        department: user.department,
        academicYear: user.academicYear,
        year: user.year,
        place: user.place,
        parentName: user.parentName,
        parentPhone: user.parentPhone,
        rewardPoints: user.rewardPoints,
      }),
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUserForEdit) return;

    await updateUser(selectedUserForEdit._id, editFormData);
    setIsEditDialogOpen(false);
    setSelectedUserForEdit(null);
    setEditFormData({});
  };

  const handleDeleteUser = async () => {
    if (selectedUserForDelete) {
      await deleteUser(selectedUserForDelete);
      setIsDeleteDialogOpen(false);
      setSelectedUserForDelete(null);
    }
  };

  const resetCreateForm = () => {
    setCreateFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      dob: "",
      gender: "MALE",
      department: "",
      academicYear: "",
      year: "1",
      place: "",
      parentName: "",
      parentPhone: "",
      isActive: true,
      rewardPoints: 0,
      password: "",
    });
  };

  const totalPages = Math.ceil(total / pageSize);
  const isStudentData = (user: User | StudentData | null): user is StudentData => {
    return user !== null && "firstName" in user;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "text-purple-600 bg-purple-50";
      case "STUDENT":
        return "text-green-600 bg-green-50";
      case "MENTOR":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <>
      <GlobalNotification />
      
      <Header title='User Management' subtitle="Welcome back! Here's what's happening today." />

      <div className="min-h-screen bg-background p-6">

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-border border-2 shadow-none bg-card">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-2 block">
                    Search Email
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-10 h-10 border-border"
                      value={searchEmail}
                      onChange={handleSearch}
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-2 block">
                    Role
                  </Label>
                  <Select
                    value={filters.role || "all"}
                    onValueChange={handleRoleFilter}
                  >
                    <SelectTrigger className="h-10 border-border">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="MENTOR">Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-2 block">
                    Status
                  </Label>
                  <Select
                    value={filters.isActive === undefined ? "all" : filters.isActive ? "active" : "inactive"}
                    onValueChange={handleStatusFilter}
                  >
                    <SelectTrigger className="h-10 border-border">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Page Size */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-2 block">
                    Items per Page
                  </Label>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => setPageSize(parseInt(value))}
                  >
                    <SelectTrigger className="h-10 border-border">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-foreground">
                Users ({total} total)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-semibold">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="border-1 shadow-none">
                    <TableHeader>
                      <TableRow className="border-b border-border bg-muted/50">
                        <TableHead className="text-foreground font-bold pl-10">ID</TableHead>
                        <TableHead className="text-foreground font-bold">Email</TableHead>
                        <TableHead className="text-foreground font-bold">Name</TableHead>
                        <TableHead className="text-foreground font-bold">Role</TableHead>
                        <TableHead className="text-foreground font-bold">Status</TableHead>
                        <TableHead className="text-foreground font-bold">Created</TableHead>
                        <TableHead className="text-foreground font-bold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="border-l-0  shadow-none">
                      {users.map((user, index) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="text-foreground font-medium pl-10">
                            {index+1}
                          </TableCell>
                          <TableCell className="text-foreground font-medium">
                            {user.email}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {isStudentData(user)
                              ? `${user.firstName} ${user.lastName}`
                              : "Admin User"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                user.isActive
                              )}`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 text-primary" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUserForDelete(user._id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between bg-card border border-border rounded-lg p-4 mt-6"
            >
              <p className="text-sm text-muted-foreground font-semibold">
                Page <span className="font-bold text-foreground">{currentPage}</span> of{" "}
                <span className="font-bold text-foreground">{totalPages}</span> ({total} users)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="border-border"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))
                  .map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "border-border"
                      }
                    >
                      {page}
                    </Button>
                  ))}

                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="border-border"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>

          {selectedUserForEdit && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Email</Label>
                <Input
                  className="mt-2 border-border"
                  value={editFormData.email || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                />
              </div>

              {isStudentData(selectedUserForEdit) && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        First Name
                      </Label>
                      <Input
                        className="mt-2 border-border"
                        value={(editFormData as any).firstName || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Last Name
                      </Label>
                      <Input
                        className="mt-2 border-border"
                        value={(editFormData as any).lastName || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground">Phone</Label>
                      <Input
                        className="mt-2 border-border"
                        value={(editFormData as any).phone || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Place
                      </Label>
                      <Input
                        className="mt-2 border-border"
                        value={(editFormData as any).place || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            place: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Department
                      </Label>
                      <Input
                        className="mt-2 border-border"
                        value={(editFormData as any).department || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            department: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Academic Year
                      </Label>
                      <Input
                        className="mt-2 border-border"
                        value={(editFormData as any).academicYear || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            academicYear: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Parent Name
                      </Label>
                      <Input
                        className="mt-2 border-border"
                        value={(editFormData as any).parentName || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            parentName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Parent Phone
                      </Label>
                      <Input
                        className="mt-2 border-border"
                        value={(editFormData as any).parentPhone || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            parentPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label className="text-sm font-semibold text-foreground">Status</Label>
                <Select
                  value={editFormData.isActive ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setEditFormData({
                      ...editFormData,
                      isActive: value === "active",
                    })
                  }
                >
                  <SelectTrigger className="mt-2 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                  className="flex-1 bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedUserForEdit(null);
                    setEditFormData({});
                  }}
                  variant="outline"
                  className="flex-1 border-border"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle className="text-foreground">Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}