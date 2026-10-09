// Production build + server on :3005 in .next-build, so it can run beside `next dev` on :3000.
import { spawn } from "node:child_process";

const env = { ...process.env, NEXT_DIST_DIR: ".next-build" };
const run = (cmd) => new Promise((ok, fail) => spawn(cmd, { stdio: "inherit", shell: true, env }).on("exit", (c) => (c ? fail(c) : ok())));

await run("npx next build --turbopack");
await run("npx next start -p 3005");
