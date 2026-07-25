import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import type { MilestoneCompletionDraft } from "@/lib/crm/milestoneCompletion";
import {
  createMilestoneDocument,
  listMilestoneDocuments,
} from "@/lib/crm/milestoneDocuments";
import { getProject } from "@/lib/crm/projects";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProject(id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const documents = await listMilestoneDocuments(id);
  return NextResponse.json({ documents });
}

export async function POST(req: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProject(id);
  if (!project) {
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

  const document = await createMilestoneDocument({
    projectId: id,
    draft: body.draft,
  });

  return NextResponse.json({ document }, { status: 201 });
}
