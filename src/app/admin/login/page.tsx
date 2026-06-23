import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
        — Admin
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        creativekat <span className="brand-gradient">studio</span>
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Sign in to manage projects, inbox, and client replies.
      </p>
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <LoginForm />
      </div>
    </div>
  );
}
