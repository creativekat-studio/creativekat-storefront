import type { Deliverable, Project } from "@/lib/crm/types";
import { todayLocalDate } from "@/lib/crm/format";

export const DELIVERABLE_STATUSES = [
  "Completed",
  "Ongoing",
  "Pending",
  "Not started",
] as const;

export type DeliverableStatus = (typeof DELIVERABLE_STATUSES)[number];

export type MilestoneDeliverableRow = {
  id: string;
  label: string;
  status: DeliverableStatus;
};

export type MilestonePendingItem = {
  id: string;
  label: string;
  responsible: string;
};

export type MilestoneCompletionDraft = {
  phaseLabel: string;
  documentDate: string;
  projectTitle: string;
  clientName: string;
  clientRepresentative: string;
  developerName: string;
  developerRepresentative: string;
  statusSummary: string;
  deliverables: MilestoneDeliverableRow[];
  pendingItems: MilestonePendingItem[];
  paymentAmount: string;
  paymentNote: string;
  nextStepsNote: string;
};

function deliverableStatus(done: boolean): DeliverableStatus {
  return done ? "Completed" : "Ongoing";
}

function defaultPendingItems(clientName: string): MilestonePendingItem[] {
  const client = clientName.trim() || "Client";
  return [
    {
      id: "refinements",
      label: "Final refinements and adjustments",
      responsible: "creativekat.studio",
    },
    {
      id: "testing",
      label: "Additional testing and end-to-end quality checks",
      responsible: "Both parties",
    },
    {
      id: "third_party_services",
      label: "Third-party services",
      responsible: "creativekat.studio",
    },
    {
      id: "third_party_costs",
      label: "Third-party costs",
      responsible: client,
    },
    {
      id: "domain",
      label: "Domain access & control (required to deploy the website to the live domain)",
      responsible: client,
    },
    {
      id: "go_live",
      label: "Go-live deployment",
      responsible: "creativekat.studio",
    },
    {
      id: "final_review",
      label: "Final client review and approval",
      responsible: client,
    },
  ];
}

export function draftFromProject(
  project: Project,
  options?: { phaseLabel?: string },
): MilestoneCompletionDraft {
  const phaseLabel = options?.phaseLabel ?? "Phase 1";
  const clientName = project.client_name?.trim() || "";
  const projectTitle = project.title;

  return {
    phaseLabel,
    documentDate: todayLocalDate(),
    projectTitle,
    clientName,
    clientRepresentative: "",
    developerName: "creativekat.studio",
    developerRepresentative: "Ann Mantele",
    statusSummary: `${phaseLabel} of the ${projectTitle} project has reached the milestone completion stage based on the agreed project scope and deliverables. This document summarizes the completed items, remaining tasks and next steps for project continuation.`,
    deliverables: project.deliverables.map((d: Deliverable) => ({
      id: d.id,
      label: d.label,
      status: deliverableStatus(d.done),
    })),
    pendingItems: defaultPendingItems(clientName),
    paymentAmount: project.value?.trim() || "",
    paymentNote: `Based on the agreed payment schedule, the ${phaseLabel} Milestone payment is now due upon completion of development and testing on the preview URL.`,
    nextStepsNote:
      "The project will continue progressing towards the final launch preparation.",
  };
}

export function formatDocumentDate(yyyyMmDd: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return yyyyMmDd;
  const date = new Date(`${yyyyMmDd}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function documentFilename(draft: MilestoneCompletionDraft): string {
  const phase = draft.phaseLabel.replace(/\s+/g, " ").trim() || "Phase";
  const title = draft.projectTitle.replace(/\s+/g, " ").trim() || "Project";
  return `${phase.toUpperCase()} COMPLETION - ${title}.pdf`;
}
