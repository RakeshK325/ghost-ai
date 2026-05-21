# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Collaborative Canvas Setup

## Current Goal

- Set up shared real-time collaborative canvas using Liveblocks and React Flow as defined in project scope.

## Completed

- Installed and configured `shadcn/ui` custom layout system for Tailwind CSS v4
- Created custom theme custom properties and mapping classes in `app/globals.css`
- Created reusable `cn()` helper in `lib/utils.ts` using `clsx` and `tailwind-merge`
- Implemented core UI primitives: `Button`, `Card`, `Dialog`, `Input`, `Tabs`, `Textarea`, and `ScrollArea`
- Created premium preview dashboard in `app/page.tsx` showing all components and interactive features
- Verified clean build and full compile correctness via standard Next.js build suite
- Refined Tailwind `@theme` in `app/globals.css` with `--color-brand` mapping to support `ring-brand` and `border-brand` styling utilities across all UI primitives
- Cleaned up Next.js boilerplate: stripped `globals.css` down to core Tailwind directives and replaced `page.tsx` with a minimal centered "ghost AI" component
- Implemented base editor layout shell (`EditorNavbar` and floating `ProjectSidebar`) and verified the dialog styling pattern via a live stateful workspace canvas page
- Wired Clerk authentication into the app:
  - `ClerkProvider` wraps `app/layout.tsx` with `dark` base theme from `@clerk/ui/themes`
  - Clerk appearance overrides applied using CSS custom properties — no hardcoded colors
  - Created `proxy.ts` at root for route protection (protected-first strategy)
  - Public routes: `/sign-in` and `/sign-up`; all other routes are protected
  - Root path `/` redirects authenticated users to `/editor` and unauthenticated to `/sign-in`
  - Custom two-panel sign-in and sign-up pages created with responsive layout
  - `<UserButton />` added to editor navbar right section
  - `afterSignOutUrl="/sign-in"` configured at ClerkProvider level
  - `npm run build` passes with zero errors
- Implemented `/editor` home screen and dynamic mock project canvas toggling (initialized empty without demo data).
- Added project dialog state, form validation, and URL slug generation using a dedicated custom hook (`useProjectDialogs`).
- Added Create Project, Rename Project (prefilled, autofocus, Enter-submitting), and Delete Project (destructive confirm) dialog interfaces (without Workspace URL preview elements).
- Extended project list sidebar to group items by My Projects (owned) and Shared (collaborators).
- Displayed action buttons (Rename/Delete) strictly on owned projects and hid them for shared projects.
- Integrated a responsive backdrop scrim overlay to automatically dismiss the sidebar on mobile clicks.
- Resolved ESLint warnings in standard primitives (input, textarea) and achieved a fully passing standard build with zero compilation or lint errors.
- Added database schema models `Project` and `ProjectCollaborator` supporting cascade deletions, precise status states (`DRAFT`, `ARCHIVED`), and composite unique constraints and indexes for query optimizations.
- Configured cached Prisma Client singleton supporting database driver branching between direct TCP pg pool adapter (`@prisma/adapter-pg`) and serverless cloud Accelerate extension, safely cached in HMR environments.
- Created and executed the database initializer migration (`20260520155452_init`) syncing standard relational tables on PostgreSQL.
- Implemented backend-only REST API endpoints for projects: list (`GET /api/projects`), create (`POST /api/projects`), rename (`PATCH /api/projects/[projectId]`), and delete (`DELETE /api/projects/[projectId]`) with Clerk authentication and ownership-checking database level security.
- Connected the editor home sidebar, workspace views, and project dialogs to the real database and backend REST APIs:
  - Created `lib/projects.ts` data helper to fetch projects and generate slugs server-side.
  - Converted the editor home page `app/editor/page.tsx` from a Client Component to a Server Component with server-side initial loading.
  - Extracted all canvas state and dialog elements into a client interactive component `app/editor/editor-client.tsx`.
  - Created a custom `useProjectActions` hook in `hooks/use-project-actions.ts` that handles async creation, renaming, and deletion, generates short 4-character suffixes to keep the project ID and Liveblocks room ID aligned, and manages loading/form UI states.
  - Wired workspace URL query-routing (`/editor?projectId=<id>`) for instant server-side updates and smooth navigations.
- Implemented the `/editor/[roomId]` workspace shell route with robust server-side access control checks:
  - Created `lib/project-access.ts` to retrieve current Clerk user identity (userId and all associated emails) and validate database project ownership and collaborator permission states.
  - Enforced automatic sign-in redirects for unauthenticated requests.
  - Created a beautifully styled, high-fidelity `components/editor/access-denied.tsx` lockscreen card with redirect links for unauthorized or non-existent projects.
  - Developed the server-rendered workspace page `app/editor/[roomId]/page.tsx` that securely verifies access permissions and pre-loads project lists for the sidebar.
  - Engineered a premium workspace shell client component `app/editor/[roomId]/workspace-client.tsx` featuring a dot-grid canvas viewport, a symmetric floating project and AI sidebar layout, and an animated Share/Invite dialog overlay.
- Fully implemented collaborative sharing capabilities:
  - Created a dynamic REST API route handler `app/api/projects/[projectId]/collaborators/route.ts` with secure owner-only mutation validation (`POST`, `DELETE`) and access check validations (`GET`).
  - Integrated Clerk Backend client SDK for real-time collaborator and owner user profiles enrichment (names, emails, avatar URLs) fallbacking gracefully for unregistered users.
  - Linked the Client Dialog in `WorkspaceClient` to call real endpoints for fetching, adding, and removing collaborators.
  - Added visual error banner states and a functional "Copy Workspace Link" button with an active 2-second `"Copied!"` visual confirmation state.
  - Achieved a 100% clean verified production compile with zero TS or ESLint errors.
- Polished and perfected the Workspace Share Dialog's layout alignment and spacing:
  - Formatted the workspace link element as a high-fidelity read-only `<Input>` component, locking Invite and Link sections to perfectly symmetrical `h-10` heights and corners.
  - Added subtle horizontal dividers (`border-b` and `border-t`) to frame the dialog contents symmetrically with elegant breathing space.
  - Fixed horizontal and vertical boundary overflows, ensuring the modal content respects container limits with a premium, spacious card aesthetic.
- Configured and set up the core real-time collaboration infrastructure using Liveblocks:
  - Installed and configured `@liveblocks/node` dependency to enable backend token signing and room management.
  - Configured `liveblocks.config.ts` globally with custom `Presence` (`cursor` coordinates, `isThinking` indicator) and `UserMeta` (`id`, `info` with `name`, `avatar`, and deterministic `color`).
  - Created a cached, HMR-safe `lib/liveblocks.ts` node server client and a deterministic cursor color generator using an HSL-tailored 8-color palette.
  - Implemented secure authentication endpoint `POST /api/liveblocks-auth` with Clerk protection, database project collaborator access validation, automated private-room provisioning, and session token generation using the dynamic Access Token session model.
  - Resolved all typescript and linter compilation warnings/errors and achieved a 100% clean production next build compile.
- Fully implemented Liveblocks-backed React Flow collaborative canvas inside the editor workspace:
  - Defined shared canvas types, shape categories, and vibrant HSL-tailored node/text color pairs in `types/canvas.ts`.
  - Built class-based `<ErrorBoundary>` capturing collaborative session and room authorization failures.
  - Implemented `<CollaborativeFlow>` wiring React Flow state and handlers directly into Liveblocks multiplayer context with `connectionMode="loose"`.
  - Integrated `Cursors`, `Background` (dot pattern), and styled custom dark `MiniMap` widgets.
  - Created `<CanvasWrapper>` container setting up the Liveblocks session and RoomProvider.
  - Replaced the static, empty canvas dashboard placeholder in `WorkspaceClient` with the new synced `<CanvasWrapper>`.
- Implemented premium responsive dual-pane double-bordered canvas container and aligned MiniMap:
  - Hid standard gray React Flow watermark using `proOptions={{ hideAttribution: true }}` in `CollaborativeFlow`.
  - Aligned React Flow `<MiniMap>` widget to the `"bottom-right"` corner.
  - Upgraded the central canvas wrapper in `WorkspaceClient` to a responsive, double-bordered card container featuring transition animations.
  - Set margins (`ml` / `mr`) to adjust dynamically on sidebarOpen and aiBarOpen states, preventing the sidebars from obscuring the MiniMap and keeping the canvas beautifully nested.
- Fully implemented bottom shape panel toolbar and custom canvas node rendering (spec 12):
  - Created a floating pill-shaped toolbar component with draggable buttons for all 6 shapes.
  - Implemented client-side ReactFlowProvider layout wrapping.
  - Built custom `canvasNode` custom renderer supporting coordinate translation and interactive handles on all 4 sides.
  - Handled automated drop mechanics with screen-to-flow coordinate translations.

## In Progress

- Complete full high-fidelity custom SVG graphics rendering for each system architecture node shape (diamonds, hexagons, cylinders, circles, pills, rectangles) inside the custom renderer.

## Next Up

- Support node text editing and color selection controls.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Add context needed to resume work in the next session.
