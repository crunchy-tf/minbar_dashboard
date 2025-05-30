"use client"

export interface AuthCredentials {
  username: string
  password: string
}

export function login(credentials: AuthCredentials): boolean {
  // For demo purposes, we'll use the API gateway credentials
  if (credentials.username === "admin" && credentials.password === "changeme") {
    localStorage.setItem("auth", JSON.stringify(credentials))
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem("auth")
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("auth") !== null
}

export function getAuthCredentials(): AuthCredentials | null {
  if (typeof window === "undefined") return null
  const auth = localStorage.getItem("auth")
  return auth ? JSON.parse(auth) : null
}
