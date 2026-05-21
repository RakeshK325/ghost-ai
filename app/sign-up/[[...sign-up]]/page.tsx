import { SignUp } from "@clerk/nextjs";
import { Cpu, Users, FileCode } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileCode,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* ── Left Panel — 50% branding (large screens only) ── */}
      <div
        className="hidden lg:flex flex-col w-1/2 relative"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        {/* Inner content — padded, full height column layout */}
        <div className="flex flex-col h-full px-14 py-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-auto">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--accent-primary)" }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                style={{ color: "var(--bg-base)" }}
              >
                <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" />
              </svg>
            </div>
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist-sans)" }}
            >
              Ghost AI
            </span>
          </div>

          {/* Main headline + copy — vertically centered */}
          <div className="flex flex-col justify-center flex-1 max-w-md">
            <h1
              className="text-4xl font-bold leading-[1.15] tracking-tight mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Start designing
              <br />
              smarter systems.
            </h1>
            <p
              className="text-sm leading-relaxed mb-10 max-w-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Create your free account and bring your architecture ideas to life
              with AI and real-time collaboration.
            </p>

            {/* Feature list with icon boxes */}
            <ul className="space-y-6">
              {features.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3.5">
                  <div
                    className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg mt-0.5"
                    style={{
                      backgroundColor: "var(--accent-primary-dim)",
                      border: "1px solid rgba(0,200,212,0.2)",
                    }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: "var(--accent-primary)" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold leading-snug mb-0.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {title}
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Copyright footer */}
          <p
            className="text-xs mt-auto"
            style={{ color: "var(--text-faint)" }}
          >
            © 2026 Ghost AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right Panel — 50% Clerk form ── */}
      <div
        className="flex flex-1 lg:w-1/2 flex-col items-center justify-center px-6 py-12"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        {/* Mobile-only logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--accent-primary)" }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              style={{ color: "var(--bg-base)" }}
            >
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" />
            </svg>
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Ghost AI
          </span>
        </div>

        <SignUp
          signInUrl="/sign-in"
          fallbackRedirectUrl="/editor"
        />
      </div>
    </div>
  );
}
