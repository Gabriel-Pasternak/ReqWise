
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, ListChecks, FilePlus, Settings, GitFork, BarChartHorizontalBig } from "lucide-react"; // Added BarChartHorizontalBig

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mainNav: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: "ReqWise",
  description: "Intelligent Requirement Management",
  url: "https://reqwise.example.com", 
  ogImage: "https://reqwise.example.com/og.png", 
  mainNav: [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Requirements List", // Changed for clarity
      href: "/requirements",
      icon: ListChecks,
    },
    {
      title: "Add Requirement",
      href: "/requirements/new",
      icon: FilePlus,
    },
    // Example of how to add another nav item if needed for e.g. analytics/reporting
    // {
    //   title: "Analytics",
    //   href: "/analytics",
    //   icon: BarChartHorizontalBig, 
    //   disabled: true, 
    // },
    {
      title: "Version Control",
      href: "/versions",
      icon: GitFork,
      disabled: true, 
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      disabled: true, 
    },
  ],
};
