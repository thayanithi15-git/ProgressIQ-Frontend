'use client';

import React, { useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, CheckCircle2, FileText, Briefcase, Award, TrendingUp, Zap, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMentorDashboardStore } from '@/store/mentor/dashboard';
// import { Header } from '@/components/layout/header';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';

const StatCard = ({ icon: Icon, label, value, subtext, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-gradient-to-br hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-muted-foreground font-medium font-poppins">{label}</p>
            <p className={`text-3xl font-bold font-poppins`} style={{ background: color, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {value !== null ? value?.toLocaleString() : '—'}
            </p>
            <p className="text-xs text-muted-foreground font-poppins">{subtext}</p>
          </div>
          <Icon className="w-6 h-6 opacity-50" />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function MentorDashboard() {
  const {
    stats,
    topStudents,
    activityData,
    pointsTrendData,
    workProgressData,
    isLoadingStats,
    isLoadingCharts,
    fetchAllData,
    refreshDashboard,
  } = useMentorDashboardStore();

  useEffect(() => {
    fetchAllData();
  }, []);

  const isLoading = isLoadingStats || isLoadingCharts;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
          
        title="Mentor Dashboard"
        subtitle="Monitor your mentorship progress and student activities"
          HeaderComp={
            <div style={{ display: "flex", gap: 10 }}>
              <Button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, background: "var(--primary)", color: "var(--primary-foreground)" }}>
                <Download size={14} />
                Export
              </Button>
            </div>
          }
        />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={Users}
            label="Assigned Students"
            value={stats?.totalAssignedStudents}
            subtext="Under your mentorship"
            color="linear-gradient(to right, #3B82F6, #2563EB)"
          />
          <StatCard
            icon={CheckCircle2}
            label="Active Students"
            value={stats?.activeStudents}
            subtext="Currently active"
            color="linear-gradient(to right, #10B981, #059669)"
          />
          <StatCard
            icon={FileText}
            label="Pending Reviews"
            value={stats?.pendingApprovals}
            subtext="Awaiting approval"
            color="linear-gradient(to right, #F59E0B, #D97706)"
          />
          <StatCard
            icon={TrendingUp}
            label="Completed Projects"
            value={stats?.completedProjects}
            subtext="Successfully submitted"
            color="linear-gradient(to right, #8B5CF6, #7C3AED)"
          />
        </motion.div>

        {/* Module Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Projects', icon: FileText, value: stats?.totalProjects },
            { label: 'Tasks', icon: CheckCircle2, value: stats?.totalTasks },
            { label: 'Internships', icon: Briefcase, value: stats?.totalInternships },
            { label: 'Certifications', icon: Award, value: stats?.totalCertifications },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium font-poppins flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold font-poppins">{item.value || 0}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Approval Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins">Approval Activity</CardTitle>
              <CardDescription className="font-poppins">Last 30 days approval trends</CardDescription>
            </CardHeader>
            <CardContent>
              {activityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" fill="#10b981" name="Approved" />
                    <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                    <Bar dataKey="feedback" fill="#f59e0b" name="Feedback" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground font-poppins">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Points Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins">Points Awarded</CardTitle>
              <CardDescription className="font-poppins">Monthly points distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {pointsTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={pointsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="points"
                      stroke="#3b82f6"
                      name="Points"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="awards"
                      stroke="#8b5cf6"
                      name="Awards"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground font-poppins">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Work Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins">Work Progress (Monthly)</CardTitle>
              <CardDescription className="font-poppins">Submissions by type over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              {workProgressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={workProgressData}>
                    <defs>
                      <linearGradient id="colorProject" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorTask" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorInternship" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCert" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="project"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="url(#colorProject)"
                      name="Projects"
                    />
                    <Area
                      type="monotone"
                      dataKey="task"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="url(#colorTask)"
                      name="Tasks"
                    />
                    <Area
                      type="monotone"
                      dataKey="internship"
                      stackId="1"
                      stroke="#10b981"
                      fill="url(#colorInternship)"
                      name="Internships"
                    />
                    <Area
                      type="monotone"
                      dataKey="certification"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="url(#colorCert)"
                      name="Certifications"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center text-muted-foreground font-poppins">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins">Top Performing Students</CardTitle>
              <CardDescription className="font-poppins">Your highest-scoring students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStudents.slice(0, 5).map((student, idx) => (
                  <motion.div
                    key={student.studentId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold font-poppins">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold font-poppins">{student.name}</p>
                        <p className="text-sm text-muted-foreground font-poppins">
                          {student.department} • {student.year}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-primary font-poppins">
                      {student.points.toLocaleString()} pts
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}