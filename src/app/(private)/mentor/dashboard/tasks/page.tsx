"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckSquare, Filter, Plus, Calendar, Download } from "lucide-react";
import { useMentorDashboardStore } from "@/store/mentor/dashboard";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";

const priorityColors = {
  High: "text-red-600 bg-red-50",
  Medium: "text-amber-600 bg-amber-50",
  Low: "text-green-600 bg-green-50",
};

const statusColors = {
  "To Do": "bg-slate-50 text-slate-700",
  "In Progress": "bg-blue-50 text-blue-700",
  "Done": "bg-green-50 text-green-700",
};

export default function TasksPage() {
  const { tasks, tasksLoading, fetchTasks } = useMentorDashboardStore();
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
         <GlobalNotification />
   
         <Header
             title='Mentor Dashboard'
             subtitle="Welcome back! Here's what's happening today."
             HeaderComp={
               <div style={{ display: "flex", gap: 10 }}>
                 <Button style={{
                   display: "flex", alignItems: "center", gap: 6, fontSize: 13,
                   background: "var(--primary)", color: "var(--primary-foreground)",
                 }}>
                   <Download size={14} />
                   Export
                 </Button>
               </div>
             }
           />

      <div className="space-y-8 px-5 py-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground mt-2">
              Track and manage student tasks and assignments
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Task
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {["All", "To Do", "In Progress", "Done"].map((status) => (
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

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <CardDescription>
              {filteredTasks.length} of {tasks.length} tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell className="text-sm">
                          {task.assignedTo}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={priorityColors[task.priority as keyof typeof priorityColors]}
                          >
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusColors[task.status as keyof typeof statusColors]}
                          >
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground">No tasks found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ div>
  );
}
