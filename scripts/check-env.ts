/**
 * Local env sanity check, run: pnpm exec tsx scripts/check-env.ts
 * Does not print secret values.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnv(): void {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) {
    console.error("[check-env] No .env file found. Copy .env.example → .env");
    process.exit(1);
  }
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function status(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) return "MISSING";
  if (v.includes("your-") || v === '""') return "PLACEHOLDER";
  return `set (${v.length} chars)`;
}

async function main() {
  loadDotEnv();

  console.log("\n── GS Law Firm · env check (local .env only) ──\n");
  console.log("Site");
  console.log(`  NEXT_PUBLIC_SITE_URL          ${status("NEXT_PUBLIC_SITE_URL")}`);

  console.log("\nResend (contact form email)");
  console.log(`  RESEND_API_KEY                ${status("RESEND_API_KEY")}`);
  console.log(`  RESEND_FROM                   ${status("RESEND_FROM")}`);
  console.log(`  LEAD_NOTIFY_TO                ${status("LEAD_NOTIFY_TO")}`);

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (apiKey?.startsWith("re_")) {
    try {
      const r = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (r.ok) {
        const data = (await r.json()) as {
          data?: { name: string; status: string }[];
        };
        const domains = data.data ?? [];
        console.log("\n  Resend domains (API check):");
        if (domains.length === 0) console.log("    (none, verify sindhole.com in Resend)");
        for (const d of domains) {
          console.log(`    · ${d.name} → ${d.status}`);
        }
      } else {
        console.log(`\n  Resend API: HTTP ${r.status} (key may be invalid)`);
      }
    } catch {
      console.log("\n  Resend API: network error");
    }
  }

  console.log("\nTurnstile");
  const site = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  console.log(`  NEXT_PUBLIC_TURNSTILE_SITE_KEY ${site ? `set (${site.length} chars)` : "MISSING"}`);
  console.log(`  TURNSTILE_SECRET_KEY           ${secret ? `set (${secret.length} chars)` : "MISSING"}`);

  if (site && secret) {
    const sitePrefix = site.slice(0, 12);
    const secretPrefix = secret.slice(0, 12);
    if (sitePrefix === secretPrefix) {
      console.log("  Pairing: prefixes match (likely same widget) ✓");
    } else {
      console.log("  Pairing: prefixes DIFFER, keys may be from different widgets ✗");
    }
  } else if (site || secret) {
    console.log(
      "  ⚠ Only one Turnstile key set, remove BOTH or set BOTH. Half-config breaks production.",
    );
  } else {
    console.log("  Turnstile disabled (both empty), form skips challenge ✓");
  }

  console.log("\nUpstash (optional)");
  console.log(`  UPSTASH_REDIS_REST_URL         ${status("UPSTASH_REDIS_REST_URL")}`);
  console.log(`  UPSTASH_REDIS_REST_TOKEN      ${status("UPSTASH_REDIS_REST_TOKEN")}`);

  console.log(`
── Important ──
  • Local .env is used by "pnpm dev" only.
  • sunitha.sindhole.com uses Vercel → Project → Settings → Environment Variables.
  • After changing NEXT_PUBLIC_* vars, redeploy (they are baked at build time).

  If live form shows "couldn't verify" → Turnstile (400).
  If form succeeds but no email → Resend (check Vercel logs for [resend] send error).
  Quick fix: remove TURNSTILE_SECRET_KEY on Vercel and redeploy.
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
