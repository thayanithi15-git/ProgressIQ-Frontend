import { SearchProvider } from "@/components/searchProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeInitializer } from "@/components/theme-initializer";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
// import GlobalNotification from "@/components/notify/snackbar";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Progress IQ",
  description: "Progress IQ - Smart Activity Reporting Dashboard",
  icons: {
    icon: "/progress_iq.png",
    shortcut: "/progress_iq.png",
    apple: "/progress_iq.png",
    // shortcut: "/logo.png",
    // apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(poppins.className, "antialiased min-h-screen bg-background")}
      >
        {/* <GlobalNotification /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeInitializer />
          <SearchProvider>{children}</SearchProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
