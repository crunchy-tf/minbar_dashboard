"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Eye,
  Archive,
  Trash2,
  Settings,
  Users,
  MapPin,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

interface AlertItem {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  category: string
  status: "active" | "acknowledged" | "resolved" | "dismissed"
  createdAt: Date
  updatedAt: Date
  source: string
  location?: string
  affectedPopulation?: number
  relatedTopics: string[]
  actionRequired: boolean
  assignedTo?: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<AlertItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null)

  // Mock alerts data
  useEffect(() => {
    const mockAlerts: AlertItem[] = [
      {
        id: "ALT-001",
        title: "Hospital Capacity Critical Threshold Exceeded",
        description:
          "Multiple hospitals in the metropolitan area are reporting bed occupancy rates above 95%. Emergency departments experiencing significant delays.",
        severity: "critical",
        category: "Healthcare Infrastructure",
        status: "active",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        source: "Hospital Management System",
        location: "Metropolitan Area",
        affectedPopulation: 2500000,
        relatedTopics: ["Hospital Capacity", "Emergency Care", "Resource Management"],
        actionRequired: true,
        assignedTo: "Emergency Response Team",
      },
      {
        id: "ALT-002",
        title: "Unusual Spike in Mental Health Discussions",
        description:
          "Social media monitoring detected a 340% increase in mental health-related posts with concerning sentiment patterns.",
        severity: "high",
        category: "Mental Health",
        status: "acknowledged",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        source: "Social Media Monitor",
        location: "National",
        affectedPopulation: 50000,
        relatedTopics: ["Mental Health", "Social Media", "Public Sentiment"],
        actionRequired: true,
        assignedTo: "Mental Health Team",
      },
      {
        id: "ALT-003",
        title: "Vaccine Misinformation Campaign Detected",
        description:
          "Coordinated spread of vaccine misinformation detected across multiple platforms. Potential impact on vaccination rates.",
        severity: "high",
        category: "Misinformation",
        status: "active",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        source: "Misinformation Detection AI",
        location: "Multi-Regional",
        affectedPopulation: 150000,
        relatedTopics: ["Vaccine Hesitancy", "Misinformation", "Public Health"],
        actionRequired: true,
      },
      {
        id: "ALT-004",
        title: "Air Quality Index Deterioration",
        description:
          "Air quality measurements show significant deterioration in urban areas. Potential respiratory health impacts expected.",
        severity: "medium",
        category: "Environmental Health",
        status: "active",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        source: "Environmental Monitoring",
        location: "Urban Centers",
        affectedPopulation: 1200000,
        relatedTopics: ["Air Quality", "Respiratory Health", "Environmental"],
        actionRequired: false,
      },
      {
        id: "ALT-005",
        title: "Healthcare Worker Burnout Indicators Rising",
        description:
          "Analysis of healthcare worker communications shows increasing signs of burnout and stress-related concerns.",
        severity: "medium",
        category: "Healthcare Workforce",
        status: "resolved",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        source: "Workforce Analytics",
        location: "Healthcare Facilities",
        affectedPopulation: 25000,
        relatedTopics: ["Healthcare Workers", "Burnout", "Mental Health"],
        actionRequired: false,
        assignedTo: "HR Department",
      },
      {
        id: "ALT-006",
        title: "Seasonal Flu Activity Increase",
        description:
          "Early indicators suggest above-normal seasonal flu activity. Preparation for increased healthcare demand recommended.",
        severity: "low",
        category: "Disease Surveillance",
        status: "acknowledged",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        source: "Disease Surveillance System",
        location: "Regional",
        affectedPopulation: 500000,
        relatedTopics: ["Seasonal Flu", "Disease Surveillance", "Healthcare Capacity"],
        actionRequired: false,
      },
    ]

    setAlerts(mockAlerts)
    setFilteredAlerts(mockAlerts)
  }, [])

  // Filter alerts based on search and filters
  useEffect(() => {
    let filtered = alerts

    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((alert) => alert.severity === severityFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((alert) => alert.category === categoryFilter)
    }

    setFilteredAlerts(filtered)
  }, [alerts, searchTerm, severityFilter, statusFilter, categoryFilter])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "destructive"
      case "acknowledged":
        return "default"
      case "resolved":
        return "secondary"
      case "dismissed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Bell className="h-4 w-4" />
      case "low":
      case "info":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const alertStats = {
    total: alerts.length,
    active: alerts.filter((a) => a.status === "active").length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    actionRequired: alerts.filter((a) => a.actionRequired).length,
  }

  const categories = [...new Set(alerts.map((alert) => alert.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alert Management</h1>
          <p className="text-muted-foreground">Monitor and manage health monitoring alerts and notifications</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Alert Settings
        </Button>
      </div>

      {/* Alert Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{alertStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{alertStats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{alertStats.critical}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{alertStats.actionRequired}</p>
                <p className="text-xs text-muted-foreground">Action Required</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedAlert?.id === alert.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedAlert(alert)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(alert.severity)}
                    <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                    <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                    {alert.actionRequired && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        Action Required
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{alert.id}</div>
                </div>

                <h3 className="font-medium mb-2 leading-tight">{alert.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{alert.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(alert.createdAt, { addSuffix: true })}</span>
                    </div>
                    {alert.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location}</span>
                      </div>
                    )}
                    {alert.affectedPopulation && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{(alert.affectedPopulation / 1000).toFixed(0)}K affected</span>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {alert.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No alerts found</h3>
                <p className="text-muted-foreground">No alerts match your current filters.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Alert Details Panel */}
        <div className="space-y-4">
          {selectedAlert ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Alert Details</span>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{selectedAlert.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedAlert.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Severity:</span>
                    <Badge variant={getSeverityColor(selectedAlert.severity)}>{selectedAlert.severity}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={getStatusColor(selectedAlert.status)}>{selectedAlert.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Category:</span>
                    <span className="text-sm">{selectedAlert.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Source:</span>
                    <span className="text-sm">{selectedAlert.source}</span>
                  </div>
                  {selectedAlert.location && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Location:</span>
                      <span className="text-sm">{selectedAlert.location}</span>
                    </div>
                  )}
                  {selectedAlert.affectedPopulation && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Affected:</span>
                      <span className="text-sm">{selectedAlert.affectedPopulation.toLocaleString()} people</span>
                    </div>
                  )}
                  {selectedAlert.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Assigned:</span>
                      <span className="text-sm">{selectedAlert.assignedTo}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Related Topics:</h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedAlert.relatedTopics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Created:</span>
                    <span>{format(selectedAlert.createdAt, "MMM dd, yyyy HH:mm")}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Updated:</span>
                    <span>{format(selectedAlert.updatedAt, "MMM dd, yyyy HH:mm")}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Button className="w-full" size="sm">
                    Acknowledge Alert
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Assign to Team
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Mark as Resolved
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select an Alert</h3>
                <p className="text-muted-foreground">Click on an alert to view details and take actions.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
