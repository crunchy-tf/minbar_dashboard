"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Target, Zap, Users, FileText, Clock, Shield } from "lucide-react"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
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
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  // Mock insights data
  const keyInsights = [
    {
      id: 1,
      title: "Rising Concern About Hospital Capacity",
      description:
        "Document volume for hospital-related topics increased 45% in the last week, with 'bed shortage' mentions up 67%.",
      severity: "high",
      confidence: 92,
      trend: "increasing",
      category: "Healthcare Infrastructure",
      actionable: true,
      recommendations: [
        "Monitor hospital capacity metrics more closely",
        "Prepare public communication about wait times",
        "Consider resource reallocation strategies",
      ],
    },
    {
      id: 2,
      title: "Positive Sentiment Shift in Mental Health Discussions",
      description:
        "Mental health topics show 23% increase in positive sentiment, particularly around new service availability.",
      severity: "low",
      confidence: 87,
      trend: "improving",
      category: "Mental Health",
      actionable: false,
      recommendations: [
        "Amplify positive mental health messaging",
        "Document successful program elements",
        "Consider expanding successful initiatives",
      ],
    },
    {
      id: 3,
      title: "Vaccine Hesitancy Patterns Stabilizing",
      description:
        "Vaccine-related concerns have plateaued after 3 months of decline, suggesting information campaigns are effective.",
      severity: "medium",
      confidence: 78,
      trend: "stable",
      category: "Public Health",
      actionable: true,
      recommendations: [
        "Maintain current communication strategy",
        "Focus on remaining hesitant demographics",
        "Monitor for new misinformation trends",
      ],
    },
  ]

  const trendAnalysis = [
    { month: "Jan", healthcare: 85, mental_health: 72, vaccines: 68, air_quality: 45 },
    { month: "Feb", healthcare: 88, mental_health: 75, vaccines: 65, air_quality: 52 },
    { month: "Mar", healthcare: 92, mental_health: 78, vaccines: 62, air_quality: 58 },
    { month: "Apr", healthcare: 95, mental_health: 82, vaccines: 60, air_quality: 61 },
    { month: "May", healthcare: 98, mental_health: 85, vaccines: 58, air_quality: 65 },
  ]

  const riskMatrix = [
    { topic: "Hospital Capacity", impact: 95, likelihood: 85, documents: 1200 },
    { topic: "Vaccine Misinformation", impact: 80, likelihood: 60, documents: 890 },
    { topic: "Mental Health Crisis", impact: 75, likelihood: 70, documents: 650 },
    { topic: "Air Quality Concerns", impact: 60, likelihood: 45, documents: 420 },
    { topic: "Healthcare Costs", impact: 70, likelihood: 55, documents: 380 },
  ]

  const performanceMetrics = [
    { metric: "Detection Accuracy", value: 94.2, target: 95, status: "good" },
    { metric: "Response Time", value: 87.5, target: 90, status: "warning" },
    { metric: "Coverage Completeness", value: 96.8, target: 95, status: "excellent" },
    { metric: "False Positive Rate", value: 3.2, target: 5, status: "excellent" },
    { metric: "Trend Prediction", value: 89.1, target: 85, status: "excellent" },
  ]

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
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "stable":
        return <Target className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights & Analytics</h1>
          <p className="text-muted-foreground">Advanced analysis and predictive insights from health monitoring data</p>
        </div>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">12</p>
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
                    <p className="text-2xl font-bold">3</p>
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
                    <p className="text-2xl font-bold">8</p>
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
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
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

                  <div className="mt-4 flex space-x-2">
                    <Button size="sm">View Details</Button>
                    <Button size="sm" variant="outline">
                      Export Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Topic Trend Analysis</CardTitle>
              <CardDescription>Monthly trend analysis across major health topics</CardDescription>
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
                  <Line
                    type="monotone"
                    dataKey="healthcare"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Healthcare Infrastructure"
                  />
                  <Line type="monotone" dataKey="mental_health" stroke="#22c55e" strokeWidth={3} name="Mental Health" />
                  <Line type="monotone" dataKey="vaccines" stroke="#3b82f6" strokeWidth={3} name="Vaccines" />
                  <Line type="monotone" dataKey="air_quality" stroke="#f59e0b" strokeWidth={3} name="Air Quality" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Emerging Topics</CardTitle>
                <CardDescription>New topics gaining attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { topic: "Telehealth Adoption", growth: "+156%", docs: 89 },
                    { topic: "Healthcare Worker Burnout", growth: "+89%", docs: 67 },
                    { topic: "Digital Health Privacy", growth: "+67%", docs: 45 },
                    { topic: "Preventive Care Access", growth: "+34%", docs: 78 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.topic}</p>
                        <p className="text-sm text-muted-foreground">{item.docs} documents</p>
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
                <CardDescription>Topics losing attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { topic: "COVID-19 Restrictions", decline: "-45%", docs: 234 },
                    { topic: "Mask Mandates", decline: "-67%", docs: 123 },
                    { topic: "Lockdown Measures", decline: "-78%", docs: 89 },
                    { topic: "Travel Restrictions", decline: "-56%", docs: 67 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.topic}</p>
                        <p className="text-sm text-muted-foreground">{item.docs} documents</p>
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
              <CardTitle>Risk Impact Matrix</CardTitle>
              <CardDescription>Topic risk assessment based on impact and likelihood</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={riskMatrix}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="likelihood"
                    stroke="hsl(var(--muted-foreground))"
                    name="Likelihood"
                    domain={[0, 100]}
                  />
                  <YAxis dataKey="impact" stroke="hsl(var(--muted-foreground))" name="Impact" domain={[0, 100]} />
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.topic || ""}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Scatter dataKey="documents" fill="#3b82f6" name="Document Volume" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>High Risk Topics</CardTitle>
                <CardDescription>Topics requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMatrix
                    .filter((item) => item.impact > 70 && item.likelihood > 60)
                    .map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-950/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-red-900 dark:text-red-100">{item.topic}</p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                              Impact: {item.impact}% | Likelihood: {item.likelihood}%
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
                <CardTitle>Risk Mitigation</CardTitle>
                <CardDescription>Recommended risk reduction strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      strategy: "Enhanced Monitoring",
                      description: "Increase surveillance frequency for high-risk topics",
                      priority: "High",
                      effort: "Low",
                    },
                    {
                      strategy: "Proactive Communication",
                      description: "Develop messaging for emerging concerns",
                      priority: "Medium",
                      effort: "Medium",
                    },
                    {
                      strategy: "Resource Allocation",
                      description: "Prepare additional resources for capacity issues",
                      priority: "High",
                      effort: "High",
                    },
                    {
                      strategy: "Stakeholder Engagement",
                      description: "Coordinate with healthcare providers",
                      priority: "Medium",
                      effort: "Low",
                    },
                  ].map((strategy, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{strategy.strategy}</h4>
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
                <CardTitle>System Performance Metrics</CardTitle>
                <CardDescription>AI model and system performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {metric.value}% / {metric.target}%
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
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Accuracy Trends</CardTitle>
                <CardDescription>AI model performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={[
                      { week: "W1", accuracy: 91.2, precision: 89.5, recall: 92.1 },
                      { week: "W2", accuracy: 92.1, precision: 90.2, recall: 93.0 },
                      { week: "W3", accuracy: 93.5, precision: 91.8, recall: 94.2 },
                      { week: "W4", accuracy: 94.2, precision: 92.5, recall: 94.8 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[85, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="accuracy"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="precision"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="recall"
                      stackId="3"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Processing Statistics</CardTitle>
              <CardDescription>Real-time system processing metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">Docs/min processed</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">142ms</p>
                  <p className="text-sm text-muted-foreground">Avg response time</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">98.5%</p>
                  <p className="text-sm text-muted-foreground">System uptime</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">99.2%</p>
                  <p className="text-sm text-muted-foreground">Data accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
