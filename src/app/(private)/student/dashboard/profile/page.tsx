"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Award, BookOpen, Briefcase, MapPin, Mail, Trophy, TrendingUp, Zap } from "lucide-react";
import { useStudentDashboardStore } from "@/store/student/dashboard";
import GlobalNotification from "@/components/notify/notification";

export default function ProfilePage() {
  const { profile, profileLoading, fetchProfile } = useStudentDashboardStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <GlobalNotification />
      <div className="space-y-6">
        {profileLoading ? (
          <>
            <Skeleton className="h-40 w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
          </>
        ) : profile ? (
          <>
            {/* Profile Header Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        {profile.name}
                      </h1>
                      <p className="text-muted-foreground mt-2">{profile.email}</p>
                    </div>
                  </div>
                  <Button size="lg" className="gap-2">
                    <Trophy className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <p className="text-sm text-muted-foreground">Total Points</p>
                    </div>
                    <p className="text-3xl font-bold">{profile.totalPoints}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <p className="text-sm text-muted-foreground">Overall Rank</p>
                    </div>
                    <p className="text-3xl font-bold">#{profile.rank}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-500" />
                      <p className="text-sm text-muted-foreground">Department Rank</p>
                    </div>
                    <p className="text-3xl font-bold">#{profile.departmentRank}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <p className="text-sm text-muted-foreground">Next Rank</p>
                    </div>
                    <p className="text-sm font-semibold text-green-600">
                      {profile.nextRankPoints - profile.totalPoints} points away
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Achievements Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Projects & Internships
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Projects Completed</span>
                    <Badge className="bg-blue-500">
                      {profile.projectsCompleted}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Internships Completed</span>
                    <Badge className="bg-green-500">
                      {profile.internshipsCompleted}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Certifications Earned</span>
                    <Badge className="bg-purple-500">
                      {profile.certificationsEarned}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Ranking & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Top Performer Status</p>
                    <Badge className="bg-yellow-500">
                      {profile.rank <= 10 ? "Top 10" : "Excellent"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Current Rank Tier</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                          style={{
                            width: `${
                              profile.nextRankPoints > 0
                                ? (profile.totalPoints / profile.nextRankPoints) * 100
                                : 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(
                          profile.nextRankPoints > 0
                            ? (profile.totalPoints / profile.nextRankPoints) * 100
                            : 100
                        )}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Progress towards next rank milestone
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Rank Tier</p>
                    <p className="text-lg font-semibold text-foreground">
                      {profile.currentRank || "Not Set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Points For Next Rank
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      {profile.nextRankPoints}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Failed to load profile</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
