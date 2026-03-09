"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMentorDashboardStore } from "@/store/mentor/dashboard";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function MentorInternshipsPage() {
  const { internships, internshipsLoading, fetchInternships } = useMentorDashboardStore();

  useEffect(() => {
    fetchInternships();
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
          <h1 className="text-3xl font-bold text-foreground">Internships</h1>
          <p className="text-muted-foreground mt-2">Review student internships and status</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Internship Submissions</CardTitle>
            <CardDescription>Total: {internships.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {internshipsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : internships.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No internships found</div>
            ) : (
              <div className="space-y-3">
                {internships.map((i) => (
                  <div key={i.id} className="rounded-lg border p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{i.companyName} • {i.role}</p>
                      <p className="text-sm text-muted-foreground">{i.student.name} • {i.type}</p>
                    </div>
                    <Badge variant="outline">{i.status}</Badge>
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

