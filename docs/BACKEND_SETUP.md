# Backend setup — contact form pipeline

> The contact form posts to `/api/lead`. This document covers every
> backend service that endpoint touches: Resend (email), Upstash
> (rate limit), Turnstile (bot challenge), and the analytics decision.
> Read [`CLOUDFLARE_SETUP.md`](CLOUDFLARE_SETUP.md) first — it
> covers the DNS-side of the Resend domain verification.

## What `/api/lead` does

```
                ┌─ honeypot check (silent 200 if filled)
POST /api/lead ─┼─ zod validate (name / phone / email / message)
                ├─ rate limit (5 per hour per IP, Upstash → fallback)
                ├─ Turnstile verify (only if env configured)
                └─ Resend email → sunithags@gmail.com
```

No DB. The email **is** the lead record. If you ever need analytics on
conversion, Cloudflare Web Analytics (below) tracks pageview-to-submit
funnels without storing personal data.

## 1. Resend — outbound email

### Account + domain

Already partly documented in [`CLOUDFLARE_SETUP.md`](CLOUDFLARE_SETUP.md)
§5. Quick recap:

1. Sign up at [resend.com](https://resend.com). Free tier: 3,000
   emails/month, 100 emails/day.
2. Domains → Add Domain → `sindhole.com`.
3. Add the SPF + DKIM records to Cloudflare DNS. **Merge** SPF with
   Cloudflare Email Routing's record — see Cloudflare doc §5 step 4.
4. Click "Verify" in Resend.
5. API Keys → Create → copy.

### Env vars

```
RESEND_API_KEY      = re_xxxxxxxxxxxx
RESEND_FROM         = GS Law Firm <noreply@sunitha.sindhole.com>
LEAD_NOTIFY_TO      = sunithags@gmail.com
```

Set in Vercel → Project → Settings → Environment Variables → both
**Production** and **Preview**. Redeploy.

### What the email looks like

The `lib/resend.ts` template sends both plain-text and HTML. The HTML
version is BCI-quiet and oxblood-accented — looks like a system
notification, not a marketing email. The `replyTo` header is set to
the lead's address, so hitting Reply in Gmail responds directly to
them. Metadata block at the bottom shows IP / user-agent / timestamp.

### Dev mode

If `RESEND_API_KEY` is empty, `lib/resend.ts` logs the lead to console
(stringified) and returns success. The form still acknowledges. Useful
for local dev without consuming API quota.

### Failure handling

- Resend down or quota exhausted → API returns 502; user sees the
  "generic" error message asking them to call/email instead.
- Internal error string is **never** sent to the client — only logged
  server-side (build-prompt §8 compliance).

## 2. Upstash Redis — rate limiting

5 submissions per IP per hour. Sliding window.

### Account

1. Sign up at [upstash.com](https://upstash.com) (free tier: 10k
   commands/day, plenty).
2. Create database → choose region close to Vercel's edge (Singapore
   for India audience).
3. Open the database → "REST API" section.
4. Copy:
   - `UPSTASH_REDIS_REST_URL` (the `https://...upstash.io` URL)
   - `UPSTASH_REDIS_REST_TOKEN` (the long token string)

### Env vars

```
UPSTASH_REDIS_REST_URL    = https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN  = AXXXX...
```

Set in Vercel env. Redeploy.

### Fallback behaviour

If either env var is empty, `lib/rate-limit.ts` falls back to an
in-memory `Map` and logs a startup warning. The in-memory limiter is
correct **per Vercel lambda instance**, meaning a determined attacker
could route requests across lambdas to bypass it. Fine for dev and
low-traffic launch; add Upstash before turning marketing on.

### Tuning

To change the limit, edit `lib/rate-limit.ts` (`LIMIT = 5`,
`WINDOW = "1 h"`). Both Upstash and the in-memory limiter pick up the
new values on redeploy.

## 3. Cloudflare Turnstile — bot challenge (optional)

See [`CLOUDFLARE_SETUP.md`](CLOUDFLARE_SETUP.md) §7 for the
Cloudflare-dashboard side. Once you have the keys:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY = 0x4AAAAAAA...
TURNSTILE_SECRET_KEY           = 0x4AAAAAAA...
```

The widget mounts inside the contact form (only if the public key is
set). The server-side check in `lib/turnstile.ts` is **gated on the
secret key being set** — if you set the public key but forget the
secret, every submission will fail with `challenge` (this is by
design — we don't want to fail open on a half-configured deploy).

### Test plan

1. Submit the form on the live site with both keys configured. Should
   succeed quietly (managed challenge, usually invisible).
2. Open browser devtools → block `challenges.cloudflare.com`. Submit
   again. The form should display "We couldn't verify this submission"
   and the API should log `[lead] turnstile failed: missing-token`.

### Skipping it

To launch without Turnstile: leave both env vars empty. Honeypot +
Upstash rate limit are enough to block the common spam patterns on a
low-volume site.

## 4. Analytics decision

The site mounts two optional analytics scripts:

- **`components/analytics/CloudflareAnalytics.tsx`** — gated on
  `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`. Cookieless beacon.
- **`components/analytics/GoogleAnalytics.tsx`** — gated on
  `NEXT_PUBLIC_GA_ID`. GA4 with `anonymize_ip`.

### Recommendation

**Use Cloudflare Web Analytics as the primary.** Reasons:

| | Cloudflare Web Analytics | Google Analytics 4 |
|---|---|---|
| Cookies | None | Yes |
| Consent banner needed | No | Yes under DPDP 2023 (advisable) |
| Setup time | 2 min | 10 min + cookie banner build |
| Captures | Pageviews, top pages, referrers, country, device | Same, plus events, funnels, audiences |
| SEO impact | Indirect | Indirect |
| Price | Free up to 100k pageviews/mo | Free |

For a solo-advocate practice expecting tens-of-visits-a-day traffic
shape, Cloudflare gives every number the founder will ever look at.
GA4's funnel analysis is overkill, and the cookie banner it requires
under DPDP is a real UX cost.

**Google Search Console is separate** — that's the actual SEO tool,
and it's already in M7 plans (`NEXT_PUBLIC_GSC_VERIFICATION` env var).
Add GSC regardless of which analytics you choose.

### How to enable each

**Cloudflare Web Analytics** (recommended):

1. Cloudflare dashboard → Web Analytics → Add a Site.
2. Hostname: `sunitha.sindhole.com`.
3. Copy the token from the JS snippet (the value of `data-cf-beacon`'s
   `token` key).
4. Set in Vercel env: `NEXT_PUBLIC_CF_ANALYTICS_TOKEN=<token>`.
5. Redeploy. Beacon loads on every page.

**Google Analytics 4** (only if a consent banner is in place):

1. analytics.google.com → Admin → Create Property.
2. Add a "Web" data stream for `https://sunitha.sindhole.com`.
3. Copy the Measurement ID (`G-XXXXXXXXXX`).
4. Build a consent banner that gates the GA script until accept.
   (Out of scope here — there's no banner today.)
5. Set in Vercel env: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`.
6. Redeploy.

> Today the GA component will mount immediately if the env var is set
> — there is no consent gate. Don't fill in `NEXT_PUBLIC_GA_ID` until
> a consent banner is wired in. Cloudflare Analytics has no such
> requirement.

## End-to-end test plan

After all env vars are set and you've redeployed:

1. **Local validation test** — visit `/contact`, submit the form with
   an obviously bad phone number (`123`). Inline error shows
   immediately. No request is made. ✓
2. **Happy path** — submit with valid values. Within 1 minute, lead
   email arrives at `sunithags@gmail.com`. The "From" address shows
   `noreply@sunitha.sindhole.com`. Hitting Reply pre-fills the lead's
   email address. ✓
3. **Rate limit** — submit 6 times in quick succession. The 6th
   submission returns 429 and the form shows the "you've sent several
   recently" message. ✓
4. **Honeypot** — open devtools, fill the hidden `website` input,
   submit. API returns 200 silently, no email arrives. ✓
5. **Turnstile** (if configured) — see §3 test plan above. ✓
6. **Analytics** — load any page, wait 30 seconds, check the
   Cloudflare Web Analytics dashboard. Pageview should appear. ✓

## Operational tasks

### Reading leads

They're emails in `sunithags@gmail.com`. Create a Gmail filter:

```
From: noreply@sunitha.sindhole.com
Apply label: GS Law Firm / Leads
Star: yes
```

So they're easy to scan and don't get lost in everyday mail.

### When leads stop arriving

1. Vercel → Project → Logs → filter `/api/lead`. Look for 4xx/5xx in
   the last 24 hours.
2. Resend → Logs → check for delivery failures, bounces, or
   reputation drops.
3. mxtoolbox.com → verify SPF and DKIM still pass on `sindhole.com`.
4. Test the form yourself from a clean browser session.

90% of "form is broken" reports are: (a) reached the rate limit while
testing, (b) Gmail moved the lead to Spam, or (c) DNS record drift
(rare, but happens when someone "tidies up" Cloudflare DNS).

### Rotating the Resend API key

If the key is exposed (e.g. accidentally committed):

1. Resend → API Keys → revoke the old key.
2. Create a new key.
3. Update `RESEND_API_KEY` in Vercel env.
4. Redeploy.

No code changes needed. Same procedure for Upstash and Turnstile keys.
