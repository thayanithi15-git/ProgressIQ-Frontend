'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  BarChart3, Users, TrendingUp, Activity, FileText, Settings, LogOut, Menu, X, Moon, Sun,
  Users2, BookOpen, Award, Zap, Lock, Database
} from "lucide-react";
import { useThemeStore } from "@/store/layoutStore";
import Link from "next/link";

export default function AdminDashboard() {
  const { isDark, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''} font-poppins bg-background text-foreground`}>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed top-0 left-0 h-screen w-64 bg-card border-r border-border p-6 transition-all ${!sidebarOpen && 'hidden'}`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg">Progress IQ</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 rounded-lg bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2 mb-8">
          {[
            { icon: Activity, label: "Dashboard", active: true },
            { icon: Users, label: "Students" },
            { icon: Users2, label: "Mentors" },
            { icon: BookOpen, label: "Projects & Tasks" },
            { icon: Award, label: "Rankings" },
            { icon: FileText, label: "Reports" },
            { icon: Lock, label: "Logs & Audit" },
            { icon: Database, label: "Database" },
          ].map((item, idx) => (
            <Link
              key={idx}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-primary/20 text-primary font-semibold' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border pt-4">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <nav className="sticky top-0 z-40 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg bg-muted">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-muted hover:bg-primary/20 transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Total Students", value: "2,450", change: "+12%" },
              { icon: Users2, label: "Total Mentors", value: "85", change: "+5%" },
              { icon: Activity, label: "Active Users", value: "1,890", change: "+23%" },
              { icon: Award, label: "Institutions", value: "50", change: "+8%" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-primary/20 rounded-lg">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-green-500/20 text-green-700">{stat.change}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts and Tables */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Top Students */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Top 5 Students
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Aman Kumar", points: 950, rank: 1 },
                    { name: "Priya Singh", points: 920, rank: 2 },
                    { name: "Rohan Patel", points: 890, rank: 3 },
                    { name: "Divya Sharma", points: 860, rank: 4 },
                    { name: "Arjun Verma", points: 820, rank: 5 },
                  ].map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-4 border-b last:border-0">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground text-sm">{student.name}</p>
                        <p className="text-muted-foreground text-xs">Rank #{student.rank}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{student.points}</p>
                        <p className="text-muted-foreground text-xs">Points</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Completion Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-secondary" />
                    Completion Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { label: "Projects", value: 78 },
                    { label: "Tasks", value: 65 },
                    { label: "Certifications", value: 92 },
                    { label: "Internships", value: 54 },
                  ].map((metric, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{metric.label}</span>
                        <span className="text-primary font-bold">{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-accent" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-muted text-foreground hover:bg-primary/20">
                    <Users className="w-4 h-4 mr-2" />
                    Add New Student
                  </Button>
                  <Button className="w-full justify-start bg-muted text-foreground hover:bg-primary/20">
                    <Users2 className="w-4 h-4 mr-2" />
                    Add New Mentor
                  </Button>
                  <Button className="w-full justify-start bg-muted text-foreground hover:bg-primary/20">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button className="w-full justify-start bg-muted text-foreground hover:bg-primary/20">
                    <Lock className="w-4 h-4 mr-2" />
                    View Audit Logs
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Student Aman Kumar completed project", time: "2 hours ago", type: "project" },
                    { action: "Mentor Priya verified 3 certifications", time: "4 hours ago", type: "verify" },
                    { action: "New student registration by Admin", time: "6 hours ago", type: "student" },
                    { action: "Report generated for Q1 2026", time: "1 day ago", type: "report" },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'project' ? 'bg-primary/20' :
                        activity.type === 'verify' ? 'bg-secondary/20' :
                        activity.type === 'student' ? 'bg-accent/20' :
                        'bg-muted'
                      }`}>
                        {activity.type === 'project' && <BookOpen className="w-5 h-5 text-primary" />}
                        {activity.type === 'verify' && <TrendingUp className="w-5 h-5 text-secondary" />}
                        {activity.type === 'student' && <Users className="w-5 h-5 text-accent" />}
                        {activity.type === 'report' && <FileText className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{activity.action}</p>
                        <p className="text-muted-foreground text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}