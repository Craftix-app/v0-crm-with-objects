import { Panel, Stack } from "@/components/primitives"
import { cn } from "@/lib/utils"

type FieldValue = {
  label: string
  value: string | number
}

interface DetailPanelBlockProps {
  fields?: FieldValue[]
  className?: string
}

export function DetailPanelBlock({ fields = [], className }: DetailPanelBlockProps) {
  // Empty state - no selection
  if (fields.length === 0) {
    return (
      <Panel className={cn("flex flex-col items-center justify-center py-16", className)}>
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl text-muted-foreground">?</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">No selection</h3>
        <p className="text-sm text-muted-foreground">Select an item to view details.</p>
      </Panel>
    )
  }

  // Populated state
  return (
    <Panel className={cn(className)}>
      <Stack gap="lg">
        <h3 className="text-lg font-semibold border-b border-border pb-3">Details</h3>
        <Stack gap="md">
          {fields.map((field, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{field.label}</span>
              <span className="text-sm text-foreground">{field.value}</span>
            </div>
          ))}
        </Stack>
      </Stack>
    </Panel>
  )
}
