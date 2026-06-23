// Shared email templates. Inline styles only — email clients (Outlook
// especially) strip <style> tags and stylesheets.

const BRAND = {
  gradient: "linear-gradient(135deg, #6d28d9, #4f46e5, #2563eb)",
  text: "#1a1820",
  muted: "#6b7280",
  border: "#e7e5e4",
  surface: "#ffffff",
  bg: "#fafaf9",
  site: "https://creativekat.studio",
};

function shell(inner: string, preheader: string): string {
  // preheader = the inbox preview line; hidden in the body
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>creativekat studio</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${BRAND.text};">
  <span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;color:${BRAND.bg};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:${BRAND.surface};padding:24px 32px;border-bottom:1px solid ${BRAND.border};">
              <a href="${BRAND.site}" style="text-decoration:none;color:${BRAND.text};">
                <img src="${BRAND.site}/creativekat-studio-light.png"
                     width="180" height="30"
                     alt="creativekat.studio"
                     style="display:block;border:0;outline:none;text-decoration:none;height:30px;width:auto;max-width:220px;" />
              </a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 8px 32px;font-size:16px;line-height:1.6;color:${BRAND.text};">
              ${inner}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 28px 32px;border-top:1px solid ${BRAND.border};font-size:12px;line-height:1.6;color:${BRAND.muted};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.muted};">est. 2026 — small, careful digital products.</td>
                </tr>
                <tr>
                  <td style="padding-top:8px;">
                    <a href="https://creativekat.studio" style="color:${BRAND.muted};text-decoration:none;">creativekat.studio</a>
                    &nbsp;·&nbsp;
                    <a href="mailto:hello@creativekat.studio" style="color:${BRAND.muted};text-decoration:none;">hello@creativekat.studio</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nl2br(s: string): string {
  return escapeHtml(s).replaceAll("\n", "<br />");
}

function formatBodyHtml(s: string): string {
  const paragraphs = escapeHtml(s.trim())
    .split(/\n{2,}/)
    .map((p) => p.replaceAll("\n", "<br />"))
    .filter(Boolean);

  if (!paragraphs.length) return "";

  return paragraphs
    .map(
      (p, i) =>
        `<p style="margin:0 0 ${i === paragraphs.length - 1 ? "0" : "10px"} 0;line-height:1.5;color:${BRAND.text};">${p}</p>`,
    )
    .join("");
}

function formatDeliverableDate(stored: string): string {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(stored)
    ? new Date(`${stored}T12:00:00`)
    : new Date(stored);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type ProjectBriefFields = {
  name: string;
  email: string;
  company?: string;
  link?: string;
  projectType: string;
  projectTypeLabel: string;
  summary: string;
  // Free-form record of all the conditional fields, rendered as a list.
  details: { label: string; value: string }[];
  timeline?: string;
  budget?: string;
  approver?: string;
  extras?: string;
};

export function projectBriefNotification(
  f: ProjectBriefFields,
): { html: string; text: string } {
  const detailRow = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:10px 18px;background:${BRAND.bg};border-bottom:1px solid ${BRAND.border};font-size:12px;color:${BRAND.muted};vertical-align:top;width:30%;">${escapeHtml(label)}</td><td style="padding:10px 18px;background:${BRAND.bg};border-bottom:1px solid ${BRAND.border};font-size:14px;color:${BRAND.text};vertical-align:top;">${nl2br(value)}</td></tr>`
      : "";

  const detailsHtml = f.details
    .filter((d) => d.value && d.value.trim())
    .map((d) => detailRow(d.label, d.value))
    .join("");

  const inner = `
    <p style="margin:0 0 4px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— New project brief</p>
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:600;line-height:1.3;color:${BRAND.text};">${escapeHtml(f.name)} — ${escapeHtml(f.projectTypeLabel)}</h1>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">${escapeHtml(f.summary)}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px 0;border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">
      ${detailRow("From", `<a href="mailto:${escapeHtml(f.email)}" style="color:${BRAND.text};text-decoration:none;">${escapeHtml(f.email)}</a>`)}
      ${f.company ? detailRow("Company / brand", escapeHtml(f.company)) : ""}
      ${f.link ? detailRow("Link", `<a href="${escapeHtml(f.link)}" style="color:${BRAND.text};text-decoration:none;">${escapeHtml(f.link)}</a>`) : ""}
      ${detailRow("Project type", escapeHtml(f.projectTypeLabel))}
    </table>

    ${
      detailsHtml
        ? `
    <p style="margin:0 0 8px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— Project details</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">${detailsHtml}</table>
    `
        : ""
    }

    <p style="margin:0 0 8px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— Logistics</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">
      ${detailRow("Timeline", f.timeline ? escapeHtml(f.timeline) : "")}
      ${detailRow("Budget", f.budget ? escapeHtml(f.budget) : "")}
      ${detailRow("Final approval", f.approver ? escapeHtml(f.approver) : "")}
      ${detailRow("Anything else", f.extras ? escapeHtml(f.extras) : "")}
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 8px 0;">
      <tr>
        <td style="background:${BRAND.gradient};border-radius:999px;">
          <a href="mailto:${escapeHtml(f.email)}?subject=${encodeURIComponent(`Re: your ${f.projectTypeLabel.toLowerCase()} brief — creativekat studio`)}"
             style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;">
            Reply to ${escapeHtml(f.name.split(" ")[0])} →
          </a>
        </td>
      </tr>
    </table>
  `;

  const lines = [
    `New project brief — ${f.name} (${f.projectTypeLabel})`,
    "",
    `From: ${f.email}`,
    f.company ? `Company: ${f.company}` : null,
    f.link ? `Link: ${f.link}` : null,
    `Project type: ${f.projectTypeLabel}`,
    "",
    "Summary:",
    f.summary,
    "",
  ];

  if (f.details.length) {
    lines.push("Project details:");
    for (const d of f.details) {
      if (d.value && d.value.trim()) lines.push(`  ${d.label}: ${d.value}`);
    }
    lines.push("");
  }

  lines.push("Logistics:");
  if (f.timeline) lines.push(`  Timeline: ${f.timeline}`);
  if (f.budget) lines.push(`  Budget: ${f.budget}`);
  if (f.approver) lines.push(`  Final approval: ${f.approver}`);
  if (f.extras) lines.push(`  Anything else: ${f.extras}`);

  return {
    html: shell(inner, `New project brief from ${f.name} — ${f.projectTypeLabel}`),
    text: lines.filter((l) => l !== null).join("\n"),
  };
}

export function projectBriefAutoReply(
  f: ProjectBriefFields,
): { html: string; text: string } {
  const firstName = f.name.split(" ")[0];

  const inner = `
    <p style="margin:0 0 4px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— Brief received</p>
    <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:600;line-height:1.3;color:${BRAND.text};">Thanks, ${escapeHtml(firstName)} — got your brief.</h1>

    <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:${BRAND.text};">
      We&apos;ll read it carefully and reply within <strong>1–3 business days</strong>
      with next steps and a tailored discovery doc.
    </p>
    <p style="margin:0 0 24px 0;font-size:16px;line-height:1.7;color:${BRAND.text};">
      If anything else surfaces in the meantime, just reply to this thread.
    </p>

    <p style="margin:0 0 8px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— Your summary</p>
    <div style="margin:0 0 8px 0;padding:14px 16px;background:${BRAND.bg};border:1px solid ${BRAND.border};border-radius:10px;font-size:14px;line-height:1.7;color:${BRAND.muted};white-space:pre-wrap;">${nl2br(f.summary)}</div>
  `;

  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for sending the brief — we'll read it carefully and reply within 1–3 business days with next steps and a tailored discovery doc.",
    "",
    "If anything else surfaces in the meantime, just reply to this thread.",
    "",
    "Your summary:",
    f.summary,
    "",
    "—",
    "creativekat.studio",
    "hello@creativekat.studio",
  ].join("\n");

  return {
    html: shell(
      inner,
      `Thanks ${firstName} — got your brief, we'll reply within 1–3 business days.`,
    ),
    text,
  };
}

export type InquiryFields = {
  name: string;
  email: string;
  company?: string;
  topic: string;
  message: string;
};

export function teamNotification(f: InquiryFields): { html: string; text: string } {
  const inner = `
    <p style="margin:0 0 4px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— New inquiry</p>
    <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:600;line-height:1.3;color:${BRAND.text};">${escapeHtml(f.name)} sent a note.</h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 24px 0;border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:14px 18px;background:${BRAND.bg};border-bottom:1px solid ${BRAND.border};">
          <table role="presentation" width="100%"><tr>
            <td style="font-size:12px;color:${BRAND.muted};">From</td>
            <td align="right" style="font-size:14px;color:${BRAND.text};">
              <a href="mailto:${escapeHtml(f.email)}" style="color:${BRAND.text};text-decoration:none;">${escapeHtml(f.email)}</a>
            </td>
          </tr></table>
        </td>
      </tr>
      ${f.company ? `<tr>
        <td style="padding:14px 18px;background:${BRAND.bg};border-bottom:1px solid ${BRAND.border};">
          <table role="presentation" width="100%"><tr>
            <td style="font-size:12px;color:${BRAND.muted};">Company / project</td>
            <td align="right" style="font-size:14px;color:${BRAND.text};">${escapeHtml(f.company)}</td>
          </tr></table>
        </td>
      </tr>` : ""}
      <tr>
        <td style="padding:14px 18px;background:${BRAND.bg};">
          <table role="presentation" width="100%"><tr>
            <td style="font-size:12px;color:${BRAND.muted};">Topic</td>
            <td align="right" style="font-size:14px;color:${BRAND.text};">${escapeHtml(f.topic)}</td>
          </tr></table>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— Message</p>
    <div style="font-size:15px;line-height:1.7;color:${BRAND.text};white-space:pre-wrap;">${nl2br(f.message)}</div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px 0;">
      <tr>
        <td style="background:${BRAND.gradient};border-radius:999px;">
          <a href="mailto:${escapeHtml(f.email)}?subject=${encodeURIComponent("Re: your note to creativekat studio")}"
             style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;">
            Reply to ${escapeHtml(f.name.split(" ")[0])} →
          </a>
        </td>
      </tr>
    </table>
  `;

  const text = [
    `New inquiry — ${f.name}`,
    "",
    `From: ${f.email}`,
    f.company ? `Company: ${f.company}` : null,
    `Topic: ${f.topic}`,
    "",
    "Message:",
    f.message,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    html: shell(inner, `New inquiry from ${f.name} — ${f.topic}`),
    text,
  };
}

export function autoReply(f: InquiryFields): { html: string; text: string } {
  const firstName = f.name.split(" ")[0];

  const inner = `
    <p style="margin:0 0 4px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— We got it</p>
    <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:600;line-height:1.3;color:${BRAND.text};">Thanks, ${escapeHtml(firstName)} — your note landed safely.</h1>

    <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:${BRAND.text};">
      We read every message that comes through here. Expect a reply within
      <strong>1–3 business days</strong>, usually sooner.
    </p>
    <p style="margin:0 0 24px 0;font-size:16px;line-height:1.7;color:${BRAND.text};">
      In the meantime, feel free to take a look around the studio:
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
      <tr>
        <td style="padding-right:8px;">
          <a href="https://disenio.studio" style="display:inline-block;padding:10px 16px;border:1px solid ${BRAND.border};border-radius:999px;font-size:14px;color:${BRAND.text};text-decoration:none;">disenio.studio ↗</a>
        </td>
        <td>
          <a href="https://creativekat.studio" style="display:inline-block;padding:10px 16px;border:1px solid ${BRAND.border};border-radius:999px;font-size:14px;color:${BRAND.text};text-decoration:none;">creativekat.studio ↗</a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— Your message</p>
    <div style="margin:0 0 8px 0;padding:14px 16px;background:${BRAND.bg};border:1px solid ${BRAND.border};border-radius:10px;font-size:14px;line-height:1.7;color:${BRAND.muted};white-space:pre-wrap;">${nl2br(f.message)}</div>

    <p style="margin:24px 0 0 0;font-size:14px;line-height:1.7;color:${BRAND.muted};">
      Just hit reply if you forgot to add something — this thread will route to us directly.
    </p>
  `;

  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for reaching out to creativekat studio — your note landed safely. We read every message and reply within 1–3 business days, usually sooner.",
    "",
    "For reference, here's what you sent:",
    "",
    f.message,
    "",
    "Just hit reply if you forgot to add something.",
    "",
    "—",
    "creativekat.studio",
    "hello@creativekat.studio",
  ].join("\n");

  return {
    html: shell(
      inner,
      `Thanks ${firstName} — we got your note and will reply within 1–3 business days.`,
    ),
    text,
  };
}

export function adminReplyEmail(input: {
  name: string;
  body: string;
}): { html: string; text: string } {
  const inner = `
    <p style="margin:0 0 4px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— Reply from creativekat</p>
    <div style="font-size:16px;color:${BRAND.text};">${formatBodyHtml(input.body)}</div>
    <p style="margin:16px 0 0 0;font-size:14px;line-height:1.5;color:${BRAND.muted};">
      Just reply to this thread if you have questions — it routes straight to us.
    </p>
  `;

  const text = [
    input.body,
    "",
    "—",
    "creativekat.studio",
    "hello@creativekat.studio",
  ].join("\n");

  return {
    html: shell(inner, `Reply from creativekat studio`),
    text,
  };
}

export function deliverablesChecklistBlock(
  items: { label: string; done: boolean; done_at?: string; sent_at?: string }[],
): { html: string; text: string } {
  function statusDate(item: (typeof items)[number]): string {
    if (item.done && item.done_at) return formatDeliverableDate(item.done_at);
    if (item.sent_at) return formatDeliverableDate(item.sent_at);
    return "—";
  }

  const rows = items
    .map((item) => {
      const mark = item.done ? "☑" : item.sent_at ? "◧" : "☐";
      const date = statusDate(item);
      return `<tr>
        <td style="padding:8px 0;font-size:15px;color:#1a1820;width:28px;vertical-align:top;">${mark}</td>
        <td style="padding:8px 0;font-size:15px;color:#1a1820;vertical-align:top;">${escapeHtml(item.label)}</td>
        <td style="padding:8px 0;font-size:12px;color:#6b7280;vertical-align:top;text-align:right;white-space:nowrap;">${escapeHtml(date)}</td>
      </tr>`;
    })
    .join("");

  const html = `
    <p style="margin:16px 0 8px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b7280;">— Deliverables</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e7e5e4;padding-top:8px;">
      ${rows}
    </table>
  `;

  const text = [
    "",
    "Deliverables:",
    ...items.map((item) => {
      const mark = item.done ? "[x]" : item.sent_at ? "[~]" : "[ ]";
      const date =
        item.done && item.done_at
          ? formatDeliverableDate(item.done_at)
          : item.sent_at
            ? formatDeliverableDate(item.sent_at)
            : "";
      return `  ${mark} ${item.label}${date ? ` — ${date}` : ""}`;
    }),
  ].join("\n");

  return { html, text };
}

export function projectClientEmail(input: {
  name: string;
  body: string;
  deliverables?: { label: string; done: boolean; done_at?: string; sent_at?: string }[];
}): { html: string; text: string } {
  const checklist = input.deliverables?.length
    ? deliverablesChecklistBlock(input.deliverables)
    : null;

  const inner = `
    <p style="margin:0 0 4px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.muted};">— creativekat studio</p>
    <div style="font-size:16px;color:${BRAND.text};">${formatBodyHtml(input.body)}</div>
    ${checklist?.html ?? ""}
    <p style="margin:16px 0 0 0;font-size:14px;line-height:1.5;color:${BRAND.muted};">
      Reply to this thread if you have questions — it routes straight to us.
    </p>
  `;

  const text = [
    input.body,
    checklist?.text ?? "",
    "",
    "—",
    "creativekat.studio",
    "hello@creativekat.studio",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    html: shell(inner, "Update from creativekat studio"),
    text,
  };
}
