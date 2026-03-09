'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, Eye, AlertCircle, Calendar, X, CheckCircle, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Skeleton } from '@/components/ui/skeleton';
import { useMentorTasksStore } from '@/store/mentor/tasks';
import { useAssignedStudentsStore } from '@/store/mentor/assignedStudents';
// import { MentorHeader } from '@/components/mentor/header';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950';
    case 'medium':
      return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950';
    case 'low':
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950';
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950';
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'done':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
    case 'in progress':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
    case 'to do':
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200';
  }
};

const CreateTaskModal = ({ open, onClose, onCreate, isSubmitting, students }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!title.trim() || !dueDate.trim() || selectedStudents.length === 0) {
      alert('Please fill in all fields and select at least one student');
      return;
    }

    await onCreate(title, description, dueDate, selectedStudents);
    setTitle('');
    setDescription('');
    setDueDate('');
    setSelectedStudents([]);
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-poppins">Create New Task</DialogTitle>
          <DialogDescription className="font-poppins">
            Assign a task to one or more students
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="font-poppins">Task Title</Label>
            <Input
              id="title"
              placeholder="e.g., Build login authentication"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 font-poppins"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="font-poppins">Description</Label>
            <Textarea
              id="description"
              placeholder="Task details and requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 font-poppins"
            />
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="dueDate" className="font-poppins">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-2 font-poppins"
            />
          </div>

          {/* Student Selection */}
          <div>
            <Label className="font-poppins mb-3 block">Assign to Students</Label>
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              {students.slice(0, 10).map((student: any) => (
                <label
                  key={student.id}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer font-poppins"
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    className="w-4 h-4 rounded"
                  />
                  <span>{student.firstName} {student.lastName}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {student.department}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-poppins">
              {selectedStudents.length} student(s) selected
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="font-poppins">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="font-poppins">
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function MentorTasksPage() {
  const taskStore = useMentorTasksStore();
  const studentStore = useAssignedStudentsStore();

  const {
    tasks,
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
    isSubmitting,
    fetchTasks,
    setSearchQuery,
    setStatusFilter,
    setDepartmentFilter,
    setYearFilter,
    setSortBy,
    setSortOrder,
    setPage,
    resetFilters,
    createTask,
  } = taskStore;

  const { students } = studentStore;

  const [tempSearch, setTempSearch] = useState(searchQuery);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    studentStore.fetchStudents();
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
                    placeholder="Search tasks..."
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
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
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

        {/* Tasks List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : tasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground font-poppins">No tasks found</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task, idx) => {
              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-300 dark:border-red-800' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold font-poppins text-foreground">{task.title}</h3>
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            {task.priority && (
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 font-poppins">
                            Assigned to: <span className="font-medium text-foreground">{task.assignedTo}</span>
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground font-poppins">Department</p>
                              <p className="font-medium font-poppins">{task.student.department}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-poppins">Year</p>
                              <p className="font-medium font-poppins">{task.student.year}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-poppins">Due Date</p>
                              <p className="font-medium font-poppins flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-poppins">Status</p>
                              <p className="font-medium font-poppins">{task.priority}</p>
                            </div>
                          </div>

                          {isOverdue && (
                            <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400 font-poppins text-sm">
                              <AlertCircle className="w-4 h-4" />
                              Overdue
                            </div>
                          )}
                        </div>

                        <Button variant="ghost" size="sm" className="font-poppins">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        onCreate={createTask}
        isSubmitting={isSubmitting}
        students={students}
      />
    </div>
  );
}