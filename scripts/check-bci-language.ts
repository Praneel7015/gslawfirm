/**
 * BCI language linter (build-prompt §7).
 *
 * Scans content/, messages/, and app/ for any of the banned superlatives
 * the Bar Council of India prohibits in advocate communications.
 * Fails the build (exit 1) on any violation.
 *
 * Runs as: `pnpm lint:bci`  (wired in package.json).
 */

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOTS = ["content", "messages", "app"];
const EXTS = new Set([".ts", ".tsx", ".json", ".md", ".mdx", ".txt"]);

/**
 * Whole-word, case-insensitive matches.
 * NOTE: we deliberately exclude "top" — it collides with CSS keywords
 * (e.g. `top: 0`) and the build-prompt's intent is user-visible copy;
 * `top` as a superlative in copy would always co-occur with another
 * banned word (e.g. "top expert", "leading firm"), so we'd catch it.
 */
const BANNED = [
  "best",
  "leading",
  "no\\.?\\s*1",
  "#1",
  "expert",
  "specialist",
  "guaranteed",
  "winning",
  "successful track record",
  "most experienced",
];

const RE = new RegExp(`\\b(${BANNED.join("|")})\\b`, "gi");

type Hit = { file: string; line: number; col: number; match: string; preview: string };

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".next" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (EXTS.has(path.extname(e.name))) yield p;
  }
}

async function scan(): Promise<Hit[]> {
  const hits: Hit[] = [];
  for (const root of ROOTS) {
    try {
      const s = await stat(root);
      if (!s.isDirectory()) continue;
    } catch {
      continue;
    }
    for await (const file of walk(root)) {
      const text = await readFile(file, "utf8");
      const lines = text.split(/\r?\n/);
      lines.forEach((line, i) => {
        for (const m of line.matchAll(RE)) {
          hits.push({
            file,
            line: i + 1,
            col: (m.index ?? 0) + 1,
            match: m[0],
            preview: line.trim().slice(0, 140),
          });
        }
      });
    }
  }
  return hits;
}

async function main() {
  const hits = await scan();
  if (hits.length === 0) {
    console.log("[bci-lint] OK — no banned superlatives found.");
    process.exit(0);
  }

  console.error(`[bci-lint] FAIL — ${hits.length} banned-word occurrence(s):`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}:${h.col}  "${h.match}"  ${h.preview}`);
  }
  console.error(
    "\nBar Council of India rules forbid superlatives in advocate communications. Rephrase and try again.",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
