import { Panel } from "@/components/primitives"
import { cn } from "@/lib/utils"

type Stat = {
  label: string
  value: string | number
}

interface StatSummaryRowProps {
  stats: Stat[]
  className?: string
}

export function StatSummaryRow({ stats, className }: StatSummaryRowProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat, idx) => (
        <Panel key={idx} variant="bordered">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
          </div>
        </Panel>
      ))}
    </div>
  )
}
