export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[var(--background)]">{children}</div>;
}
