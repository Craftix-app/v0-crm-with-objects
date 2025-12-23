import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/registry/controls"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/" className="flex items-center">
          <Image src="/images/craftx-logo.png" alt="CraftX" width={120} height={32} className="h-8 w-auto" priority />
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Button asChild size="sm">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-4xl font-medium tracking-tight">Your workspace, simplified.</h1>
        <p className="max-w-md text-muted-foreground">
          A calm, focused environment to manage your notes, tasks, and contacts.
        </p>
        <Button asChild>
          <Link href="/dashboard">Enter Workspace</Link>
        </Button>
      </main>

      <footer className="flex h-16 items-center justify-center border-t border-border px-6">
        <p className="text-sm text-muted-foreground">Built with care.</p>
      </footer>
    </div>
  )
}
