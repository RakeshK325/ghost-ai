import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getProjectsForUser } from "@/lib/projects";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const emails = user?.emailAddresses.map((e) => e.emailAddress) || [];

    const mappedProjects = await getProjectsForUser(userId, emails);

    return NextResponse.json(mappedProjects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { name?: string; id?: string } = {};
    try {
      body = await req.json();
    } catch {
      // Body might be empty or not valid JSON
    }

    const name = body.name?.trim() || "Untitled Project";
    const id = body.id?.trim();

    const project = await prisma.project.create({
      data: {
        ownerId: userId,
        name,
        ...(id ? { id } : {}),
      },
    });

    return NextResponse.json(
      {
        id: project.id,
        name: project.name,
        slug: slugify(project.name),
        role: "owner",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
