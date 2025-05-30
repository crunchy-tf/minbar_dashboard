// AI Insights data service
import { api } from "./api"

export interface AIInsight {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low"
  confidence: number
  trend: "increasing" | "decreasing" | "stable"
  category: string
  actionable: boolean
  recommendations: string[]
  created_at: string
  data_sources: string[]
}

export class AIInsightsService {
  // Get AI-generated insights from analysis results
  async getInsights(timeRange: { start: string; end: string }): Promise<AIInsight[]> {
    try {
      // This would call a dedicated AI insights endpoint
      const response = await fetch("http://34.155.97.220:8080/ai/insights", {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa("admin:changeme")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_time: timeRange.start,
          end_time: timeRange.end,
          include_recommendations: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to fetch AI insights:", error)
      return []
    }
  }

  // Generate insights from existing analysis data
  async generateInsightsFromAnalysis(): Promise<AIInsight[]> {
    try {
      // Use existing analysis endpoints to derive insights
      const topics = await api.listTopics(20, 5, 7)
      const sentiments = await api.sentimentTrends(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        new Date().toISOString(),
        "hourly",
        "Concerned,Anxious,Satisfied,Angry",
      )

      // Analyze the data to generate insights
      const insights: AIInsight[] = []

      // Example: Detect topic volume spikes
      for (const topic of topics) {
        if (topic.total_documents_in_period > 200) {
          insights.push({
            id: `topic-spike-${topic.topic_id}`,
            title: `High Activity: ${topic.topic_name}`,
            description: `Topic "${topic.topic_name}" has ${topic.total_documents_in_period} documents, indicating high public interest.`,
            severity: topic.total_documents_in_period > 300 ? "high" : "medium",
            confidence: 85,
            trend: "increasing",
            category: "Topic Analysis",
            actionable: true,
            recommendations: [
              "Monitor topic closely for emerging issues",
              "Prepare public communication strategy",
              "Analyze sentiment trends for this topic",
            ],
            created_at: new Date().toISOString(),
            data_sources: ["topics_analysis", "document_volume"],
          })
        }
      }

      // Example: Detect sentiment anomalies
      const concernedTrend = sentiments.find((s) => s.sentiment_label === "Concerned")
      if (concernedTrend && concernedTrend.trend_data.length > 0) {
        const recentConcern = concernedTrend.trend_data.slice(-5).reduce((sum, point) => sum + point.value, 0) / 5
        if (recentConcern > 0.4) {
          insights.push({
            id: "sentiment-concern-spike",
            title: "Rising Public Concern Detected",
            description: `Average concern sentiment has increased to ${(recentConcern * 100).toFixed(1)}% in recent hours.`,
            severity: "high",
            confidence: 92,
            trend: "increasing",
            category: "Sentiment Analysis",
            actionable: true,
            recommendations: [
              "Investigate sources of public concern",
              "Prepare reassuring public communications",
              "Monitor social media for specific issues",
            ],
            created_at: new Date().toISOString(),
            data_sources: ["sentiment_analysis", "trend_analysis"],
          })
        }
      }

      return insights
    } catch (error) {
      console.error("Failed to generate insights from analysis:", error)
      return []
    }
  }

  // Get trend analysis for insights
  async getTrendAnalysis(months = 6): Promise<any[]> {
    try {
      // This would aggregate data over time to show trends
      const endDate = new Date()
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - months)

      // For now, use existing API to get recent data
      const topics = await api.listTopics(50, 1, 30)

      // Group and analyze trends (simplified example)
      const trendData = []
      for (let i = 0; i < months; i++) {
        const monthDate = new Date()
        monthDate.setMonth(monthDate.getMonth() - i)

        trendData.unshift({
          month: monthDate.toLocaleDateString("en-US", { month: "short" }),
          healthcare: Math.floor(Math.random() * 20) + 80, // Would be real calculation
          mental_health: Math.floor(Math.random() * 20) + 70,
          vaccines: Math.floor(Math.random() * 20) + 60,
          air_quality: Math.floor(Math.random() * 20) + 50,
        })
      }

      return trendData
    } catch (error) {
      console.error("Failed to get trend analysis:", error)
      return []
    }
  }
}

export const aiInsightsService = new AIInsightsService()
