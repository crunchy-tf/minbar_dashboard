"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { format } from "date-fns"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"

interface Topic {
  topic_id: string
  topic_name: string
  total_documents_in_period: number
  last_seen: string
}

export function RecentTopics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingMockData, setIsUsingMockData] = useState(false)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true)
        setError(null)

        // First check API health
        const healthCheck = await api.health()
        if (healthCheck.status === "cors_error") {
          setIsUsingMockData(true)
        }

        const data = await api.listTopics(5, 5, 7)
        setTopics(data)

        // If we got here without error and health was ok, we're using real data
        if (healthCheck.status === "ok") {
          setIsUsingMockData(false)
        }
      } catch (error) {
        console.error("Failed to fetch topics:", error)
        setError("Failed to load topics")
        setIsUsingMockData(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading topics...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      {isUsingMockData && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <div className="flex items-center justify-between">
              <span>Using demo data - API connection unavailable</span>
              <Badge variant="outline" className="ml-2">
                <WifiOff className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!isUsingMockData && topics.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Recent Topics</span>
          <Badge variant="outline" className="text-green-600 border-green-200">
            <Wifi className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
      )}

      {error && !isUsingMockData && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      {/* Topics List */}
      {topics.map((topic) => (
        <div
          key={topic.topic_id}
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">{topic.topic_id}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-none truncate">{topic.topic_name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {topic.total_documents_in_period.toLocaleString()} documents
            </p>
          </div>
          <div className="text-xs text-muted-foreground">{format(new Date(topic.last_seen), "MMM dd")}</div>
        </div>
      ))}

      {topics.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No topics available</p>
        </div>
      )}
    </div>
  )
}
