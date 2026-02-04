import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Bell,
  Briefcase,
  CalendarDays,
  CloudDownload,
  Database,
  File,
  FileWarning,
  FolderOpen,
  HelpCircle,
  History,
  LayoutDashboard,
  MapPin,
  PartyPopper,
  RefreshCw,
  Settings,
  ShieldAlert,
  ShieldEllipsis,
  UserCheck,
  UserCog,
  Users,
  Wrench
} from "lucide-react";

import { type SidebarData } from "@/types/types";
import { decryptData } from "@/utils/crypto";

// Helper function to safely get localStorage values
const getLocalStorageItem = (key: string, defaultValue: string): string => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  return localStorage.getItem(key) || defaultValue;
};

// Function to generate sidebar data (call this from useEffect)
export const generateSidebarData = (): SidebarData => {
  const name = getLocalStorageItem("name", "Guest User");
  const email = getLocalStorageItem("email", "guest@domain.com");

  const newEncryptedRole = localStorage.getItem("role");
  const appRole = newEncryptedRole ? decryptData(newEncryptedRole) : null;

  const formattedRole = appRole?.split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Admin";

  return {
    user: {
      name: `${name} (${formattedRole})`,
      email: email,
      avatar: "/avatars/admin.jpg",
    },
    teams: [
      {
        name: "Safe Yatra",
        logo: ShieldEllipsis,
        plan: "Smart Tourist Safety Monitoring & Incident Response System",
      },
    ],
    navGroups: [
  {
    title: "Surveillance & Insights",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Live Tracking",
        url: "/dashboard/live-tracking",
        icon: MapPin,
      },      
      {
        title: "Risk Zones",
        url: "/dashboard/risk-zones",
        icon: AlertTriangle,
      },
      {
        title: "Tourist Directory",
        url: "/dashboard/tourist-directory",
        icon: Users,
      },
      {
        title: "Alerts",
        url: "/dashboard/alerts",
        icon: Bell,
      },
    ],
  },
  {
    title: "Incident Management",
    items: [
      {
        title: "E-FIR Reports",
        url: "/dashboard/e-fir",
        icon: FileWarning,
      },
      {
        title: "Emergency Monitor",
        url: "/dashboard/emergency-monitor",
        icon: Activity,
      },
      {
        title: "Tourist Services",
        url: "/dashboard/tourist-services",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Support & Assistance",
    items: [
      {
        title: "Help Center",
        url: "/dashboard/help-center",
        icon: HelpCircle,
      },
    ],
  },
]
  };
};

// Default export for initial render (with fallback values)
export const sidebarData: SidebarData = {
  user: {
    name: "Guest User (Operator)",
    email: "guest@domain.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Safe Yatra",
      logo: ShieldEllipsis,
      plan: "Smart Tourist Safety Monitoring & Incident Response System",
    },
  ],
  navGroups: [
  {
    title: "Surveillance & Insights",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Live Tracking",
        url: "/dashboard/live-tracking",
        icon: MapPin,
      },
      {
        title: "Tourist Directory",
        url: "/dashboard/tourist-directory",
        icon: Users,
      },
      {
        title: "Alerts",
        url: "/dashboard/alerts",
        icon: Bell,
      },
    ],
  },
  {
    title: "Incident Management",
    items: [
      {
        title: "E-FIR Reports",
        url: "/dashboard/e-fir",
        icon: FileWarning,
      },
      {
        title: "Emergency Monitor",
        url: "/dashboard/emergency-monitor",
        icon: Activity,
      },
      {
        title: "Tourist Services",
        url: "/dashboard/tourist-services",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Support & Assistance",
    items: [
      {
        title: "Help Center",
        url: "/dashboard/help-center",
        icon: HelpCircle,
      },
    ],
  },
]
};