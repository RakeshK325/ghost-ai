// This page acts as the root entry point.
// Route protection and redirects are handled in proxy.ts:
//   - Authenticated users → /editor
//   - Unauthenticated users → /sign-in
// This component only renders if the middleware somehow allows through.
export default function RootPage() {
  return null;
}
