const ADMIN_KEY = process.env.ADMIN_KEY || ""
const SESSION_KEY = "admin_session"

export function verifyPassphrase(passphrase: string): boolean {
  if (!ADMIN_KEY) {
    console.warn("ADMIN_KEY not set in environment variables")
    return false
  }
  return passphrase === ADMIN_KEY
}

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(SESSION_KEY)
}

export function setSessionToken(token: string): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(SESSION_KEY, token)
}

export function clearSessionToken(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(SESSION_KEY)
}

export function isAuthenticated(): boolean {
  const token = getSessionToken()
  return token === "authenticated"
}
