import { prisma } from "./prisma";
import { slugify } from "./utils";

export async function getProjectsForUser(userId: string, emails: string[]) {
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { collaborators: { some: { email: { in: emails } } } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects.map((p: any) => {
    const role = p.ownerId === userId ? "owner" : "collaborator";
    return {
      id: p.id,
      name: p.name,
      slug: slugify(p.name),
      role,
    };
  });
}
