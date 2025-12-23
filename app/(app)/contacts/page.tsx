import { PageShell } from "@/components/app-shell/page-shell"
import { EmptyState } from "@/components/app-shell/empty-state"
import { Users } from "lucide-react"

export default function ContactsPage() {
  return (
    <PageShell title="Contacts">
      <EmptyState icon={Users} title="No contacts" description="Add your first contact to get started." />
    </PageShell>
  )
}
