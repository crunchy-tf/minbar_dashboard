// FILE: app/dashboard/predictions/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"; // Button import is not needed
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Select imports not needed
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  // Calendar, // Calendar is not needed
  AlertTriangle, // AlertTriangle IS needed for stats card
  CheckCircle, 
  Clock 
} from "lucide-react"
import {
  Line,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ScatterChart,
  Scatter,
} from "recharts"
import { format, addDays, addWeeks } from "date-fns"

interface Prediction {
  id: string
  title: string
  description: string
  confidence: number
  timeframe: string
  category: string
  impact: "high" | "medium" | "low"
  likelihood: number
  trend: "increasing" | "decreasing" | "stable"
  lastUpdated: Date
  dataPoints: Array<{ date: Date; actual?: number; predicted: number; confidence_interval: [number, number] }>
}

export default function PredictionsPage() {
  // const [selectedTimeframe, setSelectedTimeframe] = useState<string>("7d"); // Removed
  // const [selectedCategory, setSelectedCategory] = useState<string>("all"); // Removed
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)

  const allPredictions: Prediction[] = [
    {
      id: "PRED-001",
      title: "Hospital Capacity Strain Forecast",
      description:
        "Predictive model indicates hospital bed occupancy will reach 92% within the next 7 days based on current trends and seasonal patterns.",
      confidence: 87,
      timeframe: "7 days",
      category: "Healthcare Infrastructure",
      impact: "high",
      likelihood: 85,
      trend: "increasing",
      lastUpdated: new Date(),
      dataPoints: [
        { date: new Date(), actual: 78, predicted: 78, confidence_interval: [75, 81] },
        { date: addDays(new Date(), 1), predicted: 82, confidence_interval: [78, 86] },
        { date: addDays(new Date(), 2), predicted: 85, confidence_interval: [80, 90] },
        { date: addDays(new Date(), 3), predicted: 88, confidence_interval: [83, 93] },
        { date: addDays(new Date(), 4), predicted: 90, confidence_interval: [85, 95] },
        { date: addDays(new Date(), 5), predicted: 92, confidence_interval: [87, 97] },
        { date: addDays(new Date(), 6), predicted: 94, confidence_interval: [89, 99] },
        { date: addDays(new Date(), 7), predicted: 96, confidence_interval: [91, 101] },
      ],
    },
    {
      id: "PRED-002",
      title: "Mental Health Crisis Peak Prediction",
      description:
        "AI analysis suggests mental health-related discussions will peak in 14 days, coinciding with seasonal depression patterns and economic stress indicators.",
      confidence: 73,
      timeframe: "14 days",
      category: "Mental Health",
      impact: "high",
      likelihood: 78,
      trend: "increasing",
      lastUpdated: new Date(),
      dataPoints: [
        { date: new Date(), actual: 245, predicted: 245, confidence_interval: [230, 260] },
        { date: addDays(new Date(), 2), predicted: 268, confidence_interval: [250, 286] },
        { date: addDays(new Date(), 4), predicted: 295, confidence_interval: [275, 315] },
        { date: addDays(new Date(), 6), predicted: 325, confidence_interval: [300, 350] },
        { date: addDays(new Date(), 8), predicted: 358, confidence_interval: [330, 386] },
        { date: addDays(new Date(), 10), predicted: 385, confidence_interval: [355, 415] },
        { date: addDays(new Date(), 12), predicted: 405, confidence_interval: [370, 440] },
        { date: addDays(new Date(), 14), predicted: 420, confidence_interval: [380, 460] },
      ],
    },
    {
      id: "PRED-003",
      title: "Vaccine Hesitancy Decline Forecast",
      description:
        "Sentiment analysis and behavioral modeling predict a 15% reduction in vaccine hesitancy discussions over the next 30 days due to successful public health campaigns.",
      confidence: 82,
      timeframe: "30 days",
      category: "Public Health",
      impact: "medium",
      likelihood: 80,
      trend: "decreasing",
      lastUpdated: new Date(),
      dataPoints: [
        { date: new Date(), actual: 156, predicted: 156, confidence_interval: [145, 167] },
        { date: addWeeks(new Date(), 1), predicted: 148, confidence_interval: [135, 161] },
        { date: addWeeks(new Date(), 2), predicted: 140, confidence_interval: [125, 155] },
        { date: addWeeks(new Date(), 3), predicted: 135, confidence_interval: [118, 152] },
        { date: addWeeks(new Date(), 4), predicted: 132, confidence_interval: [115, 149] },
      ],
    },
    {
      id: "PRED-004",
      title: "Air Quality Health Impact Surge",
      description:
        "Environmental data and health monitoring suggest a 25% increase in respiratory health concerns due to predicted air quality deterioration.",
      confidence: 69,
      timeframe: "21 days",
      category: "Environmental Health",
      impact: "medium",
      likelihood: 72,
      trend: "increasing",
      lastUpdated: new Date(),
      dataPoints: [
        { date: new Date(), actual: 89, predicted: 89, confidence_interval: [82, 96] },
        { date: addDays(new Date(), 3), predicted: 95, confidence_interval: [87, 103] },
        { date: addDays(new Date(), 6), predicted: 102, confidence_interval: [92, 112] },
        { date: addDays(new Date(), 9), predicted: 108, confidence_interval: [96, 120] },
        { date: addDays(new Date(), 12), predicted: 115, confidence_interval: [101, 129] },
        { date: addDays(new Date(), 15), predicted: 120, confidence_interval: [104, 136] },
        { date: addDays(new Date(), 18), predicted: 125, confidence_interval: [107, 143] },
        { date: addDays(new Date(), 21), predicted: 128, confidence_interval: [109, 147] },
      ],
    },
  ]

  const filteredPredictions = allPredictions;

  const getImpactColor = (impact: string) => {
    switch (impact) {
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
      case "stable":
        return <Target className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const predictionStats = {
    total: allPredictions.length,
    highConfidence: allPredictions.filter((p) => p.confidence >= 80).length,
    highImpact: allPredictions.filter((p) => p.impact === "high").length,
    avgConfidence: Math.round(allPredictions.reduce((sum, p) => sum + p.confidence, 0) / (allPredictions.length || 1)),
  }

  const modelPerformance = [
    { model: "Hospital Capacity", accuracy: 87, precision: 84, recall: 89, f1_score: 86 },
    { model: "Mental Health Trends", accuracy: 73, precision: 76, recall: 71, f1_score: 73 },
    { model: "Vaccine Sentiment", accuracy: 82, precision: 80, recall: 85, f1_score: 82 },
    { model: "Environmental Health", accuracy: 69, precision: 72, recall: 67, f1_score: 69 },
    { model: "Disease Surveillance", accuracy: 91, precision: 89, recall: 93, f1_score: 91 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Predictive Analytics</h1>
          <p className="text-muted-foreground">AI-powered forecasting and trend predictions for health monitoring</p>
        </div>
        {/* Removed Select dropdowns for category and timeframe */}
      </div>

      {/* Prediction Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{predictionStats.total}</p>
                <p className="text-xs text-muted-foreground">Active Predictions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{predictionStats.highConfidence}</p>
                <p className="text-xs text-muted-foreground">High Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" /> {/* This icon is used here */}
              <div>
                <p className="text-2xl font-bold">{predictionStats.highImpact}</p>
                <p className="text-xs text-muted-foreground">High Impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{predictionStats.avgConfidence}%</p>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Predictions List */}
            <div className="space-y-4">
              {filteredPredictions.map((prediction) => (
                <Card
                  key={prediction.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPrediction?.id === prediction.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedPrediction(prediction)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(prediction.trend)}
                        <Badge variant={getImpactColor(prediction.impact)}>{prediction.impact} impact</Badge>
                        <Badge variant="outline">{prediction.timeframe}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{prediction.confidence}%</div>
                        <div className="text-xs text-muted-foreground">Confidence</div>
                      </div>
                    </div>

                    <h3 className="font-medium mb-2 leading-tight">{prediction.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{prediction.description}</p>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {prediction.category}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Updated {format(prediction.lastUpdated, "MMM dd")}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={prediction.confidence} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Prediction Details */}
            <div className="space-y-4">
              {selectedPrediction ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Prediction Details</CardTitle>
                    <CardDescription>{selectedPrediction.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Forecast Chart</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={selectedPrediction.dataPoints}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickFormatter={(value) => format(new Date(value), "MMM dd")}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip
                            labelFormatter={(value) => format(new Date(value), "MMM dd, yyyy")}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="confidence_interval"
                            stroke="none"
                            fill="#3b82f6"
                            fillOpacity={0.1}
                            name="Confidence Interval"
                          />
                          <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                            name="Actual"
                          />
                          <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                            name="Predicted"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Confidence:</span>
                          <span className="text-sm">{selectedPrediction.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Likelihood:</span>
                          <span className="text-sm">{selectedPrediction.likelihood}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Impact:</span>
                          <Badge variant={getImpactColor(selectedPrediction.impact)}>{selectedPrediction.impact}</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Timeframe:</span>
                          <span className="text-sm">{selectedPrediction.timeframe}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Trend:</span>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(selectedPrediction.trend)}
                            <span className="text-sm">{selectedPrediction.trend}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Category:</span>
                          <span className="text-sm">{selectedPrediction.category}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Description:</h5>
                      <p className="text-sm text-muted-foreground">{selectedPrediction.description}</p>
                    </div>

                    {/* Removed Create Alert and Schedule Review buttons */}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Select a Prediction</h3>
                    <p className="text-muted-foreground">
                      Click on a prediction to view detailed forecasts and analysis.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Metrics</CardTitle>
              <CardDescription>Performance evaluation of AI prediction models</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={modelPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="model" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy" />
                  <Bar dataKey="precision" fill="#10b981" name="Precision" />
                  <Bar dataKey="recall" fill="#f59e0b" name="Recall" />
                  <Bar dataKey="f1_score" fill="#ef4444" name="F1 Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Model Training Status</CardTitle>
                <CardDescription>Current status of prediction models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelPerformance.map((model, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{model.model}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant={model.accuracy >= 80 ? "secondary" : "outline"}>
                            {model.accuracy >= 80 ? "Good" : "Training"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{model.accuracy}%</span>
                        </div>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Model Updates</CardTitle>
                <CardDescription>Latest improvements and retraining</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      model: "Hospital Capacity",
                      update: "Retrained with Q4 data",
                      improvement: "+3.2%",
                      date: "2 hours ago",
                    },
                    {
                      model: "Mental Health Trends",
                      update: "Added seasonal factors",
                      improvement: "+1.8%",
                      date: "1 day ago",
                    },
                    {
                      model: "Disease Surveillance",
                      update: "Enhanced feature set",
                      improvement: "+2.1%",
                      date: "3 days ago",
                    },
                    {
                      model: "Environmental Health",
                      update: "Weather data integration",
                      improvement: "+4.3%",
                      date: "1 week ago",
                    },
                  ].map((update, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{update.model}</p>
                        <p className="text-xs text-muted-foreground">{update.update}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          {update.improvement}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{update.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Planning</CardTitle>
                <CardDescription>What-if analysis for different scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      scenario: "Pandemic Resurgence",
                      probability: 15,
                      impact: "Critical",
                      timeframe: "3-6 months",
                      indicators: ["Mutation detection", "Travel patterns", "Vaccination rates"],
                    },
                    {
                      scenario: "Healthcare Worker Shortage",
                      probability: 35,
                      impact: "High",
                      timeframe: "1-3 months",
                      indicators: ["Burnout rates", "Resignation trends", "Training capacity"],
                    },
                    {
                      scenario: "Mental Health Crisis",
                      probability: 65,
                      impact: "High",
                      timeframe: "2-4 weeks",
                      indicators: ["Economic stress", "Social isolation", "Support availability"],
                    },
                    {
                      scenario: "Supply Chain Disruption",
                      probability: 25,
                      impact: "Medium",
                      timeframe: "1-2 months",
                      indicators: ["Global events", "Manufacturing capacity", "Inventory levels"],
                    },
                  ].map((scenario, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{scenario.scenario}</h4>
                        <Badge
                          variant={
                            scenario.impact === "Critical"
                              ? "destructive"
                              : scenario.impact === "High"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {scenario.impact}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Probability:</span>
                          <span>{scenario.probability}%</span>
                        </div>
                        <Progress value={scenario.probability} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Timeframe:</span>
                          <span>{scenario.timeframe}</span>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Key Indicators:</p>
                          <div className="flex flex-wrap gap-1">
                            {scenario.indicators.map((indicator, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Matrix</CardTitle>
                <CardDescription>Probability vs Impact analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart
                    data={[
                      { scenario: "Pandemic Resurgence", probability: 15, impact: 95 },
                      { scenario: "Healthcare Shortage", probability: 35, impact: 80 },
                      { scenario: "Mental Health Crisis", probability: 65, impact: 75 },
                      { scenario: "Supply Chain", probability: 25, impact: 60 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="probability"
                      stroke="hsl(var(--muted-foreground))"
                      name="Probability"
                      domain={[0, 100]}
                    />
                    <YAxis dataKey="impact" stroke="hsl(var(--muted-foreground))" name="Impact" domain={[0, 100]} />
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.scenario || ""}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Scatter dataKey="impact" fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}