import { describe, expect, it } from "vitest";
import { clip } from "./meta";
import {
  absolute,
  cardName,
  pages,
  redirectsFile,
  renderShell,
  sitemap,
  structuredData,
} from "./seo";
import type { Page } from "./seo";

const SHELL = `<html><head>
    <meta
      name="description"
      content="old"
    />
    <title>Old</title>
    <meta property="og:title" content="old" />
    <meta property="og:description" content="old" />
    <meta property="og:image" content="old" />
    <meta property="og:image:type" content="image/webp" />
    <meta property="og:image:width" content="1" />
    <meta property="og:image:height" content="1" />
    <meta property="og:image:alt" content="old" />
  </head><body></body></html>`;

const page: Page = {
  path: "/portrait/headshot",
  title: `Headshots & "more" – Elm Aperture`,
  description: "Portraits <for> work.",
  image: { src: "x.webp", width: 1920, height: 2880, alt: "A face" },
};

describe("renderShell", () => {
  const html = renderShell(SHELL, page);

  it("rewrites the title and escapes it", () => {
    expect(html).toContain(
      `<title>Headshots &amp; "more" – Elm Aperture</title>`,
    );
  });

  it("rewrites description and share card", () => {
    expect(html).toContain('content="Portraits &lt;for&gt; work."');
    expect(html).toContain(
      'property="og:title" content="Headshots &amp; &quot;more&quot; – Elm Aperture"',
    );
    expect(html).toContain('og/portrait-headshot.jpg"');
    expect(html).toContain('property="og:image:type" content="image/jpeg"');
    expect(html).toContain('property="og:image:width" content="1200"');
    expect(html).not.toContain('content="old"');
  });

  it("adds a canonical link for inner pages only", () => {
    expect(html).toContain(
      `<link rel="canonical" href="${absolute(page.path)}" />`,
    );
    expect(renderShell(SHELL, { ...page, path: "/" })).not.toContain("canonical");
  });

  it("refuses a shell missing a tag it must rewrite", () => {
    expect(() => renderShell("<head></head>", page)).toThrow(/og:title|description/);
  });
});

describe("site files", () => {
  it("names share cards from the path", () => {
    expect(cardName("/")).toBe("home");
    expect(cardName("/realestate/hotel/holiday-inn-express")).toBe(
      "realestate-hotel-holiday-inn-express",
    );
  });

  it("lists every indexable page in the sitemap, and no landing pages", () => {
    const list = pages();
    const xml = sitemap(list);
    expect(list.length).toBeGreaterThan(5);
    for (const entry of list) {
      const loc = `<loc>${absolute(entry.path)}</loc>`;
      if (entry.noindex) expect(xml).not.toContain(loc);
      else expect(xml).toContain(loc);
    }
    expect(list.some((entry) => entry.path.startsWith("/for/"))).toBe(true);
  });

  it("marks noindex pages for robots", () => {
    expect(renderShell(SHELL, { ...page, noindex: true })).toContain(
      '<meta name="robots" content="noindex" />',
    );
    expect(renderShell(SHELL, page)).not.toContain("noindex");
  });

  it("gives every page a title and a short description", () => {
    for (const entry of pages()) {
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeLessThanOrEqual(160);
    }
  });

  it("writes 301s for redirects", () => {
    expect(redirectsFile({ "/a": "/b" })).toBe("/a /b 301\n");
  });

  it("emits valid structured data", () => {
    const json = structuredData().replace(/^<script[^>]*>|<\/script>$/g, "");
    expect(JSON.parse(json)["@type"]).toBe("ProfessionalService");
  });
});

describe("clip", () => {
  it("leaves short text alone", () => {
    expect(clip("short")).toBe("short");
  });

  it("cuts long text on a word boundary", () => {
    const out = clip("word ".repeat(60), 40);
    expect(out.length).toBeLessThanOrEqual(40);
    expect(out.endsWith("word…")).toBe(true);
  });
});
