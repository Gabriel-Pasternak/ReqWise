import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, ListChecks, FilePlus, Settings, GitFork } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string; // Add your app's URL here
  ogImage: string; // Add your OG image URL here
  mainNav: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: "ReqWise",
  description: "Intelligent Requirement Management",
  url: "https://reqwise.example.com", // Replace with your actual URL
  ogImage: "https://reqwise.example.com/og.png", // Replace with your actual OG image
  mainNav: [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Requirements",
      href: "/requirements",
      icon: ListChecks,
    },
    {
      title: "Add Requirement",
      href: "/requirements/new",
      icon: FilePlus,
    },
    {
      title: "Version Control",
      href: "/versions",
      icon: GitFork,
      disabled: true, // For Version Tree feature
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      disabled: true, // For Custom Fields management
    },
  ],
};
