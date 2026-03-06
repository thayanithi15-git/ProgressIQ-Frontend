'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function MentorPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/mentor/dashboard');
  }, [router]);

  return null;
}