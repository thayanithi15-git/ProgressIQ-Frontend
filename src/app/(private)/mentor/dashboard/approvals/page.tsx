'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  MessageSquare,
  Award,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Clock, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApprovalsStore } from '@/store/mentor/approval';
// import { MentorHeader } from '@/components/mentor/header';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200';
  }
};

const getEntityTypeColor = (type: string) => {
  switch (type?.toUpperCase()) {
    case 'PROJECT':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'TASK':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'INTERNSHIP':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    case 'CERTIFICATION':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

const ReviewModal = ({ submission, onClose, onApprove, isSubmitting }: any) => {
  const [pointType, setPointType] = useState('basic');
  const [customPoints, setCustomPoints] = useState('');
  const [feedback, setFeedback] = useState('');

  if (!submission) return null;

  const pointOptions: Record<string, number> = {
    basic: 10,
    intermediate: 20,
    premium: 50,
    issue: -10,
  };

  const handleApprove = () => {
    const points =
      pointType === 'manual' ? parseInt(customPoints) || 0 : pointOptions[pointType];
    onApprove(submission.id, submission.entityType, 'Approved', points, feedback);
    setPointType('basic');
    setCustomPoints('');
    setFeedback('');
  };

  const handleReject = () => {
    onApprove(submission.id, submission.entityType, 'Rejected', 0, feedback);
    setFeedback('');
  };

  return (
    <Dialog open={!!submission} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            Review Submission
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Submission Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold font-poppins">
                  {submission.entityTitle}
                </h3>
                <Badge className={`${getEntityTypeColor(submission.entityType)} mt-2`}>
                  {submission.entityType}
                </Badge>
              </div>
              <Badge className={`${getStatusColor(submission.status)}`}>
                {submission.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1 font-poppins">Student</p>
                <p className="font-semibold font-poppins">{submission.studentName}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 font-poppins">Submitted</p>
                <p className="font-semibold font-poppins">
                  {new Date(submission.submittedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <Label htmlFor="feedback" className="font-poppins font-semibold text-base mb-2 block">
              Mentor Feedback
            </Label>
            <Textarea
              id="feedback"
              placeholder="Provide constructive feedback to the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="font-poppins min-h-[120px]"
            />
          </div>

          {/* Point Assignment */}
          <div>
            <Label className="font-poppins font-semibold text-base mb-4 block">
              Award Points
            </Label>
            <RadioGroup value={pointType} onValueChange={setPointType}>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="basic" id="basic" className="font-poppins" />
                  <Label htmlFor="basic" className="flex-1 cursor-pointer font-poppins">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Basic Award</span>
                      <Badge variant="secondary" className="font-poppins">
                        10 pts
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      For standard submissions
                    </p>
                  </Label>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem
                    value="intermediate"
                    id="intermediate"
                    className="font-poppins"
                  />
                  <Label htmlFor="intermediate" className="flex-1 cursor-pointer font-poppins">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Intermediate Award</span>
                      <Badge
                        className="bg-blue-600 hover:bg-blue-700 font-poppins"
                      >
                        20 pts
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      For above-average work
                    </p>
                  </Label>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="premium" id="premium" className="font-poppins" />
                  <Label htmlFor="premium" className="flex-1 cursor-pointer font-poppins">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Premium Award</span>
                      <Badge className="bg-green-600 hover:bg-green-700 font-poppins">
                        50 pts
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      For outstanding work
                    </p>
                  </Label>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="issue" id="issue" className="font-poppins" />
                  <Label htmlFor="issue" className="flex-1 cursor-pointer font-poppins">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Issue / Misbehavior</span>
                      <Badge className="bg-red-600 hover:bg-red-700 font-poppins">
                        -10 pts
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      For issues or policy violations
                    </p>
                  </Label>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="manual" id="manual" className="font-poppins" />
                  <Label htmlFor="manual" className="flex-1 cursor-pointer font-poppins">
                    <span className="font-semibold">Custom Points</span>
                    <Input
                      type="number"
                      placeholder="Enter points"
                      value={customPoints}
                      onChange={(e) => setCustomPoints(e.target.value)}
                      className="mt-2 font-poppins"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPointType('manual');
                      }}
                    />
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isSubmitting}
            className="gap-2 font-poppins"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="gap-2 font-poppins bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function MentorApprovalsPage() {
  const {
    submissions,
    submissionDetail,
    stats,
    searchQuery,
    statusFilter,
    entityTypeFilter,
    page,
    totalPages,
    isLoading,
    isLoadingDetail,
    isSubmitting,
    fetchSubmissions,
    fetchSubmissionDetail,
    setSearchQuery,
    setStatusFilter,
    setEntityTypeFilter,
    setPage,
    resetFilters,
    closeDetail,
    updateApproval,
  } = useApprovalsStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const hasActiveFilters = searchQuery || statusFilter || entityTypeFilter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
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
        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          >
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-poppins">
                    {stats.total}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-poppins">Total</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 font-poppins">
                    {stats.pending}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-poppins">Pending</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 font-poppins">
                    {stats.approved}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-poppins">Approved</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400 font-poppins">
                    {stats.rejected}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-poppins">Rejected</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-muted-foreground font-poppins mb-2">
                      By Type
                    </p>
                    <div className="text-xs space-y-1 font-poppins">
                      <p>
                        <span className="font-bold text-blue-600">{stats.byType.project}</span> P
                      </p>
                      <p>
                        <span className="font-bold text-purple-600">{stats.byType.task}</span> T
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search submissions..."
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(tempSearch)}
                    className="pl-10 font-poppins"
                  />
                </div>
                <Button
                  onClick={() => setSearchQuery(tempSearch)}
                  className="gap-2 font-poppins bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="PROJECT">Projects</SelectItem>
                    <SelectItem value="TASK">Tasks</SelectItem>
                    <SelectItem value="INTERNSHIP">Internships</SelectItem>
                    <SelectItem value="CERTIFICATION">Certifications</SelectItem>
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

        {/* Submissions List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : submissions.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground font-poppins">No submissions found</p>
              </CardContent>
            </Card>
          ) : (
            submissions.map((submission, idx) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <Card
                  className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-l-4"
                  onClick={() => fetchSubmissionDetail(submission.entityType, submission.entityId)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold font-poppins text-foreground flex-1">
                            {submission.entityTitle}
                          </h3>
                          <Badge className={`${getStatusColor(submission.status)}`}>
                            {submission.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 font-poppins">
                          <span className="font-medium text-foreground">{submission.studentName}</span>{' '}
                          • Submitted{' '}
                          {new Date(submission.submittedDate).toLocaleDateString()}
                        </p>

                        <Badge
                          className={`${getEntityTypeColor(submission.entityType)}`}
                        >
                          {submission.entityType}
                        </Badge>
                      </div>

                      {submission.status === 'Pending' && (
                        <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      )}
                      {submission.status === 'Approved' && (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                      {submission.status === 'Rejected' && (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mt-6"
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

      {/* Review Modal */}
      <ReviewModal
        submission={submissionDetail}
        onClose={closeDetail}
        onApprove={updateApproval}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}