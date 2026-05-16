import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/services/user"
import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const profile = await getUserProfile(supabase, user.id)

  const displayName = profile?.name ?? user.email ?? "User"
  const email = profile?.email ?? user.email ?? ""

  return (
    <div className="min-h-screen bg-[#F9F9FF] flex font-sans selection:bg-indigo-100">
      <Sidebar displayName={displayName} email={email} />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  )
}
