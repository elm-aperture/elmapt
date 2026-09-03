#!/usr/bin/env bash
set -euo pipefail

SRC="${1:-$HOME/Documents/WebDev/elmaptbak/elmapt/public/res/img}"
DST="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/img"

LIMIT_BYTES=$((2 * 1024 * 1024))
WIDTH=1920
QUALITY=82

[ -d "$SRC" ] || { echo "No source set at $SRC" >&2; exit 1; }

command -v cwebp >/dev/null || {
  echo "cwebp not found — brew install webp" >&2
  exit 1
}

echo "Copying frames under 2 MB..."
rsync -a --max-size=2m "$SRC/" "$DST/"

echo "Re-encoding oversized originals..."
count=0
while IFS= read -r -d '' file; do
  rel="${file#"$SRC"/}"
  out="$DST/$rel"
  mkdir -p "$(dirname "$out")"
  cwebp -quiet -q "$QUALITY" -resize "$WIDTH" 0 "$file" -o "$out"
  before=$(( $(stat -f%z "$file" 2>/dev/null || stat -c%s "$file") / 1024 / 1024 ))
  after=$(( $(stat -f%z "$out" 2>/dev/null || stat -c%s "$out") / 1024 ))
  printf '  %-28s %3s MB -> %4s KB\n' "$(basename "$rel")" "$before" "$after"
  count=$((count + 1))
done < <(find "$SRC" -name '*.webp' -size +${LIMIT_BYTES}c -print0)

echo "Re-encoded $count file(s)."
du -sh "$DST"
