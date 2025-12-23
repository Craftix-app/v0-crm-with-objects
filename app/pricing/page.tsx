import Link from "next/link"
import { Button } from "@/components/registry/controls"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/" className="text-sm font-medium tracking-tight">
          Workspace
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/pricing" className="text-sm text-foreground">
            Pricing
          </Link>
          <Button asChild size="sm">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-4xl font-medium tracking-tight">Simple pricing</h1>
        <p className="max-w-md text-muted-foreground">Free while in beta. Premium features coming soon.</p>
      </main>

      <footer className="flex h-16 items-center justify-center border-t border-border px-6">
        <p className="text-sm text-muted-foreground">Built with care.</p>
      </footer>
    </div>
  )
}
