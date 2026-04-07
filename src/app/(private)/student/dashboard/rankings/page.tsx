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

const C = {
  blue:    "var(--piq-blue)",
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

const PIE_COLORS = ["var(--piq-blue)", "#7C3AED", "#059669", "#D97706"];

const Sk = ({ h = 16, className = "" }: { h?: number; className?: string }) => (
  <div className={`animate-pulse bg-foreground/5 rounded-lg ${className}`} style={{ height: h }} />
);

const getInitials = (name: string) => name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);

const Pill = ({ label, active, onClick, color = "var(--piq-blue)" }: any) => (
  <button onClick={onClick} className={`px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${active ? 'text-white shadow-md border-transparent' : 'bg-card/50 text-muted-foreground border-transparent hover:bg-foreground/5'}`} style={{ backgroundColor: active ? color : undefined }}>
    {label}
  </button>
);

const RankCell = ({ rank, isMe }: { rank: number; isMe: boolean }) => {
  if (rank === 1) return <span className="text-2xl drop-shadow-sm">🥇</span>;
  if (rank === 2) return <span className="text-2xl drop-shadow-sm">🥈</span>;
  if (rank === 3) return <span className="text-2xl drop-shadow-sm">🥉</span>;
  return (
    <span className={`inline-flex items-center justify-center px-3 py-1 font-mono font-bold text-[11px] tracking-widest rounded-lg ${isMe ? 'bg-primary/10 text-primary' : 'bg-foreground/5 text-muted-foreground'}`}>
      #{rank}
    </span>
  );
};

const MyPositionBanner = ({ myPosition, loading }: any) => {
  if (loading) return (
    <div className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-6 flex flex-col gap-3">
      <Sk h={18} className="w-[40%]" /><Sk h={60} /><Sk h={14} className="w-[60%]" />
    </div>
  );
  if (!myPosition) return null;

  const { studentInfo, ranking, stats } = myPosition;
  const percentile = stats.percentile;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-800">
        <div className="absolute -top-[30px] -right-[30px] w-[140px] h-[140px] rounded-full bg-white/[0.03] pointer-events-none" />
        <div className="absolute -bottom-[50px] right-[40px] w-[110px] h-[110px] rounded-full bg-white/[0.02] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-10">
          <div>
            <p className="text-[10px] font-mono font-bold text-white/40 tracking-[0.15em] uppercase mb-2">Your Standing</p>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-1.5">{studentInfo.name}</h2>
            <p className="text-sm font-mono text-white/50">{studentInfo.department} • {studentInfo.year}</p>
          </div>

          <div className="text-center lg:ml-auto">
            <div className="w-[76px] h-[76px] rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: `conic-gradient(var(--piq-blue) ${percentile * 3.6}deg, rgba(255,255,255,0.1) 0deg)` }}>
              <div className="w-[58px] h-[58px] rounded-full bg-slate-900 flex flex-col items-center justify-center">
                <span className="text-lg font-display font-bold text-white leading-none">{percentile}</span>
                <span className="text-[8px] font-mono font-bold text-white">PERCENTILE</span>
              </div>
            </div>
            <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest m-0">Top Performing</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-6 lg:mt-8">
          {[
            { label: "Overall Rank",   val: `#${ranking.overallRank}`,     color: C.gold },
            { label: "Dept Rank",      val: `#${ranking.departmentRank}`,  color: C.cyan },
            { label: "Total Points",   val: studentInfo.totalPoints.toLocaleString(), color: C.violet },
            { label: "Total Students", val: stats.totalStudents,            color: C.emerald },
          ].map(({ label, val, color }) => (
            <div key={label} className="bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-xl p-3.5">
              <p className="text-[9px] font-mono font-bold text-white/40 tracking-[0.15em] uppercase mb-1">{label}</p>
              <p className="font-display text-xl lg:text-2xl font-bold m-0 leading-none" style={{ color }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Top3Podium = ({ top3, isMe }: { top3: (RankingEntry | DepartmentRankingEntry)[]; isMe: (id: string) => boolean }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr items-end" style={{ minHeight: '260px' }}>
    {[1, 0, 2].map((idx) => {
      const entry = top3[idx];
      if (!entry) return <div key={`empty-${idx}`} />;
      const meta = RANK_COLORS[idx];
      const isCurrentUser = isMe(entry.studentId);
      const podiumHeightClass = idx === 0 ? "h-32" : idx === 1 ? "h-24" : "h-20";
      return (
        <motion.div key={entry.studentId} initial={{ opacity: 0, y: 16 + idx * 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.09, duration: 0.4 }}
          className={`flex flex-col text-center relative rounded-[1.5rem] p-5 shadow-lg ${isCurrentUser ? 'ring-2 ring-primary shadow-primary/20' : ''}`} style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
          {isCurrentUser && (
            <div className="absolute top-3 right-3 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary text-white uppercase tracking-widest shadow-sm">You</div>
          )}
          <div className="text-4xl mb-3 drop-shadow-md">{meta.icon}</div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg mx-auto mb-3 shadow-inner" style={{ background: `${meta.border}40`, color: meta.color, border: `2px solid ${meta.border}80` }}>
            {getInitials(entry.name)}
          </div>
          <p className="text-sm font-display font-bold truncate px-2 mb-0.5" style={{ color: meta.color }}>{entry.name}</p>
          {"department" in entry && <p className="text-[10px] font-mono tracking-wider truncate px-2 mb-2 opacity-80 uppercase" style={{ color: meta.color }}>{(entry as RankingEntry).department}</p>}
          <div className="text-xl font-display font-bold mt-1" style={{ color: meta.color }}>{entry.points.toLocaleString()}</div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-70 mb-4" style={{ color: meta.color }}>Points</div>
          <div className={`mt-auto w-full flex items-end justify-center pb-2 rounded-b-xl ${podiumHeightClass}`} style={{ background: `${meta.border}50` }}>
             <span className="text-2xl font-display font-black opacity-40 mix-blend-color-burn">#{idx === 0 ? 2 : idx === 1 ? 1 : 3}</span>
          </div>
        </motion.div>
      );
    })}
  </div>
);

const RankingTable = ({ entries, isMe, showDept = true, loading }: any) => {
  if (loading) return (
    <div className="p-5 flex flex-col gap-3">
      {[...Array(8)].map((_, i) => <Sk key={i} h={64} className="rounded-xl" />)}
    </div>
  );
  if (!entries.length) return (
    <div className="py-20 px-6 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4">
        <Trophy size={28} className="text-muted-foreground" />
      </div>
      <p className="text-base font-display font-bold text-foreground mb-1 mt-2">No rankings available</p>
      <p className="text-sm text-muted-foreground mb-6">Check back later when more data is available.</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-foreground/[0.02] border-b border-border/40">
            {["Rank","Student","Points", ...(showDept ? ["Department","Year","Dept Rank"] : ["Year"])].map(h => (
              <th key={h} className={`p-4 text-left text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap ${["Year","Dept Rank"].includes(h) ? "hidden lg:table-cell" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry: any, i: number) => {
            const me = isMe(entry.studentId);
            return (
              <motion.tr key={entry.studentId ?? i}
                className={`group border-b border-border/30 last:border-0 transition-colors ${me ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-foreground/5'}`}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }}>
                <td className="p-4"><RankCell rank={entry.rank ?? entry.overallRank} isMe={me} /></td>
                <td className="p-4 min-w-[220px]">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold shrink-0 shadow-sm ${me ? 'bg-primary text-primary-foreground' : 'bg-foreground/5 text-foreground'}`}
                         style={!me ? { color: PIE_COLORS[i % 4], backgroundColor: `${PIE_COLORS[i % 4]}15` } : {}}>
                      {getInitials(entry.name)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold truncate m-0 ${me ? 'text-primary' : 'text-foreground'}`}>
                        {entry.name} {me && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-primary-foreground bg-primary uppercase tracking-widest">You</span>}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground truncate m-0 mt-0.5">{entry.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-base font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-rose-500">
                    {(entry.points ?? 0).toLocaleString()}
                  </span>
                </td>
                {showDept && (
                  <td className="p-4 hidden lg:table-cell">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-primary/10 text-primary uppercase tracking-wider">
                      {entry.department}
                    </span>
                  </td>
                )}
                <td className="p-4 text-xs font-mono font-semibold text-muted-foreground hidden lg:table-cell uppercase">
                  {entry.year}
                </td>
                {showDept && (
                  <td className="p-4 text-[11px] font-mono font-bold text-foreground hidden lg:table-cell">
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
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header subtitle="See how you stack up against your peers across the institution." />

      <main className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">

        <MyPositionBanner myPosition={myPosition} loading={isLoadingPosition} />

        <div className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center gap-4 justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex bg-foreground/5 p-1 rounded-xl w-full md:w-auto">
              {[
                { key: "overall", label: "Overall", icon: <Trophy size={14} /> },
                { key: "department", label: departmentName || "Department", icon: <Building2 size={14} /> },
              ].map(({ key, label, icon }) => (
                <button key={key} onClick={() => setActiveView(key as any)} className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeView === key ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  {icon}<span className="truncate max-w-[120px]">{label}</span>
                </button>
              ))}
            </div>

            {activeView === "overall" && (
              <>
                <div className="w-px h-6 bg-border/50 hidden md:block" />
                <div className="flex gap-2 flex-wrap">
                  {years.map(y => <Pill key={y} label={y === "ALL" ? "All Years" : y} active={selectedYear === y} onClick={() => setSelectedYear(y)} />)}
                </div>
              </>
            )}
          </div>

          <div className="relative w-full xl:max-w-[280px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="w-full bg-background border border-border/50 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Search students..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 items-start">
          <div className="w-full">
            {activeTop3.length >= 3 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="h-full">
                <div className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><Crown size={16} className="text-amber-500" /></div>
                    <p className="text-sm font-display font-bold text-foreground">Top 3 Performers</p>
                  </div>
                  <Top3Podium top3={activeTop3} isMe={(id) => !!isMe(id)} />
                </div>
              </motion.div>
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="w-full">
            <div className="bg-card-glass/60 backdrop-blur-xl border border-border/40 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-5 lg:p-6 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BarChart2 size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-display font-bold text-foreground m-0">
                      {activeView === "overall" ? "Overall Leaderboard" : `${departmentName} Leaderboard`}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5 m-0">
                      {activeView === "overall" ? `${pagination.total} students` : `${deptPagination.total} students`}
                    </p>
                  </div>
                </div>
                {currentStudentRanking && (
                  <div className="flex items-center gap-2">
                    {[
                      { label: "Your Overall", val: `#${currentStudentRanking.overallRank}`, color: "text-primary", bg: "bg-primary/10" },
                      { label: "Your Dept",    val: `#${currentStudentRanking.departmentRank}`, color: "text-violet-600", bg: "bg-violet-500/10" },
                    ].map(({ label, val, color, bg }) => (
                      <div key={label} className={`px-4 py-2 rounded-xl flex flex-col items-center justify-center ${bg}`}>
                        <p className="text-[9px] font-mono font-bold text-muted-foreground tracking-[0.15em] uppercase mb-0.5">{label}</p>
                        <p className={`text-lg font-display font-bold leading-none ${color}`}>{val}</p>
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

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button variant="outline" size="sm" onClick={() => activeView === "overall" ? setPage(pagination.skip - pagination.limit) : setDeptPage(deptPagination.skip - deptPagination.limit)} disabled={currentPage === 1} className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 h-9 px-4">
                  <ChevronLeft size={14} /> Prev
                </Button>
                <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => activeView === "overall" ? setPage(pagination.skip + pagination.limit) : setDeptPage(deptPagination.skip + deptPagination.limit)} disabled={currentPage === totalPages} className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 h-9 px-4">
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
