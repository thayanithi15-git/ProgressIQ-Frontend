"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, TrendingUp, Medal, Crown } from "lucide-react";
import { useStudentDashboardStore } from "@/store/student/dashboard";
import GlobalNotification from "@/components/notify/notification";

const getRankColor = (rank: number) => {
  if (rank === 1) return "bg-yellow-50 text-yellow-800 border-yellow-200";
  if (rank === 2) return "bg-gray-50 text-gray-800 border-gray-200";
  if (rank === 3) return "bg-orange-50 text-orange-800 border-orange-200";
  if (rank <= 10) return "bg-blue-50 text-blue-800 border-blue-200";
  return "bg-slate-50 text-slate-800 border-slate-200";
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-4 h-4" />;
  if (rank <= 3) return <Medal className="w-4 h-4" />;
  if (rank <= 10) return <Trophy className="w-4 h-4" />;
  return null;
};

export default function RankingPage() {
  const { rankings, rankingsLoading, fetchRankings, profile, fetchProfile } =
    useStudentDashboardStore();

  useEffect(() => {
    fetchRankings();
    fetchProfile();
  }, []);

  return (
    <>
      <GlobalNotification />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Rankings</h1>
          <p className="text-muted-foreground mt-2">
            See how you compare with other students
          </p>
        </div>

        {/* Your Ranking Card */}
        {profile ? (
          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${getRankColor(profile.rank)}`}>
                    #{profile.rank}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Ranking</p>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {profile.totalPoints} points
                    </p>
                  </div>
                </div>
                <Badge className="bg-primary">{profile.departmentRank && `Dept Rank: #${profile.departmentRank}`}</Badge>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Rankings Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>
                  Overall student rankings by points
                </CardDescription>
              </div>
              <TrendingUp className="w-6 h-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {rankingsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : rankings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankings.map((ranking, index) => (
                      <TableRow
                        key={index}
                        className={
                          profile && ranking.rank === profile.rank
                            ? "bg-primary/10 font-semibold"
                            : "hover:bg-muted/50"
                        }
                      >
                        <TableCell className="font-bold">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getRankColor(ranking.rank)}`}>
                            <div className="flex items-center gap-1">
                              {getRankIcon(ranking.rank)}
                              {ranking.rank}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {ranking.name || "Anonymous"}
                          {profile && ranking.rank === profile.rank && (
                            <Badge className="ml-2">You</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {ranking.points}
                        </TableCell>
                        <TableCell className="text-center">
                          {ranking.rank <= 10 ? (
                            <Badge className="bg-green-500">Top 10</Badge>
                          ) : ranking.rank <= 50 ? (
                            <Badge className="bg-blue-500">Top 50</Badge>
                          ) : (
                            <Badge variant="outline">Participant</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No rankings data available yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ranking Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ranking Tiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <Crown className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-sm">Rank #1</p>
                  <p className="text-xs text-yellow-700">Champion</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <Medal className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-sm">Rank #2-3</p>
                  <p className="text-xs text-gray-700">Runner-up</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Trophy className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">Rank #4-10</p>
                  <p className="text-xs text-blue-700">Top Performer</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
