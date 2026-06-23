export const LEAD_STATUSES = [
  "new",
  "open",
  "replied",
  "qualified",
  "won",
  "closed",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const PROJECT_STATUSES = [
  "lead",
  "discovery",
  "active",
  "review",
  "delivered",
  "archived",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type LeadSource = "inquiry" | "project-brief";

export type Lead = {
  id: string;
  source: LeadSource;
  name: string;
  email: string;
  company: string | null;
  topic: string | null;
  project_type: string | null;
  project_type_label: string | null;
  summary: string | null;
  message: string | null;
  raw_payload: string | null;
  status: LeadStatus;
  project_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Deliverable = {
  id: string;
  label: string;
  done: boolean;
  done_at?: string;
  sent_at?: string;
};

export type Project = {
  id: string;
  title: string;
  client_name: string | null;
  client_email: string | null;
  project_type: string | null;
  status: ProjectStatus;
  summary: string | null;
  notes: string | null;
  value: string | null;
  timeline: string | null;
  live_url: string | null;
  publish_to_site: boolean;
  slug: string | null;
  lead_id: string | null;
  deliverables: Deliverable[];
  created_at: string;
  updated_at: string;
};

export type ProjectMessage = {
  id: string;
  project_id: string;
  subject: string;
  body: string;
  deliverable_id: string | null;
  resend_id: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  lead_id: string;
  direction: "inbound" | "outbound";
  subject: string;
  body: string;
  resend_id: string | null;
  created_at: string;
};

export type Attachment = {
  id: string;
  message_id: string;
  filename: string;
  content_type: string | null;
  size: number | null;
  storage_path: string;
  created_at: string;
};

export type LeadWithMeta = Lead & {
  message_count: number;
  last_message_at: string | null;
};
