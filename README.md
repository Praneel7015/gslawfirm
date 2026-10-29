# GS Law Firm, website

Production site for **GS Law Firm**, a solo-advocate practice in
Kondapur, Hyderabad. Next.js 15, Tailwind CSS v4, `next-intl`
(`en`, `te`, `hi`), BCI-compliant copy, SSR for SEO.

- **Live**: <https://sunitha.sindhole.com>
- **Repository**: <https://github.com/Praneel7015/gslawfirm>

---

## Quick start

Requires Node ≥ 20 and pnpm 9.

```bash
pnpm install
cp .env.example .env    # fill in values locally, .env is never committed
pnpm dev                # http://localhost:3000
pnpm typecheck
pnpm lint
pnpm lint:bci
pnpm check:env          # sanity-check .env without printing secrets
pnpm build
```

---

## Deploy (Vercel)

1. Import repo at [vercel.com/new](https://vercel.com/new), **Root Directory**: `gslawfirm`
2. Set environment variables (Production + Preview), then **Deploy**
3. Add domain `sunitha.sindhole.com` in Vercel → point Cloudflare DNS: - **CNAME** `sunitha` → `cname.vercel-dns.com`, **grey cloud** (DNS only)
4. After changing any `NEXT_PUBLIC_*` variable, **redeploy** (baked at build time)

### Required env vars (production)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://sunitha.sindhole.com` |
| `RESEND_API_KEY` | Contact form → email (Resend) |
| `RESEND_FROM` | `GS Law Firm <noreply@sunitha.sindhole.com>` |
| `LEAD_NOTIFY_TO` | `sunithags@gmail.com` |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Cloudflare Web Analytics |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog public ingestion key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog ingestion host |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console HTML tag value |

### Optional

| Variable | Purpose |
|---|---|
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Rate limit 5/h/IP (recommended) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Bot challenge, set **both** or **neither** |
| `NEXT_PUBLIC_GA_ID` | GA4, off by default (needs consent banner) |

Copy `.env.example` for the full list and comments.

---

## Email & DNS (summary)

- **Inbound**: `sunitha@sindhole.com` → Cloudflare Email Routing → Gmail
- **Outbound** (form leads): Resend, domain `sindhole.com` verified in Resend
- **DNS**: domain registered on Cloudflare; site served by Vercel

If the form returns **429**, you hit the rate limit, wait an hour or
clear `gslawfirm:lead*` keys in the Upstash dashboard. If it returns
**400 challenge**, fix Turnstile keys on Vercel. If **200** but no
email, rotate `RESEND_API_KEY` and confirm the domain is Verified in
Resend.

---

## Project structure

```
app/[locale]/     pages (home, about, practice/*, contact, privacy, disclaimer)
app/api/lead/     contact form API → Resend
components/       UI, layout, legal (BCI modal), sections
content/          firm + practice area source of truth
messages/         en / te / hi catalogues
lib/              SEO, JSON-LD, rate limit, Turnstile, Resend
public/           static assets
scripts/          BCI linter, env checker
```

Operational playbooks (Cloudflare, backend, domain migration) live in
`docs/` **locally only**, not in this repository.

---

## Tech stack

- Next.js 15 (App Router), TypeScript strict, Tailwind CSS v4
- `next-intl`, English at `/`, Telugu `/te`, Hindi `/hi`
- React Hook Form + Zod · Resend · Upstash Redis · Cloudflare Turnstile
- Cloudflare Web Analytics (primary) · JSON-LD, sitemap, dynamic OG images

---

## BCI compliance

1. First-visit disclaimer modal (`components/legal/DisclaimerModal.tsx`)
2. Content linter: `pnpm lint:bci`, scans for banned superlatives

---

## QA (M10)

```bash
pnpm qa              # typecheck + lint + bci + build + route smoke (35 URLs)
pnpm qa:routes       # HTTP 200 check only
pnpm qa:lead-heartbeat # no-submit live contact path + lead API validation probe
pnpm qa:lighthouse   # mobile Lighthouse on / and /practice/criminal
pnpm qa:ai-visibility # llms.txt, JSON-LD graph, sameAs, areasServed
pnpm qa:step-layout   # *-step cards must be li-num + h2 + p only
pnpm check:env       # local .env sanity check
```

**Targets (mobile Lighthouse):** Performance ≥ 95 · Accessibility 100 ·
Best Practices 100 · SEO 100, on `/` and `/practice/criminal`.

**Live URL:** <https://sunitha.sindhole.com>

**Known launch notes:** Telugu/Hindi long-form strings marked
`[TRANSLATION PENDING]` in `messages/te.json` and `messages/hi.json`
await native legal review before those locales go fully live.

**CI:** GitHub Actions runs typecheck, ESLint, BCI lint, and build on
every push to `main`. Local pre-commit hook runs `pnpm lint:bci`.

---

## SEO architecture

```
lib/seo.ts                pageMetadata(), alternatesFor(): per-page OG + canonical
lib/localized-metadata.ts Titles + descriptions for every route × locale
lib/jsonld.ts             LegalService, Person, WebSite, Service, FAQ, Breadcrumb, HowTo, ProfilePage
app/robots.ts             robots.txt: allow all, disallow /api/
app/sitemap.ts            108 entries with hreflang, stable lastModified dates
public/llms.txt           AI-discoverable site summary for LLM crawlers
public/llms-full.txt      Extended AI-discoverable per-page guide
scripts/qa-*              Automated checks: canonicals, titles, descriptions, links, FAQs, AI visibility
```

| Signal | Target | QA Script |
|--------|--------|-----------|
| Sitemap entries | 108 (36 routes × 3 locales) | `qa:discovery-signals` |
| Unique page titles | 108, branded + locally qualified | `qa:metadata-titles` |
| Unique descriptions | 108, 80–170 chars, locally qualified | `qa:metadata-descriptions` |
| Canonicals | Self-referencing per locale | `qa:canonicals` |
| Internal links | Reciprocal between related services | `qa:internal-links` |
| FAQ schema | Homepage + all service pages | `qa:homepage-faq-schema` |
| HowTo schema | 4 procedure/format guide pages | Rich Results Test |
| ProfilePage schema | About page (E-E-A-T) | Rich Results Test |
| AI visibility | llms.txt + llms-full.txt + JSON-LD | `qa:ai-visibility` |
| Security headers | nosniff, DENY, referrer-policy, permissions-policy | Response headers |
| Lighthouse (mobile) | Perf ≥ 95, A11y 100, BP 100, SEO 100 | `qa:lighthouse` |

---

## License

All rights reserved. Internal client project, not for redistribution.


## Search growth and enquiry reliability: October 2026 review

The supplied Search Console export covers **20 July–19 October 2026** (Web search).
It records **556 impressions, 4 clicks, 0.72% CTR**, with only the homepage appearing
in the Pages export. This does not prove that other pages are unindexed: use URL
Inspection and the Page indexing report to establish that. Search Console clicks
also exclude Maps actions, direct visits, referrals and other enquiry sources.

| Evidence | Result | Implication |
|---|---|---|
| Latest 28 days vs previous 28 days | 127 vs 234 impressions; 0 vs 1 clicks | Visibility declined, but the sample is too small for a reliable trend forecast. |
| Three largest visible queries | business lawyer: 140; dui lawyer: 91; contract lawyer: 69 impressions, all zero clicks | Review these queries by landing page and device; prioritize relevant local intent rather than copying generic keywords everywhere. |
| Devices | Desktop: 424 impressions / 4 clicks; mobile: 131 / 0 | Test the mobile experience; there is too little data to attribute zero clicks to a mobile defect. |
| Countries | India: 552 impressions / 4 clicks | Geographic targeting is broadly relevant; city-level demand remains unknown. |

The export's average position is 3.96. That is an impression-weighted aggregate,
not proof that service pages rank fourth for competitive Hyderabad searches.
Query rows omit some searches for privacy, so their click counts need not sum to
the chart total. Buying visits or generating bot requests will not solve this.

### Implementation in this change

- Resource guides now have page-specific canonical URLs, locale alternates,
  descriptions and Open Graph/Twitter metadata instead of inheriting the homepage
  canonical. Summaries are translated; full resource article bodies remain English
  and need human legal translation review before being treated as finished localizations.
- Discovery and metadata audits cover all 108 sitemap pages, including nine resource
  article URLs. Discovery validates URL membership and uniqueness rather than a stale count.
- Route smoke tests read the served sitemap, so new published pages are covered.
- In production, missing Resend configuration now returns an email delivery failure
  instead of silently claiming success. Development can still run without email
  credentials. Neither mode logs enquiry contents when delivery is unconfigured.

### Step 1: deploy and verify the technical changes

Review and deploy these changes through the normal GitHub/Vercel workflow.
Before deploying, check Vercel → Project → Settings → Environment Variables:
`RESEND_API_KEY`, `RESEND_FROM`, and `LEAD_NOTIFY_TO` must be correctly configured
for production email delivery. Enter credentials there, never in source or chat.
The export and local environment do not establish whether live email is configured.
After deployment, arrange one authorized test enquiry using your own details,
confirm the notification arrives, and check Resend delivery status. A successful
API response alone does not prove inbox delivery.

For local verification, use the pinned Node 20/pnpm 9 tools:

```bash
pnpm typecheck
pnpm lint
pnpm lint:bci
pnpm qa:email-configuration
pnpm qa:discovery-signals
pnpm qa:canonicals
pnpm qa:metadata-titles
pnpm qa:metadata-descriptions
pnpm build
pnpm start --hostname localhost --port 3000
# In another terminal, from the repository root:
pnpm qa:routes http://localhost:3000
pnpm qa:resource-metadata http://localhost:3000
pnpm qa:crawl-signals http://localhost:3000
pnpm qa:lead-heartbeat http://localhost:3000
```

The heartbeat never sends email. Live checks require access to the site's hostname;
local verification cannot establish the state of the deployed site. `pnpm qa` still
uses the route check's default live hostname; pass an explicit base for local checks.

### Step 2: investigate indexing in Search Console

1. Open the verified property `https://sunitha.sindhole.com/`.
2. Open **Sitemaps**, submit `sitemap.xml` if absent, and inspect processing errors.
3. Use **URL Inspection** for `/commercial-contracts`, `/legal-notices`, `/bail`,
   `/property-disputes`, and an individual `/resources/...` guide.
4. Compare the user-declared and Google-selected canonical. After deployment, each
   resource guide should declare its own locale URL, not the homepage.
5. If a page is excluded, record the exact reason. Check redirects, `noindex`, robots
   restrictions, crawl errors, internal links and content duplication as applicable.
   Request indexing only after a substantive correction. It is not guaranteed.
6. Export the **Page indexing** report and record these inspection results. The
   performance ZIP alone cannot distinguish an indexing problem from low demand.

### Step 3: strengthen the existing pages that match the practice

Start with `/commercial-contracts` and the homepage because business/contract
queries already receive impressions. Review legal-notice and property pages next,
according to the matters the advocate actually accepts. For each page:

- Answer one distinct question: who the service is for, common situations,
  documents to prepare, process and realistic limitations, and local court context.
- Provide clear factual contact details and a relevant link to the contact form.
  Keep related-guide links useful; avoid repeating the same keywords in every heading.
- Have the advocate check legal accuracy, factual credentials and review dates.
  Do not invent outcomes, client numbers, testimonials or authorship.
- Use a concise title describing the service and location. Measure before changing
  it again. Google may rewrite the displayed title or description.

Do not create near-identical pages for every neighborhood. Consolidate overlapping
pages only after checking their content, Search Console URLs and redirect needs.

### Step 4: verify the existing Google Business Profile

The project already contains a profile link in `content/firm.ts`; confirm ownership
and accuracy rather than creating another profile. In the profile editor, verify
real business name, category, map pin, address, phone, hours and website URL. Keep
these consistent with the site. Add factual office photos where appropriate.
Have the advocate assess applicable professional-conduct rules before promotions,
review solicitation or advertising. Do not buy reviews or offer incentives.

### Step 5: measure relevant enquiries and keep the site dependable

The application already emits `click_call`, `click_whatsapp`, `click_email`,
`submit_enquiry_success`, and failure events when PostHog is configured. These are
contact actions, not confirmed new clients; a phone/WhatsApp click may not result
in a conversation. Verify the existing analytics setup before adding another tracker.
Keep names, phone numbers, emails, message contents and legal case facts out of
analytics. Maintain a private, minimal tally of qualified enquiries and their source.

Weekly: check Search Console, broken links, mobile contact actions and delivery
errors. Monthly: compare 28-day clicks/impressions by page and query, and reconcile
qualified enquiries by source. Do not judge success by raw traffic or promise a
ranking target. Use an uptime monitor and deployment alerts, and review dependency
security updates. Run PageSpeed Insights on home, service and contact pages before
choosing performance work; no current Core Web Vitals diagnosis was available.

### Step 6: publish useful information and reassess

Over the next month, improve one existing service page and one related guide at a
time, based on genuine client questions and the advocate's review. Examples include
what to bring to a contract-review consultation and how to organize documents after
a legal notice. Clearly separate general information from advice on a specific case.
Finish native Telugu/Hindi legal review instead of scaling unfinished translations.

Reassess after deployment and a reasonable recrawl period using Search Console's
query/page/device breakdowns and the enquiry tally. SEO changes can take weeks or
longer to show an effect; neither indexing nor more enquiries is guaranteed.

### Coverage export follow-up: 21 October 2026

The supplied Coverage ZIP ends on **12 October 2026**. Its latest chart row reports
18 not-indexed URLs and zero indexed URLs. The issue table attributes 18 URLs to
**Crawled – currently not indexed**. It supplies no affected URL examples or
URL Inspection details. The issue table also says Validation: Passed; that status
must not be read as confirmation that the 18 URLs are indexed.

The chart predates the user's reported deployment of the fixes. Its zero-indexed
count also needs reconciliation with the separate performance export showing
homepage impressions and clicks: confirm the property, latest report update,
filters and URL Inspection result before treating it as a current site-wide count.
The 18 known URLs do not establish the state of all 108 current sitemap URLs.

**Next diagnostic:** open the exclusion reason, export its example URLs, and inspect
one affected English service page and one localized page. Record last crawl date,
page fetch/indexing permissions, referring page/sitemap, declared canonical and
Google-selected canonical. If Google has not crawled since deployment, the old
report cannot evaluate the fix. Use Test live URL to check present accessibility;
the live test is not proof of indexing. Request indexing for a few corrected,
important pages, then track their next crawl and status rather than repeatedly
resubmitting every URL.

Run `pnpm qa:crawl-signals http://localhost:3000` against a local production server,
or pass the deployed base when network access permits. This verifies direct HTTP
200 responses, self-canonicals, absence of noindex directives, metadata and
server-rendered main content on every sitemap URL. It cannot certify Google
indexing, robots.txt interpretation, legal accuracy, performance or ranking.

The subsequent **Coverage Drilldown** ZIP supplies the 18 URL examples. Recorded
last-crawl dates range from **29 May to 22 July 2026**: eight English URLs, six Hindi
URLs and four Telugu URLs. Examples include `/`, `/practice`, `/practice/corporate`,
`/practice/criminal`, `/contact`, and localized practice/about/privacy pages. No
resource article appears in this list, so the resource canonical defect alone
does not explain these exclusions. English pages are affected too; incomplete
translations cannot be assumed to be the sole cause.

These historical crawl dates do not evaluate the October deployment. Inspect an
affected service URL such as `/practice/corporate` or `/practice/criminal` now and
record its current indexed result, last crawl and selected canonical. The homepage
is also listed despite later homepage search impressions in the performance export;
reconcile this using current URL Inspection rather than claiming that the homepage
is presently absent from search. Prioritize service and contact pages; indexing a
privacy page is not a primary lead-generation goal. Do not change URLs or remove
localized pages solely because they occur in this historical list.

Remaining review priorities beyond writing new posts:

- Check localized **body content**, not just translated metadata and menus. Many
  service and resource bodies remain English on `/hi` and `/te`. Complete human
  translations, or decide which versions should be publicly indexed; do not
  automatically remove or noindex every localized page without URL evidence.
- Review overlapping service/hub/guide pages for distinct purpose. Consolidate
  genuine duplicates with permanent redirects only after reviewing affected URLs.
- Verify factual credentials and cite exact primary sources for legal statements
  and statistics. Do not invent reviewer names, review dates or experience.
- Measure mobile Core Web Vitals using Search Console and PageSpeed Insights.
  Prioritize measured LCP/INP/CLS failures rather than adding speculative changes.
- Earn relevant references from legitimate professional/community sources where
  appropriate under applicable conduct rules. Avoid purchased links, fake traffic
  and automated directory submissions. Technical correctness alone cannot supply
  demand, reputation or editorial references from other sites.

Treat crawl configuration and regression tests as setup/maintenance work; treat
index coverage, legal accuracy, useful service information, reputation and enquiry
delivery as ongoing responsibilities. There is no technical setting that guarantees
indexing, traffic or enquiries.


### Focused visibility and mobile improvements: 21 October 2026

This change differentiates the homepage (practice introduction), corporate overview
(business issue and next-step selection) and commercial-contracts page (drafting,
review and document preparation). Their English search titles and descriptions
now reflect those purposes. The homepage headline is shorter in all three locales.
Corporate and contracts introductions include source-aware enquiry and direct-call
links with 44px minimum target height. The homepage includes a contract-guide link
and call option, and the location section links directly to office directions.
Corporate content explains starting points; the contract page adds a preparation
checklist, scope/fee discussion and guidance on sharing confidential documents.

Mobile sticky contact links now derive their accessible names from the visible
labels instead of overriding them with mismatched aria-label text. New controls
have English, Hindi and Telugu labels; existing untranslated long-form content
still requires the previously documented review.

The baseline mobile Lighthouse audit found three unused font preloads totaling
253,475 transferred bytes. The CSS uses its Helvetica/Arial stack rather than the
Next font variable, so preloading the unused family was disabled. The computed
font stack is unchanged, and the final audits downloaded zero font files.

Local production-build Lighthouse results, using Lighthouse 12.8.2 and Chromium
with simulated mobile throttling:

| Page | Performance | Largest contentful paint | Accessibility | Best practices |
|---|---:|---:|---:|---:|
| Homepage before this change | 87 | 3.8 s | 100 | 100 |
| Homepage after this change | 98 | 2.2 s | 100 | 100 |
| Corporate overview after this change | 99 | 2.0 s | 100 | 100 |
| Commercial contracts after this change | 99 | 2.0 s | 100 | 100 |

These are individual local lab runs, not production field Core Web Vitals or
predictions of search ranking gains. Lighthouse SEO was 92 in the local audits:
it flagged the production canonical versus localhost hreflang locations. Keep
production canonicals intact and re-run against the deployed origin for a live
SEO score. The repaired `pnpm qa:lighthouse [baseUrl]` runner still enforces its
existing 95/100/100/100 thresholds and exits nonzero when any target is missed;
the initial runner execution failed its performance and local SEO thresholds.
The final focused audits meet the performance target; the local SEO condition
remains. The runner now uses valid JavaScript, a pinned Lighthouse version and
argument-based process execution, and includes corporate/contracts alongside the
existing home/criminal targets.

Validation also covered 15 mobile/browser scenarios across 320px, 390px and 768px
widths and all three locales: no horizontal overflow, introductory tap targets,
correct call destinations, enquiry source/locale preservation, reachable form
fields, office directions, disclaimer acceptance persistence and absence of
JavaScript page errors. Build, typecheck, ESLint, BCI lint, internal-link and card
layout checks passed, as did contact analytics, all 108 crawl checks, canonical
and metadata audits, the 87-page H1 check and homepage FAQ checks in all locales.
H1 QA now recognizes the corporate page's updated Law/Matters wording.

Local screenshots, lab reports and browser-check results are under ignored `.qa/`.
Changes are prepared in the checkout; publishing this environment does not deploy
the application. Deploy through the normal Vercel workflow, verify the three pages
on the production origin, and compare Search Console and enquiries after recrawl.
