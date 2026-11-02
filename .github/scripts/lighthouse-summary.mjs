// Prints a Markdown table of Lighthouse scores from treosh/lighthouse-ci-action outputs.
const manifest = JSON.parse(process.env.MANIFEST || "[]");
const links = JSON.parse(process.env.LINKS || "{}");
const pct = (v) => (typeof v === "number" ? Math.round(v * 100) : "-");

console.log("### Lighthouse\n");
console.log("| URL | Perf | A11y | Best practices | SEO | Report |");
console.log("|---|---|---|---|---|---|");
for (const run of manifest.filter((r) => r.isRepresentativeRun)) {
  const s = run.summary || {};
  const path = new URL(run.url).pathname;
  const report = links[run.url] ? `[open](${links[run.url]})` : "-";
  console.log(`| \`${path}\` | ${pct(s.performance)} | ${pct(s.accessibility)} | ${pct(s["best-practices"])} | ${pct(s.seo)} | ${report} |`);
}
