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

// Each stat card has its own gradient background (like the image)
const STAT_META = [
  {
    key:"totalStudents",       label:"Total Students",    icon:Users,
    desc:"Enrolled in system",
    grad:["#FF6B35","#FF4500"],   // orange
    stars:"#FF8C5A",
  },
  {
    key:"activeStudents",      label:"Active Students",   icon:UserCheck,
    desc:"Currently active",
    grad:["#7C3AED","#5B21B6"],   // violet
    stars:"#9D5FFF",
  },
  {
    key:"totalMentors",        label:"Total Mentors",     icon:GraduationCap,
    desc:"Available mentors",
    grad:["#0891B2","#0E7490"],   // cyan
    stars:"#22D3EE",
  },
  {
    key:"totalProjects",       label:"Projects",          icon:Briefcase,
    desc:"Total projects",
    grad:["#D97706","#B45309"],   // amber
    stars:"#FCD34D",
  },
  {
    key:"totalInternships",    label:"Internships",       icon:Award,
    desc:"Total internships",
    grad:["#E11D48","#BE123C"],   // rose
    stars:"#FB7185",
  },
  {
    key:"totalCertifications", label:"Certifications",    icon:Star,
    desc:"Earned certificates",
    grad:["#059669","#047857"],   // emerald
    stars:"#34D399",
  },
  {
    key:"aboveAvgCount",       label:"Above Average",     icon:TrendingUp,
    desc:"Students above avg pts",
    grad:["#6366F1","#4F46E5"],   // indigo
    stars:"#818CF8",
  },
  {
    key:"avgPoints",           label:"Avg Points",        icon:Zap,
    desc:"System-wide average",
    grad:["#EC4899","#DB2777"],   // pink
    stars:"#F9A8D4",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS — shimmer, dark mode tokens, responsive
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

  /* Light mode card surface */
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

  /* Star shapes on stat cards */
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
    .pie-grid  { grid-template-columns: repeat(2,1fr) !important; }
    .area-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    .stat-grid { grid-template-columns: 1fr !important; }
    .pie-grid  { grid-template-columns: 1fr !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON BOX
// ─────────────────────────────────────────────────────────────────────────────
const Sk = ({ w = "100%", h = 16, style = {} }) => (
  <div className="sk" style={{ width: w, height: h, ...style }} />
);

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
const EmptyState = ({ label = "No data available" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35 }}
    style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 12, height: 220,
    }}
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
      style={{
        width: 54, height: 54, borderRadius: "50%",
        background: "linear-gradient(135deg,#EEF2FF 0%,#ECFDF5 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
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

// ─────────────────────────────────────────────────────────────────────────────
// CHART TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--tooltip-bg)",
      border: "1px solid var(--tooltip-border)",
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      fontFamily: "inherit",
    }}>
      <p style={{
        fontSize: 11, fontWeight: 700, color: "var(--tooltip-label)",
        marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        {label}
      </p>
      {payload.map((e, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{e.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--tooltip-text)" }}>
            {typeof e.value === "number" ? e.value.toLocaleString() : e.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FILTER PILL
// ─────────────────────────────────────────────────────────────────────────────
const Pill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "4px 13px", borderRadius: 20, border: "none",
      cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
      transition: "all 0.18s ease",
      background: active ? C.blue : "var(--pill-inactive-bg)",
      color: active ? "#fff" : "var(--pill-inactive-text)",
      boxShadow: active ? `0 2px 10px ${C.blue}55` : "none",
    }}
  >
    {label}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// DECORATIVE STARS — SVG star polygon scattered on card
// ─────────────────────────────────────────────────────────────────────────────
const StarDeco = ({ color, size, style }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={color} style={{ position: "absolute", pointerEvents: "none", ...style }}
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD — gradient bg, floating icon, star decorations
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ meta, value, loading, index }: any) => {
  const Icon = meta.icon;
  const [g1, g2] = meta.grad;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
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
        }}
      >
        {/* Top Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
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

          {/* Icon */}
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

        {/* Value */}
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

        {/* Description */}
        <p
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {meta.desc}
        </p>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CHART CARD WRAPPER — dark mode aware
// ─────────────────────────────────────────────────────────────────────────────
const ChartCard = ({ title, desc, children, actions, loading, minH = 330 }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.42 }}
    style={{ height: "100%" }}
  >
    <div style={{
      background: "var(--card-bg)",
      borderRadius: 18,
      border: "1px solid var(--card-border)",
      boxShadow: "var(--card-shadow)",
      overflow: "hidden", height: "100%",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        padding: "18px 22px 0",
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", gap: 10, flexWrap: "wrap",
      }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{title}</p>
          {desc && <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{desc}</p>}
        </div>
        {actions && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>{actions}</div>
        )}
      </div>
      <div style={{ padding: "14px 18px 20px", flex: 1 }}>
        {loading
          ? <Sk h={minH - 10} style={{ width: "100%", borderRadius: 12 }} />
          : children
        }
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE PIE SHAPE
// ─────────────────────────────────────────────────────────────────────────────
const ActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, value, percent } = props;
  return (
    <g>
      <text x={cx} y={cy - 7} textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: 14, fontWeight: 700 }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle" fill="var(--text-muted)" style={{ fontSize: 11 }}>
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 7}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 11} outerRadius={outerRadius + 15}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PIE LABEL — renders % in white directly on each slice
// ─────────────────────────────────────────────────────────────────────────────
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null; // skip tiny slices
  const RAD = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.58;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  return (
    <text
      x={x} y={y}
      textAnchor="middle" dominantBaseline="central"
      fill="#fff"
      style={{ fontSize: 11, fontWeight: 700, pointerEvents: "none" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DONUT PANEL
// ─────────────────────────────────────────────────────────────────────────────
const DonutPanel = ({ data, dataKey, nameKey, loading }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  if (loading) return <Sk h={280} style={{ width: "100%", borderRadius: 12 }} />;
  if (!data?.length) return <EmptyState />;

  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data} dataKey={dataKey} nameKey={nameKey}
            cx="50%" cy="50%" innerRadius={42} outerRadius={98}
            activeIndex={activeIdx}
            activeShape={ActiveShape}
            onMouseEnter={(_, i) => setActiveIdx(i)}
            strokeWidth={0} paddingAngle={2}
            labelLine={false}
            label={renderPieLabel}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
        {data.map((item, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveIdx(i)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "5px 8px", borderRadius: 8,
              background: activeIdx === i ? `${PIE_COLORS[i % PIE_COLORS.length]}12` : "transparent",
              transition: "background 0.18s", cursor: "default",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: PIE_COLORS[i % PIE_COLORS.length],
              }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
                {item[nameKey]}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                {typeof item[dataKey] === "number" ? item[dataKey].toLocaleString() : item[dataKey]}
              </span>
              {item.percentage !== undefined && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
                  color: PIE_COLORS[i % PIE_COLORS.length],
                  background: `${PIE_COLORS[i % PIE_COLORS.length]}18`,
                }}>
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

// ─────────────────────────────────────────────────────────────────────────────
// RANK & DESIGNATION
// ─────────────────────────────────────────────────────────────────────────────
const RankBadge = ({ rank }) => {
  if (rank === 1) return <span style={{ fontSize: 18 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 18 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 18 }}>🥉</span>;
  return (
    <span style={{
      fontSize: 12, fontWeight: 700, color: "var(--text-secondary)",
      background: "var(--pill-inactive-bg)", borderRadius: 6, padding: "2px 7px",
    }}>{rank}</span>
  );
};

const DesignBadge = ({ d }) => {
  const map = {
    Gold:   { bg: "#FFFBEB", color: "#92400E", border: "#FCD34D" },
    Silver: { bg: "#F8FAFC", color: "#475569", border: "#CBD5E1" },
    Bronze: { bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74" },
  };
  const s = map[d] ?? map.Bronze;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: "nowrap",
    }}>{d}</span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DATE FORMATTER
// ─────────────────────────────────────────────────────────────────────────────
const fmtDate = (v, mode = "day") => {
  try {
    const d = new Date(v);
    if (mode === "month") return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch { return v; }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
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

  const statsLoading = isLoadingStats && !stats;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div style={{ width: "100%", minHeight: "100vh", background: "var(--body-bg)" }}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <Header
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

        {/* ── PAGE BODY ───────────────────────────────────────────── */}
        <div style={{ padding: "24px 24px 48px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── 1. STAT CARDS ─────────────────────────────────────── */}
          <div
            className="stat-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}
          >
            {STAT_META.map((meta, i) => (
              <StatCard
                key={meta.key} meta={meta} index={i}
                value={stats?.[meta.key]}
                loading={statsLoading}
              />
            ))}
          </div>

          {/* ── 2. LEADERBOARD ────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <div className="pb-4" style={{
              background: "var(--card-bg)", borderRadius: 18,
              border: "1px solid var(--card-border)",
              boxShadow: "var(--card-shadow)", overflow: "hidden",
            }}>
              {/* card header */}
              <div style={{
                padding: "18px 22px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid var(--card-border)", flexWrap: "wrap", gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg,#FFF7ED,#FFFBEB)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Trophy size={17} color="#D97706" />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>
                      Top Students Leaderboard
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Highest performing students by points
                    </p>
                  </div>
                </div>
                <Select
                  value={topStudentsLimit?.toString()}
                  onValueChange={(v) => setTopStudentsLimit(Number(v))}
                >
                  <SelectTrigger style={{ width: 100, height: 32, fontSize: 12 }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50].map(n => (
                      <SelectItem key={n} value={String(n)}>Top {n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* table */}
              {isLoadingStudents ? (
                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {[...Array(5)].map((_, i) => <Sk key={i} h={44} style={{ width: "100%", borderRadius: 10 }} />)}
                </div>
              ) : !topStudents?.length ? (
                <EmptyState label="No student records found" />
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
                        {["Rank","Student","Department","Year","Points","Projects","Internships","Certs","Designation"].map(h => (
                          <th key={h} style={{
                            padding: "11px 16px",
                            textAlign: ["Points","Projects","Internships","Certs"].includes(h) ? "center" : "left",
                            fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                            letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {topStudents.map((s, i) => (
                        <motion.tr
                          key={s.rank}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.035 }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--table-hover)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          style={{
                            borderBottom: i < topStudents.length - 1 ? "1px solid var(--table-border)" : "none",
                            transition: "background 0.14s",
                          }}
                        >
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <RankBadge rank={s.rank} />
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                              <div style={{
                                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                                background: `${PIE_COLORS[i % 6]}22`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 12, fontWeight: 700, color: PIE_COLORS[i % 6],
                              }}>
                                {s.name?.charAt(0) ?? "?"}
                              </div>
                              <span style={{ fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                                {s.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
                              background: `${C.blue}14`, color: C.blue,
                            }}>{s.department}</span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>
                            {s.year}
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <span style={{
                              fontSize: 16, fontWeight: 800,
                              background: `linear-gradient(135deg,${C.amber},${C.rose})`,
                              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            }}>
                              {s.points?.toLocaleString() ?? "—"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "center", color: "var(--text-secondary)", fontWeight: 600 }}>
                            {s.projectsCompleted ?? 0}
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "center", color: "var(--text-secondary)", fontWeight: 600 }}>
                            {s.internshipsCompleted ?? 0}
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "center", color: "var(--text-secondary)", fontWeight: 600 }}>
                            {s.certificationsEarned ?? 0}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <DesignBadge d={s.designation} />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── 3. ACTIVITY + POINTS TREND ────────────────────────── */}
          <div className="area-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <ChartCard
              title="Daily Activity Hours" desc="Student activity tracked over time"
              loading={isLoadingCharts} minH={310}
              actions={["week","month","year"].map(v => (
                <Pill key={v} label={v.charAt(0).toUpperCase()+v.slice(1)}
                  active={activityFilter===v} onClick={() => setActivityFilter(v)} />
              ))}
            >
              {!activityData?.length ? <EmptyState /> : (
                <ResponsiveContainer width="100%" height={285}>
                  <AreaChart data={activityData} margin={{ top: 4, right: 6, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.blue} stopOpacity={0.22} />
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false} tickLine={false} tickFormatter={v => fmtDate(v)} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="hours" name="Hours Spent"
                      stroke={C.blue} strokeWidth={2.5} fill="url(#actGrad)"
                      dot={false} activeDot={{ r: 5, fill: C.blue, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard
              title="Points Trend" desc="Points awarded over time"
              loading={isLoadingCharts} minH={310}
              actions={["week","month","year"].map(v => (
                <Pill key={v} label={v.charAt(0).toUpperCase()+v.slice(1)}
                  active={pointsFilter===v} onClick={() => setPointsFilter(v)} />
              ))}
            >
              {!pointsTrendData?.length ? <EmptyState /> : (
                <ResponsiveContainer width="100%" height={285}>
                  <LineChart data={pointsTrendData} margin={{ top: 4, right: 6, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ptGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   stopColor={C.emerald} />
                        <stop offset="100%" stopColor={C.cyan} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      axisLine={false} tickLine={false} tickFormatter={v => fmtDate(v)} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line type="monotone" dataKey="points" name="Total Points"
                      stroke="url(#ptGrad)" strokeWidth={3}
                      dot={false} activeDot={{ r: 5, fill: C.emerald, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* ── 4. POINTS BY SOURCE ───────────────────────────────── */}
          <ChartCard
            title="Points Distribution by Source"
            desc="Which activities generate the most points"
            loading={isLoadingCharts} minH={340}
            actions={[["week","Week"],["month","Month"],["year","Year"],["all","All Time"]].map(([v,l]) => (
              <Pill key={v} label={l} active={pointsSourceFilter===v} onClick={() => setPointsSourceFilter(v)} />
            ))}
          >
            {!pointsBySource?.length ? <EmptyState /> : (
              <ResponsiveContainer width="100%" height={315}>
                <BarChart data={pointsBySource} margin={{ top: 4, right: 8, left: -16, bottom: 34 }}>
                  <defs>
                    {PIE_COLORS.map((col, i) => (
                      <linearGradient key={i} id={`bgrad${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={col} stopOpacity={1} />
                        <stop offset="100%" stopColor={col} stopOpacity={0.55} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" vertical={false} />
                  <XAxis dataKey="source"
                    tick={{ fontSize: 12, fill: "var(--text-secondary)", fontWeight: 500 }}
                    axisLine={false} tickLine={false}
                    angle={-30} textAnchor="end" height={58} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(59,111,212,0.05)" }} />
                  <Bar dataKey="points" name="Total Points" radius={[8,8,0,0]} maxBarSize={64}>
                    {(pointsBySource ?? []).map((_, i) => (
                      <Cell key={i} fill={`url(#bgrad${i % PIE_COLORS.length})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* ── 5. FOUR DONUT CHARTS ──────────────────────────────── */}
          <div className="pie-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            <ChartCard title="Departments" desc="Student distribution" minH={0} loading={isLoadingCharts}>
              <DonutPanel data={departmentDistribution} dataKey="students" nameKey="department" loading={isLoadingCharts} />
            </ChartCard>

            <ChartCard title="Academic Years" desc="Year-wise breakdown" minH={0} loading={isLoadingCharts}>
              <DonutPanel data={yearDistribution} dataKey="students" nameKey="year" loading={isLoadingCharts} />
            </ChartCard>

            <ChartCard
              title="Project Status" desc="Status overview" minH={0} loading={isLoadingCharts}
              actions={
                <Select value={projectStatusFilter} onValueChange={v => setProjectStatusFilter(v)}>
                  <SelectTrigger style={{ width: 84, height: 26, fontSize: 11 }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["week","month","year","all"].map(v => (
                      <SelectItem key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
            >
              <DonutPanel data={projectStatus} dataKey="count" nameKey="status" loading={isLoadingCharts} />
            </ChartCard>

            <ChartCard title="Internship Types" desc="Type distribution" minH={0} loading={isLoadingCharts}>
              <DonutPanel data={internshipTypes} dataKey="count" nameKey="type" loading={isLoadingCharts} />
            </ChartCard>
          </div>

          {/* ── 6. MONTHLY SUBMISSION TRENDS ─────────────────────── */}
          <ChartCard
            title="Monthly Submission Trends"
            desc="Compare projects, internships, and certifications over time"
            loading={isLoadingCharts} minH={370}
            actions={[["6months","6 Months"],["year","Year"],["all","All Time"]].map(([v,l]) => (
              <Pill key={v} label={l} active={submissionFilter===v} onClick={() => setSubmissionFilter(v)} />
            ))}
          >
            {!monthlySubmissions?.length ? <EmptyState /> : (
              <ResponsiveContainer width="100%" height={345}>
                <LineChart data={monthlySubmissions} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                  <defs>
                    {[[C.blue,"lg1"],[C.violet,"lg2"],[C.emerald,"lg3"]].map(([c,id]) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   stopColor={c} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={c} stopOpacity={0.65} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => fmtDate(v + "-01","month")} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 10, color: "var(--text-secondary)" }}
                    iconType="circle" iconSize={8}
                  />
                  <Line type="monotone" dataKey="projects" name="Projects"
                    stroke="url(#lg1)" strokeWidth={2.5} dot={false}
                    activeDot={{ r: 5, fill: C.blue, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="internships" name="Internships"
                    stroke="url(#lg2)" strokeWidth={2.5} dot={false}
                    activeDot={{ r: 5, fill: C.violet, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="certifications" name="Certifications"
                    stroke="url(#lg3)" strokeWidth={2.5} dot={false}
                    activeDot={{ r: 5, fill: C.emerald, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

        </div>
      </div>
    </>
  );
}