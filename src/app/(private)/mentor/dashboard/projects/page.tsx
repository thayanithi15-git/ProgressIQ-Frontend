"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase, Download, Plus, TrendingUp, Users } from "lucide-react";
import { useMentorDashboardStore } from "@/store/mentor/dashboard";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";

const statusColors = {
  "In Progress": "bg-blue-50 text-blue-700",
  "Completed": "bg-green-50 text-green-700",
  "Pending": "bg-amber-50 text-amber-700",
};

export default function ProjectsPage() {
  const { projects, projectsLoading, fetchProjects } = useMentorDashboardStore();

  useEffect(() => {
    fetchProjects();
  }, []);

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
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor your mentored student projects
            </p>
          </div>
        </div>

        {/* Project Cards */}
        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm text-muted-foreground">
                        {project.completionRate}%
                      </span>
                    </div>
                    <Progress value={project.completionRate} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Students</p>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <p className="font-semibold">{project.studentsCount}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge
                        className={statusColors[project.status as keyof typeof statusColors]}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created {new Date(project.createdDate).toLocaleDateString()}
                  </div>

                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">No projects found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
