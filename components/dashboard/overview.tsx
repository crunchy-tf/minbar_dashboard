"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { api } from "@/lib/api"
import { format, subDays } from "date-fns"

interface OverviewData {
  name: string
  documents: number
  topics: number
  timestamp: string
}

export function Overview() {
  const [data, setData] = useState<OverviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get data for the last 7 days
        const promises = []
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i)
          promises.push(api.overview(1)) // Get data for each day
        }

        const results = await Promise.all(promises)

        const chartData: OverviewData[] = results.map((result, index) => {
          const date = subDays(new Date(), 6 - index)
          return {
            name: format(date, "MMM dd"),
            documents: result.total_documents_processed || 0,
            topics: result.active_topics_count || 0,
            timestamp: date.toISOString(),
          }
        })

        setData(chartData)
      } catch (error) {
        console.error("Failed to fetch overview data:", error)
        setError("Failed to load overview data")
      } finally {
        setLoading(false)
      }
    }

    fetchOverviewData()
  }, [])

  if (loading) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading overview data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="documents" stroke="#3b82f6" strokeWidth={2} name="Documents" />
        <Line type="monotone" dataKey="topics" stroke="#10b981" strokeWidth={2} name="Active Topics" />
      </LineChart>
    </ResponsiveContainer>
  )
}
