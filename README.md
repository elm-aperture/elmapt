# Elm Aperture

The website for [Elm Aperture](https://elmapt.com), my photo and video business in
Dallas–Fort Worth: real estate, portraits and events, plus booking.

**Live:** https://beta.elmapt.com (becomes elmapt.com at cutover)

React 19 · TypeScript · Vite 8 · pnpm workspaces · Vitest · Cloudflare Pages

---

## What's interesting here

**Photographs live outside the app.** The app ships about 80 KB of gzipped JavaScript.
The 1,400+ frames (about 200 MB of WebP) are a separate Cloudflare Pages project
behind `img.elmapt.com`, deployed from this machine. The site deploys from a
GitHub push. A media deploy and a code deploy never touch each other, and
bandwidth is not metered. [`DEPLOY.md`](DEPLOY.md) explains the split.

**Galleries are data, not markup.** Every gallery is an entry in
[`apps/elmapt/src/gallery/manifest.ts`](apps/elmapt/src/gallery/manifest.ts):
frame count, aspect ratio, which tiles span 2×2 or 3×3, and a plate per frame
(title, place, credit). Pages, the nav, the router table, the sitemap and the
share cards are all derived from it.

- **Re-sequencing without renaming files.** `order` maps display position to
  source frame. Frames are cached for a week at the edge, so files are never
  renamed or overwritten. A new photo gets a new number, and the gallery is
  reordered in data. Credits travel with the source frame, layout stays with
  the display position.
- **Unfinished work stays out of production.** In `pnpm dev`, galleries keep
  their placeholder frames so a layout can be judged at full size. A build runs
  `publish()`, which drops the placeholders, renumbers `order`, spans and crop
  focus to match, centres any short last row, and hides galleries with nothing
  in them yet.

**Dense mosaic layout.** A CSS grid (`grid-auto-flow: row dense`) at 6/4/3
columns with spans per tile. Responsive `sizes` are worked out from each tile's
span, so a 3×3 hero tile asks for a bigger file than a 1×1. Images go straight
from a shimmer skeleton to the photo with no layout shift (intrinsic
`width`/`height` on every `<img>`).

**Every page gets its own HTML.** It's a single-page app, but after the bundle
is written a Vite plugin loads the route table through `runnerImport` and
writes a static HTML shell per route. Each shell has its own `<title>`,
description, canonical URL and a 1200×630 JPEG share card (cut by
`tools/share-cards.py`, since LinkedIn won't unfurl WebP). The same step emits
`sitemap.xml`, `robots.txt`, schema.org `ProfessionalService` data, and
`_redirects` with real 301s for every legacy URL.

**A small router, written for this site.** `useSyncExternalStore` over the
History API, link capture, scroll restoration per history entry, and a typed
`Screen` union, so every page is checked exhaustively at compile time.

**A shared design system.** [`packages/theme`](packages/theme) is plain CSS
custom properties (type, spacing, glass surfaces, motion), consumed by the app
as a workspace package. Respects `prefers-reduced-motion` throughout.

## Layout

```
apps/elmapt/            the site
  src/gallery/          manifest, URL builders, mosaic sizing
  src/router/           route table, history store
  src/site/             people, site facts, page metadata, build-time SEO
  src/pages/            one component per Screen kind
packages/theme/         shared CSS design system
media/                  photograph tree (git-ignored), deployed separately
tools/                  share-card cutter
```

## Run it

```sh
pnpm install
pnpm dev          # http://localhost:5173, images from img.elmapt.com
pnpm test         # Vitest: manifest integrity, routing, SEO output, booking
pnpm lint
pnpm build        # typecheck, bundle, per-route HTML, sitemap
```

CI runs lint, tests and a full build on every push.

## Deploy

The site is a Cloudflare Pages project building from `main`. Photographs and
share cards deploy by hand:

```sh
pnpm build && python3 tools/share-cards.py
(cd media && pnpm dlx wrangler pages deploy . --project-name=elmapt-media)
```

Details, including the domain setup, are in [`DEPLOY.md`](DEPLOY.md).

## How it was built

This is a rebuild of the original site, which I wrote by hand in React. For
this version I worked with Claude (Anthropic) as a pair programmer. I set the
direction and the design calls, supplied all the content and photography, and
reviewed and shipped every change.

Photography © Elm Aperture and the credited photographers. Code © Ryan McKevitt.
