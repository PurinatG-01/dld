"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stethoscope, Loader2 } from "lucide-react"
import { signInWithEmail } from "@/lib/services/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await signInWithEmail(email, password)
    if (!result.success) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-10 shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Stethoscope size={20} />
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-card-foreground">
              DLD
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Clinical Ops
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-card-foreground mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Sign in to your clinic account
        </p>

        {/* Error */}
        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
