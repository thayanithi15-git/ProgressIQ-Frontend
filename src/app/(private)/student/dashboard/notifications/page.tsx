'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCircle2, Info, AlertTriangle, PlayCircle, Briefcase, FileText, Award, X, Trash2 } from 'lucide-react';
import { useAppNotificationsStore } from '@/store/notificationsStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/utils/api';
import { useNotificationStore as useToastStore } from '@/utils/notification';
import Header from '@/components/layout/header';

const ICONS: Record<string, { icon: any; color: string; bg: string }> = {
  INFO: { icon: Info, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  SUCCESS: { icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  WARNING: { icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  ERROR: { icon: X, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  TASK: { icon: PlayCircle, color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
  PROJECT: { icon: Briefcase, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  SURVEY: { icon: FileText, color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
  POINTS: { icon: Award, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
};

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins || 1}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function NotificationsPage() {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useAppNotificationsStore();
  const router = useRouter();
  const { addNotification } = useToastStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = (n: any) => {
    if (!n.read) markAsRead(n._id);
    if (n.link) {
      router.push(n.link);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/notifications/${id}`);
      fetchNotifications();
      addNotification("Notification deleted", "success");
    } catch (error) {
      console.error("Failed to delete notification", error);
      addNotification("Failed to delete notification", "error");
    }
  };

  return (
    <div>
      <Header title="Notifications" subtitle='Stay updated with your latest tasks, projects, and announcements' />
      <div className="p-6 mt-3 max-w-5xl mx-auto w-full font-poppins space-y-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="default" className="bg-primary text-white rounded-full">
                  {unreadCount} New
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">Stay updated with your latest tasks, projects, and announcements.</p>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={() => markAllAsRead()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No notifications yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">When you get notifications, they'll show up here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border rounded-lg overflow-hidden">
                <AnimatePresence initial={false}>
                  {notifications.map((n) => {
                    const Theme = ICONS[n.type] || ICONS.INFO;
                    const Icon = Theme.icon;
                    return (
                      <motion.div
                        key={n._id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          onClick={() => handleNotificationClick(n)}
                          className={`group relative flex cursor-pointer items-start gap-4 p-5 transition-all hover:bg-muted/50 ${!n.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                        >
                          {!n.read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></div>
                          )}

                          <div
                            className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105"
                            style={{ backgroundColor: Theme.bg }}
                          >
                            <Icon size={24} strokeWidth={2.5} style={{ color: Theme.color }} />
                          </div>

                          <div className="flex-1 min-w-0 pr-12">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              {n.title && (
                                <h4 className={`text-md font-semibold truncate ${!n.read ? 'text-foreground' : 'text-foreground/80'}`}>
                                  {n.title}
                                </h4>
                              )}
                              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                {formatTime(n.createdAt)}
                              </span>
                            </div>

                            <p className={`text-sm leading-relaxed ${!n.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                              {n.message}
                            </p>

                            {n.link && (
                              <div className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline">
                                View details
                              </div>
                            )}
                          </div>

                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!n.read && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                onClick={(e) => { e.stopPropagation(); markAsRead(n._id); }}
                                title="Mark as read"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => handleDelete(n._id, e)}
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
