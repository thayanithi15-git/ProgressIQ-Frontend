'use client';

import React, { useEffect, useState } from 'react';
import { Search, Eye, ExternalLink, X, Award, Badge as BadgeIcon, ChevronLeft, ChevronRight, Download } from 'lucide-react';
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
import { useMentorCertificationsStore } from '@/store/mentor/certifications';
// import { MentorHeader } from '@/components/mentor/header';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200';
  }
};

const CertificationDetailModal = ({ certification, onClose, isLoading }: any) => {
  if (!certification) return null;

  const { title, platform, platformLink, from, to, status, student, feedback } = certification;

  return (
    <Dialog open={!!certification} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="font-poppins">{platform}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Certificate Info */}
            <div className="bg-muted/40 border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-poppins">Certificate Details</h3>
                <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-poppins">Platform</p>
                  <p className="font-semibold font-poppins">{platform}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-poppins">Date From</p>
                  <p className="font-semibold font-poppins">{new Date(from).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-poppins">Date To</p>
                  <p className="font-semibold font-poppins">{new Date(to).toLocaleDateString()}</p>
                </div>
              </div>
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

            {/* Platform Link */}
            {platformLink && (
            <div className="border rounded-lg p-4 bg-muted/40">
                <a
                  href={platformLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-poppins"
                >
                  <BadgeIcon className="w-4 h-4" />
                  View on Platform
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className="border-l-4 border-blue-500 bg-blue-50/60 dark:bg-blue-950 rounded p-4">
                <h4 className="font-semibold mb-2 font-poppins text-blue-900 dark:text-blue-100">
                  Mentor Notes
                </h4>
                <p className="text-sm font-poppins text-blue-800 dark:text-blue-200">{feedback}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function MentorCertificationsPage() {
  const {
    certifications,
    certificationDetail,
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
    fetchCertifications,
    fetchCertificationDetail,
    setSearchQuery,
    setStatusFilter,
    setDepartmentFilter,
    setYearFilter,
    setSortBy,
    setSortOrder,
    setPage,
    resetFilters,
    closeDetail,
  } = useMentorCertificationsStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);

  useEffect(() => {
    fetchCertifications();
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
        {/* Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="shadow-none">
            <CardContent className="p-6">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, platform, or student..."
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(tempSearch)}
                    className="pl-10 font-poppins"
                  />
                </div>
                <Button
                  onClick={() => setSearchQuery(tempSearch)}
                  className="gap-2 font-poppins"
                >
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
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
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
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="gap-2 font-poppins"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-poppins text-foreground">
                      Certificate
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-poppins text-foreground">
                      Platform
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-poppins text-foreground">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold font-poppins text-foreground">
                      Date Earned
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold font-poppins text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold font-poppins text-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b">
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : certifications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground font-poppins">
                        <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        No certifications found
                      </td>
                    </tr>
                  ) : (
                    certifications.map((cert, idx) => (
                      <motion.tr
                        key={cert.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-600" />
                            <span className="font-medium font-poppins line-clamp-1">
                              {cert.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-poppins text-muted-foreground">
                          {cert.platform}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-sm font-poppins">
                              {cert.student.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-poppins">
                              {cert.student.department}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-poppins">
                          {new Date(cert.to).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge className={`${getStatusColor(cert.status)}`}>
                            {cert.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            onClick={() => fetchCertificationDetail(cert.id)}
                            disabled={isLoadingDetail}
                            variant="ghost"
                            size="sm"
                            className="gap-2 font-poppins"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mt-6"
          >
            <p className="text-sm text-muted-foreground font-poppins">
              Showing {certifications.length} of {total} certifications • Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="gap-2 font-poppins"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="gap-2 font-poppins"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <CertificationDetailModal
        certification={certificationDetail}
        onClose={closeDetail}
        isLoading={isLoadingDetail}
      />
    </div>
  );
}
