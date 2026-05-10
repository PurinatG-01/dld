'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Activity, Settings, Camera } from 'lucide-react'

const LEFT_TABS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/inventory',  icon: Package,         label: 'Inventory'  },
]

const RIGHT_TABS = [
  { href: '/activity', icon: Activity,  label: 'Activity' },
  { href: '/settings', icon: Settings,  label: 'Settings' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40 pb-safe">
      <div className="flex items-center justify-around h-16 px-2 relative">
        {LEFT_TABS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                active ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          )
        })}

        {/* Center Scan FAB */}
        <Link
          href="/scan"
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-all active:scale-95"
          aria-label="Scan item"
        >
          <Camera size={24} />
        </Link>

        <div className="w-14" aria-hidden="true" />

        {RIGHT_TABS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                active ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
