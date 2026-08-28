# Deploying Elm Aperture

Two Cloudflare Pages projects, split along the only line that matters — how
big the thing is and how often it changes.

| | Project | Deployed from | Size |
| --- | --- | --- | --- |
| The website | `elmapt` | GitHub, on push | a few hundred KB |
| The photographs | `elmapt-media` | this machine, by hand | 211 MB, 1,414 files |

The media project is a bare directory of directories full of `.webp` files.
No app, no index, no HTML. The website reaches in for the frames it needs.

## Why both are on Pages

Free Pages allows 20,000 files per project and 25 MiB per file. The photograph
set is 1,414 files with a largest file of 832 KB — 7% of the ceiling, with
room for roughly thirteen times the current library.

**Bandwidth is not metered.** That is the point of the move, more than any
particular attack: Firebase's no-cost plan stopped serving after 360 MB in a
day, which is about twenty people reading one delivery — or one bored person
with a download manager. There is no equivalent lever here. Traffic that would
have taken the images offline now just gets served.

Everything sits behind Cloudflare's DDoS protection by default, which needs no
configuration and costs nothing.

---

## 1. Prerequisite: move the domain

`elmapt.com` has to be on Cloudflare DNS — nameservers pointed at Cloudflare,
not just a CNAME. Everything below assumes the zone is active. This is the
one irreversible-feeling step; it is also what makes the rest free.

## 2. The photographs

```sh
cd ~/Documents/WebDev/elmapt
npx wrangler login

brew install webp          # one time, for the re-encode step
./media/refresh.sh         # builds media/img — 1,414 frames, 211 MB

npx wrangler pages project create elmapt-media --production-branch=main
npx wrangler pages deploy media --project-name=elmapt-media
```

**Deploy `media`, not `media/img`.** The trailing `/img` in every URL is not
a Pages default — it comes from `media/img/` becoming `/img/` at the project
root, the same way a future `media/video/` would become `/video/` beside it.
Deploying `media/img` directly drops that prefix and every frame 404s.
`media/README.md` and `media/refresh.sh` ride along as harmless static files
at the project root; nothing links to them and nothing serves them as HTML.

Then bind `img.elmapt.com` to that project — Pages → elmapt-media → Custom
domains. That hostname is what `MEDIA_HOST` in `apps/elmapt/vite.config.ts`
points at, so **bind it before the site build**, or swap `MEDIA_HOST` to
`https://elmapt-media.pages.dev/img` for the moment. It is one line either
way.

Verify:

```sh
curl -I https://img.elmapt.com/img/realestate/hotel/thumb/hotel_01_thumb.webp
```

`https://img.elmapt.com/` itself will 404 — correct. There is no index there,
only `/img` (and, later, whatever else lands beside it).

Re-run `refresh.sh` and `pages deploy` after any new shoot; only changed files
upload. `media/img` is git-ignored, so it never reaches GitHub and the site
build never sees it.

## 3. The website

Pages → Create → Connect to Git → the repo. Settings:

| | |
| --- | --- |
| Build command | `pnpm --filter elmapt build` |
| Build output directory | `apps/elmapt/dist` |
| Root directory | `/` |

`wrangler.toml` declares the output directory too, `.node-version` pins Node
22, and `_redirects` / `_headers` ship in the build output — the SPA rewrite
the router needs, and cache headers.

**Set no environment variables.** The image host is a committed constant. Then
bind `elmapt.com` under Custom domains.

## 4. Worth configuring, worth not

Two free settings that bear on hostile traffic, and one that can bite.

- **Hotlink Protection** (Scrape Shield) stops other sites embedding the
  photographs directly. Requests with no referer still pass, so a link pasted
  into a message still works. Same-zone referers pass too, which is why the
  images are on `img.elmapt.com` rather than a `.pages.dev` address.
- **Cache rules** on `img.elmapt.com` — the frames are already served with a
  week of `Cache-Control`, and Cloudflare's edge will hold them.
- **Bot Fight Mode**: leave it off. It challenges unknown user agents, and the
  primary use of this site is a link dropped into a text or a DM, where an
  unfurl bot has to fetch the page to produce a preview. Turning it on breaks
  exactly the thing the site is for.

## Local builds

```sh
pnpm --filter elmapt build     # uses MEDIA_HOST, same as CI
pnpm --filter elmapt dev       # falls back to the public/res symlink
```

Neither needs configuring. To aim a local build elsewhere, copy
`apps/elmapt/.env.example` to `.env.local` and set `VITE_IMG_BASE`.

## After cutover

Once the site and the images are both live on Cloudflare, these are dead and
can be deleted: `firebase.json`, `.firebaserc`, `.firebase/`, `netlify.toml`.
Leave them until then.
