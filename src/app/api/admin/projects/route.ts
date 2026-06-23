import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createProject, listProjects } from "@/lib/crm/projects";
import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/crm/types";

export async function GET(req: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as ProjectStatus | null;
  const projects = await listProjects(status ?? undefined);
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const status = String(body.status ?? "lead") as ProjectStatus;
  if (!PROJECT_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const project = await createProject({
    title,
    client_name: String(body.client_name ?? "").trim() || undefined,
    client_email: String(body.client_email ?? "").trim() || undefined,
    project_type: String(body.project_type ?? "").trim() || undefined,
    status,
    summary: String(body.summary ?? "").trim() || undefined,
    notes: String(body.notes ?? "").trim() || undefined,
    value: String(body.value ?? "").trim() || undefined,
    timeline: String(body.timeline ?? "").trim() || undefined,
    live_url: String(body.live_url ?? "").trim() || undefined,
    slug: String(body.slug ?? "").trim() || undefined,
    lead_id: String(body.lead_id ?? "").trim() || undefined,
    publish_to_site: Boolean(body.publish_to_site),
  });

  return NextResponse.json({ project }, { status: 201 });
}
