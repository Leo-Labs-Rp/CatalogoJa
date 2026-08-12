import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getPublicSupabaseEnv } from "@/lib/env/public";
import type { Database } from "@/types/database";

export async function refreshSupabaseSession(request: NextRequest) {
  const env = getPublicSupabaseEnv();
  let response = NextResponse.next({ request });

  if (!env) return response;

  const supabase = createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, options, value }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getClaims();
  return response;
}
