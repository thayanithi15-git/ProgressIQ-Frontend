"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  BookOpen,
  Award,
  TrendingUp,
  Briefcase,
  ClipboardList,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useStudentDashboardStore } from "@/store/student/dashboard";
import GlobalNotification from "@/components/notify/notification";
import Link from "next/link";

// ==========================================
// CHART COLORS
// ==========================================
const CHART_COLORS = {
  primary: "oklch(0.5393 0.2713 250.0000)",
  secondary: "oklch(0.7459 0.1483 156.4499)",
  accent: "oklch(0.7336 0.1758 50.5517)",
  chart1: "#8B5CF6",
  chart2: "#3B82F6",
  chart3: "#10B981",
  chart4: "#F59E0B",
};

// ==========================================
// STAT CARD COMPONENT
// ==========================================
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-black text-foreground">{value}</h3>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-7 h-7" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// ==========================================
// CUSTOM TOOLTIP COMPONENT
// ==========================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload?.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
export default function StudentDashboard() {
  const {
    dashboard,
    dashboardLoading,
    fetchDashboard,
    tasks,
    tasksLoading,
    fetchTasks,
    projects,
    projectsLoading,
    fetchProjects,
    notifications,
    notificationsLoading,
    fetchNotifications,
  } = useStudentDashboardStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchTasks();
    fetchProjects();
    fetchNotifications();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchDashboard(),
      fetchTasks(),
      fetchProjects(),
      fetchNotifications(),
    ]);
    setIsRefreshing(false);
  };

  const pointsProgressData = [
    { date: "Week 1", points: 150 },
    { date: "Week 2", points: 320 },
    { date: "Week 3", points: 450 },
    { date: "Week 4", points: 620 },
    { date: "Week 5", points: 780 },
    { date: "Week 6", points: 950 },
  ];

  const nextMilestone = dashboard ? dashboard.nextRankPoints - dashboard.totalPoints : 0;

  return (
    <>
      <GlobalNotification />
      <div className="space-y-8">
        {/* Personalized Greeting */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, <span className="text-primary">{dashboard?.name.split(" ")[0]}</span>!
          </h1>
          <p className="text-muted-foreground">
            Here's your progress and what you need to focus on today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardLoading ? (
            <>
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </>
          ) : dashboard ? (
            <>
              <StatCard
                title="Total Points"
                value={dashboard.totalPoints}
                icon={Zap}
                description={`${nextMilestone} to next rank`}
                color={CHART_COLORS.chart4}
              />
              <StatCard
                title="Overall Rank"
                value={`#${dashboard.rank}`}
                icon={TrendingUp}
                description={`Top ${100 - dashboard.rank}%`}
                color={CHART_COLORS.chart1}
              />
              <StatCard
                title="Projects Completed"
                value={dashboard.projectsCompleted}
                icon={Briefcase}
                description={`${dashboard.certificationsEarned} certs earned`}
                color={CHART_COLORS.chart3}
              />
              <StatCard
                title="Internships Done"
                value={dashboard.internshipsCompleted}
                icon={BookOpen}
                description="Active learning"
                color={CHART_COLORS.chart2}
              />
            </>
          ) : null}
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <Link href="/student/projects">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Create Project</p>
                    <p className="text-lg font-semibold mt-1">Start New</p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <Link href="/student/tasks">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Tasks</p>
                    <p className="text-lg font-semibold mt-1">
                      {tasks?.filter((t) => t.status !== "Completed")?.length} Left
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <Link href="/student/profile">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Ranking</p>
                    <p className="text-lg font-semibold mt-1">
                      Rank #{dashboard?.rank || "-"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Points Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Points Progress</CardTitle>
              <CardDescription>Your points accumulated over the weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pointsProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke={CHART_COLORS.chart4}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.chart4, r: 4 }}
                    name="Points"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rank Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Rank Progress</CardTitle>
              <CardDescription>Your progress to the next rank</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current: {dashboard?.currentRank || "Loading..."}</span>
                  <span className="text-sm text-muted-foreground">
                    {dashboard?.totalPoints || 0} / {dashboard?.nextRankPoints || 0} points
                  </span>
                </div>
                <Progress
                  value={
                    dashboard && dashboard.nextRankPoints > 0
                      ? (dashboard.totalPoints / dashboard.nextRankPoints) * 100
                      : 0
                  }
                  className="h-3"
                />
                <p className="text-xs text-muted-foreground">
                  {nextMilestone} points needed for next rank
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    Department Rank: <strong>#{dashboard?.departmentRank || "-"}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">
                    Certifications Earned: <strong>{dashboard?.certificationsEarned || 0}</strong>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your latest submissions</CardDescription>
              </div>
              <Link href="/student/projects">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : projects?.length > 0 ? (
                <div className="space-y-3">
                  {projects.slice(0, 4).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          project.status === "Approved" ? "default" : "outline"
                        }
                        className={
                          project.status === "Approved"
                            ? "bg-green-500"
                            : project.status === "Rejected"
                            ? "bg-red-500"
                            : ""
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground text-sm">
                  No projects yet. Create one to get started!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>
                  {tasks?.filter((t) => t.status !== "Completed")?.length} active
                </CardDescription>
              </div>
              <Link href="/student/tasks">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : tasks?.length > 0 ? (
                <div className="space-y-3">
                  {tasks
                    ?.filter((t) => t.status !== "Completed")
                    .slice(0, 4)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Due:{" "}
                            {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground text-sm">
                  No pending tasks. Great job!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
