import { PageShell } from "@/components/app-shell/page-shell"
import { EmptyState } from "@/components/app-shell/empty-state"
import { Sparkles } from "lucide-react"

export default function GeneratePage() {
  return (
    <PageShell title="Generate">
      <EmptyState icon={Sparkles} title="Nothing to generate" description="Select an item to generate content." />
    </PageShell>
  )
}
