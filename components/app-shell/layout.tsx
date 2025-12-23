"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/app-shell/sidebar"
import { TopBar } from "@/components/app-shell/top-bar"

export function AppClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <div className="md:pl-60">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        {children}
      </div>
    </div>
  )
}
