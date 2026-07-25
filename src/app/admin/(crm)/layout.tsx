import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import DbSetupRequired from "@/components/admin/DbSetupRequired";
import { isAuthenticated } from "@/lib/auth";
import { DbConfigError, getDb } from "@/lib/db";

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  try {
    await getDb();
  } catch (err) {
    if (err instanceof DbConfigError) {
      return (
        <>
          <AdminNav />
          <div className="mx-auto max-w-6xl px-6 py-8">
            <DbSetupRequired message={err.message} />
          </div>
        </>
      );
    }
    throw err;
  }

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </>
  );
}
