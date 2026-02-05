"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    FileSpreadsheet,
    //   FileCsv,
    Download,
    Trash2,
    Filter,
    X,
    Calendar,
    Users,
    TrendingUp,
    Briefcase,
    Award,
    GraduationCap,
    Clock,
    CheckCircle,
    Loader2,
    AlertCircle,
    Search,
    RefreshCw,
    Eye,
    ChevronDown,
    Settings,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useAdminReportsStore, ReportCategory, ReportType } from "@/store/admin/report";
import GlobalNotification from "@/components/notify/notification";
import Header from "@/components/layout/header";

// ==========================================
// REPORT TYPE CARDS
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
    type,
    icon: Icon,
    title,
    description,
    color,
    isSelected,
    onClick,
}) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
    >
        <Card
            className={`cursor-pointer transition-all duration-300 ${isSelected
                ? "border-primary shadow-lg shadow-primary/20 bg-primary/5"
                : "border-border hover:border-primary/50"
                }`}
        >
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}15` }}
                    >
                        <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-1">{title}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {isSelected && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                    )}
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
    count?: number;
    isSelected: boolean;
    onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    icon: Icon,
    title,
    description,
    count,
    isSelected,
    onClick,
}) => (
    <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
    >
        <Card
            className={`cursor-pointer transition-all duration-300 ${isSelected
                ? "border-primary shadow-lg shadow-primary/20 bg-primary/5"
                : "border-border hover:border-primary/30 hover:shadow-md"
                }`}
        >
            <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${isSelected ? "bg-primary/20" : "bg-muted"
                            }`}
                    >
                        <Icon className={`w-7 h-7 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-sm">{title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>
                    {count !== undefined && (
                        <Badge variant="secondary" className="text-xs">
                            {count} records
                        </Badge>
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
    }, []);

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
                {(selectedCategory === 'students' || selectedCategory === 'performance' || selectedCategory === 'comprehensive') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Department</Label>
                            <Select
                                value={Array.isArray(filters.department) ? filters.department[0] : filters.department || "all"}
                                onValueChange={(value) => updateFilters({ department: value === "all" ? undefined : value })}
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
                                value={Array.isArray(filters.year) ? filters.year[0] : filters.year || "all"}
                                onValueChange={(value) => updateFilters({ year: value === "all" ? undefined : value })}
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

                {/* Status */}
                {(selectedCategory === 'students' || selectedCategory === 'comprehensive') && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Student Status</Label>
                        <Select
                            value={filters.status || "All"}
                            onValueChange={(value: any) => updateFilters({ status: value })}
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
                {(selectedCategory === 'projects' || selectedCategory === 'comprehensive') && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Project Status</Label>
                        <Select
                            value={filters.projectStatus || "All"}
                            onValueChange={(value: any) => updateFilters({ projectStatus: value })}
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
                {(selectedCategory === 'internships' || selectedCategory === 'comprehensive') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Internship Type</Label>
                            <Select
                                value={filters.internshipType || "All"}
                                onValueChange={(value: any) => updateFilters({ internshipType: value })}
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
                            <Label className="text-sm font-semibold">Status</Label>
                            <Select
                                value={filters.internshipStatus || "All"}
                                onValueChange={(value: any) => updateFilters({ internshipStatus: value })}
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

                {/* Advanced Filters Toggle */}
                <Button
                    variant="outline"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full"
                >
                    <Settings className="w-4 h-4 mr-2" />
                    {showAdvanced ? "Hide" : "Show"} Advanced Filters
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
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

                            {/* Performance Filters */}
                            {(selectedCategory === 'performance' || selectedCategory === 'comprehensive') && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Designation</Label>
                                        <Select
                                            value={filters.designation || "All"}
                                            onValueChange={(value: any) => updateFilters({ designation: value })}
                                        >
                                            <SelectTrigger className="border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All Designations</SelectItem>
                                                <SelectItem value="Gold Scholar">Gold Scholar</SelectItem>
                                                <SelectItem value="Silver Scholar">Silver Scholar</SelectItem>
                                                <SelectItem value="Bronze Scholar">Bronze Scholar</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">Min Points</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={filters.minPoints || ""}
                                                onChange={(e) => updateFilters({ minPoints: Number(e.target.value) })}
                                                className="border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">Max Points</Label>
                                            <Input
                                                type="number"
                                                placeholder="1000"
                                                value={filters.maxPoints || ""}
                                                onChange={(e) => updateFilters({ maxPoints: Number(e.target.value) })}
                                                className="border-border"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Sorting */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Sort By</Label>
                                    <Select
                                        value={filters.sortBy || "name"}
                                        onValueChange={(value: any) => updateFilters({ sortBy: value })}
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
                                        onValueChange={(value: any) => updateFilters({ sortOrder: value })}
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
                            </div>

                            {/* Limit */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Record Limit</Label>
                                <Input
                                    type="number"
                                    placeholder="No limit"
                                    value={filters.limit || ""}
                                    onChange={(e) => updateFilters({ limit: Number(e.target.value) })}
                                    className="border-border"
                                />
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
                <CardContent>
                    <div className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!reportPreview) {
        return (
            <Card className="border-border border-dashed">
                <CardContent className="p-12 text-center">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        Configure filters and click preview to see report summary
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
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Records</p>
                        <p className="text-2xl font-black text-foreground">{reportPreview.totalRecords}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Estimated Size</p>
                        <p className="text-2xl font-black text-foreground">{reportPreview.estimatedFileSize}</p>
                    </div>
                </div>

                <div>
                    <Label className="text-sm font-semibold mb-2 block">Active Filters</Label>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        {getFilterSummary()}
                    </p>
                </div>

                {reportPreview.sampleData && reportPreview.sampleData.length > 0 && (
                    <div>
                        <Label className="text-sm font-semibold mb-2 block">Sample Data (First 3 Records)</Label>
                        <ScrollArea className="h-48 rounded-lg border border-border">
                            <pre className="p-4 text-xs">
                                {JSON.stringify(reportPreview.sampleData.slice(0, 3), null, 2)}
                            </pre>
                        </ScrollArea>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// ==========================================
// REPORT HISTORY
// ==========================================
const ReportHistory: React.FC = () => {
    const { reportHistory, isLoadingHistory, downloadReport, deleteReport } = useAdminReportsStore();

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { color: string; icon: React.ElementType }> = {
            queued: { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Clock },
            processing: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Loader2 },
            completed: { color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
            failed: { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: AlertCircle },
        };

        const variant = variants[status] || variants.queued;
        const Icon = variant.icon;

        return (
            <Badge className={`${variant.color} border`}>
                <Icon className="w-3 h-3 mr-1" />
                {status}
            </Badge>
        );
    };

    if (isLoadingHistory) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>
        );
    }

    if (reportHistory.length === 0) {
        return (
            <Card className="border-dashed border-border">
                <CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No reports generated yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Create your first report to see it here
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {reportHistory.map((report) => (
                <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-border hover:border-primary/50 transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        {report.type === "pdf" && <FileText className="w-6 h-6 text-primary" />}
                                        {report.type === "excel" && <FileSpreadsheet className="w-6 h-6 text-primary" />}
                                        {report.type === "csv" && <FileSpreadsheet className="w-6 h-6 text-primary" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-foreground capitalize">
                                                {report.category} Report
                                            </h4>
                                            {getStatusBadge(report.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Generated {new Date(report.generatedAt).toLocaleString()}
                                        </p>
                                        {report.fileSize && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Size: {report.fileSize}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {report.status === "completed" && report.downloadUrl && (
                                        <Button
                                            size="sm"
                                            onClick={() => downloadReport(report.id)}
                                            className="gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteReport(report.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

// ==========================================
// MAIN REPORTS PAGE
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
        fetchReportHistory,
        fetchReportPreview,
        validateFilters,
    } = useAdminReportsStore();

    useEffect(() => {
        fetchReportHistory();
    }, []);

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
        },
        {
            category: "mentors" as ReportCategory,
            icon: GraduationCap,
            title: "Mentors",
            description: "Mentor information",
        },
        {
            category: "projects" as ReportCategory,
            icon: Briefcase,
            title: "Projects",
            description: "Project submissions",
        },
        {
            category: "internships" as ReportCategory,
            icon: Award,
            title: "Internships",
            description: "Internship records",
        },
        {
            category: "certifications" as ReportCategory,
            icon: Award,
            title: "Certifications",
            description: "Certificate data",
        },
        {
            category: "performance" as ReportCategory,
            icon: TrendingUp,
            title: "Performance",
            description: "Analytics & metrics",
        },
        {
            category: "comprehensive" as ReportCategory,
            icon: FileText,
            title: "Comprehensive",
            description: "All-in-one report",
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
                includeRankings: selectedCategory === 'performance',
            },
        });
    };

    return (
        <>
            <GlobalNotification />
            <Header
                title="Reports"
                subtitle="Welcome back! Here's what's happening today."
                HeaderComp={
                    <div className="flex gap-3">
                        <Button
                            onClick={fetchReportHistory}
                            variant="outline"
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh History
                        </Button>
                    </div>
                } />
            <div className="min-h-screen bg-background p-6 space-y-6">


                <Tabs defaultValue="generate" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="generate" className="gap-2">
                            <FileText className="w-4 h-4" />
                            Generate Report
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <Clock className="w-4 h-4" />
                            History
                        </TabsTrigger>
                    </TabsList>

                    {/* Generate Tab */}
                    <TabsContent value="generate" className="space-y-6">
                        {/* Step 1: Report Type */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">
                                        Step 1: Choose Report Type
                                    </CardTitle>
                                    <CardDescription>Select the output format for your report</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {reportTypes.map((type) => (
                                            <ReportTypeCard
                                                key={type.type}
                                                {...type}
                                                isSelected={selectedType === type.type}
                                                onClick={() => setReportType(type.type)}
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
                                    <CardDescription>Choose what data to include</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                        {categories.map((category) => (
                                            <CategoryCard
                                                key={category.category}
                                                {...category}
                                                isSelected={selectedCategory === category.category}
                                                onClick={() => setReportCategory(category.category)}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Step 3: Filters & Preview */}
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
                                        onClick={handlePreview}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                    </Button>
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="flex-1 bg-primary hover:bg-primary/90"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-4 h-4 mr-2" />
                                                Generate Report
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Report History</CardTitle>
                                    <CardDescription>View and download previously generated reports</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ReportHistory />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}