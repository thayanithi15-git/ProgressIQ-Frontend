"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserManagementStore, StudentData, User, UpdateUserPayload } from "@/store/admin/user-manage";
import { Mail, Phone, Calendar, MapPin, Book, Users, Award } from "lucide-react";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | StudentData | null;
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const { updateUser, isLoading } = useUserManagementStore();
  const [formData, setFormData] = useState<UpdateUserPayload>({});

  useEffect(() => {
    if (user) {
      setFormData({
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
    }
  }, [user, open]);

  const isStudentData = (user: User | StudentData | null): user is StudentData => {
    return user !== null && "firstName" in user;
  };

  const handleSubmit = async () => {
    if (!user) return;

    await updateUser(user._id, formData);
    onOpenChange(false);
  };

  if (!user) return null;

  const isStudent = isStudentData(user);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit User</DialogTitle>
          <DialogDescription>
            Update user information and settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            {isStudent && <TabsTrigger value="academic">Academic</TabsTrigger>}
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {isStudent && (
                <>
                  <div>
                    <Label className="text-sm font-semibold text-foreground">
                      First Name
                    </Label>
                    <Input
                      placeholder="First Name"
                      className="mt-2 border-border"
                      value={(formData as any).firstName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                      placeholder="Last Name"
                      className="mt-2 border-border"
                      value={(formData as any).lastName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <Label className="text-sm font-semibold text-foreground">Email</Label>
              <Input
                type="email"
                placeholder="user@college.edu"
                className="mt-2 border-border"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {isStudent && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-foreground">
                      Phone
                    </Label>
                    <Input
                      placeholder="9876543210"
                      className="mt-2 border-border"
                      value={(formData as any).phone || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-foreground">
                      Date of Birth
                    </Label>
                    <Input
                      type="date"
                      className="mt-2 border-border"
                      value={
                        (formData as any).dob
                          ? new Date((formData as any).dob)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dob: new Date(e.target.value).toISOString(),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-foreground">
                      Gender
                    </Label>
                    <Select
                      value={(formData as any).gender || "MALE"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          gender: value as "MALE" | "FEMALE" | "OTHER",
                        })
                      }
                    >
                      <SelectTrigger className="mt-2 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-foreground">
                      Place
                    </Label>
                    <Input
                      placeholder="Chennai"
                      className="mt-2 border-border"
                      value={(formData as any).place || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          place: e.target.value,
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
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setFormData({ ...formData, isActive: value === "active" })
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
          </TabsContent>

          {/* Academic Information */}
          {isStudent && (
            <TabsContent value="academic" className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-foreground">
                    Department
                  </Label>
                  <Input
                    placeholder="Computer Science"
                    className="mt-2 border-border"
                    value={(formData as any).department || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        department: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-foreground">Year</Label>
                  <Select
                    value={(formData as any).year || "1"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        year: value,
                      })
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

              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Academic Year
                </Label>
                <Input
                  placeholder="2023-2027"
                  className="mt-2 border-border"
                  value={(formData as any).academicYear || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      academicYear: e.target.value,
                    })
                  }
                />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Parent Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-foreground">
                      Parent Name
                    </Label>
                    <Input
                      placeholder="Parent Name"
                      className="mt-2 border-border"
                      value={(formData as any).parentName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                      placeholder="9123456789"
                      className="mt-2 border-border"
                      value={(formData as any).parentPhone || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parentPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Reward Points
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="mt-2 border-border"
                  value={(formData as any).rewardPoints || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rewardPoints: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-border">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground font-semibold"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="flex-1 border-border"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}