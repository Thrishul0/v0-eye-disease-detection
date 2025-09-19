"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Upload, Camera, Brain, FileText, Zap, Shield, Activity } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Eye className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">EyeDetect AI</h1>
                <p className="text-sm text-muted-foreground">Advanced Eye Disease Detection</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#diagnosis" className="text-foreground hover:text-secondary transition-colors">
                Diagnosis
              </Link>
              <Link href="#about" className="text-foreground hover:text-secondary transition-colors">
                About
              </Link>
              <Link href="#reports" className="text-foreground hover:text-secondary transition-colors">
                Reports
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            Multi-Stage Deep Learning Technology
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Professional Eye Disease Detection Platform
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Advanced AI-powered diagnosis using OCT2017, Retinal C8, and comprehensive eye disease datasets. Get
            accurate results with detailed AI explanations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/diagnosis">
              <Button size="lg" className="w-full sm:w-auto">
                <Upload className="mr-2 h-5 w-5" />
                Start Diagnosis
              </Button>
            </Link>
            <Link href="/live-capture">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Camera className="mr-2 h-5 w-5" />
                Live Camera
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="about" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Advanced AI Technology</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multi-stage deep learning approach combines multiple datasets for unprecedented accuracy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Brain className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Multi-Stage Deep Learning</CardTitle>
                <CardDescription>
                  Advanced neural networks trained on OCT2017, Retinal C8, and comprehensive eye disease datasets
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Zap className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Real-Time Analysis</CardTitle>
                <CardDescription>Instant disease detection with live camera capture or uploaded images</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <FileText className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Detailed Reports</CardTitle>
                <CardDescription>
                  Comprehensive diagnostic reports with symptoms analysis and AI explanations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Shield className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Medical Grade Accuracy</CardTitle>
                <CardDescription>
                  Trained on validated medical datasets with professional-grade precision
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Activity className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>AI Explanations</CardTitle>
                <CardDescription>
                  Detailed AI-powered explanations of diagnosis results and recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <Eye className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Multiple Conditions</CardTitle>
                <CardDescription>
                  Detects various eye diseases including diabetic retinopathy, glaucoma, and macular degeneration
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-accent/5">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Upload your eye image or use live camera capture for instant AI-powered diagnosis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/diagnosis">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Image
                  </Button>
                </Link>
                <Link href="/live-capture">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    <Camera className="mr-2 h-5 w-5" />
                    Live Camera
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-secondary rounded-lg">
              <Eye className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="font-semibold">EyeDetect AI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Professional eye disease detection using advanced deep learning technology
          </p>
        </div>
      </footer>
    </div>
  )
}
