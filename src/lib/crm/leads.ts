import { getDb, newId, nowIso } from "@/lib/db";
import type {
  Lead,
  LeadSource,
  LeadStatus,
  LeadWithMeta,
} from "@/lib/crm/types";

function rowToLead(row: Record<string, unknown>): Lead {
  return {
    id: String(row.id),
    source: row.source as LeadSource,
    name: String(row.name),
    email: String(row.email),
    company: row.company ? String(row.company) : null,
    topic: row.topic ? String(row.topic) : null,
    project_type: row.project_type ? String(row.project_type) : null,
    project_type_label: row.project_type_label
      ? String(row.project_type_label)
      : null,
    summary: row.summary ? String(row.summary) : null,
    message: row.message ? String(row.message) : null,
    raw_payload: row.raw_payload ? String(row.raw_payload) : null,
    status: row.status as LeadStatus,
    project_id: row.project_id ? String(row.project_id) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export type CreateLeadInput = {
  source: LeadSource;
  name: string;
  email: string;
  company?: string;
  topic?: string;
  project_type?: string;
  project_type_label?: string;
  summary?: string;
  message?: string;
  raw_payload?: Record<string, unknown>;
};

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const db = getDb();
  const id = newId();
  const ts = nowIso();

  await db.execute({
    sql: `INSERT INTO leads (
      id, source, name, email, company, topic, project_type, project_type_label,
      summary, message, raw_payload, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`,
    args: [
      id,
      input.source,
      input.name,
      input.email,
      input.company ?? null,
      input.topic ?? null,
      input.project_type ?? null,
      input.project_type_label ?? null,
      input.summary ?? null,
      input.message ?? null,
      input.raw_payload ? JSON.stringify(input.raw_payload) : null,
      ts,
      ts,
    ],
  });

  return (await getLead(id))!;
}

export async function listLeads(status?: LeadStatus): Promise<LeadWithMeta[]> {
  const db = getDb();
  const sql = status
    ? `SELECT l.*,
        (SELECT COUNT(*) FROM messages m WHERE m.lead_id = l.id) AS message_count,
        (SELECT MAX(created_at) FROM messages m WHERE m.lead_id = l.id) AS last_message_at
       FROM leads l
       WHERE l.status = ?
       ORDER BY l.created_at DESC`
    : `SELECT l.*,
        (SELECT COUNT(*) FROM messages m WHERE m.lead_id = l.id) AS message_count,
        (SELECT MAX(created_at) FROM messages m WHERE m.lead_id = l.id) AS last_message_at
       FROM leads l
       ORDER BY l.created_at DESC`;

  const result = await db.execute({
    sql,
    args: status ? [status] : [],
  });

  return result.rows.map((row) => ({
    ...rowToLead(row),
    message_count: Number(row.message_count ?? 0),
    last_message_at: row.last_message_at ? String(row.last_message_at) : null,
  }));
}

export async function getLead(id: string): Promise<Lead | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM leads WHERE id = ?",
    args: [id],
  });
  if (!result.rows.length) return null;
  return rowToLead(result.rows[0]);
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<Lead | null> {
  const db = getDb();
  const ts = nowIso();
  await db.execute({
    sql: "UPDATE leads SET status = ?, updated_at = ? WHERE id = ?",
    args: [status, ts, id],
  });
  return getLead(id);
}

export async function linkLeadToProject(
  leadId: string,
  projectId: string,
): Promise<void> {
  const db = getDb();
  const ts = nowIso();
  await db.execute({
    sql: "UPDATE leads SET project_id = ?, status = 'won', updated_at = ? WHERE id = ?",
    args: [projectId, ts, leadId],
  });
}

export async function countLeadsByStatus(): Promise<Record<string, number>> {
  const db = getDb();
  const result = await db.execute(
    "SELECT status, COUNT(*) AS count FROM leads GROUP BY status",
  );
  const counts: Record<string, number> = {};
  for (const row of result.rows) {
    counts[String(row.status)] = Number(row.count);
  }
  return counts;
}

export async function countNewLeads(): Promise<number> {
  const db = getDb();
  const result = await db.execute(
    "SELECT COUNT(*) AS count FROM leads WHERE status = 'new'",
  );
  return Number(result.rows[0]?.count ?? 0);
}
