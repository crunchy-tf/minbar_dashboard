"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { subDays, format } from "date-fns"
import { FileText, Download, Share, Clock, Users, CheckCircle, Eye, Edit, Plus } from "lucide-react"

interface Report {
  id: string
  title: string
  description: string
  type: "executive" | "technical" | "public" | "regulatory"
  status: "draft" | "published" | "scheduled" | "archived"
  createdAt: Date
  updatedAt: Date
  author: string
  sections: string[]
  recipients: string[]
  downloadCount: number
  size: string
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [reportType, setReportType] = useState<string>("executive")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [selectedSections, setSelectedSections] = useState<string[]>([])

  // Mock reports data
  const reports: Report[] = [
    {
      id: "RPT-001",
      title: "Weekly Health Monitoring Summary",
      description: "Comprehensive overview of health monitoring activities and key findings for the past week.",
      type: "executive",
      status: "published",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      author: "Dr. Sarah Johnson",
      sections: ["Executive Summary", "Key Metrics", "Alert Analysis", "Recommendations"],
      recipients: ["Health Department", "Emergency Response", "Public Affairs"],
      downloadCount: 47,
      size: "2.3 MB",
    },
    {
      id: "RPT-002",
      title: "Mental Health Crisis Analysis",
      description: "In-depth analysis of mental health trends and crisis indicators across monitored regions.",
      type: "technical",
      status: "published",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      author: "Mental Health Analytics Team",
      sections: ["Data Analysis", "Trend Identification", "Risk Assessment", "Intervention Strategies"],
      recipients: ["Mental Health Services", "Research Teams", "Policy Makers"],
      downloadCount: 23,
      size: "4.7 MB",
    },
    {
      id: "RPT-003",
      title: "Public Health Communication Brief",
      description: "Public-facing summary of current health status and recommended actions for citizens.",
      type: "public",
      status: "draft",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      author: "Communications Team",
      sections: ["Current Status", "Safety Guidelines", "Resources", "FAQ"],
      recipients: ["Public", "Media Outlets", "Community Leaders"],
      downloadCount: 0,
      size: "1.2 MB",
    },
    {
      id: "RPT-004",
      title: "Regulatory Compliance Report",
      description: "Quarterly compliance report for health monitoring and surveillance activities.",
      type: "regulatory",
      status: "scheduled",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      author: "Compliance Office",
      sections: ["Compliance Overview", "Data Governance", "Privacy Measures", "Audit Results"],
      recipients: ["Regulatory Bodies", "Legal Department", "Executive Leadership"],
      downloadCount: 12,
      size: "3.1 MB",
    },
  ]

  const availableSections = [
    "Executive Summary",
    "Key Metrics",
    "Topic Analysis",
    "Sentiment Trends",
    "Geographic Analysis",
    "Alert Summary",
    "Predictive Insights",
    "Risk Assessment",
    "Recommendations",
    "Data Sources",
    "Methodology",
    "Appendices",
  ]

  const reportTemplates = [
    {
      name: "Executive Dashboard",
      description: "High-level overview for leadership",
      sections: ["Executive Summary", "Key Metrics", "Alert Summary", "Recommendations"],
      type: "executive",
    },
    {
      name: "Technical Analysis",
      description: "Detailed technical analysis and methodology",
      sections: ["Data Sources", "Methodology", "Topic Analysis", "Predictive Insights", "Appendices"],
      type: "technical",
    },
    {
      name: "Public Health Brief",
      description: "Public-facing health status update",
      sections: ["Executive Summary", "Key Metrics", "Recommendations"],
      type: "public",
    },
    {
      name: "Regulatory Submission",
      description: "Compliance and regulatory reporting",
      sections: ["Executive Summary", "Data Sources", "Methodology", "Risk Assessment", "Appendices"],
      type: "regulatory",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "secondary"
      case "draft":
        return "outline"
      case "scheduled":
        return "default"
      case "archived":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "executive":
        return "default"
      case "technical":
        return "secondary"
      case "public":
        return "outline"
      case "regulatory":
        return "destructive"
      default:
        return "outline"
    }
  }

  const reportStats = {
    total: reports.length,
    published: reports.filter((r) => r.status === "published").length,
    drafts: reports.filter((r) => r.status === "draft").length,
    totalDownloads: reports.reduce((sum, r) => sum + r.downloadCount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate, manage, and distribute health monitoring reports</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      {/* Report Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{reportStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{reportStats.published}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{reportStats.drafts}</p>
                <p className="text-xs text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{reportStats.totalDownloads}</p>
                <p className="text-xs text-muted-foreground">Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="existing" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="existing">Existing Reports</TabsTrigger>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Reports List */}
            <div className="md:col-span-2 space-y-4">
              {reports.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedReport?.id === report.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getTypeColor(report.type)}>{report.type}</Badge>
                        <Badge variant={getStatusColor(report.status)}>{report.status}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-medium mb-2 leading-tight">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{report.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(report.updatedAt, "MMM dd")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{report.downloadCount}</span>
                        </div>
                      </div>
                      <span>{report.size}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Report Details */}
            <div className="space-y-4">
              {selectedReport ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Report Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">{selectedReport.title}</h4>
                      <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Type:</span>
                        <Badge variant={getTypeColor(selectedReport.type)}>{selectedReport.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge variant={getStatusColor(selectedReport.status)}>{selectedReport.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Author:</span>
                        <span className="text-sm">{selectedReport.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Size:</span>
                        <span className="text-sm">{selectedReport.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Downloads:</span>
                        <span className="text-sm">{selectedReport.downloadCount}</span>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Sections:</h5>
                      <div className="space-y-1">
                        {selectedReport.sections.map((section, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            {index + 1}. {section}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Recipients:</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedReport.recipients.map((recipient, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {recipient}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <Button className="w-full" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share Report
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Select a Report</h3>
                    <p className="text-muted-foreground">Click on a report to view details and actions.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>Create a custom health monitoring report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-title">Report Title</Label>
                    <Input id="report-title" placeholder="Enter report title..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-description">Description</Label>
                    <Textarea id="report-description" placeholder="Brief description of the report..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="executive">Executive Summary</SelectItem>
                        <SelectItem value="technical">Technical Analysis</SelectItem>
                        <SelectItem value="public">Public Health Brief</SelectItem>
                        <SelectItem value="regulatory">Regulatory Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Sections</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {availableSections.map((section) => (
                        <div key={section} className="flex items-center space-x-2">
                          <Checkbox
                            id={section}
                            checked={selectedSections.includes(section)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSections([...selectedSections, section])
                              } else {
                                setSelectedSections(selectedSections.filter((s) => s !== section))
                              }
                            }}
                          />
                          <Label htmlFor={section} className="text-sm">
                            {section}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <div className="text-sm text-muted-foreground">{selectedSections.length} sections selected</div>
                <div className="space-x-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {reportTemplates.map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant={getTypeColor(template.type)}>{template.type}</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Included Sections:</h5>
                      <div className="space-y-1">
                        {template.sections.map((section, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground">
                            • {section}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
