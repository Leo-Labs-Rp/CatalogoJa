import "server-only";

import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/env/public";
import { DEMO_EMAIL, DEMO_TENANT, DEMO_USER_ID, hasDemoSession } from "@/lib/demo/panel-demo";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type TenantRow = Database["public"]["Tables"]["tenants"]["Row"];

export type PanelContext =
  | { authenticated: false; configured: false; demo: false; tenant: null; userEmail: null; userId: null }
  | { authenticated: false; configured: true; demo: false; tenant: null; userEmail: null; userId: null }
  | {
      authenticated: true;
      configured: true;
      demo: boolean;
      tenant: TenantRow | null;
      userEmail: string | null;
      userId: string;
    };

export const getPanelContext = cache(async (): Promise<PanelContext> => {
  const configured = isSupabaseConfigured();

  if (!configured) {
    if (await hasDemoSession()) {
      return { authenticated: true, configured: true, demo: true, tenant: DEMO_TENANT, userEmail: DEMO_EMAIL, userId: DEMO_USER_ID };
    }

    return { authenticated: false, configured: false, demo: false, tenant: null, userEmail: null, userId: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;

  if (error || !userId) {
    if (await hasDemoSession()) {
      return { authenticated: true, configured: true, demo: true, tenant: DEMO_TENANT, userEmail: DEMO_EMAIL, userId: DEMO_USER_ID };
    }

    return { authenticated: false, configured: true, demo: false, tenant: null, userEmail: null, userId: null };
  }

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("owner_user_id", userId)
    .maybeSingle();

  const email = typeof data?.claims?.email === "string" ? data.claims.email : null;

  return {
    authenticated: true,
    configured: true,
    demo: false,
    tenant,
    userEmail: email,
    userId,
  };
});

export async function requireTenant() {
  const context = await getPanelContext();

  if (!context.authenticated || !context.tenant) {
    throw new Error("Sua sessão ou loja não está disponível. Entre novamente no painel.");
  }

  return { ...context, tenant: context.tenant };
}
