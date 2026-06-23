import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getAttachmentFile } from "@/lib/crm/messages";
import { getProjectAttachmentFile } from "@/lib/crm/projectMessages";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let file =
    (await getAttachmentFile(id)) ?? (await getProjectAttachmentFile(id));

  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.attachment.content_type ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${file.attachment.filename.replace(/"/g, "")}"`,
      "Content-Length": String(file.buffer.length),
    },
  });
}
