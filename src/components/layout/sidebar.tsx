'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Award,
    BookOpen,
    Users,
    Shield,
    TrendingUp,
    Settings,
    LayoutDashboard,
    Bell,
    Activity,
    Briefcase,
    HelpCircle,
    GraduationCap,
    Target,
    FileText,
    BarChart3,
    UserPlus,
    Search,
    Star,
    Download,
    Share2,
    MessageSquare,
    Building,
    Zap,
    CheckCircle,
    Globe,
    Eye,
    Plus,
    NotepadTextDashed
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarStore } from '@/store/layoutStore';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Image from 'next/image';
import { getEncryptedItem } from '@/utils/encryption';
import { adminSections, mentorSections, studentSections } from './sidebarData';

interface SidebarItem {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: string;
    description?: string;
}

const Sidebar: React.FC = () => {
    const { isOpen } = useSidebarStore();
    const router = useRouter();

    const [sessionData, setSessionData] = useState<any>(null);

    const pathname = usePathname();

  const [role, setRole] = useState<string>("student");
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    const decryptedRole = getEncryptedItem("role") || "student";

    const r = decryptedRole.toLowerCase();
    setRole(r);

    if (r === "admin") {
      setSections(adminSections("/admin/dashboard"));
    } else if (r === "mentor") {
      setSections(mentorSections("/mentor/dashboard"));
    } else {
      setSections(studentSections("/student/dashboard"));
    }
  }, []);

    // ✅ Load session from localStorage
    useEffect(() => {
        const savedSession = localStorage.getItem("credxUser");
        if (savedSession) {
            setSessionData(JSON.parse(savedSession));
        } else {
            // router.push("/");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("credxUser");
        setSessionData(null);
        router.push("/");
    };

    const SidebarButton: React.FC<{
        item: SidebarItem;
        isActive: boolean;
    }> = ({ item, isActive }) => {
        const content = (
            <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                    "w-full justify-start gap-2 h-10 my-1 transition-all duration-200 hover:bg-primary/15 hover:text-primary",
                    isActive && "bg-primary/10 text-primary",
                    !isOpen && "justify-center px-0"
                )}
                asChild
            >
                <Link href={item.href}>
                    <div className="flex items-center gap-2 w-full">
                        {React.createElement(item.icon, {
                            className: cn("h-5 w-5 flex-shrink-0", isActive && "text-primary"),
                        })}
                        {isOpen && <span className="truncate flex-1">{item.label}</span>}
                        {isOpen && item.badge && (
                            <Badge variant="secondary" className="ml-auto bg-primary/20 text-primary text-xs">
                                {item.badge}
                            </Badge>
                        )}
                    </div>
                </Link>
            </Button>
        );

        if (!isOpen && item.description) {
            return (
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                        <p className="font-medium text-[14px]">{item.label}</p>
                        <p className="text-[10px]">{item.description}</p>
                    </TooltipContent>
                </Tooltip>
            );
        }

        return content;
    };

    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <TooltipProvider>
            <aside className={cn(
                "fixed left-0 top-0 z-40 h-full shadow-md bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
                isOpen ? 'w-64' : 'w-16'
            )}>
                {/* Logo and Description */}
                <div className="p-4 border-b border-sidebar-border w-full gap-3 flex items-center justify-center">
                    {/* <div className="flex items-center gap-3 w-full mx-10"> */}
                        <Image
                            src="/progress_iq.png"
                            alt="Progress IQ Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10"
                        />
                        {isOpen && (
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
                                    Progress IQ
                                </span>
                                <div className="text-xs text-muted-foreground">Smart Activity Reporting</div>
                            </div>
                        )}
                    {/* </div> */}
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-4 px-3">
                        {sections.map((section) => (
                            <div key={section.title} className="space-y-2">
                                {isOpen && (
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                                        {section.title}
                                    </h3>
                                )}
                                {section.items.map((item: SidebarItem) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <SidebarButton
                                            key={item.href}
                                            item={item}
                                            isActive={isActive}
                                        />
                                    );
                                })}
                                <Separator />
                            </div>
                        ))}
                    </nav>
                </ScrollArea>

                <div className="p-4 border-t border-sidebar-border">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className='cursor-pointer'>
                            <Button
                                variant="ghost"
                                className="w-full p-2 h-auto hover:bg-sidebar-accent/50 transition-colors rounded-xl"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <Avatar className="h-11 w-11 border-2 border-sidebar-border shadow-sm">
                                        <AvatarFallback className={cn(
                                            "text-sm font-bold text-white",
                                            sessionData?.role === "recruiter"
                                                ? "bg-gradient-to-br from-purple-600 to-pink-600"
                                                : "bg-gradient-to-br from-primary to-accent"
                                        )}>
                                            {sessionData?.username ? getUserInitials(sessionData.username) : role.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    {isOpen && (
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-sm font-medium text-sidebar-foreground truncate">
                                                {sessionData?.username || role.charAt(0).toUpperCase() + role.slice(1)}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {sessionData?.email || ""}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs mt-1 px-2 py-0.5 rounded-md",
                                                    sessionData?.role === "recruiter"
                                                        ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20"
                                                        : "bg-primary/10 text-primary border-primary/20"
                                                )}
                                            >
                                                {sessionData?.role === "recruiter" ? "Recruiter" : "Learner"}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>

                        {/* Dropdown opens to the right of the profile */}
                        <DropdownMenuContent
                            align="end"
                            side="right"
                            sideOffset={8}
                            className="w-64 p-4 rounded-xl font-poppins shadow-lg border border-border bg-background"
                        >
                            {/* Profile Header */}
                            <div className="flex items-center gap-3 pb-3 border-b border-border">
                                <Avatar className="h-14 w-14 border-2 border-sidebar-border shadow-md">
                                    <AvatarFallback className={cn(
                                        "text-lg font-bold text-white",
                                        sessionData?.role === "recruiter"
                                            ? "bg-gradient-to-br from-purple-600 to-pink-600"
                                            : "bg-gradient-to-br from-primary to-accent"
                                    )}>
                                        {sessionData?.username ? getUserInitials(sessionData.username) : role.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                        {sessionData?.username || role.charAt(0).toUpperCase() + role.slice(1)}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {sessionData?.email || ""}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-xs mt-1 px-2 py-0.5",
                                            sessionData?.role === "recruiter"
                                                ? "bg-purple-500/10 text-purple-700 dark:text-purple-400"
                                                : "bg-primary/10 text-primary"
                                        )}
                                    >
                                        {sessionData?.role === "recruiter" ? "Recruiter Account" : "Learner Account"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-muted-foreground">Account Type:</span>
                                    <span className="font-medium text-xs text-foreground">
                                        {sessionData?.role === "recruiter" ? "Recruiter" : "Learner"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="font-medium text-xs text-foreground truncate max-w-[140px]">
                                        {sessionData?.email || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-muted-foreground">Signed In:</span>
                                    <span className="font-medium text-xs text-foreground">
                                        {sessionData?.signedInAt
                                            ? formatDate(sessionData.signedInAt)
                                            : "N/A"}
                                    </span>
                                </div>
                                {sessionData?.role === "user" && (
                                    <>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-muted-foreground">Credentials:</span>
                                            <span className="font-medium text-xs text-foreground">15</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-muted-foreground">NSQF Credits:</span>
                                            <span className="font-medium text-xs text-foreground">245</span>
                                        </div>
                                    </>
                                )}
                                {sessionData?.role === "recruiter" && (
                                    <>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-muted-foreground">Active Jobs:</span>
                                            <span className="font-medium text-xs text-foreground">12</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-muted-foreground">Shortlisted:</span>
                                            <span className="font-medium text-xs text-foreground">24</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-3 space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-sm"
                                    size="sm"
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Account Settings
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-sm"
                                    size="sm"
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    {sessionData?.role === "recruiter" ? "View Company Profile" : "View Profile"}
                                </Button>
                            </div>

                            {/* Logout Button */}
                            <div className="mt-2 pt-3 cursor-pointer border-t border-border">
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    className="w-full justify-start cursor-pointer py-2 hover:text-white text-red-500 hover:bg-red-500"
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> Logout
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>
        </TooltipProvider>
    );
};

export default Sidebar;