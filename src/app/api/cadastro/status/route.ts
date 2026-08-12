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
  return NextResponse.json({ ready: data.status === "pago" && Boolean(data.provisioned_tenant_id), slug: data.status === "pago" ? data.slug : null, status: data.status });
}
