'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { useNotificationStore } from '@/utils/notification';

const GlobalNotification = () => {
  const { open, content, type, hideNotification } = useNotificationStore();

  useEffect(() => {
    if (open && type !== 'pending') {
      const timer = setTimeout(() => {
        hideNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [open, type, hideNotification]);

  const handleClose = () => {
    hideNotification();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'pending':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/30';
      case 'error':
        return 'bg-rose-600 border-rose-500 text-white shadow-rose-500/30';
      case 'warning':
        return 'bg-amber-500 border-amber-400 text-white shadow-amber-500/30';
      case 'pending':
        return 'bg-gray-200 border-gray-500 text-black shadow-gray-500/30';
      default:
        return 'bg-sky-500 border-sky-400 text-white shadow-sky-500/30';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-top-2 fade-in duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border-2 min-w-[320px] max-w-[420px] font-poppins ${getColorClasses()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <span className="flex-1 text-sm font-medium leading-snug">{content}</span>
        {type !== 'pending' && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-all duration-200 active:scale-95"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GlobalNotification;