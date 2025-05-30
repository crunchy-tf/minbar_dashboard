"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, TrendingDown, Eye } from "lucide-react"
import { api } from "@/lib/api"
import { format } from "date-fns"

interface HighConcernTopic {
  topic_id: string
  topic_name: string
  concern_score: number
  total_documents: number
  trend: "up" | "down" | "stable"
  last_updated: string
  risk_level: "high" | "medium" | "low"
}

interface HighestConcernTopicsProps {
  onTopicSelect?: (topicId: string) => void
  limit?: number
}

export function HighestConcernTopics({ onTopicSelect, limit = 5 }: HighestConcernTopicsProps) {
  const [topics, setTopics] = useState<HighConcernTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHighConcernTopics = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch topics with high concern scores
        const endTime = new Date().toISOString()
        const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

        const rankedTopics = await api.topRankedTopics(startTime, endTime, "hourly", "high_concern_score", limit)

        // Transform and enrich the data
        const enrichedTopics: HighConcernTopic[] = rankedTopics.map((topic: any) => ({
          topic_id: topic.id,
          topic_name: topic.name,
          concern_score: topic.score * 100, // Convert to percentage
          total_documents: Math.floor(Math.random() * 500) + 50, // Mock data
          trend: Math.random() > 0.5 ? "up" : "down",
          last_updated: new Date().toISOString(),
          risk_level: topic.score > 0.7 ? "high" : topic.score > 0.4 ? "medium" : "low",
        }))

        setTopics(enrichedTopics)
      } catch (error) {
        console.error("Failed to fetch high concern topics:", error)
        setError("Failed to load high concern topics")

        // Fallback mock data
        setTopics([
          {
            topic_id: "402",
            topic_name: "Hospitals Overwhelmed: Long Wait Times & Bed Shortages",
            concern_score: 78.5,
            total_documents: 264,
            trend: "up",
            last_updated: new Date().toISOString(),
            risk_level: "high",
          },
          {
            topic_id: "777",
            topic_name: "Unverified Rumors: New Virus Strain Emergence",
            concern_score: 65.2,
            total_documents: 189,
            trend: "up",
            last_updated: new Date().toISOString(),
            risk_level: "medium",
          },
          {
            topic_id: "1001",
            topic_name: "Mental Health Services Funding Debate",
            concern_score: 58.7,
            total_documents: 156,
            trend: "down",
            last_updated: new Date().toISOString(),
            risk_level: "medium",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchHighConcernTopics()
  }, [limit])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-green-500" />
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Highest Concern Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
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
            <AlertTriangle className="h-5 w-5" />
            <span>Highest Concern Topics</span>
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
          <AlertTriangle className="h-5 w-5" />
          <span>Highest Concern Topics</span>
        </CardTitle>
        <CardDescription>Topics with the highest concern sentiment levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div
              key={topic.topic_id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <Badge variant={getRiskColor(topic.risk_level)}>{topic.risk_level} risk</Badge>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(topic.trend)}
                    <span className={`text-xs ${topic.trend === "up" ? "text-red-500" : "text-green-500"}`}>
                      {topic.trend === "up" ? "Rising" : "Declining"}
                    </span>
                  </div>
                </div>
                <h4 className="font-medium text-sm leading-tight mb-2">{topic.topic_name}</h4>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{topic.total_documents} documents</span>
                  <span>Updated {format(new Date(topic.last_updated), "MMM dd, HH:mm")}</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Concern Level</span>
                    <span className="font-medium">{topic.concern_score.toFixed(1)}%</span>
                  </div>
                  <Progress value={topic.concern_score} className="h-2" />
                </div>
              </div>
              <div className="ml-4">
                <Button variant="outline" size="sm" onClick={() => onTopicSelect?.(topic.topic_id)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
