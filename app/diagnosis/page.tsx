"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Upload, ArrowLeft, CheckCircle, AlertCircle, Loader2, Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

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

export default function DiagnosisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("File size must be less than 10MB")
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect],
  )

  const performAnalysis = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setError(null)

    try {
      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      console.log("[v0] Starting file conversion to base64...")
      const base64Image = await convertToBase64(selectedFile)
      console.log("[v0] File converted, base64 length:", base64Image.length)
      console.log("[v0] Base64 starts with:", base64Image.substring(0, 50))

      // Simulate multi-stage analysis with progress updates
      const stages = [
        { name: "Preprocessing image...", duration: 1000 },
        { name: "OCT2017 model analysis...", duration: 1500 },
        { name: "Retinal C8 model analysis...", duration: 1200 },
        { name: "Multi-stage fusion...", duration: 800 },
        { name: "Generating report...", duration: 500 },
      ]

      for (let i = 0; i < stages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, stages[i].duration))
        setAnalysisProgress((i + 1) * 20)
      }

      console.log("[v0] Sending analysis request to API...")
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          metadata: {
            filename: selectedFile?.name,
            size: selectedFile?.size,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      console.log("[v0] API response status:", response.status)
      console.log("[v0] API response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] API error response:", errorText)
        throw new Error(`API request failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log("[v0] API response received:", result)

      if (result.success) {
        setAnalysisResult(result.result)
        console.log("[v0] Analysis successful:", result.result.disease)
      } else {
        throw new Error(result.message || "Analysis failed")
      }
    } catch (err) {
      console.error("[v0] Analysis error:", err)
      const errorMessage = err instanceof Error ? err.message : "Analysis failed. Please try again."
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setAnalysisResult(null)
    setAnalysisProgress(0)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Eye className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Analysis Results</h1>
                  <p className="text-sm text-muted-foreground">AI-powered diagnosis complete</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Analyzed Image</CardTitle>
              </CardHeader>
              <CardContent>
                {previewUrl && (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={previewUrl || "/placeholder.svg"}
                      alt="Analyzed eye image"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Diagnosis Complete
                    </CardTitle>
                    <Badge variant="secondary">{analysisResult.confidence}% Confidence</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-destructive">{analysisResult.disease}</h3>
                    <p className="text-muted-foreground">
                      Severity: <span className="font-medium">{analysisResult.severity}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detected Symptoms</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/report?disease=${encodeURIComponent(analysisResult.disease)}&confidence=${analysisResult.confidence}`}
                  className="flex-1"
                >
                  <Button className="w-full">View Detailed Report</Button>
                </Link>
                <Link
                  href={`/explain?disease=${encodeURIComponent(analysisResult.disease)}&confidence=${analysisResult.confidence}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full bg-transparent">
                    <Brain className="mr-2 h-4 w-4" />
                    AI Explanation
                  </Button>
                </Link>
                <Button variant="outline" onClick={resetAnalysis}>
                  New Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Eye className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Eye Disease Diagnosis</h1>
                <p className="text-sm text-muted-foreground">Upload an eye image for AI analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {error && (
            <Alert className="mb-6 border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isAnalyzing ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Image
                </CardTitle>
                <CardDescription>Our multi-stage deep learning models are processing your image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={analysisProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">{analysisProgress}% Complete</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Upload Eye Image</CardTitle>
                  <CardDescription>Select a clear image of the eye for AI-powered disease detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-secondary transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Drop your image here or click to browse</h3>
                    <p className="text-muted-foreground mb-4">Supports JPG, PNG, WEBP up to 10MB</p>
                    <Button variant="outline">Choose File</Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              {selectedFile && previewUrl && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Selected Image</CardTitle>
                    <CardDescription>
                      {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden bg-muted mb-4">
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Selected eye image"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={performAnalysis} size="lg">
                        Start Analysis
                      </Button>
                      <Button variant="outline" onClick={resetAnalysis}>
                        Remove Image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Analysis Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        OCT2017
                      </Badge>
                      <p className="text-sm text-muted-foreground">Optical Coherence Tomography dataset</p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Retinal C8
                      </Badge>
                      <p className="text-sm text-muted-foreground">Comprehensive retinal disease dataset</p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Multi-Stage
                      </Badge>
                      <p className="text-sm text-muted-foreground">Advanced deep learning fusion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
