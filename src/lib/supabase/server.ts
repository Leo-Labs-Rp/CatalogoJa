import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { requirePublicSupabaseEnv } from "@/lib/env/public";
import type { Database } from "@/types/database";

export async function createClient() {
  const { anonKey, url } = requirePublicSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components não podem escrever cookies. O proxy de sessão,
          // implementado junto da autenticação, fará a renovação quando necessário.
        }
      },
    },
  });
}
