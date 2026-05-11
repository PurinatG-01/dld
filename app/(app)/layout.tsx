// TODO: Re-enable Supabase auth guard when sign-in/sign-up is ready.
// Restore these imports and the auth check block:
//
// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
//
// Inside AppLayout:
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) redirect('/auth/login')
//   const displayName = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? 'User'
//   const email = user.email ?? ''

import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { InventoryProvider } from '@/lib/inventory-context'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const displayName = 'Demo User'
  const email = 'demo@dld.app'

  return (
    <InventoryProvider>
      <div className="min-h-screen bg-[#F9F9FF] flex font-sans selection:bg-indigo-100">
        <Sidebar displayName={displayName} email={email} />
        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </InventoryProvider>
  )
}
