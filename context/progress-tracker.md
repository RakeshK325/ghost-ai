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

## In Progress

- None

## Next Up

- Set up shared real-time collaborative canvas using Liveblocks and React Flow as defined in project scope.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Add context needed to resume work in the next session.
