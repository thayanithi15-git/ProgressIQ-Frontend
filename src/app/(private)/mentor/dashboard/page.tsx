"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  ClipboardList,
  FolderCheck,
  Briefcase,
  Award,
  Layers,
  RefreshCw,
  Download,
  BarChart2,
  Trophy,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import { useMentorDashboardStore } from "@/store/mentor/dashboard";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartContainer } from "@/components/dashboard/chart-container";

const C = {
  blue: "#3B6FD4",
  charcoal: "#1E293B",
  slate: "#64748B",
  accent: "#6366F1",
  emerald: "#059669",
  amber: "#D97706",
  rose: "#E11D48",
};

const PIE_COLORS = [C.blue, C.accent, "#4F46E5", "#4338CA", "#3730A3", "#312E81"];

const STAT_META = [
  {
    key: "totalAssignedStudents",
    label: "Assigned Students",
    icon: Users,
    desc: "Under your mentorship",
    color: C.blue,
  },
  {
    key: "activeStudents",
    label: "Active Students",
    icon: UserCheck,
    desc: "Currently active",
    color: C.blue,
  },
  {
    key: "pendingApprovals",
    label: "Pending Reviews",
    icon: ClipboardList,
    desc: "Awaiting approval",
    color: C.amber,
  },
  {
    key: "completedProjects",
    label: "Completed Projects",
    icon: FolderCheck,
    desc: "Successfully submitted",
    color: C.emerald,
  },
  {
    key: "totalProjects",
    label: "Projects",
    icon: Layers,
    desc: "Total assigned",
    color: C.blue,
  },
  {
    key: "totalTasks",
    label: "Tasks",
    icon: ClipboardList,
    desc: "Total tasks",
    color: C.blue,
  },
  {
    key: "totalInternships",
    label: "Internships",
    icon: Briefcase,
    desc: "Total internships",
    color: C.blue,
  },
  {
    key: "totalCertifications",
    label: "Certifications",
    icon: Award,
    desc: "Total certifications",
    color: C.blue,
  },
];

const fmtDate = (v: string, mode: "day" | "month" = "day") => {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  if (mode === "month") {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const EmptyState = ({ label = "No data available" }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
      <BarChart2 size={20} className="text-muted-foreground" />
    </div>
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
  </div>
);

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-xl">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
      {payload.map((e: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
          <span className="text-xs text-muted-foreground">{e.name}:</span>
          <span className="text-xs font-bold text-foreground">
            {typeof e.value === "number" ? e.value.toLocaleString() : e.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const RankBadge = ({ rank }: { rank: number }) => {
  const colors = [C.blue, C.accent, C.slate, C.slate];
  const color = colors[Math.min(rank - 1, 3)];
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
      style={{ background: `${color}15`, color }}
    >
      {rank}
    </div>
  );
};

export default function MentorDashboard() {
  const {
    stats,
    topStudents,
    activityData,
    pointsTrendData,
    workProgressData,
    isLoadingStats,
    isLoadingCharts,
    isLoading,
    fetchAllData,
    refreshDashboard,
  } = useMentorDashboardStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refreshDashboard();
    setIsRefreshing(false);
  };

  const isLoadingAny = isLoadingStats || isLoadingCharts || isLoading;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header
        title="Mentor Dashboard"
        subtitle="Mentorship insights, approvals, and performance trends"
        HeaderComp={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isRefreshing} className="h-9 px-4 rounded-xl border border-border/50 gap-2 font-bold uppercase tracking-wider text-[11px]">
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button size="sm" className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-bold uppercase tracking-wider text-[11px]">
              <Download size={14} />
              Export
            </Button>
          </div>
        }
      />

      <main className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_META.map((meta, i) => {
            const statValue = stats ? (stats as any)[meta.key] : null;
            return (
              <StatCard
                key={meta.key}
                label={meta.label}
                icon={meta.icon}
                color={meta.color}
                value={statValue}
                subLabel={meta.desc}
                index={i}
                loading={isLoadingAny}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          <ChartContainer title="Approval Activity" subtitle="Last 30 days approval trends" icon={ClipboardList} loading={isLoadingAny}>
            {!activityData?.length ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} tickFormatter={(v) => fmtDate(v)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(var(--foreground), 0.03)" }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 20, textTransform: "uppercase", letterSpacing: "0.05em" }} iconType="circle" iconSize={6} />
                  <Bar dataKey="approved" name="Approved" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {(activityData ?? []).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                  <Bar dataKey="rejected" name="Rejected" radius={[4, 4, 0, 0]} maxBarSize={32} fill={C.rose} />
                  <Bar dataKey="feedback" name="Feedback" radius={[4, 4, 0, 0]} maxBarSize={32} fill={C.amber} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>

          <ChartContainer title="Points Awarded" subtitle="Monthly points distribution" icon={Award} loading={isLoadingAny}>
            {!pointsTrendData?.length ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={pointsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ptsGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={C.blue} />
                      <stop offset="100%" stopColor={C.violet} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} tickFormatter={(v) => fmtDate(v)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 20, textTransform: "uppercase", letterSpacing: "0.05em" }} iconType="circle" iconSize={6} />
                  <Line type="monotone" dataKey="points" name="Points" stroke="url(#ptsGrad)" strokeWidth={4} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="awards" name="Awards" stroke={C.emerald} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </div>

        <ChartContainer title="Work Progress" subtitle="Submissions by type (6 Months)" icon={Briefcase} loading={isLoadingAny}>
          {!workProgressData?.length ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={workProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {["mpProject", "mpTask", "mpInternship", "mpCert"].map((id, i) => {
                    const colors = [C.blue, C.violet, C.emerald, C.amber];
                    return (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors[i]} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={colors[i]} stopOpacity={0} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} tickFormatter={(v) => fmtDate(`${v}-01`, "month")} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 20, textTransform: "uppercase", letterSpacing: "0.05em" }} iconType="circle" iconSize={6} />
                <Area type="monotone" dataKey="project" stackId="1" stroke={C.blue} fill="url(#mpProject)" name="Projects" strokeWidth={2} />
                <Area type="monotone" dataKey="task" stackId="1" stroke={C.violet} fill="url(#mpTask)" name="Tasks" strokeWidth={2} />
                <Area type="monotone" dataKey="internship" stackId="1" stroke={C.emerald} fill="url(#mpInternship)" name="Internships" strokeWidth={2} />
                <Area type="monotone" dataKey="certification" stackId="1" stroke={C.amber} fill="url(#mpCert)" name="Certifications" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        <DashboardCard className="p-0 border-border/40">
          <div className="p-6 border-b border-border/40 bg-foreground/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Trophy size={18} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Top Performing Students</h3>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">Mentees with highest activity and points</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-foreground/[0.01]">
                  {["Rank", "Student", "Department", "Year", "Points"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!topStudents?.length ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      No Records Located
                    </td>
                  </tr>
                ) : (
                  topStudents.map((s, i) => (
                    <motion.tr
                      key={s.studentId ?? i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <RankBadge rank={i + 1} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-background shadow-sm"
                            style={{ background: `${PIE_COLORS[i % 6]}15`, color: PIE_COLORS[i % 6] }}
                          >
                            {s.name?.charAt(0) ?? "?"}
                          </div>
                          <span className="text-sm font-bold text-foreground truncate max-w-[200px]">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 uppercase tracking-wider">
                          {s.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                        {s.year}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-extrabold text-foreground tracking-tight">
                          {s.points?.toLocaleString() ?? "—"}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </main>
    </div>
  );
}
