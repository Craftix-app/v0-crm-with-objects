import type React from "react"
import { cn } from "@/lib/utils"

interface PageShellProps {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function PageShell({ title, actions, children, className }: PageShellProps) {
  return (
    <main className={cn("flex-1 p-8", className)}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </main>
  )
}
