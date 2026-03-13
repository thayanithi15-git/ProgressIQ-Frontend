'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCircle2, ChevronRight, Info, AlertTriangle, PlayCircle, Briefcase, FileText, Award, X } from 'lucide-react';
import { useAppNotificationsStore } from '@/store/notificationsStore';
import { useRouter } from 'next/navigation';

const ICONS: Record<string, { icon: any; color: string; bg: string }> = {
  INFO:    { icon: Info, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  SUCCESS: { icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  WARNING: { icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  ERROR:   { icon: X, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  TASK:    { icon: PlayCircle, color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
  PROJECT: { icon: Briefcase, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  SURVEY:  { icon: FileText, color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
  POINTS:  { icon: Award, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
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
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const NotificationsDropdown = () => {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useAppNotificationsStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (n: any) => {
    if (!n.read) markAsRead(n._id);
    if (n.link) {
      router.push(n.link);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E2432] shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 px-5 py-4 bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Notifications</span>
                {unreadCount > 0 && (
                  <span className="flex items-center justify-center rounded-full bg-[#6366F1] px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
                >
                  <Check size={14} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden pt-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <Bell className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">You're all caught up!</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">No new notifications right now.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((n) => {
                    const Theme = ICONS[n.type] || ICONS.INFO;
                    const Icon = Theme.icon;
                    return (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`group relative flex cursor-pointer items-start gap-4 px-5 py-4 transition-all hover:bg-gray-50 dark:hover:bg-white/[0.02] border-b border-transparent hover:border-gray-100 dark:hover:border-gray-800/60 last:border-none ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}
                      >
                        {!n.read && (
                          <div className="absolute left-0 top-1/2 h-full w-[3px] -translate-y-1/2 bg-[#6366F1] rounded-r-md"></div>
                        )}
                        <div
                          className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: Theme.bg }}
                        >
                          <Icon size={16} strokeWidth={2.5} style={{ color: Theme.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          {n.title && (
                            <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-0.5 truncate pr-8">
                              {n.title}
                            </p>
                          )}
                          <p className={`text-[13px] leading-relaxed ${!n.read ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                            {n.message}
                          </p>
                          <p className="mt-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                            {formatTime(n.createdAt)}
                          </p>
                        </div>
                        {!n.read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markAsRead(n._id); }}
                            className="absolute right-5 top-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Mark as read"
                          >
                            <div className="h-2 w-2 rounded-full bg-[#6366F1]"></div>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800/60 p-3 bg-gray-50/80 dark:bg-white/[0.01]">
                <button
                  onClick={() => { setIsOpen(false); router.push('/student/dashboard/notifications'); }}
                  className="flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors"
                >
                  View all notifications <ChevronRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
