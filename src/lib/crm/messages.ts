import fs from "node:fs/promises";
import path from "node:path";
import { getDb, newId, nowIso } from "@/lib/db";
import type { Attachment, Message } from "@/lib/crm/types";

const ATTACHMENTS_DIR = path.join(process.cwd(), "data", "attachments");
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

function rowToMessage(row: Record<string, unknown>): Message {
  return {
    id: String(row.id),
    lead_id: String(row.lead_id),
    direction: row.direction as Message["direction"],
    subject: String(row.subject),
    body: String(row.body),
    resend_id: row.resend_id ? String(row.resend_id) : null,
    created_at: String(row.created_at),
  };
}

function rowToAttachment(row: Record<string, unknown>): Attachment {
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

export type StoredAttachment = {
  id: string;
  filename: string;
  content_type: string | null;
  size: number;
  storage_path: string;
  base64: string;
};

export async function listMessagesForLead(leadId: string): Promise<Message[]> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM messages WHERE lead_id = ? ORDER BY created_at ASC",
    args: [leadId],
  });
  return result.rows.map(rowToMessage);
}

export async function listAttachmentsForMessage(
  messageId: string,
): Promise<Attachment[]> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM attachments WHERE message_id = ? ORDER BY created_at ASC",
    args: [messageId],
  });
  return result.rows.map(rowToAttachment);
}

export async function createOutboundMessage(input: {
  leadId: string;
  subject: string;
  body: string;
  resendId?: string;
  files?: File[];
}): Promise<{ message: Message; attachments: Attachment[] }> {
  const db = getDb();
  const messageId = newId();
  const ts = nowIso();

  await db.execute({
    sql: `INSERT INTO messages (id, lead_id, direction, subject, body, resend_id, created_at)
          VALUES (?, ?, 'outbound', ?, ?, ?, ?)`,
    args: [
      messageId,
      input.leadId,
      input.subject,
      input.body,
      input.resendId ?? null,
      ts,
    ],
  });

  const attachments: Attachment[] = [];
  if (input.files?.length) {
    await fs.mkdir(ATTACHMENTS_DIR, { recursive: true });

    for (const file of input.files) {
      if (file.size > MAX_ATTACHMENT_BYTES) {
        throw new Error(`${file.name} exceeds the 10MB limit`);
      }

      const attachmentId = newId();
      const safeName = file.name.replace(/[^\w.\-() ]+/g, "_");
      const storagePath = path.join(ATTACHMENTS_DIR, `${attachmentId}-${safeName}`);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(storagePath, buffer);

      await db.execute({
        sql: `INSERT INTO attachments (id, message_id, filename, content_type, size, storage_path, created_at)
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

  await db.execute({
    sql: "UPDATE leads SET status = 'replied', updated_at = ? WHERE id = ? AND status = 'new'",
    args: [ts, input.leadId],
  });

  await db.execute({
    sql: "UPDATE leads SET updated_at = ? WHERE id = ?",
    args: [ts, input.leadId],
  });

  const message = (await db.execute({
    sql: "SELECT * FROM messages WHERE id = ?",
    args: [messageId],
  })).rows[0];

  return {
    message: rowToMessage(message),
    attachments,
  };
}

export async function loadAttachmentsForResend(
  attachments: Attachment[],
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

export async function getAttachmentFile(
  attachmentId: string,
): Promise<{ attachment: Attachment; buffer: Buffer } | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM attachments WHERE id = ?",
    args: [attachmentId],
  });
  if (!result.rows.length) return null;

  const attachment = rowToAttachment(result.rows[0]);
  const buffer = await fs.readFile(attachment.storage_path);
  return { attachment, buffer };
}
