"use client"

import { useState } from "react"
import { Sidebar } from "@/components/app-shell/sidebar"
import { TopBar } from "@/components/app-shell/top-bar"
import { EmptyState } from "@/components/app-shell/empty-state"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col md:pl-60">
        <TopBar title="Settings" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-8">
          <EmptyState icon={Settings} title="Settings" description="Configure your workspace preferences here." />
        </main>
      </div>
    </>
  )
}
