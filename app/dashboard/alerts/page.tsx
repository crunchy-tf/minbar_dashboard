// FILE: app/dashboard/alerts/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Users,
  MapPin,
} from "lucide-react"
import { format, formatDistanceToNow, subHours, subDays, subMinutes } from "date-fns"

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

  // Expanded Mock alerts data
  useEffect(() => {
    const now = new Date();
    const mockAlerts: AlertItem[] = [
      {
        id: "ALT-001",
        title: "Hospital Capacity Critical Threshold Exceeded",
        description: "Multiple hospitals in the metropolitan area are reporting bed occupancy rates above 95%. Emergency departments experiencing significant delays.",
        severity: "critical",
        category: "Healthcare Infrastructure",
        status: "active",
        createdAt: subHours(now, 2),
        updatedAt: subMinutes(now, 30),
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
        description: "Social media monitoring detected a 340% increase in mental health-related posts with concerning sentiment patterns.",
        severity: "high",
        category: "Mental Health",
        status: "acknowledged",
        createdAt: subHours(now, 4),
        updatedAt: subHours(now, 1),
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
        description: "Coordinated spread of vaccine misinformation detected across multiple platforms. Potential impact on vaccination rates.",
        severity: "high",
        category: "Misinformation",
        status: "active",
        createdAt: subHours(now, 6),
        updatedAt: subHours(now, 2),
        source: "Misinformation Detection AI",
        location: "Multi-Regional",
        affectedPopulation: 150000,
        relatedTopics: ["Vaccine Hesitancy", "Misinformation", "Public Health"],
        actionRequired: true,
      },
      {
        id: "ALT-004",
        title: "Air Quality Index Deterioration in Urban Centers",
        description: "Air quality measurements show significant deterioration in urban areas (AQI > 150). Potential respiratory health impacts expected.",
        severity: "medium",
        category: "Environmental Health",
        status: "active",
        createdAt: subHours(now, 8),
        updatedAt: subHours(now, 3),
        source: "Environmental Monitoring Network",
        location: "Urban Centers",
        affectedPopulation: 1200000,
        relatedTopics: ["Air Quality", "Respiratory Health", "Environmental Alerts"],
        actionRequired: false,
      },
      {
        id: "ALT-005",
        title: "Healthcare Worker Burnout Indicators Rising",
        description: "Analysis of healthcare worker communications shows increasing signs of burnout and stress-related concerns across several major hospitals.",
        severity: "medium",
        category: "Healthcare Workforce",
        status: "resolved",
        createdAt: subDays(now, 1),
        updatedAt: subHours(now, 12),
        source: "Workforce Analytics Platform",
        location: "Healthcare Facilities Statewide",
        affectedPopulation: 25000,
        relatedTopics: ["Healthcare Workers", "Burnout", "Mental Health Support", "Staffing"],
        actionRequired: false,
        assignedTo: "HR Department",
      },
      {
        id: "ALT-006",
        title: "Seasonal Flu Activity Increase - Early Warning",
        description: "Early indicators from sentinel surveillance suggest above-normal seasonal flu activity. Preparation for increased healthcare demand recommended.",
        severity: "low",
        category: "Disease Surveillance",
        status: "acknowledged",
        createdAt: subHours(now, 12),
        updatedAt: subHours(now, 6),
        source: "Disease Surveillance System",
        location: "Regional Health District 3",
        affectedPopulation: 500000,
        relatedTopics: ["Seasonal Flu", "Disease Surveillance", "Healthcare Capacity", "Vaccination Drive"],
        actionRequired: false,
      },
      {
        id: "ALT-007",
        title: "Critical Medical Supply Shortage Reported",
        description: "Central supply reports critical shortage of N95 masks and specific antiviral medications. Supply chain disruption suspected.",
        severity: "critical",
        category: "Supply Chain",
        status: "active",
        createdAt: subHours(now, 1),
        updatedAt: subMinutes(now, 15),
        source: "Inventory Management System",
        location: "National Distribution Center",
        relatedTopics: ["Medical Supplies", "Logistics", "Pandemic Preparedness"],
        actionRequired: true,
        assignedTo: "Logistics & Procurement",
      },
      {
        id: "ALT-008",
        title: "Elevated Water Contamination Levels in County X",
        description: "Routine water testing in County X indicates E. coli levels exceeding safety thresholds. Boil water advisory being prepared.",
        severity: "high",
        category: "Environmental Health",
        status: "active",
        createdAt: subHours(now, 3),
        updatedAt: subHours(now, 1),
        source: "Water Quality Monitoring",
        location: "County X",
        affectedPopulation: 75000,
        relatedTopics: ["Water Safety", "Public Health Advisory", "E. coli"],
        actionRequired: true,
        assignedTo: "County Health Department",
      },
      {
        id: "ALT-009",
        title: "System Maintenance Notification for EHR",
        description: "Electronic Health Record system scheduled for maintenance on Sunday 02:00-04:00 AM. Expect brief downtime.",
        severity: "info",
        category: "System Notifications",
        status: "acknowledged",
        createdAt: subDays(now, 2),
        updatedAt: subDays(now, 1),
        source: "IT Department",
        location: "All Facilities",
        relatedTopics: ["EHR", "System Maintenance", "IT"],
        actionRequired: false,
      },
      {
        id: "ALT-010",
        title: "Unconfirmed Report of Novel Pathogen",
        description: "Rumor circulating on social media about a new respiratory pathogen with high transmissibility. Awaiting lab verification.",
        severity: "medium",
        category: "Emerging Threats",
        status: "active",
        createdAt: subHours(now, 5),
        updatedAt: subHours(now, 1),
        source: "Social Media Intelligence",
        location: "Online Forums",
        relatedTopics: ["Pathogen Surveillance", "Rumor Control", "Epidemiology"],
        actionRequired: true,
        assignedTo: "Rapid Response Unit",
      },
      {
        id: "ALT-011",
        title: "School Absenteeism Spike in District Alpha",
        description: "School district Alpha reports a 40% increase in student absenteeism due to flu-like symptoms over the past 3 days.",
        severity: "medium",
        category: "Disease Surveillance",
        status: "acknowledged",
        createdAt: subHours(now, 10),
        updatedAt: subHours(now, 4),
        source: "School Health Network",
        location: "District Alpha",
        affectedPopulation: 15000,
        relatedTopics: ["School Health", "Influenza", "Community Spread"],
        actionRequired: true,
        assignedTo: "Pediatric Health Unit",
      },
      {
        id: "ALT-012",
        title: "Resolved: Power Outage at City General Hospital",
        description: "Power has been restored to City General Hospital. All systems returning to normal operation after a 2-hour outage.",
        severity: "info",
        category: "Healthcare Infrastructure",
        status: "resolved",
        createdAt: subHours(now, 7),
        updatedAt: subHours(now, 5),
        source: "Facilities Management",
        location: "City General Hospital",
        relatedTopics: ["Power Outage", "Hospital Operations"],
        actionRequired: false,
        assignedTo: "Facilities Team",
      },
      {
        id: "ALT-013",
        title: "Increase in Heatstroke Cases Reported",
        description: "Emergency rooms across southern regions report a significant increase in heatstroke and dehydration cases amid heatwave.",
        severity: "high",
        category: "Environmental Health",
        status: "active",
        createdAt: subHours(now, 9),
        updatedAt: subHours(now, 2),
        source: "ER Admission Data",
        location: "Southern Region",
        affectedPopulation: 800000,
        relatedTopics: ["Heatwave", "Public Safety", "Dehydration", "Climate Change"],
        actionRequired: true,
        assignedTo: "Public Health Office",
      },
      {
        id: "ALT-014",
        title: "Dismissed: False Alarm for Chemical Spill",
        description: "Initial report of a chemical spill near downtown was investigated and found to be a false alarm. No public risk.",
        severity: "info",
        category: "Environmental Health",
        status: "dismissed",
        createdAt: subDays(now, 3),
        updatedAt: subDays(now, 2),
        source: "Emergency Dispatch",
        location: "Downtown Area",
        relatedTopics: ["Hazmat", "False Alarm"],
        actionRequired: false,
      },
      {
        id: "ALT-015",
        title: "Low Compliance with New Health Guideline",
        description: "Observation data indicates low public compliance (approx. 30%) with the newly issued mask advisory in public transport.",
        severity: "medium",
        category: "Public Health Compliance",
        status: "active",
        createdAt: subHours(now, 20),
        updatedAt: subHours(now, 5),
        source: "Compliance Monitoring Team",
        location: "City Transit System",
        relatedTopics: ["Health Guidelines", "Public Behavior", "Mask Advisory"],
        actionRequired: true,
        assignedTo: "Public Awareness Campaign",
      },
       {
        id: "ALT-016",
        title: "Pharmaceutical Recall: Batch XYZ of Antihypertensive",
        description: "Manufacturer issued a voluntary recall for batch XYZ of 'CardioSecure' due to potential contamination. Pharmacies notified.",
        severity: "high",
        category: "Pharmaceutical Safety",
        status: "active",
        createdAt: subHours(now, 18),
        updatedAt: subHours(now, 3),
        source: "Regulatory Drug Authority",
        location: "National",
        relatedTopics: ["Drug Recall", "Patient Safety", "Pharmacy Network"],
        actionRequired: true,
        assignedTo: "Pharmacy Board",
      },
      {
        id: "ALT-017",
        title: "Potential Cyberattack on Health Data Server",
        description: "Unusual network activity detected on a server hosting anonymized patient data. Security team investigating potential breach.",
        severity: "critical",
        category: "Cybersecurity",
        status: "active",
        createdAt: subHours(now, 1),
        updatedAt: subMinutes(now, 10),
        source: "Intrusion Detection System",
        location: "Central Data Center",
        relatedTopics: ["Data Breach", "Cybersecurity", "Patient Privacy", "HIPAA"],
        actionRequired: true,
        assignedTo: "Cybersecurity Incident Response Team",
      },
      {
        id: "ALT-018",
        title: "Successful Public Vaccination Drive - Phase 1 Complete",
        description: "Phase 1 of the targeted vaccination drive for high-risk populations has concluded with 85% coverage.",
        severity: "info",
        category: "Public Health Campaigns",
        status: "resolved",
        createdAt: subDays(now, 7),
        updatedAt: subDays(now, 1),
        source: "Vaccination Program Office",
        location: "Designated Vaccination Centers",
        relatedTopics: ["Vaccination", "Public Health Success", "Immunization"],
        actionRequired: false,
      },
      {
        id: "ALT-019",
        title: "Foodborne Illness Outbreak Suspected at Event",
        description: "Multiple reports of gastrointestinal illness from attendees of the 'City Fair' event last weekend. Investigating food vendors.",
        severity: "high",
        category: "Disease Surveillance",
        status: "acknowledged",
        createdAt: subHours(now, 22),
        updatedAt: subHours(now, 4),
        source: "Public Complaints Hotline",
        location: "City Fairgrounds",
        affectedPopulation: 500, // Estimated attendees with symptoms
        relatedTopics: ["Food Safety", "Outbreak Investigation", "Gastroenteritis"],
        actionRequired: true,
        assignedTo: "Epidemiology Department",
      },
      {
        id: "ALT-020",
        title: "Blood Supply Levels Low for Type O-Negative",
        description: "Regional blood banks report critically low levels of O-Negative blood type. Urgent call for donations initiated.",
        severity: "medium",
        category: "Supply Chain",
        status: "active",
        createdAt: subHours(now, 15),
        updatedAt: subHours(now, 1),
        source: "Blood Bank Network",
        location: "Regional",
        relatedTopics: ["Blood Donation", "Medical Supplies", "Emergency Preparedness"],
        actionRequired: true,
        assignedTo: "Blood Drive Coordination Team",
      }
    ];

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

  const categories = [...new Set(alerts.map((alert) => alert.category))].sort()


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alert Management</h1>
          <p className="text-muted-foreground">Monitor and manage health monitoring alerts and notifications</p>
        </div>
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
          <div className="grid gap-4 md:grid-cols-4">
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