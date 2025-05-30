"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { DateRange } from "react-day-picker"
import { api } from "@/lib/api"
import { MessageSquare, TrendingUp, Clock } from "lucide-react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Topic {
  topic_id: string
  topic_name: string
  total_documents_in_period: number
  last_seen: string
}

interface TopicsListProps {
  dateRange?: DateRange
  onTopicSelect?: (topicId: string) => void
  selectedTopic?: string | null
}

export function TopicsList({ dateRange, onTopicSelect, selectedTopic }: TopicsListProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.listTopics(20, 5, 7)
        setTopics(data)
        setFilteredTopics(data)
      } catch (error) {
        console.error("Failed to fetch topics:", error)
        setError("Failed to load topics")
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [dateRange])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTopics(topics)
    } else {
      const filtered = topics.filter(
        (topic) =>
          topic.topic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.topic_id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredTopics(filtered)
    }
  }, [searchQuery, topics])

  if (loading) {
    return <div className="space-y-4">Loading topics...</div>
  }

  if (error) {
    return <div className="space-y-4 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredTopics.map((topic) => (
        <div
          key={topic.topic_id}
          className={`p-4 border rounded-lg transition-colors ${
            selectedTopic === topic.topic_id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">ID: {topic.topic_id}</Badge>
                <Badge variant="secondary">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {topic.total_documents_in_period} docs
                </Badge>
              </div>
              <h3 className="font-medium text-sm leading-tight mb-2">{topic.topic_name}</h3>
              <div className="flex items-center text-xs text-muted-foreground space-x-4">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Last seen: {format(new Date(topic.last_seen), "MMM dd, HH:mm")}
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 ml-4">
              <Button
                variant={selectedTopic === topic.topic_id ? "default" : "outline"}
                size="sm"
                onClick={() => onTopicSelect?.(topic.topic_id)}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Analyze
              </Button>
            </div>
          </div>
        </div>
      ))}

      {filteredTopics.length === 0 && searchQuery && (
        <div className="text-center text-muted-foreground py-8">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No topics found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}
