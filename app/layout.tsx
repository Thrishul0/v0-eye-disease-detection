import type React from "react"
import type { Metadata } from "next"
import { Geist as GeistSans, Geist_Mono as GeistMono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

const geistSans = GeistSans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})
const geistMono = GeistMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className={`font-sans`}>
        <Suspense fallback={null}>
          {children}
          <Analytics />
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}
