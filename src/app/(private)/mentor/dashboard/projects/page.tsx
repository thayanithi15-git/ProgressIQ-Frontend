'use client';

import React, { useEffect, useState } from 'react';
import { Search, Eye, ExternalLink, X, ArrowUpDown, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useMentorProjectsStore } from '@/store/mentor/projects';
// import { MentorHeader } from '@/components/mentor/header';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200';
  }
};

const ProjectDetailModal = ({ project, onClose, isLoading }: any) => {
  if (!project) return null;

  const { title, description, status, studentsCount, completionRate, createdDate, student, links, feedback } = project;

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl">{title}</DialogTitle>
          <DialogDescription className="font-poppins">{status}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status & Progress */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-poppins">Project Status</h3>
                <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-poppins">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2 font-poppins text-foreground">Description</h4>
              <p className="text-sm text-muted-foreground font-poppins leading-relaxed">
                {description || 'No description provided'}
              </p>
            </div>

            {/* Student Info */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-4 font-poppins text-foreground">Student Information</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-poppins">Name</span>
                  <span className="font-medium font-poppins">{student?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-poppins">Email</span>
                  <span className="font-medium text-sm font-poppins">{student?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-poppins">Department</span>
                  <span className="font-medium font-poppins">{student?.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-poppins">Year</span>
                  <span className="font-medium font-poppins">{student?.year}</span>
                </div>
              </div>
            </div>

            {/* Links */}
            {(links?.github || links?.website) && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 font-poppins text-foreground">Project Links</h4>
                <div className="space-y-2">
                  {links?.github && (
                    <a
                      href={links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-poppins"
                    >
                      <ExternalLink className="w-4 h-4" />
                      GitHub Repository
                    </a>
                  )}
                  {links?.website && (
                    <a
                      href={links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-poppins"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Website
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950 rounded p-4">
                <h4 className="font-semibold mb-2 font-poppins text-amber-900 dark:text-amber-100">Mentor Feedback</h4>
                <p className="text-sm font-poppins text-amber-800 dark:text-amber-200">{feedback}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function MentorProjectsPage() {
  const {
    projects,
    projectDetail,
    searchQuery,
    statusFilter,
    departmentFilter,
    yearFilter,
    sortBy,
    sortOrder,
    page,
    limit,
    total,
    totalPages,
    isLoading,
    isLoadingDetail,
    fetchProjects,
    fetchProjectDetail,
    setSearchQuery,
    setStatusFilter,
    setDepartmentFilter,
    setYearFilter,
    setSortBy,
    setSortOrder,
    setPage,
    resetFilters,
    closeDetail,
  } = useMentorProjectsStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);

  useEffect(() => {
    fetchProjects();
  }, []);

  const hasActiveFilters = searchQuery || statusFilter || departmentFilter || yearFilter;

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
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, description, or student..."
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(tempSearch)}
                    className="pl-10 font-poppins"
                  />
                </div>
                <Button onClick={() => setSearchQuery(tempSearch)} className="gap-2 font-poppins">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="CSE">Computer Science</SelectItem>
                    <SelectItem value="ECE">Electronics</SelectItem>
                    <SelectItem value="ME">Mechanical</SelectItem>
                    <SelectItem value="CE">Civil</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="outline" onClick={resetFilters} className="gap-2 font-poppins">
                    <X className="w-4 h-4" />
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-4"
        >
          <p className="text-sm text-muted-foreground font-poppins">
            Showing {projects.length} of {total} projects
          </p>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <SelectTrigger className="w-40 font-poppins">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-poppins">
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="student">Sort by Student</SelectItem>
                <SelectItem value="status">Sort by Status</SelectItem>
                <SelectItem value="completedAt">Sort by Date</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="gap-2 font-poppins"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </Button>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <Skeleton className="h-2 w-full mb-4" />
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))
          ) : projects.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground font-poppins">No projects found</p>
              </CardContent>
            </Card>
          ) : (
            projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2 font-poppins">{project.title}</CardTitle>
                        <CardDescription className="font-poppins mt-1">
                          by {project.student.name}
                        </CardDescription>
                      </div>
                      <Badge className={`whitespace-nowrap ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground font-poppins line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-poppins text-muted-foreground">Completion</span>
                        <span className="font-semibold font-poppins">{project.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${project.completionRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="border-t pt-4 space-y-2 text-sm">
                      <div className="flex justify-between font-poppins">
                        <span className="text-muted-foreground">Department</span>
                        <span className="font-medium">{project.student.department}</span>
                      </div>
                      <div className="flex justify-between font-poppins">
                        <span className="text-muted-foreground">Year</span>
                        <span className="font-medium">{project.student.year}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => fetchProjectDetail(project.id)}
                      disabled={isLoadingDetail}
                      className="w-full gap-2 font-poppins"
                      variant="outline"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-muted-foreground font-poppins">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="font-poppins"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="font-poppins"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <ProjectDetailModal
        project={projectDetail}
        onClose={closeDetail}
        isLoading={isLoadingDetail}
      />
    </div>
  );
}