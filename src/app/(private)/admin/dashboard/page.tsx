"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, UserCheck, GraduationCap, Briefcase,
  Award, TrendingUp, Star, RefreshCw, Download,
  BarChart2, Zap, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Area, AreaChart, Sector,
} from "recharts";
import { useAdminDashboardStore } from "@/store/admin/dashboard";
import { useThemeStore } from "@/store/layoutStore";
import Header from "@/components/layout/header";

// Premium Components
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartContainer } from "@/components/dashboard/chart-container";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  blue:    "#3B6FD4",
  violet:  "#7C3AED",
  emerald: "#059669",
  amber:   "#D97706",
  rose:    "#E11D48",
  cyan:    "#0891B2",
};
const PIE_COLORS = [C.blue, C.violet, C.emerald, C.amber, C.rose, C.cyan];

const STAT_META = [
  { key:"totalStudents", label:"Total Students", icon:Users, desc:"Enrolled in system", color:"#FF6B35" },
  { key:"activeStudents", label:"Active Students", icon:UserCheck, desc:"Currently active", color:C.violet },
  { key:"totalMentors", label:"Total Mentors", icon:GraduationCap, desc:"Available mentors", color:C.cyan },
  { key:"totalProjects", label:"Projects", icon:Briefcase, desc:"Total projects", color:C.amber },
  { key:"totalInternships", label:"Internships", icon:Award, desc:"Total internships", color:C.rose },
  { key:"totalCertifications", label:"Certifications", icon:Star, desc:"Earned certificates", color:C.emerald },
  { key:"aboveAvgCount", label:"Above Average", icon:TrendingUp, desc:"Students above avg pts", color:"#6366F1" },
  { key:"avgPoints", label:"Avg Points", icon:Zap, desc:"System-wide average", color:"#EC4899" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmtDate = (v: any, mode = "day") => {
  try {
    const d = new Date(v);
    if (mode === "month") return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch { return v; }
};

const EmptyState = ({ label = "No data available" }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
      <BarChart2 size={20} className="text-muted-foreground" />
    </div>
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest leading-none">{label}</p>
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

const ActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, value, percent } = props;
  return (
    <g>
      <text x={cx} y={cy - 7} textAnchor="middle" className="fill-foreground font-bold text-[14px]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold uppercase tracking-wider">
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 10} outerRadius={outerRadius + 13} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

const DonutPanel = ({ data, dataKey, nameKey, loading }: any) => {
  const [activeIdx, setActiveIdx] = useState(0);
  if (loading) return <div className="h-40 w-full bg-foreground/5 animate-pulse rounded-xl" />;
  if (!data?.length) return <EmptyState />;

  return (
    <div className="flex flex-col gap-6">
      <div className="shrink-0 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data} dataKey={dataKey} nameKey={nameKey}
              cx="50%" cy="50%" innerRadius={42} outerRadius={70}
              activeIndex={activeIdx}
              activeShape={ActiveShape}
              onMouseEnter={(_, i) => setActiveIdx(i)}
              strokeWidth={0} paddingAngle={2}
            >
              {data.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2">
        {data.map((item: any, i: number) => (
          <div
            key={i}
            onMouseEnter={() => setActiveIdx(i)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-default ${activeIdx === i ? "bg-foreground/5" : ""}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">{item[nameKey]}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-foreground">{item[dataKey]?.toLocaleString()}</span>
              {item.percentage !== undefined && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground tracking-tighter">
                  {item.percentage}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return (
    <span className="text-[11px] font-bold text-muted-foreground bg-foreground/5 px-2.5 py-1 rounded-lg">
      {rank}
    </span>
  );
};

const DesignationBadge = ({ d }: { d: string }) => {
  const map: any = {
    Gold:   "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Silver: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    Bronze: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };
  const cls = map[d] || "bg-blue-500/10 text-blue-600 border-blue-500/20";
  return (
    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${cls}`}>
      {d}
    </span>
  );
};

export default function AdminDashboard() {
  const {
    stats, topStudents, activityData, pointsTrendData,
    departmentDistribution, yearDistribution, projectStatus,
    internshipTypes, monthlySubmissions, pointsBySource,
    activityFilter, pointsFilter, projectStatusFilter,
    submissionFilter, pointsSourceFilter, topStudentsLimit,
    isLoadingStats, isLoadingStudents, isLoadingCharts,
    fetchAllData, setActivityFilter, setPointsFilter,
    setProjectStatusFilter, setSubmissionFilter,
    setPointsSourceFilter, setTopStudentsLimit, refreshDashboard,
  } = useAdminDashboardStore();

  const { initializeTheme } = useThemeStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => { initializeTheme(); }, [initializeTheme]);
  useEffect(() => { fetchAllData(); }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDashboard();
    setIsRefreshing(false);
  };

  const isStatsLoading = isLoadingStats && !stats;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header
        subtitle="Overview of institutional activity and system-wide performance metrics."
        HeaderComp={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-9 px-4 rounded-xl border border-border/50 gap-2 font-bold uppercase tracking-wider text-[11px]">
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
        
        {/* STAT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_META.map((meta, i) => (
            <StatCard 
              key={meta.key} 
              label={meta.label}
              icon={meta.icon}
              color={meta.color}
              value={stats?.[meta.key as keyof typeof stats] as any}
              subLabel={meta.desc}
              index={i}
              loading={isStatsLoading}
            />
          ))}
        </div>

        {/* LEADERBOARD TABLE */}
        <DashboardCard className="p-0 border-border/40 overflow-hidden">
          <div className="p-6 border-b border-border/40 bg-foreground/[0.01] flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Trophy size={18} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Institutional Leaderboard</h3>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">Top performing students across all departments</p>
              </div>
            </div>
            <Select value={topStudentsLimit?.toString()} onValueChange={(v) => setTopStudentsLimit(Number(v))}>
              <SelectTrigger className="w-32 h-9 rounded-xl bg-foreground/5 border-border/50 text-[11px] font-bold tracking-wider uppercase">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {[5, 10, 20, 50].map(n => (
                  <SelectItem key={n} value={String(n)} className="text-[11px] font-bold uppercase">Top {n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-foreground/[0.01]">
                  {["Rank","Student","Department","Year","Points","Projects","Internships","Designation"].map(h => (
                    <th key={h} className={`px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40 ${["Points","Projects","Internships"].includes(h) ? "text-center":""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoadingStudents ? (
                  <tr><td colSpan={8} className="p-10 text-center animate-pulse text-xs font-bold uppercase tracking-widest text-muted-foreground">Loading Records...</td></tr>
                ) : !topStudents?.length ? (
                  <tr><td colSpan={8} className="p-20 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">No Records Found</td></tr>
                ) : (
                  topStudents.map((s: any, i: number) => (
                    <motion.tr 
                      key={s.rank || i} 
                      initial={{ opacity:0, x: -10 }} 
                      animate={{ opacity:1, x:0 }} 
                      className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4 text-center">
                        <RankBadge rank={s.rank} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center text-xs font-bold ring-2 ring-background shadow-sm border border-border/10" style={{ color: PIE_COLORS[i % 6] }}>
                            {s.name?.charAt(0) ?? "?"}
                          </div>
                          <span className="text-sm font-bold text-foreground">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase tracking-widest">
                          {s.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                        {s.year}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-extrabold text-foreground tracking-tight">
                          {s.points?.toLocaleString() ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-[11px] font-bold text-muted-foreground">
                        {s.projectsCompleted ?? 0}
                      </td>
                      <td className="px-6 py-4 text-center text-[11px] font-bold text-muted-foreground">
                        {s.internshipsCompleted ?? 0}
                      </td>
                      <td className="px-6 py-4">
                        <DesignationBadge d={s.designation} />
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        {/* ACTIVITY CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartContainer 
            title="Daily Activity" subtitle="Institutional activity volume" icon={Zap} loading={isLoadingCharts}
            actions={["week","month","year"].map(v => (
              <button 
                key={v} 
                onClick={() => setActivityFilter(v)}
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg transition-colors ${activityFilter === v ? "bg-foreground text-background" : "text-muted-foreground hover:bg-foreground/5"}`}
              >
                {v}
              </button>
            ))}
          >
            {!activityData?.length ? <EmptyState /> : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.blue} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} tickFormatter={v => fmtDate(v)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: C.blue, strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="hours" stroke={C.blue} strokeWidth={3} fill="url(#actGrad)" dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>

          <ChartContainer 
            title="Points Growth" subtitle="System-wide points tracking" icon={TrendingUp} loading={isLoadingCharts}
            actions={["week","month","year"].map(v => (
              <button 
                key={v} 
                onClick={() => setPointsFilter(v)}
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg transition-colors ${pointsFilter === v ? "bg-foreground text-background" : "text-muted-foreground hover:bg-foreground/5"}`}
              >
                {v}
              </button>
            ))}
          >
             {!pointsTrendData?.length ? <EmptyState /> : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={pointsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} tickFormatter={v => fmtDate(v)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="points" name="Total Points" stroke={C.emerald} strokeWidth={4} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </div>

        {/* DONUTS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ChartContainer title="Departments" subtitle="Distribution" loading={isLoadingCharts}>
            <DonutPanel data={departmentDistribution} dataKey="students" nameKey="department" loading={isLoadingCharts} />
          </ChartContainer>
          <ChartContainer title="Academic Years" subtitle="Breakdown" loading={isLoadingCharts}>
            <DonutPanel data={yearDistribution} dataKey="students" nameKey="year" loading={isLoadingCharts} />
          </ChartContainer>
          <ChartContainer 
            title="Project Status" subtitle="Overview" loading={isLoadingCharts}
            actions={
              <Select value={projectStatusFilter} onValueChange={v => setProjectStatusFilter(v)}>
                <SelectTrigger className="h-7 w-24 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {["week","month","year","all"].map(v => (
                    <SelectItem key={v} value={v} className="text-[10px] font-bold uppercase tracking-widest">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          >
            <DonutPanel data={projectStatus} dataKey="count" nameKey="status" loading={isLoadingCharts} />
          </ChartContainer>
          <ChartContainer title="Internships" subtitle="By Type" loading={isLoadingCharts}>
            <DonutPanel data={internshipTypes} dataKey="count" nameKey="type" loading={isLoadingCharts} />
          </ChartContainer>
        </div>

        {/* SUBMISSION TRENDS */}
        <ChartContainer 
          title="Submission Trends" subtitle="Long-term performance comparison" icon={Briefcase} loading={isLoadingCharts}
          actions={["6months","year","all"].map(v => (
            <button 
              key={v} 
              onClick={() => setSubmissionFilter(v)}
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg transition-colors ${submissionFilter === v ? "bg-foreground text-background" : "text-muted-foreground hover:bg-foreground/5"}`}
            >
              {v}
            </button>
          ))}
        >
          {!monthlySubmissions?.length ? <EmptyState /> : (
            <ResponsiveContainer width="100%" height={345}>
              <LineChart data={monthlySubmissions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} tickFormatter={v => fmtDate(v + "-01","month")} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "rgba(var(--foreground), 0.4)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 20, textTransform: "uppercase", letterSpacing: "0.05em" }} iconType="circle" iconSize={6} />
                <Line type="monotone" dataKey="projects" name="Projects" stroke={C.blue} strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="internships" name="Internships" stroke={C.violet} strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="certifications" name="Certifications" stroke={C.emerald} strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

      </main>
    </div>
  );
}