"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  ArrowLeft,
  Brain,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Shield,
  Stethoscope,
  Activity,
  BookOpen,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { eyeDiseaseAPI } from "@/lib/api-client"

interface ExplanationData {
  overview: string
  technicalAnalysis: string
  modelExplanation: string
  confidenceBreakdown: string
  clinicalSignificance: string
  nextSteps: string
  limitations: string
}

interface AnalysisResult {
  disease: string
  confidence: number
  severity: string
  symptoms: string[]
  recommendations: string[]
  modelBreakdown: {
    oct_confidence: number
    retinal_confidence: number
    fusion_confidence: number
  }
  riskFactors: string[]
  followUpActions: string[]
}

export default function ExplainPage() {
  const searchParams = useSearchParams()
  const [explanation, setExplanation] = useState<ExplanationData | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadExplanation = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get analysis data from URL params or mock data
        const disease = searchParams.get("disease") || "Diabetic Retinopathy"
        const confidence = Number.parseFloat(searchParams.get("confidence") || "87.3")

        // Mock analysis result for explanation
        const mockAnalysisResult: AnalysisResult = {
          disease,
          confidence,
          severity: disease === "Normal" ? "None" : "Moderate",
          symptoms:
            disease === "Normal"
              ? ["No abnormalities detected", "Healthy retinal structure"]
              : [
                  "Microaneurysms detected",
                  "Hard exudates present",
                  "Retinal hemorrhages observed",
                  "Macular edema indicators",
                ],
          recommendations: [
            "Immediate ophthalmologist consultation recommended",
            "Blood sugar level monitoring and control",
            "Regular eye examinations every 3-4 months",
          ],
          modelBreakdown: {
            oct_confidence: confidence - 5 + Math.random() * 10,
            retinal_confidence: confidence - 3 + Math.random() * 6,
            fusion_confidence: confidence,
          },
          riskFactors: ["Diabetes duration > 10 years", "Poor glycemic control", "High blood pressure"],
          followUpActions: ["Urgent referral to retinal specialist", "HbA1c monitoring", "Blood pressure management"],
        }

        setAnalysisResult(mockAnalysisResult)

        // Get AI explanation
        const explanationResponse = await eyeDiseaseAPI.getExplanation(mockAnalysisResult)

        if (explanationResponse.success) {
          setExplanation(explanationResponse.explanation)
        } else {
          throw new Error("Failed to generate explanation")
        }
      } catch (err) {
        console.error("Error loading explanation:", err)
        setError("Failed to load AI explanation. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadExplanation()
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Link href="/report">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Report
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Brain className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">AI Explanation</h1>
                  <p className="text-sm text-muted-foreground">Generating detailed analysis...</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-secondary" />
                  <h3 className="text-lg font-semibold mb-2">Generating AI Explanation</h3>
                  <p className="text-muted-foreground">
                    Our advanced AI is analyzing your results and preparing a detailed explanation...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Link href="/report">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Report
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Brain className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">AI Explanation</h1>
                  <p className="text-sm text-muted-foreground">Error loading explanation</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/report">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Report
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Brain className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">AI Explanation</h1>
                  <p className="text-sm text-muted-foreground">Detailed analysis for {analysisResult?.disease}</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Summary Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">AI Explanation: {analysisResult?.disease}</CardTitle>
                  <CardDescription>Comprehensive analysis powered by advanced machine learning models</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-secondary">{analysisResult?.confidence.toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground">Confidence</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Explanation Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span className="hidden sm:inline">Technical</span>
              </TabsTrigger>
              <TabsTrigger value="model" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span className="hidden sm:inline">Model</span>
              </TabsTrigger>
              <TabsTrigger value="confidence" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className="hidden sm:inline">Confidence</span>
              </TabsTrigger>
              <TabsTrigger value="clinical" className="flex items-center gap-1">
                <Stethoscope className="h-3 w-3" />
                <span className="hidden sm:inline">Clinical</span>
              </TabsTrigger>
              <TabsTrigger value="next-steps" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span className="hidden sm:inline">Next Steps</span>
              </TabsTrigger>
              <TabsTrigger value="limitations" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span className="hidden sm:inline">Limitations</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-secondary" />
                    Overview
                  </CardTitle>
                  <CardDescription>General explanation of the analysis results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-foreground leading-relaxed">{explanation?.overview}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-secondary" />
                    Technical Analysis
                  </CardTitle>
                  <CardDescription>Detailed technical breakdown of the AI analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-foreground leading-relaxed">{explanation?.technicalAnalysis}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="model">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-secondary" />
                    Model Explanation
                  </CardTitle>
                  <CardDescription>How our AI models work and what they detected</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-foreground leading-relaxed">{explanation?.modelExplanation}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="confidence">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                    Confidence Breakdown
                  </CardTitle>
                  <CardDescription>Understanding the confidence scores and what they mean</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-foreground leading-relaxed">{explanation?.confidenceBreakdown}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clinical">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-secondary" />
                    Clinical Significance
                  </CardTitle>
                  <CardDescription>Medical importance and implications of the findings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-foreground leading-relaxed">{explanation?.clinicalSignificance}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="next-steps">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Next Steps
                  </CardTitle>
                  <CardDescription>Recommended actions based on the analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-foreground leading-relaxed">{explanation?.nextSteps}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="limitations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    Limitations
                  </CardTitle>
                  <CardDescription>Important limitations and considerations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This AI analysis is for screening purposes only and should not replace professional medical
                      consultation.
                    </AlertDescription>
                  </Alert>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-foreground leading-relaxed">{explanation?.limitations}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Report
              </Button>
            </Link>
            <Link href="/diagnosis">
              <Button size="lg" className="w-full sm:w-auto">
                <Eye className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
