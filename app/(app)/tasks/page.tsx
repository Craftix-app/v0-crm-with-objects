import { PageShell } from "@/components/app-shell/page-shell"
import { EmptyState } from "@/components/app-shell/empty-state"
import { CheckSquare } from "lucide-react"

export default function TasksPage() {
  return (
    <PageShell title="Tasks">
      <EmptyState icon={CheckSquare} title="No tasks" description="Create your first task to track your work." />
    </PageShell>
  )
}
