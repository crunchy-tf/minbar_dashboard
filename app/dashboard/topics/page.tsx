"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopicsList } from "@/components/dashboard/topics-list"
import { TopicTrend } from "@/components/dashboard/topic-trend"
import { InteractiveSentimentAnalysis } from "@/components/dashboard/interactive-sentiment-analysis"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"

export default function TopicsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Topics Analysis</h1>
          <p className="text-muted-foreground">Monitor and analyze health-related topics and trends</p>
        </div>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Active Topics</CardTitle>
                <CardDescription>Most discussed health topics in the selected time period</CardDescription>
              </CardHeader>
              <CardContent>
                <TopicsList dateRange={date} onTopicSelect={setSelectedTopic} selectedTopic={selectedTopic} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Topic Trends</CardTitle>
                <CardDescription>Document volume trends for selected topics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <TopicTrend topicId={selectedTopic} dateRange={date} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <InteractiveSentimentAnalysis dateRange={date} />
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Topic Keywords Analysis</CardTitle>
                <CardDescription>Keyword analysis for the selected topic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  {selectedTopic
                    ? `Keyword analysis for topic ${selectedTopic} will be displayed here`
                    : "Select a topic to view keyword analysis"}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
