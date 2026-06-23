import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  createProjectOutboundMessage,
  loadProjectAttachmentsForResend,
} from "@/lib/crm/projectMessages";
import {
  getProject,
  markDeliverableSent,
} from "@/lib/crm/projects";
import { projectClientEmail } from "@/lib/email";

const TO = "hello@creativekat.studio";

type Params = { params: Promise<{ id: string }> };

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

  if (!project.client_email) {
    return NextResponse.json(
      { error: "Add a client email on this project first" },
      { status: 400 },
    );
  }

  const form = await req.formData();
  const subject = String(form.get("subject") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const deliverableId = String(form.get("deliverable_id") ?? "").trim() || undefined;
  const includeChecklist = form.get("include_checklist") === "on";

  if (!subject || !body) {
    return NextResponse.json(
      { error: "Subject and message are required" },
      { status: 400 },
    );
  }

  const files = form
    .getAll("attachments")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  let messageResult;
  try {
    messageResult = await createProjectOutboundMessage({
      projectId: id,
      subject,
      body,
      deliverableId,
      files,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save message" },
      { status: 400 },
    );
  }

  if (deliverableId) {
    await markDeliverableSent(id, deliverableId);
  }

  const refreshed = (await getProject(id))!;
  const clientName = project.client_name ?? project.client_email.split("@")[0];

  const email = projectClientEmail({
    name: clientName,
    body,
    deliverables: includeChecklist ? refreshed.deliverables : undefined,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.INQUIRY_FROM ?? "creativekat <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      delivered: false,
      message: messageResult.message,
      attachments: messageResult.attachments,
      project: refreshed,
    });
  }

  const resendAttachments = await loadProjectAttachmentsForResend(
    messageResult.attachments,
  );

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [project.client_email],
      reply_to: TO,
      subject,
      html: email.html,
      text: email.text,
      attachments: resendAttachments.length ? resendAttachments : undefined,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[admin/project-send] Resend error", res.status, detail);
    return NextResponse.json(
      { error: "Message saved but email failed to send" },
      { status: 502 },
    );
  }

  const payload = (await res.json().catch(() => ({}))) as { id?: string };

  return NextResponse.json({
    ok: true,
    delivered: true,
    resendId: payload.id ?? null,
    message: messageResult.message,
    attachments: messageResult.attachments,
    project: await getProject(id),
  });
}
