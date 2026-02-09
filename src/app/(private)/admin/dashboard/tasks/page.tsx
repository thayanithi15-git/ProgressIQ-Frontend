"use client";

import React, { useEffect, useState } from "react";

import Header from "@/components/layout/header";
import GlobalNotification from "@/components/notify/notification";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { ClipboardList, GraduationCap, Calendar } from "lucide-react";

import { useAdminTasksStore } from "@/store/admin/tasks";

export default function TasksPage() {
  const {
    tasks,
    total,
    page,
    limit,
    isLoading,
    fetchTasks,
    setPage,
    setFilters,
  } = useAdminTasksStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearch = () => {
    setFilters({ search });
    fetchTasks({ page: 1, filters: { search } });
  };

  const handleStatus = (s: string) => {
    setStatus(s);
    setFilters({ status: s });
    fetchTasks({ page: 1, filters: { status: s } });
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Ongoing":
      case "In Progress":
        return "secondary";
      case "Pending":
        return "outline";
      case "Overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (
    <>
      <GlobalNotification />

      <Header
        title="Tasks"
        subtitle="Tasks assigned by mentors to students"
      />

      <div className="min-h-screen bg-background p-6">
        <div className="space-y-4">
          {/* TOP BAR */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex gap-2 w-full sm:w-1/2">
              <Input
                placeholder="Search tasks..."
                className="shadow-none py-5"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} className="py-5">
                Search
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              <Select
                value={status}
                onValueChange={(value) => handleStatus(value)}
              >
                <SelectTrigger className="w-[160px] py-5 shadow-none">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="py-4 bg-primary text-background"
                onClick={() => fetchTasks()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">
            {isLoading && <div>Loading...</div>}

            {!isLoading && tasks.length === 0 && (
              <div className="text-muted-foreground">
                No tasks found
              </div>
            )}

            {tasks.map((t) => {
              const mentor = t.mentorId;

              return (
                <Card
                  key={t._id}
                className="group hover:shadow-sm transition-all shadow-none duration-200 border cursor-pointer border-border flex flex-col min-h-[220px]"
                >
                  {/* HEADER */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between gap-3 items-start">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-muted-foreground" />
                        {t.title || "Untitled Task"}
                      </CardTitle>

                      <Badge variant={getStatusVariant(t.status)}>
                        {t.status || "Unknown"}
                      </Badge>
                    </div>

                    <CardDescription className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      {mentor?.name || "No mentor assigned"}
                    </CardDescription>
                  </CardHeader>

                  {/* BODY */}
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {t.description || "No description provided"}
                    </p>

                    <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Due:{" "}
                      {t.dueDate
                        ? new Date(t.dueDate).toLocaleDateString()
                        : "—"}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 pb-3 border-t flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {t.completedAt
                        ? `Completed on ${new Date(
                            t.completedAt
                          ).toLocaleDateString()}`
                        : "Not completed yet"}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Mentor: {mentor?.department || "—"}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {`Showing ${tasks.length} of ${total}`}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => {
                  setPage(page - 1);
                  fetchTasks({ page: page - 1 });
                }}
              >
                Prev
              </Button>

              <div className="px-3 py-2 rounded-md border border-input bg-transparent">
                {`${page} / ${totalPages}`}
              </div>

              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => {
                  setPage(page + 1);
                  fetchTasks({ page: page + 1 });
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
