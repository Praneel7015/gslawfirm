# Domain migration — `sunitha.sindhole.com` → `gslawfirm.in`

> **TL;DR**: when the firm procures `gslawfirm.in`, this is a ~30-minute
> change — one env var, a few DNS records, and a permanent redirect.
> No code changes. Read this whole document **before** you start, then
> work through the checklist at the bottom.

## What's already prepared for the move

The site was built with the eventual `gslawfirm.in` migration in mind.
Today, **every** canonical URL flows from a single environment variable:

```ts
// lib/site.ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sunitha.sindhole.com";
```

That value feeds:

- Page metadata (`<link rel="canonical">`, OG, Twitter cards)
- Sitemap entries (`sitemap.ts`)
- JSON-LD `LegalService` / `Person` / `Service` schemas
- All `hreflang` alternates across `en`, `te`, `hi`

So switching the canonical domain is **literally one env var change** in
the deploy host. The rest of this document is the bureaucracy around
that single line.

## What is NOT auto-migrated

Three things will need manual updates on the day of the cut-over:

1. **The public email on the site.** Currently `sunithags@gmail.com`
   (see `content/firm.ts → publicEmail`). The firm may want to switch
   to a branded address such as `hello@gslawfirm.in` once they have
   email at the new domain. Edit `content/firm.ts` and the four
   message catalog references (see "Public-email references" below).
2. **The Resend "from" address.** `RESEND_FROM` in `.env`. Change it
   from `noreply@sunitha.sindhole.com` to `noreply@gslawfirm.in` (or
   whatever the firm wants). The new domain must be verified in
   Resend first — same SPF/DKIM dance, just on a different zone.
3. **Google Business Profile + Google Search Console.** Both reference
   the live URL. Update the GBP listing's website field and add the
   new domain as a property in Search Console (keep the old one too —
   it'll keep receiving impressions during the redirect period).

## Step-by-step

Do these in order. Don't skip — the redirect step in particular has to
land **after** the new domain is serving content, or visitors will get
an infinite redirect loop.

### 1. Procure and verify the domain

- Register `gslawfirm.in` at a registrar of choice. `.in` domains can
  be registered directly through Cloudflare Registrar — strongly
  recommended since the rest of this stack is already on Cloudflare,
  Cloudflare charges at-cost for renewals, and you avoid DNS-provider
  juggling. (Cloudflare also supports `.in` TLDs as of 2024.)
- If registered elsewhere: at the registrar, set the nameservers to
  the Cloudflare nameservers shown when you "Add site" in the
  Cloudflare dashboard. Wait for Cloudflare to detect the change
  (usually < 1 hour).
- All DNS will live in Cloudflare just like `sindhole.com` does today,
  so the day-to-day operation is identical — see
  `docs/CLOUDFLARE_SETUP.md` for the record-by-record playbook.

### 2. Add the new domain to your deploy host

If deploying on **Vercel** (most likely):

1. Project settings → Domains → Add → `gslawfirm.in`
2. Add `www.gslawfirm.in` as well and pick one as primary (recommended:
   apex `gslawfirm.in` primary, `www` redirects to apex).
3. Vercel will give you DNS records:
   - **Apex**: `A` → `76.76.21.21`, or (with Cloudflare's CNAME
     flattening, supported for apex) `CNAME` → `cname.vercel-dns.com`
   - **www**: `CNAME` → `cname.vercel-dns.com`
4. Add the records in the Cloudflare DNS panel for the new zone.
   **⚠️ Set proxy status to "DNS only" (grey cloud) — orange cloud
   breaks Vercel SSL renewal.** Same gotcha as the current
   `sunitha.sindhole.com` setup.
5. Wait for the SSL certificate to provision (usually a few minutes).
6. Hit `https://gslawfirm.in` in a browser — you should see the site
   served from the new domain, **still** with `sunitha.sindhole.com`
   inside `<link rel="canonical">` (that's expected — we haven't
   flipped the env var yet).

### 3. Verify Resend on the new domain

- Resend dashboard → Domains → Add Domain → `gslawfirm.in`.
- Add the records Resend asks for (SPF `TXT`, DKIM `TXT`, optional
  MX for return-path). These live in the Cloudflare DNS panel
  alongside the records from step 2.
- **SPF merge**: if you set up Cloudflare Email Routing on this zone
  too (see Email Routing step in `docs/CLOUDFLARE_SETUP.md`), merge
  the SPF includes into a single record:
  `v=spf1 include:_spf.mx.cloudflare.net include:_spf.resend.com ~all`
  Same pattern as the current `sindhole.com` zone.
- Wait for Resend to mark the domain "Verified" (usually < 10 min).
- Keep `sunitha.sindhole.com` verified in Resend during the transition
  window — that way preview deploys and the old domain still send
  successfully if needed.

### 4. Flip the canonical env var

In the deploy host's environment settings:

```
NEXT_PUBLIC_SITE_URL=https://gslawfirm.in
```

Redeploy. After the deploy lands, every page's `<link rel="canonical">`,
every OG image URL, every sitemap entry and every JSON-LD `@id` will
emit the new domain.

### 5. Update the Resend "from" address

Same environment settings, change:

```
RESEND_FROM=GS Law Firm <noreply@gslawfirm.in>
```

Redeploy. New leads will now arrive from the branded address.

### 6. Add a permanent (301) redirect

Now we make `sunitha.sindhole.com` redirect to `gslawfirm.in`. **Two
options**, pick one:

**Option A — Vercel-level redirect (recommended).**
Add this to `next.config.ts`:

```ts
async redirects() {
  return [
    {
      source: "/:path*",
      has: [{ type: "host", value: "sunitha.sindhole.com" }],
      destination: "https://gslawfirm.in/:path*",
      permanent: true,
    },
  ];
}
```

This is a 308 (preserves method); Vercel treats it as a permanent
redirect for SEO purposes. Keep `sunitha.sindhole.com` attached to the
project so the redirect actually fires.

**Option B — Cloudflare-level redirect.** Decouples the old domain
from the deploy entirely; the request never reaches Vercel.

- Cloudflare zone `sindhole.com` → Rules → Redirect Rules → Create.
- When: Hostname equals `sunitha.sindhole.com`
- Then: Static redirect → URL → `https://gslawfirm.in${URI Path}`
  → Status: 301 (Permanent Redirect)
- Preserve query string: Yes
- Save and deploy. Test with `curl -I https://sunitha.sindhole.com/practice`
  — should return `HTTP/2 301` with `location: https://gslawfirm.in/practice`.

After picking either option, you can also remove `sunitha.sindhole.com`
from the Vercel domains list (Option B doesn't need it attached).

Either way, test by hitting `https://sunitha.sindhole.com/practice` in
a clean browser — it must land at `https://gslawfirm.in/practice` with
a 301/308 status.

### 7. Search Console + Analytics

- **Google Search Console**:
  1. Add `https://gslawfirm.in` as a new property.
  2. Verify (the env-driven `<meta>` tag does this automatically once
     you put the new code into `NEXT_PUBLIC_GSC_VERIFICATION` — but
     you only have one slot, so you may want to verify via DNS TXT for
     the new domain so the old one keeps working).
  3. Use the "Change of Address" tool to tell Google about the move.
     This passes most of the old domain's ranking signal to the new
     one. Don't skip this — it's the single most valuable SEO step.
  4. Submit the new sitemap: `https://gslawfirm.in/sitemap.xml`.
- **Google Analytics**: no changes needed — GA tracks by property ID,
  not URL. Just make sure traffic continues to flow.

### 8. Update Google Business Profile

The Business Profile is, by a wide margin, more valuable than the
website itself for a local advocate practice. Update the Website field
on the profile to point at `https://gslawfirm.in`. Existing reviews
and the map pin stay intact.

### 9. Update outbound links

A handful of places reference the public email and the public URL
outside the codebase — update each:

- LinkedIn profile bio (`linkedin.com/in/sunitha-sindhole-074939212`)
- WhatsApp Business profile, if used
- Letterhead, business cards, email signature
- Any newspaper / directory listings already filed

### 10. Decommission timeline

Keep `sunitha.sindhole.com` redirecting for **at least 12 months**
after the cut-over — ideally permanently. Search engines respect 301
redirects but visitors with bookmarked old URLs may take months to
update. There's no downside to leaving the redirect in place forever.

## Public-email references

When/if the firm switches `publicEmail` from `sunitha@sindhole.com` to
a branded address at the new domain (e.g. `hello@gslawfirm.in`), the
following files need updating in one commit:

- `content/firm.ts` — `publicEmail` field
- `messages/en.json` — four places: `contact.errors.generic`,
  `privacy.sections.rights.body`, `privacy.sections.contact.body`,
  `disclaimerPage.p5`
- `messages/te.json` — `contact.errors.generic` (others are still
  pending translation)
- `messages/hi.json` — `contact.errors.generic`

A `git grep "sunitha@sindhole"` will catch all of them.

Don't forget to:

1. Add a new Cloudflare Email Routing rule for the new address on the
   `gslawfirm.in` zone (see `docs/CLOUDFLARE_SETUP.md` §Email Routing).
   Either forward to `sunithags@gmail.com` (same as today) or to a real
   mailbox if the firm has provisioned one.
2. Re-verify Resend on the new domain — fresh SPF + DKIM TXT records.
3. Update `RESEND_FROM` to the new domain so SPF/DKIM alignment stays
   correct.

## Pre-flight checklist

Before you start the cut-over:

- [ ] `gslawfirm.in` registered and DNS pointed correctly
- [ ] Email at the new domain works (test send/receive)
- [ ] Resend domain verified
- [ ] Vercel domain added and serving with valid SSL
- [ ] Backup of current deployment (Vercel keeps these automatically)
- [ ] A window of low traffic (Indian advocate sites tend to be busiest
      Tue–Thu mornings; do this on a Sunday)
- [ ] You have access to: registrar, DNS, deploy host, Resend, GSC, GA,
      Google Business Profile

## Rollback plan

If something goes wrong after the cut-over:

1. Set `NEXT_PUBLIC_SITE_URL` back to `https://sunitha.sindhole.com`
   and redeploy. Canonical URLs return to the old domain immediately.
2. Disable the 301 redirect in `next.config.ts` (comment it out and
   redeploy).
3. Keep both domains attached to the deploy. Both will serve the same
   content while you debug.

Most issues during a domain move are DNS propagation (give it 24 hours)
or SSL provisioning (give it 10 minutes after the DNS lands). Real
breakage is rare.
