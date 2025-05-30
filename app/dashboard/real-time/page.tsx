"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, Zap, AlertTriangle, TrendingUp, Play, Pause, RefreshCw, Bell, Eye } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { format } from "date-fns"

export default function RealTimePage() {
  const [isLive, setIsLive] = useState(true)
  const [alerts, setAlerts] = useState<any[]>([])
  const [liveData, setLiveData] = useState<any[]>([])
  const [systemMetrics, setSystemMetrics] = useState<any>({})

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const now = new Date()

      // Update live data
      setLiveData((prev) => {
        const newData = [
          ...prev.slice(-29),
          {
            time: format(now, "HH:mm:ss"),
            documents: Math.floor(Math.random() * 50) + 80,
            alerts: Math.floor(Math.random() * 5),
            sentiment: Math.random() * 0.6 + 0.2,
            processing_speed: Math.floor(Math.random() * 200) + 1000,
          },
        ]
        return newData
      })

      // Randomly generate alerts
      if (Math.random() > 0.95) {
        const alertTypes = [
          { type: "spike", message: "Document volume spike detected", severity: "warning" },
          { type: "sentiment", message: "Negative sentiment threshold exceeded", severity: "high" },
          { type: "system", message: "Processing latency increased", severity: "medium" },
          { type: "topic", message: "New emerging topic detected", severity: "info" },
        ]

        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
        setAlerts((prev) => [
          {
            id: Date.now(),
            timestamp: now,
            ...randomAlert,
          },
          ...prev.slice(0, 9),
        ])
      }

      // Update system metrics
      setSystemMetrics({
        cpu_usage: Math.floor(Math.random() * 30) + 60,
        memory_usage: Math.floor(Math.random() * 20) + 70,
        disk_usage: Math.floor(Math.random() * 10) + 45,
        network_io: Math.floor(Math.random() * 100) + 200,
        active_connections: Math.floor(Math.random() * 50) + 150,
        queue_size: Math.floor(Math.random() * 20) + 5,
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  // Initialize with some data
  useEffect(() => {
    const initialData = []
    const now = new Date()

    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2000)
      initialData.push({
        time: format(time, "HH:mm:ss"),
        documents: Math.floor(Math.random() * 50) + 80,
        alerts: Math.floor(Math.random() * 5),
        sentiment: Math.random() * 0.6 + 0.2,
        processing_speed: Math.floor(Math.random() * 200) + 1000,
      })
    }

    setLiveData(initialData)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "warning":
        return "default"
      case "medium":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Monitoring</h1>
          <p className="text-muted-foreground">Live system monitoring and alert management</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={isLive ? "default" : "outline"} size="sm" onClick={() => setIsLive(!isLive)}>
            {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isLive ? "Pause" : "Resume"}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              <div>
                <p className="text-sm font-medium">System Status</p>
                <p className="text-xs text-muted-foreground">{isLive ? "Live" : "Paused"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{liveData[liveData.length - 1]?.documents || 0}</p>
                <p className="text-xs text-muted-foreground">Docs/min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">{alerts.length}</p>
                <p className="text-xs text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">{systemMetrics.cpu_usage || 0}%</p>
                <p className="text-xs text-muted-foreground">CPU Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">{systemMetrics.active_connections || 0}</p>
                <p className="text-xs text-muted-foreground">Connections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">{systemMetrics.queue_size || 0}</p>
                <p className="text-xs text-muted-foreground">Queue Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Document Processing</span>
              {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </CardTitle>
            <CardDescription>Real-time document ingestion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={liveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="documents"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>System Performance</span>
              {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </CardTitle>
            <CardDescription>Processing speed and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={liveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="processing_speed"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Processing Speed"
                />
                <Line
                  type="monotone"
                  dataKey="alerts"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  name="Alert Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics and Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>Current system resource utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>{systemMetrics.cpu_usage}%</span>
                </div>
                <Progress value={systemMetrics.cpu_usage} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span>{systemMetrics.memory_usage}%</span>
                </div>
                <Progress value={systemMetrics.memory_usage} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Disk Usage</span>
                  <span>{systemMetrics.disk_usage}%</span>
                </div>
                <Progress value={systemMetrics.disk_usage} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Network I/O</span>
                  <span>{systemMetrics.network_io} MB/s</span>
                </div>
                <Progress value={(systemMetrics.network_io / 500) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Alerts</span>
              <Badge variant="outline">{alerts.length} active</Badge>
            </CardTitle>
            <CardDescription>Real-time system alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No active alerts</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{format(alert.timestamp, "HH:mm:ss")}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
