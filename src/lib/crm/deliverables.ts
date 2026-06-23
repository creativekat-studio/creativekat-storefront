import type { Deliverable } from "@/lib/crm/types";

const STANDARD_DEFAULTS: Omit<Deliverable, "done" | "done_at" | "sent_at">[] = [
  { id: "client_deliverables", label: "Client deliverables" },
  { id: "proposal", label: "Project proposal" },
  { id: "signed_service_agreement", label: "Signed service agreement" },
  { id: "initial_payment", label: "Initial payment" },
  { id: "phase1_payment", label: "Phase 1 payment" },
  { id: "phase2_payment", label: "Phase 2 payment" },
  { id: "sign_off", label: "Sign off" },
];

export function defaultDeliverables(_projectType?: string | null): Deliverable[] {
  return STANDARD_DEFAULTS.map((item) => ({ ...item, done: false }));
}

export function parseDeliverables(raw: string | null | undefined): Deliverable[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Deliverable[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((d) => d.id && d.label);
  } catch {
    return [];
  }
}

export function deliverablesProgress(items: Deliverable[]): {
  done: number;
  total: number;
} {
  return {
    done: items.filter((d) => d.done).length,
    total: items.length,
  };
}

export const EMAIL_TEMPLATES: Record<
  string,
  { subject: string; body: string; deliverableId?: string }
> = {
  proposal: {
    deliverableId: "proposal",
    subject: "Project proposal — {project}",
    body: `Please find attached the project proposal for {project}. It covers scope, timeline, and payment schedule.

Review when you have a moment — happy to walk through anything on a quick call. Once you're ready, I'll send the service agreement for signing.

Best,
creativekat studio`,
  },
  agreement: {
    subject: "Service agreement — {project}",
    body: `Attached is the service agreement for {project}. Please review, sign, and return when ready — along with the initial payment to kick off work.

If anything needs adjusting before signing, just reply here.

Best,
creativekat studio`,
  },
};

export function fillEmailTemplate(
  template: string,
  vars: { project: string; client: string },
): string {
  return template
    .replaceAll("{project}", vars.project)
    .replaceAll("{client}", vars.client);
}
