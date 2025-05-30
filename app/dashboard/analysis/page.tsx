"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { api } from "@/lib/api"
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

export default function AnalysisPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [signalName, setSignalName] = useState("topic_3_document_count")
  const [analysisType, setAnalysisType] = useState("basicstats")
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runAnalysis = async () => {
    if (!date?.from || !date?.to) return

    setLoading(true)
    setError(null)

    try {
      const startTime = date.from.toISOString()
      const endTime = date.to.toISOString()

      let data
      switch (analysisType) {
        case "basicstats":
          data = await api.basicStats(signalName, startTime, endTime)
          break
        case "movingaverage":
          data = await api.movingAverage(signalName, startTime, endTime)
          break
        case "zscore":
          data = await api.zScore(signalName, startTime, endTime)
          break
        case "rateofchange":
          data = await api.rateOfChange(signalName, startTime, endTime)
          break
        case "percentchange":
          data = await api.percentChange(signalName, startTime, endTime)
          break
        case "stldecomposition":
          data = await api.stlDecomposition(signalName, startTime, endTime)
          break
        default:
          throw new Error("Unknown analysis type")
      }

      setAnalysisData(data)
    } catch (error) {
      console.error("Analysis failed:", error)
      setError(error instanceof Error ? error.message : "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  const renderAnalysisResult = () => {
    if (!analysisData) return null

    switch (analysisType) {
      case "basicstats":
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
              <div className="text-2xl font-bold">{analysisData.median}</div>
              <div className="text-sm text-muted-foreground">Median</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.std_dev?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Std Dev</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.min_val}</div>
              <div className="text-sm text-muted-foreground">Min</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.max_val}</div>
              <div className="text-sm text-muted-foreground">Max</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.sum_val}</div>
              <div className="text-sm text-muted-foreground">Sum</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analysisData.variance?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Variance</div>
            </div>
          </div>
        )

      case "movingaverage":
        if (analysisData.points) {
          const chartData = analysisData.points.map((point: any) => ({
            time: new Date(point.timestamp).toLocaleDateString(),
            value: point.value,
          }))

          return (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" name="Moving Average" />
              </LineChart>
            </ResponsiveContainer>
          )
        }
        break

      case "zscore":
        if (analysisData.points) {
          const chartData = analysisData.points.map((point: any) => ({
            time: new Date(point.timestamp).toLocaleDateString(),
            z_score: point.z_score,
            original_value: point.original_value,
          }))

          return (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="z_score" stroke="#8884d8" name="Z-Score" />
                <Line type="monotone" dataKey="original_value" stroke="#82ca9d" name="Original Value" />
              </LineChart>
            </ResponsiveContainer>
          )
        }
        break

      case "rateofchange":
      case "percentchange":
        if (Array.isArray(analysisData)) {
          const chartData = analysisData.map((point: any) => ({
            time: new Date(point.timestamp).toLocaleDateString(),
            value: point.value,
          }))

          return (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  name={analysisType === "rateofchange" ? "Rate of Change" : "Percent Change"}
                />
              </BarChart>
            </ResponsiveContainer>
          )
        }
        break

      case "stldecomposition":
        if (analysisData.trend && analysisData.seasonal && analysisData.residual) {
          const trendData = analysisData.trend.map((point: any) => ({
            time: new Date(point.timestamp).toLocaleDateString(),
            value: point.value,
          }))

          return (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-2">Trend Component</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2">Seasonal Component</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={analysisData.seasonal.map((point: any) => ({
                      time: new Date(point.timestamp).toLocaleDateString(),
                      value: point.value,
                    }))}
                  >
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2">Residual Component</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={analysisData.residual.map((point: any) => ({
                      time: new Date(point.timestamp).toLocaleDateString(),
                      value: point.value,
                    }))}
                  >
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        }
        break

      default:
        return <pre className="text-sm">{JSON.stringify(analysisData, null, 2)}</pre>
    }

    return <div>Analysis result format not supported for visualization</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Series Analysis</h1>
          <p className="text-muted-foreground">Advanced statistical analysis of health monitoring signals</p>
        </div>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Configuration</CardTitle>
          <CardDescription>Configure and run statistical analysis on time series data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signal-name">Signal Name</Label>
              <Input
                id="signal-name"
                value={signalName}
                onChange={(e) => setSignalName(e.target.value)}
                placeholder="e.g., topic_3_document_count"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analysis-type">Analysis Type</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basicstats">Basic Statistics</SelectItem>
                  <SelectItem value="movingaverage">Moving Average</SelectItem>
                  <SelectItem value="zscore">Z-Score</SelectItem>
                  <SelectItem value="rateofchange">Rate of Change</SelectItem>
                  <SelectItem value="percentchange">Percent Change</SelectItem>
                  <SelectItem value="stldecomposition">STL Decomposition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={runAnalysis} disabled={loading}>
            {loading ? "Running Analysis..." : "Run Analysis"}
          </Button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </CardContent>
      </Card>

      {analysisData && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              {analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} analysis for {signalName}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderAnalysisResult()}</CardContent>
        </Card>
      )}
      {analysisData && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Insights</CardTitle>
            <CardDescription>Automated interpretation of analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                switch (analysisType) {
                  case "basicstats":
                    return (
                      <div className="space-y-2">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100">Statistical Summary</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            The signal shows {analysisData.std_dev > analysisData.mean * 0.5 ? "high" : "moderate"}{" "}
                            variability with a coefficient of variation of{" "}
                            {((analysisData.std_dev / analysisData.mean) * 100).toFixed(1)}%.
                            {analysisData.mean > analysisData.median
                              ? " The distribution is right-skewed."
                              : " The distribution appears symmetric."}
                          </p>
                        </div>
                        {analysisData.max_val > analysisData.mean + 2 * analysisData.std_dev && (
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                            <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Outlier Detection</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              Maximum value ({analysisData.max_val}) appears to be an outlier, exceeding 2 standard
                              deviations from the mean.
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  case "zscore":
                    const extremeZScores = analysisData.points?.filter((p: any) => Math.abs(p.z_score) > 2) || []
                    return (
                      <div className="space-y-2">
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                          <h4 className="font-medium text-purple-900 dark:text-purple-100">Z-Score Analysis</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            {extremeZScores.length > 0
                              ? `Found ${extremeZScores.length} data points with extreme Z-scores (|z| > 2), indicating potential anomalies.`
                              : "No extreme outliers detected. All values fall within 2 standard deviations of the mean."}
                          </p>
                        </div>
                        {extremeZScores.length > 0 && (
                          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                            <h4 className="font-medium text-red-900 dark:text-red-100">Anomaly Alert</h4>
                            <p className="text-sm text-red-700 dark:text-red-300">
                              Significant deviations detected. Consider investigating the underlying causes for these
                              anomalous periods.
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  case "movingaverage":
                    return (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <h4 className="font-medium text-green-900 dark:text-green-100">Trend Analysis</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Moving average with window size {analysisData.window} helps smooth out short-term fluctuations
                          and reveals the underlying trend pattern. Use this to identify long-term directional changes.
                        </p>
                      </div>
                    )
                  case "stldecomposition":
                    return (
                      <div className="space-y-2">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                          <h4 className="font-medium text-indigo-900 dark:text-indigo-100">Decomposition Insights</h4>
                          <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            STL decomposition separates the signal into trend, seasonal, and residual components. The
                            trend shows the long-term direction, seasonal captures recurring patterns, and residuals
                            highlight irregular variations.
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Recommendations</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Monitor the residual component for unusual spikes that might indicate anomalies not
                            explained by trend or seasonal patterns.
                          </p>
                        </div>
                      </div>
                    )
                  default:
                    return (
                      <div className="p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Analysis Complete</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {analysisType === "rateofchange" &&
                            "Rate of change analysis shows the velocity of signal changes over time."}
                          {analysisType === "percentchange" &&
                            "Percent change analysis reveals relative growth or decline patterns."}
                        </p>
                      </div>
                    )
                }
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
