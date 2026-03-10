'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Eye,
  Trash2,
  X,
  MessageCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useSurveysStore } from '@/store/mentor/survey';
// import { MentorHeader } from '@/components/mentor/header';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
};

const CreateSurveyModal = ({ open, onClose, onCreate, isSubmitting }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(['', '']);

  const handleSubmit = async () => {
    const validQuestions = questions.filter((q) => q.trim());
    if (!title.trim() || validQuestions.length === 0) {
      alert('Please fill in title and add at least one question');
      return;
    }

    await onCreate(title, description, validQuestions);
    setTitle('');
    setDescription('');
    setQuestions(['', '']);
    onClose();
  };

  const addQuestion = () => setQuestions([...questions, '']);
  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            Create New Survey
          </DialogTitle>
          <DialogDescription className="font-poppins">
            Create a survey to gather feedback from your students
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="survey-title" className="font-poppins font-semibold mb-2 block">
              Survey Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="survey-title"
              placeholder="e.g., Mentorship Program Feedback"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-poppins"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="survey-desc" className="font-poppins font-semibold mb-2 block">
              Description
            </Label>
            <Textarea
              id="survey-desc"
              placeholder="Optional survey description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="font-poppins min-h-[80px]"
            />
          </div>

          {/* Questions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="font-poppins font-semibold">
                Questions <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="gap-2 font-poppins"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            <div className="space-y-3">
              {questions.map((question, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-2 items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-muted-foreground font-poppins">
                        Q{idx + 1}
                      </span>
                    </div>
                    <Input
                      placeholder={`Question ${idx + 1}`}
                      value={question}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[idx] = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      className="font-poppins"
                    />
                  </div>
                  {questions.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(idx)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 mt-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-poppins">
              {questions.filter((q) => q.trim()).length} valid question(s)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="font-poppins">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="font-poppins bg-blue-600 hover:bg-blue-700"
          >
            Create Survey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ResponsesModal = ({ surveyDetail, onClose, isLoading }: any) => {
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  if (!surveyDetail) return null;

  const { survey, responses } = surveyDetail;

  const filteredResponses = responses.filter((r: any) => {
    if (departmentFilter && r.student.department !== departmentFilter) return false;
    if (yearFilter && r.student.year !== yearFilter) return false;
    return true;
  });

  return (
    <Dialog open={!!surveyDetail} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            {survey.title}
          </DialogTitle>
          <DialogDescription className="font-poppins">
            {responses.length} response{responses.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="font-poppins">
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent className="font-poppins">
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="font-poppins">
              <SelectValue placeholder="Filter by Year" />
            </SelectTrigger>
            <SelectContent className="font-poppins">
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="1st">1st Year</SelectItem>
              <SelectItem value="2nd">2nd Year</SelectItem>
              <SelectItem value="3rd">3rd Year</SelectItem>
              <SelectItem value="4th">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Responses */}
        <div className="space-y-4 mt-4">
          {filteredResponses.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground font-poppins">No responses found</p>
              </CardContent>
            </Card>
          ) : (
            filteredResponses.map((response: any, idx: number) => (
              <motion.div
                key={response.responseId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-poppins">
                          {response.student.name}
                        </CardTitle>
                        <CardDescription className="font-poppins text-xs mt-1">
                          {response.student.department} • Year {response.student.year} •{' '}
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="font-poppins">
                        {response.student.department}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {response.answers.map((answer: any, aIdx: number) => (
                      <div
                        key={aIdx}
                        className="border-l-4 border-blue-500 pl-4 py-2"
                      >
                        <p className="font-semibold text-sm text-blue-600 dark:text-blue-400 mb-2 font-poppins">
                          Q{aIdx + 1}: {answer.question}
                        </p>
                        <p className="text-sm text-foreground font-poppins">
                          {answer.answer || (
                            <span className="italic text-muted-foreground">No answer provided</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function MentorSurveysPage() {
  const {
    surveys,
    surveyDetail,
    searchQuery,
    statusFilter,
    page,
    totalPages,
    isLoading,
    isLoadingDetail,
    isSubmitting,
    fetchSurveys,
    fetchSurveyResponses,
    createSurvey,
    setSearchQuery,
    setStatusFilter,
    setPage,
    resetFilters,
    closeSurveyDetail,
  } = useSurveysStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const hasActiveFilters = searchQuery || statusFilter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <Header
        title="Mentor Dashboard"
        subtitle="Monitor your mentorship progress and student activities"
        HeaderComp={
          <div style={{ display: "flex", gap: 10 }}>

            {/* Create Survey Button */}
            <Button
              onClick={() => setCreateOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13
              }}
            >
              <Plus size={14} />
              Create Survey
            </Button>

            {/* Export Button */}
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                background: "var(--primary)",
                color: "var(--primary-foreground)"
              }}
            >
              <Download size={14} />
              Export
            </Button>

          </div>
        }
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search surveys..."
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
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
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

        {/* Surveys Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-3 w-full mb-3" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : surveys.length === 0 ? (
            <Card className="col-span-full border-0 shadow-sm">
              <CardContent className="py-12 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground font-poppins">No surveys found</p>
                <p className="text-xs text-muted-foreground mt-2 font-poppins">
                  Create your first survey to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            surveys.map((survey, idx) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="line-clamp-2 text-base font-poppins">
                        {survey.title}
                      </CardTitle>
                      <Badge className={`${getStatusColor(survey.status)} whitespace-nowrap`}>
                        {survey.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground font-poppins line-clamp-2">
                      {survey.description || 'No description provided'}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-3">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-poppins">
                          {survey.questions.length}
                        </p>
                        <p className="text-xs text-muted-foreground font-poppins">
                          Question{survey.questions.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg p-3">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 font-poppins">
                          {survey.respondents}
                        </p>
                        <p className="text-xs text-muted-foreground font-poppins">
                          Response{survey.respondents !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        onClick={() => fetchSurveyResponses(survey.id)}
                        disabled={isLoadingDetail}
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 font-poppins"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Responses</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 font-poppins"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
            transition={{ delay: 0.2 }}
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

      {/* Create Survey Modal */}
      <CreateSurveyModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createSurvey}
        isSubmitting={isSubmitting}
      />

      {/* Responses Modal */}
      <ResponsesModal
        surveyDetail={surveyDetail}
        onClose={closeSurveyDetail}
        isLoading={isLoadingDetail}
      />
    </div>
  );
}