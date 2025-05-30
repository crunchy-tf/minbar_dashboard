"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, RefreshCw, AlertCircle, Database, CheckCircle } from "lucide-react"
import { api } from "@/lib/api"

interface Keyword {
  term: string
  language: string
  concept_id: string
  concept_display_name: string
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [language, setLanguage] = useState("en")
  const [limit, setLimit] = useState(20)
  const [error, setError] = useState<string | null>(null)

  const fetchKeywords = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await api.topManagedKeywords(language, limit)
      setKeywords(data || [])
    } catch (error) {
      console.error("Failed to fetch keywords:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch keywords")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKeywords()
  }, [language, limit])

  const filteredKeywords = keywords.filter(
    (keyword) =>
      keyword.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keyword.concept_display_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Keywords Management</h1>
          <p className="text-muted-foreground">Manage and monitor health-related keywords and concepts</p>
        </div>
      </div>

      {/* Status Alert */}
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>API connection failed: {error}</AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Successfully connected to Keyword Manager API</AlertDescription>
        </Alert>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
          <CardDescription>Search through managed keywords and filter by language</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Keywords</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search terms or concepts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Results Limit</Label>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={fetchKeywords} disabled={loading} className="w-full">
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Managed Keywords
            <Badge variant="secondary" className="ml-2">
              {filteredKeywords.length} results
            </Badge>
          </CardTitle>
          <CardDescription>Health-related keywords and concepts being monitored by the system</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading keywords...
            </div>
          ) : filteredKeywords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No keywords found matching your search criteria.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredKeywords.map((keyword, index) => (
                <div
                  key={`${keyword.concept_id}-${index}`}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm">{keyword.term}</h3>
                      <Badge variant="outline" className="text-xs">
                        {keyword.language.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{keyword.concept_display_name}</p>
                    <div className="text-xs text-muted-foreground font-mono">ID: {keyword.concept_id.slice(-8)}...</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keywords</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywords.length}</div>
            <p className="text-xs text-muted-foreground">Currently managed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredKeywords.length}</div>
            <p className="text-xs text-muted-foreground">Matching search criteria</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Language</CardTitle>
            <Badge variant="outline">{language.toUpperCase()}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywords.filter((k) => k.language === language).length}</div>
            <p className="text-xs text-muted-foreground">In selected language</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
