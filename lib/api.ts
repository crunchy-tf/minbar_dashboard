import { getAuthCredentials } from "./auth"

const API_BASE_URL = "http://34.155.97.220:8080"

class ApiClient {
  private getAuthHeaders() {
    const credentials = getAuthCredentials()
    if (!credentials) {
      throw new Error("No authentication credentials found")
    }

    const encoded = btoa(`${credentials.username}:${credentials.password}`)
    return {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/json",
    }
  }

  async get(endpoint: string, params?: Record<string, any>) {
    const url = new URL(`${API_BASE_URL}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString())
        }
      })
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getAuthHeaders(),
        mode: "cors",
        credentials: "omit",
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error)

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`CORS_ERROR`)
      }
      throw error
    }
  }
}

export const apiClient = new ApiClient()

// Mock data for fallback when API is unavailable
const mockData = {
  topics: [
    {
      topic_id: "402",
      topic_name: "Hospitals Overwhelmed: Long Wait Times & Bed Shortages",
      total_documents_in_period: 264,
      last_seen: "2025-05-23T16:00:00Z",
    },
    {
      topic_id: "777",
      topic_name: "Unverified Rumors: New Virus Strain Emergence",
      total_documents_in_period: 260,
      last_seen: "2025-05-27T14:00:00Z",
    },
    {
      topic_id: "1001",
      topic_name: "Funding for Mental Health Services Debate",
      total_documents_in_period: 239,
      last_seen: "2025-05-20T21:00:00Z",
    },
    {
      topic_id: "604",
      topic_name: "Air Quality Respiratory Issues Alert",
      total_documents_in_period: 198,
      last_seen: "2025-05-25T12:00:00Z",
    },
    {
      topic_id: "3",
      topic_name: "Vaccine Hesitancy Side Effects Rumors",
      total_documents_in_period: 156,
      last_seen: "2025-05-26T09:00:00Z",
    },
  ],
  overview: {
    total_documents_processed: 4443,
    active_topics_count: 67,
    last_data_ingested_at: "2025-05-29T16:00:00Z",
  },
  keywords: [
    {
      term: "chlamydia",
      language: "en",
      concept_id: "6838218bc8c315590518155b",
      concept_display_name: "chlamydia",
    },
    {
      term: "chlamydia symptoms",
      language: "en",
      concept_id: "6838218fc8c315590518155c",
      concept_display_name: "chlamydia symptoms",
    },
    {
      term: "vaccine hesitancy",
      language: "en",
      concept_id: "6838219fc8c315590518155d",
      concept_display_name: "vaccine hesitancy",
    },
    {
      term: "mental health",
      language: "en",
      concept_id: "6838220fc8c315590518155e",
      concept_display_name: "mental health services",
    },
    {
      term: "hospital capacity",
      language: "en",
      concept_id: "6838221fc8c315590518155f",
      concept_display_name: "hospital bed shortage",
    },
  ],
}

// API functions with fallback to mock data
export const api = {
  // Health check
  health: async () => {
    try {
      return await apiClient.get("/health")
    } catch (error) {
      if (error.message === "CORS_ERROR") {
        return { status: "cors_error", message: "CORS restrictions prevent API access" }
      }
      return { status: "unavailable", message: "API server unreachable" }
    }
  },

  // Root endpoint
  root: async () => {
    try {
      return await apiClient.get("/")
    } catch (error) {
      return { message: "Welcome to Minbar API Gateway (Demo Mode)" }
    }
  },

  // Overview
  overview: async (daysPast = 7) => {
    try {
      return await apiClient.get("/signals/overview", { days_past: daysPast })
    } catch (error) {
      console.warn("Using mock overview data due to API error:", error.message)
      return mockData.overview
    }
  },

  // Topics
  listTopics: async (limit = 20, minDocCount = 5, daysPast = 7) => {
    try {
      return await apiClient.get("/signals/topics/list", {
        limit,
        min_doc_count: minDocCount,
        days_past: daysPast,
      })
    } catch (error) {
      console.warn("Using mock topics data due to API error:", error.message)
      return mockData.topics.slice(0, limit)
    }
  },

  topicTrend: async (topicId: string, startTime: string, endTime: string, timeAggregation = "hourly") => {
    try {
      return await apiClient.get(`/signals/topics/${topicId}/trend`, {
        start_time: startTime,
        end_time: endTime,
        time_aggregation: timeAggregation,
      })
    } catch (error) {
      console.warn("Using mock trend data due to API error:", error.message)
      return {
        topic_id: topicId,
        topic_name: `Topic ${topicId}`,
        trend_data: [
          { timestamp: "2025-05-20T10:00:00Z", value: 15.0 },
          { timestamp: "2025-05-20T11:00:00Z", value: 18.0 },
          { timestamp: "2025-05-20T12:00:00Z", value: 12.0 },
          { timestamp: "2025-05-20T13:00:00Z", value: 20.0 },
          { timestamp: "2025-05-20T14:00:00Z", value: 22.0 },
        ],
      }
    }
  },

  topicSentiment: async (topicId: string, startTime: string, endTime: string, timeAggregation = "hourly") => {
    try {
      return await apiClient.get(`/signals/topics/${topicId}/sentiment_distribution`, {
        start_time: startTime,
        end_time: endTime,
        time_aggregation: timeAggregation,
      })
    } catch (error) {
      console.warn("Using mock sentiment data due to API error:", error.message)
      return {
        topic_id: topicId,
        topic_name: `Topic ${topicId}`,
        sentiments: [{ label: "Concerned", count: 123 }],
      }
    }
  },

  topicKeywords: async (
    topicId: string,
    startTime: string,
    endTime: string,
    timeAggregation = "hourly",
    limit = 10,
  ) => {
    try {
      return await apiClient.get(`/signals/topics/${topicId}/top_keywords`, {
        start_time: startTime,
        end_time: endTime,
        time_aggregation: timeAggregation,
        limit,
      })
    } catch (error) {
      console.warn("Using mock keywords data due to API error:", error.message)
      return {
        topic_id: topicId,
        topic_name: `Topic ${topicId}`,
        keywords: [
          { keyword: "trust science", frequency: 20 },
          { keyword: "conspiracy", frequency: 18 },
        ],
      }
    }
  },

  // Sentiments
  sentimentTrends: async (startTime: string, endTime: string, timeAggregation = "hourly", sentimentLabels?: string) => {
    try {
      return await apiClient.get("/signals/sentiments/overall_trend", {
        start_time: startTime,
        end_time: endTime,
        time_aggregation: timeAggregation,
        sentiment_labels: sentimentLabels,
      })
    } catch (error) {
      console.warn("Using mock sentiment trends due to API error:", error.message)
      return [
        {
          sentiment_label: "Concerned",
          trend_data: [
            { timestamp: "2025-05-20T09:00:00Z", value: 0.15 },
            { timestamp: "2025-05-20T10:00:00Z", value: 0.27 },
            { timestamp: "2025-05-20T11:00:00Z", value: 0.41 },
          ],
        },
      ]
    }
  },

  // Rankings
  topRankedTopics: async (
    startTime: string,
    endTime: string,
    timeAggregation = "hourly",
    rankBy = "recent_volume",
    limit = 5,
  ) => {
    try {
      return await apiClient.get("/signals/rankings/top_topics", {
        start_time: startTime,
        end_time: endTime,
        time_aggregation: timeAggregation,
        rank_by: rankBy,
        limit,
      })
    } catch (error) {
      console.warn("Using mock rankings due to API error:", error.message)
      return [
        { name: "Vaccine Hesitancy Side Effects Rumors", id: "3", score: 0.56 },
        { name: "Air Quality Respiratory Issues Alert", id: "604", score: 0.55 },
      ]
    }
  },

  // Keywords
  topManagedKeywords: async (lang = "en", limit = 20) => {
    try {
      return await apiClient.get("/keywords/top_managed", { lang, limit })
    } catch (error) {
      console.warn("Using mock keywords due to API error:", error.message)
      return mockData.keywords.slice(0, limit)
    }
  },

  // Analysis endpoints with fallbacks
  basicStats: async (signalName: string, startTime: string, endTime: string, latestOnly = true) => {
    try {
      return await apiClient.get(`/analysis/basicstats/${signalName}`, {
        start_time: startTime,
        end_time: endTime,
        latest_only: latestOnly,
      })
    } catch (error) {
      console.warn("Using mock basic stats due to API error:", error.message)
      return {
        count: 7,
        sum_val: 123.0,
        mean: 17.57,
        median: 18.0,
        min_val: 12.0,
        max_val: 22.0,
        std_dev: 3.29,
        variance: 10.85,
      }
    }
  },

  movingAverage: async (signalName: string, startTime: string, endTime: string, latestOnly = true) => {
    try {
      return await apiClient.get(`/analysis/movingaverage/${signalName}`, {
        start_time: startTime,
        end_time: endTime,
        latest_only: latestOnly,
      })
    } catch (error) {
      console.warn("Using mock moving average due to API error:", error.message)
      return {
        points: [
          { timestamp: "2025-05-20T12:00:00Z", value: 15.0 },
          { timestamp: "2025-05-20T13:00:00Z", value: 16.67 },
          { timestamp: "2025-05-20T14:00:00Z", value: 18.0 },
        ],
        window: 3,
        type: "simple",
      }
    }
  },

  zScore: async (signalName: string, startTime: string, endTime: string, latestOnly = true) => {
    try {
      return await apiClient.get(`/analysis/zscore/${signalName}`, {
        start_time: startTime,
        end_time: endTime,
        latest_only: latestOnly,
      })
    } catch (error) {
      console.warn("Using mock z-score due to API error:", error.message)
      return {
        points: [
          { timestamp: "2025-05-20T10:00:00Z", original_value: 15.0, z_score: -0.78 },
          { timestamp: "2025-05-20T11:00:00Z", original_value: 18.0, z_score: 0.13 },
        ],
      }
    }
  },

  rateOfChange: async (signalName: string, startTime: string, endTime: string, latestOnly = true) => {
    try {
      return await apiClient.get(`/analysis/rateofchange/${signalName}`, {
        start_time: startTime,
        end_time: endTime,
        latest_only: latestOnly,
      })
    } catch (error) {
      console.warn("Using mock rate of change due to API error:", error.message)
      return {
        signal_name: signalName,
        points: [
          { timestamp: "2025-05-20T11:00:00Z", value: 3.0 },
          { timestamp: "2025-05-20T12:00:00Z", value: -6.0 },
        ],
      }
    }
  },

  percentChange: async (signalName: string, startTime: string, endTime: string, latestOnly = true) => {
    try {
      return await apiClient.get(`/analysis/percentchange/${signalName}`, {
        start_time: startTime,
        end_time: endTime,
        latest_only: latestOnly,
      })
    } catch (error) {
      console.warn("Using mock percent change due to API error:", error.message)
      return {
        signal_name: signalName,
        points: [
          { timestamp: "2025-05-20T11:00:00Z", value: 20.0 },
          { timestamp: "2025-05-20T12:00:00Z", value: -33.33 },
        ],
      }
    }
  },

  stlDecomposition: async (signalName: string, startTime: string, endTime: string, latestOnly = true) => {
    try {
      return await apiClient.get(`/analysis/stldecomposition/${signalName}`, {
        start_time: startTime,
        end_time: endTime,
        latest_only: latestOnly,
      })
    } catch (error) {
      console.warn("Using mock STL decomposition due to API error:", error.message)
      return {
        trend: [{ timestamp: "2025-05-20T10:00:00Z", value: 15.5 }],
        seasonal: [{ timestamp: "2025-05-20T10:00:00Z", value: -0.2 }],
        residual: [{ timestamp: "2025-05-20T10:00:00Z", value: -0.3 }],
        period_used: 3,
      }
    }
  },
}
