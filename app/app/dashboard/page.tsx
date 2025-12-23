"use client"

import { useState } from "react"
import { Sidebar } from "@/components/app-shell/sidebar"
import { TopBar } from "@/components/app-shell/top-bar"
import { EmptyState } from "@/components/app-shell/empty-state"
import { LayoutDashboard } from "lucide-react"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col md:pl-60">
        <TopBar title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-8">
          <EmptyState
            icon={LayoutDashboard}
            title="Welcome to your dashboard"
            description="Your overview and key metrics will appear here."
          />
        </main>
      </div>
    </>
  )
}
