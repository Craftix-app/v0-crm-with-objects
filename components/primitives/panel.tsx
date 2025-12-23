import type React from "react"
import { cn } from "@/lib/utils"

interface PanelProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "bordered" | "elevated"
}

const variantClasses = {
  default: "bg-card text-card-foreground",
  bordered: "bg-card text-card-foreground border border-border",
  elevated: "bg-card text-card-foreground shadow-sm",
}

export function Panel({ children, className, variant = "bordered" }: PanelProps) {
  return <div className={cn("rounded-lg p-6", variantClasses[variant], className)}>{children}</div>
}
