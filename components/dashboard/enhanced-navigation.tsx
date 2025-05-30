"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, MessageSquare, Search, Brain, Zap, Bell, FileText, Lightbulb } from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: Activity,
    description: "System overview and KPIs",
  },
  {
    name: "Topics",
    href: "/dashboard/topics",
    icon: MessageSquare,
    description: "Topic analysis and trends",
    badge: "12 active",
  },
  {
    name: "Analysis",
    href: "/dashboard/analysis",
    icon: TrendingUp,
    description: "Statistical analysis tools",
  },
  {
    name: "Keywords",
    href: "/dashboard/keywords",
    icon: Search,
    description: "Keyword management",
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
    description: "Alert management",
    badge: "3 new",
  },
  {
    name: "Predictions",
    href: "/dashboard/predictions",
    icon: Brain,
    description: "AI forecasting",
    badge: "Updated",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    description: "Generate reports",
  },
  {
    name: "Insights",
    href: "/dashboard/insights",
    icon: Lightbulb,
    description: "AI-powered insights",
    badge: "3 new",
  },
  {
    name: "Real-time",
    href: "/dashboard/real-time",
    icon: Zap,
    description: "Live monitoring",
    badge: "Live",
  },
]

export function EnhancedNavigation() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <item.icon
              className={cn(
                "mr-3 h-5 w-5 transition-colors",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="truncate">{item.name}</span>
                {item.badge && (
                  <Badge variant={isActive ? "secondary" : "outline"} className="ml-2 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <p
                className={cn(
                  "text-xs truncate transition-colors",
                  isActive ? "text-primary-foreground/70" : "text-muted-foreground/70",
                )}
              >
                {item.description}
              </p>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
