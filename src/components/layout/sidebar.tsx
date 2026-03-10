'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Settings,
    Eye,
    LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarStore } from '@/store/layoutStore';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/utils/notification';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

/* ─────────────────────────────────────────────────────────────
   COLLEGE THEME TOKENS (maps to CSS variables from theme)
   Navy  = var(--college-navy)   → oklch(0.278 0.105 264)
   Gold  = var(--college-gold)   → oklch(0.785 0.145 80)
   These are used via Tailwind where possible; raw CSS vars
   are used for things Tailwind can't express inline.
───────────────────────────────────────────────────────────── */

const Sidebar: React.FC = () => {
    const { isOpen } = useSidebarStore();
    const router = useRouter();
    const { showNotification } = useNotificationStore();

    const [sessionData, setSessionData] = useState<any>(null);
    const pathname = usePathname();
    const [role, setRole] = useState<string>('student');
    const [sections, setSections] = useState<any[]>([]);

    useEffect(() => {
        const decryptedRole = getEncryptedItem('role') || 'student';
        const r = decryptedRole.toLowerCase();
        setRole(r);

        if (r === 'admin') {
            setSections(adminSections('/admin/dashboard'));
        } else if (r === 'mentor') {
            setSections(mentorSections('/mentor/dashboard'));
        } else {
            setSections(studentSections('/student/dashboard'));
        }
    }, []);

    useEffect(() => {
        const savedSession = localStorage.getItem('credxUser');
        if (savedSession) {
            setSessionData(JSON.parse(savedSession));
        }
    }, []);

    const handleLogout = () => {
        // Show logout notification
        showNotification('You have been successfully logged out', 'success');
        
        // Clear all auth and app-related localStorage items
        // localStorage.removeItem('credxUser');
        // localStorage.removeItem('role');
        // localStorage.removeItem('theme-preference');
        // localStorage.removeItem('auth-token');
        // localStorage.removeItem('user-data');

        localStorage.clear();
        
        // Clear session state
        setSessionData(null);
        
        // Navigate to landing page after a brief delay
        setTimeout(() => {
            router.push('/');
        }, 500);
    };

    const getUserInitials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const formatRole = (r?: string) =>
        (r || 'student')
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

    const displayName = sessionData?.username || formatRole(role);
    const displayEmail = sessionData?.email || '';
    const displayRole = formatRole(sessionData?.role || role);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

    /* ── Active indicator pill ── */
    const ActivePip = () => (
        <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
            style={{ background: 'var(--college-gold)' }}
        />
    );

    /* ── Individual nav button ── */
    const SidebarButton: React.FC<{ item: SidebarItem; isActive: boolean }> = ({
        item,
        isActive,
    }) => {
        const content = (
            <Button
                variant="ghost"
                className={cn(
                    // base
                    'relative w-full justify-start gap-3 h-10 my-0.5 rounded-lg transition-all duration-200',
                    // default hover: very subtle navy tint
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    // collapsed center
                    !isOpen && 'justify-center px-0',
                    // active state: navy bg + gold text
                    isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                        : 'text-sidebar-foreground/80',
                )}
                asChild
            >
                <Link href={item.href}>
                    {/* Gold left pip when active */}
                    {isActive && <ActivePip />}

                    <div className={cn('flex items-center gap-3 w-full', !isOpen && 'justify-center')}>
                        {React.createElement(item.icon, {
                            className: cn(
                                'h-[18px] w-[18px] flex-shrink-0 transition-colors',
                                isActive
                                    ? 'text-[var(--college-gold)]'
                                    : 'text-sidebar-foreground/60',
                            ),
                        })}

                        {isOpen && (
                            <span className="truncate flex-1 text-[13.5px] tracking-wide font-poppins">
                                {item.label}
                            </span>
                        )}

                        {isOpen && item.badge && (
                            <Badge
                                variant="secondary"
                                className="ml-auto text-[10px] px-1.5 py-0 rounded-md font-semibold"
                                style={{
                                    background: 'var(--college-gold)',
                                    color: 'var(--college-navy-dark)',
                                }}
                            >
                                {item.badge}
                            </Badge>
                        )}
                    </div>
                </Link>
            </Button>
        );

        if (!isOpen) {
            return (
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent
                        side="right"
                        className="ml-2 rounded-lg border border-border bg-popover shadow-md px-3 py-2"
                    >
                        <p className="flex-1 text-gray-300 text-[11px] tracking-wide uppercase font-poppins">
                            {item.label}
                        </p>
                        {item.description && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                {item.description}
                            </p>
                        )}
                    </TooltipContent>
                </Tooltip>
            );
        }

        return content;
    };

    /* ── Role badge config ── */
    const isRecruiter = sessionData?.role === 'recruiter';
    const roleBadgeClass = isRecruiter
        ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
        : 'border-0 text-[var(--college-navy-dark)] dark:text-[var(--college-gold)]';
    const roleBadgeStyle = !isRecruiter
        ? { background: 'var(--college-gold)', color: 'var(--college-navy-dark)' }
        : {};

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 h-full flex flex-col',
                    'border-r border-sidebar-border',
                    'shadow-[2px_0_16px_0_hsl(220_40%_15%/0.18)]',
                    'transition-all duration-300 ease-in-out',
                    // Sidebar bg: deep navy from theme
                    'bg-sidebar',
                    isOpen ? 'w-64' : 'w-[60px]',
                )}
            >
                {/* ── Gold top accent line ── */}
                <div
                    className="w-full h-[3px] flex-shrink-0"
                    style={{
                        background:
                            'linear-gradient(90deg, var(--college-gold-dark), var(--college-gold), var(--college-gold-dark))',
                    }}
                />

                {/* ── Logo ── */}
                <div
                    className={cn(
                        'flex items-center border-b border-sidebar-border flex-shrink-0',
                        isOpen ? 'gap-3 px-4 py-3' : 'justify-center px-0 py-3',
                    )}
                >
                    <div
                        className="flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
                        style={{
                            width: 38,
                            height: 38,
                            background: 'var(--college-gold)',
                            boxShadow: '0 2px 8px var(--college-gold-dark)/40',
                        }}
                    >
                        <Image
                            src="/progress_iq.png"
                            alt="Progress IQ Logo"
                            width={28}
                            height={28}
                            className="object-contain"
                        />
                    </div>

                    {isOpen && (
                        <div className="min-w-0">
                            <span className="flex-1 text-gray-300 text-[18px] font-bold tracking-wide uppercase font-poppins">
                                Progress IQ
                            </span>
                            <p className="text-[10px] mt-0.5 tracking-widest uppercase font-poppins text-sidebar-foreground/50">
                                Smart Activity Reporting
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Navigation ── */}
                <ScrollArea className="flex-1 py-3">
                    <nav className={cn('space-y-3', isOpen ? 'px-3' : 'px-2')}>
                        {sections.map((section, si) => (
                            <div key={section.title} className="space-y-0.5">
                                {/* Section label */}
                                {isOpen && (
                                    <div className="flex items-center px-2 mb-1 relative w-full justify-start gap-3 h-10 my-0.5 rounded-lg transition-all duration-200">
                                        {/* <span */}
                                        <span className="flex-1 text-gray-300 text-[11px] tracking-wide uppercase font-poppins">
                                            {/* // className="text-[9.5px] font-bold  tracking-wide  uppercase  font-poppins" */}
                                            {/* // style={{ color: 'var(--college-gold-dark)' }} */}
                                        {/* > */}
                                            {section.title}
                                        </span>
                                        <div
                                            className="flex-1 h-px"
                                            style={{
                                                background:
                                                    'linear-gradient(90deg, var(--college-gold-dark)/40, transparent)',
                                            }}
                                        />
                                    </div>
                                )}

                                {section.items.map((item: SidebarItem) => (
                                    <SidebarButton
                                        key={item.href}
                                        item={item}
                                        isActive={pathname === item.href}
                                    />
                                ))}

                                {si < sections.length - 1 && (
                                    <div className="pt-2 pb-1 px-2">
                                        <Separator className="bg-sidebar-border/60" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </ScrollArea>

                {/* ── User profile / dropdown ── */}
                <div className="flex-shrink-0 border-t border-sidebar-border p-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    'w-full h-auto p-2 rounded-xl cursor-pointer',
                                    'hover:bg-sidebar-accent transition-colors duration-150',
                                    !isOpen && 'justify-center',
                                )}
                            >
                                <div className={cn('flex items-center gap-3 w-full', !isOpen && 'justify-center')}>
                                    {/* Avatar with gold ring */}
                                    <Avatar
                                        className="flex-shrink-0 h-9 w-9"
                                        style={{
                                            boxShadow: '0 0 0 1px white',
                                        }}
                                    >
                                        <AvatarFallback
                                            className="flex-1 text-white text-[13px] tracking-wide uppercase font-poppins font-semibold"
                                            style={{
                                                background: isRecruiter
                                                    ? 'linear-gradient(135deg,#7c3aed,#db2777)'
                                                    : 'linear-gradient(135deg, var(--college-navy), var(--college-navy-light))',
                                                color: 'white',
                                            }}
                                        >
                                            {displayName
                                                ? getUserInitials(displayName)
                                                : role.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    {isOpen && (
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="flex-1 text-gray-300 text-[14px] tracking-wide uppercase font-poppins">
                                                {displayName}
                                            </p>
                                            <p className="text-[10px] text-sidebar-foreground/50 truncate leading-tight mt-0.5">
                                                {displayEmail}
                                            </p>
                                            <div
                                                // variant="outline"
                                                className={cn('text-[13px] text-white mt-1 px-0.5 py-0 rounded-sm font-semibold')}
                                                // style={roleBadgeStyle}
                                            >
                                                {displayRole}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>

                        {/* ── Dropdown panel ── */}
                        <DropdownMenuContent
                            align="end"
                            side="right"
                            sideOffset={10}
                            className={cn(
                                'w-68 p-0 -ml-10 rounded-xl overflow-hidden',
                                'border border-border bg-background',
                                'shadow-[0_8px_32px_hsl(220_40%_15%/0.18)]',
                            )}
                        >
                            {/* Header band */}
                            <div
                                className="px-4 pt-4 pb-3"
                                style={{
                                    background:
                                        'linear-gradient(135deg, var(--college-navy-dark) 0%, var(--college-navy) 100%)',
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        className="h-14 w-14 flex-shrink-0"
                                        style={{ boxShadow: '0 0 0 1.5px ' }}
                                    >
                                        <AvatarFallback
                                            className="flex-1 text-foreground text-[18px] tracking-wide uppercase font-poppins font-semibold"
                                            style={{
                                                background: isRecruiter
                                                    ? 'linear-gradient(135deg,#7c3aed,#db2777)'
                                                    : 'linear-gradient(135deg, var(--college-navy-light), var(--college-navy))',
                                                // color: 'white',
                                            }}
                                        >
                                            {displayName
                                                ? getUserInitials(displayName)
                                                : role.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <p className="flex-1 text-foreground font-bold text-[11px] tracking-wide uppercase font-poppins">
                                            {displayName}
                                        </p>
                                        <p
                                            className="text-[11px] truncate mt-0.5"
                                            style={{ color: 'var(--college-gold-light)' }}
                                        >
                                            {displayEmail}
                                        </p>
                                        <Badge
                                            className="mt-1.5 text-[13px] text-foreground -ml-2 py-0.5 rounded-sm font- border-0"
                                            style={{
                                                background: isRecruiter
                                                    ? 'rgba(168,85,247,0.25)'
                                                    : 'var(--college-gold)',
                                                // color: 'white',
                                            }}
                                        >
                                            {displayRole}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Details grid */}
                            <div className="px-4 py-3 space-y-1.5 text-[13px] text-white">
                                {[
                                    { label: 'Account Type', value: displayRole },
                                    { label: 'Email', value: displayEmail || 'N/A', truncate: true },
                                    {
                                        label: 'Signed In',
                                        value: sessionData?.signedInAt ? formatDate(sessionData.signedInAt) : 'N/A',
                                    },
                                ].map(row => (
                                    <div key={row.label} className="flex justify-between items-center py-0.5">
                                        <span className="text-muted-foreground font-poppins">{row.label}</span>
                                        <span
                                            className={cn(
                                                'font-semibold font-poppins text-foreground',
                                                row.truncate && 'truncate max-w-[150px]',
                                            )}
                                        >
                                            {row.value}
                                        </span>
                                    </div>
                                ))}

                                {/* Role-specific stats */}
                                {(sessionData?.role === 'user' || sessionData?.role === 'recruiter') && (
                                    <>
                                        <Separator className="my-1.5" />
                                        {sessionData.role === 'user' && (
                                            <>
                                                <div className="flex justify-between items-center py-0.5">
                                                    <span className="text-muted-foreground font-poppins">Credentials</span>
                                                    <span
                                                        className="font-bold text-[13px] font-poppins"
                                                        style={{ color: 'var(--college-gold-dark)' }}
                                                    >
                                                        15
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center py-0.5">
                                                    <span className="text-muted-foreground font-poppins">NSQF Credits</span>
                                                    <span
                                                        className="font-bold text-[13px] font-poppins"
                                                        style={{ color: 'var(--college-gold-dark)' }}
                                                    >
                                                        245
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {sessionData.role === 'recruiter' && (
                                            <>
                                                <div className="flex justify-between items-center py-0.5">
                                                    <span className="text-muted-foreground font-poppins">Active Jobs</span>
                                                    <span className="font-bold text-[13px] font-poppins text-purple-600 dark:text-purple-400">12</span>
                                                </div>
                                                <div className="flex justify-between items-center py-0.5">
                                                    <span className="text-muted-foreground font-poppins">Shortlisted</span>
                                                    <span className="font-bold text-[13px] font-poppins text-purple-600 dark:text-purple-400">24</span>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="px-4 pb-3 space-y-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        'w-full justify-start text-[12px] h-8 rounded-lg font-poppins',
                                        'border-border hover:border-[var(--college-gold)]',
                                        'hover:text-[var(--college-gold-dark)] transition-colors',
                                    )}
                                >
                                    <Settings className="mr-2 h-3.5 w-3.5" />
                                    Account Settings
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        'w-full justify-start text-[12px] h-8 rounded-lg font-poppins',
                                        'border-border hover:border-[var(--college-gold)]',
                                        'hover:text-[var(--college-gold-dark)] transition-colors',
                                    )}
                                >
                                    <Eye className="mr-2 h-3.5 w-3.5" />
                                    {isRecruiter ? 'View Company Profile' : 'View Profile'}
                                </Button>
                            </div>

                            {/* Logout */}
                            <div className="px-4 pb-4 pt-1 border-t border-border">
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        'w-full justify-start text-[12px] h-8 rounded-lg font-poppins',
                                        'text-destructive hover:bg-destructive hover:text-destructive-foreground',
                                        'transition-colors duration-150',
                                    )}
                                >
                                    <LogOut className="mr-2 h-3.5 w-3.5" />
                                    Logout
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
