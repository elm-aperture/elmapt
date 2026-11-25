import { afterEach, describe, expect, it, vi } from "vitest";
import { onRequestPost } from "../../../../functions/api/booking";

const post = (body: unknown) =>
  new Request("https://elmapt.com/api/booking", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const KEY = { RESEND_API_KEY: "re_test" };

afterEach(() => vi.unstubAllGlobals());

describe("POST /api/booking", () => {
  it("answers 503 with no API key, so the page falls back to mail", async () => {
    const res = await onRequestPost({ request: post({ email: "a@b.co" }), env: {} });
    expect(res.status).toBe(503);
  });

  it("rejects a body that isn't JSON", async () => {
    const res = await onRequestPost({ request: post("nope"), env: KEY });
    expect(res.status).toBe(400);
  });

  it("needs a way to reply", async () => {
    const res = await onRequestPost({ request: post({ name: "Dana" }), env: KEY });
    expect(res.status).toBe(422);
  });

  it("quietly drops honeypot hits without sending", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    const res = await onRequestPost({
      request: post({ email: "a@b.co", website: "spam.biz" }),
      env: KEY,
    });
    expect(res.status).toBe(200);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("sends through Resend with the visitor as reply-to", async () => {
    const fetcher = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetcher);
    const res = await onRequestPost({
      request: post({ name: "Dana", email: "dana@x.co", kind: "Headshots" }),
      env: KEY,
    });
    expect(res.status).toBe(200);
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const sent = JSON.parse(String(init.body));
    expect(sent.to).toEqual(["rain@elmapt.com"]);
    expect(sent.reply_to).toBe("dana@x.co");
    expect(sent.subject).toBe("Headshots inquiry from Dana");
  });

  it("reports a failed send so the page can fall back", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 500 })));
    const res = await onRequestPost({ request: post({ phone: "555" }), env: KEY });
    expect(res.status).toBe(502);
  });
});
