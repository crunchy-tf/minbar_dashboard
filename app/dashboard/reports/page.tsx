// FILE: app/dashboard/reports/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, subDays, subWeeks, subMonths } from "date-fns"; 
import { 
  FileText, 
  // Download, // Download icon might still be used for the action button, or removed if that button is also removed
  Share, 
  Clock, 
  Users, 
  CheckCircle, 
  Eye, 
} from "lucide-react"

// Removed downloadCount and size from interface
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
  // downloadCount: number; // Removed
  // size: string; // Removed
  tags?: string[]
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const now = new Date();

  const reports: Report[] = [
    {
      id: "RPT-001",
      title: "Weekly Health Monitoring Summary - W23",
      description: "Comprehensive overview of health monitoring activities, key signal changes, and emerging topics for week 23.",
      type: "executive",
      status: "published",
      createdAt: subWeeks(now, 1),
      updatedAt: subDays(now, 3),
      author: "Dr. Anya Sharma",
      sections: ["Executive Summary", "Key Performance Indicators", "Significant Alerts Review", "Topic Trends Overview", "Forward Outlook & Recommendations"],
      recipients: ["Health Commissioner", "Mayor's Office", "Department Heads"],
      // downloadCount: 132, // Removed
      // size: "1.8 MB", // Removed
      tags: ["weekly", "summary", "executive_brief"]
    },
    {
      id: "RPT-002",
      title: "Deep Dive: Mental Health Trends Q2 2025",
      description: "In-depth statistical analysis of mental health-related signals, sentiment shifts, and demographic correlations for the second quarter.",
      type: "technical",
      status: "published",
      createdAt: subMonths(now, 1),
      updatedAt: subWeeks(now, 1),
      author: "Mental Health Analytics Unit",
      sections: ["Introduction & Methodology", "Data Sources & Cleaning", "Trend Analysis (Anxiety, Depression, Stress)", "Sentiment Analysis of Online Discussions", "Geospatial Hotspot Identification", "Correlation with Socioeconomic Factors", "Limitations", "Conclusion & Further Research"],
      recipients: ["Research Division", "Mental Health Services Directorate", "Policy Advisors"],
      // downloadCount: 78, // Removed
      // size: "5.2 MB", // Removed
      tags: ["mental_health", "quarterly", "research", "deep_dive"]
    },
    {
      id: "RPT-003",
      title: "Public Health Advisory: Increased Flu Activity",
      description: "Public-facing communication brief regarding the recent surge in influenza cases and recommended preventive measures.",
      type: "public",
      status: "published",
      createdAt: subDays(now, 5),
      updatedAt: subDays(now, 4),
      author: "Public Health Communications Office",
      sections: ["Current Flu Situation", "Symptoms to Watch For", "Prevention Tips (Vaccination, Hygiene)", "When to Seek Medical Care", "Local Testing & Treatment Resources"],
      recipients: ["General Public (via website, media)", "Community Health Centers", "Schools"],
      // downloadCount: 1250, // Removed
      // size: "0.8 MB", // Removed
      tags: ["public_advisory", "influenza", "seasonal"]
    },
    {
      id: "RPT-004",
      title: "Annual Regulatory Compliance Statement 2024",
      description: "Annual report detailing adherence to data privacy (HIPAA, GDPR equivalent), security protocols, and ethical guidelines in health monitoring operations.",
      type: "regulatory",
      status: "archived",
      createdAt: subMonths(now, 5), 
      updatedAt: subMonths(now, 4),
      author: "Chief Compliance Officer",
      sections: ["Introduction", "Data Governance Framework", "Privacy Impact Assessments Summary", "Security Audit Findings & Remediation", "Ethical Review Board Activities", "Incident Reporting Summary", "Compliance Attestation"],
      recipients: ["Regulatory Oversight Board", "Internal Audit Committee", "Legal Department"],
      // downloadCount: 45, // Removed
      // size: "3.1 MB", // Removed
      tags: ["compliance", "annual", "data_privacy", "security"]
    },
    {
      id: "RPT-005",
      title: "Vaccine Hesitancy Intervention Impact Assessment - Phase 1",
      description: "Evaluation of the initial phase of the targeted campaign to address vaccine hesitancy in specific demographics.",
      type: "technical",
      status: "draft",
      createdAt: subDays(now, 10),
      updatedAt: subDays(now, 2),
      author: "Behavioral Insights Team",
      sections: ["Background & Objectives", "Methodology (Pre/Post Analysis)", "Campaign Reach & Engagement", "Sentiment Shift Analysis", "Reported Uptake Changes (Preliminary)", "Challenges & Lessons Learned", "Recommendations for Phase 2"],
      recipients: ["Vaccination Program Lead", "Communications Strategy Group"],
      // downloadCount: 5, // Removed
      // size: "2.9 MB", // Removed
      tags: ["vaccine_hesitancy", "campaign_evaluation", "draft"]
    },
    {
      id: "RPT-006",
      title: "Environmental Health Risk Profile: Industrial Zone Alpha",
      description: "Detailed risk assessment concerning air and water quality in the Industrial Zone Alpha, including potential health impacts on nearby residential areas.",
      type: "executive",
      status: "published",
      createdAt: subWeeks(now, 3),
      updatedAt: subWeeks(now, 2),
      author: "Environmental Health Task Force",
      sections: ["Executive Summary", "Pollutant Source Identification", "Exposure Pathway Analysis", "Health Impact Projections", "Community Feedback Summary", "Mitigation Options & Costs"],
      recipients: ["City Council", "Environmental Protection Agency Liaison", "Community Representatives"],
      // downloadCount: 92, // Removed
      // size: "4.5 MB", // Removed
      tags: ["environmental", "risk_assessment", "industrial_zone"]
    },
    {
      id: "RPT-007",
      title: "Monthly Emerging Threats Briefing - May 2025",
      description: "Summary of newly identified or escalating public health threats based on multi-source intelligence gathering.",
      type: "executive",
      status: "scheduled", 
      createdAt: subDays(now, 1), 
      updatedAt: now, 
      author: "Horizon Scanning Unit",
      sections: ["Key Emerging Signals", "Potential Pathogen Watchlist", "Geopolitical Health Risks", "Misinformation Hot Topics", "Early Warning Indicators"],
      recipients: ["Strategic Health Command", "Emergency Preparedness Committee"],
      // downloadCount: 0, // Removed
      // size: "1.1 MB", // Removed
      tags: ["emerging_threats", "monthly", "intelligence_brief"]
    },
    {
      id: "RPT-008",
      title: "AI Model Performance & Validation Report - Q1 2025",
      description: "Technical report on the performance, accuracy, and validation metrics for core AI models used in the health monitoring platform.",
      type: "technical",
      status: "published",
      createdAt: subMonths(now, 2),
      updatedAt: subMonths(now, 1),
      author: "AI & Data Science Team",
      sections: ["Introduction to Monitored Models", "Validation Datasets & Methodology", "Performance Metrics (Accuracy, Precision, Recall, F1)", "Bias & Fairness Assessment", "Drift Detection & Retraining Schedule", "Computational Resource Usage"],
      recipients: ["Chief Technology Officer", "AI Ethics Board", "Development Teams"],
      // downloadCount: 33, // Removed
      // size: "6.8 MB", // Removed
      tags: ["ai_model", "performance", "validation", "quarterly"]
    },
    {
      id: "RPT-009",
      title: "Community Health Needs Assessment Summary (2024)",
      description: "A high-level summary of the comprehensive Community Health Needs Assessment (CHNA) conducted across all districts.",
      type: "public",
      status: "archived",
      createdAt: subMonths(now, 6),
      updatedAt: subMonths(now, 5),
      author: "Community Health Planning Dept.",
      sections: ["Overview of CHNA Process", "Top 5 Identified Health Needs", "Disparities Highlighted", "Available Community Assets", "Next Steps for Action Planning"],
      recipients: ["Public Libraries", "Community Non-Profits", "Local Government Archives"],
      // downloadCount: 215, // Removed
      // size: "2.0 MB", // Removed
      tags: ["chna", "community_health", "annual", "archived_summary"]
    },
    {
      id: "RPT-010",
      title: "Special Report: Impact of Social Media on Youth Mental Health",
      description: "An investigative report exploring the correlation between social media usage patterns and mental well-being indicators among adolescents.",
      type: "technical",
      status: "draft",
      createdAt: subWeeks(now, 2),
      updatedAt: subDays(now, 1),
      author: "Dr. E. Vance & Youth Health Research Group",
      sections: ["Literature Review", "Methodology: Social Media Data Analysis & Surveys", "Key Findings: Usage vs. Anxiety/Depression Scores", "Sentiment Analysis of Youth Online Discussions", "Case Studies", "Ethical Considerations", "Policy Recommendations"],
      recipients: ["Child & Adolescent Psychiatry Dept.", "School Board Liaisons", "Parent-Teacher Associations"],
      // downloadCount: 2, // Removed
      // size: "3.5 MB", // Removed
      tags: ["youth_mental_health", "social_media", "research", "draft"]
    }
  ];


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

  // Adjusted reportStats to remove totalDownloads
  const reportStats = {
    total: reports.length,
    published: reports.filter((r) => r.status === "published").length,
    drafts: reports.filter((r) => r.status === "draft").length,
    // totalDownloads: reports.reduce((sum, r) => sum + r.downloadCount, 0), // Removed
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Browse and manage health monitoring reports</p>
        </div>
      </div>

      {/* Report Statistics - Changed to 3 columns, removed Downloads card */}
      <div className="grid gap-4 md:grid-cols-3">
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
              <FileText className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{reportStats.drafts}</p>
                <p className="text-xs text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Removed Downloads Stat Card
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{reportStats.totalDownloads.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        */}
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="browse">Browse Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4  max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {reports.sort((a,b) => b.updatedAt.getTime() - a.updatedAt.getTime()).map((report) => (
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
                        <Eye className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }} />
                        {/* Download button in list can remain as a generic action, or be removed if desired */}
                        {/* <Download className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); alert(`Simulating download for: ${report.title}`); }}/> */}
                        <Share className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); alert(`Sharing report: ${report.title}`); }}/>
                      </div>
                    </div>

                    <h3 className="font-medium mb-1 leading-tight">{report.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">By: {report.author} | Updated: {format(report.updatedAt, "MMM dd, yyyy")}</p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.description}</p>
                    
                    {report.tags && report.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {report.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                        </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{report.recipients.length} Recipients</span>
                        </div>
                        {/* Removed Downloads display from list item
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{report.downloadCount} Downloads</span>
                        </div>
                        */}
                      </div>
                      {/* Removed Size display from list item */}
                      {/* <span>{report.size}</span> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              {selectedReport ? (
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>{selectedReport.title}</CardTitle>
                    <CardDescription>
                        Type: <Badge variant={getTypeColor(selectedReport.type)} className="mr-2">{selectedReport.type}</Badge>
                        Status: <Badge variant={getStatusColor(selectedReport.status)}>{selectedReport.status}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm max-h-[calc(100vh-200px)] overflow-y-auto">
                    <p><span className="font-medium">Description:</span> {selectedReport.description}</p>
                    <p><span className="font-medium">Author:</span> {selectedReport.author}</p>
                    <p><span className="font-medium">Created:</span> {format(selectedReport.createdAt, "MMM dd, yyyy HH:mm")}</p>
                    <p><span className="font-medium">Last Updated:</span> {format(selectedReport.updatedAt, "MMM dd, yyyy HH:mm")}</p>
                    {/* Removed Size and Downloads from details
                    <p><span className="font-medium">Size:</span> {selectedReport.size}</p>
                    <p><span className="font-medium">Downloads:</span> {selectedReport.downloadCount.toLocaleString()}</p>
                    */}
                    
                    <div>
                      <h5 className="font-medium mb-1">Sections:</h5>
                      <ul className="list-disc list-inside pl-4 space-y-0.5">
                        {selectedReport.sections.map((section, index) => (
                          <li key={index} className="text-muted-foreground">{section}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">Recipients:</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedReport.recipients.map((recipient, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{recipient}</Badge>
                        ))}
                      </div>
                    </div>
                     {selectedReport.tags && selectedReport.tags.length > 0 && (
                        <div>
                            <h5 className="font-medium mb-1">Tags:</h5>
                            <div className="flex flex-wrap gap-1">
                                {selectedReport.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                            </div>
                        </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Select a Report</h3>
                    <p className="text-muted-foreground">Click on a report from the list to view its details.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}