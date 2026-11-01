/** Build once, test that exact local production build, always stop its server. */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { resolve } from "node:path";

const next = resolve("node_modules/next/dist/bin/next");
function run(args, env = process.env) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, args, { stdio: "inherit", env });
    child.once("error", reject);
    child.once("exit", (code, signal) => code === 0 ? resolveRun() : reject(new Error(`${args.join(" ")} exited ${code ?? signal}`)));
  });
}
await run([next, "build"]);
for (const script of ["qa-rendered.ts", "qa-h1.ts", "qa-homepage-faq-schema.ts"]) {
  await run(["--import", "tsx", `scripts/${script}`, "--static"]);
}
const port = process.env.QA_PORT ?? "3100";
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [next, "start", "--hostname", "127.0.0.1", "--port", port], { stdio: "inherit" });
let serverError;
server.once("error", error => { serverError = error; });
const stop = async () => {
  if (server.exitCode !== null || server.signalCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([new Promise(resolveStop => server.once("exit", resolveStop)), delay(5000)]);
  if (server.exitCode === null && server.signalCode === null) server.kill("SIGKILL");
};
const interrupted = () => { void stop().finally(() => process.exit(130)); };
process.once("SIGINT", interrupted);
process.once("SIGTERM", interrupted);
try {
  const deadline = Date.now() + 45000;
  let ready = false;
  while (Date.now() < deadline) {
    if (serverError) throw serverError;
    if (server.exitCode !== null) throw new Error(`Candidate server exited ${server.exitCode}; HTTP checks did not run.`);
    try {
      const response = await fetch(base, { signal: AbortSignal.timeout(2000) });
      if (response.ok) { ready = true; break; }
    } catch { /* Wait for startup, with a bounded deadline. */ }
    await delay(250);
  }
  if (!ready) throw new Error(`Candidate server not ready after 45 seconds: ${base}`);
  const env = { ...process.env, QA_BASE_URL: base };
  for (const script of ["qa-routes.ts", "qa-h1.ts", "qa-homepage-faq-schema.ts", "qa-rendered.ts", "qa-lead-heartbeat.ts"]) {
    await run(["--import", "tsx", `scripts/${script}`, base], env);
  }
  if (process.env.QA_BROWSER === "1") await run(["scripts/qa-browser.mjs", base], env);
  if (process.env.QA_LIGHTHOUSE === "1") await run(["scripts/qa-lighthouse.mjs", base], env);
} finally {
  await stop();
  process.removeListener("SIGINT", interrupted);
  process.removeListener("SIGTERM", interrupted);
}
