"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, Stethoscope, User } from "lucide-react"
import { signOut } from "@/lib/services/auth"

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/inventory", icon: Package, label: "Inventory" },
]

interface SidebarProps {
  displayName: string
  email: string
}

export function Sidebar({ displayName, email }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <aside className="hidden md:flex md:w-20 lg:w-64 bg-card border-r border-border flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Stethoscope size={20} />
        </div>
        <div className="hidden lg:block">
          <p className="font-bold text-base leading-tight text-card-foreground">
            DLD
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Clinical Ops
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                active
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="hidden lg:block text-sm">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 p-3 w-full rounded-xl transition-colors hover:bg-muted text-left"
          aria-label="Sign out"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <User size={14} className="text-muted-foreground" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-xs font-bold text-foreground truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {email}
            </p>
          </div>
        </button>
      </div>
    </aside>
  )
}
