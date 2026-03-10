'use client';

import React, { useEffect, useState } from 'react';
import { Search, Eye, ExternalLink, X, DollarSign, Building2, Calendar, Download } from 'lucide-react';
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
import { useMentorInternshipsStore } from '@/store/mentor/internships';
// import { MentorHeader } from '@/components/mentor/header';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';

const getTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'remote':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200';
    case 'on-site':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
    case 'hybrid':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200';
  }
};

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

const getPaidColor = (paid: boolean) =>
  paid
    ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200'
    : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-200';

const InternshipDetailModal = ({ internship, onClose, isLoading }: any) => {
  if (!internship) return null;

  const {
    companyName,
    companyUrl,
    role,
    type,
    paid,
    from,
    to,
    description,
    status,
    student,
    feedback,
  } = internship;

  const duration = Math.ceil(
    (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={!!internship} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl">{companyName}</DialogTitle>
          <DialogDescription className="font-poppins">{role}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status & Details */}
            <div className="bg-muted/40 border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-poppins">Internship Details</h3>
                <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-poppins">Type</p>
                  <Badge className={`${getTypeColor(type)}`}>{type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-poppins">Compensation</p>
                  <p className="font-semibold font-poppins flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {paid ? 'Paid' : 'Unpaid'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-poppins">Duration</p>
                  <p className="font-semibold font-poppins">{duration} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-poppins">Start Date</p>
                  <p className="font-semibold font-poppins">{new Date(from).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-poppins">End Date</p>
                  <p className="font-semibold font-poppins">{new Date(to).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div>
                <h4 className="font-semibold mb-2 font-poppins text-foreground">Description</h4>
                <p className="text-sm text-muted-foreground font-poppins leading-relaxed">
                  {description}
                </p>
              </div>
            )}

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

            {/* Company Link */}
            {companyUrl && (
            <div className="border rounded-lg p-4 bg-muted/40">
              <a
                href={companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-poppins"
                >
                  <Building2 className="w-4 h-4" />
                  Visit Company Website
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className="border-l-4 border-amber-500 bg-amber-50/60 dark:bg-amber-950 rounded p-4">
                <h4 className="font-semibold mb-2 font-poppins text-amber-900 dark:text-amber-100">
                  Mentor Feedback
                </h4>
                <p className="text-sm font-poppins text-amber-800 dark:text-amber-200">{feedback}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function MentorInternshipsPage() {
  const {
    internships,
    internshipDetail,
    searchQuery,
    statusFilter,
    typeFilter,
    paidFilter,
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
    fetchInternships,
    fetchInternshipDetail,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    setPaidFilter,
    setDepartmentFilter,
    setYearFilter,
    setSortBy,
    setSortOrder,
    setPage,
    resetFilters,
    closeDetail,
  } = useMentorInternshipsStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);

  useEffect(() => {
    fetchInternships();
  }, []);

  const hasActiveFilters =
    searchQuery || statusFilter || typeFilter || paidFilter || departmentFilter || yearFilter;

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
                    placeholder="Search by company or role..."
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

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={paidFilter} onValueChange={setPaidFilter}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Paid</SelectItem>
                    <SelectItem value="false">Unpaid</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Depts</SelectItem>
                    <SelectItem value="CSE">Computer Science</SelectItem>
                    <SelectItem value="ECE">Electronics</SelectItem>
                    <SelectItem value="ME">Mechanical</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Years</SelectItem>
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

        {/* Internships Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-none">
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : internships.length === 0 ? (
            <Card className="col-span-full shadow-none">
              <CardContent className="py-12 text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground font-poppins">No internships found</p>
              </CardContent>
            </Card>
          ) : (
            internships.map((internship, idx) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full transition-all duration-300 shadow-none border hover:border-primary/30 group cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <CardTitle className="line-clamp-2 text-base font-poppins">
                            {internship.companyName}
                          </CardTitle>
                        </div>
                        <CardDescription className="font-poppins text-xs">
                          {internship.role}
                        </CardDescription>
                      </div>
                      <Badge className={`whitespace-nowrap ${getStatusColor(internship.status)}`}>
                        {internship.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Type & Payment */}
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={`${getTypeColor(internship.type)}`}>
                        {internship.type}
                      </Badge>
                      <Badge className={`${getPaidColor(internship.paid)} font-poppins`}>
                        <DollarSign className="w-3 h-3 mr-1" />
                        {internship.paid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </div>

                    {/* Dates */}
                    <div className="space-y-1 text-sm font-poppins text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(internship.from).toLocaleDateString()} to{' '}
                        {new Date(internship.to).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Description Preview */}
                    {internship.description && (
                      <p className="text-xs text-muted-foreground font-poppins line-clamp-2">
                        {internship.description}
                      </p>
                    )}

                    {/* Student Info */}
                    <div className="border-t pt-4 space-y-2 text-xs">
                      <div className="flex justify-between font-poppins">
                        <span className="text-muted-foreground">Student</span>
                        <span className="font-semibold">{internship.student.name}</span>
                      </div>
                      <div className="flex justify-between font-poppins">
                        <span className="text-muted-foreground">Department</span>
                        <span className="font-semibold">{internship.student.department}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => fetchInternshipDetail(internship.id)}
                      disabled={isLoadingDetail}
                      className="w-full gap-2 font-poppins mt-2"
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
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-muted-foreground font-poppins">
              Showing {internships.length} of {total} internships • Page {page} of {totalPages}
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
      <InternshipDetailModal
        internship={internshipDetail}
        onClose={closeDetail}
        isLoading={isLoadingDetail}
      />
    </div>
  );
}
