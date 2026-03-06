"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Header from "@/components/layout/header";
import GlobalNotification from "@/components/notify/notification";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Github, Globe, GraduationCap, User, ArrowLeft } from "lucide-react";

import { useAdminProjectsStore } from "@/store/admin/projects";

export default function ProjectDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [project, setProject] = useState<any>(null);
  const { fetchProjectById } = useAdminProjectsStore();

  useEffect(() => {
    if (!id) return;

    (async () => {
      const p = await fetchProjectById(id);
      setProject(p);
    })();
  }, [id]);

  const getStatusClass = (status?: string) => {
    switch (status) {
      case "Completed":
        return "text-green-700 bg-green-100";
      case "Ongoing":
      case "In Progress":
        return "text-blue-700 bg-blue-100";
      case "Pending":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  if (!project) {
    return (
      <div>
        <GlobalNotification />
        <Header
          title="Project Detail"
          subtitle="Loading project information..."
        />
        <div className="p-6">Loading...</div>
      </div>
    );
  }

  const student = project.studentId;
  const mentor = project.mentorId;

  return (
    <>
      <GlobalNotification />

      <Header
        title="Project Detail"
        subtitle="Complete overview of the selected project"
      />

      <div className="min-h-screen bg-background p-6 space-y-5">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{project.title}</h2>
            <p className="text-sm text-muted-foreground">
              Detailed information about this project
            </p>
          </div>

          <Link href="/admin/dashboard/projects">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* MAIN CARD */}
        <Card className="border border-border/60">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Overview</CardTitle>

              <div
                className={`px-2 py-1 rounded-md text-xs font-medium w-fit ${getStatusClass(
                  project.status
                )}`}
              >
                {project.status || "Unknown"}
              </div>
            </div>

            <CardDescription>
              {project.description || "No description provided"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* PEOPLE SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mentor */}
              <Card className="shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Mentor
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-sm">
                  {mentor ? (
                    <div className="space-y-1">
                      <p className="font-medium">{mentor.name}</p>
                      <p className="text-muted-foreground">
                        {mentor.department} • {mentor.designation}
                      </p>
                      <p className="text-muted-foreground">
                        {mentor.email}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Not assigned</p>
                  )}
                </CardContent>
              </Card>

              {/* Student */}
              <Card className="shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Student
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-sm">
                  {student ? (
                    <div className="space-y-1">
                      <p className="font-medium">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-muted-foreground">
                        {student.department} • {student.year}
                      </p>
                      <p className="text-muted-foreground">
                        Reward Points: {student.rewardPoints}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Not assigned</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* LINKS SECTION */}
            <div>
              <h3 className="text-sm font-medium mb-3">Project Links</h3>

              <div className="flex gap-3">
                {project.githubLink ? (
                  <Link href={project.githubLink} target="_blank">
                    <Button className="gap-2 bg-black text-white hover:bg-gray-800 hover:text-white">
                      <Github className="w-4 h-4" />
                      GitHub Repository
                    </Button>
                  </Link>
                ) : (
                  <Button
                    disabled
                    className="bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    No GitHub Link
                  </Button>
                )}

                {project.websiteLink ? (
                  <Link href={project.websiteLink} target="_blank">
                    <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:text-white">
                      <Globe className="w-4 h-4" />
                      Live Website
                    </Button>
                  </Link>
                ) : (
                  <Button
                    disabled
                    className="bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    No Website Link
                  </Button>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t">
            <div className="text-sm text-muted-foreground">
              {project.completedAt
                ? `Completed on ${new Date(
                  project.completedAt
                ).toLocaleDateString()}`
                : "Not completed yet"}
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
