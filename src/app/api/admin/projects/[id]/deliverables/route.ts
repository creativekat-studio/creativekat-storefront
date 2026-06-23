import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getProject, updateProjectDeliverables } from "@/lib/crm/projects";
import type { Deliverable } from "@/lib/crm/types";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: { deliverables?: Deliverable[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.deliverables || !Array.isArray(body.deliverables)) {
    return NextResponse.json(
      { error: "deliverables array required" },
      { status: 400 },
    );
  }

  const deliverables = body.deliverables.map((d) => ({
    id: String(d.id),
    label: String(d.label),
    done: Boolean(d.done),
    done_at: d.done
      ? d.done_at
        ? String(d.done_at).slice(0, 10)
        : new Date().toISOString().slice(0, 10)
      : undefined,
    sent_at: d.sent_at ? String(d.sent_at).slice(0, 10) : undefined,
  }));

  const project = await updateProjectDeliverables(id, deliverables);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}
