"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSessionToken, setSessionToken, clearSessionToken } from "@/lib/admin-auth"

interface AdminAuthProps {
  children: ReactNode
  onAdminKey: (key: string) => void
}

export function AdminAuth({ children, onAdminKey }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passphrase, setPassphrase] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function verifyStoredToken() {
      const token = getSessionToken()
      if (token) {
        // Verify the stored token is still valid
        try {
          const response = await fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passphrase: token }),
          })
          if (response.ok) {
            setIsAuthenticated(true)
            onAdminKey(token)
          } else {
            clearSessionToken()
          }
        } catch {
          clearSessionToken()
        }
      }
      setIsLoading(false)
    }
    verifyStoredToken()
  }, [onAdminKey])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!passphrase.trim()) {
      setError("Please enter a passphrase")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      })

      if (response.ok) {
        setSessionToken(passphrase)
        setIsAuthenticated(true)
        onAdminKey(passphrase)
      } else {
        setError("Invalid passphrase")
      }
    } catch {
      setError("Failed to verify passphrase")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    clearSessionToken()
    setIsAuthenticated(false)
    setPassphrase("")
    onAdminKey("")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-full max-w-sm space-y-6 p-6 border rounded-lg bg-card">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Admin Access</h2>
            <p className="text-sm text-muted-foreground">
              Enter the admin passphrase to manage the gallery
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Enter"}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      {children}
    </div>
  )
}
