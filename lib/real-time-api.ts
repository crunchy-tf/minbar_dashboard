// Real-time data connection example
import { api } from "./api"

export class RealTimeDataService {
  private ws: WebSocket | null = null
  private callbacks: Map<string, Function[]> = new Map()

  // Connect to WebSocket for real-time updates
  connect() {
    this.ws = new WebSocket("ws://34.155.97.220:8080/ws/realtime")

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.notifyCallbacks(data.type, data.payload)
    }
  }

  // Subscribe to specific data types
  subscribe(dataType: string, callback: Function) {
    if (!this.callbacks.has(dataType)) {
      this.callbacks.set(dataType, [])
    }
    this.callbacks.get(dataType)?.push(callback)
  }

  private notifyCallbacks(type: string, data: any) {
    const callbacks = this.callbacks.get(type) || []
    callbacks.forEach((callback) => callback(data))
  }

  // Get current system metrics from API
  async getSystemMetrics() {
    try {
      // This would call a real endpoint like /system/metrics
      const response = await fetch("http://34.155.97.220:8080/system/metrics", {
        headers: {
          Authorization: `Basic ${btoa("admin:changeme")}`,
        },
      })
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch system metrics:", error)
      return null
    }
  }

  // Get real-time processing stats
  async getProcessingStats() {
    try {
      const response = await api.overview(1) // Last 1 day
      return {
        documents_per_minute: response.total_documents_processed / (24 * 60),
        active_topics: response.active_topics_count,
        last_update: response.last_data_ingested_at,
      }
    } catch (error) {
      console.error("Failed to fetch processing stats:", error)
      return null
    }
  }
}

export const realTimeService = new RealTimeDataService()
