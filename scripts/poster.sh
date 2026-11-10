#!/usr/bin/env bash
# Poster pipeline (DESIGN.md §18, v7 task 6): src/assets/portraits/raw/<id>.png shot on a green
# screen -> cut-out layers for the poster shader plus a static poster fallback.
#
#   1. EXIF / metadata strip, auto-orient
#   2. chroma key on green dominance (g - max(r, b)), spill suppression (g := min(g, max(r, b)))
#   3. alpha: erode 1 px, feather 1.5 px
#   4. grayscale + CLAHE  -> <id>-gray-<w>    (shader input: luminance + alpha)
#      despilled colour   -> <id>-color-<w>   (colorReveal on hover)
#      5-tone poster with a 2 px paper rim -> <id>-poster-<w> (no WebGL / reduced motion)
#   5. AVIF + WebP at 900 / 1400 / 1800 px wide, never upscaled (larger widths are skipped)
#
# Usage: npm run poster [-- <id> ...]   (default: about stage; ids without a raw file are skipped)
# Env:   KEY_LOW / KEY_HIGH  green-dominance range that maps to opaque -> transparent (default 6% / 20%)
#        RAW_DIR / OUT_DIR   override the folders (used for tests outside the repo)
set -euo pipefail
shopt -s nullglob

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAW="${RAW_DIR:-$ROOT/src/assets/portraits/raw}"
OUT="${OUT_DIR:-$ROOT/src/assets/portraits/poster}"
KEY_LOW="${KEY_LOW:-6%}"
KEY_HIGH="${KEY_HIGH:-20%}"
WIDTHS=(900 1400 1800)
# The five tones of the poster, dark to light (DESIGN.md §2).
TONES=('#121212' '#2a2a2a' '#555555' '#8a8a8a' '#f4f4f0')
PAPER='#f4f4f0'

if ! command -v magick >/dev/null; then
  echo "error: magick not found (ImageMagick 7 with AVIF + WebP), see $RAW/README.md" >&2
  exit 1
fi

ids=("$@")
[ "${#ids[@]}" -eq 0 ] && ids=(about stage)
mkdir -p "$OUT"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# 5-colour palette image for -remap.
magick -size 1x1 "${TONES[@]/#/xc:}" +append "$WORK/palette.png"

for id in "${ids[@]}"; do
  src="$RAW/$id.png"
  if [ ! -f "$src" ]; then
    echo "$id: no $id.png in $RAW, keeping the placeholder"
    continue
  fi
  w="$WORK/$id"
  mkdir -p "$w"

  # 1. Metadata off, orientation baked in.
  magick "$src" -auto-orient -strip -alpha off -colorspace sRGB "$w/rgb.png"

  # 2. Green dominance g - max(r, b); spill suppression: green never exceeds max(r, b),
  #    which removes the green fringe in the hair.
  magick "$w/rgb.png" -fx 'max(0, g - max(r, b))' -colorspace gray "$w/green.png"
  magick "$w/rgb.png" -channel G -fx 'min(g, max(r, b))' +channel "$w/despill.png"

  # 3. Alpha: green -> transparent, erode 1 px, feather 1.5 px.
  magick "$w/green.png" -level "$KEY_LOW,$KEY_HIGH" -negate \
    -morphology Erode Disk:1 -blur 0x1.5 "$w/alpha.png"

  # Crop box from the alpha (with a 4 px margin for the paper rim).
  box="$(magick "$w/alpha.png" -threshold 10% -format '%@' info:)"
  magick "$w/despill.png" "$w/alpha.png" -compose copy_opacity -composite -crop "$box" +repage -compose over \
    -bordercolor none -border 4 "$w/color.png"

  # 4. Grayscale + CLAHE, alpha kept.
  magick "$w/color.png" \( +clone -alpha extract \) \( -clone 0 -alpha off -colorspace gray -clahe 25x25%+128+2.5 \) \
    -delete 0 +swap -compose copy_opacity -composite "$w/gray.png"

  # Static poster: 5 tones, no dither, darkened soft edge, 2 px paper rim behind the figure.
  magick "$w/gray.png" -alpha off +dither -remap "$WORK/palette.png" "$w/tones.png"
  magick "$w/gray.png" -alpha off -morphology EdgeOut Diamond:1 -blur 0x1 -level 5%,40% "$w/edge.png"
  magick "$w/tones.png" \( -size "$(magick identify -format '%wx%h' "$w/tones.png")" xc:'#121212' \) "$w/edge.png" \
    -compose over -composite "$w/toned.png"
  magick "$w/gray.png" -alpha extract "$w/a.png"
  magick "$w/a.png" -morphology Dilate Disk:2 "$w/rim.png"
  magick \( -size "$(magick identify -format '%wx%h' "$w/a.png")" xc:"$PAPER" "$w/rim.png" -compose copy_opacity -composite \) \
    \( "$w/toned.png" "$w/a.png" -compose copy_opacity -composite \) -compose over -composite "$w/poster.png"

  # 5. Sizes, never upscaled.
  srcw="$(magick identify -format '%w' "$w/gray.png")"
  written=()
  for width in "${WIDTHS[@]}"; do
    if [ "$width" -gt "$srcw" ]; then
      echo "$id: source is ${srcw}px wide, skipping ${width}px (no upscale)"
      continue
    fi
    for layer in gray color poster; do
      magick "$w/$layer.png" -strip -resize "${width}x" -depth 8 -quality 70 "$OUT/$id-$layer-$width.avif"
      magick "$w/$layer.png" -strip -resize "${width}x" -quality 80 -define webp:alpha-quality=95 "$OUT/$id-$layer-$width.webp"
    done
    written+=("$width")
  done
  if [ "${#written[@]}" -eq 0 ]; then
    echo "error: $id is narrower than ${WIDTHS[0]}px after the crop (${srcw}px); use a larger photo" >&2
    exit 1
  fi
  echo "$id: wrote gray / color / poster at ${written[*]} px (AVIF + WebP) to $OUT"
done
