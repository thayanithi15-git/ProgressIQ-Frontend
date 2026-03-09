"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clipboard, Plus, Send } from "lucide-react";
import GlobalNotification from "@/components/notify/notification";
import api from "@/utils/api";
import { useNotificationStore } from "@/utils/notification";

interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: string[];
  createdDate: string;
  respondents: number;
  status: "Active" | "Closed";
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [""],
  });

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/mentors/surveys");
      setSurveys(response.data.data || []);
    } catch (error: any) {
      useNotificationStore.setState({
        notification: {
          message: error.response?.data?.message || "Failed to fetch surveys",
          type: "error",
        },
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleCreateSurvey = async () => {
    try {
      await api.post("/api/mentors/surveys", {
        title: formData.title,
        description: formData.description,
        questions: formData.questions.filter((q) => q.trim()),
      });
      useNotificationStore.setState({
        notification: {
          message: "Survey created successfully",
          type: "success",
        },
      });
      setIsDialogOpen(false);
      setFormData({ title: "", description: "", questions: [""] });
      await fetchSurveys();
    } catch (error: any) {
      useNotificationStore.setState({
        notification: {
          message: error.response?.data?.message || "Failed to create survey",
          type: "error",
        },
      });
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, ""],
    });
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <GlobalNotification />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Surveys</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage student feedback surveys
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Survey
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Survey</DialogTitle>
                <DialogDescription>
                  Design a survey to collect student feedback
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Survey Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Internship Feedback"
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Optional description for the survey"
                    className="mt-2"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Questions
                  </label>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {formData.questions.map((question, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={question}
                          onChange={(e) =>
                            updateQuestion(index, e.target.value)
                          }
                          placeholder={`Question ${index + 1}`}
                        />
                        {formData.questions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addQuestion}
                    className="mt-3 w-full"
                  >
                    + Add Question
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleCreateSurvey}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Create Survey
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Surveys Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Surveys</CardTitle>
            <CardDescription>
              Total: {surveys.length} surveys
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : surveys.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Respondents</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveys.map((survey) => (
                      <TableRow key={survey.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {survey.title}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {survey.description || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {survey.questions.length}
                        </TableCell>
                        <TableCell className="text-center">
                          {survey.respondents}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              survey.status === "Active" ? "default" : "outline"
                            }
                            className={
                              survey.status === "Active"
                                ? "bg-green-500"
                                : ""
                            }
                          >
                            {survey.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(survey.createdDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clipboard className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground">No surveys created yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
