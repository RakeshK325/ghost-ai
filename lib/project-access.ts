import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export interface UserIdentity {
  userId: string;
  email: string | null;
  emails: string[];
}

export async function getUserIdentity(): Promise<UserIdentity | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  const primaryEmail = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress || user.emailAddresses[0]?.emailAddress || null;

  const emails = user.emailAddresses.map((e) => e.emailAddress);

  return {
    userId,
    email: primaryEmail,
    emails,
  };
}

export async function checkProjectAccess(projectId: string) {
  const identity = await getUserIdentity();
  if (!identity) return null;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: true,
    },
  });

  if (!project) return null;

  // Check if owner
  if (project.ownerId === identity.userId) {
    return {
      project,
      role: "owner" as const,
      identity,
    };
  }

  // Check if collaborator
  const isCollaborator = identity.emails.some((userEmail) =>
    project.collaborators.some((collab: any) => collab.email.toLowerCase() === userEmail.toLowerCase())
  );

  if (isCollaborator) {
    return {
      project,
      role: "collaborator" as const,
      identity,
    };
  }

  return null;
}
