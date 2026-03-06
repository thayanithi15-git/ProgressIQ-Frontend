"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAdminProjectsStore } from "@/store/admin/projects";
import Link from "next/link";

import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";

import { Github, Globe, GraduationCap, User } from "lucide-react";

export default function ProjectsAdmin() {
  const { projects, total, page, limit, isLoading, fetchProjects, setPage, setFilters } =
    useAdminProjectsStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = () => {
    setFilters({ search });
    fetchProjects({ page: 1, filters: { search } });
  };

  const handleStatus = (s: string) => {
    setStatus(s);
    setFilters({ status: s });
    fetchProjects({ page: 1, filters: { status: s } });
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "Ongoing":
      case "In Progress":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (
    <>
      <GlobalNotification />

      <Header
        title="Projects"
        subtitle="Track, manage, and monitor student project progress in one place."
      />

      <div className="min-h-screen bg-background p-6">
        <div className="space-y-4">

          {/* TOP BAR */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">

            <div className="flex gap-2 w-full sm:w-1/2">
              <Input
                placeholder="Search projects..."
                className="shadow-none py-5 focus:outline-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button onClick={handleSearch} className="py-5">
                Search
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              <Select value={status} onValueChange={(value) => handleStatus(value)}>
                <SelectTrigger className="w-[160px] py-5 shadow-none">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="py-4 bg-primary text-background"
                onClick={() => fetchProjects()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* PROJECT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">

            {isLoading && <div>Loading...</div>}

            {!isLoading && projects.length === 0 && (
              <div className="text-muted-foreground">No projects found</div>
            )}

            {projects.map((p) => {
              const student = p.studentId;
              const mentor = p.mentorId;

              return (
                <Card
                  key={p._id}
                  className="group relative overflow-hidden border border-border/60 bg-card/70 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col min-h-[230px]"
                >

                  {/* TOP HOVER BAR */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-transparent group-hover:bg-primary transition" />

                  {/* HEADER */}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">

                      <CardTitle className="text-lg font-semibold">
                        {p.title || "Untitled Project"}
                      </CardTitle>

                      <div
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusClass(
                          p.status
                        )}`}
                      >
                        {p.status || "Unknown"}
                      </div>
                    </div>

                    <CardDescription className="flex flex-col gap-2 pt-2">

                      {/* MENTOR */}
                      {mentor ? (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-muted-foreground" />

                          <span className="text-sm">
                            Guided by{" "}
                            <span className="font-semibold text-blue-600">
                              {mentor.name}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Mentor: —
                        </div>
                      )}

                      {/* STUDENT */}
                      {student ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-orange-500" />

                          <span className="text-sm">
                            <span className="font-medium text-orange-500">
                              {student.firstName} {student.lastName}
                            </span>

                            <span className="text-muted-foreground ml-2">
                              {student.department} • Year {student.year}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Student: —
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>

                  {/* BODY */}
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {p.description || "No description provided"}
                    </p>

                    {/* LINKS */}
                    <div className="flex gap-3 mt-4">

                      {p.githubLink && (
                        <Link href={p.githubLink} target="_blank">
                          <Button
                            size="sm"
                            className="gap-2 bg-black text-white hover:bg-gray-800 hover:text-white shadow-sm"
                          >
                            <Github className="w-4 h-4" />
                            GitHub
                          </Button>
                        </Link>
                      )}

                      {p.websiteLink && (
                        <Link href={p.websiteLink} target="_blank">
                          <Button
                            size="sm"
                            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-sm"
                          >
                            <Globe className="w-4 h-4" />
                            Live
                          </Button>
                        </Link>
                      )}

                    </div>
                  </CardContent>

                  {/* FOOTER */}
                  <CardFooter className="pt-3 pb-3 flex justify-between items-center border-t">

                    <div className="text-xs text-muted-foreground">
                      {p.completedAt ? (
                        <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600">
                          Completed {new Date(p.completedAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md bg-muted">
                          In Progress
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/admin/dashboard/projects/${p._id}`}
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      View Details →
                    </Link>

                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between">

            <div className="text-sm text-muted-foreground">
              {`Showing ${projects.length} of ${total}`}
            </div>

            <div className="flex gap-2">

              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => {
                  setPage(page - 1);
                  fetchProjects({ page: page - 1 });
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
                  fetchProjects({ page: page + 1 });
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