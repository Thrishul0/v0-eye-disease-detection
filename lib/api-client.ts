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

interface AnalysisResponse {
  success: boolean
  result: AnalysisResult
  timestamp: string
  processingTime: string
  modelVersion: string
}

interface ExplanationResponse {
  success: boolean
  explanation: {
    overview: string
    technicalAnalysis: string
    modelExplanation: string
    confidenceBreakdown: string
    clinicalSignificance: string
    nextSteps: string
    limitations: string
  }
  metadata: {
    disease: string
    confidence: number
    generatedAt: string
    aiModel: string
    version: string
  }
}

export class EyeDiseaseAPI {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  async analyzeImage(imageData: string, metadata?: any): Promise<AnalysisResponse> {
    try {
      console.log("[v0] API Client: Making request to /api/analyze")
      console.log("[v0] API Client: Image data length:", imageData.length)
      console.log("[v0] API Client: Image starts with:", imageData.substring(0, 50))

      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageData,
          metadata: metadata || {},
        }),
      })

      console.log("[v0] API Client: Response status:", response.status)
      console.log("[v0] API Client: Response ok:", response.ok)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        console.log("[v0] API Client: Error data:", errorData)
        throw new Error(errorData.message || `HTTP ${response.status}: Analysis failed`)
      }

      const result = await response.json()
      console.log("[v0] API Client: Success result:", result)
      return result
    } catch (error) {
      console.error("[v0] API Client: Image analysis error:", error)
      throw error
    }
  }

  async getExplanation(analysisResult: AnalysisResult): Promise<ExplanationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/explain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: analysisResult.disease,
          confidence: analysisResult.confidence,
          symptoms: analysisResult.symptoms,
          modelBreakdown: analysisResult.modelBreakdown,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Explanation generation failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Explanation generation error:", error)
      throw error
    }
  }

  async getAPIInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: "GET",
      })

      return await response.json()
    } catch (error) {
      console.error("API info error:", error)
      throw error
    }
  }
}

// Export singleton instance
export const eyeDiseaseAPI = new EyeDiseaseAPI()
