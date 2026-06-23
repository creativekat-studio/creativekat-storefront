import fs from "node:fs/promises";
import path from "node:path";
import { getDb, newId, nowIso } from "@/lib/db";
import type { ProjectMessage } from "@/lib/crm/types";

const ATTACHMENTS_DIR = path.join(process.cwd(), "data", "attachments");
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

function rowToMessage(row: Record<string, unknown>): ProjectMessage {
  return {
    id: String(row.id),
    project_id: String(row.project_id),
    subject: String(row.subject),
    body: String(row.body),
    deliverable_id: row.deliverable_id ? String(row.deliverable_id) : null,
    resend_id: row.resend_id ? String(row.resend_id) : null,
    created_at: String(row.created_at),
  };
}

export type ProjectAttachment = {
  id: string;
  message_id: string;
  filename: string;
  content_type: string | null;
  size: number | null;
  storage_path: string;
  created_at: string;
};

function rowToAttachment(row: Record<string, unknown>): ProjectAttachment {
  return {
    id: String(row.id),
    message_id: String(row.message_id),
    filename: String(row.filename),
    content_type: row.content_type ? String(row.content_type) : null,
    size: row.size != null ? Number(row.size) : null,
    storage_path: String(row.storage_path),
    created_at: String(row.created_at),
  };
}

export async function listProjectMessages(
  projectId: string,
): Promise<ProjectMessage[]> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM project_messages WHERE project_id = ? ORDER BY created_at ASC",
    args: [projectId],
  });
  return result.rows.map(rowToMessage);
}

export async function listProjectAttachments(
  messageId: string,
): Promise<ProjectAttachment[]> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM project_attachments WHERE message_id = ? ORDER BY created_at ASC",
    args: [messageId],
  });
  return result.rows.map(rowToAttachment);
}

export async function createProjectOutboundMessage(input: {
  projectId: string;
  subject: string;
  body: string;
  deliverableId?: string;
  resendId?: string;
  files?: File[];
}): Promise<{ message: ProjectMessage; attachments: ProjectAttachment[] }> {
  const db = getDb();
  const messageId = newId();
  const ts = nowIso();

  await db.execute({
    sql: `INSERT INTO project_messages (id, project_id, subject, body, deliverable_id, resend_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      messageId,
      input.projectId,
      input.subject,
      input.body,
      input.deliverableId ?? null,
      input.resendId ?? null,
      ts,
    ],
  });

  const attachments: ProjectAttachment[] = [];
  if (input.files?.length) {
    await fs.mkdir(ATTACHMENTS_DIR, { recursive: true });

    for (const file of input.files) {
      if (file.size > MAX_ATTACHMENT_BYTES) {
        throw new Error(`${file.name} exceeds the 10MB limit`);
      }

      const attachmentId = newId();
      const safeName = file.name.replace(/[^\w.\-() ]+/g, "_");
      const storagePath = path.join(
        ATTACHMENTS_DIR,
        `${attachmentId}-${safeName}`,
      );
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(storagePath, buffer);

      await db.execute({
        sql: `INSERT INTO project_attachments (id, message_id, filename, content_type, size, storage_path, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          attachmentId,
          messageId,
          file.name,
          file.type || null,
          file.size,
          storagePath,
          ts,
        ],
      });

      attachments.push({
        id: attachmentId,
        message_id: messageId,
        filename: file.name,
        content_type: file.type || null,
        size: file.size,
        storage_path: storagePath,
        created_at: ts,
      });
    }
  }

  const message = (
    await db.execute({
      sql: "SELECT * FROM project_messages WHERE id = ?",
      args: [messageId],
    })
  ).rows[0];

  return {
    message: rowToMessage(message),
    attachments,
  };
}

export async function loadProjectAttachmentsForResend(
  attachments: ProjectAttachment[],
): Promise<{ filename: string; content: string }[]> {
  const out: { filename: string; content: string }[] = [];
  for (const att of attachments) {
    const buffer = await fs.readFile(att.storage_path);
    out.push({
      filename: att.filename,
      content: buffer.toString("base64"),
    });
  }
  return out;
}

export async function getProjectAttachmentFile(
  attachmentId: string,
): Promise<{ attachment: ProjectAttachment; buffer: Buffer } | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM project_attachments WHERE id = ?",
    args: [attachmentId],
  });
  if (!result.rows.length) return null;

  const attachment = rowToAttachment(result.rows[0]);
  const buffer = await fs.readFile(attachment.storage_path);
  return { attachment, buffer };
}
