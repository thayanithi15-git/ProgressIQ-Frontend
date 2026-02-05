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

// ⬇️ This one actually applies the font
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function PrivateLayout({ children }: Props) {
    const router = useRouter();

    return (
        <div className={cn(poppins.className, "antialiased min-h-screen bg-background")}>
            <SidebarProvider defaultOpen>
                {/* <AppSidebar /> */}
                <LayoutWrapper>
                    <div
                    id="content"
                    className={cn(
                      "flex-1 flex flex-col",
                      "min-h-screen relative"
                    )}
                    >
                        {children}
                    </div>
                </LayoutWrapper>
            </ SidebarProvider>
        </div>
    );
}