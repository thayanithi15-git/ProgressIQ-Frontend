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

  const getStatusClass = (status?: string) => {
    switch (status) {
      case "Verified":
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
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
        <div className="space-y-6">

          {/* SEARCH + FILTER */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex gap-2 w-full sm:w-1/2">
              <Input
                placeholder="Search certifications..."
                className="py-5 shadow-sm focus-visible:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button onClick={handleSearch} className="py-5 shadow-sm">
                Search
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              <Select
                value={status}
                onValueChange={(value) => handleStatus(value)}
              >
                <SelectTrigger className="w-[160px] py-5 shadow-sm">
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
                className="py-4"
                onClick={() => fetchCerts()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {isLoading && <div>Loading...</div>}

            {!isLoading && certs.length === 0 && (
              <div className="text-muted-foreground">
                No certifications found
              </div>
            )}

            {certs.map((c) => (
              <Card
                key={c._id}
                className="group relative overflow-hidden border border-border/60 bg-card/70 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col min-h-[230px]"
              >
                {/* TOP HOVER BAR */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-transparent group-hover:bg-primary transition" />

                {/* HEADER */}
                <CardHeader className="pb-2">

                  <div className="flex justify-between items-start">

                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary group-hover:scale-110 transition" />
                      {c.title || "Untitled"}
                    </CardTitle>

                    <div
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md ${getStatusClass(
                        c.status
                      )}`}
                    >
                      {c.status || "Unknown"}
                    </div>

                  </div>

                  <CardDescription>
                    {c.platform || "Unknown Platform"}
                  </CardDescription>

                </CardHeader>

                {/* BODY */}
                <CardContent className="flex-1">
                  {c.from || c.to ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded-md bg-muted">
                        {c.from ? new Date(c.from).toLocaleDateString() : "—"}
                      </span>

                      <span className="text-muted-foreground">→</span>

                      <span className="px-2 py-1 rounded-md bg-muted">
                        {c.to ? new Date(c.to).toLocaleDateString() : "Present"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No date information</span>
                  )}
                </CardContent>

                {/* FOOTER */}
                <CardFooter className="border-t pt-2.5 pb-2.5 flex justify-between items-center">

                  <div className="text-xs text-muted-foreground">
                    Platform: {c.platform || "—"}
                  </div>

                  {c.platformLink ? (
                    <Link href={c.platformLink} target="_blank">
                      <Button
                        size="sm"
                        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-sm"
                      >
                        <Globe className="w-4 h-4" />
                        Open
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      disabled
                      className="gap-2 bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                    >
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

            <div className="flex gap-2 items-center">

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