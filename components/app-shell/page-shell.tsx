import type React from "react"
import { TopBar } from "./top-bar"

interface PageShellProps {
  title: string
  children: React.ReactNode
  onMenuClick?: () => void
}

export function PageShell({ title, children, onMenuClick }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar title={title} onMenuClick={onMenuClick} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
