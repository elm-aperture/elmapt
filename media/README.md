# media/

`media/img/` is the photograph tree, and the whole of what Firebase Hosting
serves. No app, no index, no HTML — the Firebase site is this directory and
nothing else. The website itself is on Netlify and reaches in for the frames
it needs.

It is git-ignored. Two hundred megabytes has no business in a repository, and
keeping it out means Firebase deploys are a local operation from this machine
while site deploys happen from a GitHub push. The two never collide.

## Why it exists rather than deploying the source set

Ten files in `realestate/hotel/full` and `realestate/motel/full` were
unprocessed originals — five to six thousand pixels across, thirteen to twenty
megabytes each — while every one of their siblings is 1920px and a quarter of
a megabyte. Firebase's no-cost plan allows 360 MB of transfer a day. Three of
those opening in the viewer would have spent the entire budget.

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
pnpm dlx firebase-tools deploy --only hosting
```

Eventually the Python ingestion pipeline in `tools/` should write this
directory rather than `refresh.sh` copying into it.
