"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MentorManagementRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/mentor/dashboard/assigned-students");
  }, [router]);

  return null;
}

