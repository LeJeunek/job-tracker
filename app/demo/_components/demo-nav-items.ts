import { LayoutDashboard, Briefcase, type LucideIcon } from "lucide-react";

export type DemoNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const demoNavItems: DemoNavItem[] = [
  { title: "Overview", href: "/demo", icon: LayoutDashboard },
  { title: "Applications", href: "/demo/applications", icon: Briefcase },
];
