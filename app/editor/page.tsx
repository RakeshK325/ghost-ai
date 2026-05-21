import { auth, currentUser } from "@clerk/nextjs/server";
import { getProjectsForUser } from "@/lib/projects";
import { EditorClient } from "./editor-client";

interface PageProps {
  searchParams: Promise<{ projectId?: string }>;
}

export default async function EditorPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const projectId = resolvedSearchParams?.projectId || null;

  const { userId } = await auth();
  
  let projects: any[] = [];
  if (userId) {
    const user = await currentUser();
    const emails = user?.emailAddresses.map((e) => e.emailAddress) || [];
    projects = await getProjectsForUser(userId, emails);
  }

  return (
    <EditorClient 
      initialProjects={projects} 
      activeProjectId={projectId} 
    />
  );
}
