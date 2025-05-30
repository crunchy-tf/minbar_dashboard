// app\dashboard\page.tsx
"use client"

import { useState } from "react"
import { AdvancedOverview } from "@/components/dashboard/advanced-overview"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Health Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights into public health discussions and sentiment trends across digital platforms
          </p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <AdvancedOverview />
    </div>
  )
}
