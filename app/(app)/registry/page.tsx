import { PageShell } from "@/components/app-shell/page-shell"
import { EmptyState } from "@/components/app-shell/empty-state"
import { Database } from "lucide-react"

export default function RegistryPage() {
  return (
    <PageShell title="Registry">
      <EmptyState icon={Database} title="No entries" description="Your registry entries will appear here." />
    </PageShell>
  )
}
