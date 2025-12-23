"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/app-shell/sidebar"
import { TopBar } from "@/components/app-shell/top-bar"
import { usePathname } from "next/navigation"

export function AppClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const getTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/notes") return "Notes"
    if (pathname === "/tasks") return "Tasks"
    if (pathname === "/contacts") return "Contacts"
    if (pathname === "/settings") return "Settings"
    if (pathname === "/companies") return "Companies"
    if (pathname === "/documents") return "Documents"
    if (pathname === "/registry") return "Registry"
    if (pathname === "/generate") return "Generate"
    return "Workspace"
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <div className="md:pl-60">
        <TopBar title={getTitle()} onMenuClick={() => setSidebarOpen(true)} />
        {children}
      </div>
    </div>
  )
}
