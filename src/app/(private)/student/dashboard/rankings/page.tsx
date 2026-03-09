"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Medal, Search, ChevronLeft, ChevronRight,
  TrendingUp, Users, Star, Zap, Target, Crown,
  ArrowUp, BarChart2, Building2, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRankingsStore, RankingEntry, DepartmentRankingEntry } from "@/store/student/ranking";
import { useThemeStore } from "@/store/layoutStore";
import Header from "@/components/layout/header";

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  blue:    "#3B6FD4",
  violet:  "#7C3AED",
  emerald: "#059669",
  amber:   "#D97706",
  rose:    "#E11D48",
  cyan:    "#0891B2",
  gold:    "#F59E0B",
  silver:  "#94A3B8",
  bronze:  "#B45309",
  indigo:  "#6366F1",
};

const RANK_COLORS = [
  { bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)", color: "#92400E", border: "#FCD34D", icon: "🥇" },
  { bg: "linear-gradient(135deg,#F1F5F9,#E2E8F0)", color: "#475569", border: "#CBD5E1", icon: "🥈" },
  { bg: "linear-gradient(135deg,#FFF7ED,#FED7AA)", color: "#92400E", border: "#FDBA74", icon: "🥉" },
];

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(59,111,212,0)} 50%{box-shadow:0 0 0 6px rgba(59,111,212,0.18)} }

  :root {
    --card-bg:#fff; --card-border:#E8EDF4; --card-shadow:0 2px 12px rgba(0,0,0,0.06);
    --body-bg:#F7F9FC; --text-primary:#1E293B; --text-secondary:#64748B; --text-muted:#94A3B8;
    --input-bg:#F8FAFC; --input-border:#E2E8F0;
    --sk-from:#EEF2F7; --sk-via:#E2E8F0;
    --table-hover:#F0F5FF; --table-border:#F1F5F9;
    --pill-inactive-bg:#F1F5F9; --pill-inactive-text:#64748B;
    --me-bg:#EEF2FF; --me-border:#C7D2FE;
  }
  .dark {
    --card-bg:#1E2432; --card-border:#2A3349; --card-shadow:0 2px 12px rgba(0,0,0,0.30);
    --body-bg:#141921; --text-primary:#E8EDF8; --text-secondary:#94A3B8; --text-muted:#64748B;
    --input-bg:#252E42; --input-border:#2A3349;
    --sk-from:#1E2432; --sk-via:#252E42;
    --table-hover:#1A2540; --table-border:#1E2432;
    --pill-inactive-bg:#1E2432; --pill-inactive-text:#94A3B8;
    --me-bg:#1E2A50; --me-border:#3B5080;
  }
  .sk { background:linear-gradient(90deg,var(--sk-from) 25%,var(--sk-via) 50%,var(--sk-from) 75%); background-size:200% 100%; animation:shimmer 1.6s infinite linear; border-radius:10px; }
  .form-input { width:100%; padding:9px 13px; border-radius:10px; font-size:13px; font-family:inherit; background:var(--input-bg); border:1.5px solid var(--input-border); color:var(--text-primary); outline:none; transition:border-color 0.18s; }
  .form-input:focus { border-color:${C.blue}; box-shadow:0 0 0 3px ${C.blue}20; }
  .form-input::placeholder { color:var(--text-muted); }
  .rank-row { transition:background 0.14s; }
  .rank-row:hover { background:var(--table-hover)!important; }
  .rank-row.me { background:var(--me-bg)!important; animation:pulse-glow 2s ease-in-out 2; }

  @media(max-width:900px){ .rank-cols-hide{display:none!important;} }
  @media(max-width:768px){ .top3-grid{grid-template-columns:1fr!important;} .pos-grid{grid-template-columns:repeat(2,1fr)!important;} }
  @media(max-width:580px){ .pos-grid{grid-template-columns:1fr!important;} .filter-rank{flex-wrap:wrap!important;} }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const Sk = ({ w = "100%", h = 16, style = {} }: any) => <div className="sk" style={{ width: w, height: h, ...style }} />;

const PIE_COLORS = [C.blue, C.violet, C.emerald, C.amber];

const getInitials = (name: string) => name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);

const Pill = ({ label, active, onClick, color = C.blue }: any) => (
  <button onClick={onClick} style={{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.18s", background: active ? color : "var(--pill-inactive-bg)", color: active ? "#fff" : "var(--pill-inactive-text)", boxShadow: active ? `0 2px 10px ${color}44` : "none" }}>
    {label}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// RANK MEDAL
// ─────────────────────────────────────────────────────────────────────────────
const RankCell = ({ rank, isMe }: { rank: number; isMe: boolean }) => {
  if (rank === 1) return <span style={{ fontSize: 20 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 20 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 20 }}>🥉</span>;
  return (
    <span style={{ fontSize: 12, fontWeight: 800, color: isMe ? C.blue : "var(--text-secondary)", background: isMe ? `${C.blue}18` : "var(--pill-inactive-bg)", borderRadius: 8, padding: "3px 9px", letterSpacing: "0.02em" }}>
      #{rank}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MY POSITION BANNER
// ─────────────────────────────────────────────────────────────────────────────
const MyPositionBanner = ({ myPosition, loading }: any) => {
  if (loading) return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 18, padding: "20px 24px", boxShadow: "var(--card-shadow)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Sk h={18} w="40%" /><Sk h={60} /><Sk h={14} w="60%" />
      </div>
    </div>
  );
  if (!myPosition) return null;

  const { studentInfo, ranking, stats } = myPosition;
  const percentile = stats.percentile;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ background: "linear-gradient(135deg,#1E2432 0%,#0F172A 100%)", borderRadius: 20, padding: "24px 28px", position: "relative", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}>
        {/* Decorative */}
        <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 40, bottom: -50, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>Your Standing</p>
            <h2 className="font-poppins" style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>{studentInfo.name}</h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0 }}>{studentInfo.department} • {studentInfo.year}</p>
          </div>

          {/* Percentile ring */}
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `conic-gradient(${C.blue} ${percentile * 3.6}deg, rgba(255,255,255,0.1) 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1E2432", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: C.blue, lineHeight: 1 }}>{percentile}</span>
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>%ile</span>
              </div>
            </div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, margin: 0 }}>Percentile</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="pos-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 20 }}>
          {[
            { label: "Overall Rank",   val: `#${ranking.overallRank}`,     color: C.gold },
            { label: "Dept Rank",      val: `#${ranking.departmentRank}`,  color: C.cyan },
            { label: "Total Points",   val: studentInfo.totalPoints.toLocaleString(), color: C.violet },
            { label: "Total Students", val: stats.totalStudents,            color: C.emerald },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.06)", backdropFilter: "blur(4px)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.40)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 4px" }}>{label}</p>
              <p className="font-poppins" style={{ fontSize: 20, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TOP 3 PODIUM
// ─────────────────────────────────────────────────────────────────────────────
const Top3Podium = ({ top3, isMe }: { top3: (RankingEntry | DepartmentRankingEntry)[]; isMe: (id: string) => boolean }) => (
  <div className="top3-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
    {[1, 0, 2].map((idx) => { // 2nd, 1st, 3rd
      const entry = top3[idx];
      if (!entry) return <div key={idx} />;
      const meta = RANK_COLORS[idx];
      const isCurrentUser = isMe(entry.studentId);
      const heights = ["86px", "106px", "72px"];
      return (
        <motion.div key={entry.studentId} initial={{ opacity: 0, y: 16 + idx * 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.09, duration: 0.4 }}
          style={{ background: meta.bg, border: `1.5px solid ${meta.border}`, borderRadius: 18, padding: "18px 16px", textAlign: "center", position: "relative", boxShadow: isCurrentUser ? `0 0 0 2px ${C.blue}, 0 8px 24px ${C.blue}30` : "0 4px 16px rgba(0,0,0,0.08)" }}>
          {isCurrentUser && (
            <div style={{ position: "absolute", top: 8, right: 8, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: C.blue, color: "#fff" }}>You</div>
          )}
          <div style={{ fontSize: 28, marginBottom: 6 }}>{meta.icon}</div>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${C.blue}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: meta.color, margin: "0 auto 8px", border: `2px solid ${meta.border}` }}>
            {getInitials(entry.name)}
          </div>
          <p style={{ fontSize: 13, fontWeight: 800, color: meta.color, margin: "0 0 3px", lineHeight: 1.2 }}>{entry.name}</p>
          {"department" in entry && <p style={{ fontSize: 10, color: meta.color, opacity: 0.7, margin: "0 0 6px", fontWeight: 600 }}>{(entry as RankingEntry).department}</p>}
          <div style={{ fontSize: 17, fontWeight: 900, color: meta.color }}>{entry.points.toLocaleString()}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: meta.color, opacity: 0.65 }}>pts</div>
          {/* podium bar */}
          <div style={{ height: heights[idx], background: `${meta.border}40`, borderRadius: "0 0 8px 8px", marginTop: 10, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: meta.color }}>#{idx === 0 ? 2 : idx === 1 ? 1 : 3}</span>
          </div>
        </motion.div>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// RANKING TABLE
// ─────────────────────────────────────────────────────────────────────────────
const RankingTable = ({ entries, isMe, showDept = true, loading }: any) => {
  if (loading) return (
    <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 8 }}>
      {[...Array(8)].map((_, i) => <Sk key={i} h={50} />)}
    </div>
  );
  if (!entries.length) return (
    <div style={{ padding: "48px", textAlign: "center" }}>
      <Trophy size={36} color="var(--text-muted)" style={{ marginBottom: 10 }} />
      <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>No rankings yet</p>
    </div>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--table-border)", background: "var(--body-bg)" }}>
            {["Rank","Student","Points", ...(showDept ? ["Department","Year","Dept Rank"] : ["Year"])].map(h => (
              <th key={h} className={["Year","Dept Rank"].includes(h) ? "rank-cols-hide" : ""}
                style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry: any, i: number) => {
            const me = isMe(entry.studentId);
            return (
              <motion.tr key={entry.studentId ?? i}
                className={`rank-row${me ? " me" : ""}`}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }}
                style={{ borderBottom: "1px solid var(--table-border)", borderLeft: me ? `3px solid ${C.blue}` : "3px solid transparent" }}>
                <td style={{ padding: "12px 16px" }}><RankCell rank={entry.rank ?? entry.overallRank} isMe={me} /></td>
                <td style={{ padding: "12px 16px", minWidth: 180 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: me ? `${C.blue}22` : `${PIE_COLORS[i % 4]}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: me ? C.blue : PIE_COLORS[i % 4], border: me ? `2px solid ${C.blue}55` : "none", flexShrink: 0 }}>
                      {getInitials(entry.name)}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: me ? 800 : 600, color: me ? C.blue : "var(--text-primary)", margin: 0, whiteSpace: "nowrap" }}>
                        {entry.name} {me && <span style={{ fontSize: 10, background: C.blue, color: "#fff", borderRadius: 6, padding: "1px 5px", marginLeft: 4 }}>You</span>}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{entry.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 15, fontWeight: 800, background: `linear-gradient(135deg,${C.amber},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {(entry.points ?? 0).toLocaleString()}
                  </span>
                </td>
                {showDept && <td className="rank-cols-hide" style={{ padding: "12px 16px" }}><span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: `${C.blue}12`, color: C.blue }}>{entry.department}</span></td>}
                <td className="rank-cols-hide" style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{entry.year}</td>
                {showDept && (
                  <td className="rank-cols-hide" style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>
                    #{entry.departmentRank ?? entry.rank}
                  </td>
                )}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function RankingsPage() {
  const {
    rankings, departmentRankings, myPosition, currentStudentRanking,
    activeView, searchQuery, selectedYear,
    pagination, deptPagination,
    isLoadingOverall, isLoadingDepartment, isLoadingPosition,
    fetchAll, setActiveView, setSearchQuery, setSelectedYear,
    setPage, setDeptPage,
    departmentName,
  } = useRankingsStore();

  const { initializeTheme } = useThemeStore();

  useEffect(() => { initializeTheme(); fetchAll(); }, []);

  const isMe = (id: string) => myPosition?.studentInfo?.id === id || rankings.find(r => r.isCurrentStudent)?.studentId === id || departmentRankings.find(r => r.isCurrentStudent)?.studentId === id;

  const filteredOverall = useMemo(() => {
    let list = rankings;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.department?.toLowerCase().includes(q));
    }
    if (selectedYear !== "ALL") list = list.filter(r => r.year === selectedYear);
    return list;
  }, [rankings, searchQuery, selectedYear]);

  const filteredDept = useMemo(() => {
    if (!searchQuery.trim()) return departmentRankings;
    const q = searchQuery.toLowerCase();
    return departmentRankings.filter(r => r.name.toLowerCase().includes(q));
  }, [departmentRankings, searchQuery]);

  const top3Overall = rankings.slice(0, 3);
  const top3Dept    = departmentRankings.slice(0, 3);
  const activeTop3  = activeView === "overall" ? top3Overall : top3Dept;

  const totalPages = activeView === "overall"
    ? Math.ceil(pagination.total / pagination.limit)
    : Math.ceil(deptPagination.total / deptPagination.limit);
  const currentPage = activeView === "overall"
    ? Math.floor(pagination.skip / pagination.limit) + 1
    : Math.floor(deptPagination.skip / deptPagination.limit) + 1;

  const years = ["ALL", "1st", "2nd", "3rd", "4th"];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "var(--body-bg)" }}>
        <Header subtitle="See how you stack up against your peers across the institution." />

        <div style={{ padding: "24px 24px 48px", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* My Position Banner */}
          <MyPositionBanner myPosition={myPosition} loading={isLoadingPosition} />

          {/* View toggle + filters */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "16px 20px", boxShadow: "var(--card-shadow)" }}>
            <div className="filter-rank" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>

              {/* View toggle */}
              <div style={{ display: "flex", gap: 2, padding: "3px", background: "var(--body-bg)", borderRadius: 12, border: "1px solid var(--card-border)" }}>
                {[
                  { key: "overall", label: "Overall", icon: <Trophy size={12} /> },
                  { key: "department", label: departmentName || "Department", icon: <Building2 size={12} /> },
                ].map(({ key, label, icon }) => (
                  <button key={key} onClick={() => setActiveView(key as any)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.18s", background: activeView === key ? C.blue : "transparent", color: activeView === key ? "#fff" : "var(--text-secondary)", boxShadow: activeView === key ? `0 2px 10px ${C.blue}44` : "none" }}>
                    {icon}{label}
                  </button>
                ))}
              </div>

              {activeView === "overall" && (
                <>
                  <div style={{ width: 1, height: 22, background: "var(--card-border)" }} />
                  <div style={{ display: "flex", gap: 5 }}>
                    {years.map(y => <Pill key={y} label={y === "ALL" ? "All Years" : y} active={selectedYear === y} onClick={() => setSelectedYear(y)} />)}
                  </div>
                </>
              )}

              <div style={{ marginLeft: "auto", position: "relative", maxWidth: 240, width: "100%" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input className="form-input" placeholder="Search students..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 30 }} />
              </div>
            </div>
          </div>

          {/* Podium top 3 */}
          {activeTop3.length >= 3 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 18, padding: "20px 22px", boxShadow: "var(--card-shadow)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                  <Crown size={16} color={C.gold} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Top 3 Performers</p>
                </div>
                <Top3Podium top3={activeTop3} isMe={(id) => !!isMe(id)} />
              </div>
            </motion.div>
          )}

          {/* Full table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 18, boxShadow: "var(--card-shadow)", overflow: "hidden" }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--table-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${C.blue}16`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BarChart2 size={15} color={C.blue} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                      {activeView === "overall" ? "Overall Leaderboard" : `${departmentName} Leaderboard`}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                      {activeView === "overall" ? `${pagination.total} students` : `${deptPagination.total} students`}
                    </p>
                  </div>
                </div>
                {currentStudentRanking && (
                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { label: "Your Overall", val: `#${currentStudentRanking.overallRank}`, color: C.blue },
                      { label: "Your Dept",    val: `#${currentStudentRanking.departmentRank}`, color: C.violet },
                    ].map(({ label, val, color }) => (
                      <div key={label} style={{ padding: "8px 14px", borderRadius: 10, background: `${color}12`, border: `1px solid ${color}30`, textAlign: "center" }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>{label}</p>
                        <p style={{ fontSize: 16, fontWeight: 900, color, margin: 0, lineHeight: 1.1 }}>{val}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <RankingTable
                entries={activeView === "overall" ? filteredOverall : filteredDept}
                isMe={(id: string) => !!isMe(id)}
                showDept={activeView === "overall"}
                loading={activeView === "overall" ? isLoadingOverall : isLoadingDepartment}
              />
            </div>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <button onClick={() => activeView === "overall" ? setPage(pagination.skip - pagination.limit) : setDeptPage(deptPagination.skip - deptPagination.limit)} disabled={currentPage === 1}
                style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-secondary)", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
                <ChevronLeft size={13} /> Prev
              </button>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Page {currentPage} of {totalPages}</span>
              <button onClick={() => activeView === "overall" ? setPage(pagination.skip + pagination.limit) : setDeptPage(deptPagination.skip + deptPagination.limit)} disabled={currentPage === totalPages}
                style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-secondary)", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
                Next <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
