'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { PanelLeftIcon, Bell, Moon, Sun } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useSidebarStore } from '@/store/layoutStore';
import { useThemeStore } from '@/store/layoutStore';
import { cn } from '@/lib/utils';
import { getEncryptedItem } from '@/utils/encryption';
import { NotificationsDropdown } from './NotificationsDropdown';

type HeaderProps = {
    title?: string;
    subtitle?: string;
    username?: string;
    desc?: string;
    avatar?: string;
    HeaderComp?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({
    title = 'Dashboard',
    subtitle = 'Learner Portal',
    username = 'User Name',
    desc = 'NSQF Level 4',
    avatar = 'U',
    HeaderComp,
}) => {
    const { isOpen, toggleSidebar } = useSidebarStore();
    const { isDark, toggleTheme } = useThemeStore();

    const [sessionData, setSessionData] = useState<any>(null);

    // ✅ Load session from localStorage
    useEffect(() => {
        const savedSession = localStorage.getItem("credxUser");
        if (savedSession) {
            setSessionData(JSON.parse(savedSession));
        } else {
            // router.push("/");
        }
    }, []);

    const sections =
        sessionData?.role?.toLowerCase();

    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const [role, setRole] = useState<string>("student");

    useEffect(() => {
        const decryptedRole = getEncryptedItem("role") || "student";

        const r = decryptedRole.toLowerCase();
        setRole(r);
    }, []);

    const formatRole = (r?: string) =>
        (r || "student")
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

    const displayName = sessionData?.username || formatRole(role);
    const displayRole = formatRole(sessionData?.role || role);
    const displayEmail = sessionData?.email || "";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                        className="cursor-pointer"
                    >
                        <PanelLeftIcon className="h-10 w-10" />
                    </Button>

                    <div>
                        <span className="text-xl font-bold text-primary">{title}</span>
                        <div className="text-xs text-muted-foreground">{subtitle}</div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <NotificationsDropdown />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        className="h-9 w-9 p-0 cursor-pointer"
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4 transition-all" />
                        ) : (
                            <Moon className="h-4 w-4 transition-all" />
                        )}
                    </Button>

                    {HeaderComp}

                    <Separator orientation="vertical" className="h-8" />

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <div className="text-sm font-semibold">{displayName}</div>
                            <div className="text-xs text-muted-foreground">
                                {displayRole}{displayEmail ? ` • ${displayEmail}` : ''}
                            </div>
                        </div>
                        <Avatar className="h-11 w-11 border-2 border-sidebar-border shadow-sm">
                            <AvatarFallback className={cn(
                                "text-sm font-bold text-white",
                                sessionData?.role === "recruiter"
                                    ? "bg-gradient-to-br from-purple-600 to-pink-600"
                                    : "bg-gradient-to-br from-primary to-accent"
                            )}>
                                {displayName ? getUserInitials(displayName) : role.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
