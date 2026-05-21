import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { checkProjectAccess } from "@/lib/project-access";
import { liveblocks, getUserColor } from "@/lib/liveblocks";

export async function POST(req: Request) {
  try {
    // 1. Require Clerk authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body for the room ID (projectId)
    let body: { room?: string } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const projectId = body.room;
    if (!projectId) {
      return NextResponse.json({ error: "Room ID (projectId) is required" }, { status: 400 });
    }

    // 3. Verify project access using the database access helper
    const access = await checkProjectAccess(projectId);
    if (!access) {
      console.warn(`Unauthorized Liveblocks access attempt for project ${projectId} by user ${user.id}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. Ensure the Liveblocks room exists (create it private-first if it doesn't)
    try {
      await liveblocks.getOrCreateRoom(projectId, {
        defaultAccesses: [], // Rooms are private, auth endpoint controls session access
        metadata: {
          projectId,
          projectName: access.project.name,
        },
      });
    } catch (roomError) {
      console.error(`Failed to get or create Liveblocks room for project ${projectId}:`, roomError);
      return NextResponse.json(
        { error: "Failed to initialize collaborative room" },
        { status: 500 }
      );
    }

    // 5. Build user identity properties with clean fallback strategies
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      "Collaborator";

    const avatar =
      user.imageUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const color = getUserColor(user.id);

    // 6. Authorize the Liveblocks session and sign the token
    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name,
        avatar,
        color,
      },
    });

    // Dynamically grant full access to this specific project room
    session.allow(projectId, session.FULL_ACCESS);

    const { status, body: sessionBody } = await session.authorize();
    return new Response(sessionBody, { status });
  } catch (error) {
    console.error("Liveblocks authentication endpoint error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
