import { EmptyState } from "@/components/primitives"
import { LayoutDashboard } from "lucide-react"

export default function DashboardPage() {
  return (
    <main className="flex-1 p-8">
      <EmptyState
        icon={LayoutDashboard}
        title="Welcome to your dashboard"
        description="Your overview and key metrics will appear here."
      />
    </main>
  )
}
