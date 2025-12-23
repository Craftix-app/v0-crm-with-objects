import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-8">
      <h1 className="text-sm font-medium">{title}</h1>
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
        <User className="h-4 w-4" />
        <span className="sr-only">Profile</span>
      </Button>
    </header>
  )
}
