"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserCog,
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
  BarChart3,
  Users,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  useMentorManagementStore,
  CreateMentorPayload,
  UpdateMentorPayload,
} from "@/store/admin/mentor-manage";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function MentorListPage() {
  const router = useRouter();
  const {
    mentors,
    total,
    isLoading,
    currentPage,
    pageSize,
    filters,
    fetchMentors,
    setCurrentPage,
    setPageSize,
    setFilters,
    deleteMentor,
    createMentor,
    updateMentor,
    resetFilters,
    fetchMentorById,
    students,
    studentsLoading,
    fetchStudentsForMapping,
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
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const [createFormData, setCreateFormData] = useState<Partial<CreateMentorPayload>>({
    name: "",
    email: "",
    contactNo: "",
    place: "",
    department: "",
    designation: "",
  });

  const [editFormData, setEditFormData] = useState<UpdateMentorPayload>({});

  useEffect(() => {
    fetchMentors(1, pageSize);
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

  const handleDesignationFilter = (designation: string) => {
    if (designation === "all") {
      setFilters({ ...filters, designation: undefined });
    } else {
      setFilters({ ...filters, designation });
    }
  };

  const handlePlaceFilter = (place: string) => {
    if (place === "all") {
      setFilters({ ...filters, place: undefined });
    } else {
      setFilters({ ...filters, place });
    }
  };

  const handleCreateMentor = async () => {
    try {
      const payload: CreateMentorPayload = {
        name: createFormData.name || "",
        email: createFormData.email || "",
        contactNo: createFormData.contactNo || "",
        place: createFormData.place || "",
        department: createFormData.department || "",
        designation: createFormData.designation || "",
      };
      await createMentor(payload);
      resetCreateForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating mentor:", error);
    }
  };

  const handleEditMentor = (mentorId: string) => {
    const mentor = mentors.find((m) => m._id === mentorId);
    if (mentor) {
      setSelectedMentorForEdit(mentorId);
      setEditFormData({
        name: mentor.name,
        email: mentor.email,
        contactNo: mentor.contactNo,
        place: mentor.place,
        department: mentor.department,
        designation: mentor.designation,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedMentorForEdit) return;
    await updateMentor(selectedMentorForEdit, editFormData);
    setIsEditDialogOpen(false);
    setSelectedMentorForEdit(null);
    setEditFormData({});
  };

  const handleDeleteMentor = async () => {
    if (selectedMentorForDelete) {
      await deleteMentor(selectedMentorForDelete);
      setIsDeleteDialogOpen(false);
      setSelectedMentorForDelete(null);
    }
  };

  const handleOpenMappingDialog = async (mentorId: string) => {
    const mentor = mentors.find((m) => m._id === mentorId);
    if (mentor) {
      setSelectedMentorForMapping(mentorId);
      setSelectedStudents([]);
      setIsMappingDialogOpen(true);
      await fetchStudentsForMapping();
    }
  };

  const handleToggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map((s) => s._id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleMapStudents = async () => {
    if (!selectedMentorForMapping || selectedStudents.length === 0) {
      return;
    }
    await mapStudentsToMentor(selectedMentorForMapping, selectedStudents);
    setIsMappingDialogOpen(false);
    setSelectedMentorForMapping(null);
    setSelectedStudents([]);
  };

  const handleViewProfile = async (mentorId: string) => {
    await fetchMentorById(mentorId);
    router.push(`/admin/dashboard/mentor-manage/${mentorId}`);
  };

  const resetCreateForm = () => {
    setCreateFormData({
      name: "",
      email: "",
      contactNo: "",
      place: "",
      department: "",
      designation: "",
    });
  };

  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Statistics
  const departmentStats = mentors.reduce((acc, mentor) => {
    acc[mentor.department] = (acc[mentor.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const designationStats = mentors.reduce((acc, mentor) => {
    acc[mentor.designation] = (acc[mentor.designation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentChartData = Object.entries(departmentStats).map(([name, value]) => ({
    name,
    value,
  }));

  const designationChartData = Object.entries(designationStats).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

  return (
    <>
      <GlobalNotification />

      <Header
        title="Mentor Management"
        subtitle="Manage faculty mentors and their information"
        HeaderComp={
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowStats(!showStats)}
              variant="outline"
              className="border-border gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {showStats ? "Hide" : "Show"} Stats
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2">
                  <Plus className="w-4 h-4" />
                  Add Mentor
                </Button>
              </DialogTrigger>
              <DialogContent className="w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Create New Mentor</DialogTitle>
                  <DialogDescription>Add a new mentor to the system</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <Label className="text-sm font-semibold text-foreground">Full Name *</Label>
                    <Input
                      placeholder="Dr. John Doe"
                      className="mt-2 border-border"
                      value={createFormData.name || ""}
                      onChange={(e) =>
                        setCreateFormData({ ...createFormData, name: e.target.value })
                      }
                    />
                  </div>

                  {/* Email & Contact */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground">Email *</Label>
                      <Input
                        placeholder="mentor@college.edu"
                        className="mt-2 border-border"
                        value={createFormData.email || ""}
                        onChange={(e) =>
                          setCreateFormData({ ...createFormData, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Contact Number *
                      </Label>
                      <Input
                        placeholder="9876543210"
                        className="mt-2 border-border"
                        value={createFormData.contactNo || ""}
                        onChange={(e) =>
                          setCreateFormData({ ...createFormData, contactNo: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Department & Designation */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Department *
                      </Label>
                      <Select
                        value={createFormData.department || ""}
                        onValueChange={(value) =>
                          setCreateFormData({ ...createFormData, department: value })
                        }
                      >
                        <SelectTrigger className="mt-2 border-border">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CSE">CSE</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="ECE">ECE</SelectItem>
                          <SelectItem value="MECH">MECH</SelectItem>
                          <SelectItem value="CIVIL">CIVIL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Designation *
                      </Label>
                      <Select
                        value={createFormData.designation || ""}
                        onValueChange={(value) =>
                          setCreateFormData({ ...createFormData, designation: value })
                        }
                      >
                        <SelectTrigger className="mt-2 border-border">
                          <SelectValue placeholder="Select Designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professor">Professor</SelectItem>
                          <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                          <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                          <SelectItem value="Lecturer">Lecturer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Place */}
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

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCreateMentor}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                      {isLoading ? "Creating..." : "Create Mentor"}
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
          </div>
        }
      />
      <div className="min-h-screen bg-background p-6">
        {/* Statistics Section */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="border-border border-1 shadow-none bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Mentor Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Department Distribution */}
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-4">
                      Department Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={departmentChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Designation Distribution */}
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-4">
                      Designation Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={designationChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {designationChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-600 text-sm font-semibold">Total Mentors</p>
                    <p className="text-blue-900 font-black text-2xl mt-2">{total}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-purple-600 text-sm font-semibold">Departments</p>
                    <p className="text-purple-900 font-black text-2xl mt-2">
                      {Object.keys(departmentStats).length}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-600 text-sm font-semibold">Professors</p>
                    <p className="text-green-900 font-black text-2xl mt-2">
                      {designationStats["Professor"] || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-amber-600 text-sm font-semibold">Lecturers</p>
                    <p className="text-amber-900 font-black text-2xl mt-2">
                      {designationStats["Lecturer"] || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters Section */}
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
                      <SelectItem value="MECH">MECH</SelectItem>
                      <SelectItem value="CIVIL">CIVIL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Designation Filter */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-2 block">
                    Designation
                  </Label>
                  <Select
                    value={filters.designation || "all"}
                    onValueChange={handleDesignationFilter}
                  >
                    <SelectTrigger className="h-10 border-border">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Place Filter */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-2 block">
                    Place
                  </Label>
                  <Select value={filters.place || "all"} onValueChange={handlePlaceFilter}>
                    <SelectTrigger className="h-10 border-border">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Places</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Coimbatore">Coimbatore</SelectItem>
                      <SelectItem value="Salem">Salem</SelectItem>
                      <SelectItem value="Madurai">Madurai</SelectItem>
                      <SelectItem value="Trichy">Trichy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <Button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  variant="outline"
                  className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Filter className="w-4 h-4" />
                  {showAdvancedFilters ? "Hide" : "Show"} Page Size
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => fetchMentors(1, pageSize)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    onClick={resetFilters}
                    size="sm"
                    variant="outline"
                    className="border-border gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reset
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Items per Page
                      </Label>
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
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
              <CardTitle className="text-foreground">Mentors ({total} total)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : mentors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-semibold">No mentors found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="border-1 shadow-none">
                    <TableHeader>
                      <TableRow className="border-b border-border bg-muted/50">
                        <TableHead className="text-foreground font-bold pl-10">ID</TableHead>
                        <TableHead className="text-foreground font-bold">Name</TableHead>
                        <TableHead className="text-foreground font-bold">Email</TableHead>
                        <TableHead className="text-foreground font-bold">Contact</TableHead>
                        <TableHead className="text-foreground font-bold">Department</TableHead>
                        <TableHead className="text-foreground font-bold">
                          Designation
                        </TableHead>
                        <TableHead className="text-foreground font-bold">Place</TableHead>
                        <TableHead className="text-foreground font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mentors.map((mentor, index) => (
                        <motion.tr
                          key={mentor._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="text-foreground font-medium pl-10">
                            {(currentPage - 1) * pageSize + index + 1}
                          </TableCell>
                          <TableCell className="text-foreground font-medium">
                            {mentor.name}
                          </TableCell>
                          <TableCell className="text-foreground text-sm">
                            {mentor.email}
                          </TableCell>
                          <TableCell className="text-foreground text-sm">
                            {mentor.contactNo}
                          </TableCell>
                          <TableCell className="text-foreground">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                              {mentor.department}
                            </span>
                          </TableCell>
                          <TableCell className="text-foreground text-sm">
                            {mentor.designation}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {mentor.place}
                          </TableCell>
                          <TableCell className="">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenMappingDialog(mentor._id)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                title="Map Students"
                              >
                                <Users className="w-4 h-4 text-green-600" />
                              </button>
                              <button
                                onClick={() => handleViewProfile(mentor._id)}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                title="View Profile"
                              >
                                <Eye className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleEditMentor(mentor._id)}
                                className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 text-amber-600" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedMentorForDelete(mentor._id);
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

          {/* Enhanced Pagination */}
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
                  <span className="font-bold text-foreground">{totalPages}</span> ({total}{" "}
                  mentors)
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className={
                            currentPage === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-border hover:bg-muted"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
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

              {/* Next Page Card */}
              {hasNextPage && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        📄 Next Page Available
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Page {currentPage + 1} of {totalPages} •{" "}
                        {Math.min(pageSize, total - currentPage * pageSize)} more mentors
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
                <div className="bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900">
                    ✅ You're on the last page • {total} total mentors
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Edit Mentor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Mentor</DialogTitle>
            <DialogDescription>Update mentor information</DialogDescription>
          </DialogHeader>

          {selectedMentorForEdit && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Full Name</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).name || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-foreground">Email</Label>
                  <Input
                    className="mt-2 border-border"
                    value={(editFormData as any).email || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-foreground">Contact Number</Label>
                  <Input
                    className="mt-2 border-border"
                    value={(editFormData as any).contactNo || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, contactNo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-foreground">Department</Label>
                  <Select
                    value={(editFormData as any).department || ""}
                    onValueChange={(value) =>
                      setEditFormData({ ...editFormData, department: value })
                    }
                  >
                    <SelectTrigger className="mt-2 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="MECH">MECH</SelectItem>
                      <SelectItem value="CIVIL">CIVIL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-foreground">Designation</Label>
                  <Select
                    value={(editFormData as any).designation || ""}
                    onValueChange={(value) =>
                      setEditFormData({ ...editFormData, designation: value })
                    }
                  >
                    <SelectTrigger className="mt-2 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground">Place</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).place || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, place: e.target.value })}
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
                    setSelectedMentorForEdit(null);
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
          <AlertDialogTitle className="text-foreground">Delete Mentor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this mentor? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMentor}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Map Students Dialog */}
      <Dialog open={isMappingDialogOpen} onOpenChange={setIsMappingDialogOpen}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Map Students to Mentor</DialogTitle>
            <DialogDescription>
              {selectedMentorForMapping &&
                `Select students to map to ${
                  mentors.find((m) => m._id === selectedMentorForMapping)?.name || "this mentor"
                }`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Students List with Checkboxes */}
            <div className="border border-border rounded-lg p-4">
              {studentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-semibold">No students available</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {/* Select All Option */}
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <Checkbox
                      id="select-all"
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onCheckedChange={handleSelectAllStudents}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="select-all"
                      className="flex-1 font-semibold text-foreground cursor-pointer"
                    >
                      Select All ({selectedStudents.length}/{students.length})
                    </label>
                  </div>

                  {/* Individual Student Items */}
                  {students.map((student) => (
                    <div key={student._id} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg">
                      <Checkbox
                        id={student._id}
                        checked={selectedStudents.includes(student._id)}
                        onCheckedChange={() => handleToggleStudentSelection(student._id)}
                        className="w-4 h-4"
                      />
                      <label htmlFor={student._id} className="flex-1 cursor-pointer">
                        <div className="font-medium text-foreground">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.userId?.email || "No email"} • {student.department} • Year {student.year}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleMapStudents}
                disabled={isLoading || selectedStudents.length === 0 || studentsLoading}
                className="flex-1 bg-green-600 text-white font-semibold hover:bg-green-700"
              >
                {isLoading ? "Mapping..." : `Map ${selectedStudents.length} Student(s)`}
              </Button>
              <Button
                onClick={() => {
                  setIsMappingDialogOpen(false);
                  setSelectedMentorForMapping(null);
                  setSelectedStudents([]);
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
    </>
  );
}