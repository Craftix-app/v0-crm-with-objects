import { PageShell } from "@/components/app-shell/page-shell"
import { EmptyState } from "@/components/app-shell/empty-state"
import { LayoutDashboard } from "lucide-react"

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard">
      <EmptyState icon={LayoutDashboard} title="No data yet" description="Your dashboard overview will appear here." />
    </PageShell>
  )
}
