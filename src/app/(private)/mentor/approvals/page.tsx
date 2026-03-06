"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { CheckCircle, XCircle, Clock, FileText, MessageSquare, Plus } from "lucide-react";
import { useMentorDashboardStore } from "@/store/mentor/dashboard";
import GlobalNotification from "@/components/notify/notification";

export default function ApprovalsPage() {
  const {
    pendingApprovals,
    approvalsLoading,
    fetchPendingApprovals,
    updateApproval,
  } = useMentorDashboardStore();

  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [points, setPoints] = useState("0");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleApprove = async () => {
    if (selectedApproval) {
      await updateApproval(selectedApproval.id, "Approved", parseInt(points), feedback);
      setFeedback("");
      setPoints("0");
      setIsDialogOpen(false);
      await fetchPendingApprovals();
    }
  };

  const handleReject = async () => {
    if (selectedApproval) {
      await updateApproval(selectedApproval.id, "Rejected", 0, feedback);
      setFeedback("");
      setPoints("0");
      setIsDialogOpen(false);
      await fetchPendingApprovals();
    }
  };

  const pendingCount = pendingApprovals.filter((a) => a.status === "Pending").length;
  const approvedCount = pendingApprovals.filter((a) => a.status === "Approved").length;
  const rejectedCount = pendingApprovals.filter((a) => a.status === "Rejected").length;

  const statusConfig = {
    Pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Pending" },
    Approved: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", label: "Approved" },
    Rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Rejected" },
  };

  return (
    <>
      <GlobalNotification />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Approvals & Feedback</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve student submissions, provide feedback, and award points
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Approvals Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Submissions</CardTitle>
                <CardDescription>
                  Total: {pendingApprovals.length} submissions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {approvalsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : pendingApprovals.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.map((approval) => {
                      const config =
                        statusConfig[approval.status as keyof typeof statusConfig];
                      const StatusIcon = config?.icon || Clock;

                      return (
                        <TableRow
                          key={approval.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {approval.studentName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{approval.entityType}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {approval.entityTitle}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(approval.submittedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${config?.bg} ${config?.color} border-0`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {approval.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {approval.status === "Pending" ? (
                              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedApproval(approval)}
                                  >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Review Submission: {selectedApproval?.entityTitle}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Student: {selectedApproval?.studentName}
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">
                                        Points to Award (if approved)
                                      </label>
                                      <Input
                                        type="number"
                                        value={points}
                                        onChange={(e) => setPoints(e.target.value)}
                                        className="mt-2"
                                        min="0"
                                        max="100"
                                      />
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium">
                                        Feedback
                                      </label>
                                      <Textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Provide constructive feedback..."
                                        className="mt-2"
                                        rows={4}
                                      />
                                    </div>

                                    <div className="flex gap-3">
                                      <Button
                                        onClick={handleApprove}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button
                                        onClick={handleReject}
                                        variant="destructive"
                                        className="flex-1"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Badge variant="secondary">
                                {approval.status === "Approved" ? "✓" : "✗"} Done
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3 opacity-50" />
                <p className="text-muted-foreground">All caught up! No pending approvals</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
