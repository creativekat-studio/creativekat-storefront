import { getDb, newId, nowIso } from "@/lib/db";
import {
  defaultDeliverables,
  parseDeliverables,
} from "@/lib/crm/deliverables";
import { todayLocalDate } from "@/lib/crm/format";
import type { Deliverable, Project, ProjectStatus } from "@/lib/crm/types";

function rowToProject(row: Record<string, unknown>): Project {
  const deliverables = parseDeliverables(
    row.deliverables ? String(row.deliverables) : null,
  );

  return {
    id: String(row.id),
    title: String(row.title),
    client_name: row.client_name ? String(row.client_name) : null,
    client_email: row.client_email ? String(row.client_email) : null,
    project_type: row.project_type ? String(row.project_type) : null,
    status: row.status as ProjectStatus,
    summary: row.summary ? String(row.summary) : null,
    notes: row.notes ? String(row.notes) : null,
    value: row.value ? String(row.value) : null,
    timeline: row.timeline ? String(row.timeline) : null,
    live_url: row.live_url ? String(row.live_url) : null,
    publish_to_site: Boolean(row.publish_to_site),
    slug: row.slug ? String(row.slug) : null,
    lead_id: row.lead_id ? String(row.lead_id) : null,
    deliverables:
      deliverables.length > 0
        ? deliverables
        : defaultDeliverables(
            row.project_type ? String(row.project_type) : null,
          ),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export type CreateProjectInput = {
  title: string;
  client_name?: string;
  client_email?: string;
  project_type?: string;
  status?: ProjectStatus;
  summary?: string;
  notes?: string;
  value?: string;
  timeline?: string;
  live_url?: string;
  publish_to_site?: boolean;
  slug?: string;
  lead_id?: string;
};

export type UpdateProjectInput = Partial<CreateProjectInput>;

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const db = getDb();
  const id = newId();
  const ts = nowIso();
  const deliverables = defaultDeliverables(input.project_type);

  await db.execute({
    sql: `INSERT INTO projects (
      id, title, client_name, client_email, project_type, status, summary, notes,
      value, timeline, live_url, publish_to_site, slug, lead_id, deliverables,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.title,
      input.client_name ?? null,
      input.client_email ?? null,
      input.project_type ?? null,
      input.status ?? "lead",
      input.summary ?? null,
      input.notes ?? null,
      input.value ?? null,
      input.timeline ?? null,
      input.live_url ?? null,
      input.publish_to_site ? 1 : 0,
      input.slug ?? null,
      input.lead_id ?? null,
      JSON.stringify(deliverables),
      ts,
      ts,
    ],
  });

  if (input.lead_id) {
    await db.execute({
      sql: "UPDATE leads SET project_id = ?, updated_at = ? WHERE id = ?",
      args: [id, ts, input.lead_id],
    });
  }

  return (await getProject(id))!;
}

export async function listProjects(
  status?: ProjectStatus,
): Promise<Project[]> {
  const db = getDb();
  const sql = status
    ? "SELECT * FROM projects WHERE status = ? ORDER BY updated_at DESC"
    : "SELECT * FROM projects ORDER BY updated_at DESC";

  const result = await db.execute({
    sql,
    args: status ? [status] : [],
  });

  return result.rows.map(rowToProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM projects WHERE id = ?",
    args: [id],
  });
  if (!result.rows.length) return null;
  return rowToProject(result.rows[0]);
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput,
): Promise<Project | null> {
  const existing = await getProject(id);
  if (!existing) return null;

  const merged = {
    title: input.title ?? existing.title,
    client_name: input.client_name ?? existing.client_name ?? undefined,
    client_email: input.client_email ?? existing.client_email ?? undefined,
    project_type: input.project_type ?? existing.project_type ?? undefined,
    status: input.status ?? existing.status,
    summary: input.summary ?? existing.summary ?? undefined,
    notes: input.notes ?? existing.notes ?? undefined,
    value: input.value ?? existing.value ?? undefined,
    timeline: input.timeline ?? existing.timeline ?? undefined,
    live_url: input.live_url ?? existing.live_url ?? undefined,
    publish_to_site: input.publish_to_site ?? existing.publish_to_site,
    slug: input.slug ?? existing.slug ?? undefined,
    lead_id: input.lead_id ?? existing.lead_id ?? undefined,
  };

  const db = getDb();
  const ts = nowIso();

  await db.execute({
    sql: `UPDATE projects SET
      title = ?, client_name = ?, client_email = ?, project_type = ?, status = ?,
      summary = ?, notes = ?, value = ?, timeline = ?, live_url = ?,
      publish_to_site = ?, slug = ?, lead_id = ?, updated_at = ?
      WHERE id = ?`,
    args: [
      merged.title,
      merged.client_name ?? null,
      merged.client_email ?? null,
      merged.project_type ?? null,
      merged.status,
      merged.summary ?? null,
      merged.notes ?? null,
      merged.value ?? null,
      merged.timeline ?? null,
      merged.live_url ?? null,
      merged.publish_to_site ? 1 : 0,
      merged.slug ?? null,
      merged.lead_id ?? null,
      ts,
      id,
    ],
  });

  return getProject(id);
}

export async function updateProjectDeliverables(
  id: string,
  deliverables: Deliverable[],
): Promise<Project | null> {
  const existing = await getProject(id);
  if (!existing) return null;

  const db = getDb();
  const ts = nowIso();

  await db.execute({
    sql: "UPDATE projects SET deliverables = ?, updated_at = ? WHERE id = ?",
    args: [JSON.stringify(deliverables), ts, id],
  });

  return getProject(id);
}

export async function markDeliverableSent(
  projectId: string,
  deliverableId: string,
): Promise<Project | null> {
  const project = await getProject(projectId);
  if (!project) return null;

  const ts = todayLocalDate();
  const deliverables = project.deliverables.map((d) =>
    d.id === deliverableId ? { ...d, sent_at: d.sent_at ?? ts } : d,
  );

  return updateProjectDeliverables(projectId, deliverables);
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = getDb();
  const result = await db.execute({
    sql: "DELETE FROM projects WHERE id = ?",
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}

export async function countProjectsByStatus(): Promise<Record<string, number>> {
  const db = getDb();
  const result = await db.execute(
    "SELECT status, COUNT(*) AS count FROM projects GROUP BY status",
  );
  const counts: Record<string, number> = {};
  for (const row of result.rows) {
    counts[String(row.status)] = Number(row.count);
  }
  return counts;
}

export async function countActiveProjects(): Promise<number> {
  const db = getDb();
  const result = await db.execute(
    "SELECT COUNT(*) AS count FROM projects WHERE status IN ('discovery', 'active', 'review')",
  );
  return Number(result.rows[0]?.count ?? 0);
}
