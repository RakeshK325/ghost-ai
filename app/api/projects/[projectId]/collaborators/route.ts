import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { projectId } = await params;
  try {
    const access = await checkProjectAccess(projectId);
    if (!access) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { project } = access;

    // Fetch collaborators from database
    const collaborators = await prisma.projectCollaborator.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    const client = await clerkClient();

    // 1. Enrich Owner details from Clerk
    let ownerDetails = {
      id: project.ownerId,
      name: "Project Owner",
      email: "owner@company.com",
      imageUrl: "" as string | null,
    };

    try {
      const ownerUser = await client.users.getUser(project.ownerId);
      if (ownerUser) {
        const primaryEmail = ownerUser.emailAddresses.find(
          (e) => e.id === ownerUser.primaryEmailAddressId
        )?.emailAddress || ownerUser.emailAddresses[0]?.emailAddress || "owner@company.com";

        ownerDetails = {
          id: project.ownerId,
          name: [ownerUser.firstName, ownerUser.lastName].filter(Boolean).join(" ") || "Project Owner",
          email: primaryEmail,
          imageUrl: ownerUser.imageUrl || null,
        };
      }
    } catch (ownerError) {
      console.error("Failed to fetch owner details from Clerk:", ownerError);
    }

    // 2. Enrich Collaborators from Clerk in a batch query
    const collabEmails = collaborators.map((c: any) => c.email);
    const userDetailsMap = new Map<string, { name: string; imageUrl: string }>();

    if (collabEmails.length > 0) {
      try {
        const clerkUsers = await client.users.getUserList({
          emailAddress: collabEmails,
        });

        const userList = Array.isArray(clerkUsers) ? clerkUsers : (clerkUsers.data || []);

        for (const u of userList) {
          const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || "Clerk User";
          for (const emailObj of u.emailAddresses) {
            userDetailsMap.set(emailObj.emailAddress.toLowerCase(), {
              name,
              imageUrl: u.imageUrl,
            });
          }
        }
      } catch (clerkError) {
        console.error("Failed to fetch collaborators details from Clerk:", clerkError);
      }
    }

    const enrichedCollaborators = collaborators.map((c: any) => {
      const normalizedEmail = c.email.toLowerCase();
      const clerkInfo = userDetailsMap.get(normalizedEmail);
      return {
        id: c.id,
        email: c.email,
        name: clerkInfo?.name || null,
        imageUrl: clerkInfo?.imageUrl || null,
      };
    });

    return NextResponse.json({
      owner: ownerDetails,
      collaborators: enrichedCollaborators,
    });
  } catch (error) {
    console.error(`GET /api/projects/${projectId}/collaborators error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  const { projectId } = await params;
  try {
    const access = await checkProjectAccess(projectId);
    if (!access) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (access.role !== "owner") {
      return NextResponse.json({ error: "Only project owners can invite collaborators" }, { status: 403 });
    }

    let body: { email?: string } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const email = body.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Don't allow adding self
    if (access.identity.emails.some((e) => e.toLowerCase() === email)) {
      return NextResponse.json({ error: "You cannot add yourself as a collaborator" }, { status: 400 });
    }

    // Check if already invited
    const existing = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_email: {
          projectId,
          email,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Collaborator is already invited" }, { status: 400 });
    }

    // Create collaborator record
    const collaborator = await prisma.projectCollaborator.create({
      data: {
        projectId,
        email,
      },
    });

    // Enrich with Clerk details if available
    let enriched = {
      id: collaborator.id,
      email: collaborator.email,
      name: null as string | null,
      imageUrl: null as string | null,
    };

    try {
      const client = await clerkClient();
      const clerkUsers = await client.users.getUserList({
        emailAddress: [email],
      });
      const userList = Array.isArray(clerkUsers) ? clerkUsers : (clerkUsers.data || []);
      if (userList.length > 0) {
        const u = userList[0];
        enriched.name = [u.firstName, u.lastName].filter(Boolean).join(" ") || "Clerk User";
        enriched.imageUrl = u.imageUrl || null;
      }
    } catch (clerkError) {
      console.error("Failed to enrich new collaborator details:", clerkError);
    }

    return NextResponse.json(enriched, { status: 201 });
  } catch (error) {
    console.error(`POST /api/projects/${projectId}/collaborators error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { projectId } = await params;
  try {
    const access = await checkProjectAccess(projectId);
    if (!access) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (access.role !== "owner") {
      return NextResponse.json({ error: "Only project owners can manage collaborators" }, { status: 403 });
    }

    let body: { id?: string } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const collabId = body.id?.trim();
    if (!collabId) {
      return NextResponse.json({ error: "Collaborator ID is required" }, { status: 400 });
    }

    // Check if collaborator belongs to the project
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: { id: collabId },
    });

    if (!collaborator || collaborator.projectId !== projectId) {
      return NextResponse.json({ error: "Collaborator not found for this project" }, { status: 404 });
    }

    // Delete collaborator
    await prisma.projectCollaborator.delete({
      where: { id: collabId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/projects/${projectId}/collaborators error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
