"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Eye,
  ArrowLeft,
  Download,
  Share2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Brain,
  FileText,
  TrendingUp,
  Shield,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

interface ReportData {
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
  timestamp: string
  patientId?: string
}

export default function ReportPage() {
  const searchParams = useSearchParams()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading report data
    const disease = searchParams.get("disease") || "Diabetic Retinopathy"
    const confidence = Number.parseFloat(searchParams.get("confidence") || "87.3")

    // Mock comprehensive report data
    const mockReportData: ReportData = {
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
              "Cotton wool spots visible",
            ],
      recommendations:
        disease === "Normal"
          ? ["Continue regular eye examinations", "Maintain healthy lifestyle"]
          : [
              "Immediate ophthalmologist consultation recommended",
              "Blood sugar level monitoring and control",
              "Regular eye examinations every 3-4 months",
              "Consider anti-VEGF treatment options",
            ],
      modelBreakdown: {
        oct_confidence: confidence - 5 + Math.random() * 10,
        retinal_confidence: confidence - 3 + Math.random() * 6,
        fusion_confidence: confidence,
      },
      riskFactors:
        disease === "Normal"
          ? []
          : ["Diabetes duration > 10 years", "Poor glycemic control", "High blood pressure", "High cholesterol levels"],
      followUpActions:
        disease === "Normal"
          ? ["Annual eye examination"]
          : [
              "Urgent referral to retinal specialist",
              "HbA1c monitoring",
              "Blood pressure management",
              "Consider laser photocoagulation",
            ],
      timestamp: new Date().toISOString(),
      patientId: "P" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    }

    setReportData(mockReportData)
  }, [searchParams])

  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real implementation, you would use a library like jsPDF or html2pdf
    const element = reportRef.current
    if (element) {
      // Create a simple text-based report for download
      const reportText = `
EYE DISEASE DETECTION REPORT
============================

Patient ID: ${reportData?.patientId}
Analysis Date: ${new Date(reportData?.timestamp || "").toLocaleDateString()}
Analysis Time: ${new Date(reportData?.timestamp || "").toLocaleTimeString()}

DIAGNOSIS
---------
Disease: ${reportData?.disease}
Confidence: ${reportData?.confidence}%
Severity: ${reportData?.severity}

DETECTED SYMPTOMS
-----------------
${reportData?.symptoms.map((s) => `• ${s}`).join("\n")}

RECOMMENDATIONS
---------------
${reportData?.recommendations.map((r) => `• ${r}`).join("\n")}

MODEL BREAKDOWN
---------------
OCT2017 Model: ${reportData?.modelBreakdown.oct_confidence.toFixed(1)}%
Retinal C8 Model: ${reportData?.modelBreakdown.retinal_confidence.toFixed(1)}%
Fusion Model: ${reportData?.modelBreakdown.fusion_confidence.toFixed(1)}%

RISK FACTORS
------------
${reportData?.riskFactors.map((r) => `• ${r}`).join("\n") || "None identified"}

FOLLOW-UP ACTIONS
-----------------
${reportData?.followUpActions.map((a) => `• ${a}`).join("\n")}

DISCLAIMER
----------
This analysis is generated by AI and should not replace professional medical consultation.
Please consult with a qualified healthcare provider for proper diagnosis and treatment.

Generated by EyeDetect AI v2.1.0
      `

      const blob = new Blob([reportText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `eye-disease-report-${reportData?.patientId}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    setIsGeneratingPDF(false)
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-secondary" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  const confidenceChartData = {
    labels: ["OCT2017 Model", "Retinal C8 Model", "Fusion Model"],
    datasets: [
      {
        label: "Confidence %",
        data: [
          reportData.modelBreakdown.oct_confidence,
          reportData.modelBreakdown.retinal_confidence,
          reportData.modelBreakdown.fusion_confidence,
        ],
        backgroundColor: ["rgba(99, 102, 241, 0.8)", "rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderColor: ["rgb(99, 102, 241)", "rgb(34, 197, 94)", "rgb(239, 68, 68)"],
        borderWidth: 2,
      },
    ],
  }

  const severityColor =
    reportData.severity === "None"
      ? "text-green-600"
      : reportData.severity === "Mild"
        ? "text-yellow-600"
        : reportData.severity === "Moderate"
          ? "text-orange-600"
          : "text-red-600"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/diagnosis">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Diagnosis
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <FileText className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Medical Report</h1>
                  <p className="text-sm text-muted-foreground">Patient ID: {reportData.patientId}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={generatePDF} disabled={isGeneratingPDF} size="sm">
                {isGeneratingPDF ? (
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8" ref={reportRef}>
        {/* Report Header */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Eye Disease Detection Report</CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(reportData.timestamp).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(reportData.timestamp).toLocaleTimeString()}
                  </span>
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                AI Analysis v2.1.0
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagnosis Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-secondary" />
                  Diagnosis Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-destructive">{reportData.disease}</h3>
                    <p className={`text-lg font-medium ${severityColor}`}>Severity: {reportData.severity}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-secondary">{reportData.confidence.toFixed(1)}%</div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                  </div>
                </div>

                <Progress value={reportData.confidence} className="h-3" />

                {reportData.disease !== "Normal" && (
                  <Alert className="border-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This analysis indicates potential eye disease. Please consult with a healthcare professional
                      immediately for proper diagnosis and treatment.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Model Analysis Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-secondary" />
                  AI Model Analysis
                </CardTitle>
                <CardDescription>Multi-stage deep learning analysis breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Model Confidence Scores</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">OCT2017 Model</span>
                        <span className="font-medium">{reportData.modelBreakdown.oct_confidence.toFixed(1)}%</span>
                      </div>
                      <Progress value={reportData.modelBreakdown.oct_confidence} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Retinal C8 Model</span>
                        <span className="font-medium">{reportData.modelBreakdown.retinal_confidence.toFixed(1)}%</span>
                      </div>
                      <Progress value={reportData.modelBreakdown.retinal_confidence} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Fusion Model</span>
                        <span className="font-medium">{reportData.modelBreakdown.fusion_confidence.toFixed(1)}%</span>
                      </div>
                      <Progress value={reportData.modelBreakdown.fusion_confidence} className="h-2" />
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-48 h-48">
                      <Bar
                        data={confidenceChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detected Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-secondary" />
                  Detected Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {reportData.symptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                      <span className="text-sm">{symptom}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Medical Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {reportData.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Risk Factors */}
            {reportData.riskFactors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Follow-up Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Follow-up Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.followUpActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 border rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm">{action}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Patient ID:</span>
                  <span className="font-mono">{reportData.patientId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Analysis Date:</span>
                  <span>{new Date(reportData.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Analysis Time:</span>
                  <span>{new Date(reportData.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">AI Model:</span>
                  <span>v2.1.0</span>
                </div>
                <Separator />
                <div className="text-xs text-muted-foreground">
                  This report is generated by AI and should be reviewed by a qualified healthcare professional.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/diagnosis">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              New Analysis
            </Button>
          </Link>
          <Link href="/explain">
            <Button size="lg" className="w-full sm:w-auto">
              Get AI Explanation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
