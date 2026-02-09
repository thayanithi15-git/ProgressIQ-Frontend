"use client";

import React, { useEffect, useState } from "react";

import Header from "@/components/layout/header";
import GlobalNotification from "@/components/notify/notification";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Globe, Award } from "lucide-react";

import { useAdminCertsStore } from "@/store/admin/certifications";
import Link from "next/link";

export default function CertificationsPage() {
  const {
    certs,
    total,
    page,
    limit,
    isLoading,
    fetchCerts,
    setPage,
    setFilters,
  } = useAdminCertsStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleSearch = () => {
    setFilters({ search });
    fetchCerts({ page: 1, filters: { search } });
  };

  const handleStatus = (s: string) => {
    setStatus(s);
    setFilters({ status: s });
    fetchCerts({ page: 1, filters: { status: s } });
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case "Verified":
      case "Completed":
        return "default";
      case "Pending":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (
    <>
      <GlobalNotification />

      <Header
        title="Certifications"
        subtitle="Student certifications across various platforms"
      />

      <div className="min-h-screen bg-background p-6">
        <div className="space-y-4">
          {/* TOP BAR */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex gap-2 w-full sm:w-1/2">
              <Input
                placeholder="Search certifications..."
                className="shadow-none py-5"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} className="py-5">
                Search
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              <Select
                value={status}
                onValueChange={(value) => handleStatus(value)}
              >
                <SelectTrigger className="w-[160px] py-5 shadow-none">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="py-4 bg-primary text-background"
                onClick={() => fetchCerts()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">
            {isLoading && <div>Loading...</div>}

            {!isLoading && certs.length === 0 && (
              <div className="text-muted-foreground">
                No certifications found
              </div>
            )}

            {certs.map((c) => (
              <Card
                key={c._id}
                className="group hover:shadow-sm transition-all shadow-none duration-200 border cursor-pointer border-border flex flex-col min-h-[220px]"
              >
                {/* HEADER */}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      {c.title || "Untitled"}
                    </CardTitle>

                    <Badge variant={getStatusVariant(c.status)}>
                      {c.status || "Unknown"}
                    </Badge>
                  </div>

                  <CardDescription>
                    {c.platform || "Unknown Platform"}
                  </CardDescription>
                </CardHeader>

                {/* BODY */}
                <CardContent className="flex-1">
                  <div className="text-sm text-muted-foreground space-y-1">
                    {c.from && (
                      <p>
                        From: {new Date(c.from).toLocaleDateString()}
                      </p>
                    )}

                    {c.to && (
                      <p>
                        To: {new Date(c.to).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>

                {/* FOOTER – ALWAYS VISIBLE */}
                <CardFooter className="border-t pt-2.5 pb-2.5 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    Platform: {c.platform || "—"}
                  </div>

                  {c.platformLink ? (
                    <Link href={c.platformLink} target="_blank">
                      <Button
                      
                        variant="outline"
                        size="sm"
                        className="gap-2 shadow-none"
                      >
                        <Globe className="w-4 h-4" />
                        Open
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="gap-2 shadow-none">
                      No Link
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {`Showing ${certs.length} of ${total}`}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => {
                  setPage(page - 1);
                  fetchCerts({ page: page - 1 });
                }}
              >
                Prev
              </Button>

              <div className="px-3 py-2 rounded-md border border-input bg-transparent">
                {`${page} / ${totalPages}`}
              </div>

              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => {
                  setPage(page + 1);
                  fetchCerts({ page: page + 1 });
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
