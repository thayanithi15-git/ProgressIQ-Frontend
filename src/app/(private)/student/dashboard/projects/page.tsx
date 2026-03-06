"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, FileText, Send, Briefcase } from "lucide-react";
import { useStudentDashboardStore } from "@/store/student/dashboard";
import GlobalNotification from "@/components/notify/notification";

export default function ProjectsPage() {
  const {
    projects,
    projectsLoading,
    fetchProjects,
    createProject,
  } = useStudentDashboardStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (formData.title.trim()) {
      await createProject(formData.title, formData.description);
      setFormData({ title: "", description: "" });
      setIsDialogOpen(false);
    }
  };

  const statusColors = {
    "Draft": "bg-slate-50 text-slate-700",
    "Submitted": "bg-blue-50 text-blue-700",
    "Approved": "bg-green-50 text-green-700",
    "Rejected": "bg-red-50 text-red-700",
  };

  return (
    <>
      <GlobalNotification />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your academic projects
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" size="lg">
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Share your project with your mentor for review
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Project Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter project title"
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your project..."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleCreateProject}
                    className="flex-1"
                    disabled={!formData.title.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
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
                      <CardDescription className="mt-2 line-clamp-2">
                        {project.description || "No description provided"}
                      </CardDescription>
                    </div>
                    <Briefcase className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge
                        className={
                          statusColors[project.status as keyof typeof statusColors]
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    {project.points && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Points</span>
                        <Badge variant="secondary">{project.points}</Badge>
                      </div>
                    )}
                  </div>

                  {project.mentorFeedback && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-blue-900 mb-1">Mentor Feedback</p>
                      <p className="text-xs text-blue-800">{project.mentorFeedback}</p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Created {new Date(project.createdDate).toLocaleDateString()}
                  </div>

                  <Button className="w-full" variant="outline" size="sm">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">No projects yet. Create one to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
