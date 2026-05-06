import { NextResponse } from "next/server";
import { autoReply, teamNotification } from "@/lib/email";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  topic?: string;
  message?: string;
  website?: string;
};

const TO = "hello@creativekat.studio";

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // honeypot — silently accept
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const fields = {
    name,
    email,
    company: body.company?.trim() || undefined,
    topic: body.topic?.trim() || "general",
    message,
  };

  // Inbox-friendly subject: [topic] Name — creativekat inquiry
  const subject = `[${fields.topic}] ${name} — creativekat inquiry`;
  const team = teamNotification(fields);
  const reply = autoReply(fields);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM ?? "creativekat <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      "[inquiry] RESEND_API_KEY not set — logging instead of sending.",
    );
    console.log({ to: TO, subject, text: team.text });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [TO],
      reply_to: email,
      subject,
      html: team.html,
      text: team.text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[inquiry] Resend error", res.status, detail);
    return NextResponse.json(
      { error: "Could not send right now — please email us directly." },
      { status: 502 },
    );
  }

  // Auto-reply to the submitter. Best-effort — failure here doesn't fail the inquiry.
  fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      reply_to: TO,
      subject: "We got your note — creativekat studio",
      html: reply.html,
      text: reply.text,
    }),
  }).catch((err) => console.error("[inquiry] auto-reply failed", err));

  return NextResponse.json({ ok: true, delivered: true });
}
