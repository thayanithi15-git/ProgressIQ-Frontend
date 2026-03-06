"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
import { Send, Clipboard } from "lucide-react";
import { useStudentDashboardStore } from "@/store/student/dashboard";
import GlobalNotification from "@/components/notify/notification";

export default function SurveysPage() {
  const {
    surveys,
    surveysLoading,
    fetchSurveys,
    respondToSurvey,
  } = useStudentDashboardStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleSurveyOpen = (survey: any) => {
    setSelectedSurvey(survey);
    setAnswers({});
  };

  const handleSubmitSurvey = async () => {
    if (selectedSurvey) {
      const answersList = Object.keys(answers)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((key) => answers[parseInt(key)]);

      await respondToSurvey(selectedSurvey.id, answersList);
      setIsDialogOpen(false);
      setSelectedSurvey(null);
      setAnswers({});
    }
  };

  const respondedCount = surveys.filter((s) => s.status === "Completed").length;
  const pendingCount = surveys.filter((s) => s.status === "Not Responded").length;

  return (
    <>
      <GlobalNotification />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Surveys</h1>
          <p className="text-muted-foreground mt-2">
            Participate in surveys to provide feedback
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Surveys</p>
                <p className="text-2xl font-bold">{surveys.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{respondedCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Surveys Table */}
        <Card>
          <CardHeader>
            <CardTitle>Survey List</CardTitle>
            <CardDescription>
              {surveys.length} surveys available
            </CardDescription>
          </CardHeader>
          <CardContent>
            {surveysLoading ? (
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
                      <TableHead>Type</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveys.map((survey) => (
                      <TableRow key={survey.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {survey.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{survey.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {survey.createdBy}
                        </TableCell>
                        <TableCell className="text-center">
                          {survey.description ? "View" : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              survey.status === "Completed" ? "default" : "outline"
                            }
                            className={
                              survey.status === "Completed"
                                ? "bg-green-500"
                                : "bg-amber-50 text-amber-800"
                            }
                          >
                            {survey.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {survey.status === "Not Responded" ? (
                            <Dialog
                              open={isDialogOpen && selectedSurvey?.id === survey.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setIsDialogOpen(true);
                                  handleSurveyOpen(survey);
                                } else {
                                  setIsDialogOpen(false);
                                  setSelectedSurvey(null);
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Take Survey
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{selectedSurvey?.title}</DialogTitle>
                                  <DialogDescription>
                                    {selectedSurvey?.description || "Please provide your feedback"}
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 max-h-64 overflow-y-auto py-4">
                                  {selectedSurvey?.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {selectedSurvey.description}
                                    </p>
                                  )}
                                </div>

                                <div className="flex gap-3">
                                  <Button
                                    onClick={handleSubmitSurvey}
                                    className="flex-1"
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Survey
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsDialogOpen(false);
                                      setSelectedSurvey(null);
                                    }}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Badge variant="secondary">Completed</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clipboard className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground">No surveys available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
