import { createClient, type Client } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

let clientPromise: Promise<Client> | null = null;

export class DbConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DbConfigError";
  }
}

function getDbUrl(): string {
  if (process.env.TURSO_DATABASE_URL) {
    return process.env.TURSO_DATABASE_URL;
  }

  if (process.env.VERCEL === "1") {
    throw new DbConfigError(
      "Production needs a Turso database. Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to your Vercel environment variables, then redeploy.",
    );
  }

  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return `file:${path.join(dir, "crm.sqlite")}`;
}

function getAuthToken(): string | undefined {
  return process.env.TURSO_AUTH_TOKEN;
}

export function getDataDir(): string {
  if (process.env.TURSO_DATABASE_URL || process.env.VERCEL === "1") {
    return path.join("/tmp", "creativekat-crm");
  }
  return path.join(process.cwd(), "data");
}

export async function getDb(): Promise<Client> {
  if (!clientPromise) {
    clientPromise = initDb();
  }
  return clientPromise;
}

async function initDb(): Promise<Client> {
  const client = createClient({
    url: getDbUrl(),
    authToken: getAuthToken(),
  });

  await client.executeMultiple(`
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

    CREATE TABLE IF NOT EXISTS milestone_documents (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      phase_label TEXT NOT NULL,
      document_date TEXT NOT NULL,
      title TEXT NOT NULL,
      draft_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );

    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_messages_lead ON messages(lead_id);
    CREATE INDEX IF NOT EXISTS idx_project_messages_project ON project_messages(project_id);
    CREATE INDEX IF NOT EXISTS idx_milestone_documents_project ON milestone_documents(project_id);
  `);

  return client;
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}
