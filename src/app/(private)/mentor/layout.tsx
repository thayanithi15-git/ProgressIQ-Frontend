"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import Header from "@/components/layout/header";

interface Props {
  children: React.ReactNode;
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function MentorLayout({ children }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role");
    if (role && role !== "mentor") {
      router.push("/");
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn(poppins.className, "antialiased min-h-screen bg-background")}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto w-full">
          <div className="container mx-auto py-6 px-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}