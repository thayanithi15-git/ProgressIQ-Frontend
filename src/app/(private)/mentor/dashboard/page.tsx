"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  Briefcase,
  ClipboardList,
  TrendingUp,
  Clock,
  AlertCircle,
  RefreshCw,
  Download,
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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMentorDashboardStore } from "@/store/mentor/dashboard";
import { useThemeStore } from "@/store/layoutStore";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";

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
  if (active && payload && payload.length) {
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
export default function MentorDashboard() {
  const {
    stats,
    statsLoading,
    fetchStats,
    activityData,
    pendingApprovals,
    approvalsLoading,
    fetchPendingApprovals,
    assignedStudents,
    studentsLoading,
    fetchAssignedStudents,
    refreshAll,
  } = useMentorDashboardStore();

  const { initializeTheme } = useThemeStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    fetchStats();
    fetchPendingApprovals();
    fetchAssignedStudents(1, 5);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAll();
    await fetchAssignedStudents(1, 5);
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-8">
      <GlobalNotification />

      <Header
          title='Mentor Dashboard'
          subtitle="Welcome back! Here's what's happening today."
          HeaderComp={
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
              >
                <RefreshCw
                  size={14}
                  style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }}
                />
                Refresh
              </Button>
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
        {/* Header Section */}
        

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            <>
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </>
          ) : stats ? (
            <>
              <StatCard
                title="Assigned Students"
                value={stats.totalAssignedStudents}
                icon={Users}
                description={`${stats.activeStudents} active`}
                color={CHART_COLORS.primary}
              />
              <StatCard
                title="Pending Approvals"
                value={stats.pendingApprovals}
                icon={AlertCircle}
                description="Awaiting review"
                color={CHART_COLORS.chart4}
              />
              <StatCard
                title="Projects Managed"
                value={stats.totalProjects}
                icon={Briefcase}
                description={`${stats.completedProjects} completed`}
                color={CHART_COLORS.chart3}
              />
              <StatCard
                title="Tasks Created"
                value={stats.totalTasks}
                icon={ClipboardList}
                description="In progress"
                color={CHART_COLORS.chart2}
              />
            </>
          ) : null}
        </div>

        <Separator />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Approvals and feedback given this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="approvals"
                    stroke={CHART_COLORS.chart1}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.chart1, r: 4 }}
                    name="Approvals"
                  />
                  <Line
                    type="monotone"
                    dataKey="feedback"
                    stroke={CHART_COLORS.chart2}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.chart2, r: 4 }}
                    name="Feedback"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pending Approvals Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Status Breakdown</CardTitle>
              <CardDescription>Distribution of approval statuses</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pending Review</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-800">
                      {pendingApprovals.filter((a) => a.status === "Pending").length}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${((pendingApprovals.filter((a) => a.status === "Pending").length ||
                            0) /
                            (pendingApprovals.length || 1)) *
                          100
                          }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Approved</span>
                    <Badge variant="outline" className="bg-green-50 text-green-800">
                      {pendingApprovals.filter((a) => a.status === "Approved").length}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${((pendingApprovals.filter((a) => a.status === "Approved").length ||
                            0) /
                            (pendingApprovals.length || 1)) *
                          100
                          }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rejected</span>
                    <Badge variant="outline" className="bg-red-50 text-red-800">
                      {pendingApprovals.filter((a) => a.status === "Rejected").length}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${((pendingApprovals.filter((a) => a.status === "Rejected").length ||
                            0) /
                            (pendingApprovals.length || 1)) *
                          100
                          }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Actionable Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Approvals Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Items awaiting your review</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {approvalsLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : pendingApprovals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.slice(0, 5).map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell className="font-medium">{approval.studentName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{approval.entityType}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(approval.submittedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2 opacity-50" />
                  <p className="text-muted-foreground">No pending approvals</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Students Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assigned Students</CardTitle>
                <CardDescription>Your mentored students</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : assignedStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedStudents.slice(0, 5).map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {student.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.points}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={student.status === "Active" ? "default" : "outline"}
                            className={
                              student.status === "Active"
                                ? "bg-green-500"
                                : "text-muted-foreground"
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2 opacity-50" />
                  <p className="text-muted-foreground">No assigned students</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
