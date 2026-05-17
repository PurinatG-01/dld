import { redirect } from "next/navigation"
import { User, Settings } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/services/user"
import { SignOutButton } from "@/components/account/SignOutButton"

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const profile = await getUserProfile(supabase, user.id)
  const displayName = profile?.name ?? user.email ?? "User"
  const email = profile?.email ?? user.email ?? ""

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Account</h1>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted">
          <User size={24} className="text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-card-foreground truncate">{displayName}</p>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
        </div>
      </div>

      {/* General section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
        <div className="px-5 py-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            General
          </p>
        </div>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-5 py-4 text-sm text-foreground hover:bg-muted transition-colors"
        >
          <Settings size={16} className="text-muted-foreground" />
          Settings
        </Link>
      </div>

      {/* Sign out */}
      <div className="pt-2">
        <SignOutButton />
      </div>
    </div>
  )
}
