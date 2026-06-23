import Link from "next/link";
import { notFound } from "next/navigation";
import LeadReplyForm from "@/components/admin/LeadReplyForm";
import LeadStatusSelect from "@/components/admin/LeadStatusSelect";
import StatusBadge from "@/components/admin/StatusBadge";
import { getLead } from "@/lib/crm/leads";
import {
  listAttachmentsForMessage,
  listMessagesForLead,
} from "@/lib/crm/messages";
import { getProject } from "@/lib/crm/projects";
import { formatDateTime, leadSourceLabel } from "@/lib/crm/format";

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const messages = await listMessagesForLead(id);
  const messagesWithAttachments = await Promise.all(
    messages.map(async (message) => ({
      message,
      attachments: await listAttachmentsForMessage(message.id),
    })),
  );

  const project = lead.project_id ? await getProject(lead.project_id) : null;

  const defaultSubject =
    lead.source === "project-brief"
      ? `Re: your ${lead.project_type_label?.toLowerCase() ?? "project"} brief — creativekat studio`
      : "Re: your note to creativekat studio";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/admin/leads"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Back to inbox
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{lead.name}</h1>
          <p className="mt-2 text-[var(--muted)]">{lead.email}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge status={lead.status} />
            <LeadStatusSelect leadId={lead.id} status={lead.status} />
            <span className="text-sm text-[var(--muted)]">
              {leadSourceLabel(lead.source)} · {formatDateTime(lead.created_at)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/projects/new?lead=${lead.id}`}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm transition hover:border-violet-500/50"
          >
            Create project
          </Link>
          {project && (
            <Link
              href={`/admin/projects/${project.id}`}
              className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)]"
            >
              View project →
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
              — Original submission
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              {lead.company && (
                <Row label="Company" value={lead.company} />
              )}
              {lead.topic && <Row label="Topic" value={lead.topic} />}
              {lead.project_type_label && (
                <Row label="Project type" value={lead.project_type_label} />
              )}
              {lead.summary && <Row label="Summary" value={lead.summary} />}
            </dl>
            {lead.message && (
              <pre className="mt-5 whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm leading-relaxed text-[var(--muted)]">
                {lead.message}
              </pre>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
              — Thread
            </p>
            {messagesWithAttachments.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted)]">No replies sent yet.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {messagesWithAttachments.map(({ message, attachments }) => (
                  <li
                    key={message.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{message.subject}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {message.direction === "outbound" ? "You" : lead.name} ·{" "}
                          {formatDateTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm">{message.body}</p>
                    {attachments.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {attachments.map((att) => (
                          <li key={att.id}>
                            <a
                              href={`/api/admin/attachments/${att.id}`}
                              className="inline-flex rounded-full border border-[var(--border)] px-3 py-1 text-xs hover:border-violet-500/50"
                            >
                              {att.filename}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <LeadReplyForm
          leadId={lead.id}
          defaultSubject={defaultSubject}
          recipientName={lead.name.split(" ")[0]}
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}
