"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, CheckSquare, Award, Briefcase, Zap, Clock,
  TrendingUp, Star, RefreshCw, Download, Activity,
  GraduationCap, MapPin, Mail, Phone, Calendar,
  Trophy, Target, AlertCircle, ChevronDown, BarChart2,
  Flame, User, Github, Linkedin, Link2, Terminal, Code, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { useStudentDashboardStore } from "@/store/student/dashboard";
import { useProfileStore } from "@/store/student/profile";
import { useThemeStore } from "@/store/layoutStore";
import Header from "@/components/layout/header";

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
  indigo: "#6366F1",
  pink: "#EC4899",
  teal: "#0D9488",
  orange: "#EA580C",
};

const PIE_COLORS = [C.blue, C.violet, C.emerald, C.amber, C.rose, C.cyan];

// Heatmap intensity → color
const HEAT_COLORS = ["#E8F0FE", "#A8C4F8", "#5C96F5", "#2563EB", "#1D4ED8"];
const HEAT_COLORS_DARK = ["#1A2540", "#1E3A6E", "#2563EB", "#1D4ED8", "#1E40AF"];

const STAT_META = [
  {
    key: "totalPoints", label: "Total Points", icon: Zap,
    grad: ["#F59E0B", "#D97706"], stars: "#FCD34D",
    sub: (s: any) => `Rank #${s?.ranking?.overallRank ?? "—"} overall`,
  },
  {
    key: "totalHoursSpent", label: "Hours Logged", icon: Clock,
    grad: ["#3B6FD4", "#1D4ED8"], stars: "#93C5FD",
    sub: () => "Total activity hours",
  },
  {
    key: "projects", label: "Projects", icon: Briefcase,
    grad: ["#7C3AED", "#5B21B6"], stars: "#C4B5FD",
    sub: (s: any) => `${s?.projects?.completed ?? 0} completed`,
    val: (s: any) => s?.projects?.total,
  },
  {
    key: "tasks", label: "Tasks", icon: CheckSquare,
    grad: ["#059669", "#047857"], stars: "#6EE7B7",
    sub: (s: any) => `${s?.tasks?.overdue ?? 0} overdue`,
    val: (s: any) => s?.tasks?.total,
  },
  {
    key: "certifications", label: "Certifications", icon: Award,
    grad: ["#EC4899", "#DB2777"], stars: "#F9A8D4",
    sub: (s: any) => `${s?.certifications?.completed ?? 0} earned`,
    val: (s: any) => s?.certifications?.total,
  },
  {
    key: "internships", label: "Internships", icon: GraduationCap,
    grad: ["#0891B2", "#0E7490"], stars: "#67E8F9",
    sub: (s: any) => `${s?.internships?.completed ?? 0} completed`,
    val: (s: any) => s?.internships?.total,
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
    0%,100% { transform: translateY(0px) rotate(0deg); opacity: 0.20; }
    50%      { transform: translateY(-5px) rotate(12deg); opacity: 0.35; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  :root {
    --card-bg:        #ffffff;
    --card-border:    #E8EDF4;
    --card-shadow:    0 2px 12px rgba(0,0,0,0.06);
    --body-bg:        #F7F9FC;
    --text-primary:   #1E293B;
    --text-secondary: #64748B;
    --text-muted:     #94A3B8;
    --grid-line:      #F1F5F9;
    --pill-inactive-bg:   #F1F5F9;
    --pill-inactive-text: #64748B;
    --sk-from: #EEF2F7;
    --sk-via:  #E2E8F0;
    --tooltip-bg:     rgba(255,255,255,0.97);
    --tooltip-border: #E2E8F0;
    --tooltip-text:   #1E293B;
    --tooltip-label:  #64748B;
    --table-hover:    #F8FAFC;
    --table-border:   #F1F5F9;
    --heat-empty:     #EEF2FF;
    --heat-1:         #A8C4F8;
    --heat-2:         #5C96F5;
    --heat-3:         #2563EB;
    --heat-4:         #1D4ED8;
    --profile-card:   linear-gradient(135deg,#1E293B 0%,#0F172A 100%);
  }
  .dark {
    --card-bg:        #1E2432;
    --card-border:    #2A3349;
    --card-shadow:    0 2px 12px rgba(0,0,0,0.30);
    --body-bg:        #141921;
    --text-primary:   #E8EDF8;
    --text-secondary: #94A3B8;
    --text-muted:     #64748B;
    --grid-line:      #1E2432;
    --pill-inactive-bg:   #1E2432;
    --pill-inactive-text: #94A3B8;
    --sk-from: #1E2432;
    --sk-via:  #252E42;
    --tooltip-bg:     rgba(20,25,33,0.97);
    --tooltip-border: #2A3349;
    --tooltip-text:   #E8EDF8;
    --tooltip-label:  #64748B;
    --table-hover:    #1A2030;
    --table-border:   #1E2432;
    --heat-empty:     #1A2540;
    --heat-1:         #1E3A6E;
    --heat-2:         #1D4ED8;
    --heat-3:         #2563EB;
    --heat-4:         #3B82F6;
    --profile-card:   linear-gradient(135deg,#1E2432 0%,#141921 100%);
  }

  .sk {
    background: linear-gradient(90deg, var(--sk-from) 25%, var(--sk-via) 50%, var(--sk-from) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 10px;
  }

  .heat-cell {
    border-radius: 3px;
    cursor: pointer;
    transition: transform 0.1s, opacity 0.1s;
  }
  .heat-cell:hover { transform: scale(1.35); opacity: 0.85; }

  .student-shell { disgap: 22px; align-items: start; }
  .student-main { display: flex; flex-direction: column; gap: 24px; min-width: 0; }

  @media (max-width: 1280px) {
    .stat-grid-student { grid-template-columns: repeat(3,1fr) !important; }
  }
  @media (max-width: 900px) {
    .stat-grid-student { grid-template-columns: repeat(2,1fr) !important; }
    .two-col-grid { grid-template-columns: 1fr !important; }
    .three-col-grid { grid-template-columns: 1fr !important; }
    .profile-grid { grid-template-columns: 1fr !important; }
    .student-shell { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 580px) {
    .stat-grid-student { grid-template-columns: 1fr !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const Sk = ({ w = "100%", h = 16, style = {} }: any) => (
  <div className="sk" style={{ width: w, height: h, ...style }} />
);

const fmtDate = (v: string, mode = "day") => {
  try {
    const d = new Date(v);
    if (mode === "month") return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch { return v; }
};

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
const EmptyState = ({ label = "No data available" }: { label?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, height: 200 }}
  >
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
      style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg,#EEF2FF,#ECFDF5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <BarChart2 size={20} color="#94A3B8" />
    </motion.div>
    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{label}</p>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CHART TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", fontFamily: "inherit" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--tooltip-label)", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
      {payload.map((e: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, display: "inline-block" }} />
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{e.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--tooltip-text)" }}>{typeof e.value === "number" ? e.value.toLocaleString() : e.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PILL FILTER
// ─────────────────────────────────────────────────────────────────────────────
const Pill = ({ label, active, onClick }: any) => (
  <button onClick={onClick} style={{
    padding: "4px 13px", borderRadius: 20, border: "none", cursor: "pointer",
    fontSize: 12, fontWeight: 600, letterSpacing: "0.02em", transition: "all 0.18s ease",
    background: active ? C.blue : "var(--pill-inactive-bg)",
    color: active ? "#fff" : "var(--pill-inactive-text)",
    boxShadow: active ? `0 2px 10px ${C.blue}55` : "none",
  }}>{label}</button>
);

// ─────────────────────────────────────────────────────────────────────────────
// STAR DECO
// ─────────────────────────────────────────────────────────────────────────────
const StarDeco = ({ color, size, style }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD (gradient)
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ meta, stats, loading, index }: any) => {
  const Icon = meta.icon;
  const [g1, g2] = meta.grad;
  const value = meta.val ? meta.val(stats) : stats?.[meta.key];
  const subLabel = meta.sub ? meta.sub(stats) : meta.sub;

  if (loading) return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <div style={{ borderRadius: 18, padding: "20px 22px", height: 130, background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
            <Sk w="55%" h={11} /><Sk w="38%" h={28} /><Sk w="70%" h={10} />
          </div>
          <Sk w={46} h={46} style={{ borderRadius: 12, flexShrink: 0 }} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.055, duration: 0.38 }}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}>
      <div style={{ borderRadius: 18, background: `linear-gradient(135deg,${g1} 0%,${g2} 100%)`, padding: "20px 20px 18px", position: "relative", overflow: "hidden", boxShadow: `0 8px 28px ${g1}55`, minHeight: 130 }}>
        <StarDeco color={meta.stars} size={18} style={{ top: 10, right: 80, opacity: 0.22, animation: "float-star 2.8s ease-in-out infinite" }} />
        <StarDeco color={meta.stars} size={11} style={{ top: 30, right: 110, opacity: 0.18, animation: "float-star 3.4s ease-in-out infinite 0.5s" }} />
        <StarDeco color={meta.stars} size={14} style={{ bottom: 18, left: 16, opacity: 0.15, animation: "float-star 3.1s ease-in-out infinite 1s" }} />
        <StarDeco color={meta.stars} size={8} style={{ bottom: 30, left: 50, opacity: 0.12, animation: "float-star 2.6s ease-in-out infinite 1.5s" }} />

        <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.10)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 10, bottom: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.80)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{meta.label}</p>
          <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}>
            <Icon size={19} color="rgba(255,255,255,0.95)" strokeWidth={2.2} />
          </div>
        </div>
        <h3 className="font-poppins" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1, color: value == null ? "rgba(255,255,255,0.35)" : "#fff", margin: "10px 0 4px", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          {value == null ? "—" : Number(value).toLocaleString()}
        </h3>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.70)", fontWeight: 500 }}>{subLabel}</p>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CHART CARD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const ChartCard = ({ title, desc, children, actions, loading, minH = 330 }: any) => (
  <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} style={{ height: "100%" }}>
    <div style={{ background: "var(--card-bg)", borderRadius: 18, border: "1px solid var(--card-border)", boxShadow: "var(--card-shadow)", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 22px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
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

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS RING
// ─────────────────────────────────────────────────────────────────────────────
const ProgressRing = ({ value, max, color, size = 80, stroke = 7, label, sub }: any) => {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grid-line)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600 }}>/{max}</span>
        </div>
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", textAlign: "center", margin: 0 }}>{label}</p>
      {sub && <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", margin: 0, lineHeight: 1.3 }}>{sub}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HEATMAP COMPONENT
// Uses a full-year calendar grid of squares (GitHub-style)
// ─────────────────────────────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface HeatCell { date: string; value: number; intensity: number; }

const Heatmap = ({ data, year, loading }: { data: HeatCell[]; year: number; loading: boolean }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; value: number } | null>(null);
  const toIsoDayUTC = (date: Date) => date.toISOString().split("T")[0];

  const { weeks, monthOffsets } = useMemo(() => {
    // Build map from date string → intensity
    const map: Record<string, { value: number; intensity: number }> = {};
    data.forEach((d) => { map[d.date] = { value: d.value, intensity: d.intensity }; });

    // Generate all days for the year
    const jan1 = new Date(Date.UTC(year, 0, 1));
    const dec31 = new Date(Date.UTC(year, 11, 31));

    // Pad from Sunday of first week
    const startDay = jan1.getUTCDay(); // 0=Sun
    const start = new Date(jan1);
    start.setUTCDate(start.getUTCDate() - startDay);

    // Pad to Saturday of last week
    const endDay = dec31.getUTCDay();
    const end = new Date(dec31);
    end.setUTCDate(end.getUTCDate() + (6 - endDay));

    const allDays: { date: Date; inYear: boolean }[] = [];
    let cur = new Date(start);
    while (cur <= end) {
      allDays.push({ date: new Date(cur), inYear: cur.getUTCFullYear() === year });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    // Group into weeks of 7
    const weeksArr: typeof allDays[] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeksArr.push(allDays.slice(i, i + 7));
    }

    // Month label offsets (which week index does each month start in?)
    const offsets: { label: string; col: number }[] = [];
    weeksArr.forEach((week, wi) => {
      week.forEach(({ date, inYear }) => {
        if (!inYear) return;
        if (date.getUTCDate() <= 7 && date.getUTCDay() === 0) {
          offsets.push({ label: MONTHS[date.getUTCMonth()], col: wi });
        }
        if (wi === 0 && date.getUTCDate() <= 7 && date.getUTCDay() > 0 && offsets.length === 0) {
          offsets.push({ label: MONTHS[date.getUTCMonth()], col: 0 });
        }
      });
    });

    return { weeks: weeksArr, monthOffsets: offsets, map };
  }, [data, year]);

  const getColor = (date: Date, inYear: boolean) => {
    if (!inYear) return "transparent";
    const key = toIsoDayUTC(date);
    const entry = data.find(d => d.date === key);
    if (!entry || entry.value === 0) return "var(--heat-empty)";
    if (entry.intensity <= 1) return "var(--heat-1)";
    if (entry.intensity <= 2) return "var(--heat-2)";
    if (entry.intensity <= 3) return "var(--heat-3)";
    return "var(--heat-4)";
  };

  const CELL = 13;
  const GAP = 3;
  const totalW = weeks.length * (CELL + GAP);

  if (loading) return <Sk h={130} style={{ width: "100%", borderRadius: 10 }} />;

  return (
    <div style={{ position: "relative", overflowX: "auto", paddingBottom: 4 }}>
      {/* Month labels */}
      <div style={{ display: "flex", marginLeft: 28, marginBottom: 4, position: "relative", height: 16 }}>
        {monthOffsets.map(({ label, col }) => (
          <span key={label + col} style={{
            position: "absolute", left: col * (CELL + GAP),
            fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}>{label}</span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 0 }}>
        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: GAP, marginRight: 4, paddingTop: 0 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ height: CELL, fontSize: 9, color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "flex", gap: GAP }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
              {week.map(({ date, inYear }, di) => {
                const key = toIsoDayUTC(date);
                const entry = data.find(d => d.date === key);
                const bg = getColor(date, inYear);
                return (
                  <div
                    key={di}
                    className="heat-cell"
                    style={{ width: CELL, height: CELL, background: bg }}
                    onMouseEnter={(e) => {
                      if (!inYear) return;
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ x: rect.left, y: rect.top - 36, date: key, value: entry?.value ?? 0 });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>Less</span>
        {["var(--heat-empty)", "var(--heat-1)", "var(--heat-2)", "var(--heat-3)", "var(--heat-4)"].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
        ))}
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>More</span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", left: tooltip.x, top: tooltip.y,
              background: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)",
              borderRadius: 8, padding: "6px 10px", pointerEvents: "none", zIndex: 9999,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)", fontSize: 11, fontWeight: 600,
              color: "var(--tooltip-text)", whiteSpace: "nowrap",
            }}
          >
            {tooltip.value} pts — {tooltip.date}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DONUT PANEL (reused pattern)
// ─────────────────────────────────────────────────────────────────────────────
const MiniDonut = ({ data, dataKey, nameKey }: any) => {
  const [active, setActive] = useState(0);
  if (!data?.length) return <EmptyState />;
  const total = data.reduce((s: number, d: any) => s + (d[dataKey] ?? 0), 0);
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ flexShrink: 0 }}>
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%"
              innerRadius={34} outerRadius={54} strokeWidth={0} paddingAngle={2}
              activeIndex={active} onMouseEnter={(_, i) => setActive(i)}>
              {data.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % 6]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        {data.map((item: any, i: number) => (
          <div key={i} onMouseEnter={() => setActive(i)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 6px", borderRadius: 6, background: active === i ? `${PIE_COLORS[i % 6]}12` : "transparent", transition: "background 0.15s", cursor: "default" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: PIE_COLORS[i % 6], flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{item[nameKey]}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{item[dataKey]}</span>
          </div>
        ))}
        <div style={{ marginTop: 4, padding: "3px 6px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>{total}</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK CARD
// ─────────────────────────────────────────────────────────────────────────────
const FeedbackCard = ({ item, index }: any) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
    style={{ padding: "12px 14px", borderRadius: 12, background: "var(--body-bg)", border: "1px solid var(--card-border)", display: "flex", flexDirection: "column", gap: 6 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${C.violet}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.violet }}>
          {item.mentor?.charAt(0) ?? "M"}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{item.mentor ?? "Mentor"}</span>
      </div>
      <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>{fmtDate(item.date)}</span>
    </div>
    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>{item.message}</p>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY ROW
// ─────────────────────────────────────────────────────────────────────────────
const ActivityRow = ({ item, index }: any) => (
  <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}
    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 10, transition: "background 0.14s" }}
    onMouseEnter={e => (e.currentTarget.style.background = "var(--table-hover)")}
    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${C.emerald}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Activity size={14} color={C.emerald} />
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>{item.activity}</p>
        <p style={{ fontSize: 10, color: "var(--text-muted)", margin: 0 }}>{fmtDate(item.date)}</p>
      </div>
    </div>
    <span style={{ fontSize: 12, fontWeight: 700, color: C.blue, background: `${C.blue}14`, padding: "3px 9px", borderRadius: 20 }}>{item.hoursSpent}h</span>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN STUDENT DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const {
    student, mentor, stats,
    monthlyActivity, pointsBySource, pointsTrend, taskCompletion,
    heatmapData, heatmapYear,
    recentFeedback, recentActivities,
    pointsTrendFilter, activityFilter,
    isLoadingProfile, isLoadingStats, isLoadingCharts, isLoadingHeatmap,
    fetchDashboard, fetchHeatmap, fetchPointsTrend, fetchTaskCompletion,
    setHeatmapYear, setPointsTrendFilter, setActivityFilter,
    refreshDashboard,
  } = useStudentDashboardStore();

  const { socials, fetchProfile } = useProfileStore() as any;

  const { initializeTheme } = useThemeStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => { initializeTheme(); }, [initializeTheme]);
  useEffect(() => {
    fetchDashboard();
    fetchHeatmap();
    fetchPointsTrend();
    fetchTaskCompletion();
    fetchProfile();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDashboard();
    setIsRefreshing(false);
  };

  const statsLoading = isLoadingStats && !stats;

  // Build completion donut data
  const projectDonut = stats?.projects
    ? [
      { label: "Completed", count: stats.projects.completed },
      { label: "Pending", count: stats.projects.pending },
      { label: "Rejected", count: stats.projects.rejected },
    ].filter(d => d.count > 0)
    : [];

  const taskDonut = stats?.tasks
    ? [
      { label: "Completed", count: stats.tasks.completed },
      { label: "Pending", count: stats.tasks.pending },
      { label: "Overdue", count: stats.tasks.overdue },
    ].filter(d => d.count > 0)
    : [];

  const certDonut = stats?.certifications
    ? [
      { label: "Earned", count: stats.certifications.completed },
      { label: "Pending", count: stats.certifications.pending },
      { label: "Rejected", count: stats.certifications.rejected },
    ].filter(d => d.count > 0)
    : [];

  // Available years for heatmap selector
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div style={{ width: "100%", minHeight: "100vh", background: "var(--body-bg)" }}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <Header
          subtitle={student ? `Welcome back, ${student.name.split(" ")[0]}! Keep up the great work.` : "Welcome back!"}
          HeaderComp={
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <RefreshCw size={14} style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }} />
                Refresh
              </Button>
              <Button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: "var(--primary)", color: "var(--primary-foreground)" }}>
                <Download size={14} />
                Export
              </Button>
            </div>
          }
        />

        <div style={{ padding: "24px 24px 48px" }}>
          {/* ── 1. STAT CARDS (TOP ROW) ───────────────────────────── */}
          <div className="stat-grid-student" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
            {STAT_META.map((meta, i) => (
              <StatCard key={meta.key} meta={meta} stats={stats} index={i} loading={statsLoading} />
            ))}
          </div>

          {/* ── 2. HEATMAP ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ marginBottom: 20 }}
          >
            <div style={{ background: "var(--card-bg)", borderRadius: 18, border: "1px solid var(--card-border)", boxShadow: "var(--card-shadow)", padding: "20px 24px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.emerald}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Flame size={17} color={C.emerald} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Points Heatmap</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Your contribution streak — points earned per day</p>
                  </div>
                </div>
                <Select value={String(heatmapYear)} onValueChange={v => setHeatmapYear(Number(v))}>
                  <SelectTrigger style={{ width: 100, height: 32, fontSize: 12 }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <Heatmap data={heatmapData} year={heatmapYear} loading={isLoadingHeatmap} />

              {/* Summary pills */}
              {!isLoadingHeatmap && heatmapData.length > 0 && (
                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                  {[
                    { label: "Active Days", val: heatmapData.filter(d => d.value > 0).length, color: C.emerald },
                    { label: "Total Points", val: heatmapData.reduce((s, d) => s + d.value, 0).toFixed(0), color: C.blue },
                    { label: "Avg pts/day", val: heatmapData.length > 0 ? (heatmapData.reduce((s, d) => s + d.value, 0) / heatmapData.filter(d => d.value > 0).length || 0).toFixed(1) : "0", color: C.violet },
                    { label: "Best Day", val: `${Math.max(...heatmapData.map(d => d.value))} pts`, color: C.amber },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ padding: "6px 14px", borderRadius: 20, background: `${color}14`, border: `1px solid ${color}30` }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>{label}: </span>
                      <span style={{ fontSize: 12, fontWeight: 800, color }}>{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mb-6">

            {/* ── STUDENT PROFILE ─────────────────────────── */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                style={{
                  borderRadius: 20,
                  width: "100%",
                  background: "var(--profile-card)",
                  padding: "26px 26px 22px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                  height: "100%"
                }}
              >

                <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "absolute", right: 40, bottom: -60, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

                <StarDeco color="rgba(255,255,255,0.14)" size={22} style={{ top: 18, right: 120 }} />
                <StarDeco color="rgba(255,255,255,0.10)" size={14} style={{ top: 50, right: 180 }} />

                {isLoadingProfile ? (
                  <div className="flex flex-col gap-3">
                    <Sk h={20} w="70%" />
                    <Sk h={12} w="50%" />
                    <Sk h={12} w="60%" />
                    <Sk h={12} w="65%" />
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <User size={20} color="#fff" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[16px] font-extrabold text-white truncate">
                          {student?.name || "Student"}
                        </p>

                        <p className="text-[11px] text-white/70">
                          {student?.department || "—"} • {student?.year || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-2 text-[12px] text-white/80">
                      <div className="flex items-center gap-2">
                        <Mail size={13} /> {student?.email || "—"}
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin size={13} /> {student?.place || "—"}
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone size={13} /> {student?.phone || "—"}
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar size={13} /> {student?.academicYear || "—"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* ── SOCIALS CARD ─────────────────────────── */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div
                style={{
                  borderRadius: 20,
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  boxShadow: "var(--card-shadow)",
                  padding: "26px 26px 22px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${C.indigo}16`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Globe size={16} color={C.indigo} />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Online Profiles</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Your linked social profiles</p>
                    </div>
                  </div>
                </div>

                {!socials ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 140 }}>
                    <Sk h={16} w="80%" style={{ marginBottom: 12 }} />
                    <Sk h={16} w="60%" />
                  </div>
                ) : (!socials.github && !socials.linkedin && !socials.leetcode && !socials.codechef && !socials.portfolio) ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 140, background: "var(--body-bg)", borderRadius: 12, border: "1px dashed var(--card-border)" }}>
                    <Link2 size={24} color="var(--text-muted)" style={{ marginBottom: 10 }} />
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", margin: 0 }}>No social links added</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "4px 0 0" }}>Update your profile to stand out</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, flex: 1 }}>
                    {[
                      { icon: Linkedin, label: "LinkedIn", val: socials.linkedin, c: "#0A66C2" },
                      { icon: Github, label: "GitHub", val: socials.github, c: "#181717" },
                      { icon: Code, label: "LeetCode", val: socials.leetcode, c: "#FFA116" },
                      { icon: Terminal, label: "CodeChef", val: socials.codechef, c: "#5B4638" },
                      { icon: Link2, label: "Portfolio", val: socials.portfolio, c: C.teal },
                    ].filter(i => !!i.val).map((item, idx) => (
                      <a key={idx} href={item.val.startsWith('http') ? item.val : `https://${item.val}`} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "1px solid var(--card-border)", background: "var(--body-bg)", textDecoration: "none", transition: "transform 0.15s, border-color 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = C.blue; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--card-border)"; }}>
                        <item.icon size={18} color={item.c} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── RANK CARD ─────────────────────────── */}
            <div
              className="w-full"
              style={{
                borderRadius: 20,
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                boxShadow: "var(--card-shadow)",
                padding: "22px"
              }}
            >

              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
                  <Trophy size={17} color={C.amber} />
                </div>

                <div>
                  <p className="text-[13px] font-bold text-[var(--text-primary)]">
                    Rankings
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Your current standing
                  </p>
                </div>
              </div>

              {statsLoading ? (
                <div className="flex flex-col gap-3">
                  <Sk h={60} />
                  <Sk h={60} />
                </div>
              ) : (
                <div className="flex flex-col gap-3">

                  {/* {[
                    { label: "Overall Rank", val: stats?.ranking?.overallRank, color: C.amber, icon: "🏆" },
                    { label: "Department Rank", val: stats?.ranking?.departmentRank, color: C.blue, icon: "🎯" }
                  ].map(({ label, val, color, icon }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{
                        background: `${color}0F`,
                        border: `1px solid ${color}25`
                      }}
                    >
                      <div>
                        <p className="text-[10px] font-bold uppercase text-[var(--text-muted)]">
                          {label}
                        </p>

                        <p className="text-[26px] font-extrabold" style={{ color }}>
                          {val != null ? `#${val}` : "—"}
                        </p>
                      </div>

                      <span className="text-[28px]">{icon}</span>
                    </div>
                  ))} */}

                  <div
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{
                      background: `${C.violet}0F`,
                      border: `1px solid ${C.violet}25`
                    }}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase text-[var(--text-muted)]">
                        Total Points
                      </p>

                      <p className="text-[26px] font-extrabold" style={{ color: C.violet }}>
                        {stats?.totalPoints?.toLocaleString() ?? "—"}
                      </p>
                    </div>

                    <Zap size={28} color={C.violet} />
                  </div>

                </div>
              )}
            </div>

            {/* ── MENTOR CARD ─────────────────────────── */}
            <motion.div
              className="w-full hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div
                style={{
                  borderRadius: 18,
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  boxShadow: "var(--card-shadow)",
                  padding: "18px"
                }}
              >

                <div className="flex items-center gap-3 mb-3">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${C.cyan}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <GraduationCap size={16} color={C.cyan} />
                  </div>

                  <div>
                    <p className="text-[13px] font-bold text-[var(--text-primary)]">
                      Mentor
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Assigned mentor info
                    </p>
                  </div>
                </div>

                {mentor ? (
                  <div className="flex flex-col gap-1 text-[12px]">
                    <div className="font-bold text-[var(--text-primary)]">
                      {mentor.name}
                    </div>
                    <div className="text-[var(--text-secondary)]">
                      {mentor.department || "—"}
                    </div>
                    <div className="text-[var(--text-muted)]">
                      {mentor.email || "—"}
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] text-[var(--text-muted)]">
                    No mentor assigned
                  </p>
                )}
              </div>
            </motion.div>



          </div>

          <div className="student-shell">
            <div className="student-main">
              {/* ── 3. POINTS TREND + ACTIVITY CHART ─────────────────── */}
              <div className="one-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <ChartCard
                  title="Points Trend" desc="Points earned over time" loading={isLoadingCharts} minH={290}
                  actions={["week", "month", "year"].map(v => (
                    <Pill key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} active={pointsTrendFilter === v} onClick={() => setPointsTrendFilter(v as any)} />
                  ))}
                >
                  {!pointsTrend?.length ? <EmptyState /> : (
                    <ResponsiveContainer width="100%" height={268}>
                      <AreaChart data={pointsTrend} margin={{ top: 4, right: 6, left: -16, bottom: 0 }}>
                        <defs>
                          <linearGradient id="ptGradS" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={C.violet} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={C.violet} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={v => fmtDate(v)} />
                        <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="points" name="Points" stroke={C.violet} strokeWidth={2.5} fill="url(#ptGradS)" dot={false} activeDot={{ r: 5, fill: C.violet, strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>

                <ChartCard
                  title="Activity Hours" desc="Daily hours logged over time" loading={isLoadingCharts} minH={290}
                  actions={["week", "month", "year"].map(v => (
                    <Pill key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} active={activityFilter === v} onClick={() => setActivityFilter(v as any)} />
                  ))}
                >
                  {!monthlyActivity?.length ? <EmptyState /> : (
                    <ResponsiveContainer width="100%" height={268}>
                      <AreaChart data={monthlyActivity} margin={{ top: 4, right: 6, left: -16, bottom: 0 }}>
                        <defs>
                          <linearGradient id="actGradS" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={C.cyan} stopOpacity={0.22} />
                            <stop offset="95%" stopColor={C.cyan} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={v => fmtDate(v + "-01", "month")} />
                        <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="hours" name="Hours" stroke={C.cyan} strokeWidth={2.5} fill="url(#actGradS)" dot={false} activeDot={{ r: 5, fill: C.cyan, strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>

              {/* ── 4. COMPLETION RINGS + POINTS BY SOURCE ────────────── */}
              <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Completion status */}
                <ChartCard title="Completion Overview" desc="Status breakdown for all activities" loading={isLoadingStats} minH={0}>
                  {statsLoading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      <Sk h={120} /><Sk h={120} /><Sk h={120} />
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {[
                        { label: "Projects", data: projectDonut, completed: stats?.projects?.completed ?? 0, total: stats?.projects?.total ?? 0, color: C.blue },
                        { label: "Tasks", data: taskDonut, completed: stats?.tasks?.completed ?? 0, total: stats?.tasks?.total ?? 0, color: C.emerald },
                        { label: "Certifications", data: certDonut, completed: stats?.certifications?.completed ?? 0, total: stats?.certifications?.total ?? 0, color: C.amber },
                      ].map(({ label, data, completed, total, color }) => (
                        <div key={label} style={{ padding: "16px", borderRadius: 14, background: "var(--body-bg)", border: "1px solid var(--card-border)" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{label}</p>
                            <span style={{ fontSize: 12, fontWeight: 800, color, background: `${color}14`, padding: "3px 10px", borderRadius: 20 }}>{completed}/{total}</span>
                          </div>
                          {data.length > 0
                            ? <MiniDonut data={data} dataKey="count" nameKey="label" />
                            : <EmptyState label="No data yet" />
                          }
                        </div>
                      ))}
                    </div>
                  )}
                </ChartCard>

                {/* Points by source */}
                <ChartCard title="Points by Source" desc="Where your points come from" loading={isLoadingCharts} minH={0}>
                  {!pointsBySource?.length ? <EmptyState /> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      <ResponsiveContainer width="100%" height={230}>
                        <BarChart data={pointsBySource} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 0 }}>
                          <defs>
                            {PIE_COLORS.map((col, i) => (
                              <linearGradient key={i} id={`hgrad${i}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={col} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={col} stopOpacity={1} />
                              </linearGradient>
                            ))}
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: "var(--text-secondary)", fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
                          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(59,111,212,0.05)" }} />
                          <Bar dataKey="points" name="Points" radius={[0, 8, 8, 0]} maxBarSize={22}>
                            {pointsBySource.map((_: any, i: number) => (
                              <Cell key={i} fill={`url(#hgrad${i % 6})`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>

                      {/* Source legend */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 8 }}>
                        {pointsBySource.map((item: any, i: number) => {
                          const total = pointsBySource.reduce((s: number, d: any) => s + d.points, 0);
                          const pct = total > 0 ? ((item.points / total) * 100).toFixed(1) : "0";
                          return (
                            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 8px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: PIE_COLORS[i % 6], flexShrink: 0 }} />
                                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{item.source}</span>
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: PIE_COLORS[i % 6] }}>{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </ChartCard>
              </div>

              {/* ── 5. TASK COMPLETION TREND ──────────────────────────── */}
              {taskCompletion?.length > 0 && (
                <ChartCard title="Task Completion Trend" desc="Monthly breakdown of task statuses" loading={isLoadingCharts} minH={310}>
                  <ResponsiveContainer width="100%" height={290}>
                    <BarChart data={taskCompletion} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                      <defs>
                        {[[C.emerald, "tg1"], [C.amber, "tg2"], [C.rose, "tg3"]].map(([c, id]) => (
                          <linearGradient key={id as string} id={id as string} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={c as string} stopOpacity={1} />
                            <stop offset="100%" stopColor={c as string} stopOpacity={0.55} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={v => fmtDate(v + "-01", "month")} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(59,111,212,0.04)" }} />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10, color: "var(--text-secondary)" }} iconType="circle" iconSize={8} />
                      <Bar dataKey="completed" name="Completed" stackId="a" fill="url(#tg1)" radius={[0, 0, 0, 0]} maxBarSize={48} />
                      <Bar dataKey="pending" name="Pending" stackId="a" fill="url(#tg2)" maxBarSize={48} />
                      <Bar dataKey="overdue" name="Overdue" stackId="a" fill="url(#tg3)" radius={[8, 8, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* ── 6. RECENT FEEDBACK + ACTIVITY LOG ────────────────── */}
              <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                <ChartCard title="Recent Feedback" desc="Latest from your mentor" loading={isLoadingProfile} minH={0}>
                  {!recentFeedback?.length ? (
                    <EmptyState label="No feedback yet" />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {recentFeedback.map((item: any, i: number) => (
                        <FeedbackCard key={item.id ?? i} item={item} index={i} />
                      ))}
                    </div>
                  )}
                </ChartCard>

                <ChartCard title="Recent Activity" desc="Your latest logged hours" loading={isLoadingProfile} minH={0}>
                  {!recentActivities?.length ? (
                    <EmptyState label="No recent activity" />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {recentActivities.slice(0, 8).map((item: any, i: number) => (
                        <ActivityRow key={i} item={item} index={i} />
                      ))}
                    </div>
                  )}
                </ChartCard>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
