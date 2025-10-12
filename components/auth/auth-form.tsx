"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/"
  const supabase = React.useMemo(() => createBrowserClient(), [])
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loadingEmail, setLoadingEmail] = React.useState(false)
  const [loadingGoogle, setLoadingGoogle] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoadingEmail(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        return
      }
      router.push(next)
      router.refresh()
    } finally {
      setLoadingEmail(false)
    }
  }

  async function handleGoogleSignIn() {
    setError(null)
    setLoadingGoogle(true)
    try {
      const redirectTo =
        typeof window !== "undefined" ? `${window.location.origin}${next !== "/" ? next : ""}` : undefined
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })
      if (error) setError(error.message)
      // OAuth will redirect on success
    } finally {
      setLoadingGoogle(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Sign in</CardTitle>
          <CardDescription className="text-pretty">
            Use your Google account or email to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Button type="button" className="w-full" onClick={handleGoogleSignIn} disabled={loadingGoogle}>
              {loadingGoogle ? "Redirecting..." : "Continue with Google"}
            </Button>
          </div>
          <div className="grid gap-2">
            <form onSubmit={handleEmailSignIn} className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loadingEmail}>
                {loadingEmail ? "Signing in..." : "Sign in with Email"}
              </Button>
            </form>
            <p className="sr-only" aria-live="polite">
              {loadingEmail || loadingGoogle ? "Processing sign-in" : ""}
            </p>
            {error ? (
              <p className="text-sm text-destructive" role="alert" aria-live="assertive">
                {error}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthForm
