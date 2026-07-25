export default function DbSetupRequired({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
      <p className="font-mono text-[11px] uppercase tracking-widest text-amber-700 dark:text-amber-300">
        — Database setup
      </p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">
        CRM database not configured
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
        <li>
          Create a free database at{" "}
          <a
            href="https://turso.tech"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            turso.tech
          </a>
        </li>
        <li>
          Copy <code className="text-xs">TURSO_DATABASE_URL</code> and{" "}
          <code className="text-xs">TURSO_AUTH_TOKEN</code>
        </li>
        <li>Add both to Vercel → Project → Settings → Environment Variables</li>
        <li>Redeploy the site</li>
      </ol>
    </div>
  );
}
