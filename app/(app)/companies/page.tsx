import { PageShell } from "@/components/app-shell/page-shell"
import { EmptyState } from "@/components/app-shell/empty-state"
import { Building2 } from "lucide-react"

export default function CompaniesPage() {
  return (
    <PageShell title="Companies">
      <EmptyState icon={Building2} title="No companies" description="Add your first company to get started." />
    </PageShell>
  )
}
