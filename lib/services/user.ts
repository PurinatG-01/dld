/**
 * user.ts — server-side user profile service
 * Only call from Server Components or Route Handlers (not client components).
 */
import type { SupabaseClient } from "@supabase/supabase-js"

export type UserProfile = {
  id: string
  name: string
  email: string
  role_id: string
  branch_id: string
}

/**
 * Fetch the public.user profile for the currently authenticated user.
 * Returns null if the profile does not exist.
 */
export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user")
    .select("id, name, email, role_id, branch_id")
    .eq("id", userId)
    .single()

  if (error || !data) return null
  return data as UserProfile
}
