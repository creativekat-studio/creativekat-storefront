import { getDb, newId, nowIso } from "@/lib/db";
import type { MilestoneCompletionDraft } from "@/lib/crm/milestoneCompletion";

export type MilestoneDocumentRecord = {
  id: string;
  project_id: string;
  phase_label: string;
  document_date: string;
  title: string;
  draft: MilestoneCompletionDraft;
  created_at: string;
  updated_at: string;
};

export type MilestoneDocumentSummary = {
  id: string;
  project_id: string;
  phase_label: string;
  document_date: string;
  title: string;
  created_at: string;
  updated_at: string;
};

function parseDraft(raw: string): MilestoneCompletionDraft {
  return JSON.parse(raw) as MilestoneCompletionDraft;
}

function rowToRecord(row: Record<string, unknown>): MilestoneDocumentRecord {
  return {
    id: String(row.id),
    project_id: String(row.project_id),
    phase_label: String(row.phase_label),
    document_date: String(row.document_date),
    title: String(row.title),
    draft: parseDraft(String(row.draft_json)),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function rowToSummary(row: Record<string, unknown>): MilestoneDocumentSummary {
  return {
    id: String(row.id),
    project_id: String(row.project_id),
    phase_label: String(row.phase_label),
    document_date: String(row.document_date),
    title: String(row.title),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function listMilestoneDocuments(
  projectId: string,
): Promise<MilestoneDocumentSummary[]> {
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT id, project_id, phase_label, document_date, title, created_at, updated_at
          FROM milestone_documents
          WHERE project_id = ?
          ORDER BY created_at DESC`,
    args: [projectId],
  });
  return result.rows.map(rowToSummary);
}

export async function getMilestoneDocument(
  id: string,
): Promise<MilestoneDocumentRecord | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT * FROM milestone_documents WHERE id = ?",
    args: [id],
  });
  if (!result.rows.length) return null;
  return rowToRecord(result.rows[0]);
}

export async function createMilestoneDocument(input: {
  projectId: string;
  draft: MilestoneCompletionDraft;
}): Promise<MilestoneDocumentRecord> {
  const db = await getDb();
  const id = newId();
  const ts = nowIso();
  const phase = input.draft.phaseLabel.trim() || "Phase 1";
  const title = input.draft.projectTitle.trim() || "Untitled project";
  const documentDate = input.draft.documentDate;

  await db.execute({
    sql: `INSERT INTO milestone_documents (
      id, project_id, phase_label, document_date, title, draft_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.projectId,
      phase,
      documentDate,
      title,
      JSON.stringify(input.draft),
      ts,
      ts,
    ],
  });

  return (await getMilestoneDocument(id))!;
}

export async function updateMilestoneDocument(
  id: string,
  draft: MilestoneCompletionDraft,
): Promise<MilestoneDocumentRecord | null> {
  const existing = await getMilestoneDocument(id);
  if (!existing) return null;

  const db = await getDb();
  const ts = nowIso();
  const phase = draft.phaseLabel.trim() || "Phase 1";
  const title = draft.projectTitle.trim() || "Untitled project";

  await db.execute({
    sql: `UPDATE milestone_documents SET
      phase_label = ?, document_date = ?, title = ?, draft_json = ?, updated_at = ?
      WHERE id = ?`,
    args: [phase, draft.documentDate, title, JSON.stringify(draft), ts, id],
  });

  return getMilestoneDocument(id);
}

export async function deleteMilestoneDocument(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.execute({
    sql: "DELETE FROM milestone_documents WHERE id = ?",
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}
