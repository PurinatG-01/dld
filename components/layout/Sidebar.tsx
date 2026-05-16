"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, Stethoscope, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <aside className="hidden md:flex md:w-20 lg:w-64 bg-white border-r border-slate-100 flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
          <Stethoscope size={22} />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-slate-900 font-bold text-lg leading-tight">
            DLD
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
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
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                active
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              <Icon size={20} />
              <span className="hidden lg:block text-sm">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-4 hidden lg:block border border-slate-100 mb-4">
          <p className="text-[11px] text-slate-500 font-medium mb-2">
            Clinic Performance
          </p>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="w-[85%] h-full bg-indigo-500" />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">
            85% Capacity
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 p-3 w-full hover:bg-slate-50 rounded-xl transition-all text-left"
          aria-label="Sign out"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
            <User size={14} className="text-slate-400" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{email}</p>
          </div>
        </button>
      </div>
    </aside>
  )
}
