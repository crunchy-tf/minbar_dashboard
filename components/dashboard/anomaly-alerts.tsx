"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Bell, X, Eye, Clock } from "lucide-react"
import { format } from "date-fns"

interface AnomalyAlert {
  id: string
  type: "volume_spike" | "sentiment_shift" | "keyword_emergence" | "topic_anomaly"
  severity: "high" | "medium" | "low"
  title: string
  description: string
  topic_id?: string
  topic_name?: string
  detected_at: string
  confidence: number
  dismissed: boolean
}

interface AnomalyAlertsProps {
  onAlertAction?: (alertId: string, action: "view" | "dismiss") => void
  limit?: number
}

export function AnomalyAlerts({ onAlertAction, limit = 5 }: AnomalyAlertsProps) {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnomalyAlerts = async () => {
      try {
        setLoading(true)

        // Mock real-time anomaly alerts
        const mockAlerts: AnomalyAlert[] = [
          {
            id: "alert_001",
            type: "volume_spike",
            severity: "high",
            title: "Unusual Volume Spike Detected",
            description: "Topic 'Hospital Wait Times' showing 300% increase in discussions",
            topic_id: "402",
            topic_name: "Hospitals Overwhelmed: Long Wait Times & Bed Shortages",
            detected_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
            confidence: 0.92,
            dismissed: false,
          },
          {
            id: "alert_002",
            type: "sentiment_shift",
            severity: "medium",
            title: "Sentiment Shift Alert",
            description: "Rapid increase in 'Anxious' sentiment across multiple health topics",
            detected_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
            confidence: 0.78,
            dismissed: false,
          },
          {
            id: "alert_003",
            type: "keyword_emergence",
            severity: "medium",
            title: "New Keyword Trending",
            description: "Keyword 'vaccine shortage' emerging rapidly in discussions",
            detected_at: new Date(Date.now() - 32 * 60 * 1000).toISOString(), // 32 minutes ago
            confidence: 0.85,
            dismissed: false,
          },
          {
            id: "alert_004",
            type: "topic_anomaly",
            severity: "low",
            title: "Topic Pattern Anomaly",
            description: "Unusual discussion pattern detected in mental health topics",
            topic_id: "1001",
            topic_name: "Mental Health Services Funding Debate",
            detected_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
            confidence: 0.65,
            dismissed: false,
          },
        ]

        setAlerts(mockAlerts.slice(0, limit))
      } catch (error) {
        console.error("Failed to fetch anomaly alerts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnomalyAlerts()

    // Set up real-time updates (mock)
    const interval = setInterval(() => {
      // Simulate new alerts occasionally
      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        fetchAnomalyAlerts()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [limit])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "volume_spike":
        return "📈"
      case "sentiment_shift":
        return "😟"
      case "keyword_emergence":
        return "🔍"
      case "topic_anomaly":
        return "⚠️"
      default:
        return "🔔"
    }
  }

  const handleDismiss = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, dismissed: true } : alert)))
    onAlertAction?.(alertId, "dismiss")
  }

  const handleView = (alertId: string) => {
    onAlertAction?.(alertId, "view")
  }

  const activeAlerts = alerts.filter((alert) => !alert.dismissed)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Anomaly Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Anomaly Alerts</span>
          </div>
          {activeAlerts.length > 0 && <Badge variant="destructive">{activeAlerts.length}</Badge>}
        </CardTitle>
        <CardDescription>Real-time alerts for unusual patterns and anomalies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active alerts</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <Alert key={alert.id} className="relative">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{getTypeIcon(alert.type)}</span>
                        <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {(alert.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(alert.detected_at), "MMM dd, HH:mm")}</span>
                        </div>
                        {alert.topic_name && <span className="truncate">Topic: {alert.topic_name}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {alert.topic_id && (
                        <Button variant="ghost" size="sm" onClick={() => handleView(alert.id)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDismiss(alert.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
