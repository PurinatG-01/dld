/**
 * auth.ts — client-side auth service
 * Only call from Client Components ('use client').
 */
import { createClient } from '@/lib/supabase/client'

export type SignInResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Sign in with email and password via Supabase Auth.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<SignInResult> {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Sign out the current session.
 */
export async function signOut(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}
