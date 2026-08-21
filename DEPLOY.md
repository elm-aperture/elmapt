# Deploying Elm Aperture

Two hosts, split along the only line that matters — how big the thing is and
how often it changes.

| | Where | Deployed from | Size |
| --- | --- | --- | --- |
| The website | Netlify | GitHub, on push | a few hundred KB |
| The photographs | Firebase Hosting | this machine, by hand | 207 MB |

Firebase serves one directory of directories full of `.webp` files. No app, no
index, no HTML. The site on Netlify reaches in for the frames it needs.

Both are free tiers and both stay free. Firebase Spark has no billing account
attached, so exceeding a limit stops serving until the window resets rather
than turning into a charge.

**No Firebase SDK is shipped.** Frames are ordinary URLs on an ordinary static
host — nothing Firebase-shaped reaches the browser.

---

## 1. Firebase — the photographs

The project's default Hosting site is the image host. There is no second site
to create and no deploy target to configure; `firebase.json` already points
`public` at `media/img`.

```sh
cd ~/Documents/WebDev/elmapt
pnpm dlx firebase-tools login
pnpm dlx firebase-tools use --add   # pick the project, alias it "default"

brew install webp                   # one time, for the re-encode step
./media/refresh.sh                  # builds media/img — 1,414 frames, 207 MB
pnpm dlx firebase-tools deploy --only hosting
```

That gives you `https://elmapt.web.app/` serving
`realestate/hotel/thumb/hotel_01_thumb.webp` and so on. The first deploy
uploads everything and takes a few minutes; after that only changed files
move.

`media/img` is git-ignored, so it never reaches GitHub and Netlify never sees
it. Photograph deploys are always from here.

## 2. Netlify — the website

`netlify.toml` is in the repo: build command, publish path, the SPA redirect
the router needs, and cache headers. Netlify detects `pnpm-lock.yaml` and runs
`pnpm install` at the repo root on its own.

Connect the GitHub repo, then set one environment variable — Site
configuration → Environment variables, or uncomment the line in
`netlify.toml`:

```
VITE_RES_BASE = https://elmapt.web.app
```

That is the entire integration between the two. Every frame URL, the hero
preload in `index.html`, and the coverage map are built from it, and the build
emits a `preconnect` to that origin so the connection to the image host is
open before the hero needs it.

A build without it **fails**, with a message saying so. Deliberate: a
photography site that deployed with no photographs would look fine right up
until someone opened it.

`elmapt.com` stays pointed wherever it is now until you move it. Deploy
previews and the `*.netlify.app` URL let you look at this without touching the
live site.

## Local production builds

```sh
cp apps/elmapt/.env.example apps/elmapt/.env.local   # set VITE_RES_BASE
pnpm --filter elmapt build
```

`pnpm --filter elmapt dev` needs none of that — it falls back to the
`public/res` symlink.

## The budget

Firebase Spark allows 10 GB stored and 360 MB transferred per day. The
photographs are 207 MB, so 2% of storage. Transfer is the one to watch:

| | |
| --- | --- |
| A category page | ~1 MB |
| A work page, 24 frames | ~1.2 MB |
| A full delivery, browsed end to end | ~15 MB |
| One frame opened in the viewer | ~250 KB |

Roughly 300 ordinary visits a day, or twenty people reading a full delivery
cover to cover. Frames cache for a week, so returning visitors cost almost
nothing. Netlify carries only the site, which is a rounding error against any
bandwidth allowance.

## Notes

- Frames cache for a week with a month of stale-while-revalidate — not
  `immutable`, because filenames get reused. `headshot_11.webp` is a
  placeholder today and a real portrait later, and a year-long immutable cache
  would leave returning visitors looking at the placeholder.
- The image host sends `Access-Control-Allow-Origin: *`. Not needed for
  `<img>`, which is not a cross-origin read, but it costs nothing and saves a
  puzzling afternoon if anything ever pulls a frame into a canvas.
- To pin pnpm for Netlify, add an exact `"packageManager": "pnpm@x.y.z"` to
  the root `package.json` — Corepack cannot take a range. Without it Netlify
  uses its own pnpm, which reads this lockfile fine.
- `apps/elmapt/public/res` — the symlink into the old repo — is what dev
  reads, and is excluded from every build. Nothing deployed comes from it.
