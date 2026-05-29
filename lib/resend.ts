import { Resend } from "resend";
import type { LeadInput } from "./lead-schema";
import { firm } from "@/content/firm";
import { SITE_URL } from "./site";

/**
 * Resend client (lazy, server-only). Sends the lead notification email
 * to LEAD_NOTIFY_TO. If RESEND_API_KEY is missing we log a warning and
 * skip the send (the API route still returns success so the user gets
 * feedback), that mode is for dev only.
 */

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM ?? `GS Law Firm <noreply@${new URL(SITE_URL).host}>`;
const notifyTo = process.env.LEAD_NOTIFY_TO ?? firm.email;

let client: Resend | null = null;
function getClient(): Resend | null {
  if (!apiKey) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

export type SendLeadResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string };

export async function sendLeadEmail(
  lead: LeadInput,
  meta: { ip: string; userAgent: string; submittedAt: Date },
): Promise<SendLeadResult> {
  const c = getClient();
  if (!c) {
    console.warn(
      "[resend] RESEND_API_KEY missing, skipping send. Lead was:",
      JSON.stringify({ lead, meta }, null, 2),
    );
    return { ok: true, id: null };
  }

  const subject = `New enquiry from ${lead.name}`;
  const html = renderLeadHtml(lead, meta);
  const text = renderLeadText(lead, meta);

  try {
    const r = await c.emails.send({
      from,
      to: notifyTo,
      replyTo: lead.email,
      subject,
      html,
      text,
    });
    if (r.error) {
      console.error("[resend] send error", r.error);
      return { ok: false, error: r.error.message ?? "send-failed" };
    }
    return { ok: true, id: r.data?.id ?? null };
  } catch (err) {
    console.error("[resend] send exception", err);
    return { ok: false, error: "send-exception" };
  }
}

// ── Templates ─────────────────────────────────────────────────────

function renderLeadText(
  lead: LeadInput,
  meta: { ip: string; userAgent: string; submittedAt: Date },
): string {
  return [
    `New enquiry from ${firm.name} website`,
    "",
    `Name:    ${lead.name}`,
    `Phone:   ${lead.phone}`,
    `Email:   ${lead.email}`,
    "",
    "Message:",
    lead.message,
    "",
    "── Meta ──",
    `Time:        ${meta.submittedAt.toISOString()}`,
    `IP:          ${meta.ip}`,
    `User-Agent:  ${meta.userAgent}`,
    `Site:        ${SITE_URL}`,
  ].join("\n");
}

function renderLeadHtml(
  lead: LeadInput,
  meta: { ip: string; userAgent: string; submittedAt: Date },
): string {
  const e = escapeHtml;
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>New enquiry, ${e(firm.name)}</title></head>
<body style="margin:0;padding:24px;background:#f6f6f6;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#0a0a0a;">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:32px;border:1px solid #e5e5e5;">
    <p style="font-family:'SFMono-Regular',Menlo,monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#6B0F1A;margin:0 0 24px;">
      ${e(firm.name)} · New enquiry
    </p>
    <h1 style="font-size:24px;line-height:1.2;margin:0 0 28px;font-weight:600;">${e(lead.name)}</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;width:100px;">Phone</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;"><a href="tel:${e(lead.phone)}" style="color:#0a0a0a;">${e(lead.phone)}</a></td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;"><a href="mailto:${e(lead.email)}" style="color:#0a0a0a;">${e(lead.email)}</a></td></tr>
    </table>
    <p style="font-family:'SFMono-Regular',Menlo,monospace;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:#666;margin:0 0 12px;">Message</p>
    <div style="white-space:pre-wrap;font-size:15px;line-height:1.6;padding:16px;background:#fafafa;border-left:2px solid #6B0F1A;">${e(lead.message)}</div>
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-family:'SFMono-Regular',Menlo,monospace;font-size:11px;color:#999;">
      <div>Submitted ${e(meta.submittedAt.toISOString())}</div>
      <div>IP ${e(meta.ip)}</div>
      <div>UA ${e(meta.userAgent.slice(0, 120))}</div>
    </div>
    <div style="margin-top:24px;font-size:11px;color:#999;font-family:'SFMono-Regular',Menlo,monospace;">
      Reply directly to this email to respond to ${e(lead.name)}.
    </div>
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
