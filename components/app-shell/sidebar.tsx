"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, StickyNote, CheckSquare, Users, Settings, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/notes", label: "Notes", icon: StickyNote },
  { href: "/app/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/app/contacts", label: "Contacts", icon: Users },
  { href: "/app/settings", label: "Settings", icon: Settings },
]

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onToggle} />}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-60 border-r border-border bg-background transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <span className="text-sm font-medium tracking-tight">Workspace</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={onToggle}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onToggle}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={onClick}>
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}
