import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { requirePublicSupabaseEnv } from "@/lib/env/public";
import { requireSupabaseServiceRoleKey } from "@/lib/env/server";
import type { Database } from "@/types/database";

export function createAdminClient() {
  const { url } = requirePublicSupabaseEnv();
  const serviceRoleKey = requireSupabaseServiceRoleKey();

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
