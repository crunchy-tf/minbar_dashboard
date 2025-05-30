"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import type { DateRange } from "react-day-picker"
import { api } from "@/lib/api"
import { format } from "date-fns"

interface SentimentTrendsProps {
  dateRange?: DateRange
}

export function SentimentTrends({ dateRange }: SentimentTrendsProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSentimentTrends = async () => {
      if (!dateRange?.from || !dateRange?.to) return

      try {
        setLoading(true)
        setError(null)
        const startTime = dateRange.from.toISOString()
        const endTime = dateRange.to.toISOString()

        const sentimentData = await api.sentimentTrends(
          startTime,
          endTime,
          "hourly",
          "Concerned,Anxious,Satisfied,Angry",
        )

        // Transform the data for the chart
        const chartData: any = {}

        sentimentData.forEach((sentiment: any) => {
          sentiment.trend_data.forEach((point: any) => {
            const timestamp = point.timestamp
            if (!chartData[timestamp]) {
              chartData[timestamp] = { timestamp }
            }
            chartData[timestamp][sentiment.sentiment_label] = point.value
          })
        })

        const transformedData = Object.values(chartData).map((item: any) => ({
          ...item,
          time: format(new Date(item.timestamp), "MMM dd HH:mm"),
        }))

        setData(transformedData)
      } catch (error) {
        console.error("Failed to fetch sentiment trends:", error)
        setError("Failed to load sentiment trends")
      } finally {
        setLoading(false)
      }
    }

    fetchSentimentTrends()
  }, [dateRange])

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center">Loading sentiment trends...</div>
  }

  if (error) {
    return <div className="h-[300px] flex items-center justify-center text-red-500">{error}</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
        />
        <Tooltip
          formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, ""]}
          labelFormatter={(label) => `Time: ${label}`}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="Concerned" stroke="#ef4444" strokeWidth={2} name="Concerned" />
        <Line type="monotone" dataKey="Anxious" stroke="#f97316" strokeWidth={2} name="Anxious" />
        <Line type="monotone" dataKey="Satisfied" stroke="#22c55e" strokeWidth={2} name="Satisfied" />
        <Line type="monotone" dataKey="Angry" stroke="#dc2626" strokeWidth={2} name="Angry" />
      </LineChart>
    </ResponsiveContainer>
  )
}
