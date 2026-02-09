"use client";
import React, { useEffect, useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAdminProjectsStore } from '@/store/admin/projects';
import Link from 'next/link';
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";
// import { Select, SelectContent } from "@/components/ui/select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Github, Globe, GraduationCap, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProjectsAdmin() {
  const { projects, total, page, limit, isLoading, fetchProjects, setPage, setFilters } = useAdminProjectsStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

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

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Ongoing":
      case "In Progress":
        return "secondary";
      case "Pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (<>
    <GlobalNotification />

    <Header
      title="Projects"
      subtitle="Track, manage, and monitor student project progress in one place."
    />

    <div className="min-h-screen bg-background p-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex gap-2 w-full sm:w-1/2">
            <Input placeholder="Search projects..." className="shadow-none py-5 focus:outline-blue-500" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button onClick={handleSearch} className="py-5">Search</Button>
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

            <Button variant="outline" className="py-4 bg-primary text-background" onClick={() => fetchProjects()}>
              Refresh
            </Button>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">
          {isLoading && <div>Loading...</div>}
          {!isLoading && projects.length === 0 && <div className="text-muted-foreground">No projects found</div>}

          {projects.map((p) => {
            const student = p.studentId;
            const mentor = p.mentorId;

            return (
              <Card
                key={p._id}
                className="group hover:shadow-sm transition-all shadow-none duration-200 border cursor-pointer border-border flex flex-col min-h-[220px]"
              >
                {/* HEADER */}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">
                      {p.title || "Untitled Project"}
                    </CardTitle>

                    <Badge variant={getStatusVariant(p.status)}>
                      {p.status || "Unknown"}
                    </Badge>
                  </div>

                  <CardDescription className="flex flex-col gap-1 pt-1">
                    {mentor ? (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Guided by <span className="font-medium">{mentor.name}</span>
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Mentor: —
                      </div>
                    )}

                    {student ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {student.firstName} {student.lastName}
                          <span className="text-muted-foreground ml-1">
                            • {student.department} • {student.year}
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

                {/* BODY – takes remaining space */}
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {p.description || "No description provided"}
                  </p>

                  <div className="flex gap-3 mt-3">
                    {p.githubLink && (
                      <Link href={p.githubLink} target="_blank">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Github className="w-4 h-4" /> GitHub
                        </Button>
                      </Link>
                    )}

                    {p.websiteLink && (
                      <Link href={p.websiteLink} target="_blank">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Globe className="w-4 h-4" /> Live
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>

                {/* FOOTER – ALWAYS AT BOTTOM */}
                <CardFooter className="pt-3 pb-3 flex justify-between items-center border-t">
                  <div className="text-xs text-muted-foreground">
                    {p.completedAt
                      ? `Completed on ${new Date(p.completedAt).toLocaleDateString()}`
                      : "Not completed yet"}
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

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{`Showing ${projects.length} of ${total}`}</div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => { setPage(page - 1); fetchProjects({ page: page - 1 }); }}>Prev</Button>
            <div className="px-3 py-2 rounded-md border border-input bg-transparent">{`${page} / ${totalPages}`}</div>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => { setPage(page + 1); fetchProjects({ page: page + 1 }); }}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
