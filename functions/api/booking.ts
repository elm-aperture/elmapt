/* POST /api/booking: the booking form, sent as an email through Resend.
 *
 * Cloudflare Pages runs this as a Function (files under /functions become
 * routes). Set these on the Pages project:
 *
 *   RESEND_API_KEY   secret, from resend.com
 *   BOOKING_FROM     optional, e.g. "Elm Aperture <booking@elmapt.com>";
 *                    must be on a domain verified in Resend
 *   BOOKING_TO       optional, defaults to rain@elmapt.com
 *
 * With no key set this answers 503 and the page falls back to opening the
 * visitor's mail app, so the form never dead-ends. */
import {
  composeInquiry,
  parseInquiry,
  replyAddress,
} from "../../apps/elmapt/src/site/inquiry";

type Env = {
  RESEND_API_KEY?: string;
  BOOKING_FROM?: string;
  BOOKING_TO?: string;
};

type Context = { request: Request; env: Env };

const DEFAULT_TO = "rain@elmapt.com";
const DEFAULT_FROM = "Elm Aperture <booking@elmapt.com>";

const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });

export async function onRequestPost({ request, env }: Context) {
  if (!env.RESEND_API_KEY) return reply(503, { ok: false, reason: "off" });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return reply(400, { ok: false, reason: "body" });
  }

  // Honeypot: a field people never see. Bots fill it; pretend it worked.
  if (
    typeof raw === "object" &&
    raw !== null &&
    typeof (raw as Record<string, unknown>).website === "string" &&
    (raw as Record<string, string>).website.trim() !== ""
  ) {
    return reply(200, { ok: true });
  }

  const inquiry = parseInquiry(raw);
  if (!inquiry) return reply(422, { ok: false, reason: "contact" });

  const { subject, body } = composeInquiry(inquiry);

  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.BOOKING_FROM || DEFAULT_FROM,
      to: [env.BOOKING_TO || DEFAULT_TO],
      reply_to: replyAddress(inquiry.email),
      subject,
      text: body,
    }),
  });

  if (!sent.ok) return reply(502, { ok: false, reason: "send" });
  return reply(200, { ok: true });
}
