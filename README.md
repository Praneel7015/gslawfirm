# GS Law Firm — website

Production site for **GS Law Firm**, a solo-advocate practice in
Kondapur, Hyderabad. Built with Next.js 15, Tailwind CSS v4, and
`next-intl`. Three locales (`en`, `te`, `hi`), Bar Council of India
compliant copy, server-side rendered for SEO.

- **Live**: <https://sunitha.sindhole.com> *(once deployed)*
- **Future domain**: `gslawfirm.in` — see [`docs/DOMAIN_MIGRATION.md`](docs/DOMAIN_MIGRATION.md)
- **Repository**: <https://github.com/Praneel7015/gslawfirm>

---

## Quick start

Requires Node ≥ 20 and pnpm 9.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck    # strict TypeScript
pnpm lint         # ESLint via next-lint
pnpm lint:bci     # scan content for BCI-banned superlatives
pnpm build        # production build
```

## Project structure

```
app/[locale]/        per-locale pages (home, about, practice/*, contact, privacy, disclaimer)
components/
  brand/             logo + practice-area icons
  layout/            Header, Footer, LanguageSwitcher, MobileMenu
  sections/          home-page composables (Hero, Practice, Approach, Founder, Location, ContactForm)
  legal/             DisclaimerModal (BCI first-visit), WhatsAppFab, MobileStickyBar
content/             typed source-of-truth for firm details + practice areas
i18n/                next-intl routing + request config
lib/                 utils, fonts, site URL, lead form schema
messages/            en/te/hi message catalogues
public/              static assets (logo SVG, fonts)
scripts/             BCI language linter
docs/                operational playbooks (see below)
```

## Documentation

Operational docs live in [`docs/`](docs/):

| Doc | When to read |
|---|---|
| [`CLOUDFLARE_SETUP.md`](docs/CLOUDFLARE_SETUP.md) | First-time setup of DNS, Email Routing, Resend domain verification, and optional Turnstile / Web Analytics / Bot Fight Mode on Cloudflare. Read before first deploy. |
| [`DOMAIN_MIGRATION.md`](docs/DOMAIN_MIGRATION.md) | The eventual cut-over from `sunitha.sindhole.com` to `gslawfirm.in`. Read when the new domain is procured. |
| [`BACKEND_SETUP.md`](docs/BACKEND_SETUP.md) | *(added in M6)* — Resend domain verification + Upstash rate-limit setup. Read before going live with the contact form. |

The `build-prompt.md` at the project root is the original spec — kept
in-repo as a reference, not a live document.

## Tech stack

- **Framework**: Next.js 15 (App Router) with TypeScript (strict)
- **Styling**: Tailwind CSS v4 with `@theme` design tokens (see `app/globals.css`)
- **i18n**: `next-intl` v3 — `en` (default, no prefix), `te`, `hi`
- **Forms**: `react-hook-form` + `zod` (schema in `lib/lead-schema.ts`)
- **Email**: Resend *(wired in M6)*
- **Rate limit**: Upstash Redis *(wired in M6, falls back to in-memory)*
- **Lead storage**: **none** — leads forward straight to the founder's inbox via Resend. No DB.

## Domain & email — current setup

- **Site domain**: `sunitha.sindhole.com` — DNS on Cloudflare, served by Vercel
- **Public email**: `sunitha@sindhole.com` — Cloudflare Email Routing forwards to `sunithags@gmail.com`
- **Outbound email** (lead notifications, future system mail): Resend with `sindhole.com` verified
- See [`docs/CLOUDFLARE_SETUP.md`](docs/CLOUDFLARE_SETUP.md) for step-by-step

## Environment variables

Copy `.env.example` → `.env.local` for local dev, or set in Vercel's
project settings for deployed environments. See `.env.example` for the
authoritative list; minimum required for production are:

- `NEXT_PUBLIC_SITE_URL` — canonical URL (only changes during domain migration)
- `RESEND_API_KEY` + `RESEND_FROM` + `LEAD_NOTIFY_TO` — contact form notifications
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID
- `NEXT_PUBLIC_GSC_VERIFICATION` — Google Search Console verification token

Upstash keys (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) are
optional — the rate limiter falls back to in-memory if they're unset.

## BCI compliance

Bar Council of India rules forbid advocate advertising and superlative
language. Two guards are in place:

1. **First-visit disclaimer modal** — `components/legal/DisclaimerModal.tsx`
   blocks the site behind a "I Agree" prompt on first visit and stores
   the consent in `localStorage`.
2. **Content linter** — `pnpm lint:bci` runs `scripts/check-bci-language.ts`
   over all `messages/`, `content/`, and `components/` files looking
   for banned superlatives (*best, leading, expert, guaranteed, no. 1,
   most experienced, etc.*). Wire this into pre-commit when CI lands.

## License

All rights reserved. Internal client project — not for redistribution.
