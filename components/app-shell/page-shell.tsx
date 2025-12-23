import type React from "react"
import { TopBar } from "./top-bar"

interface PageShellProps {
  title: string
  children: React.ReactNode
}

export function PageShell({ title, children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar title={title} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
