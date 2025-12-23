import { PageShell } from "@/components/app-shell/page-shell"
import { EmptyState } from "@/components/app-shell/empty-state"
import { FileText } from "lucide-react"

export default function DocumentsPage() {
  return (
    <PageShell title="Documents">
      <EmptyState icon={FileText} title="No documents" description="Upload or create your first document." />
    </PageShell>
  )
}
