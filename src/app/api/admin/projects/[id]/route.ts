import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  deleteProject,
  getProject,
  updateProject,
} from "@/lib/crm/projects";
import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/crm/types";

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
  return NextResponse.json({ project });
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.status && !PROJECT_STATUSES.includes(body.status as ProjectStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const project = await updateProject(id, {
    title: body.title != null ? String(body.title).trim() : undefined,
    client_name:
      body.client_name != null ? String(body.client_name).trim() : undefined,
    client_email:
      body.client_email != null ? String(body.client_email).trim() : undefined,
    project_type:
      body.project_type != null ? String(body.project_type).trim() : undefined,
    status: body.status as ProjectStatus | undefined,
    summary: body.summary != null ? String(body.summary).trim() : undefined,
    notes: body.notes != null ? String(body.notes).trim() : undefined,
    value: body.value != null ? String(body.value).trim() : undefined,
    timeline: body.timeline != null ? String(body.timeline).trim() : undefined,
    live_url: body.live_url != null ? String(body.live_url).trim() : undefined,
    slug: body.slug != null ? String(body.slug).trim() : undefined,
    publish_to_site:
      body.publish_to_site != null ? Boolean(body.publish_to_site) : undefined,
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteProject(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
