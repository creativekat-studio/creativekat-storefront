import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { isAuthenticated } from "@/lib/auth";

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </>
  );
}
