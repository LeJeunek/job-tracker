import {
  LayoutDashboard,
  Briefcase,
  Users,
  NotebookText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Applications", href: "/dashboard/applications", icon: Briefcase },
  { title: "Contacts", href: "/dashboard/contacts", icon: Users },
  { title: "Snippets", href: "/dashboard/snippets", icon: NotebookText },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];
