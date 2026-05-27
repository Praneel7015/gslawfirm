# GS Law Firm — Claude Code Build Prompt

> Paste this into Claude Code inside an empty repo folder. Have the 4 logo assets ready:
> `0.jpeg` (banner — reference only), `main.jpeg` (square logo), `logo only.jpeg` (razorbill mark only), `alt.jpeg` (horizontal lockup).

---

Build the production website for **GS LAW FIRM** — a solo-advocate legal practice in Kondapur, Hyderabad, India. This is a real client deployment, not a demo. Treat every decision accordingly.

═══════════════════════════════════════════
## 1. STACK & INFRASTRUCTURE
═══════════════════════════════════════════

- **Framework**: Next.js 15 (App Router) + TypeScript (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Forms**: react-hook-form + zod validation
- **Email backend**: Resend (lead notifications to `sunithags@gmail.com`)
- **Lead storage**: Supabase (free tier) — table `leads` with columns `id, name, phone, email, message, created_at, ip, user_agent`
- **i18n**: `next-intl` with locales `en` (default), `te` (Telugu), `hi` (Hindi)
- **Analytics**: Google Analytics 4 + Google Search Console verification meta tag (use env vars, don't hardcode)
- **Hosting target**: Vercel (configure `vercel.json` for ISR + edge headers). Client may move to Cloudflare Pages later — keep the build framework-agnostic enough that this is a no-op.
- **Domain**:
  - **Initial**: `sunitha.sindhole.com` (subdomain — confirm DNS is owned by client)
  - **Future**: `gslawfirm.in` (client will procure later; design env vars and canonical URLs so the migration is one env var change + a 301 redirect rule)
- **Node version**: pin in `.nvmrc` to `20`.

═══════════════════════════════════════════
## 2. PROJECT STRUCTURE
═══════════════════════════════════════════

```
app/
  [locale]/
    layout.tsx                 # html lang, fonts, GA, disclaimer provider, WhatsApp FAB
    page.tsx                   # Home
    about/page.tsx
    practice/
      page.tsx                 # index of areas
      [slug]/page.tsx          # criminal, civil, corporate, will-succession, high-court
    contact/page.tsx
    privacy/page.tsx
    disclaimer/page.tsx
  api/
    lead/route.ts              # POST → validate, store in Supabase, send Resend email
    health/route.ts
  sitemap.ts
  robots.ts
components/
  layout/Header.tsx Footer.tsx LanguageSwitcher.tsx
  sections/Hero.tsx PracticeGrid.tsx FounderBlock.tsx LocationBlock.tsx ContactForm.tsx
  ui/                          # shadcn primitives
  legal/DisclaimerModal.tsx WhatsAppFab.tsx MobileStickyBar.tsx
content/
  practice-areas.ts            # typed source of truth for all 5 areas
  founder.ts
  firm.ts
messages/
  en.json te.json hi.json
public/
  logo-horizontal.svg          # use attached asset
  logo-square.svg
  logo-mark.svg                # razorbill only — also use for favicon set
  og-default.jpg               # generate 1200x630 with logo + tagline
```

═══════════════════════════════════════════
## 3. BRAND ASSETS (4 PROVIDED IMAGES)
═══════════════════════════════════════════

Save all 4 to `/public`. Convert JPEGs to SVG where possible (trace the bird outline as inline SVG for crisp rendering at any size and so we can recolor via `currentColor`).

- Banner asset (`0.jpeg`) → reference only for hero copy
- Square logo (`main.jpeg`) → `/public/logo-square.svg`
- **Razorbill mark only** (`logo only.jpeg`) → `/public/logo-mark.svg` + generate `favicon.ico`, `apple-touch-icon.png` (180px), `icon-192.png`, `icon-512.png`, web manifest
- Horizontal lockup (`alt.jpeg`) → `/public/logo-horizontal.svg`

> The bird in the mark is a **razorbill** — note the blunt, vertically-grooved beak. Use this term in alt text and any internal documentation. Razorbills mate for life and return to the same colony year after year — this informs the firm's positioning around continuity.

═══════════════════════════════════════════
## 4. DESIGN TOKENS (Tailwind v4 `@theme`)
═══════════════════════════════════════════

**Colors:**
```
--color-ink: #0A0A0A          (near-black, body)
--color-paper: #FAFAF7        (off-white, bg)
--color-accent: #6B0F1A       (oxblood — PRIMARY ACCENT, sparing)
--color-accent-alt: #B8924A   (muted gold — ASK CLIENT which to use; build both as CSS vars and a single theme switch)
--color-muted: #6B6B6B
--color-line: #E5E5E0
```

**Type:**
```
--font-display: "Geist", system-ui   (matches logo wordmark)
--font-body: "Inter", system-ui
```
Scale: `14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 80` (use `clamp()` for fluid).

**Spacing**: extended Tailwind scale with `18, 22, 26` units for editorial whitespace.
**Radius**: `0` (sharp corners only — matches minimalist logo).
**Shadows**: none by default; subtle `0 1px 0` line dividers instead.

═══════════════════════════════════════════
## 5. CONTENT (use verbatim — do NOT paraphrase)
═══════════════════════════════════════════

**FIRM:**
```
name: "GS Law Firm"
established: 2023
address: "Kondapur, Sri Ramnagar — Block C, Gachibowli, Hyderabad, Telangana 500084"
phone: "+91 99638 47704"
whatsapp: "919963847704"
email: "sunithags@gmail.com"
hours: "Monday–Saturday · 10:00 AM – 6:00 PM"
mapsUrl: "https://maps.app.goo.gl/HVwsKMdryv2yUWnn7"
linkedin: "https://www.linkedin.com/in/sunitha-sindhole-074939212/"
tagline: "For your peace of mind. Forever."
```

**FOUNDER:**
```
name: "Adv. Sunitha Sindhole"
credentials: "LL.M · LL.B · M.Sc · B.Sc"
experience: "10+ years"
education: "Padala Ram Reddy College of Law"
barCouncil: "Enrolled with the Bar Council of Telangana — Reg. No. [PLACEHOLDER]"
```
**bio**: write 2 paragraphs in restrained, BCI-compliant prose. No superlatives. State practice focus is criminal prosecution and civil litigation, with additional work in corporate, succession, and High Court matters. Include one understated line about the razorbill symbolism (returns to the same shore year after year → continuity of counsel).

**HERO (verbatim from client banner):**
- Line 1: *"Everyone's there for your next case."*
- Line 2: *"Who's there for the one after?"*
- Line 3: *"That's us."*
- Sub: *"A practice built around continuity — counsel that stays with you beyond the verdict."*

**PRACTICE AREAS (5):**

| slug | display name | priority |
|------|--------------|----------|
| `criminal` | Criminal Litigation | **PRIMARY — most prominent in nav/SEO** |
| `civil` | Civil & Property Disputes | secondary |
| `corporate` | Corporate & Commercial | tertiary |
| `will-succession` | Wills, Trusts & Succession | tertiary |
| `high-court` | High Court Matters | tertiary |

For each: 2-paragraph plain-English explanation + 4–6 bullet *"what we handle"* list. Write the copy yourself; keep it factual, no claims of outcomes.

═══════════════════════════════════════════
## 6. SEO (CRITICAL — primary client goal)
═══════════════════════════════════════════

**Target geography**: Kondapur, Gachibowli, Madhapur, Miyapur, Kukatpally, Hitech City, Manikonda, Raidurg, Nanakramguda, Financial District, Rethibowli — all Hyderabad West.

**Target queries**: *"criminal lawyer in Kondapur"*, *"advocate near me Kondapur"*, *"criminal lawyer Hyderabad"*, *"civil lawyer Gachibowli"*, *"GS Law Firm Hyderabad"*, *"Sunitha Sindhole advocate"*, *"property lawyer Kondapur"*.

**Implement:**

- Per-page `generateMetadata` with unique title (≤60 chars) + description (≤155 chars) + canonical
- OpenGraph + Twitter cards
- **JSON-LD on EVERY page**:
  - `LegalService` schema on home (name, image, address with full `PostalAddress` incl. geo, telephone, `openingHoursSpecification`, `areaServed` = list of all target neighborhoods, `founder` = Person)
  - `Person` schema for founder
  - `Service` schema on each practice page
  - `BreadcrumbList` where applicable
  - `LocalBusiness` with `@type LegalService` — important for Google Business Profile linking
- `sitemap.ts` that emits all routes × all locales with `hreflang`
- `robots.ts` allowing all, sitemap reference
- Image alt text on every image — descriptive, keyword-aware but natural
- Semantic HTML: one `h1` per page, proper `h2`/`h3` hierarchy
- Internal linking: every practice page links to 2 others + home + contact
- Page speed: `next/image` for all rasters, font preload via `next/font`, no client JS on static sections (server components by default)
- Google Search Console verification via env var `NEXT_PUBLIC_GSC_VERIFICATION`

═══════════════════════════════════════════
## 7. BCI COMPLIANCE (NON-NEGOTIABLE)
═══════════════════════════════════════════

- First-visit disclaimer modal, blocks the site until **"I Agree"** clicked. Store agreement in `localStorage` key `gs-bci-ack-v1`. Body text:

  > *The Bar Council of India does not permit advertisement or solicitation by Advocates in any form. By proceeding further and clicking 'I Agree', the user acknowledges the following: (1) there has been no advertisement, personal communication, solicitation, invitation or inducement of any sort whatsoever from GS Law Firm or any of its members to solicit any work through this website; (2) the user wishes to gain more information about GS Law Firm for his/her own information and use; (3) the information provided on this website is solely available at the user's request for informational purposes only; (4) no material/information provided on this website should be construed as legal advice; (5) GS Law Firm shall not be liable for consequences of any action taken by relying on the material/information provided on this website.*

  Buttons: **"I Agree"** / **"Exit"** (Exit → `window.location = 'https://www.google.com'`).

- **Lint pass** to ensure NO occurrences of: *best, top, leading, no.1, #1, expert, specialist, guaranteed, winning, successful track record, most experienced*. Add this as a build-time check (`scripts/check-bci-language.ts`) that scans all markdown/content files and fails CI on violation.
- `/privacy` and `/disclaimer` pages with full text.
- Contact form footer microcopy: *"Submitting this form does not create an attorney-client relationship."*

═══════════════════════════════════════════
## 8. CONTACT FORM (server action)
═══════════════════════════════════════════

**Fields**: `name` (required, 2–80 chars), `phone` (required, validate Indian mobile regex), `email` (required, valid), `message` (required, 10–2000 chars). Honeypot field `website` hidden — reject if filled. Rate limit by IP via Upstash (5 submissions/hour) — if Upstash not configured, fall back to in-memory limiter with warning log.

**Flow**: `POST /api/lead` → zod validate → insert Supabase → send Resend email to `sunithags@gmail.com` with formatted lead → return 200 with toast confirmation. On failure, log to console and show user-friendly error. **Never expose internal errors.**

═══════════════════════════════════════════
## 9. RESPONSIVE / A11Y
═══════════════════════════════════════════

- Mobile-first. Breakpoints: `640, 768, 1024, 1280, 1536`.
- Mobile sticky bottom bar (Call / WhatsApp / Email) appears below 768px.
- WhatsApp FAB visible all sizes, bottom-right, above sticky bar on mobile.
- All interactive elements ≥ 44px touch target.
- Keyboard navigable, visible focus rings (2px accent outline).
- WCAG AA contrast minimum verified.
- `prefers-reduced-motion` respected.
- Skip-to-content link.

═══════════════════════════════════════════
## 10. i18n
═══════════════════════════════════════════

- Three locales: `en` (default), `te`, `hi`. URL pattern `/en/...`, `/te/...`, `/hi/...`.
- Translate **ALL** user-visible strings via `next-intl` message catalogs.
- For Telugu and Hindi, generate accurate translations of nav, hero, practice area names, form labels, disclaimer, footer. Founder bio and practice descriptions: provide English first, mark `te`/`hi` as `[TRANSLATION PENDING — DO NOT SHIP UNTRANSLATED]` so the client knows to commission native review.
- Language switcher preserves current route across locales.
- `hreflang` tags emitted correctly.

═══════════════════════════════════════════
## 11. DELIVERABLES & QUALITY GATES
═══════════════════════════════════════════

Before declaring done:

- `pnpm build` passes with zero TS errors and zero ESLint errors
- Lighthouse mobile scores **≥ 95 Performance / 100 Accessibility / 100 Best Practices / 100 SEO** on home + one practice page
- All 5 practice routes resolve, all 3 locales resolve, `sitemap.xml` renders with 18+ urls × 3 locales
- The BCI-language check script passes
- A `.env.example` with every required key documented (`RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`, `NEXT_PUBLIC_SITE_URL`)
- A `README.md` with: local dev steps, env setup, Supabase schema SQL, Resend domain verification steps, Vercel deploy instructions, Google Search Console setup walkthrough, **Google Business Profile creation reminder** (huge for local SEO — equally or more important than the website itself), and a note on how to switch the canonical domain when `gslawfirm.in` is procured.

═══════════════════════════════════════════
## 12. WORK ORDER
═══════════════════════════════════════════

Execute in this order. **Stop and report after each milestone** — don't run all the way through.

| # | Milestone |
|---|-----------|
| **M1** | Scaffold Next.js, Tailwind v4, shadcn, next-intl, env scaffolding, brand tokens, fonts, logo SVGs in `/public`. Report. |
| **M2** | Layout shell: Header, Footer, DisclaimerModal, WhatsAppFab, MobileStickyBar, LanguageSwitcher. Report. |
| **M3** | Home page (all sections, English only first). Report with screenshot of mobile + desktop. |
| **M4** | Practice areas (index + 5 detail pages). Report. |
| **M5** | About + Contact + Privacy + Disclaimer pages. Report. |
| **M6** | Contact form server action + Resend + Supabase + rate limit. Test with a real submission. Report. |
| **M7** | SEO pass: JSON-LD on every page, sitemap, robots, metadata, OG image generation. Report. |
| **M8** | i18n: translate to `te` + `hi` (mark long-form copy as pending). Report. |
| **M9** | BCI language linter + CI script. Report. |
| **M10** | Final QA: Lighthouse, axe, build, deploy preview to Vercel. Report URL. |

═══════════════════════════════════════════
## NON-NEGOTIABLES SUMMARY
═══════════════════════════════════════════

- BCI compliant. No superlatives. Disclaimer modal works.
- Hero copy verbatim from the banner image.
- Logo assets used as provided, not regenerated. The bird is a **razorbill** — name it correctly in alt text.
- Real Supabase + Resend wiring, not stubs.
- Lighthouse ≥95 mobile.
- All 3 languages routable even if long-form copy isn't translated yet.
- Canonical URL driven by `NEXT_PUBLIC_SITE_URL` so the future move from `sunitha.sindhole.com` → `gslawfirm.in` is one env var change.

**Begin with M1. Confirm the accent color choice with me (oxblood vs gold) at the end of M1 before proceeding.**
