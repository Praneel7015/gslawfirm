import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

// Separate processes exercise module initialization without risking a real send.
for (const mode of ["development", "production"] as const) {
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: mode };
  delete env.RESEND_API_KEY;
  const result = spawnSync(process.execPath, ["--require", "tsx/cjs", "-e", `
    const assert = require('node:assert/strict');
    const { sendLeadEmail } = require('./lib/resend.ts');
    (async () => {
    const result = await sendLeadEmail({
      name: 'Configuration probe', phone: '9000000000', email: 'probe@example.com',
      message: 'Synthetic configuration check only', website: '', source: {}
    }, { ip: '127.0.0.1', userAgent: 'configuration-test', submittedAt: new Date() });
    assert.equal(result.ok, ${mode === "development"});
    ${mode === "production" ? "assert.equal(result.error, 'email-not-configured');" : "assert.equal(result.id, null);"}
    })().catch((error) => { console.error(error); process.exitCode = 1; });
  `], { env, encoding: "utf8", timeout: 15_000 });
  assert.equal(result.status, 0, result.stderr || String(result.error));
  assert(!result.stderr.includes("probe@example.com"), "Do not log enquiry data");
}
console.log("Email configuration passed: development skip, production failure, no real email or enquiry-data logging.");
