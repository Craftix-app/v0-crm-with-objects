import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Creates a Supabase client for server-side operations.
 * Uses service role key for server actions (bypasses RLS for MVP).
 */
export async function createClient() {
  return createSupabaseClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
  )
}
