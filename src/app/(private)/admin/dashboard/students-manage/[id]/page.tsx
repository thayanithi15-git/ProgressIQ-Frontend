"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Book,
  Users,
  Award,
  Calendar,
  User,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStudentManagementStore, UpdateStudentPayload } from "@/store/admin/student-manage";
import GlobalNotification from "@/components/notify/notification";

export default function StudentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const { currentStudent, isLoading, fetchStudentById, updateStudent } =
    useStudentManagementStore();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateStudentPayload>({});

  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
    }
  }, [studentId]);

  useEffect(() => {
    if (currentStudent) {
      setEditFormData({
        firstName: currentStudent.firstName,
        lastName: currentStudent.lastName,
        phone: currentStudent.phone,
        parentName: currentStudent.parentName,
        parentPhone: currentStudent.parentPhone,
        place: currentStudent.place,
        department: currentStudent.department,
        year: currentStudent.year,
        academicYear: currentStudent.academicYear,
        rollNo: currentStudent.rollNo,
        cgpa: currentStudent.cgpa,
        arrearCount: currentStudent.arrearCount,
        familyIncome: currentStudent.familyIncome,
        goodAt: currentStudent.goodAt,
        status: currentStudent.status,
        rewardPoints: currentStudent.rewardPoints,
      });
    }
  }, [currentStudent]);

  const handleSaveEdit = async () => {
    if (currentStudent) {
      await updateStudent(currentStudent._id, editFormData);
      setIsEditDialogOpen(false);
      await fetchStudentById(currentStudent._id);
    }
  };

  if (isLoading) {
    return (
      <>
        <GlobalNotification />
        <div className="min-h-screen bg-background p-6 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!currentStudent) {
    return (
      <>
        <GlobalNotification />
        <div className="min-h-screen bg-background p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              onClick={() => router.push("/admin/dashboard/students-manage")}
              variant="outline"
              className="border-border gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Students
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-semibold">Student not found</p>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalNotification />
      <div className="min-h-screen bg-background p-6">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <Button
            onClick={() => router.push("/admin/students")}
            variant="outline"
            className="border-border gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Students
          </Button>

          <Button
            onClick={() => setIsEditDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-border bg-card">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-foreground">
                      {currentStudent.firstName} {currentStudent.lastName}
                    </h1>
                    <p className="text-blue-600 font-semibold text-lg mt-2">
                      {currentStudent.department} • {currentStudent.year}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold border ${
                          currentStudent.status === "Active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {currentStudent.status}
                      </span>
                      <span className="flex items-center gap-2 text-amber-600 font-bold text-xl">
                        <Zap className="w-6 h-6 fill-amber-600" />
                        {currentStudent.rewardPoints} Points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border bg-card h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Email</p>
                  <p className="text-foreground font-medium mt-1">
                    {currentStudent.userId?.email || "Not linked"}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Phone</p>
                  <p className="text-foreground font-medium mt-1">{currentStudent.phone}</p>
                </div>

                {/* Place */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Place</p>
                  <p className="text-foreground font-medium mt-1">{currentStudent.place}</p>
                </div>

                {/* Created Date */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Joined On</p>
                  <p className="text-foreground font-medium mt-1">
                    {new Date(currentStudent.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Middle Column - Academic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Card className="border-border bg-card h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Book className="w-5 h-5 text-blue-600" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Department */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Department</p>
                  <p className="text-foreground font-medium mt-1">{currentStudent.department}</p>
                </div>

                {/* Year */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Year</p>
                  <p className="text-foreground font-medium mt-1">{currentStudent.year} Year</p>
                </div>

                {/* Roll No */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Roll Number</p>
                  <p className="text-foreground font-medium mt-1 uppercase">
                    {currentStudent.rollNo || "N/A"}
                  </p>
                </div>

                {/* CGPA & Arrears */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm font-semibold">CGPA</p>
                    <p className="text-foreground font-bold text-lg mt-1 text-blue-600">
                      {currentStudent.cgpa || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-semibold">Arrears</p>
                    <p className={`font-bold text-lg mt-1 ${currentStudent.arrearCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                      {currentStudent.arrearCount || "0"}
                    </p>
                  </div>
                </div>

                {/* Good At */}
                {currentStudent.goodAt && currentStudent.goodAt.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-sm font-semibold mb-2">Areas of Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {currentStudent.goodAt.map((skill, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Student ID */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Student ID</p>
                  <p className="text-foreground font-medium mt-1 text-xs break-all">
                    {currentStudent._id}
                  </p>
                </div>

                {/* Reward Points */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      <p className="text-foreground font-semibold">Reward Points</p>
                    </div>
                    <p className="text-2xl font-black text-amber-600">
                      {currentStudent.rewardPoints}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Parent Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-border bg-card h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Parent Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Parent Name */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Parent Name</p>
                  <p className="text-foreground font-medium mt-1">{currentStudent.parentName}</p>
                </div>

                {/* Parent Phone */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Parent Phone</p>
                  <p className="text-foreground font-medium mt-1">
                    {currentStudent.parentPhone}
                  </p>
                </div>

                {/* Family Income */}
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Family Income</p>
                  <p className="text-foreground font-medium mt-1">
                    {currentStudent.familyIncome || "Not specified"}
                  </p>
                </div>

                {/* Student Name for Reference */}
                <div className="pt-4 border-t border-border">
                  <p className="text-muted-foreground text-sm font-semibold">Student Name</p>
                  <p className="text-foreground font-medium mt-1">
                    {currentStudent.firstName} {currentStudent.lastName}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8"
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Status Card */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-600 text-sm font-semibold">Status</p>
                  <p className="text-green-900 font-bold mt-2">{currentStudent.status}</p>
                </div>

                {/* Department Card */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-600 text-sm font-semibold">Department</p>
                  <p className="text-blue-900 font-bold mt-2">{currentStudent.department}</p>
                </div>

                {/* Year Card */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-purple-600 text-sm font-semibold">Year</p>
                  <p className="text-purple-900 font-bold mt-2">{currentStudent.year}</p>
                </div>

                {/* Reward Points Card */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-600 text-sm font-semibold">Reward Points</p>
                  <p className="text-amber-900 font-bold mt-2">{currentStudent.rewardPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Student Profile</DialogTitle>
            <DialogDescription>Update student information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name Fields */}
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

            {/* Contact Fields */}
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

            {/* Academic Fields */}
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
                <Label className="text-sm font-semibold text-foreground">Roll No</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).rollNo || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, rollNo: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Family Income</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).familyIncome || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, familyIncome: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">CGPA</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="mt-2 border-border"
                  value={(editFormData as any).cgpa || 0}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, cgpa: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Arrear Count</Label>
                <Input
                  type="number"
                  className="mt-2 border-border"
                  value={(editFormData as any).arrearCount || 0}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, arrearCount: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-foreground">Good At (comma separated)</Label>
              <Input
                className="mt-2 border-border"
                value={(editFormData as any).goodAt?.join(", ") || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, goodAt: e.target.value.split(",").map(s => s.trim()).filter(s => s) })
                }
              />
            </div>

            {/* Parent Fields */}
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

            {/* Reward Points */}
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

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={() => setIsEditDialogOpen(false)}
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