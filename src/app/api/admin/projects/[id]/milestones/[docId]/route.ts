import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import type { MilestoneCompletionDraft } from "@/lib/crm/milestoneCompletion";
import {
  deleteMilestoneDocument,
  getMilestoneDocument,
  updateMilestoneDocument,
} from "@/lib/crm/milestoneDocuments";

type Params = { params: Promise<{ id: string; docId: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, docId } = await params;
  const document = await getMilestoneDocument(docId);
  if (!document || document.project_id !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ document });
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, docId } = await params;
  const existing = await getMilestoneDocument(docId);
  if (!existing || existing.project_id !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: { draft?: MilestoneCompletionDraft };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.draft || typeof body.draft !== "object") {
    return NextResponse.json({ error: "draft required" }, { status: 400 });
  }

  const document = await updateMilestoneDocument(docId, body.draft);
  return NextResponse.json({ document });
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, docId } = await params;
  const existing = await getMilestoneDocument(docId);
  if (!existing || existing.project_id !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteMilestoneDocument(docId);
  return NextResponse.json({ ok: true });
}
