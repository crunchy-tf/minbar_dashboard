"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Activity,
  TrendingUp,
  MessageSquare,
  Search,
  Brain,
  BarChart3,
  AlertTriangle,
  FileText,
  Home,
} from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Topics",
    href: "/dashboard/topics",
    icon: MessageSquare,
  },
  {
    name: "Keywords",
    href: "/dashboard/keywords",
    icon: Search,
  },
  {
    name: "Real-time",
    href: "/dashboard/real-time",
    icon: Activity,
  },
  {
    name: "Insights",
    href: "/dashboard/insights",
    icon: Brain,
  },
  {
    name: "Analysis",
    href: "/dashboard/analysis",
    icon: BarChart3,
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: AlertTriangle,
  },
  {
    name: "Predictions",
    href: "/dashboard/predictions",
    icon: TrendingUp,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:text-primary",
              isActive
                ? "bg-muted text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
