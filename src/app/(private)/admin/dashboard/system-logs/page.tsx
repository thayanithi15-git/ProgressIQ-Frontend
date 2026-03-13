"use client";

import React, { useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSystemLogStore } from "@/store/admin/systemLogStore";
import { Activity, ShieldAlert, Cpu, UserCheck, Shield, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/header";

export default function SystemLogsPage() {
  const {
    logs,
    total,
    currentPage,
    totalPages,
    isLoading,
    filters,
    fetchLogs,
    setFilters,
  } = useSystemLogStore();

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handleRoleFilter = (value: string) => {
    setFilters({ role: value });
  };

  const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    Admin:   { bg: "bg-red-50",   text: "text-red-700",   border: "border-red-200" },
    Mentor:  { bg: "bg-blue-50",  text: "text-blue-700",  border: "border-blue-200" },
    Student: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  };

  const statCards = [
    {
      label: "Total Logs Stored",
      value: total,
      icon: Database,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      gradient: "from-blue-50 to-background",
    },
    {
      label: "Max Capacity",
      value: 50,
      icon: ShieldAlert,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      gradient: "from-amber-50 to-background",
    },
    {
      label: "Active Filter",
      value: filters.role && filters.role !== "all" ? filters.role : "All Roles",
      icon: filters.role === "Admin" ? Shield : UserCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      gradient: "from-green-50 to-background",
    },
  ];

  return (
    <div className="font-[Poppins,sans-serif] min-h-screen bg-background">
      {/* App Header */}
      <Header
        title="System Logs"
        subtitle="Admin · Audit Trail"
      />

      <div className="px-6 py-6 w-full mx-auto space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className={`border border-border/60 shadow-sm bg-gradient-to-br ${card.gradient}`}>
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      {card.label}
                    </p>
                    <p className="text-xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Table Card */}
        <Card className="border border-border shadow-sm overflow-hidden">
          {/* Card Subheader with filter */}
          <div className="px-5 py-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-md font-bold text-foreground tracking-wide font-poppins">Login Activity</h2>
              <p className="text-sm text-muted-foreground mt-0.5 font-poppins">Most recent logins across all roles. Auto-trims to 50 logs.</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={filters.role || "all"} onValueChange={handleRoleFilter}>
                <SelectTrigger className="w-[160px] h-9 bg-background font-[Poppins,sans-serif] text-sm">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Mentor">Mentor</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 text-sm font-medium"
                onClick={() => fetchLogs(currentPage)}
                disabled={isLoading}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[40px]">S.No</TableHead>
                  <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[200px]">Timestamp</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</TableHead>
                  <TableHead className="pr-6 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6"><Skeleton className="h-4 w-[30px]" /></TableCell>
                      <TableCell className="pl-6"><Skeleton className="h-4 w-[160px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                      <TableCell className="pr-6 flex justify-end"><Skeleton className="h-6 w-[60px]" /></TableCell>
                    </TableRow>
                  ))
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Activity className="h-8 w-8 opacity-30" />
                        <p className="text-sm font-medium">No logs found</p>
                        <p className="text-xs">Logs appear here when users sign in.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {logs.map((log, idx) => {
                      const roleStyle = roleColors[log.role] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
                      return (
                        <motion.tr
                          key={log._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="border-b py-3 border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <TableCell className="pl-6 py-6 text-sm font-medium text-foreground/80 tabular-nums">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="pl-6 py-6 text-sm font-medium text-foreground/80 tabular-nums">
                            {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm:ss")}
                          </TableCell>
                          <TableCell className="font-semibold text-foreground text-sm">{log.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{log.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`px-2.5 py-0.5 text-[11px] font-bold border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                            >
                              {log.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                              <Activity className="h-3 w-3" />
                              {log.action}
                            </span>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </CardContent>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/10">
              <p className="text-xs text-muted-foreground">
                Showing page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
                <span className="font-semibold text-foreground">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => fetchLogs(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => fetchLogs(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
