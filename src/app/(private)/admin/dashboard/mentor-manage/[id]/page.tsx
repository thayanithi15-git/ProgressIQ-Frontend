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
  Award,
  User,
  AlertCircle,
  Building2,
  GraduationCap,
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
} from "@/components/ui/dialog";
import { useMentorManagementStore, UpdateMentorPayload } from "@/store/admin/mentor-manage";
import GlobalNotification from "@/components/notify/notification";

export default function MentorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const mentorId = params.id as string;

  const { currentMentor, isLoading, fetchMentorById, updateMentor } = useMentorManagementStore();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateMentorPayload>({});

  useEffect(() => {
    if (mentorId) {
      fetchMentorById(mentorId);
    }
  }, [mentorId]);

  useEffect(() => {
    if (currentMentor) {
      setEditFormData({
        name: currentMentor.name,
        email: currentMentor.email,
        contactNo: currentMentor.contactNo,
        place: currentMentor.place,
        department: currentMentor.department,
        designation: currentMentor.designation,
      });
    }
  }, [currentMentor]);

  const handleSaveEdit = async () => {
    if (currentMentor) {
      await updateMentor(currentMentor._id, editFormData);
      setIsEditDialogOpen(false);
      await fetchMentorById(currentMentor._id);
    }
  };

  const getDesignationColor = (designation: string) => {
    const colors: Record<string, string> = {
      Professor: "bg-purple-100 text-purple-800 border-purple-200",
      "Associate Professor": "bg-blue-100 text-blue-800 border-blue-200",
      "Assistant Professor": "bg-green-100 text-green-800 border-green-200",
      Lecturer: "bg-amber-100 text-amber-800 border-amber-200",
    };
    return colors[designation] || "bg-gray-100 text-gray-800 border-gray-200";
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

  if (!currentMentor) {
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
              onClick={() => router.push("/admin/dashboard/mentor-manage")}
              variant="outline"
              className="border-border gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Mentors
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-semibold">Mentor not found</p>
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
            onClick={() => router.push("/admin/mentors")}
            variant="outline"
            className="border-border gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mentors
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
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-foreground">{currentMentor.name}</h1>
                    <div className="flex items-center gap-3 mt-3">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getDesignationColor(
                          currentMentor.designation
                        )}`}
                      >
                        {currentMentor.designation}
                      </span>
                      <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        {currentMentor.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{currentMentor.place}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Contact Information */}
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
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <p className="text-blue-600 text-sm font-semibold">Email Address</p>
                  </div>
                  <p className="text-blue-900 font-medium ml-8">{currentMentor.email}</p>
                </div>

                {/* Phone */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <p className="text-green-600 text-sm font-semibold">Contact Number</p>
                  </div>
                  <p className="text-green-900 font-medium ml-8">{currentMentor.contactNo}</p>
                </div>

                {/* Place */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <p className="text-amber-600 text-sm font-semibold">Location</p>
                  </div>
                  <p className="text-amber-900 font-medium ml-8">{currentMentor.place}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Professional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Card className="border-border bg-card h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Department */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Book className="w-5 h-5 text-purple-600" />
                    <p className="text-purple-600 text-sm font-semibold">Department</p>
                  </div>
                  <p className="text-purple-900 font-bold text-lg ml-8">
                    {currentMentor.department}
                  </p>
                </div>

                {/* Designation */}
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <p className="text-indigo-600 text-sm font-semibold">Designation</p>
                  </div>
                  <p className="text-indigo-900 font-bold text-lg ml-8">
                    {currentMentor.designation}
                  </p>
                </div>

                {/* Mentor ID */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <p className="text-gray-600 text-sm font-semibold">Mentor ID</p>
                  </div>
                  <p className="text-gray-900 font-mono text-xs ml-8 break-all">
                    {currentMentor._id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info at Bottom - Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Name Card */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <p className="text-blue-600 text-sm font-semibold">Full Name</p>
                  </div>
                  <p className="text-blue-900 font-bold">{currentMentor.name}</p>
                </div>

                {/* Department Card */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Book className="w-4 h-4 text-purple-600" />
                    <p className="text-purple-600 text-sm font-semibold">Department</p>
                  </div>
                  <p className="text-purple-900 font-bold">{currentMentor.department}</p>
                </div>

                {/* Designation Card */}
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <p className="text-indigo-600 text-sm font-semibold">Designation</p>
                  </div>
                  <p className="text-indigo-900 font-bold">{currentMentor.designation}</p>
                </div>

                {/* Location Card */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <p className="text-green-600 text-sm font-semibold">Location</p>
                  </div>
                  <p className="text-green-900 font-bold">{currentMentor.place}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6"
        >
          <Card className="border-border bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-semibold">Contact Email</p>
                  <p className="text-foreground font-bold mt-1">{currentMentor.email}</p>
                </div>
                <div className="text-center p-4">
                  <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-semibold">Phone Number</p>
                  <p className="text-foreground font-bold mt-1">{currentMentor.contactNo}</p>
                </div>
                <div className="text-center p-4">
                  <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-semibold">Department</p>
                  <p className="text-foreground font-bold mt-1">{currentMentor.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Mentor Profile</DialogTitle>
            <DialogDescription>Update mentor information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label className="text-sm font-semibold text-foreground">Full Name</Label>
              <Input
                className="mt-2 border-border"
                value={(editFormData as any).name || ""}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>

            {/* Email & Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Email</Label>
                <Input
                  className="mt-2 border-border"
                  value={(editFormData as any).email || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
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

            {/* Department & Designation */}
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

            {/* Place */}
            <div>
              <Label className="text-sm font-semibold text-foreground">Place</Label>
              <Input
                className="mt-2 border-border"
                value={(editFormData as any).place || ""}
                onChange={(e) => setEditFormData({ ...editFormData, place: e.target.value })}
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