"use client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/layout";
interface Props {
  children: React.ReactNode;
}
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function PrivateLayout({ children }: Props) {
  const router = useRouter();
  return (
    <div className={cn(poppins.className, "antialiased min-h-screen bg-background")}>
        <div
        >
          {children}
        </div>
    </div>
  );
}