# GS Law Firm — website

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
cp .env.example .env    # fill in values locally — .env is never committed
pnpm dev                # http://localhost:3000
pnpm typecheck
pnpm lint
pnpm lint:bci
pnpm check:env          # sanity-check .env without printing secrets
pnpm build
```

---

## Deploy (Vercel)

1. Import repo at [vercel.com/new](https://vercel.com/new) — **Root Directory**: `gslawfirm`
2. Set environment variables (Production + Preview), then **Deploy**
3. Add domain `sunitha.sindhole.com` in Vercel → point Cloudflare DNS:
   - **CNAME** `sunitha` → `cname.vercel-dns.com` — **grey cloud** (DNS only)
4. After changing any `NEXT_PUBLIC_*` variable, **redeploy** (baked at build time)

### Required env vars (production)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://sunitha.sindhole.com` |
| `RESEND_API_KEY` | Contact form → email (Resend) |
| `RESEND_FROM` | `GS Law Firm <noreply@sunitha.sindhole.com>` |
| `LEAD_NOTIFY_TO` | `sunithags@gmail.com` |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Cloudflare Web Analytics |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console HTML tag value |

### Optional

| Variable | Purpose |
|---|---|
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Rate limit 5/h/IP (recommended) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Bot challenge — set **both** or **neither** |
| `NEXT_PUBLIC_GA_ID` | GA4 — off by default (needs consent banner) |

Copy `.env.example` for the full list and comments.

---

## Email & DNS (summary)

- **Inbound**: `sunitha@sindhole.com` → Cloudflare Email Routing → Gmail
- **Outbound** (form leads): Resend, domain `sindhole.com` verified in Resend
- **DNS**: domain registered on Cloudflare; site served by Vercel

If the form returns **429**, you hit the rate limit — wait an hour or
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
`docs/` **locally only** — not in this repository.

---

## Tech stack

- Next.js 15 (App Router), TypeScript strict, Tailwind CSS v4
- `next-intl` — English at `/`, Telugu `/te`, Hindi `/hi`
- React Hook Form + Zod · Resend · Upstash Redis · Cloudflare Turnstile
- Cloudflare Web Analytics (primary) · JSON-LD, sitemap, dynamic OG images

---

## BCI compliance

1. First-visit disclaimer modal (`components/legal/DisclaimerModal.tsx`)
2. Content linter: `pnpm lint:bci` — scans for banned superlatives

---

## QA (M10)

```bash
pnpm qa              # typecheck + lint + bci + build + route smoke (35 URLs)
pnpm qa:routes       # HTTP 200 check only
pnpm qa:lighthouse   # mobile Lighthouse on / and /practice/criminal
pnpm check:env       # local .env sanity check
```

**Targets (mobile Lighthouse):** Performance ≥ 95 · Accessibility 100 ·
Best Practices 100 · SEO 100 — on `/` and `/practice/criminal`.

**Live URL:** <https://sunitha.sindhole.com>

**Known launch notes:** Telugu/Hindi long-form strings marked
`[TRANSLATION PENDING]` in `messages/te.json` and `messages/hi.json`
await native legal review before those locales go fully live.

**CI:** GitHub Actions runs typecheck, ESLint, BCI lint, and build on
every push to `main`. Local pre-commit hook runs `pnpm lint:bci`.

---

## License

All rights reserved. Internal client project — not for redistribution.
