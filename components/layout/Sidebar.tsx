"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ScanLine,
  Stethoscope,
  User,
  Settings,
  LogOut,
} from "lucide-react"
import { signOut } from "@/lib/services/auth"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useScannerContext } from "@/components/scanner/ScannerContext"

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
  const { isOpen: scannerOpen, toggle: toggleScanner } = useScannerContext()

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

      {/* Scanner action */}
      <div className="px-4 mb-1">
        <p className="hidden lg:block text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1 px-3">
          Actions
        </p>
        <button
          onClick={toggleScanner}
          className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all text-sm font-semibold ${
            scannerOpen
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ScanLine size={20} className={scannerOpen ? "animate-pulse" : ""} />
          <span className="hidden lg:block">
            {scannerOpen ? "Close Scanner" : "Scan Item"}
          </span>
        </button>
      </div>

      <div className="mx-4 mb-3 border-t border-border" />

      <nav className="flex-1 px-4 space-y-1">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-3 p-3 w-full rounded-xl transition-colors hover:bg-muted text-left"
              aria-label="Account menu"
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
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56 mb-1">
            <DropdownMenuLabel className="font-normal">
              <p className="font-semibold text-foreground truncate">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings size={14} />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
              <LogOut size={14} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
