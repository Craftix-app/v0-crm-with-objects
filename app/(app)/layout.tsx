import type React from "react"
import { AppClientLayout } from "@/components/app-shell/layout"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppClientLayout>{children}</AppClientLayout>
}
