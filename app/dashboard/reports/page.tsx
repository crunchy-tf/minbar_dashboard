// FILE: app/dashboard/reports/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"; // Will be removed if no other buttons remain
import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"; // No longer needed for Generate tab
// import { Label } from "@/components/ui/label"; // No longer needed for Generate tab
// import { Textarea } from "@/components/ui/textarea"; // No longer needed for Generate tab
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // No longer needed for Generate tab
// import { Checkbox } from "@/components/ui/checkbox"; // No longer needed for Generate tab
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DatePickerWithRange } from "@/components/date-range-picker"; // No longer needed for Generate tab
// import type { DateRange } from "react-day-picker"; // No longer needed for Generate tab
// import { subDays, format } from "date-fns"; // subDays no longer needed
import { format } from "date-fns"; // format is still used
import { 
  FileText, 
  Download, 
  Share, 
  Clock, 
  Users, 
  CheckCircle, 
  Eye, 
  // Edit, // No longer needed for Edit Report button
  // Plus // No longer needed for New Report button
} from "lucide-react"

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
  // State related to generating reports is no longer needed
  // const [reportType, setReportType] = useState<string>("executive")
  // const [dateRange, setDateRange] = useState<DateRange | undefined>({
  //   from: subDays(new Date(), 7),
  //   to: new Date(),
  // })
  // const [selectedSections, setSelectedSections] = useState<string[]>([])

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

  // availableSections and reportTemplates are no longer needed as Generate/Templates tabs are removed
  // const availableSections = [...]
  // const reportTemplates = [...]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "secondary"
      case "draft":
        return "outline"
      case "scheduled":
        return "default"
      case "archived":
        return "secondary" // Consider if 'archived' should have a different color
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
          <p className="text-muted-foreground">Browse and manage health monitoring reports</p> {/* Updated description */}
        </div>
        {/* Removed New Report Button 
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
        */}
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
              <FileText className="h-4 w-4 text-orange-500" /> {/* Changed icon from Edit to FileText for drafts */}
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

      <Tabs defaultValue="browse" className="space-y-4"> {/* Changed defaultValue */}
        {/* Changed grid-cols-3 to grid-cols-1 */}
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="browse">Browse Reports</TabsTrigger> {/* Renamed and only tab now */}
          {/* Removed TabsTrigger for "generate" and "templates" */}
        </TabsList>

        <TabsContent value="browse" className="space-y-6"> {/* Changed value to "browse" */}
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
                      {/* Keeping View and Download for list items, Share can be optional */}
                      <div className="flex items-center space-x-2"> 
                        <Eye className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); /* Implement view logic or select */ setSelectedReport(report); }} />
                        <Download className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); alert(`Downloading ${report.title}`); }}/>
                        <Share className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); alert(`Sharing ${report.title}`); }}/>
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

                    {/* Removed action buttons from details panel
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
                    */}
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

        {/* Removed TabsContent for "generate" and "templates" */}

      </Tabs>
    </div>
  )
}