#!/usr/bin/env bash
# Turns src/assets/portraits/raw/<id>.* into transparent 1400px and 700px tall WebPs.
#   <id>.png            cream-on-black ink art: luminance becomes alpha (black -> transparent), no cutout needed.
#   <id>.jpg/.jpeg/...  photo: the background is removed with rembg.
set -euo pipefail
shopt -s nullglob

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/src/assets/portraits"
RAW="$OUT/raw"
IDS=(stage about work stack career contact)
# Luminance levels for the alpha mask: below LOW is fully transparent, above HIGH fully opaque.
# HIGH is well under white, so mid-grey ink stays solid enough for the stage shader (it drops alpha < 0.5).
INK_LOW="${INK_LOW:-6%}"
INK_HIGH="${INK_HIGH:-70%}"

if ! command -v magick >/dev/null; then
  echo "error: magick not found, see $RAW/README.md" >&2
  exit 1
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

for id in "${IDS[@]}"; do
  files=("$RAW/$id".*)
  if [ "${#files[@]}" -eq 0 ]; then
    echo "$id: no file, keeping silhouette fallback"
    continue
  fi
  if [ "${#files[@]}" -gt 1 ]; then
    echo "error: more than one file for $id: ${files[*]}" >&2
    exit 1
  fi

  src="${files[0]}"
  cutout="$WORK/$id.png"
  case "${src,,}" in
    *.png)
      # Ink art: keep the colours, take the alpha from the luminance.
      magick "$src" -alpha off \
        \( +clone -colorspace gray -level "$INK_LOW,$INK_HIGH" \) \
        -compose copy_opacity -composite "$cutout"
      mode="ink, luminance to alpha"
      ;;
    *)
      if ! command -v rembg >/dev/null; then
        echo "error: rembg not found (needed for photos), see $RAW/README.md" >&2
        exit 1
      fi
      rembg i "$src" "$cutout"
      mode="photo, rembg"
      ;;
  esac
  for height in 1400 700; do
    magick "$cutout" -strip -trim +repage -resize "x$height" \
      -quality 82 -define webp:alpha-quality=95 "$OUT/$id-$height.webp"
  done
  echo "$id ($mode): wrote $id-1400.webp and $id-700.webp"
done
