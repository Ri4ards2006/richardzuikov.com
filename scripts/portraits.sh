#!/usr/bin/env bash
# Turns src/assets/portraits/raw/<id>.* into transparent 1400px and 700px tall WebPs.
set -euo pipefail
shopt -s nullglob

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/src/assets/portraits"
RAW="$OUT/raw"
IDS=(about work stack career contact)

for tool in rembg magick; do
  if ! command -v "$tool" >/dev/null; then
    echo "error: $tool not found, see $RAW/README.md" >&2
    exit 1
  fi
done

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

for id in "${IDS[@]}"; do
  files=("$RAW/$id".*)
  if [ "${#files[@]}" -eq 0 ]; then
    echo "$id: no photo, keeping silhouette fallback"
    continue
  fi
  if [ "${#files[@]}" -gt 1 ]; then
    echo "error: more than one photo for $id: ${files[*]}" >&2
    exit 1
  fi

  cutout="$WORK/$id.png"
  rembg i "${files[0]}" "$cutout"
  for height in 1400 700; do
    magick "$cutout" -strip -trim +repage -resize "x$height" \
      -quality 82 -define webp:alpha-quality=95 "$OUT/$id-$height.webp"
  done
  echo "$id: wrote $id-1400.webp and $id-700.webp"
done
