/**
 * QA: step-card layout contract.
 *
 * Every *-step article must follow the content contract that matches
 * the reference page (legal-notice-reply-format):
 *   1. First child: .li-num
 *   2. Next: exactly one h2 (not h3)
 *   3. Remaining children may be <p> only (no nested grids/lists)
 *
 * Extra children used to collapse into the 52px number column and
 * produce vertically-stacked broken text. CSS now hardens the grid,
 * but this script still fails the build if the markup contract drifts.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "app");
const STEP_ARTICLE =
  /<article\s+className="[^"]*-step"[^>]*>([\s\S]*?)<\/article>/g;
const LI_NUM = /<span\s+className="li-num"/;
const H2 = /<h2[\s>]/;
const H3 = /<h3[\s>]/;
const BAD_NEST =
  /<(?:ul|ol|div\s+className="(?:pd-handle|legal-steps|service-faq))/;

const failures: string[] = [];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name === "page.tsx") out.push(full);
  }
  return out;
}

for (const file of walk(ROOT)) {
  const src = readFileSync(file, "utf8");
  const rel = file.replace(process.cwd() + "\\", "").replace(/\\/g, "/");
  let match: RegExpExecArray | null;
  const re = new RegExp(STEP_ARTICLE.source, "g");
  while ((match = re.exec(src)) !== null) {
    const body = match[1];
    if (!body) continue;
    if (!LI_NUM.test(body)) {
      failures.push(`${rel}: *-step article missing .li-num`);
    }
    if (!H2.test(body)) {
      failures.push(`${rel}: *-step article missing <h2> (got no h2)`);
    }
    if (H3.test(body)) {
      failures.push(
        `${rel}: *-step article uses <h3> — must use <h2> for step titles`,
      );
    }
    if (BAD_NEST.test(body)) {
      failures.push(
        `${rel}: *-step article nests a list/handle/grid — keep only li-num + h2 + p`,
      );
    }
  }
}

if (failures.length) {
  console.error("Step-card layout contract failed:\n");
  for (const f of failures) console.error(`  • ${f}`);
  process.exit(1);
}

console.log("Step-card layout contract passed.");
