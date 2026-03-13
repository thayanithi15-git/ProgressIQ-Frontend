"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    FileSpreadsheet,
    Download,
    Filter,
    X,
    Users,
    TrendingUp,
    Briefcase,
    Award,
    GraduationCap,
    CheckCircle,
    Loader2,
    Eye,
    ChevronDown,
    Settings,
    RefreshCw,
    Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminReportsStore, ReportCategory, ReportType } from "@/store/admin/report";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";

// ==========================================
// REPORT TYPE CARD
// ==========================================
interface ReportTypeCardProps {
    type: ReportType;
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    isSelected: boolean;
    onClick: () => void;
}

const ReportTypeCard: React.FC<ReportTypeCardProps> = ({
    icon: Icon,
    title,
    description,
    color,
    isSelected,
    onClick,
}) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick}>
        <Card
            className={`cursor-pointer font-poppins transition-all duration-300 ${
                isSelected
                    ? "border-primary shadow-lg shadow-primary/20 bg-primary/5"
                    : "border-border hover:border-primary/50"
            }`}
        >
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                    >
                        <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-1  font-poppins">{title}</h3>
                        <p className="text-sm text-muted-foreground  font-poppins">{description}</p>
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

// ==========================================
// CATEGORY CARD
// ==========================================
interface CategoryCardProps {
    category: ReportCategory;
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    isSelected: boolean;
    onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    icon: Icon,
    title,
    description,
    color,
    isSelected,
    onClick,
}) => (
    <motion.div whileHover={{ y: -6 }} whileTap={{ scale: 0.97 }} onClick={onClick}>
        <Card
            className={`cursor-pointer transition-all duration-300 ${
                isSelected
                    ? "shadow-lg bg-background"
                    : "border-border hover:shadow-md"
            }`}
            style={isSelected ? { borderColor: color, boxShadow: `0 4px 20px ${color}30` } : {}}
        >
            <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                    {/* Colored icon bubble */}
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                        style={{
                            backgroundColor: isSelected ? `${color}25` : `${color}15`,
                            border: isSelected ? `2px solid ${color}60` : `2px solid ${color}25`,
                        }}
                    >
                        <Icon className="w-7 h-7" style={{ color }} />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-sm font-poppins">{title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 font-poppins">{description}</p>
                    </div>
                    {/* Selected indicator dot */}
                    {isSelected && (
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

// ==========================================
// FILTER SECTION
// ==========================================
const FilterSection: React.FC = () => {
    const {
        filters,
        selectedCategory,
        departments,
        years,
        mentors,
        platforms,
        updateFilters,
        resetFilters,
        fetchDepartments,
        fetchYears,
        fetchMentors,
        fetchPlatforms,
    } = useAdminReportsStore();

    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        fetchDepartments();
        fetchYears();
        fetchMentors();
        fetchPlatforms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isStudentRelated =
        selectedCategory === "students" ||
        selectedCategory === "performance" ||
        selectedCategory === "comprehensive";

    const isCertRelated =
        selectedCategory === "certifications" ||
        selectedCategory === "students" ||
        selectedCategory === "comprehensive";

    return (
        <Card className="border-border">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Filter className="w-5 h-5 text-primary" />
                            Filters
                        </CardTitle>
                        <CardDescription>Customize your report criteria</CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Reset
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Start Date</Label>
                        <Input
                            type="date"
                            value={filters.startDate || ""}
                            onChange={(e) => updateFilters({ startDate: e.target.value })}
                            className="border-border"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">End Date</Label>
                        <Input
                            type="date"
                            value={filters.endDate || ""}
                            onChange={(e) => updateFilters({ endDate: e.target.value })}
                            className="border-border"
                        />
                    </div>
                </div>

                {/* Department & Year */}
                {isStudentRelated && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Department</Label>
                            <Select
                                value={filters.department || "all"}
                                onValueChange={(v) =>
                                    updateFilters({ department: v === "all" ? undefined : v })
                                }
                            >
                                <SelectTrigger className="border-border">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Academic Year</Label>
                            <Select
                                value={filters.year || "all"}
                                onValueChange={(v) =>
                                    updateFilters({ year: v === "all" ? undefined : v })
                                }
                            >
                                <SelectTrigger className="border-border">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Years</SelectItem>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Student Status */}
                {(selectedCategory === "students" || selectedCategory === "comprehensive") && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Student Status</Label>
                        <Select
                            value={filters.status || "All"}
                            onValueChange={(v: any) => updateFilters({ status: v })}
                        >
                            <SelectTrigger className="border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Students</SelectItem>
                                <SelectItem value="Active">Active Only</SelectItem>
                                <SelectItem value="Inactive">Inactive Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Project Status */}
                {(selectedCategory === "projects" || selectedCategory === "comprehensive") && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Project Status</Label>
                        <Select
                            value={filters.projectStatus || "All"}
                            onValueChange={(v: any) => updateFilters({ projectStatus: v })}
                        >
                            <SelectTrigger className="border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Projects</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Internship Filters */}
                {(selectedCategory === "internships" || selectedCategory === "comprehensive") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Internship Type</Label>
                            <Select
                                value={filters.internshipType || "All"}
                                onValueChange={(v: any) => updateFilters({ internshipType: v })}
                            >
                                <SelectTrigger className="border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Types</SelectItem>
                                    <SelectItem value="Industry">Industry</SelectItem>
                                    <SelectItem value="Research">Research</SelectItem>
                                    <SelectItem value="Startup">Startup</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Internship Status</Label>
                            <Select
                                value={filters.internshipStatus || "All"}
                                onValueChange={(v: any) => updateFilters({ internshipStatus: v })}
                            >
                                <SelectTrigger className="border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Status</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Certification Platform */}
                {isCertRelated && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Cert Platform</Label>
                            <Select
                                value={filters.platform || "all"}
                                onValueChange={(v) =>
                                    updateFilters({ platform: v === "all" ? undefined : v })
                                }
                            >
                                <SelectTrigger className="border-border">
                                    <SelectValue placeholder="All Platforms" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Platforms</SelectItem>
                                    {platforms.map((p) => (
                                        <SelectItem key={p} value={p}>
                                            {p}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Cert Status</Label>
                            <Select
                                value={filters.certificationStatus || "All"}
                                onValueChange={(v: any) =>
                                    updateFilters({ certificationStatus: v })
                                }
                            >
                                <SelectTrigger className="border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Verified">Verified</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Advanced Filters Toggle */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full"
                >
                    <Settings className="w-4 h-4 mr-2" />
                    {showAdvanced ? "Hide" : "Show"} Advanced Filters
                    <ChevronDown
                        className={`w-4 h-4 ml-2 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                    />
                </Button>

                {/* Advanced Filters */}
                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4 overflow-hidden"
                        >
                            <Separator />

                            {/* ——— Advanced Student Sub-Filters ——— */}
                            {isStudentRelated && (
                                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-dashed border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        🎯 Advanced Student Filters
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Min. Projects Done
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder="e.g. 4"
                                                min={0}
                                                value={filters.minProjects ?? ""}
                                                onChange={(e) =>
                                                    updateFilters({
                                                        minProjects: e.target.value
                                                            ? Number(e.target.value)
                                                            : undefined,
                                                    })
                                                }
                                                className="border-border"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Only students with ≥ N completed projects
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">
                                                Min. Internships Done
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder="e.g. 3"
                                                min={0}
                                                value={filters.minInternships ?? ""}
                                                onChange={(e) =>
                                                    updateFilters({
                                                        minInternships: e.target.value
                                                            ? Number(e.target.value)
                                                            : undefined,
                                                    })
                                                }
                                                className="border-border"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Only students with ≥ N approved internships
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">
                                            Certification Search (Name / Platform)
                                        </Label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. AWS, Oracle, Python, Microsoft"
                                            value={filters.certificationName || ""}
                                            onChange={(e) =>
                                                updateFilters({
                                                    certificationName: e.target.value || undefined,
                                                })
                                            }
                                            className="border-border"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Filters students who hold this certification
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-yellow-500" />
                                            Top N Students by Activity Points
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 30 (for top 30 students)"
                                            min={1}
                                            value={filters.topNPoints ?? ""}
                                            onChange={(e) =>
                                                updateFilters({
                                                    topNPoints: e.target.value
                                                        ? Number(e.target.value)
                                                        : undefined,
                                                })
                                            }
                                            className="border-border"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Report only the top N students by total points
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Designation & Points (Performance) */}
                            {(selectedCategory === "performance" ||
                                selectedCategory === "comprehensive") && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Designation</Label>
                                        <Select
                                            value={filters.designation || "All"}
                                            onValueChange={(v: any) =>
                                                updateFilters({ designation: v })
                                            }
                                        >
                                            <SelectTrigger className="border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All Designations</SelectItem>
                                                <SelectItem value="Gold Scholar">
                                                    Gold Scholar
                                                </SelectItem>
                                                <SelectItem value="Silver Scholar">
                                                    Silver Scholar
                                                </SelectItem>
                                                <SelectItem value="Bronze Scholar">
                                                    Bronze Scholar
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">Min Points</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={filters.minPoints ?? ""}
                                                onChange={(e) =>
                                                    updateFilters({
                                                        minPoints: e.target.value
                                                            ? Number(e.target.value)
                                                            : undefined,
                                                    })
                                                }
                                                className="border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">Max Points</Label>
                                            <Input
                                                type="number"
                                                placeholder="1000"
                                                value={filters.maxPoints ?? ""}
                                                onChange={(e) =>
                                                    updateFilters({
                                                        maxPoints: e.target.value
                                                            ? Number(e.target.value)
                                                            : undefined,
                                                    })
                                                }
                                                className="border-border"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sorting & Limit */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Sort By</Label>
                                    <Select
                                        value={filters.sortBy || "name"}
                                        onValueChange={(v: any) => updateFilters({ sortBy: v })}
                                    >
                                        <SelectTrigger className="border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="name">Name</SelectItem>
                                            <SelectItem value="points">Points</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                            <SelectItem value="department">Department</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Order</Label>
                                    <Select
                                        value={filters.sortOrder || "asc"}
                                        onValueChange={(v: any) => updateFilters({ sortOrder: v })}
                                    >
                                        <SelectTrigger className="border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="asc">Ascending</SelectItem>
                                            <SelectItem value="desc">Descending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Record Limit</Label>
                                    <Input
                                        type="number"
                                        placeholder="No limit"
                                        value={filters.limit ?? ""}
                                        onChange={(e) =>
                                            updateFilters({
                                                limit: e.target.value
                                                    ? Number(e.target.value)
                                                    : undefined,
                                            })
                                        }
                                        className="border-border"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

// ==========================================
// REPORT PREVIEW
// ==========================================
const ReportPreview: React.FC = () => {
    const { reportPreview, isLoadingPreview, getFilterSummary } = useAdminReportsStore();

    if (isLoadingPreview) {
        return (
            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Report Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (!reportPreview) {
        return (
            <Card className="border-border border-dashed">
                <CardContent className="p-12 text-center">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No preview yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Click &ldquo;Preview Data&rdquo; to see a summary before downloading
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-primary/50 shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Report Preview
                </CardTitle>
                <CardDescription>Summary of your configured report</CardDescription>
                {reportPreview.usedDefaultDateRange && (
                    <p className="text-xs text-muted-foreground mt-1">
                        No date range selected — showing last 30 days by default
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Records</p>
                        <p className="text-3xl font-black text-foreground">
                            {reportPreview.totalRecords}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Estimated Size</p>
                        <p className="text-3xl font-black text-foreground">
                            {reportPreview.estimatedFileSize}
                        </p>
                    </div>
                </div>

                {/* Active Filters */}
                <div>
                    <Label className="text-sm font-semibold mb-2 block">Active Filters</Label>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        {getFilterSummary()}
                    </p>
                </div>

                {/* Sample Data */}
                {reportPreview.sampleData && reportPreview.sampleData.length > 0 && (
                    <div>
                        <Label className="text-sm font-semibold mb-2 block">
                            Sample Data (first 3–5 records)
                        </Label>
                        <ScrollArea className="h-48 rounded-lg border border-border">
                            <div className="p-4 text-xs">
                                {Array.isArray(reportPreview.sampleData) &&
                                reportPreview.sampleData[0] &&
                                typeof reportPreview.sampleData[0] === "object" &&
                                "section" in reportPreview.sampleData[0] ? (
                                    reportPreview.sampleData.map((sec: any) => (
                                        <div key={sec.section} className="mb-3">
                                            <strong>
                                                {sec.section} ({sec.count} records)
                                            </strong>
                                            <pre className="text-xs mt-1 overflow-auto">
                                                {JSON.stringify(sec.sample || [], null, 2)}
                                            </pre>
                                        </div>
                                    ))
                                ) : (
                                    <pre className="overflow-auto">
                                        {JSON.stringify(
                                            reportPreview.sampleData.slice(0, 3),
                                            null,
                                            2
                                        )}
                                    </pre>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// ==========================================
// MAIN PAGE
// ==========================================
export default function AdminReports() {
    const {
        selectedType,
        selectedCategory,
        filters,
        isGenerating,
        setReportType,
        setReportCategory,
        generateReport,
        fetchReportPreview,
        validateFilters,
    } = useAdminReportsStore();

    const reportTypes = [
        {
            type: "pdf" as ReportType,
            icon: FileText,
            title: "PDF Report",
            description: "Professional formatted document",
            color: "#EF4444",
        },
        {
            type: "excel" as ReportType,
            icon: FileSpreadsheet,
            title: "Excel Spreadsheet",
            description: "Editable data with formulas",
            color: "#10B981",
        },
        {
            type: "csv" as ReportType,
            icon: FileSpreadsheet,
            title: "CSV File",
            description: "Raw data for analysis",
            color: "#3B82F6",
        },
    ];

    const categories = [
        {
            category: "students" as ReportCategory,
            icon: Users,
            title: "Students",
            description: "Student profiles & data",
            color: "#6366F1",   // indigo
        },
        {
            category: "mentors" as ReportCategory,
            icon: GraduationCap,
            title: "Mentors",
            description: "Mentor information",
            color: "#8B5CF6",   // violet
        },
        {
            category: "projects" as ReportCategory,
            icon: Briefcase,
            title: "Projects",
            description: "Project submissions",
            color: "#F59E0B",   // amber
        },
        {
            category: "internships" as ReportCategory,
            icon: Award,
            title: "Internships",
            description: "Internship records",
            color: "#10B981",   // emerald
        },
        {
            category: "certifications" as ReportCategory,
            icon: Star,
            title: "Certifications",
            description: "Certificate data",
            color: "#F97316",   // orange
        },
        {
            category: "performance" as ReportCategory,
            icon: TrendingUp,
            title: "Performance",
            description: "Analytics & metrics",
            color: "#EF4444",   // rose
        },
        {
            category: "comprehensive" as ReportCategory,
            icon: FileText,
            title: "Comprehensive",
            description: "All-in-one report",
            color: "#0EA5E9",   // sky
        },
    ];

    const handlePreview = () => {
        if (validateFilters()) {
            fetchReportPreview(selectedCategory, filters);
        }
    };

    const handleGenerate = async () => {
        if (!validateFilters()) return;

        await generateReport({
            type: selectedType,
            category: selectedCategory,
            filter: filters,
            options: {
                includeCharts: true,
                includeStatistics: true,
                includeRankings: selectedCategory === "performance",
            },
        });
    };

    return (
        <>
            <GlobalNotification />
            <Header
                title="Reports"
                subtitle="Generate and instantly download dynamic reports."
                HeaderComp={
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={handlePreview}
                            variant="outline"
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Preview Data
                        </Button>
                        <Button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="gap-2 bg-primary hover:bg-primary/90"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Generate &amp; Download
                                </>
                            )}
                        </Button>
                    </div>
                }
            />

            <div className="min-h-screen bg-background p-6 font-poppins space-y-6">
                {/* Step 1: Report Type */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">
                                Step 1: Choose Report Format
                            </CardTitle>
                            <CardDescription>Select the output format</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {reportTypes.map((t) => (
                                    <ReportTypeCard
                                        key={t.type}
                                        {...t}
                                        isSelected={selectedType === t.type}
                                        onClick={() => setReportType(t.type)}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Step 2: Category */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">
                                Step 2: Select Report Category
                            </CardTitle>
                            <CardDescription>Choose what data to report on</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                                {categories.map((c) => (
                                    <CategoryCard
                                        key={c.category}
                                        {...c}
                                        isSelected={selectedCategory === c.category}
                                        onClick={() => setReportCategory(c.category)}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Step 3: Filters & Preview side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <FilterSection />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <ReportPreview />

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                onClick={handlePreview}
                                variant="outline"
                                className="flex-1"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview Data
                            </Button>
                            <Button
                                type="button"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="flex-1 bg-primary hover:bg-primary/90 font-bold text-base py-6"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generating…
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5 mr-2" />
                                        Generate &amp; Download
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Format badge info */}
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary" className="gap-1">
                                <FileText className="w-3 h-3" />
                                Instant download
                            </Badge>
                            <Badge variant="secondary" className="gap-1">
                                <CheckCircle className="w-3 h-3" />
                                No server storage
                            </Badge>
                            <Badge variant="secondary" className="gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Advanced filters
                            </Badge>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}