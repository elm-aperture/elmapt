# media/

`media/` as a whole is what gets deployed to the `elmapt-media` Cloudflare
Pages project, and `media/img/` — becoming `/img` at that project's root — is
the photograph tree, and the whole of what actually serves behind
`img.elmapt.com`. The website is its own separate Pages project and reaches in
for the frames it needs.

`media/img/` is git-ignored. Two hundred megabytes has no business in a
repository, and keeping it out means media deploys are a local operation from
this machine while the site deploys from a GitHub push. The two never
collide.

## Why it exists rather than deploying the source set

Ten files in `realestate/hotel/full` and `realestate/motel/full` were
unprocessed originals — five to six thousand pixels across, thirteen to twenty
megabytes each — while every one of their siblings is 1920px and a quarter of
a megabyte. Serving those directly would have meant every visitor who opened
one in the viewer downloading tens of megabytes for a single frame.

`refresh.sh` re-encodes them to match the rest. 167 MB became 3 MB and the
pictures look the same.

The old repo is reference material and is never written to, so the corrected
set lives here instead.

| | frames | size |
| --- | --- | --- |
| source | 1,414 | 370 MB |
| deployed | 1,414 | 207 MB |

## Rebuilding it

```sh
brew install webp      # one time, for the re-encode step
./media/refresh.sh
```

Re-run after any new shoot; only changed files move. Then, from the repo root:

```sh
npx wrangler pages deploy media --project-name=elmapt-media
```

Deploy `media`, the parent directory, not `media/img` — that's what turns
`img/` into the `/img` prefix every frame URL depends on. `refresh.sh` and
this README ride along as harmless static files at the project root. See
`DEPLOY.md` for the one-time Pages project and custom domain setup.

Eventually the Python ingestion pipeline in `tools/` should write this
directory rather than `refresh.sh` copying into it.
