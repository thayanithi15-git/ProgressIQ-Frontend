"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Mail, BookOpen, TrendingUp, Filter } from "lucide-react";
import { useMentorDashboardStore } from "@/store/mentor/dashboard";
import GlobalNotification from "@/components/notify/notification";

export default function AssignedStudentsPage() {
  const { assignedStudents, studentsLoading, fetchAssignedStudents } =
    useMentorDashboardStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchAssignedStudents(1, 50);
  }, []);

  const filteredStudents = assignedStudents.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || student.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <GlobalNotification />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assigned Students</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your mentored students
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["All", "Active", "Inactive"].map((status) => (
                  <Button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student List</CardTitle>
                <CardDescription>
                  Showing {filteredStudents.length} of {assignedStudents.length} students
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            {student.email}
                          </div>
                        </TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell className="text-center">{student.year}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {student.points}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {student.projectsCompleted}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(student.lastActive).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={student.status === "Active" ? "default" : "outline"}
                            className={
                              student.status === "Active"
                                ? "bg-green-500 hover:bg-green-600"
                                : ""
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
