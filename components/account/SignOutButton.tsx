"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { signOut } from "@/lib/services/auth"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <Button
      variant="destructive"
      className="w-full justify-start gap-3"
      onClick={handleSignOut}
    >
      <LogOut size={16} />
      Sign out
    </Button>
  )
}
