import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ClipboardList,
  FileText,
  BarChart3,
  Activity,
  MessageSquare,
  Award,
  Target,
  Star,
  Settings,
  ShieldCheck,
} from "lucide-react";

export interface SidebarItem {
  icon: any;
  label: string;
  href: string;
  description: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

/* ===================== ADMIN (7 → 3 + 4) ===================== */

export const adminSections = (base: string): SidebarSection[] => [

  /* ----- 3 ITEMS ----- */
  {
    title: "Core",
    items: [
      {
        icon: LayoutDashboard,
        label: "Analytics Dashboard",
        href: `${base}`,
        description: "Admin overview",
      },
      {
        icon: BarChart3,
        label: "Reporting",
        href: `${base}/reports`,
        description: "Charts & insights",
      },
      {
        icon: Activity,
        label: "Logs",
        href: `${base}/logs`,
        description: "Audit trail",
      },
    ],
  },

  /* ----- 4 ITEMS ----- */
  {
    title: "Administration",
    items: [
      {
        icon: Users,
        label: "Students",
        href: `${base}/students`,
        description: "Manage students",
      },
      {
        icon: Users,
        label: "Mentors",
        href: `${base}/mentors`,
        description: "Manage mentors",
      },
      {
        icon: FolderKanban,
        label: "Mappings",
        href: `${base}/mappings`,
        description: "Mentor-student map",
      },
      {
        icon: FileText,
        label: "Projects & Content",
        href: `${base}/projects`,
        description: "All projects",
      },
    ],
  },
];

/* ===================== MENTOR (4 → 2 + 2) ===================== */

export const mentorSections = (base: string): SidebarSection[] => [

  /* ----- 2 ITEMS ----- */
  {
    title: "Mentor Space",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: `${base}/dashboard`,
        description: "Mentor dashboard",
      },
      {
        icon: Users,
        label: "Management",
        href: `${base}/management`,
        description: "My students",
      },
    ],
  },

  /* ----- 2 ITEMS ----- */
  {
    title: "Review",
    items: [
      {
        icon: ShieldCheck,
        label: "Approvals & Feedback",
        href: `${base}/approvals`,
        description: "Verify works",
      },
      {
        icon: MessageSquare,
        label: "Surveys",
        href: `${base}/surveys`,
        description: "Survey module",
      },
    ],
  },
];

/* ===================== STUDENT (5 → 2 + 3) ===================== */

export const studentSections = (base: string): SidebarSection[] => [

  /* ----- 2 ITEMS ----- */
  {
    title: "Student Hub",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: `${base}/dashboard`,
        description: "My overview",
      },
      {
        icon: FileText,
        label: "Projects",
        href: `${base}/projects`,
        description: "My projects",
      },
    ],
  },

  /* ----- 3 ITEMS ----- */
  {
    title: "Activity Zone",
    items: [
      {
        icon: ClipboardList,
        label: "Tasks",
        href: `${base}/tasks`,
        description: "Assigned tasks",
      },
      {
        icon: Activity,
        label: "Activity & Surveys",
        href: `${base}/activity`,
        description: "Logs & surveys",
      },
      {
        icon: Star,
        label: "Profile & Rankings",
        href: `${base}/profile`,
        description: "Rank & profile",
      },
    ],
  },
];
