// FILE: app/dashboard/analysis/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api" // We'll use our mock generators instead of api for this demo
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { format, subDays, addDays } from "date-fns" // Added addDays

// --- More human-readable signal names and more examples ---
const AVAILABLE_SIGNAL_NAMES = [
  { value: "topic_3_doc_count", label: "Vaccine Hesitancy Volume" },
  { value: "topic_402_doc_count", label: "Hospital Overwhelm Mentions" },
  { value: "topic_777_doc_count", label: "New Virus Strain Rumors" },
  { value: "topic_1001_doc_count", label: "Mental Health Funding Debates" },
  { value: "topic_604_doc_count", label: "Air Quality & Respiratory Issues" },
  { value: "sentiment_overall_concern", label: "Overall Concern Sentiment" },
  { value: "sentiment_overall_anxiety", label: "Overall Anxiety Sentiment" },
  { value: "sentiment_topic_3_satisfaction", label: "Vaccine Satisfaction Score" },
  { value: "er_wait_time_city_general_avg", label: "City General ER Wait Time (Avg)" },
  { value: "air_quality_region_north_pm25", label: "North Region PM2.5 AQI" },
  { value: "flu_cases_statewide_reported", label: "Statewide Reported Flu Cases" },
  { value: "telehealth_appointments_booked", label: "Telehealth Appointments Booked" },
  { value: "mask_mandate_compliance_rate", label: "Mask Mandate Compliance Rate" },
  { value: "pediatric_asthma_admissions", label: "Pediatric Asthma Admissions" },
  { value: "social_distancing_mentions_decay", label: "Social Distancing Mentions (Decay)" },
];

// --- Mock Data Generation Functions ---

// Simple hash function to seed randomness based on string input
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const generateMockBasicStats = (signalName: string) => {
  const seed = simpleHash(signalName);
  const baseCount = (seed % 100) + 50; // 50-149
  const baseMean = (seed % 50) + 10;  // 10-59
  return {
    count: baseCount,
    sum_val: baseCount * (baseMean + (Math.random() - 0.5) * 10),
    mean: baseMean + (Math.random() - 0.5) * 5,
    median: baseMean + (Math.random() - 0.5) * 3,
    min_val: baseMean - (Math.random() * 5) - 5,
    max_val: baseMean + (Math.random() * 20) + 10,
    std_dev: (baseMean / 4) + (Math.random() * 3),
    variance: Math.pow((baseMean / 4) + (Math.random() * 3), 2),
    metadata: { info: `Mock basic stats for ${signalName}` }
  };
};

const generateMockTimeSeriesPoints = (signalName: string, numPoints = 20, isZScore = false) => {
  const seed = simpleHash(signalName);
  const points = [];
  let currentValue = (seed % 100) + 20; // 20-119
  const baseDate = subDays(new Date(), numPoints);
  for (let i = 0; i < numPoints; i++) {
    currentValue += (Math.random() - 0.5) * (currentValue * 0.2); // Fluctuate by up to 20%
    currentValue = Math.max(5, currentValue); // Ensure positive
    const point: any = {
      timestamp: addDays(baseDate, i).toISOString(),
      original_value: parseFloat(currentValue.toFixed(2)), // For ZScore
      value: parseFloat(currentValue.toFixed(2)) // For MA
    };
    if (isZScore) {
      point.z_score = parseFloat(((Math.random() - 0.5) * 4).toFixed(2)); // Random Z-score between -2 and 2
      delete point.value; // ZScore uses original_value and z_score
    } else {
      delete point.original_value; // MA uses value
    }
    points.push(point);
  }
  return points;
};

const generateMockMovingAverage = (signalName: string) => {
  return {
    points: generateMockTimeSeriesPoints(signalName + "ma", 30),
    window: (simpleHash(signalName) % 5) + 3, // window 3-7
    type: "simple",
    metadata: { info: `Mock moving average for ${signalName}` }
  };
};

const generateMockZScore = (signalName: string) => {
  return {
    points: generateMockTimeSeriesPoints(signalName + "zscore", 30, true),
    window: null, // Or a random window if your Z-score can have one
    metadata: { info: `Mock Z-score for ${signalName}` }
  };
};

const generateMockStlDecomposition = (signalName: string) => {
  const seed = simpleHash(signalName);
  const numPoints = 30;
  const baseDate = subDays(new Date(), numPoints);
  const trend = [];
  const seasonal = [];
  const residual = [];
  let trendValue = (seed % 50) + 50;

  for (let i = 0; i < numPoints; i++) {
    trendValue += (Math.random() - 0.4) * 2; // Gentle trend
    trend.push({ timestamp: addDays(baseDate, i).toISOString(), value: parseFloat(trendValue.toFixed(2)) });
    seasonal.push({ timestamp: addDays(baseDate, i).toISOString(), value: parseFloat((Math.sin(i / ((seed % 3) + 3)) * ((seed % 10) + 5)).toFixed(2)) }); // Vary seasonality
    residual.push({ timestamp: addDays(baseDate, i).toISOString(), value: parseFloat(((Math.random() - 0.5) * ((seed % 5) + 2)).toFixed(2)) });
  }
  return {
    trend,
    seasonal,
    residual,
    period_used: (seed % 4) + 3, // Period 3-6
    metadata: { info: `Mock STL decomposition for ${signalName}` }
  };
};

export default function AnalysisPage() {
  const defaultStartDate = new Date() // These are not used by mock generators but kept for structure
  defaultStartDate.setDate(defaultStartDate.getDate() - 7)
  const defaultEndDate = new Date()

  const [signalName, setSignalName] = useState(AVAILABLE_SIGNAL_NAMES[0]?.value || "topic_3_doc_count");
  const [analysisType, setAnalysisType] = useState("basicstats");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trigger analysis when signalName or analysisType changes
  useEffect(() => {
    runAnalysis();
  }, [signalName, analysisType]);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    try {
      let data;
      switch (analysisType) {
        case "basicstats":
          data = generateMockBasicStats(signalName);
          break;
        case "movingaverage":
          data = generateMockMovingAverage(signalName);
          break;
        case "zscore":
          data = generateMockZScore(signalName);
          break;
        case "stldecomposition":
          data = generateMockStlDecomposition(signalName);
          break;
        default:
          throw new Error("Unknown or unsupported analysis type for mock generation");
      }
      setAnalysisData(data);
    } catch (e: unknown) {
      console.error("Mock analysis generation failed:", e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred during mock analysis generation.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysisResult = () => {
    if (loading) return <div className="p-4 text-center text-muted-foreground">Loading analysis results...</div>;
    if (error) return <div className="text-red-500 p-4 text-center">Error: {error}</div>;
    if (!analysisData) return <div className="p-4 text-center text-muted-foreground">Select an analysis to view results.</div>;
    
    // Generic error object check (if mock data itself could be an error)
    if (analysisData && typeof analysisData === 'object' && 'detail' in analysisData) {
        return <div className="text-yellow-600 dark:text-yellow-400 p-4 border rounded-md bg-yellow-50 dark:bg-yellow-950/30">Mock data indicates an issue: {analysisData.detail}</div>;
    }


    switch (analysisType) {
      case "basicstats":
        if (!analysisData.count && analysisData.count !==0) return <div className="text-muted-foreground">No basic stats data available for this signal.</div>;
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.count}</div>
              <div className="text-sm text-muted-foreground">Count</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.mean?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Mean</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.median?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Median</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.std_dev?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Std Dev</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.min_val?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Min</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.max_val?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Max</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.sum_val?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Sum</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.variance?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Variance</div>
            </div>
          </div>
        )

      case "movingaverage":
        if (!analysisData.points || analysisData.points.length === 0) return <div className="text-muted-foreground">No moving average data available.</div>;
        const maChartData = analysisData.points.map((point: any) => ({
            time: format(new Date(point.timestamp), "MMM dd"), 
            value: point.value,
        }));
        return (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={maChartData}>
                <XAxis dataKey="time" fontSize={10} />
                <YAxis fontSize={10}/>
                <Tooltip />
                <Legend wrapperStyle={{fontSize: "12px"}} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" name={`MA (${analysisData.window})`} dot={false} />
              </LineChart>
            </ResponsiveContainer>
        )
        

      case "zscore":
        if (!analysisData.points || analysisData.points.length === 0) return <div className="text-muted-foreground">No Z-score data available.</div>;
        const zScoreChartData = analysisData.points.map((point: any) => ({
            time: format(new Date(point.timestamp), "MMM dd"),
            z_score: point.z_score,
            original_value: point.original_value,
        }));
        return (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={zScoreChartData}>
                <XAxis dataKey="time" fontSize={10} />
                <YAxis yAxisId="left" dataKey="original_value" fontSize={10} name="Original" />
                <YAxis yAxisId="right" orientation="right" dataKey="z_score" fontSize={10} name="Z-Score" />
                <Tooltip />
                <Legend wrapperStyle={{fontSize: "12px"}} />
                <Line yAxisId="left" type="monotone" dataKey="original_value" stroke="#82ca9d" name="Original Value" dot={false}/>
                <Line yAxisId="right" type="monotone" dataKey="z_score" stroke="#8884d8" name="Z-Score" dot={false}/>
              </LineChart>
            </ResponsiveContainer>
        )

      case "stldecomposition":
        if (!analysisData.trend || analysisData.trend.length === 0) return <div className="text-muted-foreground">No STL decomposition data available.</div>;
        const mapStlData = (d: any[]) => d.map((point: any) => ({ time: format(new Date(point.timestamp), "MMM dd"), value: point.value }));
        return (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-2">Trend Component</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={mapStlData(analysisData.trend)}>
                    <XAxis dataKey="time" fontSize={10}/> <YAxis fontSize={10}/> <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-2">Seasonal Component (Period: {analysisData.period_used || 'auto'})</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mapStlData(analysisData.seasonal)}>
                    <XAxis dataKey="time" fontSize={10}/> <YAxis fontSize={10}/> <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-2">Residual Component</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mapStlData(analysisData.residual)}>
                    <XAxis dataKey="time" fontSize={10}/> <YAxis fontSize={10}/> <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ffc658" dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
        )
      default:
        return <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">{JSON.stringify(analysisData, null, 2)}</pre>
    }
  }
  
  const currentSignalObject = AVAILABLE_SIGNAL_NAMES.find(s => s.value === signalName);
  const currentSignalLabel = currentSignalObject ? currentSignalObject.label : signalName;


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Series Analysis</h1>
          <p className="text-muted-foreground">Advanced statistical analysis of health monitoring signals</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Configuration</CardTitle>
          <CardDescription>Select a signal and analysis type to view pre-computed results (mock data).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signal-name">Signal Name</Label>
              <Select value={signalName} onValueChange={setSignalName}>
                <SelectTrigger id="signal-name">
                  <SelectValue placeholder="Select a signal" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_SIGNAL_NAMES.map(signal => (
                    <SelectItem key={signal.value} value={signal.value}>
                      {signal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="analysis-type">Analysis Type</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger id="analysis-type">
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basicstats">Basic Statistics</SelectItem>
                  <SelectItem value="movingaverage">Moving Average</SelectItem>
                  <SelectItem value="zscore">Z-Score</SelectItem>
                  <SelectItem value="stldecomposition">STL Decomposition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Button might not be needed if useEffect triggers on change */}
          {/* <Button onClick={runAnalysis} disabled={loading}>
            {loading ? "Running Analysis..." : "Run Analysis"}
          </Button> */}
          {error && !loading && <div className="text-red-500 text-sm mt-2 p-3 border border-red-500 bg-red-50 dark:bg-red-950/30 rounded-md">{error}</div>}
        </CardContent>
      </Card>

      {/* Results Card - Conditionally render based on loading, error, and data presence */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
                {analysisType.charAt(0).toUpperCase() + analysisType.slice(1).replace(/([A-Z])/g, ' $1')} for <span className="font-semibold">{currentSignalLabel}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]"> {/* Ensure content area has some min height */}
            {renderAnalysisResult()}
          </CardContent>
        </Card>
      
      {/* Automated Insights Card - Conditionally render */}
      {!loading && !error && analysisData && !(analysisData && typeof analysisData === 'object' && 'detail' in analysisData) && 
       (analysisType === "basicstats" || analysisType === "zscore" || analysisType === "movingaverage" || analysisType === "stldecomposition") && (
        <Card>
          <CardHeader>
            <CardTitle>Automated Insights</CardTitle>
            <CardDescription>Interpretation of the analysis results for <span className="font-semibold">{currentSignalLabel}</span></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                if (typeof analysisData !== 'object' || analysisData === null || 'detail' in analysisData) return null; 
                switch (analysisType) {
                  case "basicstats":
                    if (!analysisData.count && analysisData.count !== 0) return null;
                    return (
                      <div className="space-y-2">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100">Statistical Summary</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            The signal <span className="font-semibold">{currentSignalLabel}</span> shows {analysisData.std_dev > analysisData.mean * 0.5 ? "high" : "moderate"}{" "}
                            variability with a coefficient of variation of{" "}
                            {analysisData.mean !== 0 ? ((analysisData.std_dev / analysisData.mean) * 100).toFixed(1) : 'N/A'}%.
                            {analysisData.mean > analysisData.median
                              ? " The distribution appears right-skewed."
                              : analysisData.mean < analysisData.median 
                                ? " The distribution appears left-skewed."
                                : " The distribution appears symmetric."}
                          </p>
                        </div>
                        {analysisData.max_val > analysisData.mean + 2 * analysisData.std_dev && (
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                            <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Potential Outlier</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              Maximum value ({analysisData.max_val?.toFixed(2)}) may be an outlier, as it exceeds 2 standard
                              deviations from the mean ({analysisData.mean?.toFixed(2)}).
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  case "zscore":
                    if (!analysisData.points || analysisData.points.length === 0) return null;
                    const extremeZScores = analysisData.points?.filter((p: any) => Math.abs(p.z_score) > 2.5) || []
                    return (
                      <div className="space-y-2">
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                          <h4 className="font-medium text-purple-900 dark:text-purple-100">Z-Score Analysis</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            {extremeZScores.length > 0
                              ? `Found ${extremeZScores.length} data point(s) with Z-scores outside +/-2.5 standard deviations, indicating potential anomalies.`
                              : "No significant outliers detected (all values within +/-2.5 standard deviations)."}
                          </p>
                        </div>
                        {extremeZScores.length > 0 && (
                          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                            <h4 className="font-medium text-red-900 dark:text-red-100">Anomaly Alert</h4>
                            <p className="text-sm text-red-700 dark:text-red-300">
                              Significant deviations detected for <span className="font-semibold">{currentSignalLabel}</span>. Consider investigating the underlying causes for these anomalous periods.
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  case "movingaverage":
                    if (!analysisData.points || analysisData.points.length === 0) return null;
                    return (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <h4 className="font-medium text-green-900 dark:text-green-100">Trend Indication</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          The {analysisData.window}-period moving average for <span className="font-semibold">{currentSignalLabel}</span> helps smooth short-term fluctuations. 
                          Monitor for sustained increases or decreases in this smoothed line to identify underlying trends.
                        </p>
                      </div>
                    )
                  case "stldecomposition":
                     if (!analysisData.trend || analysisData.trend.length === 0) return null;
                    return (
                      <div className="space-y-2">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                          <h4 className="font-medium text-indigo-900 dark:text-indigo-100">Decomposition Insights</h4>
                          <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            STL decomposition of <span className="font-semibold">{currentSignalLabel}</span> separates the signal into trend, seasonal (period: {analysisData.period_used || 'auto'}), and residual components. This helps differentiate long-term direction, recurring patterns, and irregular variations.
                          </p>
                        </div>
                        <div className="p-3 bg-gray-100 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Recommendations</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Focus on the <strong>trend</strong> component for long-term directional changes. Analyze the <strong>seasonal</strong> component for predictable cyclicality. Investigate significant spikes in the <strong>residual</strong> component as potential anomalies not explained by trend or seasonality.
                          </p>
                        </div>
                      </div>
                    )
                  default:
                    return null;
                }
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}