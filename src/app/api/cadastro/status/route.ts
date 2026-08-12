import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref") ?? "";
  if (!z.uuid().safeParse(ref).success) return NextResponse.json({ error: "Referência inválida." }, { status: 400 });
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ configured: false, status: "pendente" }, { status: 503 });
  const admin = createAdminClient();
  const { data, error } = await admin.from("signup_intents").select("status,slug,provisioned_tenant_id").eq("external_reference", ref).maybeSingle();
  if (error || !data) return NextResponse.json({ error: "Cadastro não encontrado." }, { status: 404 });

  const ready = data.status === "pago" && Boolean(data.provisioned_tenant_id);
  let accessConfigured = false;

  if (ready && data.provisioned_tenant_id) {
    const { data: tenant } = await admin.from("tenants").select("owner_user_id").eq("id", data.provisioned_tenant_id).maybeSingle();
    if (tenant) {
      const { data: owner } = await admin.auth.admin.getUserById(tenant.owner_user_id);
      accessConfigured = Boolean(owner.user?.app_metadata?.catalogoja_password_configured_at);
    }
  }

  return NextResponse.json({ accessConfigured, ready, slug: data.status === "pago" ? data.slug : null, status: data.status });
}
