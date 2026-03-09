"use client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/layout";
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google';

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

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
});

export default function PrivateLayout({ children }: Props) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn(poppins.className, `${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background`)}>
      {/* <html className={`${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}> */}

      {/* <SidebarProvider defaultOpen>
        <AppSidebar /> */}
      {/* <LayoutWrapper> */}
      <div
      // id="content"
      // className={cn(
      //   "flex-1 flex flex-col",
      //   "min-h-screen relative"
      // )}
      >
        {children}
      </div>
      {/* </LayoutWrapper> */}
      {/* </SidebarProvider> */}
    </div>
  );
}