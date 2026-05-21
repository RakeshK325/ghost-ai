import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { checkProjectAccess } from "@/lib/project-access";
import { getProjectsForUser } from "@/lib/projects";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceClient } from "./workspace-client";

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const resolvedParams = await params;
  const roomId = resolvedParams.roomId;

  // Retrieve access check on the project (checks both existence and user permissions)
  const access = await checkProjectAccess(roomId);
  
  if (!access) {
    return <AccessDenied />;
  }

  const { project, identity } = access;

  // Fetch all projects for this user to populate the project sidebar list
  const projects = await getProjectsForUser(identity.userId, identity.emails);

  return (
    <WorkspaceClient
      initialProjects={projects}
      activeProject={{
        id: project.id,
        name: project.name,
        ownerId: project.ownerId,
        collaborators: project.collaborators.map((collab: any) => ({
          id: collab.id,
          email: collab.email,
        })),
      }}
      currentUserEmail={identity.email}
      currentUserId={identity.userId}
    />
  );
}
