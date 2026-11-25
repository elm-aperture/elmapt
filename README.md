# Elm Aperture

The website for [Elm Aperture](https://elmapt.com), my photo and video studio in
Dallas–Fort Worth: real estate, portraits and events, with online booking.

**Live:** https://elmapt.com

React 19 · TypeScript · Vite 8 · pnpm workspaces · Vitest · Cloudflare Pages + Functions · Resend

---

## What's interesting here

**Photographs live outside the app.** The app ships about 80 KB of gzipped
JavaScript. The 1,500+ frames (about 200 MB of WebP) are a separate Cloudflare
Pages project behind `img.elmapt.com`, deployed from my machine. The site
deploys on every push to GitHub. A media deploy and a code deploy never touch
each other, and bandwidth is not metered. [`DEPLOY.md`](DEPLOY.md) explains the
split.

**Galleries are data, not markup.** Every gallery is an entry in
[`apps/elmapt/src/gallery/manifest.ts`](apps/elmapt/src/gallery/manifest.ts):
frame count, aspect ratio, which tiles span 2×2 or 3×3, and a caption per frame
(title, place, credit). The pages, the nav, the footer, the router table, the
booking form's service list, the sitemap and the share cards are all derived
from it.

- **Re-sequencing without renaming files.** `order` maps display position to
  source frame. Frames are cached for a week at the edge, so files are never
  renamed or overwritten: a new photo gets a new number and the gallery is
  reordered in data. Captions travel with the source frame; layout stays with
  the display position.
- **Unfinished work stays out of production.** In `pnpm dev`, galleries keep
  their placeholder frames so a layout can be judged at full size. A build runs
  `publish()`, which drops the placeholders, renumbers `order` and crop focus to
  match, centres any short last row, and hides galleries with nothing in them
  yet.

**Dense mosaic layout.** A CSS grid (`grid-auto-flow: row dense`) at 6/4/3
columns with spans per tile. Responsive `sizes` are worked out from each tile's
span, so a 3×3 tile asks for a bigger file than a 1×1. Images go straight from
a shimmer skeleton to the photo with no layout shift.

**Every page gets its own HTML.** It's a single-page app, but after the bundle
is written a Vite plugin loads the route table through `runnerImport` and
writes a static HTML shell per route, each with its own `<title>`, description,
canonical URL and a 1200×630 JPEG share card (cut by `tools/share-cards.py`,
since LinkedIn won't unfurl WebP). The same step emits `sitemap.xml`,
`robots.txt`, schema.org `ProfessionalService` data, and `_redirects` with real
301s for every URL from the old site.

**Booking that always reaches me.** The booking form posts to a Cloudflare Pages
Function ([`functions/api/booking.ts`](functions/api/booking.ts)) that validates
the inquiry, drops honeypot spam, and sends it through Resend with the visitor
as reply-to. If the function is unavailable or the send fails, the form falls
back to opening the visitor's mail app with the inquiry filled in, so it never
dead-ends. The parsing and the email body are shared, tested code.

**A home page that scrolls like a native sheet.** The About section is a panel
that slides up over the hero, driven by drag, wheel and keyboard. Each wheel
gesture is assigned to either the panel or its content when it starts, so a
trackpad flick and its momentum never fight over the same scroll. Photos below
the fold are held back until everything visible has loaded, then fetched
before anyone scrolls to them.

**A small router, written for this site.** `useSyncExternalStore` over the
History API, link capture, scroll restoration per history entry, and a typed
`Screen` union, so every page is checked exhaustively at compile time. It also
serves per-audience landing pages (`/for/hotels`, `/for/realtors`, ...) for ads
and outreach, kept out of search so they don't compete with the main pages.

**A shared design system.** [`packages/theme`](packages/theme) is plain CSS
custom properties (type, spacing, glass surfaces, motion), consumed by the app
as a workspace package. Respects `prefers-reduced-motion` throughout.

## Layout

```
apps/elmapt/              the site
  src/gallery/            manifest, URL builders, mosaic sizing
  src/router/             route table, history store
  src/site/               people, site facts, About copy, page metadata, build-time SEO
  src/pages/              one component per Screen kind
functions/api/booking.ts  booking form → email (Cloudflare Pages Function)
packages/theme/           shared CSS design system
media/                    photograph tree (git-ignored), deployed separately
tools/                    share-card cutter
```

## Run it

```sh
pnpm install
pnpm dev          # http://localhost:5173, images from img.elmapt.com
pnpm test         # Vitest
pnpm lint
pnpm build        # typecheck, bundle, per-route HTML, sitemap, redirects
```

The tests cover gallery data integrity, the `publish()` step, routing and
redirects, the generated SEO output, the booking function (including spam and
failure paths), and a render of every route. CI runs lint, tests and a full
build on every push.

## Deploy

The site is a Cloudflare Pages project that builds from `main`. Photographs
and share cards deploy by hand:

```sh
pnpm build && python3 tools/share-cards.py
(cd media && pnpm dlx wrangler pages deploy . --project-name=elmapt-media)
```

The booking function needs one secret on the Pages project:

```sh
pnpm dlx wrangler pages secret put RESEND_API_KEY --project-name=elmapt
```

Details, including the domain setup, are in [`DEPLOY.md`](DEPLOY.md).

Photography © Elm Aperture and the credited photographers. Code © Ryan McKevitt.
