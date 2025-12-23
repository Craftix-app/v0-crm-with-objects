"use client"

import { useState } from "react"
import { Sidebar } from "@/components/app-shell/sidebar"
import { TopBar } from "@/components/app-shell/top-bar"
import { EmptyState } from "@/components/app-shell/empty-state"
import { StickyNote } from "lucide-react"

export default function NotesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col md:pl-60">
        <TopBar title="Notes" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-8">
          <EmptyState
            icon={StickyNote}
            title="No notes yet"
            description="Create your first note to start capturing ideas."
          />
        </main>
      </div>
    </>
  )
}
