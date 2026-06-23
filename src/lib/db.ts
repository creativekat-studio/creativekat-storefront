import { createClient, type Client } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

let client: Client | null = null;
let migrated = false;

function getDbUrl(): string {
  if (process.env.TURSO_DATABASE_URL) {
    return process.env.TURSO_DATABASE_URL;
  }
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return `file:${path.join(dir, "crm.sqlite")}`;
}

function getAuthToken(): string | undefined {
  return process.env.TURSO_AUTH_TOKEN;
}

export function getDb(): Client {
  if (!client) {
    client = createClient({
      url: getDbUrl(),
      authToken: getAuthToken(),
    });
  }
  if (!migrated) {
    runMigrations(client);
    migrated = true;
  }
  return client;
}

function runMigrations(db: Client) {
  db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      client_name TEXT,
      client_email TEXT,
      project_type TEXT,
      status TEXT NOT NULL DEFAULT 'lead',
      summary TEXT,
      notes TEXT,
      value TEXT,
      timeline TEXT,
      live_url TEXT,
      publish_to_site INTEGER NOT NULL DEFAULT 0,
      slug TEXT,
      lead_id TEXT,
      deliverables TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      topic TEXT,
      project_type TEXT,
      project_type_label TEXT,
      summary TEXT,
      message TEXT,
      raw_payload TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      project_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      direction TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      resend_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      content_type TEXT,
      size INTEGER,
      storage_path TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (message_id) REFERENCES messages(id)
    );

    CREATE TABLE IF NOT EXISTS project_messages (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      deliverable_id TEXT,
      resend_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS project_attachments (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      content_type TEXT,
      size INTEGER,
      storage_path TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (message_id) REFERENCES project_messages(id)
    );

    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_messages_lead ON messages(lead_id);
    CREATE INDEX IF NOT EXISTS idx_project_messages_project ON project_messages(project_id);
  `);
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}
