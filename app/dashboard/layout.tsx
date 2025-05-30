"use client"

import type React from "react"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <DashboardHeader />
      <div className="flex">
        <aside className="hidden w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block transition-colors duration-200">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <span className="font-semibold text-foreground">Navigation</span>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <DashboardNav />
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto bg-background transition-colors duration-200">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
