import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-sm font-medium">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
