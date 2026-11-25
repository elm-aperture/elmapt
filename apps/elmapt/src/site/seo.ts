/* Build-time only. The Vite config loads this module after the client bundle
 * is written and uses it to emit per-route HTML shells, sitemap.xml,
 * robots.txt and _redirects. Nothing here is imported by the app. */
import { IMG_BASE } from "../gallery/sources";
import { redirects } from "../router/routes";
import { pages } from "./meta";
import type { Page } from "./meta";
import { site } from "./site";

export { pages, redirects, site };
export type { Page };

const escapeAttr = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeText = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Share cards are 1200x630 JPEGs on the image host, one per page, cut from
 * each page's lead frame by tools/share-cards.py. JPEG rather than WebP
 * because LinkedIn and some messengers still won't unfurl a WebP. */
export const CARD = { width: 1200, height: 630 } as const;

export const cardName = (path: string) =>
  path === "/" ? "home" : path.slice(1).replace(/\//g, "-");

export const cardUrl = (path: string) => `${IMG_BASE}/og/${cardName(path)}.jpg`;

export const absolute = (path: string) =>
  path === "/" ? `${site.url}/` : `${site.url}${path}`;

function setMeta(html: string, attr: "name" | "property", key: string, value: string) {
  const pattern = new RegExp(
    `(<meta\\s+${attr}="${key.replace(/[:.]/g, "\\$&")}"\\s+content=")[^"]*(")`,
  );
  if (!pattern.test(html)) {
    throw new Error(`index.html has no <meta ${attr}="${key}"> to rewrite`);
  }
  return html.replace(pattern, `$1${escapeAttr(value)}$2`);
}

export function structuredData(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: absolute("/"),
    image: site.hero.frames[0].src,
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.tel,
    foundingDate: String(site.founded),
    areaServed: site.area,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dallas",
      addressRegion: "TX",
      addressCountry: "US",
    },
    sameAs: [site.instagram.href],
  };
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

/** Add the structured-data block. Applied to every HTML file. */
export function withStructuredData(html: string): string {
  return html.replace("</head>", `    ${structuredData()}\n  </head>`);
}

/** Rewrite the built index.html into the shell for one route: its own title,
 * description, share card and canonical URL. The app itself is unchanged. */
export function renderShell(html: string, page: Page): string {
  const url = absolute(page.path);
  const home = page.path === "/";
  let out = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeText(page.title)}</title>`,
  );
  out = setMeta(out, "name", "description", page.description);
  out = setMeta(out, "property", "og:title", page.title);
  out = setMeta(out, "property", "og:description", page.description);
  out = setMeta(out, "property", "og:image", cardUrl(page.path));
  out = setMeta(out, "property", "og:image:type", "image/jpeg");
  out = setMeta(out, "property", "og:image:width", String(CARD.width));
  out = setMeta(out, "property", "og:image:height", String(CARD.height));
  out = setMeta(out, "property", "og:image:alt", page.image.alt);

  if (page.noindex) {
    out = out.replace(
      "</head>",
      `    <meta name="robots" content="noindex" />\n  </head>`,
    );
  }

  /* index.html also answers every unknown address, so it carries no
   * canonical of its own. */
  const canonical = home
    ? ""
    : `    <link rel="canonical" href="${escapeAttr(url)}" />\n`;
  return out.replace(
    "</head>",
    `${canonical}    <meta property="og:url" content="${escapeAttr(url)}" />\n  </head>`,
  );
}

/** Which frame each share card is cut from, read by tools/share-cards.py. */
export function shareCards(list: readonly Page[]): string {
  const cards = list.map((page) => ({
    card: `${cardName(page.path)}.jpg`,
    source: page.image.src.startsWith(`${IMG_BASE}/`)
      ? page.image.src.slice(IMG_BASE.length + 1)
      : page.image.src,
    upright: page.image.height > page.image.width,
  }));
  return `${JSON.stringify({ size: CARD, cards }, null, 2)}\n`;
}

export function sitemap(list: readonly Page[]): string {
  const urls = list
    .filter((page) => !page.noindex)
    .map((page) => `  <url><loc>${escapeText(absolute(page.path))}</loc></url>`)
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
}

export function robots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${absolute("/sitemap.xml")}\n`;
}

/** Cloudflare Pages _redirects. Old addresses get a real 301 so search
 * engines and old links move over; everything else falls through to the
 * static files, and Pages serves index.html for anything unmatched. */
export function redirectsFile(table: Readonly<Record<string, string>>): string {
  return (
    Object.entries(table)
      .map(([from, to]) => `${from} ${to} 301`)
      .join("\n") + "\n"
  );
}
