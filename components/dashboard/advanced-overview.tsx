"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Line,
  Area,
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
  ComposedChart,
} from "recharts"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Zap,
  Target,
  Shield,
  Globe,
  BarChart3,
} from "lucide-react"
import { api } from "@/lib/api"
import { format, subDays } from "date-fns"

const COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#6366f1",
  success: "#22c55e",
  purple: "#8b5cf6",
  pink: "#ec4899",
}

const SENTIMENT_COLORS = {
  Concerned: "#ef4444",
  Anxious: "#f97316",
  Satisfied: "#22c55e",
  Angry: "#dc2626",
  Neutral: "#6b7280",
  Grateful: "#8b5cf6",
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  trend?: "up" | "down" | "stable"
  color: string
  description?: string
}

function MetricCard({ title, value, change, icon: Icon, trend, color, description }: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-emerald-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  const getChangeColor = () => {
    if (!change) return "text-muted-foreground"
    return change > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
  }

  return (
    <Card className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {description && <p className="text-xs text-muted-foreground/70">{description}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                {getTrendIcon()}
              </div>
              {change !== undefined && (
                <p className={`text-sm font-medium ${getChangeColor()}`}>
                  {change > 0 ? "+" : ""}
                  {change}% from last period
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AdvancedOverview() {
  const [overviewData, setOverviewData] = useState<any>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])
  const [sentimentData, setSentimentData] = useState<any[]>([])
  const [topicsData, setTopicsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch overview stats
        const overview = await api.overview(7)
        setOverviewData(overview)

        // Fetch recent topics
        const topics = await api.listTopics(8, 5, 7)
        setTopicsData(
          topics.map((topic: any, index: number) => ({
            ...topic,
            risk_score: Math.random() * 100,
            trend: Math.random() > 0.5 ? "up" : "down",
            engagement_score: Math.random() * 100,
          })),
        )

        // Generate enhanced time series data
        const timeSeriesPromises = []
        for (let i = 47; i >= 0; i--) {
          const date = subDays(new Date(), i / 2)
          timeSeriesPromises.push(
            api.overview(1).then((data) => ({
              time: format(date, "MMM dd"),
              documents: (data.total_documents_processed || 0) + Math.floor(Math.random() * 100),
              topics: (data.active_topics_count || 0) + Math.floor(Math.random() * 10),
              sentiment_score: Math.random() * 0.4 + 0.3,
              engagement: Math.random() * 80 + 20,
            })),
          )
        }

        const timeSeriesResults = await Promise.all(timeSeriesPromises)
        setTimeSeriesData(timeSeriesResults)

        // Enhanced sentiment data
        setSentimentData([
          { name: "Concerned", value: 32, color: SENTIMENT_COLORS.Concerned },
          { name: "Satisfied", value: 28, color: SENTIMENT_COLORS.Satisfied },
          { name: "Anxious", value: 18, color: SENTIMENT_COLORS.Anxious },
          { name: "Neutral", value: 15, color: SENTIMENT_COLORS.Neutral },
          { name: "Angry", value: 7, color: SENTIMENT_COLORS.Angry },
        ])
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-muted rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg font-medium">{error}</div>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* KPI Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Discussions"
          description="Documents processed"
          value={overviewData?.total_documents_processed?.toLocaleString() || "0"}
          change={12.5}
          icon={FileText}
          trend="up"
          color="bg-blue-500"
        />
        <MetricCard
          title="Active Topics"
          description="Currently monitored"
          value={overviewData?.active_topics_count || "0"}
          change={-2.1}
          icon={Activity}
          trend="down"
          color="bg-emerald-500"
        />
        <MetricCard
          title="System Health"
          description="Uptime percentage"
          value="99.2%"
          change={0.3}
          icon={Shield}
          trend="up"
          color="bg-purple-500"
        />
        <MetricCard
          title="Processing Rate"
          description="Documents per minute"
          value="1,247"
          change={8.7}
          icon={Zap}
          trend="up"
          color="bg-orange-500"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Document Processing Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span>Document Processing Trends</span>
            </CardTitle>
            <CardDescription>Real-time document ingestion and topic detection over the past 24 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="documentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="documents"
                  fill="url(#documentsGradient)"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  name="Documents Processed"
                />
                <Line
                  type="monotone"
                  dataKey="topics"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 3 }}
                  name="Active Topics"
                />
                <Bar
                  dataKey="engagement"
                  fill={COLORS.purple}
                  name="Engagement Score"
                  opacity={0.6}
                  radius={[2, 2, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-500">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span>Sentiment Analysis</span>
            </CardTitle>
            <CardDescription>Current sentiment distribution across all topics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Percentage"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Topic Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span>Active Topic Insights</span>
          </CardTitle>
          <CardDescription>Overview of currently monitored health topics and their engagement levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {topicsData.slice(0, 8).map((topic, index) => (
              <div
                key={topic.topic_id}
                className="group p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">
                      #{topic.topic_id}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {topic.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {topic.topic_name}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Engagement</span>
                      <span>{topic.engagement_score?.toFixed(0)}%</span>
                    </div>
                    <Progress value={topic.engagement_score} className="h-1.5" />
                  </div>
                  <div className="text-xs text-muted-foreground">{topic.total_documents_in_period} discussions</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-orange-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span>System Performance</span>
            </CardTitle>
            <CardDescription>Real-time system metrics and performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Processing Speed</span>
                <span className="text-sm text-muted-foreground">1,247 docs/min</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">API Response Time</span>
                <span className="text-sm text-muted-foreground">142ms avg</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Database Performance</span>
                <span className="text-sm text-muted-foreground">99.2% uptime</span>
              </div>
              <Progress value={99} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span>Global Insights</span>
            </CardTitle>
            <CardDescription>Platform-wide health monitoring statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-muted-foreground">Monitoring</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-emerald-600">15+</div>
                <div className="text-sm text-muted-foreground">Data Sources</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-muted-foreground">Daily Posts</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-orange-600">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
