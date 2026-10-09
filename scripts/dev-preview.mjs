// Dev server on :3001 that builds into .next-preview, so it can run beside `next start` on :3000.
import { spawn } from "node:child_process";

const child = spawn("npx next dev --turbopack -p 3001", {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_DIST_DIR: ".next-preview" },
});
child.on("exit", (code) => process.exit(code ?? 0));
