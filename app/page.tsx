// FILE: app/page.tsx
"use client" // Add this directive to make it a Client Component

import { useEffect } from "react"
import { redirect } from "next/navigation" // redirect can be used in Client Component Effects
import { isAuthenticated } from "@/lib/auth"

export default function HomePage() {
  useEffect(() => {
    // This code will run on the client side after the component mounts
    if (isAuthenticated()) {
      redirect("/dashboard")
    } else {
      redirect("/login")
    }
  }, []) // The empty dependency array ensures this effect runs only once on mount

  // Return null or a loading spinner while the redirect is being processed
  // This prevents any flash of content before redirection.
  return null
}