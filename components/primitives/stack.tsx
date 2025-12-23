import type React from "react"
import { cn } from "@/lib/utils"

interface StackProps {
  children: React.ReactNode
  className?: string
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
}

const gapClasses = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
}

export function Stack({ children, className, gap = "md" }: StackProps) {
  return <div className={cn("flex flex-col", gapClasses[gap], className)}>{children}</div>
}
