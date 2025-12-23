"use client"

import { useState } from "react"
import { Sidebar } from "@/components/app-shell/sidebar"
import { TopBar } from "@/components/app-shell/top-bar"
import { EmptyState } from "@/components/app-shell/empty-state"
import { Users } from "lucide-react"

export default function ContactsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col md:pl-60">
        <TopBar title="Contacts" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-8">
          <EmptyState
            icon={Users}
            title="No contacts"
            description="Add your first contact to start building your network."
          />
        </main>
      </div>
    </>
  )
}
