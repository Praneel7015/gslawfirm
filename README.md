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
pnpm qa              # typecheck + lint + bci + build + candidate production build + 108-page HTTP smoke
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

**Review before release:** Hindi and Telugu content has complete records and
message-key coverage. The service editions are editorial adaptations, not
line-by-line translations. An advocate fluent in each language must review
terminology and equivalence before release. See the implementation evidence
below for unavailable browser checks and business-information discrepancies.

**CI:** GitHub Actions runs `pnpm qa`, including static QA, one production
build, a local production server, and HTTP checks against that candidate.
The pre-commit hook runs the BCI check with Node's `tsx` loader.

---

## SEO architecture

```
lib/seo.ts                pageMetadata(), alternatesFor(): per-page OG + canonical
lib/localized-metadata.ts Titles + descriptions for every route × locale
lib/jsonld.ts             LegalService, Person, WebSite, Service, Article, Breadcrumb, FAQ, HowTo, ProfilePage
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
| Unique descriptions | 108, 80–165 chars, locally qualified | `qa:metadata-descriptions` |
| Canonicals | Self-referencing per locale | `qa:canonicals` |
| Internal links | Reciprocal between related services | `qa:internal-links` |
| FAQ content/schema consistency | Homepage | `qa:homepage-faq-schema` |
| Procedure guides | Useful visible steps; no Google HowTo enhancement promise | Content review |
| ProfilePage schema | About page (E-E-A-T) | Rich Results Test |
| AI visibility | llms.txt + llms-full.txt + JSON-LD | `qa:ai-visibility` |
| Security headers | nosniff, DENY, referrer-policy, permissions-policy | Response headers |
| Lighthouse (mobile) | Perf ≥ 95, A11y 100, BP 100, SEO 100 | `qa:lighthouse` |

---

## License

All rights reserved. Internal client project, not for redistribution.

## SEO and mobile implementation evidence · 1 November 2026

This local pass starts at `65e798e`. Public paths, the domain, branding and
contact analytics event names are retained. Criminal litigation and bail now
lead the homepage. Shared mobile reading rules use 22px gutters, 56px section
spacing, 16px reading text, 14px secondary text, relaxed headings and script
font fallbacks. A ResizeObserver reserves the actual sticky-bar height for
translated labels, safe areas and enlargement. Native dialogs coordinate focus,
background inertness, restoration and scroll locking.

`content/localized-guides.ts`, `localized-practice.ts`, `localized-resources.ts`
and `messages/{en,hi,te}.json` provide typed content and complete locale records.
English long-form resource content lives in `content/resource-body.ts`.
Hindi/Telugu service editions are shorter editorial adaptations with their own
checklists and links; professional review must confirm substantive equivalence.
Do not describe this as a certified legal translation. Publication dates remain
20 September 2026; resource modification dates reflect this pass. All 36 route
families receive updated content or explicit social metadata, so their sitemap
modification date is 1 November 2026. `Article` identifies the firm as publisher;
no individual authorship or professional-review credit has been invented.

Reviewed workflows:

- [SEO audit skill](https://github.com/coreyhaines31/marketingskills/blob/main/skills/seo-audit/SKILL.md)
- [Playwright skill](https://github.com/openai/skills/blob/main/skills/.curated/playwright/SKILL.md)

Google no longer offers FAQ rich results, and HowTo rich results were retired.
FAQ/HowTo vocabulary retained in the source is descriptive only and does not
promise enhanced search display. See [Google Search documentation updates](https://developers.google.com/search/updates).
`llms.txt` is optional supporting material, not a Google indexing/ranking feature.

### Source and professional-review register

- [MHA parliamentary reply, 7 February 2024](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2003505)
  verifies **15,297 registered cyber crimes in Telangana in 2022** and the
  1930 reporting helpline. The old rank, approximate fraud share, undated civil
  pendency total, unverified consumer/criminal totals and local duration estimate
  have been withdrawn. Reporting years 2022 and 2022–23 remain historical.
- [BNSS: official NCRB text](https://cytrain.ncrb.gov.in/staticpage/web_pages/ChaptersBNSS.html)
  distinguishes regular-bail powers (478/480/483), anticipatory bail (482), and
  High Court inherent powers (528). Applicability and transitional cases still
  need case-specific review. English practice text now names both CrPC 482 and
  BNSS 528 for quashing.
- [NI Act, India Code](https://www.indiacode.nic.in/bitstream/123456789/2189/1/a1881-26.pdf)
  is the statutory reference for the 30-day demand-notice window, 15-day payment
  opportunity and one-month complaint period. Direct full-document retrieval
  timed out in this environment; counsel must confirm calculation, service,
  exceptions and current amendments. These are separate windows, not a single
  30-day waiting period.
- The remaining general property, consumer, succession, limitation, privacy and
  procedural statements need advocate review; the technical checks do not certify
  their accuracy. Old portal-specific land-record instructions have been qualified
  because the current Telangana portal could not be verified here.
- The placeholder enrolment numbers have been removed from the founder record
  and visible profile. The general Telangana Bar Council enrolment statement is
  retained from existing business content; no verified registration number was supplied.
- Both Maps short links in `content/firm.ts` were inaccessible to the web tool.
  The stored approximate coordinates are **17.464, 78.366**, while the existing
  embedded map centers on **17.460733, 78.346805**. These are different positions;
  neither is newly asserted as verified. Existing address, links, embed, phone and
  email are preserved. Confirm the correct office pin and Business Profile with
  the owner before changing them.
- Windsor.ai is unconnected. No Search Console/Business Profile baseline or
  contact-action counts have been obtained. If connected later, record the prior
  28 complete days of query/page impressions, clicks and local contact actions.

### Reproduce candidate checks

```bash
pnpm qa                       # builds once; tests only the local candidate server
pnpm qa:localization          # all locale records and message parity
pnpm qa:rendered --static     # generated HTML when localhost binding is blocked
pnpm qa:h1 --static
pnpm qa:homepage-faq-schema --static
QA_BROWSER=1 QA_LIGHTHOUSE=1 pnpm qa:production
```

`qa-production.mjs` waits for readiness and shuts the server down on success,
failure or interruption. It fails explicitly if the server cannot bind. TypeScript
QA uses `node --import tsx`, avoiding the tsx CLI's IPC socket requirement.
The Playwright CLI tool cache stays project-local in `.qa/npm-cache`; captures go
to `output/playwright/{before,after}`. `QA_CAPTURE_LABEL=before` is for a separately
built checkout of `65e798e`; never label candidate screenshots as a baseline.

The browser runner checks all 108 pages at 390px, plus home, practice, criminal,
bail, a long article, resources, statistics, about, contact and disclaimer in all
languages at 320/360/390/430/1440px. It captures 200% CSS-enlargement comparisons
and exercises native dialogs, language switching and six intercepted form
responses. It is restricted to localhost, and intercepts every lead request.
Manual inspection is still required for glyph shaping, contrast, spacing,
heading wraps, true browser text-size preferences and desktop visual fidelity.
No real enquiry should be submitted during QA.

Localhost binding failed with `listen EPERM` in the implementation sandbox;
shell downloads failed DNS resolution (`EAI_AGAIN`). Before/after screenshots,
browser interactions, HTTP availability and measured Lighthouse scores are not
verified here. No live indexing, ranking or deployment improvement is claimed.

Completed local checks: TypeScript, ESLint (two pre-existing configuration export
warnings), BCI lint, localization coverage, lead-source and analytics contracts,
discovery, canonicals, title/description constraints, internal links, AI-signal
checks, step-layout checks and the production build. Generated HTML passes the
108-page rendered audit and H1 audit; all three homepage FAQ graphs match their
five visible questions. The combined QA command deliberately ends in failure
when localhost binding is denied; this is not an HTTP or browser pass.
