/**
 * Starts Next.js dev server and triggers compilation of ALL routes once the
 * server is ready. Ensures every page is pre-compiled so navigation is instant.
 *
 * Usage: npm run dev
 */

import { spawn } from "child_process";
import { createInterface } from "readline";

const BASE = "http://localhost:3000";
const POLL_MS = 1500;

// Must match MODULE_DEFINITIONS in lib/data.ts
const MODULE_IDS = [
  "reading-music",
  "note-names",
  "rhythm-basics",
  "instrument-families",
  "final-challenge",
];

const ROUTES = [
  "/",
  "/home",
  "/profiles",
  ...MODULE_IDS.flatMap((id) => [
    `/module/${id}`,
    `/module/${id}/challenge`,
    `/module/${id}/practice`,
    `/module/${id}/results`,
  ]),
];

function pollUntilReady() {
  return new Promise((resolve) => {
    function attempt() {
      fetch(BASE)
        .then((r) => {
          if (r.ok || r.status === 200) resolve();
          else setTimeout(attempt, POLL_MS);
        })
        .catch(() => setTimeout(attempt, POLL_MS));
    }
    attempt();
  });
}

async function warmRoutes() {
  const results = await Promise.allSettled(
    ROUTES.map((path) => fetch(`${BASE}${path}`))
  );
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length) {
    console.warn("[warm] Some routes failed to compile:", failed.length);
  }
  console.log("[warm] All routes pre-compiled.");
}

const child = spawn("npx", ["next", "dev"], {
  stdio: ["inherit", "pipe", "inherit"],
  shell: true,
});

let warmed = false;
const rl = createInterface({ input: child.stdout });
rl.on("line", (line) => {
  process.stdout.write(line + "\n");
  if (!warmed && (line.includes("Ready in") || line.includes("ready - started"))) {
    warmed = true;
    pollUntilReady()
      .then(warmRoutes)
      .catch((e) => console.warn("[warm] Error:", e.message));
  }
});

child.on("exit", (code) => process.exit(code ?? 0));
