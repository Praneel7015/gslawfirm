# Cloudflare setup — `sindhole.com` zone

> The domain `sindhole.com` is registered with Cloudflare. This document
> covers every Cloudflare-side action needed to run the site at
> `sunitha.sindhole.com`, route email to `sunitha@sindhole.com`, and
> harden the deployment. Read it once, then walk through the checklist
> at the bottom.

## What Cloudflare gives us for free

We're going to use the following Cloudflare features — all on the free
plan, no upgrades needed:

| Feature | What we use it for |
|---|---|
| **DNS** | Records for Vercel deploy + Resend |
| **Email Routing** | `sunitha@sindhole.com` → `sunithags@gmail.com` (forwarding only — no mailbox provisioning) |
| **Universal SSL** | Free TLS at the edge (Vercel issues its own cert too — see "Proxy vs DNS-only" below) |
| **Bot Fight Mode** | Free spam reduction at the network level |
| **Turnstile** (optional) | hCaptcha alternative for the contact form — invisible challenge, no user-visible widget |
| **Analytics** (optional) | Privacy-respecting traffic stats — no cookies, no consent banner needed |

What we are **not** using:

- Cloudflare Pages (hosting) — we're using Vercel because the Next.js
  SSR + dynamic route surface is bigger than Pages's edge runtime
  handles cleanly today. Pages is a viable future migration.
- Cloudflare Workers — no edge-compute requirements today.
- Cloudflare R2 — no object storage requirements.

## ⚠️ Critical: proxy ON vs proxy OFF

Cloudflare DNS records have a toggle: **proxied** (orange cloud, traffic
flows through Cloudflare's network) vs **DNS only** (grey cloud, just
resolution). The choice matters here:

- **For records pointing at Vercel**: **GREY CLOUD (DNS only)**.
  Vercel manages its own TLS certificate and edge network — putting
  Cloudflare in front breaks automatic cert renewal and confuses
  Vercel's caching headers. Grey cloud is the supported configuration.
- **For Resend DKIM / SPF / verification TXT records**: doesn't matter
  (Cloudflare doesn't proxy TXT records).
- **For Cloudflare Email Routing MX records**: Cloudflare manages these
  itself. Leave at the default.

**Tl;dr**: when you add a record pointing at Vercel, **click the orange
cloud to turn it grey** before saving.

## Step-by-step

### 1. Confirm the zone

- Sign in to Cloudflare → select the `sindhole.com` zone.
- Confirm nameservers at the registrar still point at Cloudflare.
  (If you registered the domain through Cloudflare itself, this is
  automatic.)

### 2. Vercel: add the subdomain

- Vercel project → Domains → Add → `sunitha.sindhole.com`.
- Vercel will tell you to add one of:
  - **CNAME** record: `sunitha` → `cname.vercel-dns.com`
  - **A** record: `sunitha` → `76.76.21.21`
- Prefer the CNAME — it's the more flexible / future-proof option.

### 3. Cloudflare: add the DNS record

In the Cloudflare zone → DNS → Records → Add record:

```
Type:    CNAME
Name:    sunitha
Target:  cname.vercel-dns.com
Proxy:   DNS only   ← GREY CLOUD, NOT ORANGE
TTL:     Auto
```

Save. Within ~30 seconds the record propagates inside Cloudflare's
network; Vercel will detect it and start issuing the SSL cert. Hit
`https://sunitha.sindhole.com` after 1–2 minutes — you should see the
site live.

### 4. Cloudflare Email Routing — receive at `sunitha@sindhole.com`

This gives the firm a branded address (`sunitha@sindhole.com`) without
paying for a mailbox. Mail to that address gets forwarded to
`sunithags@gmail.com` and replies come from Gmail. Free, unlimited
forwarding addresses.

1. Cloudflare zone → Email → Email Routing → **Enable**.
2. Cloudflare will offer to add the required MX + SPF records
   automatically. **Click "Add records"** — accept the defaults.
3. Add a **Destination address**: `sunithags@gmail.com`. Cloudflare
   will send a verification email to Gmail — open it, click the link.
4. Add a **Custom address** routing rule:
   - From: `sunitha@sindhole.com`
   - Action: Send to → `sunithags@gmail.com`
5. (Optional but recommended) Add a **catch-all** rule too — any
   `*@sindhole.com` not otherwise routed forwards to the same Gmail.
   Useful for typos like `sunithas@sindhole.com`.

Test: from another address, send a note to `sunitha@sindhole.com`. It
should appear in `sunithags@gmail.com` within a minute, with the
original From address preserved.

> **Reply caveat**: when Sunitha replies from Gmail, the reply comes
> from `sunithags@gmail.com`, not `sunitha@sindhole.com` — this is a
> Gmail limitation, not Cloudflare's. If you want replies to come from
> the branded address too, set up **Gmail "Send mail as"** with an SMTP
> relay (Resend offers this; Cloudflare doesn't). Five-minute job, can
> be done later. Most users won't notice during the initial launch.

### 5. Resend: verify the sending domain

For the contact form's `/api/lead` route to send notification emails,
Resend needs to be authorised to send as `sunitha.sindhole.com`. We do
this with SPF + DKIM TXT records.

1. Sign up at [resend.com](https://resend.com). Free tier: 3,000
   emails/month, 100 emails/day. Plenty.
2. Resend dashboard → Domains → **Add Domain** → `sindhole.com`
   (use the apex, not the `sunitha` subdomain — DKIM is set on the
   apex zone and covers all subdomains).
3. Resend will display 3 records:
   - **SPF** (TXT @ root): `v=spf1 include:_spf.resend.com ~all`
   - **DKIM** (TXT, e.g. `resend._domainkey`): a long string
   - **MX** for return-path (optional but recommended): `send.resend.com`
4. **⚠️ SPF conflict warning**: Cloudflare Email Routing already
   added an SPF record in step 4. You can only have **one** SPF
   record per zone. **Merge them** — find the existing SPF record in
   Cloudflare and replace its content with the combined version:

   ```
   v=spf1 include:_spf.mx.cloudflare.net include:_spf.resend.com ~all
   ```

   Both `include:` directives in the same record. This authorises
   both Cloudflare (for receiving) and Resend (for sending) on the
   same zone. Save.
5. Add the DKIM TXT record. **Leave proxy off** (TXT records are
   always DNS-only — there's no proxy toggle anyway, but worth saying).
6. Wait 5–10 minutes for DNS propagation, then in Resend click
   **Verify**. Domain status should flip to "Verified".
7. Resend → API Keys → **Create API key** (full-access). Copy the
   key — you won't see it again. Save to your password manager.

### 6. Plug Resend into the deploy

In Vercel project → Settings → Environment Variables:

```
RESEND_API_KEY      = <the key from step 5.7>
RESEND_FROM         = GS Law Firm <noreply@sunitha.sindhole.com>
LEAD_NOTIFY_TO      = sunithags@gmail.com
```

Both production and preview environments. Redeploy.

> Note: the `noreply@` prefix in `RESEND_FROM` doesn't need to be a
> real mailbox — DKIM-signing only requires the **domain** to be
> verified, and the From address just needs to be on a verified domain.
> Replies to `noreply@sunitha.sindhole.com` will bounce, which is fine
> for a one-way notification. (If you'd rather replies route somewhere,
> add a Cloudflare Email Routing rule for `noreply@` too.)

### 7. (Optional) Cloudflare Turnstile — bot protection for the form

The contact form already has a hidden honeypot field and IP rate
limiting (M6). Turnstile adds a third layer: a managed challenge that
the browser solves in the background — usually invisible to humans, but
blocks scripted submissions cleanly.

1. Cloudflare dashboard → Turnstile → Add Site.
2. Hostname: `sunitha.sindhole.com` (add `gslawfirm.in` later when
   migrating).
3. Widget mode: **Managed** (Cloudflare decides whether to show a
   challenge; usually invisible).
4. Copy the **Site Key** and **Secret Key**.
5. Add to Vercel env:
   ```
   NEXT_PUBLIC_TURNSTILE_SITE_KEY = <site key>
   TURNSTILE_SECRET_KEY           = <secret key>
   ```
6. Tell me when you've done this and I'll wire it into `ContactForm`
   and the `/api/lead` route (M6 task — currently flagged as a future
   enhancement, not built in).

**Skip this for launch if you'd like to keep the form purely
keyboard-driven** — the honeypot + rate-limit combo is already
effective against the common spam patterns.

### 8. (Optional) Cloudflare Web Analytics

Cookie-less, no-consent-banner-needed traffic stats. Free up to 100k
pageviews/month, which is well beyond what an advocate's site will see.

1. Cloudflare dashboard → Web Analytics → Add a Site.
2. Hostname: `sunitha.sindhole.com`.
3. Copy the JS snippet (or, since the site is already on Cloudflare
   DNS, choose the **automatic injection** option — no code changes).
4. Wait 24 hours for first data to appear.

> Decision point: GA4 vs Cloudflare Web Analytics. GA4 is the industry
> default and integrates with Search Console / Ads if those are ever
> used. Cloudflare's is privacy-friendlier and simpler. You can run
> both. The build-prompt assumes GA4 via `NEXT_PUBLIC_GA_ID`; that's
> still the recommended primary.

### 9. (Optional) Bot Fight Mode

Cloudflare zone → Security → Bots → **Bot Fight Mode: On**. Free,
heuristic-based, and runs even on grey-cloud subdomains because it's
applied at the DNS resolution layer. Catches scrapers, crawlers, and
basic exploit probes. No downside on the free plan.

## Day-to-day operations

### Adding a new branded email address

If the firm ever wants e.g. `office@sindhole.com`:

1. Cloudflare → Email → Routing → Routes → Add address.
2. From: `office@sindhole.com` → Action: Send to → existing Gmail
   destination.
3. Save. Mail starts flowing immediately. No DNS changes needed.

### Checking deliverability

After M6 ships, the easiest end-to-end test:

1. Hit the live site's contact form, submit a real lead.
2. Resend dashboard → Logs → look for the outbound message.
3. Gmail (`sunithags@gmail.com`) → confirm it landed in Inbox, not
   Spam. If Spam: check Resend's "Reputation" tab — it'll tell you if
   SPF or DKIM are misaligned.

### When SPF/DKIM start failing

This is the most common silent breakage. Symptoms: leads stop arriving,
or land in Spam. To debug:

1. [mxtoolbox.com/spf.aspx](https://mxtoolbox.com/spf.aspx) → check
   `sindhole.com`. Should pass with both `_spf.mx.cloudflare.net` and
   `_spf.resend.com` showing.
2. [mxtoolbox.com/dkim.aspx](https://mxtoolbox.com/dkim.aspx) →
   selector is `resend` → domain `sindhole.com`. Should show a valid
   public key.
3. If either fails, check the Cloudflare DNS panel for typos in the
   TXT records, or contact Resend support (usually responsive within
   a day).

## Pre-flight checklist

Before declaring Cloudflare setup done:

- [ ] `sunitha.sindhole.com` CNAME added in Cloudflare, **grey cloud**
- [ ] Site loads at `https://sunitha.sindhole.com` with valid SSL
- [ ] Email Routing enabled, MX records added by Cloudflare
- [ ] Destination address `sunithags@gmail.com` verified
- [ ] Routing rule `sunitha@sindhole.com` → Gmail in place
- [ ] Test email sent and received within 1 minute
- [ ] Resend domain `sindhole.com` shows "Verified"
- [ ] SPF record merged (Cloudflare + Resend in one TXT)
- [ ] DKIM TXT record present
- [ ] `RESEND_API_KEY`, `RESEND_FROM`, `LEAD_NOTIFY_TO` set in Vercel
- [ ] (Optional) Turnstile keys in Vercel env if using it
- [ ] (Optional) Web Analytics enabled
- [ ] (Optional) Bot Fight Mode on
