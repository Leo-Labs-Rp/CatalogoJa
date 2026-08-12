import "server-only";

import { createClient } from "@supabase/supabase-js";

import { requirePublicSupabaseEnv } from "@/lib/env/public";
import type { Database } from "@/types/database";

export function createPublicClient() {
  const { anonKey, url } = requirePublicSupabaseEnv();

  return createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
