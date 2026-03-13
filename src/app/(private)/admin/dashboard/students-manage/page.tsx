"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Filter,
  X,
  Github,
  Linkedin,
  Code,
  Terminal,
  Link2,
  Globe,
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
import {
  useStudentManagementStore,
  CreateStudentPayload,
  UpdateStudentPayload,
} from "@/store/admin/student-manage";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";

export default function StudentListPage() {
  const router = useRouter();
  const {
    students,
    total,
    isLoading,
    currentPage,
    pageSize,
    filters,
    fetchStudents,
    setCurrentPage,
    setPageSize,
    setFilters,
    deleteStudent,
    createStudent,
    updateStudent,
    resetFilters,
    fetchStudentById,
  } = useStudentManagementStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState<string | null>(null);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [rewardMinPoints, setRewardMinPoints] = useState("");
  const [rewardMaxPoints, setRewardMaxPoints] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'points' | 'created' | 'department'>('name');

  const [createFormData, setCreateFormData] = useState<Partial<CreateStudentPayload>>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    gender: "Male",
    department: "",
    year: "1",
    place: "",
    parentName: "",
    parentPhone: "",
    academicYear: "",
  });

  const [editFormData, setEditFormData] = useState<UpdateStudentPayload>({});

  useEffect(() => {
    fetchStudents(1, pageSize);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value);
    setFilters({ ...filters, searchName: value });
  };

  const handleEmailSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchEmail(value);
    setFilters({ ...filters, searchEmail: value });
  };

  const handleDepartmentFilter = (dept: string) => {
    if (dept === "all") {
      setFilters({ ...filters, department: undefined });
    } else {
      setFilters({ ...filters, department: dept });
    }
  };

  const handleYearFilter = (year: string) => {
    if (year === "all") {
      setFilters({ ...filters, year: undefined });
    } else {
      setFilters({ ...filters, year });
    }
  };

  const handleStatusFilter = (status: string) => {
    if (status === "all") {
      setFilters({ ...filters, status: undefined });
    } else {
      setFilters({ ...filters, status });
    }
  };

  const handleApplyAdvancedFilters = () => {
    const newFilters = { ...filters };
    if (rewardMinPoints) {
      newFilters.minRewardPoints = parseInt(rewardMinPoints);
    }
    if (rewardMaxPoints) {
      newFilters.maxRewardPoints = parseInt(rewardMaxPoints);
    }
    if (sortBy) {
      newFilters.sortBy = sortBy;
    }
    setFilters(newFilters);
  };

  const handleClearAdvancedFilters = () => {
    setRewardMinPoints("");
    setRewardMaxPoints("");
    setSortBy('name');
    const newFilters = { ...filters };
    delete newFilters.minRewardPoints;
    delete newFilters.maxRewardPoints;
    delete newFilters.sortBy;
    setFilters(newFilters);
  };

  const handleCreateStudent = async () => {
    try {
      const payload: CreateStudentPayload = {
        email: createFormData.email || "",
        password: createFormData.password || "",
        firstName: createFormData.firstName || "",
        lastName: createFormData.lastName || "",
        phone: createFormData.phone || "",
        dob: createFormData.dob || "",
        gender: createFormData.gender || "Male",
        department: createFormData.department || "",
        year: createFormData.year || "1",
        place: createFormData.place || "",
        parentName: createFormData.parentName || "",
        parentPhone: createFormData.parentPhone || "",
        academicYear: createFormData.academicYear || "",
      };
      await createStudent(payload);
      resetCreateForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  const handleEditStudent = (studentId: string) => {
    const student = students.find(s => s._id === studentId);
    if (student) {
      setSelectedStudentForEdit(studentId);
      setEditFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        phone: student.phone,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        place: student.place,
        department: student.department,
        year: student.year,
        status: student.status,
        rewardPoints: student.rewardPoints,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedStudentForEdit) return;
    await updateStudent(selectedStudentForEdit, editFormData);
    setIsEditDialogOpen(false);
    setSelectedStudentForEdit(null);
    setEditFormData({});
  };

  const handleDeleteStudent = async () => {
    if (selectedStudentForDelete) {
      await deleteStudent(selectedStudentForDelete);
      setIsDeleteDialogOpen(false);
      setSelectedStudentForDelete(null);
    }
  };

  const handleViewProfile = async (studentId: string) => {
    await fetchStudentById(studentId);
    router.push(`/admin/dashboard/students-manage/${studentId}`);
  };

  const resetCreateForm = () => {
    setCreateFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      dob: "",
      gender: "Male",
      department: "",
      year: "1",
      place: "",
      parentName: "",
      parentPhone: "",
      academicYear: "",
    });
  };

  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const getStatusBadge = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (<>
    <GlobalNotification />

    <Header title='Student Management' subtitle="Welcome back! Here's what's happening today." HeaderComp={

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </DialogTrigger>
        <DialogContent className="w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create New Student</DialogTitle>
            <DialogDescription>Add a new student to the system</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Email */}

            <div>
              <Label className="text-sm font-semibold text-foreground">Email *</Label>
              <Input
                placeholder="student@college.edu"
                className="mt-2 border-border"
                value={createFormData.email || ""}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-foreground">Password *</Label>
              <Input
                placeholder="********"
                className="mt-2 border-border"
                value={createFormData.password || ""}
                // type='password'
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, password: e.target.value })
                }
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">First Name *</Label>
                <Input
                  placeholder="John"
                  className="mt-2 border-border"
                  value={createFormData.firstName || ""}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Last Name *</Label>
                <Input
                  placeholder="Doe"
                  className="mt-2 border-border"
                  value={createFormData.lastName || ""}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Phone & DOB */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Phone *</Label>
                <Input
                  placeholder="9876543210"
                  className="mt-2 border-border"
                  value={createFormData.phone || ""}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Date of Birth *
                </Label>
                <Input
                  type="date"
                  className="mt-2 border-border"
                  value={createFormData.dob || ""}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, dob: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Gender & Place */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Gender</Label>
                <Select
                  value={createFormData.gender || "Male"}
                  onValueChange={(value) =>
                    setCreateFormData({ ...createFormData, gender: value })
                  }
                >
                  <SelectTrigger className="mt-2 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Place *</Label>
                <Input
                  placeholder="Chennai"
                  className="mt-2 border-border"
                  value={createFormData.place || ""}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, place: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Department & Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Department *</Label>
                <Input
                  placeholder="CSE"
                  className="mt-2 border-border"
                  value={createFormData.department || ""}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, department: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Year *</Label>
                <Select
                  value={createFormData.year || "1"}
                  onValueChange={(value) =>
                    setCreateFormData({ ...createFormData, year: value })
                  }
                >
                  <SelectTrigger className="mt-2 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Academic Year */}
            <div>
              <Label className="text-sm font-semibold text-foreground">Academic Year *</Label>
              <Input
                placeholder="2024-2025"
                className="mt-2 border-border"
                value={createFormData.academicYear || ""}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, academicYear: e.target.value })
                }
              />
            </div>

            {/* Parent Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Parent Name *</Label>
                <Input
                  placeholder="Parent Name"
                  className="mt-2 border-border"
                  value={createFormData.parentName || ""}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, parentName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Parent Phone *
                </Label>
                <Input
                  placeholder="9123456789"
                  className="mt-2 border-border"
                  value={createFormData.parentPhone || ""}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, parentPhone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateStudent}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                {isLoading ? "Creating..." : "Create Student"}
              </Button>
              <Button
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetCreateForm();
                }}
                variant="outline"
                className="flex-1 border-border"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    } />
    <div className="min-h-screen bg-background p-6">

      {/* Basic Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6"
      >
        <Card className="border-border border-1 shadow-none bg-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search by Name */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">
                  Search Name
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 h-10 border-border"
                    value={searchName}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              {/* Search by Email */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">
                  Search Email
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Email..."
                    className="pl-10 h-10 border-border"
                    value={searchEmail}
                    onChange={handleEmailSearch}
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">
                  Department
                </Label>
                <Select
                  value={filters.department || "all"}
                  onValueChange={handleDepartmentFilter}
                >
                  <SelectTrigger className="h-10 border-border">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">Year</Label>
                <Select value={filters.year || "all"} onValueChange={handleYearFilter}>
                  <SelectTrigger className="h-10 border-border">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">
                  Status
                </Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger className="h-10 border-border">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <Button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                variant="outline"
                className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Filter className="w-4 h-4" />
                {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => fetchStudents(1, pageSize)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Min Reward Points */}
                  <div>
                    <Label className="text-sm font-semibold text-foreground">Min Points</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      className="mt-2 h-10 border-border"
                      value={rewardMinPoints}
                      onChange={(e) => setRewardMinPoints(e.target.value)}
                    />
                  </div>

                  {/* Max Reward Points */}
                  <div>
                    <Label className="text-sm font-semibold text-foreground">Max Points</Label>
                    <Input
                      type="number"
                      placeholder="1000"
                      className="mt-2 h-10 border-border"
                      value={rewardMaxPoints}
                      onChange={(e) => setRewardMaxPoints(e.target.value)}
                    />
                  </div>

                  {/* Sort By */}
                  <div>
                    <Label className="text-sm font-semibold text-foreground">Sort By</Label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                      <SelectTrigger className="mt-2 h-10 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="points">Points</SelectItem>
                        <SelectItem value="created">Created Date</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Page Size */}
                  <div>
                    <Label className="text-sm font-semibold text-foreground">Items per Page</Label>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => setPageSize(parseInt(value))}
                    >
                      <SelectTrigger className="mt-2 h-10 border-border">
                        <SelectValue />
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

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleApplyAdvancedFilters}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply Advanced Filters
                  </Button>
                  <Button
                    onClick={handleClearAdvancedFilters}
                    variant="outline"
                    className="flex-1 border-border gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-border border-1 shadow-none bg-card overflow-hidden">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground">Students ({total} total)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : students.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-semibold">No students found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className='border-1 shadow-none'>
                  <TableHeader>
                    <TableRow className="border-b border-border bg-muted/50">
                      <TableHead className="text-foreground font-bold pl-10">ID</TableHead>
                      <TableHead className="text-foreground font-bold">Name</TableHead>
                      <TableHead className="text-foreground font-bold">Email</TableHead>
                      <TableHead className="text-foreground font-bold">Department</TableHead>
                      <TableHead className="text-foreground font-bold">Year</TableHead>
                      <TableHead className="text-foreground font-bold">Points</TableHead>
                      <TableHead className="text-foreground font-bold">Status</TableHead>
                      <TableHead className="text-foreground font-bold">Socials</TableHead>
                      <TableHead className="text-foreground font-bold">Created</TableHead>
                      <TableHead className="text-foreground font-bold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <motion.tr
                        key={student._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="text-foreground font-medium pl-10">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell className="text-foreground text-sm">
                          {student.userId?.email || "N/A"}
                        </TableCell>
                        <TableCell className="text-foreground">{student.department}</TableCell>
                        <TableCell className="text-foreground">{student.year}</TableCell>
                        <TableCell className="text-foreground font-semibold text-blue-600">
                          {student.rewardPoints}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                              student.status
                            )}`}
                          >
                            {student.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {student.socials && Object.values(student.socials).some(v => v) ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {student.socials.linkedin && <a href={student.socials.linkedin.startsWith('http') ? student.socials.linkedin : `https://${student.socials.linkedin}`} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-[#0A66C2] hover:opacity-80"><Linkedin size={15} /></a>}
                              {student.socials.github && <a href={student.socials.github.startsWith('http') ? student.socials.github : `https://${student.socials.github}`} target="_blank" rel="noopener noreferrer" title="GitHub" className="text-foreground hover:opacity-80"><Github size={15} /></a>}
                              {student.socials.leetcode && <a href={student.socials.leetcode.startsWith('http') ? student.socials.leetcode : `https://${student.socials.leetcode}`} target="_blank" rel="noopener noreferrer" title="LeetCode" className="text-[#FFA116] hover:opacity-80"><Code size={15} /></a>}
                              {student.socials.codechef && <a href={student.socials.codechef.startsWith('http') ? student.socials.codechef : `https://${student.socials.codechef}`} target="_blank" rel="noopener noreferrer" title="CodeChef" className="text-[#5B4638] hover:opacity-80"><Terminal size={15} /></a>}
                              {student.socials.portfolio && <a href={student.socials.portfolio.startsWith('http') ? student.socials.portfolio : `https://${student.socials.portfolio}`} target="_blank" rel="noopener noreferrer" title="Portfolio" className="text-teal-600 hover:opacity-80"><Link2 size={15} /></a>}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No socials</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewProfile(student._id)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleEditStudent(student._id)}
                              className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-amber-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedStudentForDelete(student._id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
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

        {/* Enhanced Pagination with Next Page */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 mt-6"
          >
            {/* Main Pagination Controls */}
            <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground font-semibold">
                Page <span className="font-bold text-foreground">{currentPage}</span> of{" "}
                <span className="font-bold text-foreground">{totalPages}</span> ({total} students)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={!hasPrevPage}
                  variant="outline"
                  size="sm"
                  className="border-border gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
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
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-border hover:bg-muted"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                </div>

                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={!hasNextPage}
                  variant="outline"
                  size="sm"
                  className="border-border gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Next Page Card - Shows preview of next page info */}
            {hasNextPage && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-900">📄 Next Page Available</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Page {currentPage + 1} of {totalPages} • {Math.min(pageSize, total - currentPage * pageSize)} more students
                    </p>
                  </div>
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2"
                  >
                    Go to Next Page
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Last Page Message */}
            {!hasNextPage && currentPage > 1 && (
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-amber-900">
                  ✅ You're on the last page • {total} total students
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>

    {/* Edit Student Dialog */}
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Student</DialogTitle>
          <DialogDescription>Update student information</DialogDescription>
        </DialogHeader>

        {selectedStudentForEdit && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">First Name</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).firstName || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Last Name</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).lastName || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, lastName: e.target.value })
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
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Place</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).place || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, place: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Department</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).department || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, department: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Year</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).year || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, year: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Parent Name</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).parentName || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, parentName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Parent Phone</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).parentPhone || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, parentPhone: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-foreground">Reward Points</Label>
              <Input
                type="number"
                className="mt-2 border-border"
                value={(editFormData as any).rewardPoints || 0}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    rewardPoints: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedStudentForEdit(null);
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
        <AlertDialogTitle className="text-foreground">Delete Student</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this student? This action cannot be undone.
        </AlertDialogDescription>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteStudent}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
}