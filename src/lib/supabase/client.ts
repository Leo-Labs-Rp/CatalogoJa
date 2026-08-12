"use client";

import { createBrowserClient } from "@supabase/ssr";

import { requirePublicSupabaseEnv } from "@/lib/env/public";
import type { Database } from "@/types/database";

export function createClient() {
  const { anonKey, url } = requirePublicSupabaseEnv();

  return createBrowserClient<Database>(url, anonKey);
}
