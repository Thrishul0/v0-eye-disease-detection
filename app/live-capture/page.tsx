"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Camera, ArrowLeft, AlertCircle, Loader2, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LiveCapturePage() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const router = useRouter()

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsStreaming(true)
      }
    } catch (err) {
      setError("Unable to access camera. Please ensure camera permissions are granted.")
      console.error("Camera access error:", err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
  }, [])

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
    setCapturedImage(imageDataUrl)
    stopCamera()
  }, [stopCamera])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  const analyzeImage = useCallback(async () => {
    if (!capturedImage) return

    setIsAnalyzing(true)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Navigate to results with the captured image
    const params = new URLSearchParams({
      image: capturedImage,
      source: "camera",
    })
    router.push(`/diagnosis?${params.toString()}`)
  }, [capturedImage, router])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

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
                <h1 className="text-lg font-semibold">Live Camera Capture</h1>
                <p className="text-sm text-muted-foreground">Capture eye image in real-time</p>
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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Camera Capture</CardTitle>
              <CardDescription>Position your eye clearly in the camera frame for optimal analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                {capturedImage ? (
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured eye image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {!isStreaming && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Camera not active</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Camera overlay guide */}
                {isStreaming && !capturedImage && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-48 h-48 border-2 border-secondary rounded-full opacity-50"></div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <Badge variant="secondary">Position eye within the circle</Badge>
                    </div>
                  </div>
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-4 justify-center">
                {!isStreaming && !capturedImage && (
                  <Button onClick={startCamera} size="lg">
                    <Camera className="mr-2 h-5 w-5" />
                    Start Camera
                  </Button>
                )}

                {isStreaming && !capturedImage && (
                  <>
                    <Button onClick={captureImage} size="lg">
                      <Camera className="mr-2 h-5 w-5" />
                      Capture Image
                    </Button>
                    <Button variant="outline" onClick={stopCamera}>
                      Stop Camera
                    </Button>
                  </>
                )}

                {capturedImage && (
                  <>
                    <Button onClick={analyzeImage} size="lg" disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Image"
                      )}
                    </Button>
                    <Button variant="outline" onClick={retakePhoto}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retake
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capture Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  Ensure good lighting conditions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  Keep the eye open and look directly at the camera
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  Position the eye within the circular guide
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  Avoid reflections and shadows
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  Hold steady when capturing the image
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
