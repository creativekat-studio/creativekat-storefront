import { notFound } from "next/navigation";
import MilestoneCompletionGenerator from "@/components/admin/MilestoneCompletionGenerator";
import { getProject } from "@/lib/crm/projects";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectMilestonePage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return <MilestoneCompletionGenerator project={project} />;
}
