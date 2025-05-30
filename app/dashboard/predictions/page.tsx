// FILE: app/dashboard/predictions/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  CheckCircle, 
  Clock,
  BarChart3, 
  ListChecks, 
  Zap,
  Users // Added Users
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
import { format, addDays, addWeeks, subDays, subWeeks } from "date-fns"

interface Prediction {
  id: string
  title: string
  description: string
  confidence: number
  timeframe: string
  category: string
  impact: "high" | "medium" | "low"
  likelihood: number // Percentage
  trend: "increasing" | "decreasing" | "stable"
  lastUpdated: Date
  dataPoints: Array<{ date: Date; actual?: number; predicted: number; confidence_interval: [number, number] }>
  keyFactors?: string[]
  mitigationSuggestions?: string[]
}

export default function PredictionsPage() {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)
  const now = new Date();

  const allPredictions: Prediction[] = [
    {
      id: "PRED-001",
      title: "Hospital Capacity Strain Forecast (Next 7 Days)",
      description: "Predictive model indicates hospital bed occupancy will reach 92% (CI: 88-96%) within the next 7 days due to rising RSV cases and existing staff shortages.",
      confidence: 87,
      timeframe: "7 days",
      category: "Healthcare Infrastructure",
      impact: "high",
      likelihood: 85,
      trend: "increasing",
      lastUpdated: subDays(now,1),
      dataPoints: [
        { date: subDays(now, 2), actual: 75, predicted: 76, confidence_interval: [73, 79] },
        { date: subDays(now, 1), actual: 78, predicted: 79, confidence_interval: [76, 82] },
        { date: now, predicted: 82, confidence_interval: [78, 86] },
        { date: addDays(now, 1), predicted: 85, confidence_interval: [80, 90] },
        { date: addDays(now, 2), predicted: 88, confidence_interval: [83, 93] },
        { date: addDays(now, 3), predicted: 90, confidence_interval: [85, 95] },
        { date: addDays(now, 4), predicted: 92, confidence_interval: [87, 97] },
      ],
      keyFactors: ["RSV seasonality", "Current staffing levels", "ER admission rates"],
      mitigationSuggestions: ["Implement surge capacity protocols", "Cross-train staff", "Divert non-critical cases"]
    },
    {
      id: "PRED-002",
      title: "Mental Health Crisis Peak (Next 14 Days)",
      description: "AI analysis suggests mental health-related helpline calls will peak in approximately 14 days, potentially increasing by 25-35%, coinciding with seasonal depression patterns and post-holiday stress.",
      confidence: 73,
      timeframe: "14 days",
      category: "Mental Health",
      impact: "high",
      likelihood: 78,
      trend: "increasing",
      lastUpdated: subDays(now,2),
      dataPoints: [
        { date: subDays(now,3), actual: 230, predicted: 235, confidence_interval: [220, 250] },
        { date: now, actual: 245, predicted: 250, confidence_interval: [230, 270] },
        { date: addDays(now, 7), predicted: 330, confidence_interval: [300, 360] },
        { date: addDays(now, 14), predicted: 420, confidence_interval: [380, 460] },
      ],
      keyFactors: ["Seasonal Affective Disorder (SAD) period", "Economic indicators", "Social media sentiment"],
      mitigationSuggestions: ["Increase helpline staffing", "Promote mental health resources", "Launch awareness campaigns"]
    },
    {
      id: "PRED-003",
      title: "Vaccine Hesitancy Decline (Next 30 Days)",
      description: "Sentiment analysis and behavioral modeling predict a further 10-15% reduction in online vaccine hesitancy discussions over the next 30 days due to ongoing targeted educational campaigns.",
      confidence: 82,
      timeframe: "30 days",
      category: "Public Health Campaigns",
      impact: "medium",
      likelihood: 80,
      trend: "decreasing",
      lastUpdated: now,
      dataPoints: [
        { date: subWeeks(now,1), actual: 160, predicted: 162, confidence_interval: [150, 174] },
        { date: now, actual: 156, predicted: 155, confidence_interval: [145, 165] },
        { date: addWeeks(now, 2), predicted: 140, confidence_interval: [125, 155] },
        { date: addWeeks(now, 4), predicted: 132, confidence_interval: [115, 149] },
      ],
      keyFactors: ["Effectiveness of current campaigns", "Key influencer endorsements", "Misinformation spread"],
      mitigationSuggestions: ["Maintain campaign momentum", "Address new misinformation quickly", "Highlight success stories"]
    },
    {
      id: "PRED-004",
      title: "Air Quality Impact on Respiratory Illness (Next 21 Days)",
      description: "Environmental data combined with health monitoring suggests a potential 20-25% increase in clinic visits for respiratory issues if current air quality alerts persist for another week.",
      confidence: 69,
      timeframe: "21 days",
      category: "Environmental Health",
      impact: "medium",
      likelihood: 72,
      trend: "increasing",
      lastUpdated: subDays(now,1),
      dataPoints: [
        { date: now, actual: 89, predicted: 90, confidence_interval: [82, 98] },
        { date: addDays(now, 7), predicted: 105, confidence_interval: [95, 115] },
        { date: addDays(now, 14), predicted: 118, confidence_interval: [102, 134] },
        { date: addDays(now, 21), predicted: 128, confidence_interval: [109, 147] },
      ],
      keyFactors: ["PM2.5 levels", "Wind patterns", "Prevalence of existing respiratory conditions"],
      mitigationSuggestions: ["Issue public advisories", "Recommend N95 masks in affected areas", "Ensure pharmacies are stocked with inhalers"]
    },
    {
        id: "PRED-005",
        title: "Increase in Foodborne Illness Reports (Next 10 Days)",
        description: "A rise in 'food poisoning' and 'stomach flu' mentions on social media, coupled with recent warm weather, predicts a 15-20% increase in reported foodborne illnesses.",
        confidence: 77,
        timeframe: "10 days",
        category: "Disease Surveillance",
        impact: "medium",
        likelihood: 65,
        trend: "increasing",
        lastUpdated: now,
        dataPoints: [
            { date: subDays(now, 1), actual: 30, predicted: 32, confidence_interval: [28, 36] },
            { date: now, predicted: 35, confidence_interval: [30, 40] },
            { date: addDays(now, 5), predicted: 42, confidence_interval: [37, 47] },
            { date: addDays(now, 10), predicted: 50, confidence_interval: [43, 57] },
        ],
        keyFactors: ["Ambient temperature", "Outdoor event frequency", "Social media chatter on food safety"],
        mitigationSuggestions: ["Public service announcements on food handling", "Increased inspections of food vendors", "Monitor ER for gastrointestinal cases"]
    },
    {
        id: "PRED-006",
        title: "Seasonal Allergy Peak Forecast (Next 3 Weeks)",
        description: "Pollen count models and historical data predict a peak in allergy-related symptoms and OTC medication sales within the next three weeks.",
        confidence: 90,
        timeframe: "3 weeks",
        category: "Environmental Health",
        impact: "low",
        likelihood: 95,
        trend: "increasing",
        lastUpdated: subDays(now,3),
        dataPoints: [
            { date: subWeeks(now,1), actual: 1500, predicted: 1550, confidence_interval: [1400, 1700] },
            { date: now, predicted: 1800, confidence_interval: [1650, 1950] },
            { date: addWeeks(now, 1), predicted: 2200, confidence_interval: [2000, 2400] },
            { date: addWeeks(now, 2), predicted: 2500, confidence_interval: [2250, 2750] }, 
            { date: addWeeks(now, 3), predicted: 2100, confidence_interval: [1900, 2300] },
        ],
        keyFactors: ["Pollen forecasts (specific types)", "Weather conditions (wind, rain)", "Historical allergy season data"],
        mitigationSuggestions: ["Issue pollen advisories", "Recommend allergy medications", "Suggest staying indoors during peak pollen times"]
    },
    {
        id: "PRED-007",
        title: "Stabilization of Norovirus Outbreak (Next 7 Days)",
        description: "Following public health interventions, models predict a stabilization and subsequent decline in new Norovirus cases reported in community settings over the next week.",
        confidence: 70,
        timeframe: "7 days",
        category: "Disease Surveillance",
        impact: "medium",
        likelihood: 60,
        trend: "decreasing",
        lastUpdated: subDays(now,1),
        dataPoints: [
            { date: subDays(now,2), actual: 45, predicted: 43, confidence_interval: [38, 48] }, 
            { date: subDays(now,1), actual: 40, predicted: 38, confidence_interval: [33, 43] },
            { date: now, predicted: 35, confidence_interval: [30, 40] },
            { date: addDays(now, 3), predicted: 25, confidence_interval: [20, 30] },
            { date: addDays(now, 7), predicted: 15, confidence_interval: [10, 20] },
        ],
        keyFactors: ["Effectiveness of hygiene campaigns", "School closure data (if any)", "Reporting rates from clinics"],
        mitigationSuggestions: ["Continue hygiene promotion", "Monitor for any resurgence", "Track recovery rates"]
    },
    {
        id: "PRED-008",
        title: "Anticipated Rise in Demand for Elective Surgeries (Next Quarter)",
        description: "Predicts a 15-20% rise in demand for elective surgeries as patient confidence returns and backlogs are addressed, potentially straining OR capacity.",
        confidence: 85,
        timeframe: "90 days",
        category: "Healthcare Infrastructure",
        impact: "medium",
        likelihood: 75,
        trend: "increasing",
        lastUpdated: subWeeks(now,1),
        dataPoints: [
            { date: now, actual: 1000, predicted: 1000, confidence_interval: [950, 1050] }, 
            { date: addDays(now, 30), predicted: 1080, confidence_interval: [1000, 1160] },
            { date: addDays(now, 60), predicted: 1150, confidence_interval: [1050, 1250] },
            { date: addDays(now, 90), predicted: 1200, confidence_interval: [1100, 1300] },
        ],
        keyFactors: ["Reduction in COVID-19 restrictions", "Patient backlog data", "Surgeon availability"],
        mitigationSuggestions: ["Optimize OR scheduling", "Assess staffing for surgical teams", "Manage patient expectations on wait times"]
    }
  ];

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
    { model: "Hospital Capacity Forecaster", accuracy: 87, precision: 84, recall: 89, f1_score: 86, last_trained: subDays(now, 5).toISOString() },
    { model: "Mental Health Trend Predictor", accuracy: 73, precision: 76, recall: 71, f1_score: 73, last_trained: subDays(now, 10).toISOString() },
    { model: "Vaccine Sentiment Modeler", accuracy: 82, precision: 80, recall: 85, f1_score: 82, last_trained: subDays(now, 3).toISOString() },
    { model: "Environmental Health Linkage AI", accuracy: 69, precision: 72, recall: 67, f1_score: 69, last_trained: subDays(now, 12).toISOString() },
    { model: "Communicable Disease Spread Model", accuracy: 91, precision: 89, recall: 93, f1_score: 91, last_trained: subDays(now, 2).toISOString() },
    { model: "Seasonal Illness Forecaster (Flu/RSV)", accuracy: 85, precision: 82, recall: 88, f1_score: 85, last_trained: subWeeks(now, 2).toISOString()},
    { model: "Supply Chain Risk Predictor", accuracy: 79, precision: 75, recall: 83, f1_score: 79, last_trained: subWeeks(now, 1).toISOString()}
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Predictive Analytics</h1>
          <p className="text-muted-foreground">AI-powered forecasting and trend predictions for health monitoring</p>
        </div>
      </div>

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
              <AlertTriangle className="h-4 w-4 text-red-500" />
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
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
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
                        <span>Updated {format(prediction.lastUpdated, "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={prediction.confidence} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              {selectedPrediction ? (
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>{selectedPrediction.title}</CardTitle>
                    <CardDescription>Category: {selectedPrediction.category} | Impact: {selectedPrediction.impact}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1 text-sm">Forecast Chart ({selectedPrediction.timeframe})</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <ComposedChart data={selectedPrediction.dataPoints}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(value) => format(new Date(value), "MM/dd")}/>
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <Tooltip labelFormatter={(value) => format(new Date(value), "MMM dd, yyyy")} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}/>
                          <Legend wrapperStyle={{fontSize: "12px"}}/>
                          <Area type="monotone" dataKey="confidence_interval" stroke="none" fill="#3b82f6" fillOpacity={0.1} name="Conf. Interval"/>
                          <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{r:3}} name="Actual"/>
                          <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{r:3}} name="Predicted"/>
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Description:</span> {selectedPrediction.description}</p>
                        <p><span className="font-medium">Confidence:</span> {selectedPrediction.confidence}%</p>
                        <p><span className="font-medium">Likelihood:</span> {selectedPrediction.likelihood}%</p>
                        {selectedPrediction.keyFactors && selectedPrediction.keyFactors.length > 0 && (
                            <p><span className="font-medium">Key Factors:</span> {selectedPrediction.keyFactors.join(", ")}</p>
                        )}
                    </div>
                    {selectedPrediction.mitigationSuggestions && selectedPrediction.mitigationSuggestions.length > 0 && (
                        <div>
                            <h5 className="text-sm font-medium mt-3 mb-1">Mitigation Suggestions:</h5>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {selectedPrediction.mitigationSuggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                            </ul>
                        </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Select a Prediction</h3>
                    <p className="text-muted-foreground">Click on a prediction from the list to view detailed forecasts and analysis.</p>
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
              <CardDescription>Performance evaluation of AI prediction models (higher is generally better)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={modelPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} unit="%"/>
                  <YAxis dataKey="model" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px"}} formatter={(value: number) => `${value.toFixed(1)}%`} />
                  <Legend wrapperStyle={{fontSize: "12px"}} />
                  <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy" barSize={10}/>
                  <Bar dataKey="precision" fill="#10b981" name="Precision" barSize={10}/>
                  <Bar dataKey="recall" fill="#f59e0b" name="Recall" barSize={10}/>
                  <Bar dataKey="f1_score" fill="#ef4444" name="F1 Score" barSize={10}/>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Model Training Status</CardTitle>
                <CardDescription>Current status and last retraining of prediction models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelPerformance.map((model, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{model.model}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant={model.accuracy >= 80 ? "default" : "outline"} className={model.accuracy >= 90 ? "bg-green-100 text-green-800" : model.accuracy >=80 ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}>
                            {model.accuracy >= 90 ? "Excellent" : model.accuracy >=80 ? "Good" : "Fair"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{model.accuracy}%</span>
                        </div>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                      <p className="text-xs text-muted-foreground">Last trained: {format(new Date(model.last_trained), "MMM dd, yyyy")}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Model Improvements</CardTitle>
                <CardDescription>Log of latest model updates and performance changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { model: "Disease Spread Model", update: "Incorporated mobility data", improvement: "+2.1% F1", date: "2 days ago", icon: <Zap className="h-4 w-4 text-green-500" /> },
                    { model: "Hospital Capacity Forecaster", update: "Retrained with Q1 regional data", improvement: "+1.5% Accuracy", date: "5 days ago", icon: <Zap className="h-4 w-4 text-green-500" /> },
                    { model: "Mental Health Predictor", update: "Added new sentiment features", improvement: "+0.8% Recall", date: "1 week ago", icon: <Zap className="h-4 w-4 text-green-500" /> },
                    { model: "Vaccine Sentiment Modeler", update: "Adjusted for new campaign data", improvement: "+1.2% Precision", date: "2 weeks ago", icon: <Zap className="h-4 w-4 text-green-500" /> },
                     { model: "Environmental Linkage AI", update: "Algorithm tuning", improvement: "-0.5% Accuracy (Investigating)", date: "3 days ago", icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> },
                  ].map((update, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      {update.icon}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{update.model}</p>
                        <p className="text-xs text-muted-foreground">{update.update} - <span className={update.improvement.startsWith('+') ? "text-green-600" : "text-red-600"}>{update.improvement}</span></p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">{update.date}</p>
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
                <CardTitle>Scenario Planning & What-If Analysis</CardTitle>
                <CardDescription>Explore potential impacts of different health scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { scenario: "New Highly Transmissible Flu Variant Emergence", probability: 20, impact_score: 90, impact_desc: "Critical", timeframe: "Next 3-6 months", indicators: ["Wastewater surveillance anomalies", "Unusual ER presentation patterns", "International reports"], icon: <Zap className="h-5 w-5 text-red-600" />},
                    { scenario: "Major Heatwave Impacting Vulnerable Populations", probability: 60, impact_score: 75, impact_desc: "High", timeframe: "Next 1-2 months (Summer)", indicators: ["Long-range weather forecasts", "Urban heat island data", "Cooling center availability"], icon: <AlertTriangle className="h-5 w-5 text-orange-500" /> },
                    { scenario: "Sustained Healthcare Staffing Shortage", probability: 45, impact_score: 80, impact_desc: "High", timeframe: "Ongoing (Next 6-12 months)", indicators: ["Staff burnout rates", "Resignation/Retirement trends", "Training pipeline capacity"], icon: <Users className="h-5 w-5 text-yellow-600" /> },
                    { scenario: "Disruption to Critical Medical Supply Chain (e.g. Antibiotics)", probability: 25, impact_score: 85, impact_desc: "High", timeframe: "Next 2-4 months", indicators: ["Geopolitical instability", "Raw material shortages", "Manufacturing plant issues"], icon: <ListChecks className="h-5 w-5 text-purple-600" /> },
                    { scenario: "Successful Rollout of New Preventive Health Program", probability: 70, impact_score: 60, impact_desc: "Medium (Positive)", timeframe: "Next 12-18 months", indicators: ["Program uptake rates", "Early positive health outcomes", "Cost-effectiveness data"], icon: <CheckCircle className="h-5 w-5 text-green-600" /> },
                  ].map((scenario, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium flex items-center">{scenario.icon} <span className="ml-2">{scenario.scenario}</span></h4>
                        <Badge variant={scenario.impact_desc === "Critical" || scenario.impact_desc === "High" && !scenario.impact_desc.includes("Positive") ? "destructive" : (scenario.impact_desc.includes("Positive") ? "default" : "secondary")} className={scenario.impact_desc.includes("Positive") ? "bg-green-100 text-green-700 border-green-300" : ""}>
                          {scenario.impact_desc} Impact
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Estimated Probability:</span>
                          <span>{scenario.probability}%</span>
                        </div>
                        <Progress value={scenario.probability} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Potential Timeframe:</span>
                          <span>{scenario.timeframe}</span>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Key Indicators to Monitor:</p>
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
                <CardTitle>Overall Risk Landscape</CardTitle>
                <CardDescription>Aggregated probability vs. impact for key scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" dataKey="probability" name="Probability" unit="%" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis type="number" dataKey="impact_score" name="Impact Score" unit="/100" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px"}}
                               formatter={(value, name, props) => {
                                   if (name === "probability") return [`${value}%`, "Probability"];
                                   if (name === "impact_score") return [`${value}/100`, "Impact Score"];
                                   return [value, props.payload.scenario]; // Ensure this is what you want in the tooltip for the scatter point itself
                               }}
                               labelFormatter={(label,payload) => payload?.[0]?.payload?.scenario || ""} // This shows the scenario name as the tooltip title
                    />
                    {/* 
                      Scatter 'name' prop usually refers to the series for legend. 
                      If you want individual point names in legend, that's more complex or done with custom legend.
                      For a single scatter series, a general name is fine.
                    */}
                    <Scatter 
                        name="Risk Scenarios" // General name for the series
                        data={[ // Data is directly embedded here now based on the scenarios
                           { scenario: "Flu Variant", probability: 20, impact_score: 90, fill: "#ef4444" },
                           { scenario: "Heatwave", probability: 60, impact_score: 75, fill: "#f97316" },
                           { scenario: "Staff Shortage", probability: 45, impact_score: 80, fill: "#eab308" },
                           { scenario: "Supply Disruption", probability: 25, impact_score: 85, fill: "#8b5cf6" },
                           { scenario: "Preventive Program", probability: 70, impact_score: 60, fill: "#22c55e" }, // Positive impact represented
                        ]} 
                        shape="circle" 
                    />
                  </ScatterChart>
                </ResponsiveContainer>
                 <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <p><span className="inline-block w-3 h-3 rounded-full bg-[#ef4444] mr-1"></span> Flu Variant</p>
                    <p><span className="inline-block w-3 h-3 rounded-full bg-[#f97316] mr-1"></span> Heatwave Impact</p>
                    <p><span className="inline-block w-3 h-3 rounded-full bg-[#eab308] mr-1"></span> Staffing Shortage</p>
                    <p><span className="inline-block w-3 h-3 rounded-full bg-[#8b5cf6] mr-1"></span> Supply Disruption</p>
                     <p><span className="inline-block w-3 h-3 rounded-full bg-[#22c55e] mr-1"></span> Preventive Program (Positive)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}