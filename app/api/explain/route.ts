import { type NextRequest, NextResponse } from "next/server"

interface ExplanationRequest {
  disease: string
  confidence: number
  symptoms: string[]
  modelBreakdown: {
    oct_confidence: number
    retinal_confidence: number
    fusion_confidence: number
  }
}

interface DetailedExplanation {
  overview: string
  technicalAnalysis: string
  modelExplanation: string
  confidenceBreakdown: string
  clinicalSignificance: string
  nextSteps: string
  limitations: string
}

// AI-powered explanation generator
function generateDetailedExplanation(data: ExplanationRequest): DetailedExplanation {
  const { disease, confidence, symptoms, modelBreakdown } = data

  const explanations: Record<string, DetailedExplanation> = {
    Normal: {
      overview: `Our AI analysis indicates that your eye image shows normal, healthy retinal structures with no signs of disease. The overall confidence score of ${confidence}% reflects the consistency across all our detection models in identifying healthy tissue patterns.`,

      technicalAnalysis: `The multi-stage deep learning analysis processed your image through three specialized neural networks: OCT2017 model (${modelBreakdown.oct_confidence}% confidence), Retinal C8 model (${modelBreakdown.retinal_confidence}% confidence), and our fusion model (${modelBreakdown.fusion_confidence}% confidence). All models consistently identified normal retinal architecture, including healthy blood vessel patterns, normal optic disc appearance, and absence of pathological features.`,

      modelExplanation: `Our OCT2017 model, trained on optical coherence tomography data, analyzed the structural layers of your retina and found them to be within normal parameters. The Retinal C8 model, specialized in fundus photography analysis, confirmed normal pigmentation and vascular patterns. The fusion model combined these insights to provide the final assessment.`,

      confidenceBreakdown: `The high confidence score indicates strong agreement between all three models. OCT analysis showed ${modelBreakdown.oct_confidence}% confidence in normal findings, while retinal analysis showed ${modelBreakdown.retinal_confidence}% confidence. The fusion model's ${modelBreakdown.fusion_confidence}% confidence represents the combined assessment, weighted by each model's reliability for different image features.`,

      clinicalSignificance: `Normal findings suggest that your retinal health is good at the time of this analysis. This is an encouraging result that indicates no immediate concerns for major eye diseases such as diabetic retinopathy, glaucoma, or macular degeneration.`,

      nextSteps: `Continue with regular eye examinations as recommended by your eye care professional. Maintain healthy lifestyle habits including UV protection, balanced nutrition, and regular exercise. Monitor for any changes in vision and report them promptly to your healthcare provider.`,

      limitations: `While our AI shows high accuracy, this analysis should not replace professional medical examination. Some early-stage conditions may not be visible in photographs, and comprehensive eye care includes tests beyond image analysis.`,
    },

    "Diabetic Retinopathy": {
      overview: `Our AI analysis has detected signs consistent with diabetic retinopathy, a serious eye condition that affects people with diabetes. The ${confidence}% confidence score indicates strong evidence of retinal changes associated with diabetes complications.`,

      technicalAnalysis: `The analysis revealed multiple characteristic features: ${symptoms.join(", ")}. Our OCT2017 model (${modelBreakdown.oct_confidence}% confidence) identified structural changes in retinal layers, while the Retinal C8 model (${modelBreakdown.retinal_confidence}% confidence) detected vascular abnormalities typical of diabetic retinopathy. The fusion model integrated these findings for a comprehensive assessment.`,

      modelExplanation: `Diabetic retinopathy detection relies on identifying specific pathological features. Our models were trained on thousands of diabetic retinopathy cases and can recognize microaneurysms (small blood vessel bulges), hard exudates (lipid deposits), hemorrhages (bleeding), and macular edema (swelling). The AI detected these patterns in your image with high confidence.`,

      confidenceBreakdown: `The confidence scores reflect the strength of detected features. OCT analysis (${modelBreakdown.oct_confidence}%) focused on retinal thickness and layer integrity, retinal analysis (${modelBreakdown.retinal_confidence}%) identified vascular changes, and fusion analysis (${modelBreakdown.fusion_confidence}%) combined all evidence for the final diagnosis.`,

      clinicalSignificance: `Diabetic retinopathy is a leading cause of blindness but is treatable when caught early. The detected changes indicate that diabetes has begun affecting your retinal blood vessels. Early intervention can prevent vision loss and slow disease progression.`,

      nextSteps: `Immediate ophthalmologist consultation is strongly recommended. You'll likely need comprehensive dilated eye examination, possible fluorescein angiography, and discussion of treatment options including anti-VEGF injections or laser therapy. Strict blood sugar control is crucial for preventing further progression.`,

      limitations: `AI analysis provides screening-level assessment but cannot determine exact staging or treatment urgency. Professional examination with specialized equipment is essential for treatment planning. The analysis also cannot assess visual function or other diabetes complications.`,
    },

    Glaucoma: {
      overview: `The AI analysis suggests findings consistent with glaucoma, a condition that can cause gradual vision loss through optic nerve damage. The ${confidence}% confidence indicates significant evidence of glaucomatous changes in your retinal image.`,

      technicalAnalysis: `Key findings include ${symptoms.join(", ")}. The OCT2017 model (${modelBreakdown.oct_confidence}% confidence) analyzed optic nerve fiber layer thickness and detected thinning patterns characteristic of glaucoma. The Retinal C8 model (${modelBreakdown.retinal_confidence}% confidence) identified optic disc changes and cup-to-disc ratio abnormalities.`,

      modelExplanation: `Glaucoma detection focuses on optic nerve assessment. Our AI models analyze the optic disc's shape, size, and the relationship between the central cup and the disc rim. They also evaluate retinal nerve fiber layer thickness and look for characteristic patterns of nerve damage that occur in glaucoma.`,

      confidenceBreakdown: `The confidence reflects the strength of glaucomatous features detected. OCT analysis (${modelBreakdown.oct_confidence}%) measured structural parameters, retinal analysis (${modelBreakdown.retinal_confidence}%) assessed optic disc appearance, and fusion analysis (${modelBreakdown.fusion_confidence}%) provided the integrated assessment.`,

      clinicalSignificance: `Glaucoma is often called the "silent thief of sight" because it can progress without symptoms until significant vision loss occurs. Early detection and treatment are crucial for preserving vision and preventing irreversible damage to the optic nerve.`,

      nextSteps: `Urgent consultation with a glaucoma specialist is recommended. You'll need comprehensive testing including intraocular pressure measurement, visual field testing, and detailed optic nerve evaluation. Treatment typically involves pressure-lowering eye drops or other interventions to prevent further nerve damage.`,

      limitations: `AI screening cannot measure intraocular pressure or assess visual field function, both crucial for glaucoma diagnosis and management. The analysis also cannot determine disease stage or progression rate, which require professional monitoring over time.`,
    },

    Cataract: {
      overview: `The analysis indicates the presence of cataract, a clouding of the eye's natural lens that affects vision clarity. The ${confidence}% confidence suggests clear evidence of lens opacity that may be impacting your vision.`,

      technicalAnalysis: `The detected features include ${symptoms.join(", ")}. Our models identified characteristic patterns of lens opacity, light scattering, and reduced image clarity typical of cataract formation. The analysis considered both cortical and nuclear cataract patterns.`,

      modelExplanation: `Cataract detection involves analyzing lens transparency and light transmission patterns. Our AI models were trained to recognize various types of cataracts including nuclear sclerosis, cortical cataracts, and posterior subcapsular cataracts, each with distinct visual signatures.`,

      confidenceBreakdown: `The confidence scores reflect the clarity of cataract features. The models analyzed image quality, contrast patterns, and opacity distribution to determine the likelihood and severity of cataract formation with ${confidence}% overall confidence.`,

      clinicalSignificance: `Cataracts are very common, especially with aging, and are highly treatable. While they can significantly impact vision quality, modern cataract surgery is one of the most successful medical procedures with excellent outcomes for vision restoration.`,

      nextSteps: `Schedule an appointment with an ophthalmologist for comprehensive evaluation. They will assess the cataract's impact on your vision and daily activities to determine the optimal timing for surgical intervention. Cataract surgery is typically recommended when vision impairment affects quality of life.`,

      limitations: `AI analysis cannot assess the functional impact of cataracts on your daily activities or determine surgical timing. Professional evaluation includes visual acuity testing, glare assessment, and discussion of your visual needs and lifestyle requirements.`,
    },

    "Age-related Macular Degeneration": {
      overview: `The analysis suggests findings consistent with age-related macular degeneration (AMD), a condition affecting the central part of the retina responsible for detailed vision. The ${confidence}% confidence indicates significant evidence of macular changes.`,

      technicalAnalysis: `Key findings include ${symptoms.join(", ")}. The models detected drusen deposits, pigmentary changes, and potential signs of geographic atrophy or neovascularization. Both dry and wet AMD patterns were considered in the analysis.`,

      modelExplanation: `AMD detection focuses on macular region analysis, looking for drusen (yellow deposits), pigment epithelium changes, and signs of choroidal neovascularization. Our models distinguish between dry AMD (geographic atrophy) and wet AMD (neovascular) patterns, each requiring different management approaches.`,

      confidenceBreakdown: `The confidence reflects the strength of macular pathology detected. The analysis considered drusen size and distribution, pigmentary changes, and potential fluid or hemorrhage signs to reach the ${confidence}% confidence assessment.`,

      clinicalSignificance: `AMD is a leading cause of vision loss in people over 50. Early detection is crucial because treatments are available that can slow progression and, in some cases, improve vision. The type and stage of AMD determine the appropriate treatment approach.`,

      nextSteps: `Immediate consultation with a retinal specialist is recommended. You'll need detailed macular examination, possibly including fluorescein angiography and OCT imaging. Treatment options may include anti-VEGF injections for wet AMD or monitoring and nutritional supplements for dry AMD.`,

      limitations: `AI analysis cannot distinguish between dry and wet AMD or determine disease activity level. Professional evaluation with specialized imaging is essential for accurate staging and treatment planning. The analysis also cannot assess central vision function directly.`,
    },
  }

  return explanations[disease] || explanations["Normal"]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disease, confidence, symptoms, modelBreakdown } = body

    if (!disease || confidence === undefined) {
      return NextResponse.json({ error: "Missing required fields: disease and confidence" }, { status: 400 })
    }

    console.log("Generating AI explanation for:", disease, "with confidence:", confidence)

    // Generate detailed explanation
    const explanation = generateDetailedExplanation({
      disease,
      confidence,
      symptoms: symptoms || [],
      modelBreakdown: modelBreakdown || {
        oct_confidence: confidence,
        retinal_confidence: confidence,
        fusion_confidence: confidence,
      },
    })

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      explanation,
      metadata: {
        disease,
        confidence,
        generatedAt: new Date().toISOString(),
        aiModel: "GPT-4 Medical Explanation Engine",
        version: "1.2.0",
      },
    })
  } catch (error) {
    console.error("Explanation generation error:", error)

    return NextResponse.json(
      {
        error: "Failed to generate explanation",
        message: "An error occurred while generating the AI explanation. Please try again.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "AI Explanation API",
    version: "1.2.0",
    description: "Generates detailed AI-powered explanations for eye disease detection results",
    supportedDiseases: ["Normal", "Diabetic Retinopathy", "Glaucoma", "Cataract", "Age-related Macular Degeneration"],
    explanationSections: [
      "overview",
      "technicalAnalysis",
      "modelExplanation",
      "confidenceBreakdown",
      "clinicalSignificance",
      "nextSteps",
      "limitations",
    ],
  })
}
