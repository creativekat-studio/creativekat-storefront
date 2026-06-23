"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/projects");
      router.refresh();
    } catch {
      alert("Could not delete project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
    >
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
