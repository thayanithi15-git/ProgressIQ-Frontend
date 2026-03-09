"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";
import { useMentorDashboardStore } from "@/store/mentor/dashboard";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";

export default function MentorCertificationsPage() {
  const { certifications, certificationsLoading, fetchCertifications } = useMentorDashboardStore();

  useEffect(() => {
    fetchCertifications();
  }, []);

  return (
    <div className="space-y-8">
         <GlobalNotification />
   
         <Header
             title='Mentor Dashboard'
             subtitle="Welcome back! Here's what's happening today."
             HeaderComp={
               <div style={{ display: "flex", gap: 10 }}>
                 <Button style={{
                   display: "flex", alignItems: "center", gap: 6, fontSize: 13,
                   background: "var(--primary)", color: "var(--primary-foreground)",
                 }}>
                   <Download size={14} />
                   Export
                 </Button>
               </div>
             }
           />

      <div className="space-y-8 px-5 py-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certifications</h1>
          <p className="text-muted-foreground mt-2">Review student certifications and status</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Certification Submissions</CardTitle>
            <CardDescription>Total: {certifications.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {certificationsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : certifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No certifications found</div>
            ) : (
              <div className="space-y-3">
                {certifications.map((c) => (
                  <div key={c.id} className="rounded-lg border p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-sm text-muted-foreground">{c.student.name} • {c.platform}</p>
                    </div>
                    <Badge variant="outline">{c.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

