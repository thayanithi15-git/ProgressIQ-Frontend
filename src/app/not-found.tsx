'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Compass, Home, ArrowLeft } from 'lucide-react';

// ✅ Global font (add in globals.css or layout.tsx)
// body { font-family: 'Poppins', sans-serif; }

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4 font-[Poppins]">

      {/* Icon + Badge */}
      <div className="relative mb-4">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
          <Compass className="w-10 h-10 text-destructive" />
        </div>
        <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
          404
        </Badge>
      </div>

      {/* Title + Subtitle */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        The page you’re looking for doesn’t exist. Let’s get you back on track with Safe Yatra.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-md justify-center">
        <Button onClick={() => (window.location.href = '/dashboard')} className="flex cursor-pointer items-center gap-2 w-full">
          <Home className="w-4 h-4" /> Dashboard
        </Button>
        <Button onClick={() => window.history.back()} variant="outline" className="flex cursor-pointer items-center gap-2 w-full">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
      </div>

      {/* Contact Info */}
      <div className="mt-8 space-y-2 text-xs sm:text-sm">
        <p className="font-semibold">Need Help?</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Badge variant="outline">Emergency: +91-1234-567890</Badge>
          <Badge variant="outline">Support: support@safeyatra.in</Badge>
        </div>
      </div>
    </div>
  );
}
