import { type NextRequest, NextResponse } from "next/server"

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

// Simulated disease database with comprehensive information
const DISEASE_DATABASE = {
  Normal: {
    severity: "None",
    symptoms: ["No abnormalities detected", "Healthy retinal structure", "Normal blood vessel patterns"],
    recommendations: [
      "Continue regular eye examinations",
      "Maintain healthy lifestyle",
      "Protect eyes from UV exposure",
      "Schedule next checkup in 1-2 years",
    ],
    riskFactors: [],
    followUpActions: ["Annual eye examination", "Monitor for any vision changes"],
  },
  "Diabetic Retinopathy": {
    severity: "Moderate",
    symptoms: [
      "Microaneurysms detected",
      "Hard exudates present",
      "Retinal hemorrhages observed",
      "Macular edema indicators",
      "Cotton wool spots visible",
    ],
    recommendations: [
      "Immediate ophthalmologist consultation recommended",
      "Blood sugar level monitoring and control",
      "Regular eye examinations every 3-4 months",
      "Consider anti-VEGF treatment options",
      "Lifestyle modifications for diabetes management",
    ],
    riskFactors: [
      "Diabetes duration > 10 years",
      "Poor glycemic control",
      "High blood pressure",
      "High cholesterol levels",
    ],
    followUpActions: [
      "Urgent referral to retinal specialist",
      "HbA1c monitoring",
      "Blood pressure management",
      "Consider laser photocoagulation",
    ],
  },
  Glaucoma: {
    severity: "Moderate",
    symptoms: [
      "Optic nerve cupping detected",
      "Retinal nerve fiber layer thinning",
      "Increased intraocular pressure indicators",
      "Visual field defects pattern",
    ],
    recommendations: [
      "Immediate glaucoma specialist consultation",
      "Intraocular pressure monitoring",
      "Visual field testing required",
      "Consider pressure-lowering medications",
      "Regular monitoring every 2-3 months",
    ],
    riskFactors: ["Age > 60 years", "Family history of glaucoma", "High myopia", "African ancestry"],
    followUpActions: [
      "Tonometry measurements",
      "Optical coherence tomography",
      "Gonioscopy examination",
      "Medication compliance monitoring",
    ],
  },
  Cataract: {
    severity: "Mild to Moderate",
    symptoms: [
      "Lens opacity detected",
      "Reduced visual clarity",
      "Light scattering patterns",
      "Cortical or nuclear changes",
    ],
    recommendations: [
      "Ophthalmologist evaluation recommended",
      "Monitor progression with regular checkups",
      "Consider surgical intervention if vision impaired",
      "Update eyeglass prescription as needed",
    ],
    riskFactors: ["Advanced age", "UV exposure history", "Smoking", "Diabetes"],
    followUpActions: [
      "Visual acuity testing",
      "Slit-lamp examination",
      "Consider cataract surgery timing",
      "Pre-operative assessment if needed",
    ],
  },
  "Age-related Macular Degeneration": {
    severity: "Moderate",
    symptoms: [
      "Drusen deposits detected",
      "Retinal pigment epithelium changes",
      "Geographic atrophy patterns",
      "Choroidal neovascularization signs",
    ],
    recommendations: [
      "Retinal specialist consultation required",
      "Amsler grid monitoring at home",
      "Consider anti-VEGF injections",
      "Nutritional supplements (AREDS2 formula)",
      "Lifestyle modifications",
    ],
    riskFactors: ["Age > 65 years", "Smoking history", "Family history", "Cardiovascular disease"],
    followUpActions: ["Fluorescein angiography", "OCT imaging", "Monthly monitoring", "Smoking cessation counseling"],
  },
}

// Simulate multi-stage deep learning analysis
async function simulateMLAnalysis(imageData: string): Promise<AnalysisResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate model predictions with realistic confidence scores
  const diseases = Object.keys(DISEASE_DATABASE)
  const weights = [0.3, 0.25, 0.2, 0.15, 0.1] // Probability weights

  // Generate realistic confidence scores
  const octConfidence = Math.random() * 30 + 70 // 70-100%
  const retinalConfidence = Math.random() * 25 + 75 // 75-100%
  const fusionBoost = Math.random() * 10 + 5 // 5-15% boost from fusion

  // Select disease based on weighted random selection
  const randomValue = Math.random()
  let cumulativeWeight = 0
  let selectedDisease = "Normal"

  for (let i = 0; i < diseases.length && i < weights.length; i++) {
    cumulativeWeight += weights[i]
    if (randomValue <= cumulativeWeight) {
      selectedDisease = diseases[i]
      break
    }
  }

  const diseaseInfo = DISEASE_DATABASE[selectedDisease as keyof typeof DISEASE_DATABASE]
  const finalConfidence = Math.min(95, (octConfidence + retinalConfidence) / 2 + fusionBoost)

  return {
    disease: selectedDisease,
    confidence: Math.round(finalConfidence * 100) / 100,
    severity: diseaseInfo.severity,
    symptoms: diseaseInfo.symptoms,
    recommendations: diseaseInfo.recommendations,
    modelBreakdown: {
      oct_confidence: Math.round(octConfidence * 100) / 100,
      retinal_confidence: Math.round(retinalConfidence * 100) / 100,
      fusion_confidence: Math.round(finalConfidence * 100) / 100,
    },
    riskFactors: diseaseInfo.riskFactors,
    followUpActions: diseaseInfo.followUpActions,
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API: Received analysis request")

    const body = await request.json()
    console.log("[v0] API: Request body keys:", Object.keys(body))

    const { image, metadata } = body

    if (!image) {
      console.log("[v0] API: No image data provided")
      return NextResponse.json({ error: "No image data provided" }, { status: 400 })
    }

    console.log("[v0] API: Image data length:", image.length)
    console.log("[v0] API: Image starts with:", image.substring(0, 50))

    // Validate image format
    if (!image.startsWith("data:image/")) {
      console.log("[v0] API: Invalid image format, starts with:", image.substring(0, 20))
      return NextResponse.json({ error: "Invalid image format. Expected data:image/ format." }, { status: 400 })
    }

    // Log analysis request
    console.log("[v0] API: Processing eye disease analysis request...")
    console.log("[v0] API: Image size:", image.length)
    console.log("[v0] API: Metadata:", metadata)

    // Perform multi-stage ML analysis
    const analysisResult = await simulateMLAnalysis(image)

    // Log results
    console.log("[v0] API: Analysis completed:", {
      disease: analysisResult.disease,
      confidence: analysisResult.confidence,
      severity: analysisResult.severity,
    })

    return NextResponse.json({
      success: true,
      result: analysisResult,
      timestamp: new Date().toISOString(),
      processingTime: "2.3s",
      modelVersion: "v2.1.0",
    })
  } catch (error) {
    console.error("[v0] API: Analysis error:", error)

    return NextResponse.json(
      {
        error: "Analysis failed",
        message: error instanceof Error ? error.message : "An error occurred during image analysis. Please try again.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Eye Disease Detection API",
    version: "v2.1.0",
    endpoints: {
      analyze: "POST /api/analyze - Analyze eye image for disease detection",
      explain: "POST /api/explain - Get AI explanation for analysis results",
    },
    models: {
      oct2017: "Specialized OCT image analysis",
      retinal_c8: "Retinal fundus image analysis",
      fusion: "Multi-stage deep learning fusion",
    },
    supportedDiseases: Object.keys(DISEASE_DATABASE),
  })
}
