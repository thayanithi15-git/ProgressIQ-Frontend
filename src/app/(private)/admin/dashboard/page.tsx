"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  GraduationCap,
  Briefcase,
  Award,
  TrendingUp,
  Star,
  RefreshCw,
  Download,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useAdminDashboardStore } from "@/store/admin/dashboard";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";

// ==========================================
// CHART COLORS (Using theme colors)
// ==========================================
const CHART_COLORS = {
  primary: "oklch(0.5393 0.2713 250.0000)",
  secondary: "oklch(0.7459 0.1483 156.4499)",
  accent: "oklch(0.7336 0.1758 50.5517)",
  muted: "oklch(0.5828 0.1809 240.0000)",
  chart1: "#8B5CF6",
  chart2: "#3B82F6",
  chart3: "#10B981",
  chart4: "#F59E0B",
  chart5: "#EF4444",
};

const PIE_COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

// ==========================================
// STAT CARD COMPONENT
// ==========================================
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  trend?: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description, trend, color }) => (
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
        {/* {trend !== undefined && (
          <div className="mt-4 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-chart-1" />
            <span className="text-sm font-semibold text-chart-1">+{trend}%</span>
            <span className="text-xs text-muted-foreground ml-1">vs last month</span>
          </div>
        )} */}
      </CardContent>
    </Card>
  </motion.div>
);

// ==========================================
// FILTER BUTTON COMPONENT
// ==========================================
interface FilterButtonProps {
  value: string;
  currentValue: string;
  onClick: () => void;
  label: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ value, currentValue, onClick, label }) => (
  <Button
    variant={currentValue === value ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className={`${currentValue === value
      ? "bg-primary text-primary-foreground"
      : "bg-background hover:bg-muted"
      } transition-all`}
  >
    {label}
  </Button>
);

// ==========================================
// CUSTOM TOOLTIP COMPONENT
// ==========================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
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
export default function AdminDashboard() {
  const {
    stats,
    topStudents,
    activityData,
    pointsTrendData,
    departmentDistribution,
    yearDistribution,
    projectStatus,
    internshipTypes,
    monthlySubmissions,
    pointsBySource,
    activityFilter,
    pointsFilter,
    projectStatusFilter,
    submissionFilter,
    pointsSourceFilter,
    topStudentsLimit,
    isLoadingStats,
    isLoadingStudents,
    isLoadingCharts,
    fetchAllData,
    setActivityFilter,
    setPointsFilter,
    setProjectStatusFilter,
    setSubmissionFilter,
    setPointsSourceFilter,
    setTopStudentsLimit,
    refreshDashboard,
  } = useAdminDashboardStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDashboard();
    setIsRefreshing(false);
  };

  // ==========================================
  // RENDER LOADING STATE
  // ==========================================
  if (isLoadingStats && !stats) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* <GlobalNotification /> */}
      <Header
        subtitle="Welcome back! Here's what's happening today."
        HeaderComp={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        } />

      <div className="min-h-screen  bg-background p-6 space-y-6">

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={Users}
            description="Enrolled in system"
            trend={12}
            color={CHART_COLORS.chart1}
          />
          <StatCard
            title="Active Students"
            value={stats?.activeStudents || 0}
            icon={UserCheck}
            description="Currently active"
            trend={8}
            color={CHART_COLORS.chart3}
          />
          <StatCard
            title="Total Mentors"
            value={stats?.totalMentors || 0}
            icon={GraduationCap}
            description="Available mentors"
            color={CHART_COLORS.chart2}
          />
          <StatCard
            title="Projects"
            value={stats?.totalProjects || 0}
            icon={Briefcase}
            description="Total projects"
            trend={15}
            color={CHART_COLORS.chart4}
          />
          <StatCard
            title="Internships"
            value={stats?.totalInternships || 0}
            icon={Award}
            description="Total internships"
            color={CHART_COLORS.chart5}
          />
          <StatCard
            title="Certifications"
            value={stats?.totalCertifications || 0}
            icon={Star}
            description="Earned certificates"
            color={CHART_COLORS.chart3}
          />
          <StatCard
            title="Above Average"
            value={stats?.aboveAvgCount || 0}
            icon={TrendingUp}
            description="Students above avg points"
            color={CHART_COLORS.chart1}
          />
          <StatCard
            title="Average Points"
            value={stats?.avgPoints || 0}
            icon={Star}
            description="System-wide average"
            color={CHART_COLORS.chart4}
          />
        </div>

        {/* Charts Section - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Hours Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Daily Activity Hours</CardTitle>
                    <CardDescription>Student activity tracking over time</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <FilterButton
                      value="week"
                      currentValue={activityFilter}
                      onClick={() => setActivityFilter("week")}
                      label="Week"
                    />
                    <FilterButton
                      value="month"
                      currentValue={activityFilter}
                      onClick={() => setActivityFilter("month")}
                      label="Month"
                    />
                    <FilterButton
                      value="year"
                      currentValue={activityFilter}
                      onClick={() => setActivityFilter("year")}
                      label="Year"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingCharts ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.chart1} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={CHART_COLORS.chart1} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9300 0.0094 245.0000)" />
                      <XAxis
                        dataKey="date"
                        stroke="oklch(0.4386 0 0)"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="oklch(0.4386 0 0)" tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="hours"
                        stroke={CHART_COLORS.chart1}
                        fillOpacity={1}
                        fill="url(#colorHours)"
                        name="Hours Spent"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Points Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Points Trend</CardTitle>
                    <CardDescription>Points awarded over time</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <FilterButton
                      value="week"
                      currentValue={pointsFilter}
                      onClick={() => setPointsFilter("week")}
                      label="Week"
                    />
                    <FilterButton
                      value="month"
                      currentValue={pointsFilter}
                      onClick={() => setPointsFilter("month")}
                      label="Month"
                    />
                    <FilterButton
                      value="year"
                      currentValue={pointsFilter}
                      onClick={() => setPointsFilter("year")}
                      label="Year"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingCharts ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={pointsTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9300 0.0094 245.0000)" />
                      <XAxis
                        dataKey="date"
                        stroke="oklch(0.4386 0 0)"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="oklch(0.4386 0 0)" tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="points"
                        stroke={CHART_COLORS.chart3}
                        strokeWidth={3}
                        dot={{ fill: CHART_COLORS.chart3, r: 4 }}
                        name="Total Points"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section - Row 2 (Pie Charts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Department Distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Departments</CardTitle>
                <CardDescription>Student distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={departmentDistribution}
                      dataKey="students"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.percentage}%`}
                    >
                      {departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {departmentDistribution.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{dept.department}</span>
                      </div>
                      <span className="font-semibold text-foreground">{dept.students}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Year Distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Academic Years</CardTitle>
                <CardDescription>Year-wise breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={yearDistribution}
                      dataKey="students"
                      nameKey="year"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.percentage}%`}
                    >
                      {yearDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {yearDistribution.map((year, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{year.year}</span>
                      </div>
                      <span className="font-semibold text-foreground">{year.students}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">Projects</CardTitle>
                    <CardDescription>Status overview</CardDescription>
                  </div>
                  <Select value={projectStatusFilter} onValueChange={(value: any) => setProjectStatusFilter(value)}>
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={projectStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.percentage}%`}
                    >
                      {projectStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {projectStatus.map((status, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{status.status}</span>
                      </div>
                      <span className="font-semibold text-foreground">{status.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Internship Types */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Internships</CardTitle>
                <CardDescription>Type distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={internshipTypes}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.percentage}%`}
                    >
                      {internshipTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {internshipTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{type.type}</span>
                      </div>
                      <span className="font-semibold text-foreground">{type.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Submissions - Multi-Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Monthly Submission Trends</CardTitle>
                  <CardDescription>Compare projects, internships, and certifications</CardDescription>
                </div>
                <div className="flex gap-2">
                  <FilterButton
                    value="6months"
                    currentValue={submissionFilter}
                    onClick={() => setSubmissionFilter("6months")}
                    label="6 Months"
                  />
                  <FilterButton
                    value="year"
                    currentValue={submissionFilter}
                    onClick={() => setSubmissionFilter("year")}
                    label="Year"
                  />
                  <FilterButton
                    value="all"
                    currentValue={submissionFilter}
                    onClick={() => setSubmissionFilter("all")}
                    label="All Time"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingCharts ? (
                <Skeleton className="h-96 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlySubmissions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9300 0.0094 245.0000)" />
                    <XAxis
                      dataKey="month"
                      stroke="oklch(0.4386 0 0)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value + '-01');
                        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                      }}
                    />
                    <YAxis stroke="oklch(0.4386 0 0)" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="projects"
                      stroke={CHART_COLORS.chart1}
                      strokeWidth={3}
                      dot={{ fill: CHART_COLORS.chart1, r: 4 }}
                      name="Projects"
                    />
                    <Line
                      type="monotone"
                      dataKey="internships"
                      stroke={CHART_COLORS.chart2}
                      strokeWidth={3}
                      dot={{ fill: CHART_COLORS.chart2, r: 4 }}
                      name="Internships"
                    />
                    <Line
                      type="monotone"
                      dataKey="certifications"
                      stroke={CHART_COLORS.chart3}
                      strokeWidth={3}
                      dot={{ fill: CHART_COLORS.chart3, r: 4 }}
                      name="Certifications"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Points by Source - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Points Distribution by Source</CardTitle>
                  <CardDescription>Which activities generate the most points</CardDescription>
                </div>
                <div className="flex gap-2">
                  <FilterButton
                    value="week"
                    currentValue={pointsSourceFilter}
                    onClick={() => setPointsSourceFilter("week")}
                    label="Week"
                  />
                  <FilterButton
                    value="month"
                    currentValue={pointsSourceFilter}
                    onClick={() => setPointsSourceFilter("month")}
                    label="Month"
                  />
                  <FilterButton
                    value="year"
                    currentValue={pointsSourceFilter}
                    onClick={() => setPointsSourceFilter("year")}
                    label="Year"
                  />
                  <FilterButton
                    value="all"
                    currentValue={pointsSourceFilter}
                    onClick={() => setPointsSourceFilter("all")}
                    label="All"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={pointsBySource}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9300 0.0094 245.0000)" />
                  <XAxis
                    dataKey="source"
                    stroke="oklch(0.4386 0 0)"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke="oklch(0.4386 0 0)" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="points" fill={CHART_COLORS.chart4} name="Total Points" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Students Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    🏆 Top Students Leaderboard
                  </CardTitle>
                  <CardDescription>Highest performing students based on points</CardDescription>
                </div>
                <Select
                  value={topStudentsLimit.toString()}
                  onValueChange={(value) => setTopStudentsLimit(Number(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Top 5</SelectItem>
                    <SelectItem value="10">Top 10</SelectItem>
                    <SelectItem value="20">Top 20</SelectItem>
                    <SelectItem value="50">Top 50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingStudents ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead className="text-center">Points</TableHead>
                        <TableHead className="text-center">Projects</TableHead>
                        <TableHead className="text-center">Internships</TableHead>
                        <TableHead className="text-center">Certifications</TableHead>
                        <TableHead>Designation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topStudents.map((student) => (
                        <TableRow key={student.rank} className="hover:bg-muted/50">
                          <TableCell className="font-bold text-center">
                            {student.rank === 1 && <span className="text-2xl">🥇</span>}
                            {student.rank === 2 && <span className="text-2xl">🥈</span>}
                            {student.rank === 3 && <span className="text-2xl">🥉</span>}
                            {student.rank > 3 && <span className="text-lg">{student.rank}</span>}
                          </TableCell>
                          <TableCell className="font-semibold">{student.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {student.department}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{student.year}</TableCell>
                          <TableCell className="text-center">
                            <span className="font-black text-lg text-chart-4">{student.points}</span>
                          </TableCell>
                          <TableCell className="text-center">{student.projectsCompleted}</TableCell>
                          <TableCell className="text-center">{student.internshipsCompleted}</TableCell>
                          <TableCell className="text-center">{student.certificationsEarned}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${student.designation.includes("Gold")
                                ? "bg-yellow-500 text-black"
                                : student.designation.includes("Silver")
                                  ? "bg-gray-400 text-black"
                                  : "bg-orange-600 text-white"
                                }`}
                            >
                              {student.designation}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}