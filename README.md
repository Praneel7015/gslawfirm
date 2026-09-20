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
app/sitemap.ts            93 entries with hreflang, stable lastModified dates
public/llms.txt           AI-discoverable site summary for LLM crawlers
public/llms-full.txt      Extended AI-discoverable per-page guide
scripts/qa-*              Automated checks: canonicals, titles, descriptions, links, FAQs, AI visibility
```

| Signal | Target | QA Script |
|--------|--------|-----------|
| Sitemap entries | 93 (31 routes × 3 locales) | `qa:discovery-signals` |
| Unique page titles | 93, branded + locally qualified | `qa:metadata-titles` |
| Unique descriptions | 93, 80–170 chars, locally qualified | `qa:metadata-descriptions` |
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
