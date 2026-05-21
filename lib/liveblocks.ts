import { Liveblocks } from "@liveblocks/node";

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks;
};

// Cached singleton client instance safe for HMR in development environment
export const liveblocks =
  globalForLiveblocks.liveblocks ??
  new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY || "sk_mock_key_for_compilation_only",
  });

if (process.env.NODE_ENV !== "production") {
  globalForLiveblocks.liveblocks = liveblocks;
}

// 8 defined bright theme colors for cursors, matching the project's visual guidelines
const PALETTE = [
  "#52A8FF", // Blue
  "#BF7AF0", // Purple
  "#FF990A", // Orange
  "#FF6166", // Red
  "#F75F8F", // Pink
  "#62C073", // Green
  "#0AC7B4", // Teal
  "#00C8D4", // Cyan
];

/**
 * Deterministically maps a user ID to a consistent vibrant color from our theme palette.
 */
export function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}
