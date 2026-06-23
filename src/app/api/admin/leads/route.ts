import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { listLeads } from "@/lib/crm/leads";
import type { LeadStatus } from "@/lib/crm/types";

export async function GET(req: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as LeadStatus | null;

  const leads = await listLeads(status ?? undefined);
  return NextResponse.json({ leads });
}
