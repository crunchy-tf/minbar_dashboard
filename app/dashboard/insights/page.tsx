// FILE: app/dashboard/insights/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, // Added TrendingDown
  AlertTriangle, 
  Target, 
  Zap, 
  Users, 
  FileText, 
  Clock, 
  Shield, 
  BarChart3, 
  Route, 
  Activity,
  Archive // Assuming Archive is used, if not, it can be removed or replaced.
} from "lucide-react"
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
  ScatterChart,
  Scatter,
} from "recharts"

export default function InsightsPage() {

  const keyInsights = [
    {
      id: 1,
      title: "Rising Concern About Hospital Capacity",
      description:
        "Document volume for hospital-related topics increased 45% in the last week, with 'bed shortage' mentions up 67%. Emergency room wait times reported up by 25% in major urban centers.",
      severity: "high",
      confidence: 92,
      trend: "increasing",
      category: "Healthcare Infrastructure",
      actionable: true,
      recommendations: [
        "Monitor hospital capacity metrics (bed occupancy, ER wait times) more closely.",
        "Prepare public communication strategies regarding potential delays and alternative care options.",
        "Evaluate resource reallocation strategies between facilities.",
        "Analyze staffing levels and anticipate overtime needs.",
      ],
    },
    {
      id: 2,
      title: "Positive Sentiment Shift in Mental Health Discussions",
      description:
        "Mental health topics show a 23% increase in positive sentiment, particularly around new service availability and community support programs. Negative sentiment decreased by 15%.",
      severity: "low",
      confidence: 87,
      trend: "improving",
      category: "Mental Health",
      actionable: false,
      recommendations: [
        "Amplify positive mental health messaging and success stories.",
        "Document successful program elements for replication.",
        "Consider expanding successful initiatives to underserved areas.",
        "Gather testimonials from users of new services.",
      ],
    },
    {
      id: 3,
      title: "Vaccine Hesitancy Patterns Stabilizing",
      description:
        "Vaccine-related concerns have plateaued after 3 months of decline, suggesting current information campaigns are maintaining effectiveness but new approaches may be needed for further improvement.",
      severity: "medium",
      confidence: 78,
      trend: "stable",
      category: "Public Health Campaigns",
      actionable: true,
      recommendations: [
        "Maintain current communication strategy for general population.",
        "Develop targeted campaigns for remaining hesitant demographics (e.g., specific age groups, regions).",
        "Monitor social media for new misinformation narratives and address them proactively.",
        "Partner with community leaders to build trust.",
      ],
    },
    {
      id: 4,
      title: "Spike in Air Quality Related Respiratory Complaints",
      description: "A 60% increase in social media mentions of 'coughing', 'asthma', and 'breathing difficulty' correlates with recent poor air quality index readings in industrial zones.",
      severity: "high",
      confidence: 85,
      trend: "increasing",
      category: "Environmental Health",
      actionable: true,
      recommendations: [
        "Issue public health advisories for affected industrial zones.",
        "Recommend staying indoors for vulnerable populations.",
        "Cross-reference with hospital admission data for respiratory illnesses.",
        "Investigate industrial emissions in the identified zones.",
      ],
    },
    {
      id: 5,
      title: "Decreasing Public Interest in COVID-19 Boosters",
      description: "Search query volume and social media discussion about COVID-19 boosters have dropped by 40% in the last month, despite ongoing recommendations for vulnerable groups.",
      severity: "medium",
      confidence: 70,
      trend: "decreasing",
      category: "Public Health Campaigns",
      actionable: true,
      recommendations: [
        "Launch a renewed awareness campaign for booster uptake.",
        "Simplify access to booster appointments.",
        "Address common questions and concerns about booster efficacy and necessity.",
      ],
    },
    {
      id: 6,
      title: "Increased Discussion of Long COVID Symptoms",
      description: "Online forums show a 35% rise in discussions pertaining to 'long COVID', 'brain fog', and 'chronic fatigue', indicating a growing public concern and need for support services.",
      severity: "medium",
      confidence: 88,
      trend: "increasing",
      category: "Chronic Disease Management",
      actionable: true,
      recommendations: [
        "Assess availability of Long COVID clinics and support groups.",
        "Disseminate information on managing Long COVID symptoms.",
        "Conduct research into the prevalence and impact of Long COVID in the region.",
      ],
    },
    {
      id: 7,
      title: "High Satisfaction with New Telehealth Services",
      description: "User feedback from telehealth platforms indicates an 85% satisfaction rate, with users citing convenience and accessibility as key benefits.",
      severity: "low", // Positive insight
      confidence: 95,
      trend: "improving", // Or stable if satisfaction is consistently high
      category: "Healthcare Delivery",
      actionable: false, // Or true if action is to expand/promote
      recommendations: [
        "Promote telehealth services more widely.",
        "Identify and address any reported pain points to further improve satisfaction.",
        "Explore expanding the range of services offered via telehealth.",
      ],
    },
    {
      id: 8,
      title: "Potential Shortage of Pediatric Flu Vaccine",
      description: "Supply chain monitors and pharmacy reports suggest a potential localized shortage of pediatric flu vaccines in several rural counties due to distribution issues.",
      severity: "high",
      confidence: 75,
      trend: "stable", // Trend of the shortage, not flu cases
      category: "Supply Chain",
      actionable: true,
      recommendations: [
        "Verify current stock levels in affected counties.",
        "Expedite shipments to rural pharmacies.",
        "Communicate transparently with parents about availability.",
      ],
    },
  ];

  const trendAnalysis = [
    { month: "Jul '24", healthcare: 70, mental_health: 65, vaccines: 75, air_quality: 50, supply_chain: 60, chronic_disease: 55 },
    { month: "Aug '24", healthcare: 72, mental_health: 68, vaccines: 72, air_quality: 55, supply_chain: 62, chronic_disease: 57 },
    { month: "Sep '24", healthcare: 75, mental_health: 70, vaccines: 68, air_quality: 60, supply_chain: 58, chronic_disease: 60 },
    { month: "Oct '24", healthcare: 80, mental_health: 75, vaccines: 65, air_quality: 62, supply_chain: 65, chronic_disease: 65 },
    { month: "Nov '24", healthcare: 85, mental_health: 78, vaccines: 60, air_quality: 58, supply_chain: 70, chronic_disease: 68 },
    { month: "Dec '24", healthcare: 88, mental_health: 80, vaccines: 58, air_quality: 55, supply_chain: 68, chronic_disease: 70 },
    { month: "Jan '25", healthcare: 90, mental_health: 82, vaccines: 55, air_quality: 50, supply_chain: 65, chronic_disease: 72 },
    { month: "Feb '25", healthcare: 88, mental_health: 79, vaccines: 57, air_quality: 52, supply_chain: 60, chronic_disease: 70 },
    { month: "Mar '25", healthcare: 92, mental_health: 78, vaccines: 60, air_quality: 58, supply_chain: 63, chronic_disease: 68 },
    { month: "Apr '25", healthcare: 95, mental_health: 82, vaccines: 62, air_quality: 61, supply_chain: 67, chronic_disease: 70 },
    { month: "May '25", healthcare: 98, mental_health: 85, vaccines: 65, air_quality: 65, supply_chain: 72, chronic_disease: 75 },
    { month: "Jun '25", healthcare: 96, mental_health: 83, vaccines: 68, air_quality: 60, supply_chain: 70, chronic_disease: 73 },
  ];

  const riskMatrix = [
    { topic: "Hospital Capacity Crunch", impact: 95, likelihood: 85, documents: 1200, category: "Infrastructure" },
    { topic: "Vaccine Misinformation Wave", impact: 80, likelihood: 60, documents: 890, category: "Misinformation" },
    { topic: "Mental Health Service Overload", impact: 85, likelihood: 70, documents: 650, category: "Mental Health" },
    { topic: "Severe Air Quality Incidents", impact: 70, likelihood: 45, documents: 420, category: "Environment" },
    { topic: "Healthcare Worker Strike", impact: 90, likelihood: 30, documents: 300, category: "Workforce" },
    { topic: "Pharmaceutical Supply Disruption", impact: 75, likelihood: 50, documents: 550, category: "Supply Chain" },
    { topic: "Emergence of New Flu Strain", impact: 88, likelihood: 40, documents: 700, category: "Disease" },
    { topic: "Cyberattack on Health Records", impact: 92, likelihood: 25, documents: 200, category: "Cybersecurity" },
    { topic: "Failure of Public Health Campaign", impact: 60, likelihood: 55, documents: 480, category: "Campaigns" },
    { topic: "Increase in Antimicrobial Resistance", impact: 82, likelihood: 35, documents: 350, category: "Disease" },
  ];

  const performanceMetrics = [
    { metric: "Insight Detection Accuracy", value: 94.2, target: 95, status: "good" },
    { metric: "Alert Generation Latency (P95)", value: 250, target: 500, unit: "ms", lower_is_better: true, status: "excellent" },
    { metric: "Trend Prediction Accuracy (MAE)", value: 0.08, target: 0.1, lower_is_better: true, status: "excellent" },
    { metric: "Data Ingestion Rate", value: 1500, target: 1000, unit: "docs/min", status: "excellent" },
    { metric: "False Positive Rate (Insights)", value: 3.2, target: 5, unit: "%", lower_is_better: true, status: "excellent" },
    { metric: "False Negative Rate (Insights)", value: 4.5, target: 5, unit: "%", lower_is_better: true, status: "good" },
    { metric: "API Response Time (P99)", value: 450, target: 800, unit: "ms", lower_is_better: true, status: "excellent"},
    { metric: "System Uptime", value: 99.95, target: 99.9, unit: "%", status: "excellent" },
    { metric: "Coverage Completeness (Sources)", value: 96.8, target: 98, unit: "%", status: "good" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "decreasing":
         return <TrendingDown className="h-4 w-4 text-green-500" />
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "stable":
        return <Target className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getPerformanceProgress = (value: number, target: number, lower_is_better?: boolean) => {
    if (lower_is_better) {
      if (value === 0 && target === 0) return 100;
      if (target === 0 && value > 0) return 0; 
      if (value <= target) return 100; // If at or better than target
      // Calculate how much worse it is relative to a zero baseline (or target if target is a "bad" max)
      // This simple version assumes a positive value is "bad" if lower_is_better
      // A more nuanced calculation might be needed depending on the metric.
      // For now, let's assume target is a good value, and anything above is proportionally worse.
      // If value is 2*target, progress is 0. If value is target, progress 100.
      // This is a bit simplistic for "lower is better". Let's refine:
      // If value is less than or equal to target, it's 100% (or more, capped at 100)
      if (value <= target) return 100;
      // If value is greater, it's worse. How much worse?
      // Example: target 5, value 10. Should be 0% progress or negative.
      // Example: target 5, value 7.5. Should be 50% of the "bad" range.
      // Let's consider 2*target as the "worst" (0% progress).
      const maxBad = target * 2; // Or some other reasonable upper bound for "badness"
      if (value >= maxBad) return 0;
      return Math.max(0, 100 * ( (maxBad - value) / (maxBad - target) ) );

    }
    if (target === 0 && value === 0) return 100;
    if (target === 0 && value > 0) return 100;
    return Math.min(100, (value / target) * 100);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights & Analytics</h1>
          <p className="text-muted-foreground">Advanced analysis and predictive insights from health monitoring data</p>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{keyInsights.length}</p>
                    <p className="text-sm text-muted-foreground">Active Insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{keyInsights.filter(i => i.severity === 'high').length}</p>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{keyInsights.filter(i => i.actionable).length}</p>
                    <p className="text-sm text-muted-foreground">Actionable</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {keyInsights.length > 0 
                        ? Math.round(keyInsights.reduce((sum, i) => sum + i.confidence, 0) / keyInsights.length)
                        : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {keyInsights.map((insight) => (
              <Card key={insight.id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        {getTrendIcon(insight.trend)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(insight.severity)}>{insight.severity} priority</Badge>
                        <Badge variant="outline">{insight.category}</Badge>
                        {insight.actionable && <Badge variant="secondary">Actionable</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="text-2xl font-bold">{insight.confidence}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{insight.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recommended Actions:</h4>
                    <ul className="space-y-1">
                      {insight.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Topic Interest Over Time</CardTitle>
              <CardDescription>Monthly trend analysis across major health topics and concerns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="healthcare" stroke="#ef4444" strokeWidth={2} name="Healthcare Infrastructure" />
                  <Line type="monotone" dataKey="mental_health" stroke="#22c55e" strokeWidth={2} name="Mental Health" />
                  <Line type="monotone" dataKey="vaccines" stroke="#3b82f6" strokeWidth={2} name="Vaccines & Public Health" />
                  <Line type="monotone" dataKey="air_quality" stroke="#f59e0b" strokeWidth={2} name="Environmental Health" />
                  <Line type="monotone" dataKey="supply_chain" stroke="#8b5cf6" strokeWidth={2} name="Supply Chain" />
                  <Line type="monotone" dataKey="chronic_disease" stroke="#ec4899" strokeWidth={2} name="Chronic Disease" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Emerging Topics</CardTitle>
                <CardDescription>New topics gaining significant attention recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { topic: "Telehealth Burnout for Providers", growth: "+210%", docs: 150, category: "Workforce" },
                    { topic: "AI in Medical Diagnosis Ethics", growth: "+180%", docs: 120, category: "Technology" },
                    { topic: "Climate Change Impact on Allergy Season", growth: "+150%", docs: 220, category: "Environment" },
                    { topic: "Post-Pandemic Social Anxiety in Teens", growth: "+135%", docs: 180, category: "Mental Health" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.topic}</p>
                        <p className="text-sm text-muted-foreground">{item.docs} documents ({item.category})</p>
                      </div>
                      <Badge variant="secondary">{item.growth}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Declining Topics</CardTitle>
                <CardDescription>Topics with significantly reduced public discussion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { topic: "Original COVID-19 Strain Symptoms", decline: "-85%", docs: 50, category: "Disease" },
                    { topic: "Effectiveness of Early Lockdowns", decline: "-70%", docs: 90, category: "Policy" },
                    { topic: "Hand Sanitizer Shortages", decline: "-95%", docs: 20, category: "Supply Chain" },
                    { topic: "Social Distancing Guidelines", decline: "-80%", docs: 110, category: "Policy" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.topic}</p>
                        <p className="text-sm text-muted-foreground">{item.docs} documents ({item.category})</p>
                      </div>
                      <Badge variant="outline">{item.decline}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Risk Impact Matrix</CardTitle>
              <CardDescription>Potential impact and likelihood of various health-related risks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={riskMatrix} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" dataKey="likelihood" stroke="hsl(var(--muted-foreground))" name="Likelihood (%)" domain={[0, 100]} unit="%"/>
                  <YAxis type="number" dataKey="impact" stroke="hsl(var(--muted-foreground))" name="Impact (Score)" domain={[0, 100]} unit="/100"/>
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name, props) => {
                       if (name === "documents") return [value, `Documents (${props.payload.category})`];
                       if (name === "likelihood") return [`${value}%`, "Likelihood"];
                       if (name === "impact") return [`${value}/100`, "Impact Score"];
                       return value;
                    }}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.topic || ""}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Scatter dataKey="documents" fill="#3b82f6" name="Document Volume" shape="circle" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top High-Risk Concerns</CardTitle>
                <CardDescription>Topics requiring immediate attention based on impact and likelihood</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMatrix
                    .filter((item) => item.impact > 70 && item.likelihood > 50)
                    .sort((a,b) => (b.impact * b.likelihood) - (a.impact * a.likelihood))
                    .slice(0, 5) 
                    .map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-950/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-red-900 dark:text-red-100">{item.topic} ({item.category})</p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                              Impact: {item.impact}/100 | Likelihood: {item.likelihood}%
                            </p>
                          </div>
                          <Badge variant="destructive">{item.documents} docs</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Potential Risk Mitigation Strategies</CardTitle>
                <CardDescription>General strategies for addressing identified risks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { strategy: "Targeted Public Awareness Campaigns", description: "Develop and deploy campaigns for high-risk/high-likelihood issues (e.g., misinformation, low vaccine uptake).", priority: "High", effort: "Medium", icon: <Lightbulb className="h-4 w-4 mr-2" /> },
                    { strategy: "Resource Stockpiling & Allocation", description: "Ensure adequate medical supplies and personnel for anticipated surges (e.g., hospital capacity, flu season).", priority: "High", effort: "High", icon: <Archive className="h-4 w-4 mr-2" /> },
                    { strategy: "Enhanced Surveillance Protocols", description: "Increase monitoring frequency and data sources for emerging threats or escalating situations.", priority: "Medium", effort: "Medium", icon: <Activity className="h-4 w-4 mr-2" /> },
                    { strategy: "Inter-Agency Coordination Drills", description: "Conduct drills for complex scenarios like cyberattacks or multi-faceted public health crises.", priority: "Medium", effort: "High", icon: <Users className="h-4 w-4 mr-2" /> },
                    { strategy: "Policy Review & Adaptation", description: "Review existing public health policies for effectiveness and adapt based on new insights.", priority: "Low", effort: "Medium", icon: <FileText className="h-4 w-4 mr-2" /> },
                  ].map((strategy, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium flex items-center">{strategy.icon} {strategy.strategy}</h4>
                        <div className="flex space-x-2">
                          <Badge variant={strategy.priority === "High" ? "destructive" : "default"}>
                            {strategy.priority}
                          </Badge>
                          <Badge variant="outline">{strategy.effort} effort</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI & System Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for the monitoring system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {metric.value}{metric.unit || "%"} / {metric.target}{metric.unit || "%"}
                          </span>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              metric.status === "excellent"
                                ? "bg-green-500"
                                : metric.status === "good"
                                  ? "bg-blue-500"
                                  : metric.status === "warning"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                          />
                        </div>
                      </div>
                      <Progress value={getPerformanceProgress(metric.value, metric.target, metric.lower_is_better)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Accuracy & Health Over Time</CardTitle>
                <CardDescription>Performance trends for core AI models</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={[
                      { period: "Q1 '24", accuracy: 90.5, precision: 88.0, recall: 91.5, f1: 89.7 },
                      { period: "Q2 '24", accuracy: 91.2, precision: 89.5, recall: 92.1, f1: 90.8 },
                      { period: "Q3 '24", accuracy: 92.1, precision: 90.2, recall: 93.0, f1: 91.6 },
                      { period: "Q4 '24", accuracy: 93.5, precision: 91.8, recall: 94.2, f1: 93.0 },
                      { period: "Q1 '25", accuracy: 94.2, precision: 92.5, recall: 94.8, f1: 93.6 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[80, 100]} unit="%"/>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                       formatter={(value: number) => `${value.toFixed(1)}%`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="accuracy" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Overall Accuracy" />
                    <Area type="monotone" dataKey="precision" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Precision"/>
                    <Area type="monotone" dataKey="recall" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Recall"/>
                     <Area type="monotone" dataKey="f1" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="F1-Score"/>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Processing Statistics</CardTitle>
              <CardDescription>Overview of real-time system processing metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">~1,350</p>
                  <p className="text-sm text-muted-foreground">Docs/min processed</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">~130ms</p>
                  <p className="text-sm text-muted-foreground">Avg Insight Latency</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">75</p>
                  <p className="text-sm text-muted-foreground">Active Data Sources</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Route className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">5M+</p>
                  <p className="text-sm text-muted-foreground">Signals Tracked Daily</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}