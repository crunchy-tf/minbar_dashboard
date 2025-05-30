"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { DateRange } from "react-day-picker"
import { api } from "@/lib/api"
import { format } from "date-fns"

interface TopicTrendProps {
  topicId?: string | null
  dateRange?: DateRange
}

export function TopicTrend({ topicId, dateRange }: TopicTrendProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [topicName, setTopicName] = useState<string>("")

  useEffect(() => {
    const fetchTopicTrend = async () => {
      if (!topicId || !dateRange?.from || !dateRange?.to) {
        setData([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const startTime = dateRange.from.toISOString()
        const endTime = dateRange.to.toISOString()

        const trendData = await api.topicTrend(topicId, startTime, endTime, "hourly")

        setTopicName(trendData.topic_name)

        const chartData = trendData.trend_data.map((point: any) => ({
          time: format(new Date(point.timestamp), "MMM dd HH:mm"),
          value: point.value,
          timestamp: point.timestamp,
        }))

        setData(chartData)
      } catch (error) {
        console.error("Failed to fetch topic trend:", error)
        setError("Failed to load topic trend data")
      } finally {
        setLoading(false)
      }
    }

    fetchTopicTrend()
  }, [topicId, dateRange])

  if (!topicId) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Select a topic to view its trend analysis
      </div>
    )
  }

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center">Loading trend data for topic {topicId}...</div>
  }

  if (error) {
    return <div className="h-[300px] flex items-center justify-center text-red-500">{error}</div>
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No trend data available for the selected time period
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{topicName}</h3>
        <p className="text-sm text-muted-foreground">Document volume over time (Topic ID: {topicId})</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            formatter={(value: any) => [`${value} documents`, "Volume"]}
            labelFormatter={(label) => `Time: ${label}`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
