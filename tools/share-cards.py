#!/usr/bin/env python3
"""Cut the 1200x630 share cards (og:image) for every page.

The site build writes media/share-cards.json, naming each page's lead frame.
This script crops each one out of media/img and writes media/img/og/*.jpg,
which then ship with the rest of the media:

    pnpm build
    python3 tools/share-cards.py
    (cd media && pnpm dlx wrangler pages deploy . --project-name=elmapt-media)

Needs Pillow with WebP support (pip3 install pillow). Cards that already
exist are skipped; pass --force to recut them all.
"""

import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "media" / "img"
LIST = ROOT / "media" / "share-cards.json"

# Upright frames are cropped from a band near the top so faces survive.
UPRIGHT_FOCUS = 0.28


def cut(source: Path, width: int, height: int, upright: bool) -> Image.Image:
    image = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
    focus = (0.5, UPRIGHT_FOCUS if upright else 0.5)
    return ImageOps.fit(image, (width, height), Image.LANCZOS, centering=focus)


def main() -> int:
    force = "--force" in sys.argv
    spec = json.loads(LIST.read_text())
    width, height = spec["size"]["width"], spec["size"]["height"]
    out_dir = MEDIA / "og"
    out_dir.mkdir(parents=True, exist_ok=True)

    missing = []
    for entry in spec["cards"]:
        target = out_dir / entry["card"]
        if target.exists() and not force:
            continue
        source = MEDIA / entry["source"]
        if not source.exists():
            missing.append(entry["source"])
            continue
        cut(source, width, height, entry["upright"]).save(
            target, "JPEG", quality=85, optimize=True, progressive=True
        )
        print(f"wrote og/{entry['card']}")

    for name in missing:
        print(f"missing source: media/img/{name}", file=sys.stderr)
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
