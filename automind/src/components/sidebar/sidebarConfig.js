import {
  LayoutDashboard,
  Car,
  Bell,
  Calendar,
  Settings,
  LogOut,
  BarChart3,
  Shield,
  Brain,
  Package,
  Wrench,
} from "lucide-react";

/* CUSTOMER SIDEBAR */
export const customerMenu = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/customer/dashboard" },
  { icon: Car, label: "My Vehicles", path: "/customer/dashboard" },
  { icon: Bell, label: "Alerts", path: "/customer/alerts" },
  { icon: Calendar, label: "Services", path: "/customer/services" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

/* OEM SIDEBAR */
export const oemMenu = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/oem/dashboard" },
  { icon: BarChart3, label: "Analytics", path: "/oem/analytics" },
  { icon: Brain, label: "Insights", path: "/oem/insights" },
  { icon: Shield, label: "Security", path: "/oem/security" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

/* SERVICE SIDEBAR */
export const serviceMenu = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/service/dashboard" },
  { icon: Package, label: "Inventory", path: "/service/inventory" },
  { icon: Calendar, label: "Schedule", path: "/service/schedule" },
  { icon: Wrench, label: "Technicians", path: "/service/technicians" },
  { icon: Settings, label: "Settings", path: "/settings" },
];
