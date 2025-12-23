"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Search } from "lucide-react"
import { SidebarToggle } from "./sidebar"

interface TopBarProps {
  title: string
  onMenuClick?: () => void
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-8">
      <div className="flex items-center gap-3">
        {onMenuClick && <SidebarToggle onClick={onMenuClick} />}
        <h1 className="text-sm font-medium">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="h-8 w-48 pl-8 text-sm lg:w-64" disabled />
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <User className="h-4 w-4" />
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </header>
  )
}
