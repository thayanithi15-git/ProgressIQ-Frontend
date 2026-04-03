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
    CheckCircle2,
    Loader2,
    Eye,
    ChevronDown,
    Settings,
    RefreshCw,
    Star,
    LayoutGrid,
    Calendar,
    Zap,
    ShieldCheck,
    ArrowRight,
    PieChart,
    Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const StepHeader = ({ step, title, subtitle }: { step: number; title: string; subtitle: string }) => (
    <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-black text-sm">
            0{step}
        </div>
        <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{subtitle}</p>
        </div>
    </div>
);

const ReportTypeCard: React.FC<{
    type: ReportType;
    icon: any;
    title: string;
    description: string;
    color: string;
    isSelected: boolean;
    onClick: () => void;
}> = ({ icon: Icon, title, description, color, isSelected, onClick }) => (
    <motion.div 
        whileHover={{ y: -4 }} 
        whileTap={{ scale: 0.98 }} 
        onClick={onClick}
        className="cursor-pointer h-full"
    >
        <Card className={`h-full border-1 transition-all duration-500 overflow-hidden ${
            isSelected 
            ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/10" 
            : "border-border/60 bg-transparent hover:border-primary/40 hover:bg-muted/30"
        }`}>
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500"
                        style={{ 
                            backgroundColor: isSelected ? `${color}20` : 'rgba(var(--muted), 0.2)',
                            borderColor: isSelected ? `${color}40` : 'rgba(var(--border), 0.4)'
                        }}>
                        <Icon className="w-6 h-6" style={{ color: isSelected ? color : 'hsl(var(--muted-foreground))' }} />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-foreground mb-1 transition-colors">{title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
                    </div>
                    {isSelected && (
                        <div className="absolute top-3 right-3">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const CategoryCard: React.FC<{
    category: ReportCategory;
    icon: any;
    title: string;
    description: string;
    color: string;
    isSelected: boolean;
    onClick: () => void;
}> = ({ icon: Icon, title, description, color, isSelected, onClick }) => (
    <motion.div 
        whileHover={{ y: -4 }} 
        whileTap={{ scale: 0.97 }} 
        onClick={onClick}
        className="cursor-pointer h-full"
    >
        <Card className={`h-full border-1 transition-all duration-500 ${
            isSelected 
            ? "border-primary bg-primary/[0.03] shadow-xl shadow-primary/5" 
            : "border-border/60 bg-transparent hover:border-primary/20"
        }`} style={isSelected ? { borderColor: `${color}60` } : {}}>
            <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-500 border"
                        style={{
                            backgroundColor: isSelected ? `${color}20` : `${color}08`,
                            borderColor: isSelected ? `${color}40` : 'transparent',
                        }}>
                        <Icon className="w-7 h-7" style={{ color }} />
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h4>
                        <p className="text-[10px] text-muted-foreground mt-1 font-semibold opacity-70 italic">{description}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const FilterSection: React.FC = () => {
    const {
        filters, selectedCategory, departments, years, mentors, platforms,
        updateFilters, resetFilters, fetchDepartments, fetchYears, fetchMentors, fetchPlatforms,
    } = useAdminReportsStore();

    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        fetchDepartments(); fetchYears(); fetchMentors(); fetchPlatforms();
    }, [fetchDepartments, fetchYears, fetchMentors, fetchPlatforms]);

    const isStudentRelated = ["students", "performance", "comprehensive", "projects", "internships", "certifications"].includes(selectedCategory);
    const isProjectRelated = selectedCategory === "projects";
    const isInternshipRelated = selectedCategory === "internships";
    const isCertRelated = selectedCategory === "certifications";
    const isMentorRelated = selectedCategory === "mentors";

    return (
        <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden bg-card">
            <div className="p-6 border-b border-border/40 bg-foreground/[0.01] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                        <Filter className="text-primary w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Criteria Configuration</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Refine your data harvest</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-[10px] font-semibold uppercase tracking-widest text-destructive hover:bg-destructive/5 rounded-xl">
                    Clear Context
                </Button>
            </div>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 font-semibold uppercase tracking-widest text-[9px] text-muted-foreground">
                        <Label>Archive Start</Label>
                        <Input type="date" value={filters.startDate || ""} onChange={(e) => updateFilters({ startDate: e.target.value })} className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold" />
                    </div>
                    <div className="space-y-1.5 font-semibold uppercase tracking-widest text-[9px] text-muted-foreground">
                        <Label>Archive End</Label>
                        <Input type="date" value={filters.endDate || ""} onChange={(e) => updateFilters({ endDate: e.target.value })} className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {isStudentRelated && (
                        <>
                            <div className="space-y-1.5 font-semibold uppercase tracking-widest text-[9px] text-muted-foreground">
                                <Label>Academic Vertical</Label>
                                <Select value={filters.department || "all"} onValueChange={(v) => updateFilters({ department: v === "all" ? undefined : v })}>
                                    <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold"><SelectValue placeholder="All Domains" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="all">All Departments</SelectItem>
                                        {departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5 font-semibold uppercase tracking-widest text-[9px] text-muted-foreground">
                                <Label>Enrollment Year</Label>
                                <Select value={filters.year || "all"} onValueChange={(v) => updateFilters({ year: v === "all" ? undefined : v })}>
                                    <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold"><SelectValue placeholder="All Batches" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="all">All Years</SelectItem>
                                        {years.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {isMentorRelated && (
                        <div className="space-y-1.5 font-semibold uppercase tracking-widest text-[9px] text-muted-foreground col-span-full">
                            <Label>Faculty Advisor</Label>
                            <Select value={filters.mentorId || "all"} onValueChange={(v) => updateFilters({ mentorId: v === "all" ? undefined : v })}>
                                <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold"><SelectValue placeholder="All Mentors" /></SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Global Faculty</SelectItem>
                                    {mentors.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {isProjectRelated && (
                    <div className="space-y-1.5 font-semibold uppercase tracking-widest text-[9px] text-muted-foreground">
                        <Label>Project Pipeline Status</Label>
                        <Select value={filters.projectStatus || "All"} onValueChange={(v: any) => updateFilters({ projectStatus: v })}>
                            <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="All">All Phases</SelectItem>
                                <SelectItem value="Completed">Verified Completion</SelectItem>
                                <SelectItem value="In Progress">Active Development</SelectItem>
                                <SelectItem value="Pending">Queue Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {isInternshipRelated && (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5 font-semibold uppercase tracking-widest text-[9px] text-muted-foreground">
                            <Label>Experience Modality</Label>
                            <Select value={filters.internshipType || "All"} onValueChange={(v: any) => updateFilters({ internshipType: v })}>
                                <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="All">All Modalities</SelectItem>
                                    <SelectItem value="Industry">Industrial</SelectItem>
                                    <SelectItem value="Research">Academic Research</SelectItem>
                                    <SelectItem value="Startup">Venture/Startup</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5 font-semibold uppercase tracking-widest text-[9px] text-muted-foreground">
                            <Label>Validation Status</Label>
                            <Select value={filters.internshipStatus || "All"} onValueChange={(v: any) => updateFilters({ internshipStatus: v })}>
                                <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="All">All Verdicts</SelectItem>
                                    <SelectItem value="Approved">Validated</SelectItem>
                                    <SelectItem value="Pending">Under Audit</SelectItem>
                                    <SelectItem value="Rejected">Flagged</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {isCertRelated && (
                    <div className="space-y-1.5 font-semibold uppercase tracking-widest text-[9px] text-muted-foreground">
                        <Label>Certification Issuer</Label>
                        <Select value={filters.platform || "all"} onValueChange={(v) => updateFilters({ platform: v === "all" ? undefined : v })}>
                            <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 text-xs font-semibold"><SelectValue placeholder="All Boards" /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">Global Issuers</SelectItem>
                                {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="w-full h-11 rounded-xl border-dashed border-border text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:bg-muted/50 transition-all gap-2">
                    <Settings className={`w-4 h-4 transition-transform duration-500 ${showAdvanced ? 'rotate-180' : ''}`} />
                    {showAdvanced ? "Condense Filters" : "Extended Parameters"}
                </Button>

                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-5 overflow-hidden pt-2">
                            <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-1">Sort Metric</Label>
                                    <Select value={filters.sortBy || "name"} onValueChange={(v: any) => updateFilters({ sortBy: v })}>
                                        <SelectTrigger className="h-10 rounded-xl bg-background border-border/40 text-xs font-semibold"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="name">Identity</SelectItem><SelectItem value="points">Activity Points</SelectItem><SelectItem value="date">Registry Date</SelectItem></SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-1">Record Order</Label>
                                    <Select value={filters.sortOrder || "asc"} onValueChange={(v: any) => updateFilters({ sortOrder: v })}>
                                        <SelectTrigger className="h-10 rounded-xl bg-background border-border/40 text-xs font-semibold"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="asc">Ascending</SelectItem><SelectItem value="desc">Descending</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

const ReportPreview: React.FC = () => {
    const { reportPreview, isLoadingPreview } = useAdminReportsStore();

    if (isLoadingPreview) {
        return (
            <Card className="border-border/60 shadow-sm rounded-3xl p-6 space-y-4">
                <Skeleton className="h-8 w-1/3 rounded-lg" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
            </Card>
        );
    }

    if (!reportPreview) {
        return (
            <Card className="border-border/40 border-dashed border-2 rounded-[32px] bg-transparent">
                <CardContent className="p-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                        <Eye className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Awaiting Simulation</h4>
                    <p className="text-[11px] text-muted-foreground/60 mt-2 max-w-[200px] mx-auto font-medium leading-relaxed">
                        Execute a data simulation to visualize report structure before final generation.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const headers = reportPreview.sampleData.length > 0 ? Object.keys(reportPreview.sampleData[0]) : [];

    return (
        <Card className="border-primary/20 bg-card shadow-2xl rounded-[32px] overflow-hidden">
            <div className="p-6 border-b border-border/40 bg-primary/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Zap className="text-primary w-5 h-5 fill-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Simulator Verdict</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Audit ready telemetry</p>
                    </div>
                </div>
                <Badge variant="outline" className="h-6 rounded-lg text-[10px] font-black uppercase tracking-wider border-primary/20 text-primary bg-primary/5">Synthesized</Badge>
            </div>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-muted/20 border border-border/40">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Impact Count</p>
                        <p className="text-3xl font-black text-foreground tabular-nums">{reportPreview.totalRecords}</p>
                        <p className="text-[9px] font-medium text-muted-foreground opacity-70 uppercase mt-1">Total entities</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-1">Byte Weight</p>
                        <p className="text-3xl font-black text-primary tabular-nums">{reportPreview.estimatedFileSize}</p>
                        <p className="text-[9px] font-medium text-primary opacity-70 uppercase mt-1">Compressed estimate</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Telemetry Sample</Label>
                        <span className="text-[9px] font-semibold text-primary/60 uppercase">Real-time Header Map</span>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-muted/10 overflow-hidden">
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-foreground/[0.03] border-b border-border/40">
                                        {headers.map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                                                {h.replace(/([A-Z])/g, ' $1').trim()}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportPreview.sampleData.length === 0 ? (
                                        <tr>
                                            <td colSpan={headers.length || 1} className="p-10 text-center text-[10px] font-semibold text-muted-foreground uppercase">No data matches this criteria</td>
                                        </tr>
                                    ) : (
                                        reportPreview.sampleData.slice(0, 5).map((row, i) => (
                                            <tr key={i} className="border-b border-border/20 last:border-0 hover:bg-foreground/[0.01]">
                                                {headers.map((h) => (
                                                    <td key={h} className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/80 whitespace-nowrap">
                                                        {typeof row[h] === 'object' ? JSON.stringify(row[h]) : String(row[h])}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {reportPreview.sampleData.length > 5 && (
                        <p className="text-[9px] text-center font-semibold text-muted-foreground/60 uppercase tracking-widest italic">
                            + {reportPreview.totalRecords - 5} more records identified in protocol
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function AdminReports() {
    const {
        selectedType, selectedCategory, filters, isGenerating,
        setReportType, setReportCategory, generateReport, fetchReportPreview, validateFilters,
    } = useAdminReportsStore();

    const reportTypes = [
        { type: "pdf" as ReportType, icon: FileText, title: "Portable Document", description: "Standardized PDF for formal audits and executive sharing.", color: "#EF4444" },
        { type: "excel" as ReportType, icon: FileSpreadsheet, title: "Data Spreadsheet", description: "Comprehensive .xlsx format with full numerical mutability.", color: "#10B981" },
        { type: "csv" as ReportType, icon: FileSpreadsheet, title: "Raw Telemetry", description: "Comma-separated values for advanced external processing.", color: "#3B82F6" },
    ];

    const categories = [
        { category: "students" as ReportCategory, icon: Users, title: "Student Base", description: "Global profiles", color: "#6366F1" },
        { category: "mentors" as ReportCategory, icon: GraduationCap, title: "Faculty Registry", description: "Mentor audit", color: "#8B5CF6" },
        { category: "projects" as ReportCategory, icon: Briefcase, title: "Research Hub", description: "Submission flow", color: "#F59E0B" },
        { category: "internships" as ReportCategory, icon: Award, title: "Career Stream", description: "Approved roles", color: "#10B981" },
        { category: "certifications" as ReportCategory, icon: Star, title: "Credential Led", description: "Verified honors", color: "#F97316" },
        { category: "performance" as ReportCategory, icon: TrendingUp, title: "Analytics Engine", description: "KPI metrics", color: "#EF4444" },
        { category: "comprehensive" as ReportCategory, icon: LayoutGrid, title: "Global Master", description: "Full export", color: "#0EA5E9" },
    ];

    const handlePreview = () => validateFilters() && fetchReportPreview(selectedCategory, filters);
    const handleGenerate = async () => validateFilters() && generateReport({ 
        type: selectedType, category: selectedCategory, filter: filters, 
        options: { includeCharts: true, includeStatistics: true, includeRankings: selectedCategory === "performance" } 
    });

    return (
        <div className="min-h-screen bg-background pb-32">
            <GlobalNotification />
            <Header
                title="Intelligence Center"
                subtitle="High-fidelity reporting engine for academic oversight and performance auditing"
                HeaderComp={
                    <div className="flex gap-3">
                         <Button onClick={handlePreview} variant="outline" className="h-10 rounded-xl px-5 border-border/60 hover:bg-muted/50 font-semibold uppercase tracking-widest text-[9px] gap-2 transition-all">
                            <RefreshCw size={14} /> Simulate Data
                         </Button>
                         <Button onClick={handleGenerate} disabled={isGenerating} className="h-10 rounded-xl px-7 bg-primary text-primary-foreground font-semibold uppercase tracking-widest text-[9px] gap-2 shadow-lg shadow-primary/20 transition-all border border-primary/20">
                            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            {isGenerating ? "Exporting..." : "Execute Export"}
                         </Button>
                    </div>
                }
            />

            <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-12">
                
                {/* Format Selection */}
                <section>
                    <StepHeader step={1} title="Output Matrix" subtitle="Define the protocol for data delivery" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {reportTypes.map((t) => (
                            <ReportTypeCard key={t.type} {...t} isSelected={selectedType === t.type} onClick={() => setReportType(t.type)} />
                        ))}
                    </div>
                </section>

                {/* Domain Selection */}
                <section>
                    <StepHeader step={2} title="Domain Taxonomy" subtitle="Select the academic sector for extraction" />
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {categories.map((c) => (
                            <CategoryCard key={c.category} {...c} isSelected={selectedCategory === c.category} onClick={() => setReportCategory(c.category)} />
                        ))}
                    </div>
                </section>

                {/* Final step split */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <div className="space-y-8">
                         <StepHeader step={3} title="Configuration Layer" subtitle="Execute fine-grained audit filters" />
                         <FilterSection />
                    </div>

                    <div className="space-y-8">
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-foreground/[0.03] flex items-center justify-center border border-border/40">
                                   <PieChart className="text-muted-foreground w-5 h-5" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground">Operational Verdict</h3>
                            </div>
                         </div>
                         <ReportPreview />
                         
                         <div className="flex gap-4 pt-6">
                            <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:translate-y-[-2px] transition-all duration-300">
                               {isGenerating ? "Generating Protocol..." : "Generate & Synthesize"}
                            </Button>
                         </div>
                         
                         <div className="flex items-center gap-3 flex-wrap opacity-60">
                            {["End-to-End Encryption", "Instant Generation", "Verified Data"].map(tag => (
                                <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/40 border-dashed">
                                   <ShieldCheck size={12} className="text-emerald-600" />
                                   <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{tag}</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </section>
            </div>
        </div>
    );
}