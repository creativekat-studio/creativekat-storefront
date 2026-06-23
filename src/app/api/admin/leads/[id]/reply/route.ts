import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getLead } from "@/lib/crm/leads";
import {
  createOutboundMessage,
  loadAttachmentsForResend,
} from "@/lib/crm/messages";
import { adminReplyEmail } from "@/lib/email";

const TO = "hello@creativekat.studio";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const form = await req.formData();
  const subject = String(form.get("subject") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();

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
    messageResult = await createOutboundMessage({
      leadId: id,
      subject,
      body,
      files,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save message" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.INQUIRY_FROM ?? "creativekat <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      delivered: false,
      message: messageResult.message,
      attachments: messageResult.attachments,
    });
  }

  const email = adminReplyEmail({ name: lead.name, body });
  const resendAttachments = await loadAttachmentsForResend(
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
      to: [lead.email],
      reply_to: TO,
      subject,
      html: email.html,
      text: email.text,
      attachments: resendAttachments.length ? resendAttachments : undefined,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[admin/reply] Resend error", res.status, detail);
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
  });
}
