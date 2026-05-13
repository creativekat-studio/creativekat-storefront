import { NextResponse } from "next/server";
import {
  projectBriefAutoReply,
  projectBriefNotification,
  type ProjectBriefFields,
} from "@/lib/email";

const TO = "hello@creativekat.studio";

const PROJECT_TYPE_LABELS: Record<string, string> = {
  logo: "Logo / brand identity",
  "brand-system": "Brand system",
  website: "Website / web app",
  shop: "Online shop / storefront",
  other: "Something else",
};

// Maps form field names → human-readable labels, grouped by project type.
const DETAIL_LABELS: Record<string, Record<string, string>> = {
  logo: {
    logo_business: "Business, in their words",
    logo_three_words: "Three words that describe the brand",
    logo_never_words: "Three words it should never be",
    logo_inspiration: "Brands admired",
    logo_uses: "Where the logo will live",
  },
  "brand-system": {
    bs_surfaces: "Surfaces",
    bs_existing: "What exists today",
    bs_team: "Team size",
  },
  website: {
    web_kind: "Type of site",
    web_features: "Key pages or features",
    web_existing: "Existing site (if redesign)",
    web_inspiration: "Sites admired",
  },
  shop: {
    shop_products: "What they're selling",
    shop_catalog: "Catalog size",
    shop_integrations: "Payments / shipping / integrations",
    shop_inspiration: "Shops admired",
  },
  other: {
    other_description: "Project description",
  },
};

type Payload = Record<string, string | undefined>;

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // honeypot
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const summary = body.summary?.trim();
  const projectType = body.projectType?.trim() ?? "other";

  if (!name || !email || !summary) {
    return NextResponse.json(
      { error: "Name, email, and a one-sentence summary are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const projectTypeLabel =
    PROJECT_TYPE_LABELS[projectType] ?? "Something else";

  // Collect conditional details based on project type
  const labelMap = DETAIL_LABELS[projectType] ?? {};
  const details = Object.entries(labelMap)
    .map(([key, label]) => ({
      label,
      value: (body[key] ?? "").trim(),
    }))
    .filter((d) => d.value);

  const fields: ProjectBriefFields = {
    name,
    email,
    company: body.company?.trim() || undefined,
    link: body.link?.trim() || undefined,
    projectType,
    projectTypeLabel,
    summary,
    details,
    timeline: body.timeline?.trim() || undefined,
    budget: body.budget?.trim() || undefined,
    approver: body.approver?.trim() || undefined,
    extras: body.extras?.trim() || undefined,
  };

  const subject = `[brief · ${projectTypeLabel}] ${name} — creativekat`;
  const team = projectBriefNotification(fields);
  const reply = projectBriefAutoReply(fields);

  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.INQUIRY_FROM ?? "creativekat <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      "[project-brief] RESEND_API_KEY not set — logging instead of sending.",
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
    console.error("[project-brief] Resend error", res.status, detail);
    return NextResponse.json(
      { error: "Could not send right now — please email us directly." },
      { status: 502 },
    );
  }

  // Auto-reply (best-effort)
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
      subject: "We got your brief — creativekat studio",
      html: reply.html,
      text: reply.text,
    }),
  }).catch((err) =>
    console.error("[project-brief] auto-reply failed", err),
  );

  return NextResponse.json({ ok: true, delivered: true });
}
