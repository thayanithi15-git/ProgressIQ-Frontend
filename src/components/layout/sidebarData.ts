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
  Trophy,
Briefcase,
User,
ClipboardCheck,
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
export const adminSections = (base: string): SidebarSection[] => [
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
        icon: Users,
        label: "User Management",
        href: `${base}/user-manage`,
        description: "Manage users",
      },
      {
        icon: Users,
        label: "Students",
        href: `${base}/students-manage`,
        description: "Manage students",
      },
      {
        icon: Users,
        label: "Mentors",
        href: `${base}/mentor-manage`,
        description: "Manage mentors",
      },
      {
        icon: Activity,
        label: "System Logs",
        href: `${base}/system-logs`,
        description: "Audit trail",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        icon: FileText,
        label: "Project Details",
        href: `${base}/projects`,
        description: "All projects",
      },
      {
        icon: Award,
        label: "Certifications",
        href: `${base}/certifications`,
        description: "All Certifications",
      },
      {
        icon: ClipboardList,
        label: "Tasks",
        href: `${base}/tasks`,
        description: "All Tasks",
      },
      {
        icon: Briefcase,
        label: "Internships",
        href: `${base}/internships`,
        description: "All Internships",
      },
      {
        icon: FileText,
        label: "Surveys",
        href: `${base}/surveys`,
        description: "All Surveys",
      },
      {
        icon: BarChart3,
        label: "Reporting",
        href: `${base}/reports`,
        description: "Charts & insights",
      },
    ],
  },
];
export const mentorSections = (base: string): SidebarSection[] => [
  {
    title: "Mentor Space",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: `${base}`,
        description: "Mentor dashboard",
      },
      {
        icon: Users,
        label: "Management",
        href: `${base}/assigned-students`,
        description: "My students",
      },
      {
        icon: FolderKanban,
        label: "Projects",
        href: `${base}/projects`,
        description: "Student projects",
      },
      {
        icon: ClipboardList,
        label: "Tasks",
        href: `${base}/tasks`,
        description: "Student tasks",
      },
      {
        icon: Award,
        label: "Certifications",
        href: `${base}/certifications`,
        description: "Student certifications",
      },
      {
        icon: Briefcase,
        label: "Internships",
        href: `${base}/internships`,
        description: "Student internships",
      },
    ],
  },
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
export const studentSections = (base: string): SidebarSection[] => [
  {
    title: "Overview",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: `${base}`,
        description: "Student overview",
      },
      {
        icon: Trophy,
        label: "Rankings",
        href: `${base}/rankings`,
        description: "My position",
      },
    ],
  },
  {
    title: "Work & Progress",
    items: [
      {
        icon: FileText,
        label: "Projects",
        href: `${base}/projects`,
        description: "Manage projects",
      },
      {
        icon: ClipboardList,
        label: "Tasks",
        href: `${base}/tasks`,
        description: "Assigned tasks",
      },
      {
        icon: Briefcase,
        label: "Internships",
        href: `${base}/internships`,
        description: "Internship records",
      },
      {
        icon: Award,
        label: "Certifications",
        href: `${base}/certifications`,
        description: "My certificates",
      },
    ],
  },
  {
    title: "Personal",
    items: [
      {
        icon: User,
        label: "Profile",
        href: `${base}/profile`,
        description: "Student profile",
      },
      {
        icon: ClipboardCheck,
        label: "Surveys",
        href: `${base}/surveys`,
        description: "Answer surveys",
      },
    ],
  },
];
