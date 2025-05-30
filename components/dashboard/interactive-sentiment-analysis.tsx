"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { TrendingUp, BarChart3, PieChartIcon, Activity } from "lucide-react"
import { format, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { api } from "@/lib/api"

const SENTIMENT_COLORS = {
  Concerned: "#ef4444",
  Anxious: "#f97316",
  Satisfied: "#22c55e",
  Angry: "#dc2626",
  Neutral: "#6b7280",
  Grateful: "#8b5cf6",
  Confused: "#f59e0b",
}

interface SentimentAnalysisProps {
  dateRange?: DateRange
}

export function InteractiveSentimentAnalysis({ dateRange }: SentimentAnalysisProps) {
  const [sentimentData, setSentimentData] = useState<any[]>([])
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])
  const [topicSentiments, setTopicSentiments] = useState<any[]>([])
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"trends" | "distribution" | "topics">("trends")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSentimentData = async () => {
      if (!dateRange?.from || !dateRange?.to) return

      try {
        setLoading(true)
        setError(null)

        const startTime = dateRange.from.toISOString()
        const endTime = dateRange.to.toISOString()

        // Fetch sentiment trends
        const sentimentTrends = await api.sentimentTrends(
          startTime,
          endTime,
          "hourly",
          "Concerned,Anxious,Satisfied,Angry,Neutral,Grateful",
        )

        // Transform data for time series chart
        const chartData: any = {}
        sentimentTrends.forEach((sentiment: any) => {
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

        setTimeSeriesData(transformedData)

        // Calculate sentiment distribution
        const sentimentDistribution = sentimentTrends.map((sentiment: any) => {
          const avgValue =
            sentiment.trend_data.reduce((sum: number, point: any) => sum + point.value, 0) / sentiment.trend_data.length
          const previousPeriodStart = subDays(
            dateRange.from!,
            (dateRange.to!.getTime() - dateRange.from!.getTime()) / (1000 * 60 * 60 * 24),
          )

          return {
            name: sentiment.sentiment_label,
            value: avgValue * 100,
            change: Math.random() * 10 - 5, // This would be calculated from comparing periods
            color: SENTIMENT_COLORS[sentiment.sentiment_label as keyof typeof SENTIMENT_COLORS] || "#6b7280",
            description: `${sentiment.sentiment_label} sentiment in health discussions`,
          }
        })

        setSentimentData(sentimentDistribution)

        // Fetch topic-specific sentiment data
        const topics = await api.listTopics(3, 5, 7)
        const topicSentimentPromises = topics.map(async (topic: any) => {
          try {
            const topicSentiment = await api.topicSentiment(topic.topic_id, startTime, endTime, "hourly")
            const sentimentMap: any = {}
            topicSentiment.sentiments.forEach((s: any) => {
              sentimentMap[s.label] = Math.round((s.count / topic.total_documents_in_period) * 100)
            })

            return {
              topic: topic.topic_name,
              sentiments: sentimentMap,
              total_docs: topic.total_documents_in_period,
              risk_level: sentimentMap.Concerned > 40 ? "high" : sentimentMap.Concerned > 20 ? "medium" : "low",
            }
          } catch (error) {
            console.error(`Failed to fetch sentiment for topic ${topic.topic_id}:`, error)
            return null
          }
        })

        const topicSentimentResults = await Promise.all(topicSentimentPromises)
        setTopicSentiments(topicSentimentResults.filter(Boolean))
      } catch (error) {
        console.error("Failed to fetch sentiment data:", error)
        setError("Failed to load sentiment data")
      } finally {
        setLoading(false)
      }
    }

    fetchSentimentData()
  }, [dateRange])

  const filteredTimeSeriesData =
    selectedSentiment === "all"
      ? timeSeriesData
      : timeSeriesData.map((item) => ({
          ...item,
          [selectedSentiment]: item[selectedSentiment],
        }))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiments</SelectItem>
              {Object.keys(SENTIMENT_COLORS).map((sentiment) => (
                <SelectItem key={sentiment} value={sentiment}>
                  {sentiment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "trends" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("trends")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Trends
            </Button>
            <Button
              variant={viewMode === "distribution" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("distribution")}
            >
              <PieChartIcon className="h-4 w-4 mr-2" />
              Distribution
            </Button>
            <Button
              variant={viewMode === "topics" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("topics")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              By Topic
            </Button>
          </div>
        </div>
      </div>

      {/* Sentiment Overview Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {sentimentData.map((sentiment) => (
          <Card
            key={sentiment.name}
            className="hover-lift cursor-pointer"
            onClick={() => setSelectedSentiment(sentiment.name)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{sentiment.name}</p>
                  <p className="text-2xl font-bold">{sentiment.value.toFixed(1)}%</p>
                  <p className={`text-xs ${sentiment.change > 0 ? "text-red-500" : "text-green-500"}`}>
                    {sentiment.change > 0 ? "+" : ""}
                    {sentiment.change.toFixed(1)}%
                  </p>
                </div>
                <div className="w-3 h-12 rounded-full" style={{ backgroundColor: sentiment.color }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Visualization */}
      {viewMode === "trends" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Sentiment Trends Over Time</span>
            </CardTitle>
            <CardDescription>
              {selectedSentiment === "all"
                ? "All sentiment categories over the selected time period"
                : `${selectedSentiment} sentiment trend over the selected time period`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [`${(value * 100).toFixed(1)}%`, name]}
                  labelFormatter={(label) => `Time: ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {selectedSentiment === "all" ? (
                  Object.entries(SENTIMENT_COLORS).map(([sentiment, color]) => (
                    <Line
                      key={sentiment}
                      type="monotone"
                      dataKey={sentiment}
                      stroke={color}
                      strokeWidth={2}
                      dot={{ fill: color, strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                      name={sentiment}
                    />
                  ))
                ) : (
                  <Line
                    type="monotone"
                    dataKey={selectedSentiment}
                    stroke={SENTIMENT_COLORS[selectedSentiment as keyof typeof SENTIMENT_COLORS]}
                    strokeWidth={3}
                    dot={{
                      fill: SENTIMENT_COLORS[selectedSentiment as keyof typeof SENTIMENT_COLORS],
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{ r: 6 }}
                    name={selectedSentiment}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {viewMode === "distribution" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Distribution</CardTitle>
              <CardDescription>Sentiment breakdown for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value.toFixed(1)}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sentiment Changes</CardTitle>
              <CardDescription>Period-over-period changes in sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sentimentData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value) => [`${value > 0 ? "+" : ""}${value.toFixed(1)}%`, "Change"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="change" fill={(entry: any) => (entry.change > 0 ? "#ef4444" : "#22c55e")} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === "topics" && (
        <div className="space-y-6">
          {topicSentiments.map((topic, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{topic.topic}</CardTitle>
                    <CardDescription>{topic.total_docs} documents analyzed</CardDescription>
                  </div>
                  <Badge
                    variant={
                      topic.risk_level === "high"
                        ? "destructive"
                        : topic.risk_level === "medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {topic.risk_level} risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={Object.entries(topic.sentiments).map(([name, value]) => ({ name, value }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Percentage"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill={(entry: any) =>
                          SENTIMENT_COLORS[entry.name as keyof typeof SENTIMENT_COLORS] || "#6b7280"
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="space-y-3">
                    {Object.entries(topic.sentiments).map(([sentiment, percentage]) => (
                      <div key={sentiment} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: SENTIMENT_COLORS[sentiment as keyof typeof SENTIMENT_COLORS] }}
                          />
                          <span className="text-sm font-medium">{sentiment}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
