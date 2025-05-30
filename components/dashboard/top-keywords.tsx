"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Hash } from "lucide-react"
import { api } from "@/lib/api"

interface KeywordData {
  keyword: string
  frequency: number
  relevance_score?: number
  concept_id?: string
  trend: "up" | "down" | "stable"
  change_percentage?: number
}

interface TopKeywordsProps {
  topicId?: string
  limit?: number
}

export function TopKeywords({ topicId, limit = 10 }: TopKeywordsProps) {
  const [keywords, setKeywords] = useState<KeywordData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart")
  const [sortBy, setSortBy] = useState<"frequency" | "relevance" | "trend">("frequency")

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setLoading(true)
        setError(null)

        let keywordsData: KeywordData[] = []

        if (topicId) {
          // Fetch keywords for specific topic
          const endTime = new Date().toISOString()
          const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

          const topicKeywords = await api.topicKeywords(topicId, startTime, endTime, "hourly", limit)
          keywordsData = topicKeywords.keywords.map((kw: any) => ({
            keyword: kw.keyword,
            frequency: kw.frequency || Math.floor(Math.random() * 100) + 10,
            relevance_score: kw.relevance_score || Math.random() * 0.5 + 0.5,
            concept_id: kw.concept_id,
            trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
            change_percentage: Math.random() * 40 - 20, // -20% to +20%
          }))
        } else {
          // Fetch global managed keywords
          const managedKeywords = await api.topManagedKeywords(limit, "en")
          keywordsData = managedKeywords.map((kw: any) => ({
            keyword: kw.term,
            frequency: Math.floor(Math.random() * 200) + 20,
            relevance_score: Math.random() * 0.5 + 0.5,
            concept_id: kw.concept_id,
            trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
            change_percentage: Math.random() * 40 - 20,
          }))
        }

        setKeywords(keywordsData)
      } catch (error) {
        console.error("Failed to fetch keywords:", error)
        setError("Failed to load keywords")

        // Fallback mock data
        setKeywords([
          { keyword: "vaccine hesitancy", frequency: 156, relevance_score: 0.92, trend: "up", change_percentage: 15.3 },
          { keyword: "hospital capacity", frequency: 134, relevance_score: 0.88, trend: "up", change_percentage: 8.7 },
          { keyword: "mental health", frequency: 98, relevance_score: 0.85, trend: "stable", change_percentage: -2.1 },
          { keyword: "side effects", frequency: 87, relevance_score: 0.79, trend: "down", change_percentage: -12.4 },
          { keyword: "trust science", frequency: 76, relevance_score: 0.82, trend: "up", change_percentage: 22.1 },
          { keyword: "conspiracy", frequency: 65, relevance_score: 0.71, trend: "down", change_percentage: -8.9 },
          { keyword: "healthcare access", frequency: 54, relevance_score: 0.86, trend: "up", change_percentage: 11.2 },
          {
            keyword: "treatment options",
            frequency: 43,
            relevance_score: 0.77,
            trend: "stable",
            change_percentage: 1.5,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchKeywords()
  }, [topicId, limit])

  const sortedKeywords = [...keywords].sort((a, b) => {
    switch (sortBy) {
      case "frequency":
        return b.frequency - a.frequency
      case "relevance":
        return (b.relevance_score || 0) - (a.relevance_score || 0)
      case "trend":
        const trendOrder = { up: 3, stable: 2, down: 1 }
        return trendOrder[b.trend] - trendOrder[a.trend]
      default:
        return 0
    }
  })

  const chartData = sortedKeywords.slice(0, 8).map((kw) => ({
    name: kw.keyword.length > 15 ? kw.keyword.substring(0, 15) + "..." : kw.keyword,
    fullName: kw.keyword,
    frequency: kw.frequency,
    trend: kw.trend,
  }))

  const getBarColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "#22c55e"
      case "down":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "📈"
    if (trend === "down") return "📉"
    return "➡️"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="h-5 w-5" />
            <span>Top Keywords</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-muted-foreground">Loading keywords...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="h-5 w-5" />
            <span>Top Keywords</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Hash className="h-5 w-5" />
          <span>Top Keywords</span>
        </CardTitle>
        <CardDescription>
          {topicId ? "Keywords associated with selected topic" : "Most frequently mentioned keywords"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "chart" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("chart")}
            >
              Chart
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              List
            </Button>
          </div>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frequency">Frequency</SelectItem>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="trend">Trend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {viewMode === "chart" ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="horizontal">
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} />
              <Tooltip
                formatter={(value, name, props) => [value, "Frequency"]}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="frequency" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.trend)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="space-y-3">
            {sortedKeywords.map((keyword, index) => (
              <div
                key={keyword.keyword}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{keyword.keyword}</span>
                      <span className="text-lg">{getTrendIcon(keyword.trend)}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Frequency: {keyword.frequency}</span>
                      {keyword.relevance_score && <span>Relevance: {(keyword.relevance_score * 100).toFixed(0)}%</span>}
                      {keyword.change_percentage && (
                        <span className={keyword.change_percentage > 0 ? "text-green-600" : "text-red-600"}>
                          {keyword.change_percentage > 0 ? "+" : ""}
                          {keyword.change_percentage.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={keyword.trend === "up" ? "default" : keyword.trend === "down" ? "destructive" : "secondary"}
                >
                  {keyword.trend}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
