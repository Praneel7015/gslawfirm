# Getting started — from zero to live site

> **You are here**: code is written and pushed to GitHub. Nothing else
> is set up — no Vercel, no domain, no email, no analytics.
> This doc walks you from that state to **live, working site with a
> functioning contact form** in ~90 minutes total.

There are six phases. Do them in order. Each phase ends with a verify
step — don't move on if it didn't work.

| # | Phase | Required? | Time |
|---|---|---|---|
| 1 | Deploy to Vercel | Yes | ~15 min |
| 2 | Cloudflare DNS — point the domain | Yes | ~15 min |
| 3 | Email — Resend + Cloudflare Email Routing | Yes | ~25 min |
| 4 | Spam protection — Upstash + Turnstile | Optional | ~15 min |
| 5 | Analytics + SEO — Cloudflare Analytics + GSC | Recommended | ~15 min |
| 6 | Google Business Profile | **Critical for local SEO** | ~10 min |

You can pause after Phase 3 — the site will be live, on your domain,
with a working contact form. Phases 4–6 are upgrades.

---

## Accounts you'll need

Create these now so you're not switching tabs mid-phase. All are free.

- [ ] [GitHub](https://github.com) — you already have one
- [ ] [Vercel](https://vercel.com) — sign in with GitHub
- [ ] [Cloudflare](https://cloudflare.com) — domain is already here
- [ ] [Resend](https://resend.com) — sign in with GitHub for fastest signup
- [ ] [Upstash](https://upstash.com) (Phase 4) — sign in with GitHub
- [ ] [Google account](https://accounts.google.com) for Search Console + Business Profile

---

## Phase 1 — Deploy to Vercel (15 min)

This gets the site online at a temporary `*.vercel.app` URL. The real
domain comes in Phase 2.

### 1.1 — Import the repo

1. <https://vercel.com/new>
2. "Import Git Repository" → find `Praneel7015/gslawfirm` → **Import**.
3. **Framework Preset**: Next.js (auto-detected) ✓
4. **Root Directory**: `gslawfirm` (the project is in this subfolder
   of the repo).
   - Click **Edit** next to Root Directory.
   - Type `gslawfirm` → Continue.
5. **Build & Output Settings**: leave defaults.

### 1.2 — Environment variables

Before clicking Deploy, expand the **Environment Variables** section.
Add **just this one** for the first deploy (everything else is
optional or comes later):

```
NEXT_PUBLIC_SITE_URL = https://sunitha.sindhole.com
```

> Yes, set this even though the domain isn't connected yet — the value
> is only used for canonical URLs, sitemap, and JSON-LD. The site will
> still load fine at the `.vercel.app` URL.

### 1.3 — Deploy

Click **Deploy**. Wait ~2 minutes. You'll get a URL like
`gslawfirm-xxxx.vercel.app`. Open it.

### ✓ Verify

- Home page loads.
- BCI disclaimer modal appears on first visit. Click "I Agree".
- Try `/about`, `/practice`, `/practice/criminal`, `/contact`.
- Try `/te` and `/hi` — language switcher works.
- Open `/contact` and submit the form with valid info. **The submit
  will succeed** — but the email won't arrive because Resend isn't
  configured yet. That's normal. Look at Vercel → Project → Logs →
  Functions → `/api/lead` and you should see a console-warning that
  says *"RESEND_API_KEY missing — skipping send. Lead was: { ... }"*.

If any of the above fails, check the Build Logs in Vercel for errors.

---

## Phase 2 — Cloudflare DNS (15 min)

This points `sunitha.sindhole.com` at the Vercel deployment.

### 2.1 — Add the subdomain to Vercel

1. Vercel project → **Settings** → **Domains** → **Add**.
2. Enter `sunitha.sindhole.com` → Add.
3. Vercel shows you DNS instructions. Note which one it suggests:
   - **CNAME**: name `sunitha`, value `cname.vercel-dns.com` (preferred)
   - **A**: name `sunitha`, value `76.76.21.21`
4. Leave this tab open — you'll come back after step 2.2.

### 2.2 — Add the DNS record in Cloudflare

1. <https://dash.cloudflare.com> → click the `sindhole.com` zone.
2. Left sidebar → **DNS** → **Records** → **Add record**.
3. Fill in:
   - **Type**: `CNAME`
   - **Name**: `sunitha`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: click the orange cloud to turn it **grey** (DNS only)
   - **TTL**: Auto
4. **Save**.

> ⚠️ **The grey cloud is critical.** Orange cloud routes traffic
> through Cloudflare, which breaks Vercel's automatic SSL renewal.
> Grey cloud = DNS resolution only = Vercel handles SSL itself.
> This catches a lot of people. Double-check before saving.

### 2.3 — Wait for Vercel to detect

Go back to the Vercel Domains tab. Within ~30 seconds, it should
flip from "Invalid Configuration" to "Valid Configuration" and start
issuing the SSL certificate. Total wait: 1–3 minutes.

### ✓ Verify

- <https://sunitha.sindhole.com> loads the site.
- Padlock icon in the browser is green (valid SSL).
- The site shows the same content as the `.vercel.app` URL.

If SSL fails, wait another 5 minutes — sometimes Vercel's cert
provisioning takes a couple of attempts. If it's stuck after 15 min,
double-check the DNS record (especially: grey cloud, correct CNAME
value).

---

## Phase 3 — Email (25 min)

Two services here:
- **Cloudflare Email Routing** → forwards `sunitha@sindhole.com` to
  the founder's Gmail. Free, no mailbox setup.
- **Resend** → sends lead notifications from the contact form.

### 3.1 — Cloudflare Email Routing

1. Cloudflare dashboard → `sindhole.com` zone → left sidebar →
   **Email** → **Email Routing** → **Get started** (or **Enable**).
2. Cloudflare offers to add MX + SPF records automatically. Click
   **Add records** → accept defaults.
3. **Destination addresses** tab → **Add destination** →
   `sunithags@gmail.com`. Cloudflare emails Gmail a verification
   link. Open Gmail, click the link.
4. **Routes** tab → **Custom address** → **Create address**:
   - Custom address: `sunitha`
   - Action: Send to
   - Destination: `sunithags@gmail.com` (the one you verified)
   - Save.
5. (Optional but recommended) Also enable the **Catch-all address**
   (anything `*@sindhole.com` not otherwise routed → same Gmail).
   Useful for typos like `sunithas@sindhole.com`.

### ✓ Verify

From another email (or your own personal address):

```
To: sunitha@sindhole.com
Subject: Email routing test
Body: Hello
```

Within a minute, this should appear in `sunithags@gmail.com` Inbox.
The "From" field will show the original sender's address.

### 3.2 — Resend signup + domain verification

1. <https://resend.com/signup> → sign in with GitHub.
2. **Domains** → **Add Domain** → `sindhole.com` → **Add**.
3. Resend shows several DNS records to add. The important ones:
   - **SPF** (TXT, name `@` or empty, value starts with `v=spf1 include:_spf.resend.com`)
   - **DKIM** (TXT, name like `resend._domainkey`, long value)
   - **MX** (optional, for bounce handling)

> ⚠️ **SPF merge gotcha**: Cloudflare Email Routing already added an
> SPF record in step 3.1. You can only have ONE SPF record per
> domain. **Do not add Resend's SPF as a separate record** — instead:

4. Cloudflare DNS panel → find the existing **TXT** record whose value
   starts with `v=spf1 include:_spf.mx.cloudflare.net ~all`.
5. **Edit** that record. Replace the value with the combined:

```
v=spf1 include:_spf.mx.cloudflare.net include:_spf.resend.com ~all
```

Both `include:` directives in one record. Save.

6. Now add the **DKIM** record from Resend as a NEW TXT record (it's
   a different name like `resend._domainkey`, so no conflict).
7. Back in Resend, click **Verify**. Wait up to 10 minutes for DNS
   propagation. Status should flip to "Verified" with a green check.

### 3.3 — Create the Resend API key

1. Resend → **API Keys** → **Create API Key**.
2. Name: `gslawfirm-production`
3. Permission: **Full access** (we'll narrow this later if needed).
4. Copy the key — **you won't see it again**. Save to your password
   manager.

### 3.4 — Add Resend env vars to Vercel

Vercel project → **Settings** → **Environment Variables**. Add:

```
RESEND_API_KEY       = re_xxxxxxxxxxxx (from step 3.3)
RESEND_FROM          = GS Law Firm <noreply@sunitha.sindhole.com>
LEAD_NOTIFY_TO       = sunithags@gmail.com
```

For each: scope to **Production** + **Preview**. Save.

Then redeploy: Vercel → **Deployments** → click the latest one → **⋯ menu** → **Redeploy**.

### ✓ Verify

1. Hit the live site's `/contact` form.
2. Fill in your real name + phone + email + a short message → Submit.
3. Within a minute, an email should arrive at `sunithags@gmail.com`:
   - **From**: `GS Law Firm <noreply@sunitha.sindhole.com>`
   - **Subject**: `New enquiry from <your name>`
   - The HTML body is BCI-quiet, oxblood-accented.
   - Hitting **Reply** in Gmail pre-fills the lead's email address. ✓

If it lands in Spam, mark it Not Spam — Gmail learns quickly. After
3–5 marks the sender is whitelisted.

**🎉 At this point the site is live with a working contact form.**
You can stop here if you want. Phases 4–6 are upgrades.

---

## Phase 4 — Spam protection (15 min, OPTIONAL)

The site already has a hidden honeypot field that catches the dumbest
bots. Phase 4 adds two more layers.

### 4.1 — Upstash Redis (rate limiting)

Without this, rate limiting works per-Vercel-lambda (resets when the
lambda goes cold). With Upstash, rate limiting is global and durable.

1. <https://upstash.com/signin> → sign in with GitHub.
2. **Redis** → **Create Database**.
3. Name: `gslawfirm-ratelimit`
4. Region: choose the one closest to your audience. For Hyderabad
   audience: **Mumbai (ap-south-1)**.
5. Type: **Regional** (the cheaper option; "Global" is overkill).
6. Eviction: **Default**.
7. **Create**.
8. On the database page, find the **REST API** section. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
9. Add both to Vercel env vars (Production + Preview). Redeploy.

### ✓ Verify

Submit the contact form 6 times in quick succession (within an hour).
The 6th submission should show **"You've sent several enquiries
recently. Please try again in an hour."**

### 4.2 — Cloudflare Turnstile (invisible captcha)

1. Cloudflare dashboard → **Turnstile** (left sidebar) → **Add Site**.
2. Site name: `gslawfirm`
3. Hostnames: `sunitha.sindhole.com`
4. Widget mode: **Managed** (Cloudflare decides if a challenge is
   shown; usually invisible).
5. **Create**.
6. Copy the **Site Key** and **Secret Key**.
7. Add to Vercel env vars:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (Production + Preview)
   - `TURNSTILE_SECRET_KEY` (Production + Preview)
8. Redeploy.

### ✓ Verify

- Open the live site's `/contact` page in a fresh browser session.
- Scroll to the form. You should NOT see a visible captcha widget
  most of the time (Turnstile is invisible for clean sessions).
- Submit the form → succeeds normally.

To test it's actually working: open DevTools → Network tab → block
`challenges.cloudflare.com` → submit the form. You should see the
error *"We couldn't verify this submission."*

---

## Phase 5 — Analytics + SEO (15 min)

### 5.1 — Cloudflare Web Analytics

Cookie-less, no consent banner needed. Free up to 100k pageviews/mo.

1. Cloudflare dashboard → **Web Analytics** (in the main sidebar,
   NOT inside the `sindhole.com` zone) → **Add a site**.
2. **Hostname**: `sunitha.sindhole.com`
3. Cloudflare gives you a JS snippet. Find the value of
   `data-cf-beacon` — it's a JSON object like `{"token":"abc123..."}`.
   Copy just the token string.
4. Add to Vercel env: `NEXT_PUBLIC_CF_ANALYTICS_TOKEN = <token>`.
5. Redeploy.

### ✓ Verify

- Load any page on the live site.
- Wait 30 seconds.
- Cloudflare Web Analytics dashboard → your site → you should see
  a Page View in real-time stats.

### 5.2 — Google Search Console

This is what actually drives SEO. Add the site so Google can index
your pages.

1. <https://search.google.com/search-console>
2. **Add property** → **URL prefix** → `https://sunitha.sindhole.com/` → Continue.
3. Google offers several verification methods. **Pick "HTML tag"** —
   easiest with our setup.
4. Copy the `content="..."` value from the meta tag Google shows.
5. Add to Vercel env: `NEXT_PUBLIC_GSC_VERIFICATION = <the value>` →
   redeploy.
6. After ~30 seconds, click **Verify** in Google's UI. Should succeed.
7. Once verified, go to **Sitemaps** in the left sidebar → enter
   `sitemap.xml` → Submit.
8. Wait 1–2 days for Google to crawl. You'll see indexed pages start
   appearing in the dashboard.

> No GA4 needed. Cloudflare Web Analytics gives every number a small
> practice will look at, and GSC is what actually surfaces search
> traffic. If you want GA4 later, set `NEXT_PUBLIC_GA_ID` env var —
> but build a DPDP-compliant consent banner first.

---

## Phase 6 — Google Business Profile (10 min — DO NOT SKIP)

**This is more valuable than the website for an advocate practice.**
A complete GBP listing puts the firm in the local 3-pack on Google
Maps and on "lawyers near me" searches. The website supplements it.

1. <https://business.google.com/create>
2. Business name: **GS Law Firm**
3. Category: Search "Legal services" → pick **Legal services**.
   Then add additional category: **Lawyer**.
4. Address:
   ```
   Sri Ramnagar Block C, Kondapur, Gachibowli,
   Hyderabad, Telangana 500084
   ```
   Google will geocode and ask you to drop the pin on the map.
5. Service area: enable, add **Kondapur, Gachibowli, Madhapur,
   Hi-Tech City, Jubilee Hills, Banjara Hills, Hyderabad**.
6. Phone: `+91 99638 47704`
7. Website: `https://sunitha.sindhole.com`
8. Verification: Google sends a postcard to the office address
   with a 6-digit code. Arrives in 5–14 days. Enter the code in the
   GBP dashboard to verify ownership.
9. While waiting, complete the profile:
   - **Hours**: Mon–Sat 10:00 AM – 6:00 PM, Sun closed.
   - **Services**: add each of the 5 practice areas as a service
     (Criminal Litigation, Civil & Property Disputes, etc.).
   - **Photos**: at minimum the logo (square JPEG in `public/`) and
     2–3 photos of the office exterior. Strongly recommended.
   - **Description**: 2–3 sentences. Use the firm's own description
     from `content/firm.ts`. **Do NOT use superlatives** (BCI rule).
   - **Attributes**: "Wheelchair accessible" if applicable, etc.

### Optional: link GBP to Search Console

Once GBP is verified and the website is in GSC, link them so they
share traffic and conversion data. Search Console → Settings →
Associations → Add → choose the GBP listing.

### ✓ Verify

- After postcard verification, search Google for `GS Law Firm
  Kondapur` (or `lawyer kondapur`). The listing should appear in
  the right-side knowledge panel and on Google Maps.
- This usually starts ranking within 2–4 weeks of verification.

---

## What's now true after all 6 phases

- ✅ Site is live at `https://sunitha.sindhole.com`
- ✅ Contact form sends real emails to `sunithags@gmail.com`
- ✅ Branded address `sunitha@sindhole.com` works (forwards to Gmail)
- ✅ Rate limit + Turnstile blocking spam
- ✅ Cloudflare Web Analytics counting visits (cookie-less)
- ✅ Google Search Console indexing pages
- ✅ Google Business Profile claimed and verified
- ✅ All three locales (`en`, `te`, `hi`) routable

---

## Going forward — operational tasks

### Reading leads

In Gmail, create a filter:

```
From: noreply@sunitha.sindhole.com
Apply label: GS Law Firm / Leads
Star: yes
```

So leads are easy to find and don't get buried.

### Replying to `sunitha@sindhole.com`

When someone emails `sunitha@sindhole.com`, it forwards to Gmail. If
the founder replies, the reply goes from `sunithags@gmail.com` —
**not** from the branded address. That's a Gmail limitation, not
Cloudflare's.

To fix this later (5-min job, can be done any time):
- Set up "Send mail as" in Gmail using Resend's SMTP relay
  (Resend dashboard → SMTP → get credentials → paste into Gmail
  Settings → Accounts → Send mail as).
- After that, replies appear to come from `sunitha@sindhole.com`.

### Sending native-translation work

The Telugu and Hindi message catalogues have ~30 long-form strings
marked `[TRANSLATION PENDING]`. They're concentrated in:
- `hero` (BCI-sensitive 3-liner)
- `intro.body`
- `approach.*` bodies
- `about.symbol` + `about.story`
- `privacy.*` bodies
- `disclaimerPage.*` paragraphs
- `contact.disclaim` and `footer.disclaim`

Find a Telugu/Hindi reviewer with **legal-content experience**
(important — BCI compliance is non-obvious). Common options:
- Upwork "legal translation" filtered by Indian-language native
- A junior advocate in Telangana willing to do it as a favour
- LawSikho's translation network

When the translations come back, paste them into `messages/te.json`
and `messages/hi.json` replacing each `[TRANSLATION PENDING]` line.
The placement is structural — same JSON keys, different values.
Commit the change and Vercel will auto-redeploy. No code changes
needed.

### Future domain move

When `gslawfirm.in` is procured, see [`DOMAIN_MIGRATION.md`](DOMAIN_MIGRATION.md).
Most of the migration is one env var + a 301 redirect rule. ~30 min
of work.

### When something breaks

1. **Site is down** — check Vercel deployment status. The most common
   cause is a failed build from a syntax error after editing JSON.
   Vercel's build logs will show exactly which file + line.
2. **Form submissions failing** — Vercel → Functions → `/api/lead`
   logs will show the actual error. Most often it's a Resend
   reputation drop (rare) or an Upstash quota hit (very rare).
3. **Emails going to Spam** — see [`BACKEND_SETUP.md`](BACKEND_SETUP.md)
   §"When SPF/DKIM start failing".
4. **Domain stops resolving** — Cloudflare DNS panel. The CNAME for
   `sunitha` should still be present and grey-clouded.

### What this site does NOT do (by design)

- **No live chat** — calls and form only. BCI rules on solicitation
  make live chat operationally awkward.
- **No client portal** — file sharing is via secure email after the
  initial enquiry, not via the public site.
- **No payment processing** — fee discussions happen offline.
- **No blog** — content marketing is a separate decision the founder
  can make later. The site has no `/blog` route today.

Adding any of the above is a separate scope, but the architecture
makes it straightforward to layer on.
