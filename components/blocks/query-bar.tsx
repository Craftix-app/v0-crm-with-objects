import { Search, Filter, ArrowUpDown } from "lucide-react"
import { Panel } from "@/components/primitives"
import { cn } from "@/lib/utils"

interface QueryBarProps {
  className?: string
}

export function QueryBar({ className }: QueryBarProps) {
  return (
    <Panel className={cn("flex items-center gap-3", className)}>
      <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          disabled
        />
      </div>
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filter
      </button>
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      >
        <ArrowUpDown className="w-4 h-4" />
        Sort
      </button>
    </Panel>
  )
}
