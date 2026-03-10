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

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  blue: "#3B6FD4",
  violet: "#7C3AED",
  emerald: "#059669",
  amber: "#D97706",
  rose: "#E11D48",
  cyan: "#0891B2",
};
const PIE_COLORS = [C.blue, C.violet, C.emerald, C.amber, C.rose, C.cyan];

// Mentor stat cards (8 tiles like admin dashboard)
const STAT_META = [
  {
    key: "totalAssignedStudents",
    label: "Assigned Students",
    icon: Users,
    desc: "Under your mentorship",
    grad: ["#3B6FD4", "#2563EB"],
    stars: "#6EA8FF",
  },
  {
    key: "activeStudents",
    label: "Active Students",
    icon: UserCheck,
    desc: "Currently active",
    grad: ["#10B981", "#059669"],
    stars: "#34D399",
  },
  {
    key: "pendingApprovals",
    label: "Pending Reviews",
    icon: ClipboardList,
    desc: "Awaiting approval",
    grad: ["#F59E0B", "#D97706"],
    stars: "#FBBF24",
  },
  {
    key: "completedProjects",
    label: "Completed Projects",
    icon: FolderCheck,
    desc: "Successfully submitted",
    grad: ["#8B5CF6", "#7C3AED"],
    stars: "#C4B5FD",
  },
  {
    key: "totalProjects",
    label: "Projects",
    icon: Layers,
    desc: "Total assigned",
    grad: ["#6366F1", "#4F46E5"],
    stars: "#A5B4FC",
  },
  {
    key: "totalTasks",
    label: "Tasks",
    icon: ClipboardList,
    desc: "Total tasks",
    grad: ["#EC4899", "#DB2777"],
    stars: "#F9A8D4",
  },
  {
    key: "totalInternships",
    label: "Internships",
    icon: Briefcase,
    desc: "Total internships",
    grad: ["#0891B2", "#0E7490"],
    stars: "#22D3EE",
  },
  {
    key: "totalCertifications",
    label: "Certifications",
    icon: Award,
    desc: "Total certifications",
    grad: ["#059669", "#047857"],
    stars: "#34D399",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes float-star {
    0%,100% { transform: translateY(0px) rotate(0deg); opacity: 0.18; }
    50%      { transform: translateY(-6px) rotate(15deg); opacity: 0.32; }
  }

  :root {
    --card-bg:       #ffffff;
    --card-border:   #E8EDF4;
    --card-shadow:   0 2px 12px rgba(0,0,0,0.06);
    --body-bg:       #F7F9FC;
    --text-primary:  #1E293B;
    --text-secondary:#64748B;
    --text-muted:    #94A3B8;
    --grid-line:     #F1F5F9;
    --pill-inactive-bg:   #F1F5F9;
    --pill-inactive-text: #64748B;
    --sk-from: #EEF2F7;
    --sk-via:  #E2E8F0;
    --tooltip-bg: rgba(255,255,255,0.97);
    --tooltip-border: #E2E8F0;
    --tooltip-text:   #1E293B;
    --tooltip-label:  #64748B;
    --table-hover:    #F8FAFC;
    --table-border:   #F1F5F9;
  }
  .dark {
    --card-bg:       #1E2432;
    --card-border:   #2A3349;
    --card-shadow:   0 2px 12px rgba(0,0,0,0.30);
    --body-bg:       #141921;
    --text-primary:  #E8EDF8;
    --text-secondary:#94A3B8;
    --text-muted:    #64748B;
    --grid-line:     #1E2432;
    --pill-inactive-bg:   #1E2432;
    --pill-inactive-text: #94A3B8;
    --sk-from: #1E2432;
    --sk-via:  #252E42;
    --tooltip-bg: rgba(20,25,33,0.97);
    --tooltip-border: #2A3349;
    --tooltip-text:   #E8EDF8;
    --tooltip-label:  #64748B;
    --table-hover:    #1A2030;
    --table-border:   #1E2432;
  }

  .sk {
    background: linear-gradient(90deg, var(--sk-from) 25%, var(--sk-via) 50%, var(--sk-from) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 10px;
  }

  .star-shape {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    animation: float-star 3s ease-in-out infinite;
  }

  @media (max-width: 1024px) {
    .stat-grid { grid-template-columns: repeat(4,1fr) !important; }
  }
  @media (max-width: 768px) {
    .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
    .area-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    .stat-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const Sk = ({ w = "100%", h = 16, style = {} }) => (
  <div className="sk" style={{ width: w, height: h, ...style }} />
);

const fmtDate = (v: string, mode: "day" | "month" = "day") => {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  if (mode === "month") {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const EmptyState = ({ label = "No data available" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35 }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      height: 220,
    }}
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
      style={{
        width: 54,
        height: 54,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#EEF2FF 0%,#ECFDF5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 18px rgba(59,111,212,0.10)",
      }}
    >
      <BarChart2 size={22} color="#94A3B8" />
    </motion.div>
    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.03em" }}>
      {label}
    </p>
  </motion.div>
);

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--tooltip-bg)",
        border: "1px solid var(--tooltip-border)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        fontFamily: "inherit",
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--tooltip-label)",
          marginBottom: 6,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      {payload.map((e: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: e.color,
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{e.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--tooltip-text)" }}>
            {typeof e.value === "number" ? e.value.toLocaleString() : e.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const StarDeco = ({ color, size, style }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const StatCard = ({ meta, value, loading, index }: any) => {
  const Icon = meta.icon;
  const [g1, g2] = meta.grad;

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
        <div
          style={{
            borderRadius: 18,
            padding: "20px 22px",
            height: 130,
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
              <Sk w="55%" h={11} />
              <Sk w="38%" h={28} />
              <Sk w="70%" h={10} />
            </div>
            <Sk w={46} h={46} style={{ borderRadius: 12, flexShrink: 0 }} />
          </div>
        </div>
      </motion.div>
    );
  }

  const isNull = value === null || value === undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.38 }}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
    >
      <div
        style={{
          borderRadius: 18,
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          padding: "20px 20px 18px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "var(--card-shadow)",
          minHeight: 130,
          cursor: "default",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {meta.label}
          </p>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${g1}22, ${g2}22)`,
              border: `1px solid ${g1}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={19} color={g1} strokeWidth={2.2} />
          </div>
        </div>

        <h3
          className="font-poppins"
          style={{
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1,
            color: isNull ? "var(--text-muted)" : "var(--text-primary)",
            margin: "10px 0 4px",
          }}
        >
          {isNull ? "—" : Number(value).toLocaleString()}
        </h3>

        <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{meta.desc}</p>
      </div>
    </motion.div>
  );
};

const ChartCard = ({ title, desc, children, actions, loading, minH = 330 }: any) => (
  <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} style={{ height: "100%" }}>
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: 18,
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "18px 22px 0",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{title}</p>
          {desc && <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{desc}</p>}
        </div>
        {actions && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>{actions}</div>}
      </div>
      <div style={{ padding: "14px 18px 20px", flex: 1 }}>
        {loading ? <Sk h={minH - 10} style={{ width: "100%", borderRadius: 12 }} /> : children}
      </div>
    </div>
  </motion.div>
);

const RankBadge = ({ rank }: { rank: number }) => {
  const color = rank === 1 ? C.amber : rank === 2 ? C.violet : rank === 3 ? C.cyan : C.blue;
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: `${color}22`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
      }}
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
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ background: "var(--body-bg)", minHeight: "100vh" }}>
        <Header
          title="Mentor Dashboard"
          subtitle="Mentorship insights, approvals, and performance trends"
          HeaderComp={
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                onClick={onRefresh}
                disabled={isRefreshing}
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
              >
                <RefreshCw size={14} style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }} />
                Refresh
              </Button>
              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                <Download size={14} />
                Export
              </Button>
            </div>
          }
        />

        <div style={{ padding: "24px 24px 48px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {STAT_META.map((meta, i) => {
              const statValue = stats ? (stats as any)[meta.key] : null;
              return <StatCard key={meta.key} meta={meta} index={i} value={statValue} loading={isLoadingAny} />;
            })}
          </div>

          <div className="area-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <ChartCard title="Approval Activity" desc="Last 30 days approval trends" loading={isLoadingAny} minH={310}>
              {!activityData?.length ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={285}>
                  <BarChart data={activityData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtDate(v)} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} iconType="circle" iconSize={8} />
                    <Bar dataKey="approved" name="Approved" radius={[8, 8, 0, 0]} maxBarSize={48}>
                      {(activityData ?? []).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                    <Bar dataKey="rejected" name="Rejected" radius={[8, 8, 0, 0]} maxBarSize={48} fill={C.rose} />
                    <Bar dataKey="feedback" name="Feedback" radius={[8, 8, 0, 0]} maxBarSize={48} fill={C.amber} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="Points Awarded" desc="Monthly points distribution" loading={isLoadingAny} minH={310}>
              {!pointsTrendData?.length ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={285}>
                  <LineChart data={pointsTrendData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ptsGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={C.blue} />
                        <stop offset="100%" stopColor={C.violet} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtDate(v)} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} iconType="circle" iconSize={8} />
                    <Line type="monotone" dataKey="points" name="Points" stroke="url(#ptsGrad)" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: C.blue, strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="awards" name="Awards" stroke={C.emerald} strokeWidth={2} dot={false} activeDot={{ r: 5, fill: C.emerald, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          <ChartCard title="Work Progress (Monthly)" desc="Submissions by type over the last 6 months" loading={isLoadingAny} minH={370}>
            {!workProgressData?.length ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={345}>
                <AreaChart data={workProgressData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mpProject" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.blue} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="mpTask" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.violet} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={C.violet} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="mpInternship" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.emerald} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={C.emerald} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="mpCert" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.amber} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={C.amber} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtDate(`${v}-01`, "month")} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} iconType="circle" iconSize={8} />
                  <Area type="monotone" dataKey="project" stackId="1" stroke={C.blue} fill="url(#mpProject)" name="Projects" />
                  <Area type="monotone" dataKey="task" stackId="1" stroke={C.violet} fill="url(#mpTask)" name="Tasks" />
                  <Area type="monotone" dataKey="internship" stackId="1" stroke={C.emerald} fill="url(#mpInternship)" name="Internships" />
                  <Area type="monotone" dataKey="certification" stackId="1" stroke={C.amber} fill="url(#mpCert)" name="Certifications" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <div
              style={{
                background: "var(--card-bg)",
                borderRadius: 18,
                border: "1px solid var(--card-border)",
                boxShadow: "var(--card-shadow)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--card-border)",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      flexShrink: 0,
                      background: "linear-gradient(135deg,#FFF7ED,#FFFBEB)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trophy size={17} color="#D97706" />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>Top Performing Students</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Your highest scoring mentees</p>
                  </div>
                </div>
              </div>

              {!topStudents?.length ? (
                <EmptyState label="No student records found" />
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
                        {["Rank", "Student", "Department", "Year", "Points"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "11px 16px",
                              textAlign: h === "Points" ? "center" : "left",
                              fontSize: 11,
                              fontWeight: 700,
                              color: "var(--text-muted)",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {topStudents.map((s, i) => (
                        <motion.tr
                          key={s.studentId ?? i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.035 }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--table-hover)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          style={{
                            borderBottom: i < topStudents.length - 1 ? "1px solid var(--table-border)" : "none",
                            transition: "background 0.14s",
                          }}
                        >
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <RankBadge rank={i + 1} />
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                              <div
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  background: `${PIE_COLORS[i % 6]}22`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: PIE_COLORS[i % 6],
                                }}
                              >
                                {s.name?.charAt(0) ?? "?"}
                              </div>
                              <span style={{ fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{s.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: `${C.blue}14`, color: C.blue }}>
                              {s.department}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>{s.year}</td>
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <span
                              style={{
                                fontSize: 16,
                                fontWeight: 800,
                                background: `linear-gradient(135deg,${C.amber},${C.rose})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              {s.points?.toLocaleString() ?? "—"}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
